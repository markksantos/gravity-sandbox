import { useCallback, useRef, useState } from "react";
import type { Body as SimBody, Vector } from "../simulation/types";
import { createBody, resetIdCounter, step } from "../simulation/physics";
import { initStars, render } from "../simulation/renderer";

interface SpawnPreview {
  start: Vector;
  current: Vector;
  mass: number;
  startTime: number;
}

export function useSimulation() {
  const [bodyCount, setBodyCount] = useState(0);
  const [fps, setFps] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showTrails, setShowTrails] = useState(true);

  const bodiesRef = useRef<SimBody[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const fpsFrames = useRef(0);
  const fpsTime = useRef(0);
  const pausedRef = useRef(false);
  const showTrailsRef = useRef(true);
  const spawnRef = useRef<SpawnPreview | null>(null);
  const starsInitRef = useRef(false);

  const startLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = (time: number) => {
      animFrameRef.current = requestAnimationFrame(loop);

      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;

      // FPS counter
      fpsFrames.current++;
      fpsTime.current += dt;
      if (fpsTime.current >= 0.5) {
        setFps(Math.round(fpsFrames.current / fpsTime.current));
        fpsFrames.current = 0;
        fpsTime.current = 0;
      }

      // Update spawn preview mass
      if (spawnRef.current) {
        const elapsed = (Date.now() - spawnRef.current.startTime) / 1000;
        spawnRef.current.mass = 10 + elapsed * 80;
      }

      if (!pausedRef.current) {
        // Run multiple sub-steps for stability
        const subSteps = 4;
        const subDt = dt / subSteps;
        for (let i = 0; i < subSteps; i++) {
          bodiesRef.current = step(bodiesRef.current, subDt);
        }
        setBodyCount(bodiesRef.current.length);
      }

      render(
        ctx,
        bodiesRef.current,
        canvas.width,
        canvas.height,
        showTrailsRef.current,
        spawnRef.current
      );
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(loop);
  }, []);

  const initCanvas = useCallback(
    (canvas: HTMLCanvasElement) => {
      canvasRef.current = canvas;
      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (!starsInitRef.current) {
          initStars(canvas.width, canvas.height);
          starsInitRef.current = true;
        }
      };
      resize();
      window.addEventListener("resize", resize);
      startLoop();

      return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animFrameRef.current);
      };
    },
    [startLoop]
  );

  const handleMouseDown = useCallback((x: number, y: number) => {
    spawnRef.current = {
      start: { x, y },
      current: { x, y },
      mass: 10,
      startTime: Date.now(),
    };
  }, []);

  const handleMouseMove = useCallback((x: number, y: number) => {
    if (spawnRef.current) {
      spawnRef.current.current = { x, y };
    }
  }, []);

  const handleMouseUp = useCallback((x: number, y: number) => {
    if (!spawnRef.current) return;

    const { start, mass } = spawnRef.current;
    // Velocity from drag (slingshot - reversed direction)
    const vx = (start.x - x) * 0.5;
    const vy = (start.y - y) * 0.5;

    bodiesRef.current.push(createBody(start.x, start.y, vx, vy, mass));
    setBodyCount(bodiesRef.current.length);
    spawnRef.current = null;
  }, []);

  const reset = useCallback(() => {
    bodiesRef.current = [];
    resetIdCounter();
    setBodyCount(0);
  }, []);

  const togglePause = useCallback(() => {
    setPaused((p) => {
      pausedRef.current = !p;
      return !p;
    });
  }, []);

  const toggleTrails = useCallback(() => {
    setShowTrails((t) => {
      showTrailsRef.current = !t;
      return !t;
    });
  }, []);

  return {
    bodyCount,
    fps,
    paused,
    showTrails,
    initCanvas,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    reset,
    togglePause,
    toggleTrails,
  };
}
