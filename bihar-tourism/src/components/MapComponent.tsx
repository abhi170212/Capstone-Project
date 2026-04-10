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
      <div className="bg-gray-200 rounded-2xl flex items-center justify-center w-full min-h-[400px]">
        <p className="text-gray-600 font-medium">Loading Map Data...</p>
      </div>
    )
  }
);

interface MapComponentProps {
  destinations?: any[];
  height?: string;
}

export default function MapComponent(props: MapComponentProps) {
  return <MapComponentInner {...props} />;
}
