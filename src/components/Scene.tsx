import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
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
        {/* Subtle lights for a sophisticated look */}
        <ambientLight intensity={0.25} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1.0} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
        />
        {/* Neutral cool and soft gold accent point lights */}
        <pointLight position={[-5, -5, -2]} intensity={0.5} color="#8b93b8" />
        <pointLight position={[5, -5, 2]} intensity={0.5} color="#d4a853" />

        {/* Realistic reflections environment */}
        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>

        {/* Soft shadows under elements */}
        <ContactShadows 
          position={[0, -2.5, 0]} 
          opacity={0.3} 
          scale={10} 
          blur={1.8} 
          far={4.5} 
        />

        {/* 5 Floating Objects in a Pentagonal Orbit Layout with unified subtle gold glows */}
        
        {/* 1. About Me (Cube) - Left-most position */}
        <FloatingObject
          type="cube"
          position={[-spacingX, spacingY * 0.15, 0]}
          panelName="about"
          label="Giới thiệu"
          glowColor="rgba(212, 168, 83, 0.2)"
        />

        {/* 2. Skills (Torus) - Top-Left position */}
        <FloatingObject
          type="torus"
          position={[-spacingX * 0.5, spacingY * 0.9, 0]}
          panelName="skills"
          label="Kỹ năng"
          glowColor="rgba(212, 168, 83, 0.2)"
        />

        {/* 3. Projects (Icosahedron) - Top-Right position */}
        <FloatingObject
          type="icosahedron"
          position={[spacingX * 0.5, spacingY * 0.9, 0]}
          panelName="projects"
          label="Dự án"
          glowColor="rgba(212, 168, 83, 0.2)"
        />

        {/* 4. Blog (Dodecahedron) - Right-most position */}
        <FloatingObject
          type="dodecahedron"
          position={[spacingX, spacingY * 0.15, 0]}
          panelName="blog"
          label="Blog chia sẻ"
          glowColor="rgba(212, 168, 83, 0.2)"
        />

        {/* 5. Contact (Cone) - Bottom-Center position */}
        <FloatingObject
          type="cone"
          position={[0, -spacingY * 0.85, 0]}
          panelName="contact"
          label="Liên hệ"
          glowColor="rgba(212, 168, 83, 0.2)"
        />
      </Canvas>
    </div>
  );
};

export default Scene;
