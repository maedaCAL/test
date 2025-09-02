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

// let selectedCharacter = null;

// // 説明文リスト（後で動的にセット）
// let instructions = [];
// let instructionIndex = 0;

// // スタートボタン → セレクト画面へ
// startButton.addEventListener("click", () => {
//   startScreen.classList.add("hidden");
//   selectScreen.classList.remove("hidden");
// });

// // キャラ選択処理
// characters.forEach(char => {
//   char.addEventListener("click", () => {
//     characters.forEach(c => c.classList.remove("selected"));
//     char.classList.add("selected");
//     selectedCharacter = char.dataset.character;
//     adventureButton.disabled = false;
//   });
// });

// // 冒険スタート → 説明画面へ
// adventureButton.addEventListener("click", () => {
//   selectScreen.classList.add("hidden");

//   // 説明文セット（選んだキャラに応じて変えてもOK）
//   instructions = [
//     `あなたが選んだキャラクターは「${selectedCharacter}」です。<br>←→キーで左右に移動、スペースキーでエネルギー弾を発射して敵を倒しましょう。`,
//     "敵は画面上から現れてゆっくり近づいてきます。エネルギー弾で撃ち落としてください！",
//     "準備ができたら「次へ」を押してゲームを開始しましょう！"
//   ];
//   instructionIndex = 0;
//   showInstruction();
//   instructionScreen.classList.remove("hidden");
// });

// // 「次へ」ボタンクリックで説明文切り替え・終了でゲーム開始
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

// // 説明文表示
// function showInstruction() {
//   instructionText.innerHTML = instructions[instructionIndex];
// }


// function startGame() {
//   const canvas = document.getElementById("gameCanvas");
//   const ctx = canvas.getContext("2d");

//   // プレイヤー設定
//   const player = {
//     x: canvas.width / 2 - 20,
//     y: canvas.height - 60,
//     width: 40,
//     height: 40,
//     color: "blue",
//     speed: 5,
//     moveLeft: false,
//     moveRight: false,
//     hp: 3,           // 追加：HP
//     shootCooldown: 0
//   };

//   const bullets = [];
//   const enemies = [];

//   const enemySpawnInterval = 2000;
//   let lastEnemySpawn = 0;

//   let enemiesDefeated = 0;   // 倒した敵カウント
//   const enemiesToClear = 10; // クリア条件

//   let gameEnded = false;     // ゲーム終了フラグ

//   window.addEventListener("keydown", (e) => {
//     if (gameEnded) return;  // ゲーム終了後は操作無効

//     if (e.code === "ArrowLeft") player.moveLeft = true;
//     if (e.code === "ArrowRight") player.moveRight = true;

//     if (e.code === "Space") {
//       if (!player.shootCooldown) {
//         bullets.push({
//           x: player.x + player.width / 2 - 5,
//           y: player.y,
//           width: 10,
//           height: 20,
//           color: "cyan",
//           speed: 10
//         });
//         player.shootCooldown = 15;
//       }
//     }
//   });

//   window.addEventListener("keyup", (e) => {
//     if (e.code === "ArrowLeft") player.moveLeft = false;
//     if (e.code === "ArrowRight") player.moveRight = false;
//     if (e.code === "Space") player.shootCooldown = 0;
//   });

//   function gameLoop(timestamp) {
//     if (gameEnded) return; // ゲーム終了でループ停止

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // プレイヤー移動
//     if (player.moveLeft) player.x -= player.speed;
//     if (player.moveRight) player.x += player.speed;

//     if (player.x < 0) player.x = 0;
//     if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

//     ctx.fillStyle = player.color;
//     ctx.fillRect(player.x, player.y, player.width, player.height);

//     // 弾処理
//     bullets.forEach((b, i) => {
//       b.y -= b.speed;
//       ctx.fillStyle = b.color;
//       ctx.fillRect(b.x, b.y, b.width, b.height);

