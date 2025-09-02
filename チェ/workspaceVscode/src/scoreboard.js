// スコアボード：メモリ内TOP3のみ（localStorageは使わない）
export function Scoreboard() {
  let top = [];

  function trySubmit(score) {
    // ランクインなら名前をプロンプト（空/キャンセルは"NO NAME"）
    const qualifies = top.length < 3 || score > top[top.length-1].score;
    if (!qualifies) return false;
    let name = prompt('名前を入力してください（TOP3にランクイン）:', 'NO NAME');
    if (!name || !name.trim()) name = 'NO NAME';
    top.push({ name, score: score|0 });
    top.sort((a,b)=> b.score - a.score);
    if (top.length > 3) top.length = 3;
    return true;
  }
  function list() { return top.slice(0,3); }

  return { trySubmit, list };
}
