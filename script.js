// ✅ 전역 변수 선언
let currentGalleryIndex = 0;
let currentGallery2Index = 0;
let isDown = false;
let startX, startScrollLeft;
let scrollTimer;

// ✅ DOMContentLoaded 이벤트 리스너
document.addEventListener("DOMContentLoaded", function () {
    // ✅ 요소 가져오기
    const galleryModal = document.getElementById("galleryModal");
    const galleryImage = document.getElementById("galleryImage");
    const gallery2Modal = document.getElementById("gallery2Modal");
    const galleryItems = document.querySelectorAll(".gallery-item img");
    const gallery2Images = document.querySelectorAll(".gallery2-item img");
    const gallery2Filename = document.getElementById("gallery2Filename");
    const galleryContainer = document.querySelector(".gallery-container");

    const darkModeToggle = document.getElementById("darkModeToggle");
    const modals = document.querySelectorAll(".modal");
    const videoElement = document.querySelector("video");

    const compCardBtn = document.getElementById("compCardBtn");
    const videoCheckBtn = document.getElementById("videoCheckBtn");

    // ✅ 버튼 이벤트 추가
    if (compCardBtn) compCardBtn.addEventListener("click", () => openModal("modalCompCard"));
    if (videoCheckBtn) videoCheckBtn.addEventListener("click", () => openModal("modalVideoCheck"));

    // ✅ 갤러리1 클릭 이벤트 추가 (중앙 정렬 + 모달)
    galleryItems.forEach((img, index) => {
        img.addEventListener("click", function () {
            currentGalleryIndex = index;
            updateGalleryModal();
            openModal("galleryModal");
        });
    });

    // ✅ 갤러리2 클릭 이벤트 추가 (파일명 표시 + 모달)
    gallery2Images.forEach((img, index) => {
        img.addEventListener("click", function () {
            openGallery2Modal(index);
        });
    });

    // ✅ 모달 닫기 버튼 이벤트 추가
    document.querySelectorAll(".modal .close").forEach((btn) => {
        btn.addEventListener("click", () => closeModal(btn.closest(".modal").id));
    });

    // ✅ ESC 키 & 화살표 키 이벤트 추가
    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "Escape":
                modals.forEach(modal => closeModal(modal.id));
                break;
            case "ArrowRight":
                nextGalleryImage();
                break;
            case "ArrowLeft":
                prevGalleryImage();
                break;
        }
    });

    // ✅ 갤러리 중앙 정렬 유지
    function updateCenterImage() {
        if (!galleryContainer || galleryItems.length === 0) return;

        let containerCenter = galleryContainer.clientWidth / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;

        galleryItems.forEach((item, index) => {
            let itemCenter = item.offsetLeft + item.offsetWidth / 2 - galleryContainer.offsetLeft;
            let distance = Math.abs(itemCenter - (galleryContainer.scrollLeft + containerCenter));

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        let selectedItem = galleryItems[closestIndex];
        let targetScrollLeft = selectedItem.offsetLeft - containerCenter + selectedItem.offsetWidth / 2;

        galleryContainer.scrollTo({ left: targetScrollLeft, behavior: "smooth" });

        // ✅ 중앙에 온 이미지 강조 효과 추가
        galleryItems.forEach((item, index) => {
            item.classList.toggle("active", index === closestIndex);
        });
    }

    // ✅ 가로 슬라이드 기능 추가 (마우스 드래그 & 터치)
    galleryContainer.addEventListener("mousedown", (e) => {
        isDown = true;
        startX = e.pageX - galleryContainer.offsetLeft;
        startScrollLeft = galleryContainer.scrollLeft;
        galleryContainer.style.cursor = "grabbing";
    });

    ["mouseleave", "mouseup"].forEach(event =>
        galleryContainer.addEventListener(event, () => {
            isDown = false;
            galleryContainer.style.cursor = "grab";
        })
    );

    galleryContainer.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        let x = e.pageX - galleryContainer.offsetLeft;
        let walk = (x - startX) * 2;
        galleryContainer.scrollLeft = startScrollLeft - walk;
    });

    // ✅ 다크 모드 설정
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
            localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
        });
    }
});

// ✅ 모달 열기 함수
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.style.display = "flex";
    requestAnimationFrame(() => {
        modal.style.opacity = "1";
        modal.style.visibility = "visible";
    });
}

// ✅ 모달 닫기 함수
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.style.opacity = "0";
    modal.style.visibility = "hidden";
    setTimeout(() => { modal.style.display = "none"; }, 300);

    if (modalId === "modalVideoCheck") {
        const video = modal.querySelector("video");
        if (video) video.pause();
    }
}

// ✅ 갤러리2 모달 열기
function openGallery2Modal(index) {
    currentGallery2Index = index;
    gallery2Modal.style.display = "flex";
    gallery2Filename.textContent = gallery2Images[index].alt || "이미지";
    gallery2Modal.querySelector("img").src = gallery2Images[index].src;
}

// ✅ 갤러리1 다음 이미지
function nextGalleryImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    updateGalleryModal();
}

// ✅ 갤러리1 이전 이미지
function prevGalleryImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    updateGalleryModal();
}

// ✅ 갤러리1 모달 업데이트
function updateGalleryModal() {
    galleryImage.src = galleryItems[currentGalleryIndex].src;
}