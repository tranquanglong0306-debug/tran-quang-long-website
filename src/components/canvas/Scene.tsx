import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import Shape from "./Shape";
import Particles from "./Particles";
import CameraRig from "./CameraRig";
import { SHAPES } from "../../lib/constants";
import * as THREE from "three";

interface SceneProps {
  activeSection: string | null;
  setActiveSection: (name: string | null) => void;
  hoveredSection: string | null;
  setHoveredSection: (name: string | null) => void;
}

const InteractiveGroup: React.FC<SceneProps> = ({
  activeSection,
  setActiveSection,
  hoveredSection,
  setHoveredSection,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const wheelRotation = useRef(0);
  const smoothRotation = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (activeSection !== null) return;
      wheelRotation.current += e.deltaY * 0.0018;
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeSection]);

  useFrame(() => {
    if (!groupRef.current) return;

    const targetRotation = activeSection ? 0 : wheelRotation.current;
    smoothRotation.current = THREE.MathUtils.lerp(
      smoothRotation.current,
      targetRotation,
      0.06
    );

    groupRef.current.rotation.z = smoothRotation.current;
  });

  return (
    <group ref={groupRef}>
      {SHAPES.map((shape, index) => (
        <Shape
          key={shape.id}
          name={shape.label}
          index={index}
          geometryType={shape.geometry}
          color={shape.color}
          defaultPosition={shape.position}
          geometryArgs={shape.geometryArgs}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          hoveredSection={hoveredSection}
          setHoveredSection={setHoveredSection}
        />
      ))}
    </group>
  );
};

export const Scene: React.FC<SceneProps> = ({
  activeSection,
  setActiveSection,
  hoveredSection,
  setHoveredSection,
}) => {
  return (
    <div className="absolute inset-0 w-full h-full z-10 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lights Config from Brief */}
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#c2410c" />

        {/* Floating background particles */}
        <Particles />

        {/* Custom Group wrapping shapes to receive wheel rotation */}
        <InteractiveGroup
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          hoveredSection={hoveredSection}
          setHoveredSection={setHoveredSection}
        />

        {/* Custom Camera sway controller */}
        <CameraRig activeSection={activeSection} />

        <Preload all />
      </Canvas>
    </div>
  );
};

export default Scene;