//       if (b.y + b.height < 0) bullets.splice(i, 1);
//     });

//     // 敵生成
//     if (!lastEnemySpawn) lastEnemySpawn = timestamp;
//     if (timestamp - lastEnemySpawn > enemySpawnInterval) {
//       enemies.push({
//         x: Math.random() * (canvas.width - 30),
//         y: -30,
//         width: 30,
//         height: 30,
//         color: "red",
//         speed: 2
//       });
//       lastEnemySpawn = timestamp;
//     }

//     // 敵移動・描画
//     enemies.forEach((e, eIndex) => {
//       e.y += e.speed;
//       ctx.fillStyle = e.color;
//       ctx.fillRect(e.x, e.y, e.width, e.height);

//       // 敵が画面下に来たらプレイヤーHP減少・敵削除
//       if (e.y > canvas.height) {
//         player.hp--;
//         enemies.splice(eIndex, 1);
//         if (player.hp <= 0) {
//           gameEnded = true;
//           showEndMessage("ゲームオーバー!");
//         }
//         return;
//       }

//       // 弾との当たり判定
//       bullets.forEach((b, bIndex) => {
//         if (
//           b.x < e.x + e.width &&
//           b.x + b.width > e.x &&
//           b.y < e.y + e.height &&
//           b.y + b.height > e.y
//         ) {
//           enemies.splice(eIndex, 1);
//           bullets.splice(bIndex, 1);
//           enemiesDefeated++;
//           if (enemiesDefeated >= enemiesToClear) {
//             gameEnded = true;
//             showEndMessage("クリア！おめでとうございます！");
//           }
//         }
//       });
//     });

//     // HPと倒した数を画面に表示
//     ctx.fillStyle = "white";
//     ctx.font = "20px Arial";
//     ctx.fillText(`HP: ${player.hp}`, 10, 25);
//     ctx.fillText(`倒した敵: ${enemiesDefeated} / ${enemiesToClear}`, 10, 50);

//     if (player.shootCooldown > 0) player.shootCooldown--;

//     if (!gameEnded) {
//       requestAnimationFrame(gameLoop);
//     }
//   }

//   // ゲーム終了時メッセージ表示
//   function showEndMessage(msg) {
//     // 画面中央に白文字で表示
//     ctx.fillStyle = "white";
//     ctx.font = "40px Arial";
//     ctx.textAlign = "center";
//     ctx.fillText(msg, canvas.width / 2, canvas.height / 2);
//   }

//   requestAnimationFrame(gameLoop);
// }




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

// let selectedCharacter = null;
// let instructions = [];
// let instructionIndex = 0;

// startButton.addEventListener("click", () => {
//   startScreen.classList.add("hidden");
//   selectScreen.classList.remove("hidden");
// });

// characters.forEach(char => {
//   char.addEventListener("click", () => {
//     characters.forEach(c => c.classList.remove("selected"));
//     char.classList.add("selected");
//     selectedCharacter = char.dataset.character;
//     adventureButton.disabled = false;
//   });
// });

// adventureButton.addEventListener("click", () => {
//   selectScreen.classList.add("hidden");
//   instructions = [
//     `あなたが選んだキャラクターは「${selectedCharacter}」です。<br>←→キーで左右に移動、スペースキーでエネルギー弾を発射して敵を倒しましょう。`,
//     "敵は画面上から現れてゆっくり近づいてきます。エネルギー弾で撃ち落としてください！",
//     "準備ができたら「次へ」を押してゲームを開始しましょう！"
//   ];
//   instructionIndex = 0;
//   showInstruction();
//   instructionScreen.classList.remove("hidden");
// });

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

// function startGame() {
//   const canvas = document.getElementById("gameCanvas");
//   const ctx = canvas.getContext("2d");

//   const player = {
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

//   const bullets = [];
//   const enemies = [];

