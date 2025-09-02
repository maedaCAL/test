// 弾の生成と更新/描画/衝突。プレイヤー/敵で発色を切替
import { circleHit } from './collision.js';
import { addScore } from './main.js';

export function spawnBullet(world, x, y, vx, vy, side='enemy') {
  world.bullets.push({
    x, y, vx, vy,
    rDraw: 4, rHit: 3,
    side,
    alive: true,
  });
}

export function updateBullets(world, dt) {
  const W = world.boundW, H = world.boundH;
  for (const b of world.bullets) {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    // 画面外で消去
    if (b.x < -16 || b.x > W+16 || b.y < -16 || b.y > H+16) b.alive = false;
  }
  // 衝突：敵弾→プレイヤー / 自弾→敵
  for (const b of world.bullets) {
    if (!b.alive) continue;
    if (b.side === 'enemy') {
      const p = world.player;
      if (!p.inv && circleHit(b.x,b.y,b.rHit, p.x,p.y,p.rHit)) {
        p.damage(1);
        b.alive = false;
      }
    } else {
      // player bullet vs enemies
      for (const e of world.enemies) {
        if (!e.alive) continue;
        if (circleHit(b.x,b.y,b.rHit, e.x,e.y,e.rHit)) {
          e.hp -= 1;
          b.alive = false;
          addScore(50); // 敵ヒットで +50
          if (e.hp <= 0) e.alive = false;
          break;
        }
      }
    }
  }
  world.bullets = world.bullets.filter(b=>b.alive);
}

export function renderBullets(g, world) {
  for (const b of world.bullets) {
    g.fillStyle = (b.side === 'enemy') ? '#f44' : '#7cf';
    g.beginPath();
    g.arc(b.x, b.y, b.rDraw, 0, Math.PI*2);
    g.fill();
  }
}
