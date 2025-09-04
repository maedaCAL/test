// =======================
// ToDo 리스트 저장/불러오기
// =======================
function saveTodos() {
  const list = document.getElementById("todoList");
  const todos = [];
  list.querySelectorAll("span").forEach(span => {
    todos.push(span.innerText);
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const saved = localStorage.getItem("todos");
  if (!saved) return;
  JSON.parse(saved).forEach(text => addTodo(text, false));
}

function addTodo(text, save = true) {
  const input = document.getElementById("todoInput");
  const list = document.getElementById("todoList");
  if (!input || !list) return;

  const value = text ?? input.value;
  if (value.trim() === "") return;

  // li 생성
  const li = document.createElement("li");
  li.style.display = "flex";
  li.style.justifyContent = "space-between";
  li.style.alignItems = "center";
  li.style.border = "1px solid #7BA05B";
  li.style.padding = "10px";
  li.style.marginTop = "10px";
  li.style.borderRadius = "6px";
  li.style.background = "#fff";
  li.style.transition = "transform 0.2s";

  li.onmouseenter = () => (li.style.transform = "scale(1.02)");
  li.onmouseleave = () => (li.style.transform = "scale(1)");

  // 텍스트
  const span = document.createElement("span");
  span.innerText = value;
  span.style.flex = "1";
  span.style.textAlign = "left";

  // 버튼 컨테이너
  const btnWrapper = document.createElement("div");

  // 수정 버튼
  const editBtn = document.createElement("button");
  editBtn.innerText = "修正";
  Object.assign(editBtn.style, {
    background: "#7BA05B",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer"
  });

  // 삭제 버튼
  const delBtn = document.createElement("button");
  delBtn.innerText = "削除";
  Object.assign(delBtn.style, {
    marginLeft: "10px",
    background: "#7BA05B",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer"
  });

  // 수정 버튼 동작
  editBtn.onclick = function () {
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = span.innerText;

    const saveBtn = document.createElement("button");
    saveBtn.innerText = "保存";
    Object.assign(saveBtn.style, {
      marginLeft: "10px",
      background: "#7BA05B",
      color: "#fff",
      border: "none",
      padding: "5px 10px",
      borderRadius: "4px",
      cursor: "pointer"
    });

    saveBtn.onclick = function () {
      span.innerText = editInput.value;
      li.replaceChild(span, editInput);
      btnWrapper.replaceChild(editBtn, saveBtn);
      saveTodos();
    };

    li.replaceChild(editInput, span);
    btnWrapper.replaceChild(saveBtn, editBtn);
    editInput.focus();
  };

  // 삭제 버튼 동작
  delBtn.onclick = function () {
    li.remove();
    saveTodos();
  };

  btnWrapper.appendChild(editBtn);
  btnWrapper.appendChild(delBtn);
  li.appendChild(span);
  li.appendChild(btnWrapper);
  list.appendChild(li);

  if (save) saveTodos();
  if (input) input.value = "";
}

window.onload = loadTodos;


// =======================
// 사이드 메뉴 동작
// =======================
const toggleBtn = document.querySelector('.menu-toggle');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');

// 햄버거 클릭 → 사이드 메뉴 열기
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    sideMenu.classList.add('active');
    overlay.classList.add('active');
  });
}

// 오버레이 클릭 → 닫기
if (overlay) {
  overlay.addEventListener('click', () => {
    sideMenu.classList.remove('active');
    overlay.classList.remove('active');
  });
}

// 사이드 메뉴 내부 링크 처리
document.querySelectorAll('.side-menu a').forEach(link => {
  link.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    const submenu = this.nextElementSibling;

    // About 메뉴 → 서브메뉴 토글
    if (submenu && submenu.classList.contains('submenu')) {
      e.preventDefault();
      submenu.classList.toggle('active');
      return;
    }

    // 내부 앵커 → 스크롤 이동
    if (targetId.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      sideMenu.classList.remove('active');
      overlay.classList.remove('active');
    }
  });
});

// 페이지 로드 시 해시(#...) 있으면 중앙 이동
window.addEventListener('load', () => {
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
});


// =======================
// 취미 슬라이더 (수동)
// =======================
const hobbySlides = document.querySelector('.slides');
const hobbyItems = document.querySelectorAll('.slides a');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let hobbyIndex = 0;

function updateHobbySlide() {
  hobbySlides.style.transform = `translateX(-${hobbyIndex * 100}%)`;
}

if (nextBtn && prevBtn) {
  nextBtn.addEventListener('click', () => {
    hobbyIndex = (hobbyIndex + 1) % hobbyItems.length;
    updateHobbySlide();
  });

  prevBtn.addEventListener('click', () => {
    hobbyIndex = (hobbyIndex - 1 + hobbyItems.length) % hobbyItems.length;
    updateHobbySlide();
  });
}


// =======================
// Easter Egg: 카피바라 로고 10번 클릭 시 game.html 이동
// =======================
const logo = document.querySelector('.profile-img');
let logoClickCount = 0;

if (logo) {
  logo.addEventListener('click', () => {
    logoClickCount++;
    if (logoClickCount >= 10) {
      window.location.href = "game.html";
    }
  });
}


// =======================
// 배너 타자기 효과 (최초 1회만 실행)
// =======================
const texts = {
  ja: "ようこそ、私のポートフォリオへ",
  en: "Welcome to My Portfolio"
};

let currentLang = "ja";
const typeTarget = document.getElementById("typewriter");
let idx = 0;
let typingStarted = false;

function typeEffect() {
  if (idx < texts[currentLang].length) {
    typeTarget.textContent += texts[currentLang].charAt(idx);
    idx++;
    setTimeout(typeEffect, 120);
  }
}

// =======================
// 스크롤 시 (타자기 + 프로필 카드)
// =======================
window.addEventListener("scroll", () => {
  // 타자기 효과 (최초 1회만 실행)
  if (!typingStarted && typeTarget && typeTarget.getBoundingClientRect().top < window.innerHeight - 100) {
    typingStarted = true;
    typeEffect();
  }

  // 프로필 카드 등장
  const profileCard = document.querySelector(".profile-card");
  if (profileCard) {
    const rect = profileCard.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      profileCard.classList.add("show");
    }
  }
});

// =======================
// 번역 버튼 눌렀을 때 (공통)
// =======================
const translateBtn = document.getElementById("translateBtn");
if (translateBtn) {
  translateBtn.addEventListener("click", () => {
    currentLang = (currentLang === "ja") ? "en" : "ja";

    // 모든 [data-ja] 요소 변환
    const elements = document.querySelectorAll("[data-ja]");
    elements.forEach(el => {
      el.innerText = (currentLang === "ja") ? el.dataset.ja : el.dataset.en;
    });

    // 메인 페이지에만 있는 typewriter 처리
    if (typeTarget) {
      typeTarget.textContent = texts[currentLang];
    }
  });
}

const musicBtn = document.getElementById("musicBtn");
const bgm = document.getElementById("bgm");
const icon = musicBtn.querySelector("i");

if (musicBtn && bgm) {
  // 자동재생 시도
  bgm.muted = false;
  bgm.play().catch(() => {
    icon.className = "fa-solid fa-music"; // 자동재생 실패 시 음악 아이콘
  });

  // 버튼 클릭 → 재생/정지 토글
  musicBtn.addEventListener("click", () => {
    if (bgm.paused) {
      bgm.play();
      icon.className = "fa-solid fa-pause"; // 정지 아이콘
    } else {
      bgm.pause();
      icon.className = "fa-solid fa-music"; // 음악 아이콘
    }
  });
}

