"use client";

import { animated } from "@react-spring/three";
import { CABINETS } from "@/lib/cabinets";
import { CABINET_RADIUS, ROTATION_STEP } from "@/lib/theme";
import { ArcadeCabinet } from "./ArcadeCabinet";
import type { SpringValue } from "@react-spring/three";

interface CabinetRingProps {
  springRotation: SpringValue<number>;
  activeIndex: number;
  onSelectCabinet: (index: number) => void;
}

export function CabinetRing({ springRotation, activeIndex, onSelectCabinet }: CabinetRingProps) {
  return (
    <animated.group rotation-y={springRotation}>
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
    </animated.group>
  );
}
