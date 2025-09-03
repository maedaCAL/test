// // 画面要素取得
// const startButton = document.getElementById("start-button");
// const adventureButton = document.getElementById("adventure-button");
// const startScreen = document.querySelector(".start-screen");
// const selectScreen = document.querySelector(".select-screen");
// const battleScreen = document.querySelector(".battle-screen");
// const characters = document.querySelectorAll(".character");
// const instructionScreen = document.getElementById("instruction-screen");
// const instructionText = document.getElementById("instruction-text");
// const nextInstructionButton = document.getElementById("next-instruction-button");
// const continueScreen = document.getElementById("continue-screen");
// const continueButton = document.getElementById("continue-button");

// let selectedCharacter = null;
// let instructions = [];
// let instructionIndex = 0;
// let continueCount = 0;

// // スタート画面 → セレクト画面
// startButton.addEventListener("click", () => {
//   startScreen.classList.add("hidden");
//   selectScreen.classList.remove("hidden");
// });

// // キャラクター選択
// characters.forEach(char => {
//   char.addEventListener("click", () => {
//     characters.forEach(c => c.classList.remove("selected"));
//     char.classList.add("selected");
//     selectedCharacter = char.dataset.character;
//     adventureButton.disabled = false;
//   });
// });

// // 冒険スタート → 説明画面
// adventureButton.addEventListener("click", () => {
//   selectScreen.classList.add("hidden");
//   instructions = [
//     `あなたが選んだキャラクターは「${selectedCharacter}」です。<br>←→キーで移動、スペースキーで攻撃！`,
//     "敵が上から降ってきます。撃ち落としてポイントを稼ごう！",
//     "「次へ」を押すとゲームが始まります！"
//   ];
//   instructionIndex = 0;
//   showInstruction();
//   instructionScreen.classList.remove("hidden");
// });

// // 次へボタン（説明画面）
// nextInstructionButton.addEventListener("click", () => {
//   instructionIndex++;
//   if (instructionIndex >= instructions.length) {
//     instructionScreen.classList.add("hidden");
//     battleScreen.classList.remove("hidden");
//     startGame();
//   } else {
//     showInstruction();
//   }
// });

// function showInstruction() {
//   instructionText.innerHTML = instructions[instructionIndex];
// }

// continueButton.addEventListener("click", () => {
//   continueScreen.classList.add("hidden");
//   continueCount++;
//   resetToStart(); // ←ここで最初の画面に戻す
// });

// function continueGame() {
//   // ゲームを続ける（HP回復＆ゲーム再開）
//   player.hp = 3;  // HPを回復
//   gameEnded = false;
//   continueScreen.classList.add("hidden");
//   battleScreen.classList.remove("hidden");
//   requestAnimationFrame(gameLoop);
// }

// // ゲーム開始・初期化用変数
// let canvas, ctx;
// let player;
// let bullets;
// let enemies;
// let enemySpawnInterval;
// let lastEnemySpawn;
// let enemiesDefeated;
// let stageNumber;
// let enemiesToClear;
// let points;
// let gameEnded;

// function startGame() {
//   canvas = document.getElementById("gameCanvas");
//   ctx = canvas.getContext("2d");

//   // ゲーム変数初期化
//   player = {
//     x: canvas.width / 2 - 20,
//     y: canvas.height - 60,
//     width: 40,
//     height: 40,
//     color: "blue",
//     speed: 5,
//     moveLeft: false,
//     moveRight: false,
//     hp: 3,
//     shootCooldown: 0
//   };

//   bullets = [];
//   enemies = [];
//   enemySpawnInterval = 2000;
//   lastEnemySpawn = 0;
//   enemiesDefeated = 0;
//   stageNumber = 1;
//   enemiesToClear = 10;
//   points = 0;
//   gameEnded = false;

//   // キー操作設定
//   window.addEventListener("keydown", keyDownHandler);
//   window.addEventListener("keyup", keyUpHandler);

//   requestAnimationFrame(gameLoop);
// }

