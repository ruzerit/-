document.addEventListener("DOMContentLoaded", function () {
    /* ======================
       모달 기능 구현
       ====================== */
    // 모달 요소 및 내부 이미지 요소 선택
    const modal = document.querySelector(".modal");
    const modalImg = modal.querySelector("img");

    // 모달 내 네비게이션 버튼 생성 (다음, 이전)
    const modalNextBtn = document.createElement("button");
    const modalPrevBtn = document.createElement("button");
    modalNextBtn.textContent = "Next";
    modalPrevBtn.textContent = "Prev";
    modalNextBtn.classList.add("modal-next");
    modalPrevBtn.classList.add("modal-prev");

    // 버튼 스타일은 CSS에서 처리 (위치, 크기 등)
    modal.appendChild(modalPrevBtn);
    modal.appendChild(modalNextBtn);

    // 현재 모달에서 보여질 이미지 그룹과 인덱스 상태 저장
    let currentGroupImages = [];
    let currentIndex = 0;

    // 모달 열기 함수: 해당 그룹 배열과 선택된 인덱스에 따라 모달을 열고 이미지 설정
    function openModal(group, index) {
        currentGroupImages = group;
        currentIndex = index;
        modalImg.src = currentGroupImages[currentIndex].src;
        modal.classList.add("show");
    }

    // 갤러리 1와 갤러리 2의 모든 이미지에 클릭 이벤트 추가
    const allGalleryImages = document.querySelectorAll(".gallery img, .grid-gallery img");
    allGalleryImages.forEach((img) => {
        img.addEventListener("click", function () {
            let group;
            // 클릭된 이미지가 어느 갤러리에 속하는지 판단
            if (img.closest(".gallery")) {
                group = Array.from(document.querySelectorAll(".gallery img"));
            } else if (img.closest(".grid-gallery")) {
                group = Array.from(document.querySelectorAll(".grid-gallery img"));
            }
            const index = group.indexOf(img);
            openModal(group, index);
        });
    });

    // 모달 내 다음 버튼: 다음 이미지로 이동 (마지막이면 첫 번째로)
    modalNextBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        currentIndex = (currentIndex < currentGroupImages.length - 1) ? currentIndex + 1 : 0;
        modalImg.src = currentGroupImages[currentIndex].src;
    });

    // 모달 내 이전 버튼: 이전 이미지로 이동 (첫 번째면 마지막 이미지로)
    modalPrevBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentGroupImages.length - 1;
        modalImg.src = currentGroupImages[currentIndex].src;
    });

    // 모달 닫기: 모달 영역(이미지 외부)을 클릭하거나 터치할 경우 닫기
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("show");
        }
    });

    // 키보드 이벤트: Esc로 모달 닫기, 좌우 화살표로 이미지 이동
    document.addEventListener("keydown", (e) => {
        if (!modal.classList.contains("show")) return;
        if (e.key === "Escape") {
            modal.classList.remove("show");
        } else if (e.key === "ArrowRight") {
            currentIndex = (currentIndex < currentGroupImages.length - 1) ? currentIndex + 1 : 0;
            modalImg.src = currentGroupImages[currentIndex].src;
        } else if (e.key === "ArrowLeft") {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentGroupImages.length - 1;
            modalImg.src = currentGroupImages[currentIndex].src;
        }
    });

    /* ======================
       갤러리 2 스크롤 애니메이션 구현
       ====================== */
    const gridGalleryImages = document.querySelectorAll(".grid-gallery img");
    function revealImages() {
        gridGalleryImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            // 화면의 약 85% 높이 안쪽으로 들어오면 나타나도록
            if (rect.top < window.innerHeight * 0.85) {
                img.classList.add("show");
            }
        });
    }
    window.addEventListener("scroll", revealImages);
    revealImages();

    /* ======================
       갤러리 1 슬라이드 중앙 강조 효과
       ====================== */
    const galleryContainer = document.querySelector(".gallery");
    let activeIndex = 0;
    function updateGallery() {
        const imgs = galleryContainer.querySelectorAll("img");
        imgs.forEach((img, index) => {
            // 중앙에 가까운 이미지에 active 클래스 부여해 크기 확대 등 CSS 효과 적용
            img.classList.toggle("active", index === activeIndex);
        });
    }
    // 스크롤 시 현재 중앙에 가까운 이미지 계산
    galleryContainer.addEventListener("scroll", function () {
        const scrollLeft = galleryContainer.scrollLeft;
        const imgWidth = galleryContainer.querySelector("img").offsetWidth;
        activeIndex = Math.round(scrollLeft / imgWidth);
        updateGallery();
    });
    updateGallery();
});