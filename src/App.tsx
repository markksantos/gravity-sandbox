import Canvas from "./components/Canvas";
import { useSimulation } from "./hooks/useSimulation";

export default function App() {
  const {
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
  } = useSimulation();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0a1a]">
      <Canvas
        initCanvas={initCanvas}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      {/* HUD - top left */}
      <div className="fixed top-4 left-4 pointer-events-none select-none">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-white/70 text-sm font-mono space-y-1">
          <div>
            Bodies: <span className="text-white">{bodyCount}</span>
          </div>
          <div>
            FPS: <span className="text-white">{fps}</span>
          </div>
        </div>
      </div>

      {/* Instructions - top right */}
      <div className="fixed top-4 right-4 pointer-events-none select-none">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-white/40 text-xs space-y-1">
          <div>Click to spawn a body</div>
          <div>Hold longer = more mass</div>
          <div>Drag to set velocity</div>
        </div>
      </div>

      {/* Controls - bottom center */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-2 py-2 flex gap-2">
          <button
            onClick={togglePause}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 text-sm transition-colors"
          >
            {paused ? "Play" : "Pause"}
          </button>
          <button
            onClick={toggleTrails}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 text-sm transition-colors"
          >
            Trails {showTrails ? "On" : "Off"}
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-red-500/30 text-white/80 text-sm transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
