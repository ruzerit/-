// ✅ 전역 변수 최소화 및 DOM 요소 캐싱
document.addEventListener("DOMContentLoaded", () => {
    const galleryModal = document.getElementById("galleryModal");
    const galleryImage = document.getElementById("galleryImage");
    const gallery2Modal = document.getElementById("gallery2Modal");
    const gallery2Image = document.getElementById("gallery2Image");
    const gallery2Filename = document.getElementById("gallery2Filename");
    const galleryContainer = document.querySelector(".gallery-container");
    const galleryItems = document.querySelectorAll(".gallery-item img");
    const gallery2Images = document.querySelectorAll(".gallery2-item img");
    const modals = document.querySelectorAll(".modal");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const compCardBtn = document.getElementById("compCardBtn");
    const videoCheckBtn = document.getElementById("videoCheckBtn");
    const videoElement = document.querySelector("#modalVideoCheck video");

    let currentGalleryIndex = 0;
    let currentGallery2Index = 0;
    let isDown = false, startX, startScrollLeft;
    let scrollTimeout;

    // ✅ 모달 열기/닫기 기능
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.style.display = "flex";
        requestAnimationFrame(() => {
            modal.style.opacity = "1";
            modal.style.visibility = "visible";
        });
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.style.opacity = "0";
        modal.style.visibility = "hidden";
        setTimeout(() => { modal.style.display = "none"; }, 300);
        
        if (modalId === "modalVideoCheck" && videoElement) {
            videoElement.pause();
        }
    }

    // ✅ 갤러리1 모달 업데이트 및 이미지 변경
    function updateGalleryModal() {
        if (galleryImage && galleryItems[currentGalleryIndex]) {
            galleryImage.src = galleryItems[currentGalleryIndex].src;
        }
    }

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

    // ✅ 갤러리2 모달 업데이트 및 이미지 변경
    function updateGallery2Modal() {
        if (!gallery2Images[currentGallery2Index]) return;
        gallery2Image.src = gallery2Images[currentGallery2Index].src;
        gallery2Filename.innerText = gallery2Images[currentGallery2Index].parentElement.dataset.filename || "";
    }

    function openGallery2Modal(index) {
        currentGallery2Index = index;
        updateGallery2Modal();
        openModal("gallery2Modal");
    }

    function changeGallery2Image(direction) {
        const newIndex = currentGallery2Index + direction;
        if (newIndex >= 0 && newIndex < gallery2Images.length) {
            currentGallery2Index = newIndex;
            updateGallery2Modal();
        }
    }

    const prevGallery2Image = () => changeGallery2Image(-1);
    const nextGallery2Image = () => changeGallery2Image(1);

    // ✅ 이벤트 리스너 등록
    galleryItems.forEach((img, index) => img.addEventListener("click", () => {
        currentGalleryIndex = index;
        updateGalleryModal();
        openModal("galleryModal");
    }));

    gallery2Images.forEach((img, index) => img.addEventListener("click", () => openGallery2Modal(index)));

    modals.forEach(modal => {
        modal.style.display = "none";
        modal.style.opacity = "0";
        modal.style.visibility = "hidden";
        modal.addEventListener("click", (event) => {
            if (event.target === modal) closeModal(modal.id);
        });
    });

    document.querySelectorAll(".modal .close").forEach(btn => {
        btn.addEventListener("click", () => closeModal(btn.closest(".modal").id));
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") modals.forEach(modal => closeModal(modal.id));
        if (event.key === "ArrowRight") nextGalleryImage();
        if (event.key === "ArrowLeft") prevGalleryImage();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") nextGallery2Image();
        if (event.key === "ArrowLeft") prevGallery2Image();
    });

    // ✅ 모달 버튼 이벤트 추가
    if (compCardBtn) compCardBtn.addEventListener("click", () => openModal("modalCompCard"));
    if (videoCheckBtn) videoCheckBtn.addEventListener("click", () => openModal("modalVideoCheck"));

    // ✅ 갤러리 스크롤 중앙 정렬 최적화
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

        galleryItems.forEach((item, index) => item.classList.toggle("active", index === closestIndex));

        let selectedItem = galleryItems[closestIndex];
        galleryContainer.scrollTo({
            left: selectedItem.offsetLeft - containerCenter + selectedItem.offsetWidth / 2,
            behavior: "smooth"
        });
    }

    galleryContainer.addEventListener("scroll", () => {
        if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
        scrollTimeout = requestAnimationFrame(updateCenterImage);
    });

    // ✅ 가로 슬라이드 기능 추가 (마우스 및 터치)
    function startDrag(e) {
        isDown = true;
        startX = e.pageX || e.touches[0].pageX - galleryContainer.offsetLeft;
        startScrollLeft = galleryContainer.scrollLeft;
        galleryContainer.style.cursor = "grabbing";
    }

    function endDrag() {
        isDown = false;
        galleryContainer.style.cursor = "grab";
    }

    function moveDrag(e) {
        if (!isDown) return;
        e.preventDefault();
        let x = (e.pageX || e.touches[0].pageX) - galleryContainer.offsetLeft;
        let walk = (x - startX) * 2;
        galleryContainer.scrollLeft = startScrollLeft - walk;
    }

    galleryContainer.addEventListener("mousedown", startDrag);
    galleryContainer.addEventListener("mouseleave", endDrag);
    galleryContainer.addEventListener("mouseup", endDrag);
    galleryContainer.addEventListener("mousemove", moveDrag);
    galleryContainer.addEventListener("touchstart", startDrag);
    galleryContainer.addEventListener("touchend", endDrag);
    galleryContainer.addEventListener("touchmove", moveDrag);

    // ✅ 다크 모드 설정
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }

    darkModeToggle?.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
    });
});