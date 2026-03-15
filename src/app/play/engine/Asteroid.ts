export interface AsteroidState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  size: 'large' | 'medium' | 'small';
  vertices: { x: number; y: number }[];
  rotation: number;
  rotationSpeed: number;
  id: number;
  isDestroyed?: boolean;
  destroy?: () => void;
}

const SIZES = {
  large: { radius: 40, speed: [30, 60] as const },
  medium: { radius: 25, speed: [50, 90] as const },
  small: { radius: 12, speed: [70, 120] as const },
};

let nextId = 0;

function generateVertices(radius: number, count = 10): { x: number; y: number }[] {
  const verts = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const r = radius * (0.7 + Math.random() * 0.3);
    verts.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
  }
  return verts;
}

export function createAsteroid(
  x: number, y: number,
  size: 'large' | 'medium' | 'small',
  vx?: number, vy?: number
): AsteroidState {
  const s = SIZES[size];
  const angle = Math.random() * Math.PI * 2;
  const speed = s.speed[0] + Math.random() * (s.speed[1] - s.speed[0]);
  const a: AsteroidState = {
    x, y,
    vx: vx ?? Math.cos(angle) * speed,
    vy: vy ?? Math.sin(angle) * speed,
    radius: s.radius, size,
    vertices: generateVertices(s.radius),
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 2,
    id: nextId++,
  };
  a.destroy = () => { a.isDestroyed = true; };
  return a;
}

export function splitAsteroid(a: AsteroidState): AsteroidState[] {
  if (a.size === 'small') return [];
  const next = a.size === 'large' ? 'medium' as const : 'small' as const;
  const results: AsteroidState[] = [];
  for (let i = 0; i < 2; i++) {
    const ang = Math.random() * Math.PI * 2;
    const spd = 40 + Math.random() * 60;
    results.push(createAsteroid(a.x, a.y, next, Math.cos(ang) * spd, Math.sin(ang) * spd));
  }
  return results;
}

export function updateAsteroid(a: AsteroidState, dt: number, w: number, h: number) {
  a.x += a.vx * dt;
  a.y += a.vy * dt;
  a.rotation += a.rotationSpeed * dt;
  a.x = ((a.x % w) + w) % w;
  a.y = ((a.y % h) + h) % h;
}

export function renderAsteroid(ctx: CanvasRenderingContext2D, a: AsteroidState) {
  ctx.save();
  ctx.translate(a.x, a.y);
  ctx.rotate(a.rotation);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(a.vertices[0].x, a.vertices[0].y);
  for (let i = 1; i < a.vertices.length; i++) {
    ctx.lineTo(a.vertices[i].x, a.vertices[i].y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

export function spawnAsteroidFromEdge(w: number, h: number): AsteroidState {
  const edge = Math.floor(Math.random() * 4);
  let x: number, y: number;
  switch (edge) {
    case 0: x = Math.random() * w; y = -50; break;
    case 1: x = w + 50; y = Math.random() * h; break;
    case 2: x = Math.random() * w; y = h + 50; break;
    default: x = -50; y = Math.random() * h; break;
  }
  const tx = w * (0.25 + Math.random() * 0.5);
  const ty = h * (0.25 + Math.random() * 0.5);
  const angle = Math.atan2(ty - y, tx - x) + (Math.random() - 0.5) * 0.5;
  const speed = 30 + Math.random() * 40;
  return createAsteroid(x, y, 'large', Math.cos(angle) * speed, Math.sin(angle) * speed);
}
