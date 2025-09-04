// 한국어: 메뉴 클릭하면 해당 섹션으로 스크롤 이동
document.querySelectorAll('.menu a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});
