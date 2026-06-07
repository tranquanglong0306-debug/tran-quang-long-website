import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, Stars } from '@react-three/drei';
import FloatingObject from './FloatingObject';
import { useAppState } from '../store';

interface SceneProps {
  isMobile: boolean;
  isTablet: boolean;
}

export const Scene: React.FC<SceneProps> = ({ isMobile, isTablet }) => {
  const { activePanel } = useAppState();

  // Adjust spacing based on screen size
  const spacingX = isMobile ? 1.7 : isTablet ? 2.3 : 2.9;
  const spacingY = isMobile ? 1.4 : isTablet ? 1.8 : 2.1;

  return (
    <div className={`absolute inset-0 w-full h-full transition-all duration-700 ${activePanel ? 'blur-sm scale-95 pointer-events-none opacity-40' : 'blur-0 scale-100'}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Ambient and directional lights for depth */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
        />
        <pointLight position={[-5, -5, -2]} intensity={0.6} color="#9333ea" />
        <pointLight position={[5, -5, 2]} intensity={0.6} color="#0891b2" />

        {/* Realistic reflections environment */}
        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>

        {/* Soft shadows under elements */}
        <ContactShadows 
          position={[0, -2.5, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={1.5} 
          far={4.5} 
        />

        {/* Slow moving stars background */}
        <Stars 
          radius={100} 
          depth={50} 
          count={2500} 
          factor={4} 
          saturation={0.5} 
          fade 
          speed={1.5} 
        />

        {/* 5 Floating Objects in a Pentagonal Orbit Layout */}
        
        {/* 1. About Me (Cube) - Left-most position */}
        <FloatingObject
          type="cube"
          position={[-spacingX, spacingY * 0.15, 0]}
          panelName="about"
          label="Giới thiệu"
          glowColor="rgba(59, 130, 246, 0.5)"
        />

        {/* 2. Skills (Torus) - Top-Left position */}
        <FloatingObject
          type="torus"
          position={[-spacingX * 0.5, spacingY * 0.9, 0]}
          panelName="skills"
          label="Kỹ năng"
          glowColor="rgba(147, 51, 234, 0.5)"
        />

        {/* 3. Projects (Icosahedron) - Top-Right position */}
        <FloatingObject
          type="icosahedron"
          position={[spacingX * 0.5, spacingY * 0.9, 0]}
          panelName="projects"
          label="Dự án"
          glowColor="rgba(219, 39, 119, 0.5)"
        />

        {/* 4. Blog (Dodecahedron) - Right-most position */}
        <FloatingObject
          type="dodecahedron"
          position={[spacingX, spacingY * 0.15, 0]}
          panelName="blog"
          label="Blog chia sẻ"
          glowColor="rgba(245, 158, 11, 0.5)"
        />

        {/* 5. Contact (Cone) - Bottom-Center position */}
        <FloatingObject
          type="cone"
          position={[0, -spacingY * 0.85, 0]}
          panelName="contact"
          label="Liên hệ"
          glowColor="rgba(8, 145, 178, 0.5)"
        />
      </Canvas>
    </div>
  );
};

export default Scene;
