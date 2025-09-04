const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const hud = document.getElementById("hud");

// Global state
let player, bullets, enemies, enemyBullets, powerUps, frame, enemyFrame, gameOver, keys, score, lastLevel, levelUpTimer;
let started = false;
let lives, bombs, powerLevel, invincibleTimer;
let bgOffset1 = 0, bgOffset2 = 0;

function initState() {
  player = {
    x: canvas.width / 2,
    y: canvas.height - 80,
    r: 6,
    speed: 4,
    slowSpeed: 2
  };
  bullets = [];
  enemyBullets = [];
  enemies = [];
  powerUps = [];
  frame = 0;
  enemyFrame = 0;
  gameOver = false;
  keys = {};
  score = 0;
  lastLevel = 1;
  levelUpTimer = 0;
  lives = 3;      
  bombs = 3;      
  powerLevel = 1;
  invincibleTimer = 0;
  bgOffset1 = 0;
  bgOffset2 = 0;
}
initState();

// Input
window.addEventListener("keydown", e => {
  const controlKeys = ["KeyW","KeyA","KeyS","KeyD","Space","ShiftLeft","KeyR","Enter","KeyX"];
  if (controlKeys.includes(e.code)) e.preventDefault();
  if (!started && e.code === "Space") { started = true; return; }

  if (gameOver && (e.code === "KeyR" || e.code === "Enter")) {
    resetGame();
    return;
  }
  keys[e.code] = true;
});

window.addEventListener("keyup", e => {
  const controlKeys = ["KeyW","KeyA","KeyS","KeyD","Space","ShiftLeft","KeyX"];
  if (controlKeys.includes(e.code)) e.preventDefault();
  keys[e.code] = false;
});

function resetGame() {
  initState();
}

// Level grows with score
function getLevel() {
  return 1 + Math.floor(score / 20);
}

function rand(min, max) { return Math.random() * (max - min) + min; }

function spawnEnemy() {
  const minHp = Math.min(1 + Math.floor(score / 20), 4);
  const hpValue = minHp + Math.floor(Math.random() * (5 - minHp));
  const typeRand = Math.random();
  const type = typeRand < 0.25 ? "spread" : (typeRand < 0.6 ? "zig" : "grunt");

  enemies.push({
    x: rand(40, canvas.width - 40),
    y: -15,
    r: 10,
    hp: hpValue,
    dy: 1 + hpValue * 0.4,
    dx: (Math.random() < 0.5 ? -1 : 1) * (0.8 + Math.random()*0.8), 
    type,
    t: 0,
    shootCd: Math.floor(rand(30, 60))
  });
}

function checkCollision(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy) < a.r + b.r;
}

function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

function shootPlayerBullets() {
  const level = powerLevel;
  const baseSpeed = -10;
  const bx = player.x;
  const by = player.y - 10;

  // 모든 파워레벨에서 직선 발사
  const count = Math.min(level, 5); // 최대 5줄까지만
  const spacing = 10;
  for (let i = 0; i < count; i++) {
    const offset = (i - (count-1)/2) * spacing;
    bullets.push({ x: bx + offset, y: by, r: 3, vx: 0, vy: baseSpeed });
  }
}

function enemyShoot(e) {
  // ★ 총알 속도 줄임
  const speed = 2.0 + getLevel() * 0.1;
  if (e.type === "grunt") {
    for (let k = 0; k < 2; k++) {
      const ang = Math.atan2(player.y - e.y, player.x - e.x) + (k * 0.1 - 0.05);
      enemyBullets.push({ x: e.x, y: e.y, r: 3, vx: Math.cos(ang)*speed, vy: Math.sin(ang)*speed, color: "#ff6666" });
    }
  } else if (e.type === "zig") {
    for (let k = -2; k <= 2; k++) {
      const ang = Math.atan2(player.y - e.y, player.x - e.x) + k * 0.18;
      enemyBullets.push({ x: e.x, y: e.y, r: 3, vx: Math.cos(ang)*speed, vy: Math.sin(ang)*speed, color: "#ffaa33" });
    }
  } else if (e.type === "spread") {
    const n = 12;
    for (let i = 0; i < n; i++) {
      const a = (Math.PI*2) * (i / n) + (frame % 30)/30 * 0.2;
      enemyBullets.push({ x: e.x, y: e.y, r: 2.5, vx: Math.cos(a)* (speed*0.7), vy: Math.sin(a)*(speed*0.7), color: "#cc88ff" });
    }
  }
  // ★ 발사 텀 길게
  e.shootCd = Math.floor(rand(60, 120));
}

