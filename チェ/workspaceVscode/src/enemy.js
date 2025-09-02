// 敵：ステージ倍率によりHP/発射頻度/弾速をスケール
import { StraightEmitter, AimedEmitter } from './emitter.js';

export function spawnEnemy(world, x, y, mult) {
  const baseHp = 10;
  // ステージ倍率でhpや弾性質をスケール
  const e = {
    x, y,
    rDraw: 8, rHit: 7,
    hp: Math.floor(baseHp * mult * 0.5),
    alive: true,
    emitters: [
      StraightEmitter({ intervalMs: Math.max(250, 7000 / mult), speed: 10*mult, angleDeg: 90 }),
      AimedEmitter({ intervalMs: Math.max(300, 9000 / mult), speed: 12*mult }),
    ],
    update(dt, world) {
      // エミッタ更新（原点は敵位置）
      for (const em of e.emitters) em.update(dt, {x:e.x, y:e.y}, world);
      // 簡易移動：下方向へゆっくり
      e.y += 30*dt;
      if (e.y > world.boundH + 20) e.alive = false;
    },
    render(g) {
      g.fillStyle = '#f80';
      g.beginPath();
      g.arc(e.x, e.y, e.rDraw, 0, Math.PI*2);
      g.fill();
    }
  };
  world.enemies.push(e);
}
