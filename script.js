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
    galleryItems = document.querySelectorAll(".gallery-item img");
    gallery2Modal = document.getElementById("gallery2Modal");
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

    if (gallery2Images && gallery2Images.length > 0) {
        gallery2Images.forEach((img, index) => {
            img.parentElement.classList.add("visible");
            img.addEventListener("click", () => openGallery2Modal(index)); 
        });
    }

    galleryItems.forEach((img) => {
        img.addEventListener("click", function () {
            openGalleryModal(this);
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
    
    requestAnimationFrame(() => {
        if (galleryContainer && galleryItems.length > 0) {
            let containerCenter = galleryContainer.clientWidth / 2;
            let selectedItemIndex = Math.floor(galleryItems.length / 2);
            let selectedItem = galleryItems[selectedItemIndex];

            let itemCenter = selectedItem.offsetLeft + (selectedItem.offsetWidth / 2);
            let scrollTo = itemCenter - containerCenter;

            galleryContainer.scrollTo({
                left: scrollTo,
                behavior: "smooth"
            });

            updateCenterImage();
        }
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
  
    if (galleryContainer) {
        galleryContainer.addEventListener("scroll", () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(updateCenterImage, 200);
        });

        galleryContainer.addEventListener("mousedown", (e) => {
            isDown = true;
            startX = e.pageX - galleryContainer.offsetLeft;
            startScrollLeft = galleryContainer.scrollLeft;
        });

        galleryContainer.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            let x = e.pageX - galleryContainer.offsetLeft;
            let walk = (x - startX) * 2;
            galleryContainer.scrollLeft = startScrollLeft - walk;
        });

        ["mouseup", "mouseleave", "touchend"].forEach(evt =>
            galleryContainer.addEventListener(evt, () => isDown = false)
        );

        galleryContainer.addEventListener("touchstart", (e) => {
            isDown = true;
            startX = e.touches[0].pageX - galleryContainer.offsetLeft;
            startScrollLeft = galleryContainer.scrollLeft;
        });

        galleryContainer.addEventListener("touchmove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            let x = e.touches[0].pageX - galleryContainer.offsetLeft;
            let walk = (x - startX) * 2;
            galleryContainer.scrollLeft = startScrollLeft - walk;
        });
    }

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
    if (modal) {
        modal.style.display = "flex";
        modal.style.visibility = "visible";
        modal.style.opacity = "1";
    }
}
// ✅ 모달 닫기 함수 (전역)
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.transition = "opacity 0.3s ease";
        modal.style.opacity = "0";
        modal.style.visibility = "hidden";
        setTimeout(() => { modal.style.display = "none"; }, 300);
        if (modalId === "modalVideoCheck" && modal.querySelector("video")) {
            modal.querySelector("video").pause();
        }
    }
}
// ✅ 중앙 정렬 유지 함수 (전역)
function updateCenterImage() {
    if (!galleryContainer || galleryItems.length === 0) return;

    let containerWidth = galleryContainer.clientWidth;
    let containerCenter = containerWidth / 2;
    let maxScrollLeft = galleryContainer.scrollWidth - containerWidth;
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

    if (closestIndex === 0) targetScrollLeft = 0;
    if (closestIndex === galleryItems.length - 1) targetScrollLeft = maxScrollLeft;

    galleryContainer.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth"
    });

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

    galleryItems.forEach((item, index) => {
        item.classList.toggle("active", index === closestIndex);
    });
}


// ✅ 전역에서 정의 (어디서든 접근 가능)
function updateGalleryModal() {
    const images = document.querySelectorAll(".gallery-item img");
    if (galleryImage) {
        galleryImage.src = images[currentGalleryIndex].src;
    }
}

function prevGalleryImage() {
    if (currentGalleryIndex > 0) {
        currentGalleryIndex--;
        updateGalleryModal();
    }
}

function nextGalleryImage() {
    const images = document.querySelectorAll(".gallery-item img");
    if (currentGalleryIndex < images.length - 1) {
        currentGalleryIndex++;
        updateGalleryModal();
    }
}

function openGallery2Modal(index) {
    if (!gallery2Images || !gallery2Images.length) return;
    currentGallery2Index = index;

    if (!gallery2Images[currentGallery2Index]) return;

    updateGallery2Modal();
    
    gallery2Modal.style.display = "flex";
    setTimeout(() => {
        gallery2Modal.style.opacity = "1";
        gallery2Modal.style.visibility = "visible";
    }, 50);
}

// 갤러리2 모달 닫기 기능 추가
function closeGallery2Modal() {
    if (!gallery2Modal) return;
    gallery2Modal.style.opacity = "0";
    gallery2Modal.style.visibility = "hidden";
    setTimeout(() => { gallery2Modal.style.display = "none"; }, 300);
}

// 갤러리2 이미지 업데이트 함수 추가
function updateGallery2Modal() {
    if (!gallery2Image || !gallery2Filename) return;
    if (!gallery2Images[currentGallery2Index]) return;

    const imgEl = gallery2Images[currentGallery2Index];
    gallery2Image.src = imgEl.src;
    gallery2Filename.innerText = imgEl.parentElement.dataset.filename || "";
}

// 갤러리2 이전/다음 버튼 동작 추가
function prevGallery2Image() {
    if (currentGallery2Index > 0) {
        currentGallery2Index--;
        updateGallery2Modal();
    }
}

function nextGallery2Image() {
    if (currentGallery2Index < gallery2Images.length - 1) {
        currentGallery2Index++;
        updateGallery2Modal();
    }
}