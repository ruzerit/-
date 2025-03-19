document.addEventListener("DOMContentLoaded", function () {
    let compCardImages = ["compcard1.jpg", "compcard2.jpg"];
    let currentCompCardIndex = 0;
    let galleryIndex = 0;
    let gallery2Index = 0;

    // ✅ 요소 선택
    const compCardBtn = document.getElementById("compCardBtn");
    const videoCheckBtn = document.getElementById("videoCheckBtn");
    const modalCompCard = document.getElementById("modalCompCard");
    const modalVideoCheck = document.getElementById("modalVideoCheck");
    const compCardImage = modalCompCard?.querySelector("img");
    const videoElement = modalVideoCheck?.querySelector("video");
    const galleryModal = document.getElementById("galleryModal");
    const galleryImage = document.getElementById("galleryImage");
    const galleryContainer = document.querySelector(".gallery-container");
    const galleryItems = document.querySelectorAll(".gallery-item");
    const gallery2Items = document.querySelectorAll(".gallery2-item");
    const gallery2Modal = document.getElementById("gallery2Modal");
    const gallery2Image = document.getElementById("gallery2Image");

    // ✅ 모달 열기/닫기 헬퍼 함수
    function openModal(modal) {
        if (modal) {
            modal.style.display = "flex";
            setTimeout(() => modal.classList.add("show"), 10);
            document.body.classList.add("modal-open");
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove("show");
            setTimeout(() => {
                if (!modal.classList.contains("show")) {
                    modal.style.display = "none";
                }
            }, 300);
            document.body.classList.remove("modal-open"); // 스크롤 복구
        }
    }

    // ✅ 비디오 모달 열기
    function openVideoModal() {
        closeModal(galleryModal);
        closeModal(modalCompCard);
        openModal(modalVideoCheck);
        if (videoElement) videoElement.play();
    }

    // ✅ 비디오 모달 닫기
    function closeVideoModal() {
        closeModal(modalVideoCheck);
        if (videoElement) videoElement.pause();
    }

    // ✅ 컴카드 모달 열기
    function openCompCardModal() {
        closeModal(galleryModal);
        closeModal(modalVideoCheck);
        currentCompCardIndex = 0;
        if (compCardImage) compCardImage.src = compCardImages[currentCompCardIndex];
        openModal(modalCompCard);
    }

    // ✅ 컴카드 모달 닫기
    function closeCompCardModal() {
        closeModal(modalCompCard);
    }

    // ✅ 컴카드 모달에서 다음/이전 이미지
    function changeCompCardImage(direction) {
        if (!compCardImages.length || !compCardImage) return;
        currentCompCardIndex = (currentCompCardIndex + direction + compCardImages.length) % compCardImages.length;
        compCardImage.src = compCardImages[currentCompCardIndex];
    }

    // ✅ 갤러리 1: 중앙 강조 & 가로 슬라이드
    function updateActiveImage() {
        let center = galleryContainer.clientWidth / 2;
        let closestItem = null;
        let closestDistance = Infinity;

        galleryItems.forEach((item) => {
            let rect = item.getBoundingClientRect();
            let itemCenter = rect.left + rect.width / 2;
            let distance = Math.abs(center - itemCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestItem = item;
            }
        });

        galleryItems.forEach((item) => item.classList.remove("active"));
        if (closestItem) closestItem.classList.add("active");
    }

    // ✅ 가로 슬라이드 기능 추가
    galleryContainer.addEventListener("scroll", updateActiveImage);
    galleryContainer.addEventListener("wheel", function (event) {
        event.preventDefault();
        galleryContainer.scrollLeft += event.deltaY;
    });

    updateActiveImage();

    // ✅ 갤러리 1: 클릭하면 모달창 열기 & 다음 사진 보기
    function openGalleryModal(index) {
        closeModal(modalCompCard);
        closeModal(modalVideoCheck);
        galleryIndex = index;
        if (galleryItems[galleryIndex]) {
            galleryImage.src = galleryItems[galleryIndex].querySelector("img").src;
            openModal(galleryModal);
        }
    }

    function changeGalleryImage(direction) {
        galleryIndex = (galleryIndex + direction + galleryItems.length) % galleryItems.length;
        if (galleryItems[galleryIndex]) {
            galleryImage.src = galleryItems[galleryIndex].querySelector("img").src;
        }
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener("click", () => openGalleryModal(index));
    });

    // ✅ 갤러리 2: 아래에서 위로 등장 애니메이션
    function revealGallery2Items() {
        let windowHeight = window.innerHeight;

        gallery2Items.forEach((item) => {
            let itemTop = item.getBoundingClientRect().top;
            if (itemTop < windowHeight - 50) {
                item.classList.add("visible");
            }
        });
    }

    window.addEventListener("scroll", revealGallery2Items);
    revealGallery2Items();

    // ✅ 갤러리 2: 클릭하면 모달창 열기 & 다음 사진 보기
    function openGallery2Modal(index) {
        closeModal(modalCompCard);
        closeModal(modalVideoCheck);
        gallery2Index = index;
        if (gallery2Items[gallery2Index]) {
            gallery2Image.src = gallery2Items[gallery2Index].querySelector("img").src;
            openModal(gallery2Modal);
        }
    }

    function changeGallery2Image(direction) {
        gallery2Index = (gallery2Index + direction + gallery2Items.length) % gallery2Items.length;
        if (gallery2Items[gallery2Index]) {
            gallery2Image.src = gallery2Items[gallery2Index].querySelector("img").src;
        }
    }

    gallery2Items.forEach((item, index) => {
        item.addEventListener("click", () => openGallery2Modal(index));
    });

    // ✅ ESC 키를 누르면 열린 모달 닫기
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeModal(modalCompCard);
            closeModal(galleryModal);
            closeModal(gallery2Modal);
            closeModal(modalVideoCheck);
        }
    });

    // ✅ 닫기 버튼 이벤트 연결
    document.querySelectorAll(".modal .close").forEach((closeBtn) => {
        closeBtn.addEventListener("click", function () {
            closeModal(modalCompCard);
            closeModal(galleryModal);
            closeModal(gallery2Modal);
            closeModal(modalVideoCheck);
        });
    });
});