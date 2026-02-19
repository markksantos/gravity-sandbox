<div align="center">

# 🪐 Gravity Sandbox

**Interactive physics gravity simulation where you spawn celestial bodies and watch them orbit, collide, and merge**

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](#)

[Features](#-features) · [Getting Started](#-getting-started) · [Tech Stack](#%EF%B8%8F-tech-stack)

</div>

---

## ✨ Features

- **N-Body Gravity Simulation** — Real-time gravitational attraction between all bodies using Velocity Verlet integration for accurate, stable physics
- **Click-to-Spawn** — Click anywhere to create a body; hold longer for more mass, drag to set initial velocity
- **Collision & Merging** — Bodies collide and merge with momentum conservation, producing larger composite bodies
- **Orbital Trails** — Toggle trail rendering to visualize orbital paths and gravitational slingshots
- **Mass-Based Visuals** — Body size and color scale with mass (blue → yellow → orange → red → purple)
- **Softened Gravity** — Softening parameter prevents numerical explosions during close encounters
- **Pause & Reset** — Freeze the simulation to study configurations, or reset to start fresh
- **Real-Time HUD** — Live body count and FPS counter overlay

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [npm](https://www.npmjs.com/)

### Installation

```bash
git clone https://github.com/markksantos/gravity-sandbox.git
cd gravity-sandbox
npm install
npm run dev
```

### Controls

| Action | Input |
|--------|-------|
| Spawn body | Click on canvas |
| Increase mass | Hold click longer |
| Set velocity | Click and drag |
| Pause / Play | Pause button |
| Toggle trails | Trails button |
| Clear all | Reset button |

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Language | TypeScript |
| Frontend | React 19, Vite |
| Styling | Tailwind CSS |
| Rendering | HTML5 Canvas |
| Physics | Custom N-body engine (Velocity Verlet) |

## 📁 Project Structure

```
gravity-sandbox/
├── src/
│   ├── simulation/
│   │   ├── physics.ts        # N-body gravity, Velocity Verlet integration, collision merging
│   │   ├── renderer.ts       # Canvas rendering — bodies, trails, glow effects
│   │   └── types.ts          # Body, Vector2D type definitions
│   ├── components/
│   │   └── Canvas.tsx         # Canvas element with mouse event bindings
│   ├── hooks/
│   │   └── useSimulation.ts   # Simulation loop, spawn logic, state management
│   ├── App.tsx                # HUD, controls, and layout
│   └── main.tsx               # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 📄 License

MIT License © 2025 Mark Santos
