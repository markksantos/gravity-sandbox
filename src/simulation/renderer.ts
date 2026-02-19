import type { Body, Vector } from "./types";

let stars: Vector[] = [];

export function initStars(width: number, height: number) {
  stars = [];
  for (let i = 0; i < 300; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
    });
  }
}

export function render(
  ctx: CanvasRenderingContext2D,
  bodies: Body[],
  width: number,
  height: number,
  showTrails: boolean,
  spawnPreview: {
    start: Vector;
    current: Vector;
    mass: number;
  } | null
) {
  // Clear
  ctx.fillStyle = "#0a0a1a";
  ctx.fillRect(0, 0, width, height);

  // Stars
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  for (const star of stars) {
    ctx.fillRect(star.x, star.y, 1, 1);
  }

  // Trails
  if (showTrails) {
    for (const body of bodies) {
      if (body.trail.length < 2) continue;

      for (let i = 1; i < body.trail.length; i++) {
        const alpha = (i / body.trail.length) * 0.5;
        ctx.strokeStyle = body.color
          .replace(")", `, ${alpha})`)
          .replace("rgb", "rgba")
          .replace("#", "");

        // Convert hex to rgba for alpha support
        ctx.strokeStyle = hexToRgba(body.color, alpha);
        ctx.lineWidth = Math.max(1, body.radius * 0.3);
        ctx.beginPath();
        ctx.moveTo(body.trail[i - 1].x, body.trail[i - 1].y);
        ctx.lineTo(body.trail[i].x, body.trail[i].y);
        ctx.stroke();
      }
    }
  }

  // Bodies
  for (const body of bodies) {
    // Glow
    ctx.save();
    ctx.shadowColor = body.color;
    ctx.shadowBlur = body.radius * 2;

    // Radial gradient
    const gradient = ctx.createRadialGradient(
      body.pos.x,
      body.pos.y,
      0,
      body.pos.x,
      body.pos.y,
      body.radius
    );
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.3, body.color);
    gradient.addColorStop(1, hexToRgba(body.color, 0.2));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(body.pos.x, body.pos.y, body.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Spawn preview (slingshot arrow)
  if (spawnPreview) {
    const { start, current, mass } = spawnPreview;
    const previewRadius = Math.max(3, Math.pow(mass, 0.4) * 1.5);

    // Preview body
    ctx.save();
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.arc(start.x, start.y, previewRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Velocity arrow (reversed - drag away to launch toward)
    const dx = start.x - current.x;
    const dy = start.y - current.y;
    const len = Math.sqrt(dx * dx + dy * dy);

    if (len > 5) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(start.x + dx, start.y + dy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrowhead
      const angle = Math.atan2(dy, dx);
      const arrowLen = 10;
      const tipX = start.x + dx;
      const tipY = start.y + dy;
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(
        tipX - arrowLen * Math.cos(angle - 0.4),
        tipY - arrowLen * Math.sin(angle - 0.4)
      );
      ctx.lineTo(
        tipX - arrowLen * Math.cos(angle + 0.4),
        tipY - arrowLen * Math.sin(angle + 0.4)
      );
      ctx.closePath();
      ctx.fill();
    }
  }
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
