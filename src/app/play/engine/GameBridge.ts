import { ProjectileDef } from './ProjectileManager';

export type GameKeyCallback = (pressed: boolean) => void;
export type GameClickCallback = () => void;
/* eslint-disable @typescript-eslint/no-explicit-any */
export type GameFrameCallback = (state: { player: any; asteroids: any[]; projectiles: any[]; game: any }) => void;
/* eslint-enable */

const BLOCKED_KEYS = new Set(['w', 'a', 's', 'd', 'escape', 'tab']);

export class GameBridge {
  private keyCallbacks = new Map<string, GameKeyCallback>();
  private clickCallbacks = new Map<string, GameClickCallback>();
  private frameCallbacks = new Set<GameFrameCallback>();
  private engineCallbacks: {
    registerProjectile: (def: ProjectileDef) => void;
    fire: (name: string) => void;
    getPlayerAngle: () => number;
    getPlayerPosition: () => { x: number; y: number };
  };

  constructor(callbacks: typeof GameBridge.prototype.engineCallbacks) {
    this.engineCallbacks = callbacks;
    this.install();
  }

  private install() {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (window as any).gameAPI = {
      registerProjectile: (def: ProjectileDef) => this.engineCallbacks.registerProjectile(def),
      fire: (name: string) => this.engineCallbacks.fire(name),
      onGameKey: (key: string, callback: GameKeyCallback) => {
        const k = key.toLowerCase();
        if (BLOCKED_KEYS.has(k)) { console.warn(`gameAPI: "${k}" is reserved`); return; }
        this.keyCallbacks.set(k, callback);
      },
      onGameClick: (button: 'left' | 'right' | 'middle', callback: GameClickCallback) => {
        this.clickCallbacks.set(button, callback);
      },
      onFrame: (callback: GameFrameCallback) => {
        this.frameCallbacks.add(callback);
      },
      getPlayerAngle: () => this.engineCallbacks.getPlayerAngle(),
      getPlayerPosition: () => this.engineCallbacks.getPlayerPosition(),
    };
    /* eslint-enable */
  }

  handleKeyDown(key: string): boolean {
    const cb = this.keyCallbacks.get(key.toLowerCase());
    if (cb) { cb(true); return true; }
    return false;
  }

  handleKeyUp(key: string): boolean {
    const cb = this.keyCallbacks.get(key.toLowerCase());
    if (cb) { cb(false); return true; }
    return false;
  }

  handleClick(button: number): boolean {
    const names = ['left', 'middle', 'right'];
    const cb = this.clickCallbacks.get(names[button]);
    if (cb) { cb(); return true; }
    return false;
  }

  clearRegistrations() {
    this.keyCallbacks.clear();
    this.clickCallbacks.clear();
    this.frameCallbacks.clear();
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  triggerFrame(state: { player: any; asteroids: any[]; projectiles: any[]; game: any }) {
    for (const cb of this.frameCallbacks) {
      try {
        cb(state);
      } catch (err) {
        console.error('LLM onFrame callback error:', err);
      }
    }
  }
  /* eslint-enable */

  destroy() {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    delete (window as any).gameAPI;
    /* eslint-enable */
    this.keyCallbacks.clear();
    this.clickCallbacks.clear();
    this.frameCallbacks.clear();
  }
}