//   let stageNumber = 1;
//   let enemiesToClear = 10;
//   let enemiesDefeated = 0;
//   let points = 0;
//   let gameEnded = false;
//   let lastEnemySpawn = 0;
//   let enemySpawnInterval = 2000;

//   window.addEventListener("keydown", (e) => {
//     if (gameEnded) return;
//     if (e.code === "ArrowLeft") player.moveLeft = true;
//     if (e.code === "ArrowRight") player.moveRight = true;
//     if (e.code === "Space") {
//       if (!player.shootCooldown) {
//         bullets.push({
//           x: player.x + player.width / 2 - 5,
//           y: player.y,
//           width: 10,
//           height: 20,
//           color: "cyan",
//           speed: 10
//         });
//         player.shootCooldown = 15;
//       }
//     }
//   });

//   window.addEventListener("keyup", (e) => {
//     if (e.code === "ArrowLeft") player.moveLeft = false;
//     if (e.code === "ArrowRight") player.moveRight = false;
//     if (e.code === "Space") player.shootCooldown = 0;
//   });

//   function gameLoop(timestamp) {
//     if (gameEnded) return;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // プレイヤー移動
//     if (player.moveLeft) player.x -= player.speed;
//     if (player.moveRight) player.x += player.speed;
//     if (player.x < 0) player.x = 0;
//     if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

//     ctx.fillStyle = player.color;
//     ctx.fillRect(player.x, player.y, player.width, player.height);

//     // 弾
//     bullets.forEach((b, i) => {
//       b.y -= b.speed;
//       ctx.fillStyle = b.color;
//       ctx.fillRect(b.x, b.y, b.width, b.height);
//       if (b.y + b.height < 0) bullets.splice(i, 1);
//     });

//     // 敵生成（ステージに応じてスピードと間隔変化）
//     if (!lastEnemySpawn) lastEnemySpawn = timestamp;
//     if (timestamp - lastEnemySpawn > enemySpawnInterval - stageNumber * 200) {
//       enemies.push({
//         x: Math.random() * (canvas.width - 30),
//         y: -30,
//         width: 30,
//         height: 30,
//         color: "red",
//         speed: 2 + stageNumber * 0.5
//       });
//       lastEnemySpawn = timestamp;
//     }

//     // 敵移動・描画
//     enemies.forEach((e, eIndex) => {
//       e.y += e.speed;
//       ctx.fillStyle = e.color;
//       ctx.fillRect(e.x, e.y, e.width, e.height);

//       if (e.y > canvas.height) {
//         player.hp--;
//         enemies.splice(eIndex, 1);
//         if (player.hp <= 0) {
//           gameEnded = true;
//           showEndMessage("ゲームオーバー!");
//         }
//         return;
//       }

//       // 弾との当たり判定
//       bullets.forEach((b, bIndex) => {
//         if (
//           b.x < e.x + e.width &&
//           b.x + b.width > e.x &&
//           b.y < e.y + e.height &&
//           b.y + b.height > e.y
//         ) {
//           enemies.splice(eIndex, 1);
//           bullets.splice(bIndex, 1);
//           enemiesDefeated++;
//           points += 10;

//           if (enemiesDefeated >= enemiesToClear) {
//             gameEnded = true;
//             showStageMessage(`ステージ ${stageNumber} クリア！`);
//             setTimeout(nextStage, 2000);
//           }
//         }
//       });
//     });

//     // 情報表示
//     ctx.fillStyle = "white";
//     ctx.font = "20px Arial";
//     ctx.fillText(`HP: ${player.hp}`, 10, 25);
//     ctx.fillText(`ステージ: ${stageNumber}`, 10, 50);
//     ctx.fillText(`倒した敵: ${enemiesDefeated} / ${enemiesToClear}`, 10, 75);
//     ctx.fillText(`ポイント: ${points}`, 10, 100);

//     if (player.shootCooldown > 0) player.shootCooldown--;

