"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { CabinetConfig } from "@/lib/cabinets";
import { CabinetScreen } from "./CabinetScreen";

const MODEL_PATH = "/blade_runner_arcade_cabinet.glb";

const MODEL_SCALE = 0.005;
const MODEL_Y_OFFSET = -558 * MODEL_SCALE / 2;

interface ArcadeCabinetProps {
  config: CabinetConfig;
  isActive: boolean;
  onClick: () => void;
}

export function ArcadeCabinet({ config, isActive, onClick }: ArcadeCabinetProps) {
  const { scene } = useGLTF(MODEL_PATH);
  const glowRef = useRef<THREE.PointLight>(null);

  const clone = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = child.material.clone();
      }
    });
    return cloned;
  }, [scene]);

  useEffect(() => {
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat.emissive) {
          mat.emissiveIntensity = isActive ? 1.5 : 0.5;
        }
      }
    });
  }, [clone, isActive]);

  useFrame(({ clock }) => {
    if (glowRef.current) {
      const flicker = 0.8 + Math.sin(clock.elapsedTime * 3 + Math.random() * 0.5) * 0.2;
      glowRef.current.intensity = isActive ? flicker * 2.0 : flicker * 0.8;
    }
  });

  return (
    <group onClick={onClick}>
      <primitive
        object={clone}
        scale={[MODEL_SCALE, MODEL_SCALE, MODEL_SCALE]}
        position={[0, MODEL_Y_OFFSET, 0]}
      />

      <CabinetScreen config={config} isActive={isActive} />

      <pointLight
        ref={glowRef}
        position={[0, 0.4, 0.8]}
        color={config.color}
        intensity={1.2}
        distance={4}
        decay={2}
      />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
