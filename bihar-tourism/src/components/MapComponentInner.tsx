'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Destination } from '@/types';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  destinations?: Destination[];
  height?: string;
}

export default function MapComponentInner({ destinations = [], height = '400px' }: MapComponentProps) {
  useEffect(() => {
    // Fix for default marker icon in Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

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
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-1">{destination.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{destination.description || 'Explore this amazing destination'}</p>
                <Link 
                  href={`/destinations/${destination._id}`}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  View Full Details →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
