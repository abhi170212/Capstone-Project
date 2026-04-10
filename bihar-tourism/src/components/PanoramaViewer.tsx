'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function SphereBackground() {
  const texture = useTexture('/bihar_360_panorama.png');
  return (
    <mesh>
      {/* Huge sphere geometry centered around the camera */}
      <sphereGeometry args={[500, 60, 40]} />
      {/* THREE.BackSide maps the texture to the inside of the sphere */}
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

export default function PanoramaViewer() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing bg-gray-900 rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 0.1] }}>
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableDamping 
          dampingFactor={0.1}
          autoRotate 
          autoRotateSpeed={0.5} 
          rotateSpeed={-0.5} 
        />
        <Suspense fallback={null}>
          <SphereBackground />
        </Suspense>
      </Canvas>
      {/* Overlay Instructions */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 pointer-events-none z-10 hidden sm:block">
         <span className="text-white text-xs font-black tracking-widest uppercase">360° Interactive View</span>
      </div>
    </div>
  );
}