// function keyDownHandler(e) {
//   if (gameEnded) return;
//   if (e.code === "ArrowLeft") player.moveLeft = true;
//   if (e.code === "ArrowRight") player.moveRight = true;
//   if (e.code === "Space" && !player.shootCooldown) {
//     bullets.push({
//       x: player.x + player.width / 2 - 5,
//       y: player.y,
//       width: 10,
//       height: 20,
//       color: "cyan",
//       speed: 10
//     });
//     player.shootCooldown = 15;
//   }
// }

// function keyUpHandler(e) {
//   if (e.code === "ArrowLeft") player.moveLeft = false;
//   if (e.code === "ArrowRight") player.moveRight = false;
// }

// function gameLoop(timestamp) {
//   if (gameEnded) return;

//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   // プレイヤー移動
//   if (player.moveLeft) player.x -= player.speed;
//   if (player.moveRight) player.x += player.speed;
//   if (player.x < 0) player.x = 0;
//   if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

//   // プレイヤー描画
//   ctx.fillStyle = player.color;
//   ctx.fillRect(player.x, player.y, player.width, player.height);

//   // 弾処理
//   bullets.forEach((b, i) => {
//     b.y -= b.speed;
//     ctx.fillStyle = b.color;
//     ctx.fillRect(b.x, b.y, b.width, b.height);
//     if (b.y + b.height < 0) bullets.splice(i, 1);
//   });

//   // 敵生成
//   if (!lastEnemySpawn) lastEnemySpawn = timestamp;
//   if (timestamp - lastEnemySpawn > enemySpawnInterval) {
//     enemies.push({
//       x: Math.random() * (canvas.width - 30),
//       y: -30,
//       width: 30,
//       height: 30,
//       color: "red",
//       speed: 2 + stageNumber * 0.5
//     });
//     lastEnemySpawn = timestamp;
//   }

//   // 敵処理
//   enemies.forEach((e, ei) => {
//     e.y += e.speed;
//     ctx.fillStyle = e.color;
//     ctx.fillRect(e.x, e.y, e.width, e.height);

//     // 敵が画面下に到達したらHP減
//     if (e.y > canvas.height) {
//       enemies.splice(ei, 1);
//       player.hp--;
//       if (player.hp <= 0) {
//         gameEnded = true;
//         showEndMessage("ゲームオーバー！");
//         return;
//       }
//       return;
//     }

//     // 弾と敵の当たり判定
//     bullets.forEach((b, bi) => {
//       if (
//         b.x < e.x + e.width &&
//         b.x + b.width > e.x &&
//         b.y < e.y + e.height &&
//         b.y + b.height > e.y
//       ) {
//         enemies.splice(ei, 1);
//         bullets.splice(bi, 1);
//         enemiesDefeated++;
//         points += 100;

//         if (enemiesDefeated >= enemiesToClear) {
//           stageNumber++;
//           enemiesToClear += 5;
//           enemiesDefeated = 0;
//           showStageMessage(`ステージ ${stageNumber} 開始！`);
//           enemies.length = 0; // 敵リセット
//           setTimeout(() => {
//             lastEnemySpawn = 0;
//             if (!gameEnded) requestAnimationFrame(gameLoop);
//           }, 2000);
//           return;
//         }
//       }
//     });
//   });

//   // HUD表示 左上の表示を少し右にずらした（10→15px）
//   ctx.fillStyle = "white";
//   ctx.font = "20px Arial";
//   ctx.textAlign = "left";
//   ctx.fillText(`HP: ${player.hp}`, 15, 25);
//   ctx.fillText(`ステージ: ${stageNumber}`, 15, 50);
//   ctx.fillText(`倒した敵: ${enemiesDefeated} / ${enemiesToClear}`, 15, 75);
//   ctx.fillText(`ポイント: ${points}`, 15, 100);

//   // クールダウン減少
//   if (player.shootCooldown > 0) player.shootCooldown--;

//   if (!gameEnded) {
//     requestAnimationFrame(gameLoop);
//   }
// }

// // ゲームオーバー表示
// function showEndMessage(msg) {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.fillStyle = "white";
//   ctx.font = "40px Arial";
//   ctx.textAlign = "center";
//   ctx.fillText(msg, canvas.width / 2, canvas.height / 2);

//   // コンティニュー画面表示（1回のみ）
//   if (continueCount < 1) {
//     continueScreen.classList.remove("hidden");
//   }
// }

