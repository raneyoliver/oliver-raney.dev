export interface CollisionRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function computeHullFromDOM(container: HTMLElement): CollisionRect[] {
  const rects: CollisionRect[] = [];
  const cr = container.getBoundingClientRect();
  const cx = cr.width / 2;
  const cy = cr.height / 2;

  const elements = container.querySelectorAll('*');
  elements.forEach(el => {
    if (el.tagName === 'STYLE' || el.tagName === 'SCRIPT') return;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0' || style.pointerEvents === 'none') return;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return;
    rects.push({
      x: r.left - cr.left - cx,
      y: r.top - cr.top - cy,
      w: r.width,
      h: r.height,
    });
  });

  return rects.filter(r => r.w > 3 && r.h > 3);
}

export function checkCreationVsAsteroids(
  hull: CollisionRect[],
  px: number, py: number, pAngle: number,
  asteroids: Array<{ x: number; y: number; radius: number; id: number }>
): number[] {
  const hits: number[] = [];
  const cos = Math.cos(-pAngle);
  const sin = Math.sin(-pAngle);

  for (const a of asteroids) {
    const dx = a.x - px;
    const dy = a.y - py;
    const lx = cos * dx - sin * dy;
    const ly = sin * dx + cos * dy;

    for (const rect of hull) {
      const closestX = Math.max(rect.x, Math.min(lx, rect.x + rect.w));
      const closestY = Math.max(rect.y, Math.min(ly, rect.y + rect.h));
      const distSq = (lx - closestX) ** 2 + (ly - closestY) ** 2;
      if (distSq <= a.radius * a.radius) {
        hits.push(a.id);
        break;
      }
    }
  }
  return hits;
}

export function checkProjectileVsAsteroids(
  projectiles: Array<{ x: number; y: number; id: number; def: { size: number } }>,
  asteroids: Array<{ x: number; y: number; radius: number; id: number }>
): Array<{ projectileId: number; asteroidId: number }> {
  const hits: Array<{ projectileId: number; asteroidId: number }> = [];
  for (const p of projectiles) {
    for (const a of asteroids) {
      if (Math.hypot(p.x - a.x, p.y - a.y) < p.def.size + a.radius) {
        hits.push({ projectileId: p.id, asteroidId: a.id });
        break;
      }
    }
  }
  return hits;
}
