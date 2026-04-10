'use client';

import { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  destinations?: any[];
  onDestinationSelect?: (destination: any) => void;
  travelMode?: 'driving' | 'walking' | 'cycling' | 'train' | 'plane';
  userLocation?: { lat: number, lng: number } | null;
  clickedLocation?: { lat: number, lng: number } | null;
  onRouteCalculated?: (route: any) => void;
  isDarkMode?: boolean;
}

// Controller component that fits bounds dynamically based on the current polyline
const BoundsController = ({ lineString }: { lineString: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (lineString.length > 1) {
      const bounds = L.latLngBounds(lineString);
      map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1.5 });
    }
  }, [lineString, map]);
  return null;
};

export default function MapComponentInner({ 
  destinations = [],
  onDestinationSelect,
  travelMode = 'driving',
  userLocation,
  clickedLocation,
  onRouteCalculated,
  isDarkMode = false
}: MapComponentProps) {
  const [mounted, setMounted] = useState(false);
  const [routeLine, setRouteLine] = useState<[number, number][]>([]);

  useEffect(() => {
    setMounted(true);
    delete (L.Icon.Default.prototype as any)._getIconUrl;
  }, []);

  // Effect to fetch OSRM route or calculate straight lines when endpoints or mode changes
  useEffect(() => {
    const calculateRoute = async () => {
      if (!userLocation || !clickedLocation) {
        setRouteLine([]);
        return;
      }

      // If mode is train or plane, we mock a straight line and estimate time
      if (travelMode === 'train' || travelMode === 'plane') {
        const R = 6371e3; // Earth radius in meters
        const φ1 = userLocation.lat * Math.PI/180;
        const φ2 = clickedLocation.lat * Math.PI/180;
        const Δφ = (clickedLocation.lat - userLocation.lat) * Math.PI/180;
        const Δλ = (clickedLocation.lng - userLocation.lng) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // in meters

        // Speed estimates: Train ~80km/h (22m/s), Plane ~600km/h (166m/s)
        const speed = travelMode === 'train' ? 22 : 166; 
        const duration = distance / speed; // in seconds

        setRouteLine([
          [userLocation.lat, userLocation.lng],
          [clickedLocation.lat, clickedLocation.lng]
        ]);

        if (onRouteCalculated) {
          onRouteCalculated({ distance, duration, mode: travelMode });
        }
        return;
      }
      
      // OSRM API for Driving, Walking, Cycling
      try {
        const url = `https://router.project-osrm.org/route/v1/${travelMode}/${userLocation.lng},${userLocation.lat};${clickedLocation.lng},${clickedLocation.lat}?overview=full&geometries=geojson`;
        const { data } = await axios.get(url);
        
        if (data.code === 'Ok' && data.routes.length > 0) {
          const route = data.routes[0];
          // OSRM returns GeoJSON [lng, lat], Leaflet needs [lat, lng]
          const latLngs = route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
          setRouteLine(latLngs as [number, number][]);
          
          if (onRouteCalculated) {
             onRouteCalculated({
               distance: route.distance, // in meters
               duration: route.duration, // in seconds
               mode: travelMode
             });
          }
        }
      } catch (err) {
        console.error("OSRM Route Error:", err);
      }
    };
    
    calculateRoute();
  }, [userLocation, clickedLocation, travelMode]);

  if (!mounted) return null;

  const defaultDestinations = destinations.length === 0 
    ? [{ _id: 'default', coordinates: { lat: 25.0961, lng: 85.3131 }, name: 'Bihar', description: 'Explore Bihar' }]
    : destinations;

  const centerLat = defaultDestinations.reduce((sum, d) => sum + d.coordinates.lat, 0) / defaultDestinations.length;
  const centerLng = defaultDestinations.reduce((sum, d) => sum + d.coordinates.lng, 0) / defaultDestinations.length;

  const customMarkerIcon = L.divIcon({
    className: 'custom-map-marker',
    html: `<div class="w-10 h-10 bg-[#546B41] rounded-full flex items-center justify-center text-white shadow-xl border-2 border-[#FFF8EC] transform hover:bg-[#99AD7A] transition-all hover:-translate-y-2 hover:scale-110 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
           </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  const sourceIcon = L.divIcon({
    className: 'custom-src-marker',
    html: `<div class="w-6 h-6 bg-[#DCCCAC] rounded-full shadow-lg border-4 border-[#546B41]"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  return (
    <div className="w-full relative z-0 transition-all duration-500 h-full">
      <MapContainer
        center={[centerLat, centerLng] as [number, number]} 
        zoom={7}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full rounded-none"
        style={{ minHeight: '100%', minWidth: '100%' }}
      >
        {routeLine.length > 0 && <BoundsController lineString={routeLine} />}
        
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">Carto</a>'
          url={isDarkMode 
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          }
        />

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={40}
          iconCreateFunction={(cluster: any) => {
            return L.divIcon({
              html: `<div class="w-12 h-12 bg-[#546B41] text-[#FFF8EC] rounded-full flex items-center justify-center font-bold text-lg shadow-xl border-4 border-[#FFF8EC]/50 hover:bg-[#99AD7A] transition-colors">${cluster.getChildCount()}</div>`,
              className: 'custom-cluster-marker',
              iconSize: L.point(48, 48, true),
            });
          }}
        >
          {defaultDestinations.map((destination: any, index) => (
            <Marker
              key={destination._id || index}
              position={[destination.coordinates.lat, destination.coordinates.lng]}
              icon={customMarkerIcon}
              eventHandlers={{
                click: () => {
                   if (onDestinationSelect) onDestinationSelect(destination);
                }
              }}
            />
          ))}
        </MarkerClusterGroup>

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={sourceIcon} />
        )}
        
        {routeLine.length > 0 && (
           <Polyline 
             positions={routeLine} 
             pathOptions={{ 
               color: travelMode === 'plane' || travelMode === 'train' ? '#99AD7A' : '#546B41', 
               weight: 6, 
               opacity: 0.8,
               dashArray: travelMode === 'plane' ? '10, 15' : travelMode === 'train' ? '20, 10' : undefined
             }} 
           />
        )}
      </MapContainer>
    </div>
  );
}
