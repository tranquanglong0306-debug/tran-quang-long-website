import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/* Earth mesh with procedural texture + atmosphere glow                */
/* ------------------------------------------------------------------ */
function EarthMesh() {
  const earthRef = useRef<THREE.Mesh>(null!);
  const glowRef  = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);

  // Procedural Earth texture (canvas-based)
  const earthTexture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width  = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Ocean base
    ctx.fillStyle = '#0a2a6e';
    ctx.fillRect(0, 0, size, size);

    // Simple continent blobs
    const continents = [
      { x: 0.3, y: 0.4, w: 0.18, h: 0.22 }, // Americas
      { x: 0.55, y: 0.35, w: 0.14, h: 0.20 }, // Europe/Africa
      { x: 0.72, y: 0.30, w: 0.18, h: 0.18 }, // Asia
      { x: 0.78, y: 0.58, w: 0.09, h: 0.12 }, // Australia
    ];

    for (const c of continents) {
      const gradient = ctx.createRadialGradient(
        c.x * size, c.y * size, 0,
        c.x * size, c.y * size, c.w * size * 0.9
      );
      gradient.addColorStop(0, '#2d6a4f');
      gradient.addColorStop(0.5, '#40916c');
      gradient.addColorStop(1,   'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(c.x * size, c.y * size, c.w * size, c.h * size, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ice caps
    const topGrad = ctx.createLinearGradient(0, 0, 0, size * 0.12);
    topGrad.addColorStop(0, 'rgba(255,255,255,0.9)');
    topGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, size, size * 0.12);

    const botGrad = ctx.createLinearGradient(0, size * 0.88, 0, size);
    botGrad.addColorStop(0, 'transparent');
    botGrad.addColorStop(1, 'rgba(255,255,255,0.7)');
    ctx.fillStyle = botGrad;
    ctx.fillRect(0, size * 0.88, size, size * 0.12);

    return new THREE.CanvasTexture(canvas);
  }, []);

  // Glow material (additive atmosphere)
  const glowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color('#4fc3f7'),
    transparent: true,
    opacity: 0.12,
    side: THREE.BackSide,
    depthWrite: false,
  }), []);

  // Outer corona
  const coronaMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color('#1565c0'),
    transparent: true,
    opacity: 0.05,
    side: THREE.BackSide,
    depthWrite: false,
  }), []);

  const coronaRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (earthRef.current)  earthRef.current.rotation.y  = t * 0.18;
    if (cloudsRef.current) cloudsRef.current.rotation.y = t * 0.22;
    // gentle wobble
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.06 + Math.sin(t * 0.8) * 0.008);
    }
    if (coronaRef.current) {
      coronaRef.current.scale.setScalar(1.22 + Math.sin(t * 0.5) * 0.012);
    }
  });

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={earthRef} castShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.012, 48, 48]} />
        <meshStandardMaterial
          transparent
          opacity={0.18}
          color="#ffffff"
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Inner atmosphere glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.06, 32, 32]} />
        <primitive object={glowMaterial} attach="material" />
      </mesh>

      {/* Outer corona */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[1.18, 32, 32]} />
        <primitive object={coronaMaterial} attach="material" />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Stars backdrop for Earth scene                                       */
/* ------------------------------------------------------------------ */
function MiniStars() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={300}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#c8d8ff" size={0.06} transparent opacity={0.7} />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Exported canvas component                                            */
/* ------------------------------------------------------------------ */
const EarthCanvas: React.FC = () => (
  <Canvas
    camera={{ position: [0, 0, 3.2], fov: 40 }}
    gl={{ antialias: true, alpha: true }}
    style={{ background: 'transparent' }}
  >
    <ambientLight intensity={0.3} />
    <directionalLight position={[5, 3, 5]} intensity={1.8} color="#fff5e0" />
    <pointLight position={[-4, -2, -2]} intensity={0.4} color="#1a237e" />
    <MiniStars />
    <EarthMesh />
  </Canvas>
);

export default EarthCanvas;
