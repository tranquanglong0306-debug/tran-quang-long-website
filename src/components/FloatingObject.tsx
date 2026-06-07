import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAppState } from '../store';

interface FloatingObjectProps {
  type: 'cube' | 'torus' | 'icosahedron' | 'cone';
  position: [number, number, number];
  panelName: 'about' | 'skills' | 'projects' | 'contact';
  label: string;
  glowColor: string;
}

export const FloatingObject: React.FC<FloatingObjectProps> = ({
  type,
  position,
  panelName,
  label,
  glowColor,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { activePanel, setActivePanel } = useAppState();

  // Color mapping
  const getColor = () => {
    switch (panelName) {
      case 'about': return '#2563eb'; // blue
      case 'skills': return '#9333ea'; // purple
      case 'projects': return '#db2777'; // pink
      case 'contact': return '#0891b2'; // cyan
      default: return '#ffffff';
    }
  };

  const colorStr = getColor();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 1. Double rotation speed on hover
    const speedMult = hovered ? 2.0 : 1.0;
    meshRef.current.rotation.x += delta * 0.15 * speedMult;
    meshRef.current.rotation.y += delta * 0.25 * speedMult;
    meshRef.current.rotation.z += delta * 0.05 * speedMult;

    // 2. Parallax: subtle position shift based on cursor
    // state.pointer contains normalized mouse coordinates from -1 to 1
    const parallaxX = state.pointer.x * 0.4;
    const parallaxY = state.pointer.y * 0.4;
    
    // Smoothly lerp towards target position including parallax
    const targetX = position[0] + parallaxX;
    const targetY = position[1] + parallaxY;
    const targetZ = position[2];

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.05);

    // 3. Hover scale (1.2x) and emissive glow intensity change
    const targetScale = hovered ? 1.25 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    const material = meshRef.current.material as THREE.MeshPhysicalMaterial;
    if (material) {
      const targetGlow = hovered ? 1.6 : 0.4;
      material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, targetGlow, 0.1);
    }
  });

  const renderGeometry = () => {
    switch (type) {
      case 'cube':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'torus':
        return <torusGeometry args={[0.5, 0.2, 16, 100]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[0.65, 0]} />;
      case 'cone':
        return <coneGeometry args={[0.5, 1, 32]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    setActivePanel(panelName);
  };

  return (
    <Float speed={2} floatIntensity={1} rotationIntensity={0.2}>
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
        <meshPhysicalMaterial
          color={colorStr}
          roughness={0.15}
          metalness={0.2}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          emissive={new THREE.Color(colorStr)}
          emissiveIntensity={0.4}
          toneMapped={false}
        />
        
        {/* Tooltip on hover */}
        {hovered && (
          <Html distanceFactor={6} position={[0, 1.2, 0]} center>
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                textShadow: `0 0 10px ${colorStr}`,
                boxShadow: `0 0 20px rgba(${panelName === 'about' ? '59,130,246' : panelName === 'skills' ? '147,51,234' : panelName === 'projects' ? '219,39,119' : '8,145,178'}, 0.3)`
              }}
              className="px-3 py-1.5 rounded-lg text-xs uppercase tracking-[0.2em] font-medium whitespace-nowrap select-none pointer-events-none transition-all duration-300 font-sans border border-white/20"
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
