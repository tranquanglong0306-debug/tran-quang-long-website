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
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { setActivePanel } = useAppState();

  // Color mapping matching the glassmorphic panels
  const getColor = () => {
    switch (panelName) {
      case 'about': return '#3b82f6'; // blue
      case 'skills': return '#a855f7'; // purple
      case 'projects': return '#ec4899'; // pink
      case 'contact': return '#06b6d4'; // cyan
      default: return '#ffffff';
    }
  };

  const colorStr = getColor();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 1. Double rotation speed on hover for dramatic effect
    const speedMult = hovered ? 2.2 : 1.0;
    meshRef.current.rotation.x += delta * 0.15 * speedMult;
    meshRef.current.rotation.y += delta * 0.25 * speedMult;
    meshRef.current.rotation.z += delta * 0.05 * speedMult;

    // Counter-rotate the inner core for a complex mechanical look
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.x -= delta * 0.2 * speedMult;
      coreMeshRef.current.rotation.y -= delta * 0.1 * speedMult;
    }

    // 2. Parallax: subtle position shift based on cursor coordinates
    const parallaxX = state.pointer.x * 0.45;
    const parallaxY = state.pointer.y * 0.45;
    
    // Smoothly lerp towards target position including parallax
    const targetX = position[0] + parallaxX;
    const targetY = position[1] + parallaxY;
    const targetZ = position[2];

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.06);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.06);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.06);

    // 3. Hover scale (1.25x) and material glow intensity transitions
    const targetScale = hovered ? 1.25 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    const outerMaterial = meshRef.current.material as THREE.MeshPhysicalMaterial;
    if (outerMaterial) {
      // Intensely glow when hovered
      const targetGlow = hovered ? 2.5 : 0.6;
      outerMaterial.emissiveIntensity = THREE.MathUtils.lerp(outerMaterial.emissiveIntensity, targetGlow, 0.1);
    }
  });

  const renderGeometry = () => {
    switch (type) {
      case 'cube':
        return <boxGeometry args={[0.9, 0.9, 0.9]} />;
      case 'torus':
        return <torusGeometry args={[0.45, 0.18, 16, 100]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[0.6, 0]} />;
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
        {/* outer wireframe shell */}
        {renderGeometry()}
        <meshPhysicalMaterial
          color={colorStr}
          roughness={0.1}
          metalness={0.9}
          wireframe={true}
          emissive={new THREE.Color(colorStr)}
          emissiveIntensity={0.6}
          transparent={true}
          opacity={0.85}
          toneMapped={false}
        />

        {/* Inner solid glass core */}
        <mesh ref={coreMeshRef} scale={0.72}>
          {renderGeometry()}
          <meshPhysicalMaterial
            color={colorStr}
            roughness={0.2}
            metalness={0.2}
            transmission={0.7}
            thickness={0.5}
            opacity={0.75}
            transparent={true}
            emissive={new THREE.Color(colorStr)}
            emissiveIntensity={hovered ? 1.0 : 0.25}
            toneMapped={false}
          />
        </mesh>
        
        {/* Floating HTML tooltip badge */}
        {hovered && (
          <Html distanceFactor={6} position={[0, 1.25, 0]} center>
            <div 
              style={{
                background: 'rgba(5, 5, 5, 0.85)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid ${colorStr}40`,
                color: '#ffffff',
                textShadow: `0 0 10px ${colorStr}`,
                boxShadow: `0 0 25px ${colorStr}25`
              }}
              className="px-3 py-1.5 rounded-xl text-xs uppercase tracking-[0.25em] font-bold whitespace-nowrap select-none pointer-events-none transition-all duration-300 font-sans"
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
