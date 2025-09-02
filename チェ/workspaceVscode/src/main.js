// 日本語コメントで実装：メインエントリ。ゲームループと状態管理を司る
import { createGame } from './game.js';
import { createHUD } from './hud.js';
import { Input } from './input.js';
import { Scoreboard } from './scoreboard.js';

// -----------------------------
// キャンバスとコンテキスト初期化
// -----------------------------
const canvas = document.getElementById('game');
const g = canvas.getContext('2d');

// クリックでコイン投入（TITLE/RESULT/SELECTで有効）
canvas.addEventListener('click', ()=>{
  if (STATE.mode === 'TITLE' || STATE.mode === 'RESULT' || STATE.mode === 'SELECT') insertCoin(1);
});

// -----------------------------
// グローバルなゲーム状態（メモリのみ）
// -----------------------------
const STATE = {
  mode: 'TITLE',     // TITLE → SELECT → GAME → RESULT
  coin: 2,           // 初期コイン（タイトル→開始時に1消費）
  stageList: [1,2,3,4,5,6,null],
  stageIndex: 0,     // 現在のインデックス
  score: 0,
  scoreboard: Scoreboard(), // メモリ内TOP3
  resultMessage: '', // "GAME OVER" or "END"
  selectedType: 0,   // 0:タイプA, 1:タイプB
  coinFlashMs: 1200,
  coinFlashTimer: 0,
};

// -----------------------------
const input = Input(window);

// HUDとゲームワールド
// -----------------------------
let HUD = createHUD(canvas, STATE);
let world = null;

// -----------------------------
// ループ（フレームレート非依存）
// -----------------------------
let last = performance.now();
function loop(now = performance.now()) {
  const dtMs = now - last;
  last = now;
  const dt = dtMs / 1000;

  update(dt);
  render();

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// 最大コイン数 10
function insertCoin(n=1) {
  STATE.coin = Math.min(10, (STATE.coin|0) + (n|0));
  STATE.coinFlashTimer = STATE.coinFlashMs;
}

// -----------------------------
function update(dt) {
  input.update();

  // コイン投入（Cキー）
  if (input.justPressed('c') || input.justPressed('C')) insertCoin(1);

  // フラッシュ減衰
  if (STATE.coinFlashTimer > 0) STATE.coinFlashTimer -= dt*1000;

  if (STATE.mode === 'TITLE') {
    // コインが1以上なら開始可能。Enter/SpaceでSELECTへ
    if ((input.justPressed('Enter') || input.justPressed(' ')) && STATE.coin >= 1) {
      STATE.mode = 'SELECT';
    }
  } else if (STATE.mode === 'SELECT') {
    // ↑↓でタイプ選択、Enterで確定
    if (input.justPressed('ArrowUp')) STATE.selectedType = (STATE.selectedType + 1) % 2;
    if (input.justPressed('ArrowDown')) STATE.selectedType = (STATE.selectedType + 1) % 2;
    if (input.justPressed('Enter') || input.justPressed(' ')) {
      if (STATE.coin >= 1) {
        STATE.coin -= 1;
        STATE.score = 0;
        STATE.stageIndex = 0;
        world = createGame(canvas, STATE); // プレイヤー初期化等
        STATE.mode = 'GAME';
      }
    }
  } else if (STATE.mode === 'GAME') {
    const currentStage = STATE.stageList[STATE.stageIndex];
    if (currentStage == null) {
      // 全ステージ終了 → END
      STATE.resultMessage = 'END';
      STATE.scoreboard.trySubmit(STATE.score);
      STATE.mode = 'RESULT';
      return;
    }
    // ステージ進行
    const result = world.update(dt, input);
    if (result === 'GAME_OVER') {
      STATE.resultMessage = 'GAME OVER';
      STATE.scoreboard.trySubmit(STATE.score);
      STATE.mode = 'RESULT';
    } else if (result === 'STAGE_CLEAR') {
      STATE.score += 500; // ステージクリア加点
      STATE.stageIndex += 1;
      // 次がnullならENDに移行は次ループの先頭で判定
      world = createGame(canvas, STATE); // 次ステージ用に再構築
    }
  } else if (STATE.mode === 'RESULT') {
    // Enter/SpaceでTITLEに戻る
    if (input.justPressed('Enter') || input.justPressed(' ')) {
      STATE.mode = 'TITLE';
    }
  }
}

function render() {
  // 背景クリア
  g.fillStyle = '#000';
  g.fillRect(0,0,canvas.width, canvas.height);

  // コイン投入フラッシュ
  if (STATE.coinFlashTimer > 0) {
    const t = STATE.coinFlashTimer / STATE.coinFlashMs;
    g.save();
    g.globalAlpha = Math.max(0, Math.min(1, t));
    g.fillStyle = '#ffda44';
    g.font = 'bold 22px sans-serif';
    g.fillText('COIN INSERTED!', 300, 80);
    g.restore();
  }

  if (STATE.mode === 'TITLE') {
    drawTitle(g);
  } else if (STATE.mode === 'SELECT') {
    drawSelect(g);
  } else if (STATE.mode === 'GAME') {
    world.render(g);
    HUD.render(g);
  } else if (STATE.mode === 'RESULT') {
    drawResult(g);
  }
}

// -----------------------------
// 画面描画（タイトル/選択/結果）
// -----------------------------
function drawTitle(g) {
  g.fillStyle = '#fff';
  g.font = '32px sans-serif';
  g.fillText('弾幕シューティング', 250, 220);

  g.font = '18px sans-serif';
  g.fillText(`コイン: ${STATE.coin}  （1以上でスタート可）`, 280, 270);
  g.fillText('Enter でスタート', 320, 310);

  // スコアボード表示
  g.fillText('スコアボード (TOP3):', 290, 360);
  const list = STATE.scoreboard.list();
  list.forEach((e,i)=>{
    g.fillText(`${i+1}. ${e.name} - ${e.score}`, 310, 390 + i*24);
  });
}

function drawSelect(g) {
  g.fillStyle = '#fff';
  g.font = '28px sans-serif';
  g.fillText('タイプ選択', 330, 200);

  g.font = '18px sans-serif';
  const aSel = (STATE.selectedType===0) ? '▶ ' : '   ';
  const bSel = (STATE.selectedType===1) ? '▶ ' : '   ';
  g.fillText(`${aSel}タイプA：HP 5 / 速度 2.8 / 連射 100ms`, 180, 260);
  g.fillText(`${bSel}タイプB：HP 8 / 速度 2.2 / 連射 130ms`, 180, 300);
  g.fillText('Enter で決定', 320, 360);
}

function drawResult(g) {
  g.fillStyle = '#fff';
  g.font = '36px sans-serif';
  g.fillText(STATE.resultMessage, 320, 240);

  g.font = '18px sans-serif';
  g.fillText(`今回スコア: ${STATE.score}`, 320, 290);

  g.fillText('スコアボード (TOP3):', 290, 340);
  const list = STATE.scoreboard.list();
  list.forEach((e,i)=>{
    g.fillText(`${i+1}. ${e.name} - ${e.score}`, 310, 370 + i*24);
  });

  g.fillText('Enter / Space でタイトルへ', 260, 460);
}

// スコア加点の共通関数（敵ヒット時などから呼ぶ）
export function addScore(n) {
  STATE.score += n|0;
}
export function getStageMultiplier() {
  const s = STATE.stageList[STATE.stageIndex];
  return Math.max(1, s||1);
}
export function getState() { return STATE; }
