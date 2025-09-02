// HUD描画。スコア / HP / ステージ / コイン を表示
import { getState } from './main.js';

export function createHUD(canvas, STATE) {
  const gWidth = canvas.width;

  return {
    render(g) {
      const s = getState();
      g.fillStyle = '#fff';
      g.font = '16px monospace';
      const currentStage = s.stageList[s.stageIndex];
      const stageText = (currentStage==null) ? 'END' : `${currentStage}/6`;
      g.fillText(`SCORE: ${s.score}`, 16, 20);
      g.fillText(`HP: ${s.__playerHP ?? '-'}`, 160, 20);
      g.fillText(`STAGE: ${stageText}`, 240, 20);
      g.fillText(`COIN: ${s.coin}`, 360, 20);

      // ステージ残り時間バー（簡易）
      if (s.__stageTimer != null && s.__stageLimit != null) {
        const ratio = Math.max(0, Math.min(1, 1 - s.__stageTimer / s.__stageLimit));
        g.fillStyle = '#08f';
        g.fillRect(16, 28, ratio * (gWidth - 32), 6);
      }
    }
  };
}
