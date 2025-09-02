// 円同士の衝突（中心距離^2 <= (r合)^2）
export function circleHit(x1,y1,r1, x2,y2,r2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  const d2 = dx*dx + dy*dy;
  const R = r1 + r2;
  return d2 <= R*R;
}
