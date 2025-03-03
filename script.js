document.addEventListener("DOMContentLoaded", function () {
    // 모달 열기 & 닫기 기능
    function setupModal(triggerSelector, modalSelector) {
        const trigger = document.querySelector(triggerSelector);
        const modal = document.querySelector(modalSelector);
        const closeBtn = modal.querySelector(".close");

        trigger.addEventListener("click", function () {
            modal.style.display = "block";
        });

        closeBtn.addEventListener("click", function () {
            modal.style.display = "none";
        });

        window.addEventListener("click", function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    }

    // Comp Card 모달
    setupModal("#compCardBtn", "#modalCompCard");

    // Video Check 모달
    setupModal("#videoCheckBtn", "#modalVideoCheck");

    /* ✅ 1. 갤러리1 - 가로 슬라이드 & 중앙 강조 효과 */
    const galleryContainer = document.querySelector(".gallery-container");
    const galleryItems = document.querySelectorAll(".gallery-item");
    let isDown = false;
    let startX, scrollLeft;

    // 가로 스크롤 드래그 기능
    galleryContainer.addEventListener("mousedown", (e) => {
        isDown = true;
        galleryContainer.classList.add("active");
        startX = e.pageX - galleryContainer.offsetLeft;
        scrollLeft = galleryContainer.scrollLeft;
    });

    galleryContainer.addEventListener("mouseleave", () => {
        isDown = false;
        galleryContainer.classList.remove("active");
    });

    galleryContainer.addEventListener("mouseup", () => {
        isDown = false;
        galleryContainer.classList.remove("active");
    });

    galleryContainer.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - galleryContainer.offsetLeft;
        const walk = (x - startX) * 2; // 드래그 속도 조정
        galleryContainer.scrollLeft = scrollLeft - walk;
    });

    // 중앙 강조 효과
    function highlightCenterImage() {
        const centerX = galleryContainer.clientWidth / 2;
        let closestItem = null;
        let minDistance = Infinity;

        galleryItems.forEach((item) => {
            const itemX = item.getBoundingClientRect().left + item.clientWidth / 2;
            const distance = Math.abs(centerX - itemX);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestItem = item;
            }
        });

        // 모든 아이템 초기화
        galleryItems.forEach(item => item.classList.remove("highlight"));
        
        // 중앙에 가장 가까운 아이템 강조
        if (closestItem) {
            closestItem.classList.add("highlight");
        }
    }

    // 스크롤 시 중앙 강조 업데이트
    galleryContainer.addEventListener("scroll", highlightCenterImage);

    // 페이지 로드 시 초기 강조
    highlightCenterImage();

    /* ✅ 2. ESC 키 및 외부 클릭으로 모달 닫기 */
    const modals = document.querySelectorAll(".modal");
    const closeButtons = document.querySelectorAll(".modal .close");

    function closeModal() {
        modals.forEach((modal) => {
            modal.style.display = "none";
        });
    }

    closeButtons.forEach((button) => {
        button.addEventListener("click", closeModal);
    });

    window.addEventListener("click", (event) => {
        modals.forEach((modal) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    });

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });

    /* ✅ 3. 다크 모드 기능 추가 */
    const darkModeToggle = document.createElement("button");
    darkModeToggle.id = "darkModeToggle";
    document.body.appendChild(darkModeToggle);

    function updateDarkModeUI(isDark) {
        document.body.classList.toggle("dark-mode", isDark);
        darkModeToggle.textContent = isDark ? "☀️ 라이트 모드" : "🌙 다크 모드";
        localStorage.setItem("darkMode", isDark);
    }

    function detectSystemDarkMode() {
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    function loadDarkModeSetting() {
        const savedDarkMode = localStorage.getItem("darkMode");
        if (savedDarkMode === null) {
            // 사용자가 설정하지 않았다면, 시스템 설정을 따른다.
            updateDarkModeUI(detectSystemDarkMode());
        } else {
            // 저장된 설정 적용
            updateDarkModeUI(savedDarkMode === "true");
        }
    }

    darkModeToggle.addEventListener("click", function () {
        const isDarkMode = !document.body.classList.contains("dark-mode");
        updateDarkModeUI(isDarkMode);
    });

    // 시스템 다크 모드 변경 감지 (실시간 반영)
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (localStorage.getItem("darkMode") === null) {
            updateDarkModeUI(e.matches);
        }
    });

    // 초기 설정 로드
    loadDarkModeSetting();
});

    // 갤러리1 모달 기능
    const galleryItems = document.querySelectorAll(".gallery-item img");
    const galleryModal = document.getElementById("galleryModal");
    const galleryImage = document.getElementById("galleryImage");
    const galleryClose = galleryModal.querySelector(".close");

    galleryItems.forEach(item => {
        item.addEventListener("click", function () {
            galleryImage.src = this.src;
            galleryModal.style.display = "block";
        });
    });

    galleryClose.addEventListener("click", function () {
        galleryModal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === galleryModal) {
            galleryModal.style.display = "none";
        }
    });

    // 갤러리2 모달 기능 (이전/다음 버튼 포함)
    const gallery2Items = document.querySelectorAll(".gallery2-item img");
    const gallery2Modal = document.getElementById("gallery2Modal");
    const gallery2Image = document.getElementById("gallery2Image");
    const gallery2Filename = document.getElementById("gallery2Filename");
    const prevGallery2Btn = document.getElementById("prevGallery2Btn");
    const nextGallery2Btn = document.getElementById("nextGallery2Btn");
    const gallery2Close = gallery2Modal.querySelector(".close");

    let currentIndex = 0;

    function updateGallery2Image(index) {
        gallery2Image.src = gallery2Items[index].src;
        gallery2Filename.textContent = gallery2Items[index].alt;
    }

    gallery2Items.forEach((item, index) => {
        item.addEventListener("click", function () {
            currentIndex = index;
            updateGallery2Image(currentIndex);
            gallery2Modal.style.display = "block";
        });
    });

    prevGallery2Btn.addEventListener("click", function () {
        if (currentIndex > 0) {
            currentIndex--;
            updateGallery2Image(currentIndex);
        }
    });

    nextGallery2Btn.addEventListener("click", function () {
        if (currentIndex < gallery2Items.length - 1) {
            currentIndex++;
            updateGallery2Image(currentIndex);
        }
    });

    gallery2Close.addEventListener("click", function () {
        gallery2Modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === gallery2Modal) {
            gallery2Modal.style.display = "none";
        }
    });
});