import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Float } from "@react-three/drei";
import * as THREE from "three";

interface ShapeProps {
  name: string;
  index: number;
  geometryType: "sphere" | "box" | "torus" | "dodecahedron" | "cone" | "octahedron";
  color: string;
  defaultPosition: [number, number, number];
  geometryArgs: number[];
  activeSection: string | null;
  setActiveSection: (name: string | null) => void;
  hoveredSection: string | null;
  setHoveredSection: (name: string | null) => void;
}

export const Shape: React.FC<ShapeProps> = ({
  name,
  index,
  geometryType,
  color,
  defaultPosition,
  geometryArgs,
  activeSection,
  setActiveSection,
  hoveredSection,
  setHoveredSection,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [localHovered, setLocalHovered] = useState(false);

  const isHovered = localHovered || (hoveredSection === name);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Responsive: Scale down shapes on mobile viewports
    const isMobile = state.size.width < 640;
    const baseScale = isMobile ? 0.72 : 1.0;

    const targetPos = new THREE.Vector3();
    let targetScale = baseScale;

    if (activeSection === null) {
      // Gentle sway based on coordinates to make shapes float organically
      const swayX = Math.sin(state.clock.getElapsedTime() * 0.45 + index) * 0.12;
      const swayY = Math.cos(state.clock.getElapsedTime() * 0.45 + index) * 0.12;
      
      // Responsive position scale
      const posX = defaultPosition[0] * (isMobile ? 0.75 : 1.0) + swayX;
      const posY = defaultPosition[1] * (isMobile ? 0.75 : 1.0) + swayY;
      const posZ = defaultPosition[2];

      targetPos.set(posX, posY, posZ);
      
      // Target hover scale
      targetScale = isHovered ? baseScale * 1.2 : baseScale;
    } else if (activeSection.toLowerCase() === name.toLowerCase()) {
      // Focus Mode: Shape transitions to the left of the screen (centered on mobile)
      const targetFocusX = isMobile ? 0 : -2.4;
      const targetFocusY = isMobile ? 1.6 : 0;
      targetPos.set(targetFocusX, targetFocusY, 1.5);
      targetScale = baseScale * 1.35;
    } else {
      // Hidden Mode: Other shapes shrink and disappear in background
      targetPos.set(0, 0, -8);
      targetScale = 0.0;
    }

    // Lerp position & scale (spring-like simulation)
    meshRef.current.position.lerp(targetPos, 0.08);
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);

    // Rotation: Base speed +50% increase on hover
    const rotationMult = (isHovered || activeSection?.toLowerCase() === name.toLowerCase()) ? 1.5 : 1.0;
    meshRef.current.rotation.x += delta * 0.2 * rotationMult;
    meshRef.current.rotation.y += delta * 0.4 * rotationMult;

    // Emissive Intensity Glow Lerp
    const material = meshRef.current.material as THREE.MeshPhysicalMaterial;
    if (material) {
      const targetEmissiveIntensity = isHovered ? 0.5 : 0.0;
      material.emissiveIntensity = THREE.MathUtils.lerp(
        material.emissiveIntensity,
        targetEmissiveIntensity,
        0.1
      );

      // Opacity fade
      const targetOpacity = (activeSection !== null && activeSection.toLowerCase() !== name.toLowerCase()) ? 0.0 : 1.0;
      material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.08);
      material.transparent = true;
    }
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    if (activeSection !== null) return;
    setLocalHovered(true);
    setHoveredSection(name);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setLocalHovered(false);
    if (hoveredSection === name) setHoveredSection(null);
    document.body.style.cursor = "default";
  };

  const handleClick = (e?: any) => {
    if (e) e.stopPropagation();
    if (activeSection === null) {
      setActiveSection(name);
      setLocalHovered(false);
      setHoveredSection(null);
      document.body.style.cursor = "default";
    }
  };

  const renderGeometry = () => {
    switch (geometryType) {
      case "sphere":
        return <sphereGeometry args={[geometryArgs[0], geometryArgs[1], geometryArgs[2]]} />;
      case "box":
        return <boxGeometry args={[geometryArgs[0], geometryArgs[1], geometryArgs[2]]} />;
      case "torus":
        return <torusGeometry args={[geometryArgs[0], geometryArgs[1], geometryArgs[2], geometryArgs[3]]} />;
      case "dodecahedron":
        return <dodecahedronGeometry args={[geometryArgs[0], geometryArgs[1]]} />;
      case "cone":
        return <coneGeometry args={[geometryArgs[0], geometryArgs[1], geometryArgs[2]]} />;
      case "octahedron":
        return <octahedronGeometry args={[geometryArgs[0], geometryArgs[1]]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  const renderMaterial = () => {
    return (
      <meshPhysicalMaterial
        color={color}
        roughness={0.2}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        emissive={new THREE.Color(color)}
        emissiveIntensity={0}
        transparent
      />
    );
  };

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.6}>
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        castShadow
        receiveShadow
        aria-label={`${name} section shape`}
      >
        {renderGeometry()}
        {renderMaterial()}

        {/* Floating HTML label */}
        {isHovered && activeSection === null && (
          <Html distanceFactor={8} position={[0, 1.3, 0]} center>
            <div className="px-3 py-1 bg-black/90 border border-neutral-800 text-[10px] uppercase tracking-[0.2em] text-white font-sans select-none pointer-events-none whitespace-nowrap backdrop-blur-md transition-all duration-300">
              {name}
            </div>
          </Html>
        )}

        {/* Hidden screen-reader focusable anchor button for WCAG compliance */}
        <Html position={[0, 0, 0]} style={{ opacity: 0, pointerEvents: "none" }}>
          <button
            onClick={() => handleClick()}
            onFocus={() => setHoveredSection(name)}
            onBlur={() => setHoveredSection(null)}
            aria-label={`Chi tiết phân mục ${name}`}
            tabIndex={activeSection ? -1 : 0}
          />
        </Html>
      </mesh>
    </Float>
  );
};

export default Shape;