// // ステージ開始メッセージ表示
// function showStageMessage(text) {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.fillStyle = "yellow";
//   ctx.textAlign = "center";
//   let fontSize = 40;
//   do {
//     ctx.font = `${fontSize}px Arial`;
//     const textWidth = ctx.measureText(text).width;
//     if (textWidth <= canvas.width * 0.9) break;
//     fontSize -= 2;
//   } while (fontSize > 10);
//   ctx.font = `${fontSize}px Arial`;
//   ctx.fillText(text, canvas.width / 2, canvas.height / 2);
// }


// 画面要素取得
const startButton = document.getElementById("start-button");
const adventureButton = document.getElementById("adventure-button");
const startScreen = document.querySelector(".start-screen");
const selectScreen = document.querySelector(".select-screen");
const battleScreen = document.querySelector(".battle-screen");
const characters = document.querySelectorAll(".character");
const instructionScreen = document.getElementById("instruction-screen");
const instructionText = document.getElementById("instruction-text");
const nextInstructionButton = document.getElementById("next-instruction-button");
const continueScreen = document.getElementById("continue-screen");
const continueButton = document.getElementById("continue-button");
const backButton = document.getElementById("back-button");

let selectedCharacter = null;
let instructions = [];
let instructionIndex = 0;
let continueCount = 0;

// スタート画面 → セレクト画面
startButton.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  selectScreen.classList.remove("hidden");
});

// キャラクター選択
characters.forEach(char => {
  char.addEventListener("click", () => {
    characters.forEach(c => c.classList.remove("selected"));
    char.classList.add("selected");
    selectedCharacter = char.dataset.character;
    adventureButton.disabled = false;
  });
});

// 冒険スタート → 説明画面
adventureButton.addEventListener("click", () => {
  selectScreen.classList.add("hidden");
  instructions = [
    `あなたが選んだキャラクターは「${selectedCharacter}」です。<br>＜ー　、　ー＞キーで移動、スペースキーで攻撃！`,
    "敵が上から降ってきます。撃ち落としてポイントを稼ごう！",
    "「次へ」を押すとゲームが始まります！"
  ];
  instructionIndex = 0;
  showInstruction();
  instructionScreen.classList.remove("hidden");
});

// 説明の「次へ」ボタン
nextInstructionButton.addEventListener("click", () => {
  instructionIndex++;
  if (instructionIndex >= instructions.length) {
    instructionScreen.classList.add("hidden");
    battleScreen.classList.remove("hidden");
    startGame();
  } else {
    showInstruction();
  }
});

function showInstruction() {
  instructionText.innerHTML = instructions[instructionIndex];
}

// 戻るボタン
backButton.addEventListener("click", () => {
  if (!battleScreen.classList.contains("hidden")) {
    battleScreen.classList.add("hidden");
    selectScreen.classList.remove("hidden");
    gameEnded = true;
  } else if (!instructionScreen.classList.contains("hidden")) {
    instructionScreen.classList.add("hidden");
    selectScreen.classList.remove("hidden");
  } else if (!selectScreen.classList.contains("hidden")) {
    selectScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
    selectedCharacter = null;
    adventureButton.disabled = true;
    characters.forEach(c => c.classList.remove("selected"));
  }
});

// コンティニュー後、最初の画面に戻す
continueButton.addEventListener("click", () => {
  continueScreen.classList.add("hidden");
  continueCount++;
  resetToStart();
});

// 初期化用変数
let canvas, ctx;
let player;
let bullets;
let enemies;
let enemySpawnInterval;
let lastEnemySpawn;
let enemiesDefeated;
let stageNumber;
let enemiesToClear;
let points;
let gameEnded;

function startGame() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  // ゲーム初期化
  player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    color: "blue",
    speed: 5,
    moveLeft: false,
    moveRight: false,
    hp: 3,
    shootCooldown: 0
  };

  bullets = [];
  enemies = [];
  enemySpawnInterval = 2000;
  lastEnemySpawn = 0;
  enemiesDefeated = 0;
  stageNumber = 1;
  enemiesToClear = 10;
  points = 0;
  gameEnded = false;

  window.addEventListener("keydown", keyDownHandler);
  window.addEventListener("keyup", keyUpHandler);

  requestAnimationFrame(gameLoop);
}

