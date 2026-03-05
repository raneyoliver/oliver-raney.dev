"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CABINET_RADIUS } from "@/lib/theme";

const MOVE_SPEED = 0.12;
const LOOK_SENSITIVITY = 0.002;

interface FreeCamControllerProps {
  onExit: () => void;
}

export function FreeCamController({ onExit }: FreeCamControllerProps) {
  const { camera } = useThree();
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const yaw = useRef(Math.PI);
  const pitch = useRef(-0.1);
  const position = useRef(new THREE.Vector3(0, 0.4, CABINET_RADIUS * 0.5));

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "w") keys.current.w = true;
      if (k === "a") keys.current.a = true;
      if (k === "s") keys.current.s = true;
      if (k === "d") keys.current.d = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "w") keys.current.w = false;
      if (k === "a") keys.current.a = false;
      if (k === "s") keys.current.s = false;
      if (k === "d") keys.current.d = false;
    };

    const onPointerLockChange = () => {
      if (!document.pointerLockElement) {
        onExit();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    document.addEventListener("pointerlockchange", onPointerLockChange);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
    };
  }, [onExit]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      yaw.current -= e.movementX * LOOK_SENSITIVITY;
      pitch.current += e.movementY * LOOK_SENSITIVITY;
      pitch.current = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, pitch.current));
    };

    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, []);

  useFrame(() => {
    const { w, a, s, d } = keys.current;
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(-pitch.current, yaw.current, 0, "YXZ"));
    const right = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(0, yaw.current, 0, "YXZ"));

    const dir = new THREE.Vector3();
    if (w) dir.add(forward);
    if (s) dir.sub(forward);
    if (d) dir.add(right);
    if (a) dir.sub(right);

    if (dir.lengthSq() > 0) {
      dir.normalize().multiplyScalar(MOVE_SPEED);
      position.current.add(dir);
    }

    camera.position.copy(position.current);
    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw.current;
    camera.rotation.x = -pitch.current;
  });

  return null;
}
