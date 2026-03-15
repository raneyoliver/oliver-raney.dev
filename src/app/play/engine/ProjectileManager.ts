export interface ProjectileDef {
  name: string;
  speed?: number;
  size?: number;
  range?: number;
  damage?: number;
  color?: string;
  trailColor?: string;
  shape?: 'circle' | 'rect' | 'triangle';
  spread?: number;
  count?: number;
  cooldown?: number;
  piercing?: boolean;
  spawnOffset?: number;
  render?: (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, size: number) => void;
}

export interface ResolvedProjectileDef {
  name: string;
  speed: number;
  size: number;
  range: number;
  damage: number;
  color: string;
  trailColor?: string;
  shape: 'circle' | 'rect' | 'triangle';
  spread: number;
  count: number;
  cooldown: number;
  piercing: boolean;
  spawnOffset: number;
  render?: (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, size: number) => void;
}

export interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  def: ResolvedProjectileDef;
  distanceTraveled: number;
  id: number;
}

let nextId = 0;

export class ProjectileManager {
  private defs = new Map<string, ResolvedProjectileDef>();
  projectiles: Projectile[] = [];
  private cooldowns = new Map<string, number>();

  registerProjectile(def: ProjectileDef) {
    const full: ResolvedProjectileDef = {
      speed: 400,
      size: 4,
      range: 500,
      damage: 1,
      color: '#ffff00',
      shape: 'circle',
      spread: 0,
      count: 1,
      cooldown: 200,
      piercing: false,
      spawnOffset: 0,
      ...def,
      name: def.name,
    };
    this.defs.set(def.name, full);
  }

  fire(name: string, x: number, y: number, angle: number): boolean {
    const def = this.defs.get(name);
    if (!def) return false;
    const now = performance.now();
    const last = this.cooldowns.get(name) || 0;
    if (now - last < (def.cooldown || 200)) return false;
    this.cooldowns.set(name, now);

    const count = def.count || 1;
    const spreadRad = (def.spread || 0) * Math.PI / 180;
    for (let i = 0; i < count; i++) {
      let a = angle;
      if (count > 1) a += (i / (count - 1) - 0.5) * spreadRad;
      else if (spreadRad > 0) a += (Math.random() - 0.5) * spreadRad;

      const spawnX = x + Math.cos(angle) * def.spawnOffset;
      const spawnY = y + Math.sin(angle) * def.spawnOffset;

      this.projectiles.push({
        x: spawnX, y: spawnY,
        vx: Math.cos(a) * def.speed,
        vy: Math.sin(a) * def.speed,
        def, distanceTraveled: 0, id: nextId++,
      });
    }
    return true;
  }

  update(dt: number) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      const dx = p.vx * dt;
      const dy = p.vy * dt;
      p.x += dx;
      p.y += dy;
      p.distanceTraveled += Math.hypot(dx, dy);
      if (p.distanceTraveled > p.def.range) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    for (const p of this.projectiles) {
      if (p.def.render) {
        p.def.render(ctx, p.x, p.y, Math.atan2(p.vy, p.vx), p.def.size);
        continue;
      }
      ctx.save();
      if (p.def.trailColor) {
        const ang = Math.atan2(p.vy, p.vx);
        const len = p.def.size * 3;
        ctx.strokeStyle = p.def.trailColor;
        ctx.lineWidth = p.def.size * 0.6;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - Math.cos(ang) * len, p.y - Math.sin(ang) * len);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = p.def.color;
      ctx.shadowColor = p.def.color;
      ctx.shadowBlur = p.def.size * 2;
      const shape = p.def.shape || 'circle';
      if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.def.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (shape === 'rect') {
        const ang = Math.atan2(p.vy, p.vx);
        ctx.translate(p.x, p.y);
        ctx.rotate(ang);
        ctx.fillRect(-p.def.size, -p.def.size / 2, p.def.size * 2, p.def.size);
      } else if (shape === 'triangle') {
        const ang = Math.atan2(p.vy, p.vx);
        ctx.translate(p.x, p.y);
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.moveTo(p.def.size, 0);
        ctx.lineTo(-p.def.size, -p.def.size * 0.7);
        ctx.lineTo(-p.def.size, p.def.size * 0.7);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
  }

  removeProjectile(id: number) {
    const idx = this.projectiles.findIndex(p => p.id === id);
    if (idx !== -1 && !this.projectiles[idx].def.piercing) {
      this.projectiles.splice(idx, 1);
    }
  }

  clear() { this.projectiles = []; }
  clearRegistrations() {
    this.defs.clear();
    this.cooldowns.clear();
    this.projectiles = [];
  }
}
