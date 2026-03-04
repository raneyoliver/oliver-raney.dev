"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { SpringValue } from "@react-spring/three";
import { CABINET_RADIUS, ROTATION_STEP } from "@/lib/theme";

interface CameraControllerProps {
  activeIndex: number;
  zoomProgress: SpringValue<number>;
  ringRotation: SpringValue<number>;
}

export function CameraController({ activeIndex, zoomProgress, ringRotation }: CameraControllerProps) {
  const targetPos = useRef(new THREE.Vector3(0, 0.3, 0));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.3, CABINET_RADIUS));

  useFrame(({ camera }) => {
    const zoom = zoomProgress.get();
    const angle = activeIndex * ROTATION_STEP + ringRotation.get();

    const cabinetX = Math.sin(angle) * CABINET_RADIUS;
    const cabinetZ = Math.cos(angle) * CABINET_RADIUS;

    const basePos = new THREE.Vector3(0, 0.3, 0);
    const zoomPos = new THREE.Vector3(cabinetX * 0.7, 0.3, cabinetZ * 0.7);
    targetPos.current.lerpVectors(basePos, zoomPos, zoom);

    const baseLook = new THREE.Vector3(
      Math.sin(angle) * CABINET_RADIUS,
      0.3,
      Math.cos(angle) * CABINET_RADIUS
    );
    targetLookAt.current.copy(baseLook);

    camera.position.lerp(targetPos.current, 0.1);
    camera.lookAt(targetLookAt.current);
  });

  return null;
}
