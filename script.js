document.addEventListener("DOMContentLoaded", function () {
    // ✅ 1. 모달 열기 & 닫기 기능
    function setupModal(triggerSelector, modalSelector) {
        const trigger = document.querySelector(triggerSelector);
        const modal = document.querySelector(modalSelector);
        const closeBtn = modal.querySelector(".close");

        if (!trigger || !modal || !closeBtn) return;

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

        window.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                modal.style.display = "none";
            }
        });
    }

    setupModal("#compCardBtn", "#modalCompCard");
    setupModal("#videoCheckBtn", "#modalVideoCheck");

    // ✅ 2. 갤러리1 - 가로 슬라이드 & 중앙 강조 효과
    const galleryContainer = document.querySelector(".gallery-container");
    const galleryItems = document.querySelectorAll(".gallery-item");

    if (galleryContainer && galleryItems.length) {
        let isDown = false;
        let startX, scrollLeft;

        // 가로 스크롤 드래그 기능
        galleryContainer.addEventListener("mousedown", (e) => {
            isDown = true;
            startX = e.pageX - galleryContainer.offsetLeft;
            scrollLeft = galleryContainer.scrollLeft;
        });

        galleryContainer.addEventListener("mouseleave", () => isDown = false);
        galleryContainer.addEventListener("mouseup", () => isDown = false);

        galleryContainer.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - galleryContainer.offsetLeft;
            const walk = (x - startX) * 2;
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

            galleryItems.forEach(item => item.classList.remove("highlight"));
            if (closestItem) closestItem.classList.add("highlight");
        }

        galleryContainer.addEventListener("scroll", highlightCenterImage);
        highlightCenterImage();
    }

    // ✅ 3. 갤러리1 모달 기능 (이미지 클릭 시 확대)
    const galleryModal = document.getElementById("galleryModal");
    const galleryImage = document.getElementById("galleryImage");

    if (galleryModal && galleryImage) {
        galleryItems.forEach(item => {
            item.addEventListener("click", function () {
                galleryImage.src = this.querySelector("img").src;
                galleryModal.style.display = "block";
            });
        });

        galleryModal.querySelector(".close").addEventListener("click", function () {
            galleryModal.style.display = "none";
        });

        window.addEventListener("click", function (event) {
            if (event.target === galleryModal) {
                galleryModal.style.display = "none";
            }
        });

        window.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                galleryModal.style.display = "none";
            }
        });
    }

    // ✅ 4. 다크 모드 기능 추가 (자동 감지 & 사용자 설정 유지)
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
            updateDarkModeUI(detectSystemDarkMode());
        } else {
            updateDarkModeUI(savedDarkMode === "true");
        }
    }

    darkModeToggle.addEventListener("click", function () {
        const isDarkMode = !document.body.classList.contains("dark-mode");
        updateDarkModeUI(isDarkMode);
    });

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (localStorage.getItem("darkMode") === null) {
            updateDarkModeUI(e.matches);
        }
    });

    loadDarkModeSetting();
});