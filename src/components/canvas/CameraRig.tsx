import React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CameraRigProps {
  activeSection: string | null;
}

export const CameraRig: React.FC<CameraRigProps> = ({ activeSection }) => {
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Responsive adaptation: Check if mobile viewport to increase zoom depth
    const isMobile = state.size.width < 640;
    const baseZ = isMobile ? 12 : 10;

    if (activeSection === null) {
      // Camera subtle sway:
      state.camera.position.x = Math.sin(time * 0.2) * 0.5;
      state.camera.position.y = Math.cos(time * 0.2) * 0.3;
      state.camera.position.z = baseZ;
      state.camera.lookAt(0, 0, 0);
    } else {
      // Zoom focus shift left
      const targetX = isMobile ? 0 : -0.8;
      const targetZ = isMobile ? 9 : 7.5;
      
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.08);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0, 0.08);
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.08);
      
      const targetLookAt = new THREE.Vector3(targetX, 0, 0);
      state.camera.lookAt(targetLookAt);
    }
  });
  return null;
};

export default CameraRig;
