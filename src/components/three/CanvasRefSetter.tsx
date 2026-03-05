"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

interface CanvasRefSetterProps {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}

export function CanvasRefSetter({ canvasRef }: CanvasRefSetterProps) {
  const { gl } = useThree();

  useEffect(() => {
    canvasRef.current = gl.domElement;
    return () => {
      canvasRef.current = null;
    };
  }, [gl.domElement, canvasRef]);

  return null;
}
