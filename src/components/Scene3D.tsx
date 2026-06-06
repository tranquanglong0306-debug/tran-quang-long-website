import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Center } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

function FloatingObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotationX = useRef(0);
  const targetRotationY = useRef(0);
  const scrollY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates (-1 to 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotationY.current = x * 0.4;
      targetRotationX.current = -y * 0.4;
    };

    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Slow auto rotation
    meshRef.current.rotation.y += delta * 0.12;
    meshRef.current.rotation.z += delta * 0.05;

    // Lerp mouse interaction
    meshRef.current.rotation.x += (targetRotationX.current - meshRef.current.rotation.x) * 0.08;
    meshRef.current.rotation.y += (targetRotationY.current - meshRef.current.rotation.y) * 0.08;

    // Scroll-based parallax camera movement
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = docHeight > 0 ? scrollY.current / docHeight : 0;

    // Animate mesh position and camera based on scroll
    // 0% (Hero) -> Center
    // 30% (Featured) -> Slide right, zoom out slightly
    // 65% (Latest Posts) -> Slide left
    // 100% (About/Contact) -> Deep zoom in center
    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;

    if (scrollProgress < 0.25) {
      // Hero: Center
      targetX = 0;
      targetY = 0;
      targetZ = 0;
    } else if (scrollProgress < 0.6) {
      // Featured: Right
      targetX = 1.6;
      targetY = -0.2;
      targetZ = -0.5;
    } else if (scrollProgress < 0.85) {
      // Latest Posts: Left
      targetX = -1.6;
      targetY = 0.2;
      targetZ = -0.3;
    } else {
      // About/Contact: Center & Close
      targetX = 0;
      targetY = 0.4;
      targetZ = 1.0;
    }

    // Smoothly interpolate mesh position
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05;
    meshRef.current.position.z += (targetZ - meshRef.current.position.z) * 0.05;

    // Subtly animate floating depth
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y += Math.sin(time * 1.5) * 0.0015;
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      {/* Luxury Metallic/Glass Torus Knot */}
      <torusKnotGeometry args={[1, 0.35, 120, 16, 2, 3]} />
      <meshPhysicalMaterial
        color="#DADADA"
        roughness={0.15}
        metalness={0.9}
        reflectivity={1.0}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        transmission={0.3} // Some glass-like transmission
        thickness={0.5}
        flatShading={false}
      />
    </mesh>
  );
}

export default function Scene3D() {
  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none bg-[#050505]">
      {/* Subtle ambient fog */}
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={["#050505", 3, 10]} />
        <ambientLight intensity={0.15} />

        {/* Dramatic cinematic spotlight and directional lighting */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          color="#ffffff"
          castShadow
        />
        <pointLight position={[-5, -5, -2]} intensity={0.4} color="#8A8A8A" />
        <spotLight
          position={[0, 8, 2]}
          intensity={1.5}
          angle={0.6}
          penumbra={0.8}
          color="#ffffff"
        />

        <Center>
          <FloatingObject />
        </Center>

        {/* Floating luxury grayscale particles */}
        <Sparkles
          count={100}
          scale={7}
          size={2.5}
          speed={0.4}
          opacity={0.35}
          color="#DADADA"
        />
      </Canvas>
    </div>
  );
}
