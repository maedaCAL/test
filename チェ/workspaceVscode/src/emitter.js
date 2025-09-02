// 弾幕のEmitter戦略（Straight/Aimed）
// すべて時間基準で更新（dt: 秒）。shotIntervalMsを減算して0以下で発射。

import { spawnBullet } from './bullet.js';

export function StraightEmitter(config) {
  // config: { intervalMs, speed, angleDeg }
  const c = Object.assign({ intervalMs:700, speed:180, angleDeg: 90 }, config||{});
  let timer = c.intervalMs;

  return {
    update(dt, origin, world) {
      timer -= dt*1000;
      if (timer <= 0) {
        timer += c.intervalMs;
        const rad = c.angleDeg * Math.PI/180;
        const vx = Math.cos(rad) * c.speed;
        const vy = Math.sin(rad) * c.speed;
        spawnBullet(world, origin.x, origin.y, vx, vy, 'enemy');
      }
    }
  };
}

export function AimedEmitter(config) {
  // config: { intervalMs, speed }
  const c = Object.assign({ intervalMs:900, speed:180 }, config||{});
  let timer = c.intervalMs;

  return {
    update(dt, origin, world) {
      timer -= dt*1000;
      if (timer <= 0) {
        timer += c.intervalMs;
        const p = world.player;
        const dx = p.x - origin.x;
        const dy = p.y - origin.y;
        const len = Math.hypot(dx, dy) || 1;
        const vx = (dx/len) * c.speed;
        const vy = (dy/len) * c.speed;
        spawnBullet(world, origin.x, origin.y, vx, vy, 'enemy');
      }
    }
  };
}