function useBomb() {
  if (bombs <= 0) return;
  bombs--;
  enemyBullets = [];
  for (const e of enemies) { e.hp -= 2; }
  enemies = enemies.filter(e => e.hp > 0);
  invincibleTimer = Math.max(invincibleTimer, 90);
}

function update() {
  if (!started || gameOver) return;

  if (levelUpTimer > 0) levelUpTimer--;
  if (invincibleTimer > 0) invincibleTimer--;

  bgOffset1 = (bgOffset1 + 2) % canvas.height;
  bgOffset2 = (bgOffset2 + 1) % canvas.height;

  const moveSpeed = keys["ShiftLeft"] ? player.slowSpeed : player.speed;
  if (keys["KeyA"]) player.x -= moveSpeed;
  if (keys["KeyD"]) player.x += moveSpeed;
  if (keys["KeyW"]) player.y -= moveSpeed;
  if (keys["KeyS"]) player.y += moveSpeed;
  player.x = clamp(player.x, 10, canvas.width - 10);
  player.y = clamp(player.y, 20, canvas.height - 10);

  frame++;
  const fireInterval = Math.max(4, 10 - Math.floor((powerLevel - 1) / 2));
  if (keys["Space"] && frame % fireInterval === 0) {
    shootPlayerBullets();
  }

  if (keys["KeyX"]) {
    useBomb();
    keys["KeyX"] = false;
  }

  bullets.forEach(b => { b.x += b.vx; b.y += b.vy; });
  bullets = bullets.filter(b => b.y > -20 && b.y < canvas.height + 20 && b.x > -20 && b.x < canvas.width + 20);

  enemyFrame++;
  const levelNow = getLevel();

  // ★ 적 출현 빈도 줄임
  const baseSpawn = 70;
  const spawnInterval = Math.max(30, Math.floor(baseSpawn - levelNow * 5));
  const spawnCount = 1 + Math.floor(levelNow / 3);
  const maxOnScreen = 20;

  if (enemyFrame % spawnInterval === 0) {
    const canSpawn = Math.max(0, maxOnScreen - enemies.length);
    for (let k = 0; k < Math.min(spawnCount, canSpawn); k++) {
      spawnEnemy();
    }
  }

  for (const e of enemies) {
    e.t++;
    e.y += e.dy;
    e.x += e.dx || 0;
    if (e.x < 20 || e.x > canvas.width - 20) e.dx *= -1;
    if (e.type === "zig") e.x += Math.sin(e.t * 0.15) * 1.5;

    e.shootCd--;
    if (e.shootCd <= 0 && e.y > 0) {
      enemyShoot(e);
    }
  }

  for (const eb of enemyBullets) { eb.x += eb.vx; eb.y += eb.vy; }
  enemyBullets = enemyBullets.filter(eb => eb.y > -30 && eb.y < canvas.height + 30 && eb.x > -30 && eb.x < canvas.width + 30);

  for (const e of enemies) {
    if (checkCollision(player, e)) {
      if (invincibleTimer <= 0) {
        lives--; invincibleTimer = 120; powerLevel = Math.max(1, powerLevel - 1);
        if (lives < 0) { gameOver = true; }
      }
    }
  }
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const eb = enemyBullets[i];
    if (checkCollision(player, eb)) {
      if (invincibleTimer <= 0) {
        lives--; invincibleTimer = 120; powerLevel = Math.max(1, powerLevel - 1);
        if (lives < 0) { gameOver = true; }
      }
      enemyBullets.splice(i, 1);
    }
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    for (let j = bullets.length - 1; j >= 0; j--) {
      const b = bullets[j];
      if (checkCollision(e, b)) {
        bullets.splice(j, 1);
        e.hp -= 1;
        if (e.hp <= 0) {
          enemies.splice(i, 1);
          score += 1;
          if (Math.random() < 0.25) {
            powerUps.push({ x: e.x, y: e.y, r: 6, vy: 2.5 });
          }
          const newLevel = getLevel();
          if (newLevel > lastLevel) {
            lastLevel = newLevel;
            levelUpTimer = 90;
          }
        }
        break;
      }
    }
  }

  for (const p of powerUps) { p.y += p.vy; }
  powerUps = powerUps.filter(p => p.y < canvas.height + 10);
  for (let i = powerUps.length - 1; i >= 0; i--) {
    const p = powerUps[i];
    if (checkCollision(player, p)) {
      powerUps.splice(i, 1);
      powerLevel = Math.min(5, powerLevel + 1);
    }
  }

  enemies = enemies.filter(e => e.y < canvas.height + 40);

  hud.innerHTML = `
    Score: ${score}<br>
    Lives: ${Math.max(0,lives)}<br>
    Bombs: ${bombs}<br>
    Power: ${powerLevel}<br>
    Level: ${getLevel()}
  `;
}

