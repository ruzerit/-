// ✅ 전역 변수 선언
let currentGalleryIndex = 0;  
let currentGallery2Index = 0; 

// 갤러리 1 관련 변수
let galleryModal = null;
let galleryImage = null;
let galleryContainer = null;
let galleryItems = []; // 배열 초기화 (undefined 방지)

// 갤러리 2 관련 변수
let gallery2Images = [];
let gallery2Modal = null;
let gallery2Image = null;
let gallery2Filename = null;

// 스크롤 및 드래그 관련 변수
let isDown = false;
let startX = 0;
let startScrollLeft = 0;
let scrollTimer = null;

// ✅ DOMContentLoaded 이벤트 리스너 
document.addEventListener("DOMContentLoaded", function () {
    // ✅ 요소 가져오기
    galleryModal = document.getElementById("galleryModal");
    galleryImage = document.getElementById("galleryImage");
    gallery2Modal = document.getElementById("gallery2Modal");
    galleryItems = document.querySelectorAll(".gallery-item img");
    gallery2Images = document.querySelectorAll(".gallery2-item img");
    gallery2Filename = document.getElementById("gallery2Filename");
    galleryContainer = document.querySelector(".gallery-container");

    const darkModeToggle = document.getElementById("darkModeToggle");
    const modals = document.querySelectorAll(".modal");
    const videoElement = document.querySelector("video");
    if (videoElement) {
        videoElement.removeAttribute("autoplay");
        videoElement.pause();
    }

    const compCardBtn = document.getElementById("compCardBtn");
    const videoCheckBtn = document.getElementById("videoCheckBtn");

    if (compCardBtn) compCardBtn.addEventListener("click", () => openModal("modalCompCard"));
    if (videoCheckBtn) videoCheckBtn.addEventListener("click", () => openModal("modalVideoCheck"));
    if (!galleryContainer || galleryItems.length === 0) return;
    if (gallery2Images && gallery2Images.length > 0) {
        gallery2Images.forEach((img, index) => {
            img.parentElement.classList.add("visible");
            img.addEventListener("click", () => openGallery2Modal(index)); 
        });
    }

    // ✅ 갤러리1 클릭 이벤트 등록
    galleryItems.forEach((img, index) => {
        img.addEventListener("click", function () {
            currentGalleryIndex = index;
            updateGalleryModal();
            openModal("galleryModal");
        });
    });

    // ✅ 갤러리2 클릭 이벤트 등록
    gallery2Images.forEach((img, index) => {
        img.addEventListener("click", function () {
            openGallery2Modal(index);
        });
    });

    modals.forEach(modal => {
        modal.style.display = "none";
        modal.style.opacity = "0";
        modal.style.visibility = "hidden";
        modal.addEventListener("click", (event) => {
            if (event.target === modal) closeModal(modal.id);
        });
    });
    
    document.querySelectorAll(".modal .close").forEach((btn) => {
        btn.addEventListener("click", () => {
            const modal = btn.closest(".modal");
            if (modal) closeModal(modal.id);
        });
    });

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

    // ✅ 중앙 정렬 유지 함수
    function updateCenterImage() {
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

        // ✅ 강조 효과 적용
        galleryItems.forEach((item, index) => {
            item.classList.toggle("active", index === closestIndex);
        });

        // ✅ 자동 중앙 정렬
        let selectedItem = galleryItems[closestIndex];
        galleryContainer.scrollTo({
            left: selectedItem.offsetLeft - containerCenter + selectedItem.offsetWidth / 2,
            behavior: "smooth"
        });
    }

    galleryContainer.addEventListener("scroll", function () {
        clearTimeout(window.scrollTimer);
        window.scrollTimer = setTimeout(updateCenterImage, 100);
    });

    // ✅ 가로 슬라이드 기능 추가 (마우스 드래그)
    let isDown = false;
    let startX, startScrollLeft;

    galleryContainer.addEventListener("mousedown", (e) => {
        isDown = true;
        startX = e.pageX - galleryContainer.offsetLeft;
        startScrollLeft = galleryContainer.scrollLeft;
        galleryContainer.style.cursor = "grabbing";
    });

    galleryContainer.addEventListener("mouseleave", () => {
        isDown = false;
        galleryContainer.style.cursor = "grab";
    });

    galleryContainer.addEventListener("mouseup", () => {
        isDown = false;
        galleryContainer.style.cursor = "grab";
    });

    galleryContainer.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        let x = e.pageX - galleryContainer.offsetLeft;
        let walk = (x - startX) * 2;
        galleryContainer.scrollLeft = startScrollLeft - walk;
    });

    // ✅ 가로 슬라이드 기능 추가 (모바일 터치)
    galleryContainer.addEventListener("touchstart", (e) => {
        isDown = true;
        startX = e.touches[0].pageX - galleryContainer.offsetLeft;
        startScrollLeft = galleryContainer.scrollLeft;
    });

    galleryContainer.addEventListener("touchend", () => isDown = false);

    galleryContainer.addEventListener("touchmove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        let x = e.touches[0].pageX - galleryContainer.offsetLeft;
        let walk = (x - startX) * 2;
        galleryContainer.scrollLeft = startScrollLeft - walk;
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
});

