"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CABINETS } from "@/lib/cabinets";
import { CABINET_RADIUS, ROTATION_STEP } from "@/lib/theme";
import { ArcadeCabinet } from "./ArcadeCabinet";
import * as THREE from "three";

interface CabinetRingProps {
  targetRotation: React.MutableRefObject<number>;
  currentRotation: React.MutableRefObject<number>;
  activeIndex: number;
  onSelectCabinet: (index: number) => void;
}

export function CabinetRing({ targetRotation, currentRotation, activeIndex, onSelectCabinet }: CabinetRingProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      currentRotation.current = THREE.MathUtils.lerp(currentRotation.current, targetRotation.current, 0.06);
      groupRef.current.rotation.y = currentRotation.current;
    }
  });

  return (
    <group ref={groupRef}>
      {CABINETS.map((cabinet, index) => {
        const angle = index * ROTATION_STEP;
        const x = Math.sin(angle) * CABINET_RADIUS;
        const z = Math.cos(angle) * CABINET_RADIUS;
        const facingAngle = angle + Math.PI;

        return (
          <group
            key={cabinet.id}
            position={[x, 0, z]}
            rotation={[0, facingAngle, 0]}
          >
            <ArcadeCabinet
              config={cabinet}
              isActive={index === activeIndex}
              onClick={() => onSelectCabinet(index)}
            />
          </group>
        );
      })}
    </group>
  );
}
