// プレイヤー（タイプA/B）: 時間基準の移動、連射クールダウン、無敵時間を持つ
import { spawnBullet } from './bullet.js';

export function createPlayer(config) {
  // config: { x, y, type:'A'|'B' }
  const typeA = { hp:5, speed: 2.8*60, shotMs:100 };  // 速度はpx/s換算のため60倍
  const typeB = { hp:8, speed: 2.2*60, shotMs:130 };
  const base = (config.type==='B') ? typeB : typeA;

  const p = {
    x: config.x|0, y: config.y|0,
    rDraw: 6, rHit: 4,
    hp: base.hp,
    speed: base.speed, // px/s
    shotIntervalMs: base.shotMs,
    shotTimer: 0,
    inv: false,
    invTimer: 0,
    invMs: 800, // 無敵 0.8秒
    alive: true,
  };

  p.update = function(dt, input, world) {
    // 入力：▲▼◀▶ / Shiftで速度0.5倍
    let vx = 0, vy = 0;
    if (input.pressed('ArrowUp')) vy -= 1;
    if (input.pressed('ArrowDown')) vy += 1;
    if (input.pressed('ArrowLeft')) vx -= 1;
    if (input.pressed('ArrowRight')) vx += 1;
    const len = Math.hypot(vx, vy) || 1;
    let sp = p.speed;
    if (input.pressed('Shift')) sp *= 0.5;
    p.x += (vx/len) * sp * dt;
    p.y += (vy/len) * sp * dt;

    // 画面端クランプ
    p.x = Math.max(8, Math.min(world.boundW-8, p.x));
    p.y = Math.max(8, Math.min(world.boundH-8, p.y));

    // 連射クールダウン(Zキー)
    p.shotTimer -= dt*1000;
    if (input.pressed('z') || input.pressed('Z')) {
      if (p.shotTimer <= 0) {
        p.shotTimer = p.shotIntervalMs;
        // 上方向に自弾
        spawnBullet(world, p.x, p.y-6, 0, -360, 'player');
      }
    }

    // 無敵時間
    if (p.inv) {
      p.invTimer -= dt*1000;
      if (p.invTimer <= 0) p.inv = false;
    }
  };

  p.damage = function(n) {
    if (p.inv) return;
    p.hp -= n|0;
    if (p.hp <= 0) {
      p.alive = false;
    } else {
      p.inv = true;
      p.invTimer = p.invMs;
    }
  };

  p.render = function(g) {
    // 無敵中は点滅
    if (p.inv && Math.floor(p.invTimer/100)%2===0) return;
    g.fillStyle = '#fff';
    g.beginPath();
    g.arc(p.x, p.y, p.rDraw, 0, Math.PI*2);
    g.fill();
  };

  return p;
}
