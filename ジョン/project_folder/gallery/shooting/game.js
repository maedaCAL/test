const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let shipX = canvas.width / 2 - 20;
let bullets = [];
let enemies = [];
let score = 0;

const shipImg = new Image();
shipImg.src = "chiii.png"; // 우주선 이미지 (없으면 사각형)

const enemyImg = new Image();
enemyImg.src = "hachii.png"; // 적 이미지 (없으면 사각형)

// 이미지 로드 여부 체크
let shipLoaded = false;
let enemyLoaded = false;

shipImg.onload = () => { shipLoaded = true; };
enemyImg.onload = () => { enemyLoaded = true; };

// 적 스폰 시작
setInterval(spawnEnemy, 1500);
update();

// 키보드 조작
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && shipX > 0) shipX -= 15;
  if (e.key === "ArrowRight" && shipX < canvas.width - 40) shipX += 15;
  if (e.key === " ") shoot();
});

function shoot() {
  bullets.push({ x: shipX + 15, y: canvas.height - 60 });
}

function spawnEnemy() {
  const x = Math.random() * (canvas.width - 30);
  enemies.push({ x, y: -20 });
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 우주선 그리기 (이미지 없으면 사각형)
  if (shipLoaded) {
    ctx.drawImage(shipImg, shipX, canvas.height - 50, 40, 40);
  } else {
    ctx.fillStyle = "#ff69b4"; // 핑크
    ctx.fillRect(shipX, canvas.height - 50, 40, 40);
  }

  // 총알
  ctx.fillStyle = "#ff1493";
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= 8;
    ctx.fillRect(bullets[i].x, bullets[i].y, 5, 10);
    if (bullets[i].y < 0) bullets.splice(i, 1);
  }

  // 적
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].y += 2;
    if (enemyLoaded) {
      ctx.drawImage(enemyImg, enemies[i].x, enemies[i].y, 30, 30);
    } else {
      ctx.fillStyle = "#ff69b4"; // 적도 핑크 사각형
      ctx.fillRect(enemies[i].x, enemies[i].y, 30, 30);
    }
    if (enemies[i].y > canvas.height) enemies.splice(i, 1);
  }

  // 충돌 체크
  for (let bi = bullets.length - 1; bi >= 0; bi--) {
    for (let ei = enemies.length - 1; ei >= 0; ei--) {
      let b = bullets[bi];
      let e = enemies[ei];

      if (b.x < e.x + 30 && b.x + 5 > e.x && b.y < e.y + 30 && b.y + 10 > e.y) {
        bullets.splice(bi, 1);
        enemies.splice(ei, 1);

        score += 10;
        document.getElementById("scoreBoard").innerText = "Score: " + score;
        break;
      }
    }
  }

  requestAnimationFrame(update);
}
