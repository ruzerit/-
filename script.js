// ✅ 전역 변수 선언
let currentGalleryIndex = 0;
let currentGallery2Index = 0;
let isDown = false;
let startX, startScrollLeft;

// ✅ DOMContentLoaded 이벤트 리스너
document.addEventListener("DOMContentLoaded", function () {
    // ✅ 요소 가져오기
    const galleryModal = document.getElementById("galleryModal");
    const galleryItems = document.querySelectorAll(".gallery-item img");
    const galleryImage = document.getElementById("galleryImage");

    const gallery2Modal = document.getElementById("gallery2Modal");
    const gallery2Images = document.querySelectorAll(".gallery2-item img");
    const gallery2Filename = document.getElementById("gallery2Filename");

    const galleryContainer = document.querySelector(".gallery-container");
    const darkModeToggle = document.getElementById("darkModeToggle");

    const compCardBtn = document.getElementById("compCardBtn");
    const videoCheckBtn = document.getElementById("videoCheckBtn");

    if (compCardBtn) compCardBtn.addEventListener("click", () => openModal("modalCompCard"));
    if (videoCheckBtn) videoCheckBtn.addEventListener("click", () => openModal("modalVideoCheck"));

    // ✅ 갤러리1 클릭 이벤트 추가
    galleryItems.forEach((img, index) => {
        img.addEventListener("click", function () {
            handleGalleryModal(1, index);
        });
    });

    // ✅ 갤러리2 클릭 이벤트 추가
    gallery2Images.forEach((img, index) => {
        img.addEventListener("click", function () {
            handleGalleryModal(2, index);
        });
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

    // ✅ 모달 외부 클릭 또는 ESC 키로 닫기
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("modal")) {
            closeModal(event.target.id);
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeModal("galleryModal");
            closeModal("gallery2Modal");
        } else if (event.key === "ArrowRight") {
            changeGalleryImage(1, "next");
        } else if (event.key === "ArrowLeft") {
            changeGalleryImage(1, "prev");
        }
    });

    // ✅ 갤러리1 가로 슬라이드 & 중앙 정렬
    if (galleryContainer) {
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
    }
});

// ✅ 범용 모달 처리 함수 (열기 & 업데이트)
function handleGalleryModal(galleryType, index = null) {
    let modal, images, filenameElement, modalImage;

    if (galleryType === 1) {
        modal = document.getElementById("galleryModal");
        images = document.querySelectorAll(".gallery-item img");
    } else {
        modal = document.getElementById("gallery2Modal");
        images = document.querySelectorAll(".gallery2-item img");
        filenameElement = document.getElementById("gallery2Filename");
    }

    if (!modal || images.length === 0) return;

    // ✅ 모달 내 이미지 요소 찾기
    modalImage = modal.querySelector("img");
    if (!modalImage) return;

    // ✅ 새로 열린 경우 (index가 주어짐 → 모달 열기)
    if (index !== null) {
        if (index < 0 || index >= images.length) return;
        if (galleryType === 1) {
            currentGalleryIndex = index;
        } else {
            currentGallery2Index = index;
        }
        modal.style.display = "flex";
    }

    // ✅ 현재 인덱스 설정
    let currentIndexVar = (galleryType === 1) ? currentGalleryIndex : currentGallery2Index;

    // ✅ 갤러리2의 경우 파일명 업데이트
    if (filenameElement) {
        filenameElement.textContent = images[currentIndexVar].alt || "이미지";
    }

    // ✅ 이미지 업데이트
    modalImage.src = images[currentIndexVar].src;
}

// ✅ 범용 갤러리 이미지 변경 함수 (이전 & 다음)
function changeGalleryImage(galleryType, direction) {
    let images, currentIndexVar;

    if (galleryType === 1) {
        images = document.querySelectorAll(".gallery-item img");
        currentIndexVar = currentGalleryIndex;
    } else {
        images = document.querySelectorAll(".gallery2-item img");
        currentIndexVar = currentGallery2Index;
    }

    if (images.length === 0) return;

    if (direction === "next") {
        currentIndexVar = (currentIndexVar + 1) % images.length;
    } else {
        currentIndexVar = (currentIndexVar - 1 + images.length) % images.length;
    }

    if (galleryType === 1) {
        currentGalleryIndex = currentIndexVar;
    } else {
        currentGallery2Index = currentIndexVar;
    }

    handleGalleryModal(galleryType);
}

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
}