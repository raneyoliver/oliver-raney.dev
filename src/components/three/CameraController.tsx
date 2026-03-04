"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { CABINET_RADIUS } from "@/lib/theme";

interface CameraControllerProps {
  zoomTarget: React.MutableRefObject<number>;
  currentZoom: React.MutableRefObject<number>;
}

export function CameraController({ zoomTarget, currentZoom }: CameraControllerProps) {
  const currentPos = useRef(new THREE.Vector3(0, 0.5, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0.3, CABINET_RADIUS));

  useFrame(({ camera }) => {
    currentZoom.current = THREE.MathUtils.lerp(currentZoom.current, zoomTarget.current, 0.06);
    const zoom = currentZoom.current;

    const basePos = new THREE.Vector3(0, 0.5, 0);
    const zoomPos = new THREE.Vector3(0, 0.5, CABINET_RADIUS * 0.6);
    const targetPos = new THREE.Vector3().lerpVectors(basePos, zoomPos, zoom);

    const targetLookAt = new THREE.Vector3(0, 0.3, CABINET_RADIUS);

    currentPos.current.lerp(targetPos, 0.08);
    currentLookAt.current.lerp(targetLookAt, 0.08);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
