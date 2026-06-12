import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAppState } from '../store';

interface FloatingObjectProps {
  type: 'cube' | 'torus' | 'icosahedron' | 'cone' | 'dodecahedron';
  position: [number, number, number];
  panelName: 'about' | 'skills' | 'projects' | 'blog' | 'contact';
  label: string;
  glowColor: string;
}

export const FloatingObject: React.FC<FloatingObjectProps> = ({
  type,
  position,
  panelName,
  label,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { setActivePanel } = useAppState();

  // Color from the earthy visual system - Warm Taupe/Bronze
  const bronzeColor = '#A89F91';

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Gentle slow rotation
    const speedMult = hovered ? 1.4 : 1.0;
    meshRef.current.rotation.x += delta * 0.08 * speedMult;
    meshRef.current.rotation.y += delta * 0.12 * speedMult;
    meshRef.current.rotation.z += delta * 0.02 * speedMult;

    // Parallax position shift based on cursor
    const parallaxX = state.pointer.x * 0.25;
    const parallaxY = state.pointer.y * 0.25;
    
    const targetX = position[0] + parallaxX;
    const targetY = position[1] + parallaxY;
    const targetZ = position[2];

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.06);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.06);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.06);

    // Hover scale (1.15x)
    const targetScale = hovered ? 1.15 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  const renderGeometry = () => {
    switch (type) {
      case 'cube':
        return <boxGeometry args={[0.9, 0.9, 0.9]} />;
      case 'torus':
        return <torusGeometry args={[0.45, 0.18, 16, 100]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[0.6, 0]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[0.55, 0]} />;
      case 'cone':
        return <coneGeometry args={[0.45, 0.9, 32]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    setActivePanel(panelName);
  };

  return (
    <Float speed={1.2} floatIntensity={0.5} rotationIntensity={0.1}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        {renderGeometry()}
        {/* Solid matte bronze physical material */}
        <meshPhysicalMaterial
          color={bronzeColor}
          roughness={0.75}
          metalness={0.8}
          clearcoat={0.1}
          clearcoatRoughness={0.5}
          reflectivity={0.2}
          toneMapped={true}
        />
        
        {/* Floating HTML tooltip badge */}
        {hovered && (
          <Html distanceFactor={6} position={[0, 1.25, 0]} center>
            <div 
              style={{
                background: '#1E1E1C',
                border: '1px solid #333333',
                color: '#E6E4E0',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
              }}
              className="px-3.5 py-1.5 text-[9px] uppercase tracking-[0.3em] font-medium whitespace-nowrap select-none pointer-events-none font-sans"
            >
              {label}
            </div>
          </Html>
        )}
      </mesh>
    </Float>
  );
};

export default FloatingObject;
