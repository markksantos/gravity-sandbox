import { useEffect, useRef } from "react";

interface CanvasProps {
  initCanvas: (canvas: HTMLCanvasElement) => () => void;
  onMouseDown: (x: number, y: number) => void;
  onMouseMove: (x: number, y: number) => void;
  onMouseUp: (x: number, y: number) => void;
}

export default function Canvas({
  initCanvas,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = initCanvas(canvasRef.current);
    return cleanup;
  }, [initCanvas]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 cursor-crosshair"
      onMouseDown={(e) => onMouseDown(e.clientX, e.clientY)}
      onMouseMove={(e) => onMouseMove(e.clientX, e.clientY)}
      onMouseUp={(e) => onMouseUp(e.clientX, e.clientY)}
      onMouseLeave={(e) => onMouseUp(e.clientX, e.clientY)}
    />
  );
}
