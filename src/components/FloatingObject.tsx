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
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { setActivePanel } = useAppState();

  // Unified color matching the single gold accent design
  const colorStr = '#d4a853';

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Gentle rotation, slightly faster on hover
    const speedMult = hovered ? 1.6 : 1.0;
    meshRef.current.rotation.x += delta * 0.1 * speedMult;
    meshRef.current.rotation.y += delta * 0.15 * speedMult;
    meshRef.current.rotation.z += delta * 0.03 * speedMult;

    // Counter-rotate core
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.x -= delta * 0.12 * speedMult;
      coreMeshRef.current.rotation.y -= delta * 0.08 * speedMult;
    }

    // Parallax position shift based on cursor
    const parallaxX = state.pointer.x * 0.3;
    const parallaxY = state.pointer.y * 0.3;
    
    const targetX = position[0] + parallaxX;
    const targetY = position[1] + parallaxY;
    const targetZ = position[2];

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.06);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.06);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.06);

    // Hover scale (1.18x) and emissive transition
    const targetScale = hovered ? 1.18 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    const outerMaterial = meshRef.current.material as THREE.MeshPhysicalMaterial;
    if (outerMaterial) {
      const targetGlow = hovered ? 0.8 : 0.25;
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
    <Float speed={1.5} floatIntensity={0.6} rotationIntensity={0.15}>
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
          roughness={0.6}
          metalness={0.7}
          wireframe={true}
          emissive={new THREE.Color(colorStr)}
          emissiveIntensity={0.25}
          transparent={true}
          opacity={0.7}
          toneMapped={false}
        />

        {/* Inner solid glass core */}
        <mesh ref={coreMeshRef} scale={0.72}>
          {renderGeometry()}
          <meshPhysicalMaterial
            color={colorStr}
            roughness={0.7}
            metalness={0.3}
            transmission={0.5}
            thickness={0.5}
            opacity={0.6}
            transparent={true}
            emissive={new THREE.Color(colorStr)}
            emissiveIntensity={hovered ? 0.35 : 0.1}
            toneMapped={false}
          />
        </mesh>
        
        {/* Floating HTML tooltip badge */}
        {hovered && (
          <Html distanceFactor={6} position={[0, 1.2, 0]} center>
            <div 
              style={{
                background: '#0a0a10',
                border: '1px solid rgba(212, 168, 83, 0.25)',
                color: '#f0f0f5',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
              }}
              className="px-3.5 py-1 text-[9px] uppercase tracking-[0.3em] font-medium whitespace-nowrap select-none pointer-events-none font-sans"
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
