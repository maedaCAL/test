// ゲームワールド：プレイヤー、敵、弾、ウェーブ/ステージ進行（時間基準）
// ステージは固定時間を例示（例：30秒）。敵は一定周期でスポーン。

import { createPlayer } from './player.js';
import { spawnEnemy } from './enemy.js';
import { updateBullets, renderBullets } from './bullet.js';
import { getStageMultiplier, getState } from './main.js';

export function createGame(canvas, STATE) {
  const world = {
    boundW: canvas.width,
    boundH: canvas.height,
    player: null,
    bullets: [],
    enemies: [],
    // ステージ進行
    stageTimer: 0,
    stageLimit: 15,  // 30秒でクリア例
    spawnTimer: 0,
    spawnMs: 10000,   // 敵スポーン周期（倍率で短縮）
  };

  // プレイヤー初期化（タイプA/B）
  const type = STATE.selectedType===1 ? 'B' : 'A';
  world.player = createPlayer({ x: canvas.width/2, y: canvas.height-80, type });

  // ステージ倍率適用：スポーン間隔短縮
  const mult = getStageMultiplier();
  world.spawnMs = Math.max(500, 10000 / mult);

  // HUD用に共有変数を更新
  STATE.__playerHP = world.player.hp;
  STATE.__stageTimer = world.stageTimer;
  STATE.__stageLimit = world.stageLimit;

  // 公開API
  world.update = function(dt, input) {
    const p = world.player;
    p.update(dt, input, world);
    updateBullets(world, dt);

    // 敵更新
    for (const e of world.enemies) {
      if (!e.alive) continue;
      e.update(dt, world);
    }
    world.enemies = world.enemies.filter(e=>e.alive);

    // 敵スポーン（時間基準）
    world.spawnTimer -= dt*1000;
    if (world.spawnTimer <= 0) {
      world.spawnTimer = world.spawnMs;
      // 画面上部にランダム出現
      const x = 40 + Math.random() * (world.boundW - 80);
      const y = -12;
      spawnEnemy(world, x, y, mult);
    }

    // ステージタイマー
    world.stageTimer += dt;
    STATE.__playerHP = p.hp;
    STATE.__stageTimer = world.stageTimer;
    STATE.__stageLimit = world.stageLimit;

    // ゲームオーバー判定
    if (!p.alive || p.hp <= 0) return 'GAME_OVER';

    // クリア判定（時間到達）
    if (world.stageTimer >= world.stageLimit) {
      return 'STAGE_CLEAR';
    }
    return null;
  };

  world.render = function(g) {
    // 背景（簡易グリッド）
    g.strokeStyle = 'rgba(255,255,255,0.05)';
    g.lineWidth = 1;
    for (let y=0; y<world.boundH; y+=32) {
      g.beginPath(); g.moveTo(0,y); g.lineTo(world.boundW,y); g.stroke();
    }
    for (let x=0; x<world.boundW; x+=32) {
      g.beginPath(); g.moveTo(x,0); g.lineTo(x,world.boundH); g.stroke();
    }

    // 弾→敵→プレイヤー
    renderBullets(g, world);
    for (const e of world.enemies) e.render(g);
    world.player.render(g);
  };

  return world;
}