//     if (!gameEnded) {
//       requestAnimationFrame(gameLoop);
//     }
//   }

//   function nextStage() {
//     stageNumber++;
//     if (stageNumber > 5) {
//       gameEnded = true;
//       showEndMessage("全ステージクリア！おめでとう！");
//       return;
//     }

//     enemiesToClear = 10 + stageNumber * 5;
//     enemiesDefeated = 0;
//     enemies.length = 0;
//     bullets.length = 0;
//     lastEnemySpawn = 0;
//     gameEnded = false;

//     showStageMessage(`ステージ ${stageNumber} 開始！`);
//     setTimeout(() => {
//       requestAnimationFrame(gameLoop);
//     }, 2000);
//   }

//   function showEndMessage(msg) {
//     ctx.fillStyle = "white";
//     ctx.font = "40px Arial";
//     ctx.textAlign = "center";
//     ctx.fillText(msg, canvas.width / 2, canvas.height / 2);
//   }

//   function showStageMessage(msg) {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = "yellow";
//     ctx.font = "30px Arial";
//     ctx.textAlign = "center";
//     ctx.fillText(msg, canvas.width / 2, canvas.height / 2);
//   }

//   showStageMessage(`ステージ ${stageNumber} 開始！`);
//   setTimeout(() => {
//     requestAnimationFrame(gameLoop);
//   }, 2000);
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

let selectedCharacter = null;
let instructions = [];
let instructionIndex = 0;

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
    `あなたが選んだキャラクターは「${selectedCharacter}」です。<br>←→キーで移動、スペースキーで攻撃！`,
    "敵が上から降ってきます。撃ち落としてポイントを稼ごう！",
    "「次へ」を押すとゲームが始まります！"
  ];
  instructionIndex = 0;
  showInstruction();
  instructionScreen.classList.remove("hidden");
});

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

// ゲーム本体
function startGame() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const player = {
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

  const bullets = [];
  const enemies = [];
  const enemySpawnInterval = 2000;
  let lastEnemySpawn = 0;
  let enemiesDefeated = 0;
  let stageNumber = 1;
  let enemiesToClear = 10;
  let points = 0;
  let gameEnded = false;

  window.addEventListener("keydown", (e) => {
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
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft") player.moveLeft = false;
    if (e.code === "ArrowRight") player.moveRight = false;
  });

  function gameLoop(timestamp) {
    if (gameEnded) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // プレイヤー移動
    if (player.moveLeft) player.x -= player.speed;
    if (player.moveRight) player.x += player.speed;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
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

      if (e.y > canvas.height) {
        enemies.splice(ei, 1);
        player.hp--;
        if (player.hp <= 0) {
          gameEnded = true;
          showEndMessage("ゲームオーバー！");
        }
        return;
      }

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
            setTimeout(() => {
              requestAnimationFrame(gameLoop);
            }, 2000);
            return;
          }
        }
      });
    });

    // 情報表示
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`HP: ${player.hp}`, 10, 25);
    ctx.fillText(`ステージ: ${stageNumber}`, 10, 50);
    ctx.fillText(`倒した敵: ${enemiesDefeated} / ${enemiesToClear}`, 10, 75);
    ctx.fillText(`ポイント: ${points}`, 10, 100);

    if (player.shootCooldown > 0) player.shootCooldown--;

    if (!gameEnded) {
      requestAnimationFrame(gameLoop);
    }
  }

function showEndMessage(msg) {
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText(msg, canvas.width / 2, canvas.height / 2);

  // Continue画面を表示（1回のみ）
  if (continueCount < 1) {
    document.getElementById("continue-screen").classList.remove("hidden");
  }
}

  // function showStageMessage(text) {
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   ctx.fillStyle = "yellow";
  //   ctx.font = "40px Arial";
  //   ctx.textAlign = "center";
  //   ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  // }

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


requestAnimationFrame(gameLoop); }