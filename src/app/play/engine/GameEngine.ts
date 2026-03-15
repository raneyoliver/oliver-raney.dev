import { Player } from './Player';
import { AsteroidState, updateAsteroid, renderAsteroid, spawnAsteroidFromEdge, splitAsteroid } from './Asteroid';
import { ProjectileManager, ProjectileDef } from './ProjectileManager';
import { CollisionRect, checkCreationVsAsteroids, checkProjectileVsAsteroids } from './CollisionSystem';
import { GameBridge } from './GameBridge';

export type GameState = 'waiting' | 'playing' | 'slowmo' | 'paused' | 'gameover';

export interface GameCallbacks {
  onTimerChange: (time: number) => void;
  onScoreChange: (score: number) => void;
  onHeartsChange: (hearts: number) => void;
  onStateChange: (state: GameState) => void;
  onPlayerMove: (x: number, y: number, angle: number) => void;
  onHit: () => void;
  onSlowMo: () => void;
}

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; color: string; size: number;
}

const INITIAL_ASTEROIDS = 4;
const SPAWN_BASE = 5;
const SPAWN_MIN = 1.5;
const SPAWN_DECREASE = 0.05;
const TIMER_DURATION = 30;
const SLOWMO_SCALE = 0.05;

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  player: Player;
  private asteroids: AsteroidState[] = [];
  projectileManager: ProjectileManager;
  private bridge: GameBridge;

  private state: GameState = 'waiting';
  private timeScale = 1.0;
  private timer = TIMER_DURATION;
  private score = 0;

  private creationHull: CollisionRect[] = [];
  private particles: Particle[] = [];
  private stars: { x: number; y: number; b: number }[] = [];

  private lastTime = 0;
  private animFrameId = 0;
  private spawnTimer = 0;
  private spawnInterval = SPAWN_BASE;

  private callbacks: GameCallbacks;

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.callbacks = callbacks;

    this.player = new Player(canvas.width / 2, canvas.height / 2);
    this.projectileManager = new ProjectileManager();
    this.bridge = new GameBridge({
      registerProjectile: (def: ProjectileDef) => this.projectileManager.registerProjectile(def),
      fire: (name: string) => this.projectileManager.fire(
        name, this.player.state.x, this.player.state.y, this.player.state.angle
      ),
      getPlayerAngle: () => this.player.state.angle,
      getPlayerPosition: () => ({ x: this.player.state.x, y: this.player.state.y }),
    });

    this.generateStars();
    this.spawnInitial();
  }

  private generateStars() {
    this.stars = [];
    for (let i = 0; i < 100; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        b: 0.2 + Math.random() * 0.6,
      });
    }
  }

  private spawnInitial() {
    for (let i = 0; i < INITIAL_ASTEROIDS; i++) {
      this.asteroids.push(spawnAsteroidFromEdge(this.canvas.width, this.canvas.height));
    }
  }

  resize(w: number, h: number) {
    this.canvas.width = w;
    this.canvas.height = h;
    this.generateStars();
  }

  startCreation() {
    this.state = 'playing';
    this.timeScale = 1.0;
    this.timer = TIMER_DURATION;
    this.player.state.hasCreation = true;
    this.callbacks.onStateChange(this.state);
    this.callbacks.onTimerChange(this.timer);
  }

  startLoop() {
    if (!this.animFrameId) {
      this.lastTime = performance.now();
      this.loop();
    }
  }

  pause() {
    this.state = 'paused';
    this.callbacks.onStateChange(this.state);
  }

  resume() {
    if (this.state === 'paused') {
      this.state = this.timer <= 0 ? 'slowmo' : (this.player.state.hasCreation ? 'playing' : 'waiting');
      this.lastTime = performance.now();
      this.callbacks.onStateChange(this.state);
    }
  }

  private loop = () => {
    const now = performance.now();
    let rawDt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    if (rawDt > 0.1) rawDt = 0.1;

    if (this.state !== 'paused' && this.state !== 'gameover') {
      const dt = rawDt * this.timeScale;
      this.update(dt, rawDt);
    }

    this.render();
    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number, rawDt: number) {
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.player.update(dt, w, h);
    this.callbacks.onPlayerMove(this.player.state.x, this.player.state.y, this.player.state.angle);

    for (const a of this.asteroids) updateAsteroid(a, dt, w, h);
    this.projectileManager.update(dt);
    this.updateParticles(dt);

    // Timer countdown (real time)
    if (this.state === 'playing' && this.player.state.hasCreation) {
      this.timer -= rawDt;
      if (this.timer <= 0) {
        this.timer = 0;
        this.state = 'slowmo';
        this.timeScale = SLOWMO_SCALE;
        this.player.state.hasCreation = false;
        this.callbacks.onSlowMo();
        this.callbacks.onStateChange(this.state);
      }
      this.callbacks.onTimerChange(this.timer);
      
      // Call LLM hook
      this.bridge.triggerFrame({
        player: {
          ...this.player.state,
          makeInvincible: (d: number) => this.player.makeInvincible(d)
        },
        asteroids: this.asteroids,
        projectiles: this.projectileManager.projectiles,
      });

      // Handle any LLM-triggered asteroid destructions
      for (let i = this.asteroids.length - 1; i >= 0; i--) {
        if (this.asteroids[i].isDestroyed) {
          this.handleAsteroidDestroyed(i);
        }
      }
    }

    // Spawn asteroids (real time, not scaled)
    if (this.state === 'playing' || this.state === 'slowmo') {
      this.spawnTimer += rawDt;
      if (this.spawnTimer >= this.spawnInterval) {
        this.spawnTimer = 0;
        this.asteroids.push(spawnAsteroidFromEdge(w, h));
      }
    }

    // Projectile vs asteroid collision
    const projHits = checkProjectileVsAsteroids(this.projectileManager.projectiles, this.asteroids);
    for (const hit of projHits) {
      this.projectileManager.removeProjectile(hit.projectileId);
      const aIdx = this.asteroids.findIndex(a => a.id === hit.asteroidId);
      if (aIdx !== -1) {
        this.handleAsteroidDestroyed(aIdx);
      }
    }

    // Creation vs asteroid collision
    if (this.creationHull.length > 0 && !this.player.state.invincible && this.player.state.hasCreation) {
      const creationHits = checkCreationVsAsteroids(
        this.creationHull, this.player.state.x, this.player.state.y,
        this.player.state.angle, this.asteroids
      );
      if (creationHits.length > 0) {
        const dead = this.player.hit();
        this.callbacks.onHeartsChange(this.player.state.hearts);
        this.callbacks.onHit();
        if (dead) {
          this.state = 'gameover';
          this.callbacks.onStateChange(this.state);
          this.spawnExplosion(this.player.state.x, this.player.state.y, 60);
        }
      }
    }
  }

  private handleAsteroidDestroyed(index: number) {
    const asteroid = this.asteroids[index];
    this.spawnExplosion(asteroid.x, asteroid.y, asteroid.radius);
    const children = splitAsteroid(asteroid);
    this.asteroids.splice(index, 1);
    this.asteroids.push(...children);
    this.score++;
    this.timer += 1;
    this.spawnInterval = Math.max(SPAWN_MIN, this.spawnInterval - SPAWN_DECREASE);
    this.callbacks.onScoreChange(this.score);
    this.callbacks.onTimerChange(this.timer);
  }

  private spawnExplosion(x: number, y: number, size: number) {
    const count = Math.floor(size / 3) + 5;
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 50 + Math.random() * 150;
      this.particles.push({
        x, y,
        vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
        life: 0.5 + Math.random() * 0.5,
        maxLife: 0.5 + Math.random() * 0.5,
        color: Math.random() > 0.5 ? '#ff6b6b' : '#ffff00',
        size: 1 + Math.random() * 3,
      });
    }
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  private render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    for (const s of this.stars) {
      ctx.fillStyle = `rgba(255,255,255,${s.b})`;
      ctx.fillRect(s.x, s.y, 1.5, 1.5);
    }

    for (const a of this.asteroids) renderAsteroid(ctx, a);
    this.projectileManager.render(ctx);

    for (const p of this.particles) {
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Ghost indicator when no creation
    if (!this.player.state.hasCreation && this.state !== 'gameover') {
      ctx.save();
      ctx.translate(this.player.state.x, this.player.state.y);
      ctx.rotate(this.player.state.angle);
      ctx.strokeStyle = '#ffffff44';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = '#ffffff66';
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(25, 0);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Input
  keyDown(key: string) {
    const k = key.toLowerCase();
    if (['w', 'a', 's', 'd'].includes(k)) this.player.keyDown(k);
    this.bridge.handleKeyDown(k);
  }

  keyUp(key: string) {
    const k = key.toLowerCase();
    if (['w', 'a', 's', 'd'].includes(k)) this.player.keyUp(k);
    this.bridge.handleKeyUp(k);
  }

  mouseMove(movementX: number) {
    this.player.rotate(movementX);
  }

  mouseDown(button: number) {
    this.bridge.handleClick(button);
  }

  setCreationHull(hull: CollisionRect[]) {
    this.creationHull = hull;
    this.player.state.hasCreation = true;
  }

  clearCreation() {
    this.creationHull = [];
    this.player.state.hasCreation = false;
    this.bridge.clearRegistrations();
    this.projectileManager.clearRegistrations();
  }

  getPlayerState() { return this.player.state; }
  getState() { return this.state; }
  getScore() { return this.score; }
  getTimer() { return this.timer; }

  reset() {
    this.player.reset(this.canvas.width / 2, this.canvas.height / 2);
    this.asteroids = [];
    this.particles = [];
    this.projectileManager.clearRegistrations();
    this.bridge.clearRegistrations();
    this.creationHull = [];
    this.state = 'waiting';
    this.timeScale = 1.0;
    this.timer = TIMER_DURATION;
    this.score = 0;
    this.spawnTimer = 0;
    this.spawnInterval = SPAWN_BASE;
    this.spawnInitial();
    this.callbacks.onStateChange(this.state);
    this.callbacks.onTimerChange(this.timer);
    this.callbacks.onScoreChange(this.score);
    this.callbacks.onHeartsChange(this.player.state.hearts);
  }

  destroy() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.bridge.destroy();
  }
}
