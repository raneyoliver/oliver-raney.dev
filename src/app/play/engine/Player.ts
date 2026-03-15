export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  hearts: number;
  maxHearts: number;
  invincible: boolean;
  invincibleTimer: number;
  alive: boolean;
  hasCreation: boolean;
  angularVelocity: number;
  thrust: number;
  maxSpeed: number;
}

const THRUST = 250;
const DAMPING = 0.4;
const MAX_SPEED = 350;
const INVINCIBILITY_DURATION = 2.0;
const ROTATION_SENSITIVITY = 0.004;

export class Player {
  state: PlayerState;
  private keys = new Set<string>();

  constructor(x: number, y: number) {
    this.state = {
      x, y, vx: 0, vy: 0,
      angle: -Math.PI / 2,
      hearts: 3, maxHearts: 3,
      invincible: false, invincibleTimer: 0,
      alive: true, hasCreation: false,
      angularVelocity: 0,
      thrust: THRUST,
      maxSpeed: MAX_SPEED,
    };
  }

  makeInvincible(duration: number) {
    this.state.invincible = true;
    this.state.invincibleTimer = Math.max(this.state.invincibleTimer, duration);
  }

  update(dt: number, w: number, h: number) {
    if (this.keys.has('w')) this.state.vy -= this.state.thrust * dt;
    if (this.keys.has('s')) this.state.vy += this.state.thrust * dt;
    if (this.keys.has('a')) this.state.vx -= this.state.thrust * dt;
    if (this.keys.has('d')) this.state.vx += this.state.thrust * dt;

    const df = Math.pow(DAMPING, dt);
    this.state.vx *= df;
    this.state.vy *= df;

    const speed = Math.hypot(this.state.vx, this.state.vy);
    if (speed > this.state.maxSpeed) {
      const s = this.state.maxSpeed / speed;
      this.state.vx *= s;
      this.state.vy *= s;
    }

    this.state.x += this.state.vx * dt;
    this.state.y += this.state.vy * dt;
    this.state.x = ((this.state.x % w) + w) % w;
    this.state.y = ((this.state.y % h) + h) % h;

    if (this.state.invincible) {
      this.state.invincibleTimer -= dt;
      if (this.state.invincibleTimer <= 0) {
        this.state.invincible = false;
      }
    }

    // Decay angular velocity toward zero (friction)
    this.state.angularVelocity *= 0.8;
  }

  rotate(movementX: number) {
    const delta = movementX * ROTATION_SENSITIVITY;
    this.state.angle += delta;
    this.state.angularVelocity = delta * 60; // Approximate rads/sec across frames
  }

  hit(): boolean {
    if (this.state.invincible || !this.state.alive) return false;
    this.state.hearts--;
    if (this.state.hearts <= 0) {
      this.state.alive = false;
      return true;
    }
    this.state.invincible = true;
    this.state.invincibleTimer = INVINCIBILITY_DURATION;
    return false;
  }

  keyDown(key: string) { this.keys.add(key.toLowerCase()); }
  keyUp(key: string) { this.keys.delete(key.toLowerCase()); }

  reset(x: number, y: number) {
    this.state = {
      x, y, vx: 0, vy: 0,
      angle: -Math.PI / 2,
      hearts: 3, maxHearts: 3,
      invincible: false, invincibleTimer: 0,
      alive: true, hasCreation: false,
      angularVelocity: 0,
      thrust: THRUST,
      maxSpeed: MAX_SPEED,
    };
    this.keys.clear();
  }

  resetHearts() {
    this.state.hearts = 3;
    this.state.alive = true;
  }
}
