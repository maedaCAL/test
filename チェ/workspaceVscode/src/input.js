// 入力管理（キー押下/離上をトラッキング）。justPressedでエッジを検出
export function Input(window) {
  const keys = new Map();
  const just = new Set();
  const prev = new Set();

  window.addEventListener('keydown', (e)=>{
    keys.set(e.key, true);
  });
  window.addEventListener('keyup', (e)=>{
    keys.set(e.key, false);
  });

  function update() {
    just.clear();
    for (const [k, v] of keys.entries()) {
      const was = prev.has(k);
      if (v && !was) just.add(k);
      if (v) prev.add(k); else prev.delete(k);
    }
  }
  return {
    update,
    pressed: (k)=> !!keys.get(k),
    justPressed: (k)=> just.has(k),
  };
}