function drawBackground() {
  ctx.fillStyle = "#001018";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#082a35";
  ctx.lineWidth = 2;
  for (let y = -40; y < canvas.height + 40; y += 40) {
    ctx.beginPath();
    ctx.moveTo(80, (y + bgOffset1) % (canvas.height + 40));
    ctx.lineTo(80, (y + 20 + bgOffset1) % (canvas.height + 40));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(320, (y + bgOffset2) % (canvas.height + 40));
    ctx.lineTo(320, (y + 20 + bgOffset2) % (canvas.height + 40));
    ctx.stroke();
  }

  ctx.fillStyle = "#0a3b4a";
  for (let i = 0; i < 30; i++) {
    const sx = ((i * 73) % canvas.width);
    const sy = (i * 53 + Math.floor(frame*1.5)) % canvas.height;
    ctx.fillRect(sx, sy, 2, 2);
  }
}

function draw() {
  drawBackground();

  ctx.save();
  if (invincibleTimer > 0 && Math.floor(invincibleTimer/5) % 2 === 0) ctx.globalAlpha = 0.4;
  ctx.fillStyle = "#66e0ff";
  ctx.beginPath();
  ctx.moveTo(player.x, player.y - 12);
  ctx.lineTo(player.x - 8, player.y + 10);
  ctx.lineTo(player.x + 8, player.y + 10);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(player.x, player.y, 2, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "#7CFC00";
  for (const b of bullets) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const e of enemies) {
    if (e.type === "spread") ctx.fillStyle = "#ffcc00";
    else if (e.type === "zig") ctx.fillStyle = "#ff8800";
    else ctx.fillStyle = "#dd4444";
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const eb of enemyBullets) {
    ctx.fillStyle = eb.color || "#ff99cc";
    ctx.beginPath();
    ctx.arc(eb.x, eb.y, eb.r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const p of powerUps) {
    ctx.fillStyle = "#66ffcc";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = "#003a2e";
    ctx.stroke();
  }

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2 - 20);
    ctx.font = "16px Arial";
    ctx.fillText("Press R or Enter to Restart", canvas.width/2, canvas.height/2 + 20);
  }

  if (!started && !gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Press SPACE to Start", canvas.width/2, canvas.height/2);
  }
  if (levelUpTimer > 0) {
    const alpha = Math.min(1, levelUpTimer / 30);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#ffff88";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;
    ctx.font = "bold 42px Arial";
    ctx.textAlign = "center";
    const text = `LEVEL UP! Lv ${getLevel()}`;
    ctx.strokeText(text, canvas.width/2, canvas.height/2 - 80);
    ctx.fillText(text, canvas.width/2, canvas.height/2 - 80);
    ctx.restore();
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