// ✅ 모달 열기 함수 (전역)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.style.display = "flex";
    requestAnimationFrame(() => {
        modal.style.opacity = "1";
        modal.style.visibility = "visible";
    });
}

// ✅ 모달 닫기 함수 (전역)
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.style.opacity = "0";
    modal.style.visibility = "hidden";
    setTimeout(() => { modal.style.display = "none"; }, 300);

    // ✅ 비디오 모달이면 비디오 정지
    if (modalId === "modalVideoCheck") {
        const video = modal.querySelector("video");
        if (video) video.pause();
    }
}

// ✅ 갤러리1 모달 업데이트
function updateGalleryModal() {
    if (!galleryImage || galleryItems.length === 0 || currentGalleryIndex < 0 || currentGalleryIndex >= galleryItems.length) return;
    galleryImage.src = galleryItems[currentGalleryIndex].src;
}

// ✅ 갤러리1 이전/다음 버튼 기능
function prevGalleryImage() {
    if (currentGalleryIndex > 0) {
        currentGalleryIndex--;
        updateGalleryModal();
    }
}

function nextGalleryImage() {
    if (currentGalleryIndex < galleryItems.length - 1) {
        currentGalleryIndex++;
        updateGalleryModal();
    }
}

// ✅ 갤러리2 모달 열기
function openGallery2Modal(index) {
    if (!gallery2Images.length || !gallery2Modal) return;
    currentGallery2Index = index;
    updateGallery2Modal();
    openModal("gallery2Modal");
}

// ✅ 갤러리2 모달 닫기
function closeGallery2Modal() {
    closeModal("gallery2Modal");
}

// ✅ 갤러리2 모달 업데이트
function updateGallery2Modal() {
    if (!gallery2Image || !gallery2Filename || !gallery2Images.length || currentGallery2Index < 0 || currentGallery2Index >= gallery2Images.length) return;

    const imgEl = gallery2Images[currentGallery2Index];
    if (!imgEl) return;

    gallery2Image.src = imgEl.src;
    gallery2Filename.innerText = imgEl.parentElement.dataset.filename || "";
}

// ✅ 갤러리2 이전/다음 버튼 기능
function changeGallery2Image(direction) {
    const newIndex = currentGallery2Index + direction;
    if (newIndex >= 0 && newIndex < gallery2Images.length) {
        currentGallery2Index = newIndex;
        updateGallery2Modal();
    }
}
const prevGallery2Image = () => changeGallery2Image(-1);
const nextGallery2Image = () => changeGallery2Image(1);