function keyDownHandler(e) {
  if (gameEnded) return;
  if (e.code === "ArrowLeft") player.moveLeft = true;
  if (e.code === "ArrowRight") player.moveRight = true;
  if (e.code === "Space" && !player.shootCooldown) {
    bullets.push({
      x: player.x + player.width / 2 - 5,
      y: player.y,
      width: 10,
      height: 20,
      color: "cyan",
      speed: 10
    });
    player.shootCooldown = 15;
  }
}

function keyUpHandler(e) {
  if (e.code === "ArrowLeft") player.moveLeft = false;
  if (e.code === "ArrowRight") player.moveRight = false;
}

function gameLoop(timestamp) {
  if (gameEnded) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // プレイヤー移動
  if (player.moveLeft) player.x -= player.speed;
  if (player.moveRight) player.x += player.speed;
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

  // プレイヤー描画
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // 弾処理
  bullets.forEach((b, i) => {
    b.y -= b.speed;
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.width, b.height);
    if (b.y + b.height < 0) bullets.splice(i, 1);
  });

  // 敵生成
  if (!lastEnemySpawn) lastEnemySpawn = timestamp;
  if (timestamp - lastEnemySpawn > enemySpawnInterval) {
    enemies.push({
      x: Math.random() * (canvas.width - 30),
      y: -30,
      width: 30,
      height: 30,
      color: "red",
      speed: 2 + stageNumber * 0.5
    });
    lastEnemySpawn = timestamp;
  }

  // 敵処理
  enemies.forEach((e, ei) => {
    e.y += e.speed;
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, e.width, e.height);

    // 敵が画面下に到達
    if (e.y > canvas.height) {
      enemies.splice(ei, 1);
      player.hp--;
      if (player.hp <= 0) {
        gameEnded = true;
        showEndMessage("YOU LOSE");
        return;
      }
      return;
    }

    // 弾と敵の当たり判定
    bullets.forEach((b, bi) => {
      if (
        b.x < e.x + e.width &&
        b.x + b.width > e.x &&
        b.y < e.y + e.height &&
        b.y + b.height > e.y
      ) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        enemiesDefeated++;
        points += 100;

        if (enemiesDefeated >= enemiesToClear) {
          stageNumber++;
          enemiesToClear += 5;
          enemiesDefeated = 0;
          showStageMessage(`ステージ ${stageNumber} 開始！`);
          enemies.length = 0;
          setTimeout(() => {
            lastEnemySpawn = 0;
            if (!gameEnded) requestAnimationFrame(gameLoop);
          }, 2000);
          return;
        }
      }
    });
  });

  // 情報表示（HUD）
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`HP: ${player.hp}`, 15, 25);
  ctx.fillText(`ステージ: ${stageNumber}`, 15, 50);
  ctx.fillText(`倒した敵: ${enemiesDefeated} / ${enemiesToClear}`, 15, 75);
  ctx.fillText(`ポイント: ${points}`, 15, 100);

  // クールダウン減少
  if (player.shootCooldown > 0) player.shootCooldown--;

  if (!gameEnded) {
    requestAnimationFrame(gameLoop);
  }
}

// ゲームオーバー表示
function showEndMessage(msg) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText(msg, canvas.width / 2, canvas.height / 2);

  // コンティニュー画面を常に表示する（制限なし）
  continueScreen.classList.remove("hidden");
}

// ステージ開始メッセージ
function showStageMessage(text) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "yellow";
  ctx.textAlign = "center";
  let fontSize = 40;
  do {
    ctx.font = `${fontSize}px Arial`;
    const textWidth = ctx.measureText(text).width;
    if (textWidth <= canvas.width * 0.9) break;
    fontSize -= 2;
  } while (fontSize > 10);
  ctx.font = `${fontSize}px Arial`;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

// 🔁 最初の画面に戻す処理
function resetToStart() {
  // 画面切り替え
  battleScreen.classList.add("hidden");
  selectScreen.classList.add("hidden");
  instructionScreen.classList.add("hidden");
  continueScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");

  // キャラ選択のリセット
  selectedCharacter = null;
  adventureButton.disabled = true;
  characters.forEach(c => c.classList.remove("selected"));
}
