'use client';

import dynamic from 'next/dynamic';

// Next.js double-rendering in React Strict Mode causes react-leaflet to crash with "appendChild" errors.
// By wrapping our entire Leaflet map within a strict SSR-false dynamic import at the top structural level,
// we ensure Leaflet doesn't throw DOM errors during tree reconciliation.
const MapComponentInner = dynamic(
  () => import('./MapComponentInner'), 
  { 
    ssr: false, 
    loading: () => (
      <div className="bg-[#FFF8EC] rounded-2xl flex items-center justify-center w-full h-full min-h-[400px]">
        <p className="text-[#546B41] font-bold">Loading Map Data...</p>
      </div>
    )
  }
);

interface MapComponentProps {
  destinations?: any[];
  onDestinationSelect?: (destination: any) => void;
  travelMode?: 'driving' | 'walking' | 'cycling' | 'train' | 'plane';
  userLocation?: { lat: number, lng: number } | null;
  clickedLocation?: { lat: number, lng: number } | null;
  onRouteCalculated?: (route: any) => void;
  isDarkMode?: boolean;
  height?: string;
}

export default function MapComponent(props: MapComponentProps) {
  return <MapComponentInner {...props} />;
}
