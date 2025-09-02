function startGame(){
    
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");

// Set fixed canvas size
canvas.width = 600;
canvas.height = 600;

// Images
const playerImg = new Image();
playerImg.src = "./player.png";


const enemyImg = new Image();
enemyImg.src = "./enemy.webp"; 


// Player
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 100,
  width: 50,
  height: 100,
  speed: 4,
  bullets: [],
  shootCooldown: 0,
  hp: 100, // player health
  maxHp: 100
};

// Enemies
let enemies = [];
let enemyBullets = [];

function spawnEnemy(x = Math.random() * (canvas.width - 40), y = 50) {
  let enemy = {
    x: x,
    y: y,
    width: 40,
    height: 40,
    hp: 50, // enemy health
    shootCooldown: Math.random() * 100 + 50
  };
  enemies.push(enemy);
}

// Start with one enemy
spawnEnemy();

// Score & state
let score = 0;
let gameOver = false;

// Controls
const keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Game Loop
function update() {
  if (gameOver) return;

  // Move player
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x + player.width < canvas.width) player.x += player.speed;

  // Shooting
  if (keys[" "] && player.shootCooldown <= 0) {
    player.bullets.push({
      x: player.x + player.width / 2 - 2,
      y: player.y,
      width: 4,
      height: 10,
      speed: 8,
      damage: 2
    });
    player.shootCooldown = 5;
  }
  if (player.shootCooldown > 0) player.shootCooldown--;

  // Move bullets
  player.bullets.forEach((bullet, i) => {
    bullet.y -= bullet.speed;
    if (bullet.y < 0) player.bullets.splice(i, 1);
  });

  // Enemy shooting only (they don’t move)
  enemies.forEach((enemy) => {
    enemy.shootCooldown--;
    if (enemy.shootCooldown <= 0) {
      enemyBullets.push({
        x: enemy.x + enemy.width / 2 - 2,
        y: enemy.y + enemy.height,
        width: 4,
        height: 10,
        speed: 2,
        damage: 10 // enemy bullet damage
      });
      enemy.shootCooldown = Math.random() * 1000 + 50;
    }
  });

  // Move enemy bullets
  enemyBullets.forEach((bullet, i) => {
    bullet.y += bullet.speed;
    if (bullet.y > canvas.height) enemyBullets.splice(i, 1);
  });

  // Player bullets vs enemies
  player.bullets.forEach((bullet, bi) => {
    enemies.forEach((enemy, ei) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        enemy.hp -= bullet.damage;
        player.bullets.splice(bi, 1);

        if (enemy.hp <= 0) {
          enemies.splice(ei, 1);
          score += 100;
          spawnEnemy();
          spawnEnemy();
        }
      }
    });
  });

  // Enemy bullets vs player
  enemyBullets.forEach((bullet, bi) => {
    if (
      bullet.x < player.x + player.width &&
      bullet.x + bullet.width > player.x &&
      bullet.y < player.y + player.height &&
      bullet.y + bullet.height > player.y
    ) {
      player.hp -= bullet.damage; // reduce HP
      enemyBullets.splice(bi, 1);

      if (player.hp <= 0) {
        gameOver = true;
        restartBtn.style.display = "block"; // show restart button
      }
    }
  });
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2 - 120, canvas.height / 2 - 30);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Final Score: " + score, canvas.width / 2 - 70, canvas.height / 2 + 10);
    return;
  }

  // Player
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Player HP bar
  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y - 10, player.width, 6);
  ctx.fillStyle = "lime";
  ctx.fillRect(player.x, player.y - 10, player.width * (player.hp / player.maxHp), 6);

  // Player bullets
  ctx.fillStyle = "yellow";
  player.bullets.forEach((bullet) => ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height));

// Enemies + HP bars
enemies.forEach((enemy) => {
  ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);

  // HP bar above enemy
  ctx.fillStyle = "white";
  ctx.fillRect(enemy.x, enemy.y - 8, enemy.width, 5);
  ctx.fillStyle = "green";
  ctx.fillRect(enemy.x, enemy.y - 8, enemy.width * (enemy.hp / 50), 5);
});

  // Enemy bullets
  ctx.fillStyle = "lime";
  enemyBullets.forEach((bullet) => ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height));

  // Score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 25);

  // Show Player HP in numbers
  ctx.fillText("Player HP: " + player.hp, 10, 50);
}

// Restart game
restartBtn.addEventListener("click", () => {
  score = 0;
  gameOver = false;
  enemies = [];
  enemyBullets = [];
  player.bullets = [];
  player.x = canvas.width / 2 - 25;
  player.y = canvas.height - 100;
  player.hp = player.maxHp; // reset HP
  spawnEnemy(); // start again with 1 enemy
  restartBtn.style.display = "none";
});

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  // Show canvas and hide start button
  let can = document.getElementById("gameCanvas").style.display = "block";
  console.log(can)
  if(can == "block"){
      document.getElementById("startBtn").style.display = "none"

  }else{
     document.getElementById("startbtn").style.display = "block"
  }

}

gameLoop();
