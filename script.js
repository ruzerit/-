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
    const compCardImage = document.getElementById("compCardImage");
    const videoElement = modalVideoCheck?.querySelector("video");
    const galleryModal = document.getElementById("galleryModal");
    const galleryImage = document.getElementById("galleryImage");
    const galleryContainer = document.querySelector(".gallery-container");
    const galleryItems = document.querySelectorAll(".gallery-item");
    const gallery2Items = document.querySelectorAll(".gallery2-item");
    const gallery2Modal = document.getElementById("gallery2Modal");
    const gallery2Image = document.getElementById("gallery2Image");
    const gallery2Filename = document.getElementById("gallery2Filename");

    // ✅ 모달 열기/닫기
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
                modal.style.display = "none";
            }, 300);
            document.body.classList.remove("modal-open");
        }
    }

    // ✅ 버튼 클릭 이벤트 연결 (누락 보완)
    compCardBtn?.addEventListener("click", openCompCardModal);
    videoCheckBtn?.addEventListener("click", openVideoModal);

    function openVideoModal() {
        closeModal(galleryModal);
        closeModal(modalCompCard);
        openModal(modalVideoCheck);
        if (videoElement) videoElement.play().catch(() => {});
    }

    function closeVideoModal() {
        closeModal(modalVideoCheck);
        if (videoElement) videoElement.pause();
    }

    function openCompCardModal() {
        closeModal(galleryModal);
        closeModal(modalVideoCheck);
        currentCompCardIndex = 0;
        if (compCardImage) compCardImage.src = compCardImages[currentCompCardIndex];
        openModal(modalCompCard);
    }

    function closeCompCardModal() {
        closeModal(modalCompCard);
    }

    function changeCompCardImage(direction) {
        if (!compCardImages.length || !compCardImage) return;
        currentCompCardIndex = (currentCompCardIndex + direction + compCardImages.length) % compCardImages.length;
        compCardImage.src = compCardImages[currentCompCardIndex];
    }

    // ✅ 갤러리1 Lazy Load
    const gallery1Images = document.querySelectorAll('.gallery-container .gallery-item img');
    const gallery1Observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                }
                obs.unobserve(img);
            }
        });
    });

    gallery1Images.forEach(img => {
        const originalSrc = img.dataset.src || img.src;
        if (originalSrc) {
            img.src = '';
            img.dataset.src = originalSrc;
            gallery1Observer.observe(img);
        }
    });

    // ✅ 갤러리1 중심 강조
    function updateActiveImage() {
        const center = galleryContainer.clientWidth / 2;
        let closestItem = null;
        let closestDistance = Infinity;
        galleryItems.forEach((item) => {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.left + rect.width / 2;
            const distance = Math.abs(center - itemCenter);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestItem = item;
            }
        });
        galleryItems.forEach((item) => item.classList.remove("active"));
        if (closestItem) closestItem.classList.add("active");
    }

    galleryContainer?.addEventListener("scroll", updateActiveImage);
    galleryContainer?.addEventListener("wheel", function (event) {
        event.preventDefault();
        galleryContainer.scrollLeft += event.deltaY;
    }, { passive: false });
    updateActiveImage();

    function openGalleryModal(src) {
        galleryIndex = Array.from(galleryItems).findIndex(item => {
            const img = item.querySelector("img");
            return img && img.src.includes(src);
        });
        if (galleryIndex === -1) return;
        galleryImage.src = galleryItems[galleryIndex].querySelector("img").src;
        openModal(galleryModal);
    }

    function changeGalleryImage(direction) {
        galleryIndex = (galleryIndex + direction + galleryItems.length) % galleryItems.length;
        if (galleryItems[galleryIndex]) {
            galleryImage.src = galleryItems[galleryIndex].querySelector("img").src;
        }
    }

    // ✅ 갤러리2 Lazy Load
    const lazyImages = document.querySelectorAll('.gallery2-item img');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                }
                obs.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        const originalSrc = img.dataset.src || img.src;
        if (originalSrc) {
            img.src = '';
            img.dataset.src = originalSrc;
            observer.observe(img);
        }
    });

    // ✅ 갤러리2 모달
    function openGallery2Modal(src) {
        gallery2Index = Array.from(gallery2Items).findIndex(item =>
            item.querySelector("img")?.src.includes(src)
        );
        if (gallery2Index === -1) return;
        const clickedItem = gallery2Items[gallery2Index].querySelector("img");
        if (!clickedItem) return;
        gallery2Image.src = clickedItem.src;
        gallery2Filename.textContent = clickedItem.alt || clickedItem.src.split('/').pop();
        openModal(gallery2Modal);
    }

    function changeGallery2Image(direction) {
        gallery2Index = (gallery2Index + direction + gallery2Items.length) % gallery2Items.length;
        const newItem = gallery2Items[gallery2Index].querySelector("img");
        if (!newItem) return;
        gallery2Image.src = newItem.src;
        gallery2Filename.textContent = newItem.alt || newItem.src.split('/').pop();
    }

    // ✅ 갤러리2 등장 애니메이션
    function revealGallery2Items() {
        const windowHeight = window.innerHeight;
        gallery2Items.forEach((item) => {
            if (item.getBoundingClientRect().top < windowHeight - 50) {
                item.classList.add("visible");
            }
        });
    }

    window.addEventListener("scroll", revealGallery2Items);
    revealGallery2Items();

    // ✅ 갤러리2 클릭 이벤트 연결
    gallery2Items.forEach((item) => {
        const img = item.querySelector("img");
        if (img) {
            img.addEventListener("click", () => {
                openGallery2Modal(img.src);
            });
        }
    });

    // ✅ ESC 및 화살표 키 이벤트
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeModal(modalCompCard);
            closeModal(galleryModal);
            closeModal(gallery2Modal);
            closeModal(modalVideoCheck);
        }
        if (gallery2Modal?.classList.contains("show")) {
            if (event.key === "ArrowLeft") changeGallery2Image(-1);
            if (event.key === "ArrowRight") changeGallery2Image(1);
        }
        if (galleryModal?.classList.contains("show")) {
            if (event.key === "ArrowLeft") changeGalleryImage(-1);
            if (event.key === "ArrowRight") changeGalleryImage(1);
        }
    });

    // ✅ 닫기 버튼 이벤트
    document.querySelectorAll(".modal .close").forEach((closeBtn) => {
        closeBtn.addEventListener("click", function () {
            closeModal(modalCompCard);
            closeModal(galleryModal);
            closeModal(gallery2Modal);
            closeModal(modalVideoCheck);
        });
    });

    // ✅ 전역 함수 등록
    window.changeCompCardImage = changeCompCardImage;
    window.openGalleryModal = openGalleryModal;
    window.changeGallery2Image = changeGallery2Image;
    window.openGallery2Modal = openGallery2Modal;
});