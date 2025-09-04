// --- Leaderboard에 기록 추가 ---
function addScore(lines) {
  const list = document.getElementById("todoList"); // 기존 리스트 활용

  // 현재 시간
  const now = new Date();
  const timeStr = now.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  // li 생성
  const li = document.createElement("li");
  li.innerText = `${timeStr} - Lines: ${lines}`;

  list.appendChild(li);

  // 저장 (localStorage)
  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.push({ time: timeStr, lines });
  localStorage.setItem("scores", JSON.stringify(scores));
}

// --- 저장된 기록 불러오기 ---
window.addEventListener("load", () => {
  const scores = JSON.parse(localStorage.getItem("scores")) || [];
  const list = document.getElementById("todoList");
  scores.forEach(s => {
    const li = document.createElement("li");
    li.innerText = `${s.time} - Lines: ${s.lines}`;
    list.appendChild(li);
  });
});
