'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import { Destination } from '@/types';

// Dynamically import react-leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface MapComponentProps {
  destinations?: Destination[];
  height?: string;
}

export default function MapComponent({ destinations = [], height = '400px' }: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Fix for default marker icon in Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  if (!isMounted) {
    return (
      <div 
        className="bg-gray-200 rounded-2xl flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  // Default to showing all of Bihar if no destinations provided
  const defaultDestinations = destinations.length === 0 
    ? [{ coordinates: { lat: 25.0961, lng: 85.3131 }, name: 'Bihar', description: 'Explore Bihar' }]
    : destinations;

  // Calculate center point
  const centerLat = defaultDestinations.reduce((sum, d) => sum + d.coordinates.lat, 0) / defaultDestinations.length;
  const centerLng = defaultDestinations.reduce((sum, d) => sum + d.coordinates.lng, 0) / defaultDestinations.length;

  return (
    <div className="rounded-2xl overflow-hidden shadow-xl relative z-0" style={{ height }}>
      <MapContainer
        center={[centerLat, centerLng] as [number, number]}
        zoom={7}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ minHeight: '100%', minWidth: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {defaultDestinations.map((destination: any, index) => (
          <Marker
            key={index}
            position={[destination.coordinates.lat, destination.coordinates.lng]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{destination.name}</h3>
                <p className="text-sm text-gray-600">{destination.description || 'Explore this amazing destination'}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
