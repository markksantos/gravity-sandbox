import type { Body } from "./types";

const G = 800;
const SOFTENING = 10;
const MAX_TRAIL = 80;

let nextId = 0;

export function createBody(
  x: number,
  y: number,
  vx: number,
  vy: number,
  mass: number
): Body {
  return {
    id: nextId++,
    pos: { x, y },
    vel: { x: vx, y: vy },
    acc: { x: 0, y: 0 },
    mass,
    radius: massToRadius(mass),
    color: massToColor(mass),
    trail: [],
  };
}

export function resetIdCounter() {
  nextId = 0;
}

function massToRadius(mass: number): number {
  return Math.max(3, Math.pow(mass, 0.4) * 1.5);
}

function massToColor(mass: number): string {
  if (mass < 20) return "#88ccff";
  if (mass < 60) return "#ffdd44";
  if (mass < 150) return "#ff8844";
  if (mass < 400) return "#ff4466";
  return "#dd66ff";
}

function computeAccelerations(bodies: Body[]) {
  for (const b of bodies) {
    b.acc.x = 0;
    b.acc.y = 0;
  }

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i];
      const b = bodies[j];
      const dx = b.pos.x - a.pos.x;
      const dy = b.pos.y - a.pos.y;
      const distSq = dx * dx + dy * dy + SOFTENING * SOFTENING;
      const dist = Math.sqrt(distSq);
      const force = G / distSq;

      const fx = force * (dx / dist);
      const fy = force * (dy / dist);

      a.acc.x += fx * b.mass;
      a.acc.y += fy * b.mass;
      b.acc.x -= fx * a.mass;
      b.acc.y -= fy * a.mass;
    }
  }
}

export function step(bodies: Body[], dt: number): Body[] {
  // Velocity Verlet - half step velocity
  for (const b of bodies) {
    b.vel.x += b.acc.x * dt * 0.5;
    b.vel.y += b.acc.y * dt * 0.5;
  }

  // Update positions
  for (const b of bodies) {
    b.pos.x += b.vel.x * dt;
    b.pos.y += b.vel.y * dt;
  }

  // Recompute accelerations at new positions
  computeAccelerations(bodies);

  // Complete velocity step
  for (const b of bodies) {
    b.vel.x += b.acc.x * dt * 0.5;
    b.vel.y += b.acc.y * dt * 0.5;
  }

  // Store trail points
  for (const b of bodies) {
    b.trail.push({ x: b.pos.x, y: b.pos.y });
    if (b.trail.length > MAX_TRAIL) {
      b.trail.shift();
    }
  }

  // Collision detection & merging
  return resolveCollisions(bodies);
}

function resolveCollisions(bodies: Body[]): Body[] {
  const merged = new Set<number>();
  const result: Body[] = [];

  for (let i = 0; i < bodies.length; i++) {
    if (merged.has(i)) continue;

    let current = bodies[i];

    for (let j = i + 1; j < bodies.length; j++) {
      if (merged.has(j)) continue;

      const other = bodies[j];
      const dx = other.pos.x - current.pos.x;
      const dy = other.pos.y - current.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = current.radius + other.radius;

      if (dist < minDist) {
        // Inelastic collision - conserve momentum
        const totalMass = current.mass + other.mass;
        const newVx =
          (current.vel.x * current.mass + other.vel.x * other.mass) /
          totalMass;
        const newVy =
          (current.vel.y * current.mass + other.vel.y * other.mass) /
          totalMass;
        const newX =
          (current.pos.x * current.mass + other.pos.x * other.mass) /
          totalMass;
        const newY =
          (current.pos.y * current.mass + other.pos.y * other.mass) /
          totalMass;

        current = createBody(newX, newY, newVx, newVy, totalMass);
        current.trail = bodies[i].trail;
        merged.add(j);
      }
    }

    result.push(current);
  }

  return result;
}
