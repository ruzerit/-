document.addEventListener("DOMContentLoaded", function () {
    // Comp Card & Video Check 모달 기능
    function setupModal(triggerId, modalId) {
        const trigger = document.getElementById(triggerId);
        const modal = document.getElementById(modalId);
        const closeBtn = modal.querySelector(".close");

        trigger.addEventListener("click", () => {
            modal.style.display = "flex";
        });

        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });

        window.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    }

    setupModal("compCardBtn", "modalCompCard");
    setupModal("videoCheckBtn", "modalVideoCheck");

    // 갤러리1 모달 기능
    const galleryItems = document.querySelectorAll(".gallery-item img");
    const galleryModal = document.getElementById("galleryModal");
    const galleryImage = document.getElementById("galleryImage");
    const closeGalleryModal = galleryModal.querySelector(".close");

    galleryItems.forEach((img) => {
        img.addEventListener("click", () => {
            galleryImage.src = img.src;
            galleryModal.style.display = "flex";
        });
    });

    closeGalleryModal.addEventListener("click", () => {
        galleryModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === galleryModal) {
            galleryModal.style.display = "none";
        }
    });

    // 갤러리2 모달 기능 (슬라이드 포함)
    const gallery2Items = document.querySelectorAll(".gallery2-item img");
    const gallery2Modal = document.getElementById("gallery2Modal");
    const gallery2Image = document.getElementById("gallery2Image");
    const gallery2Filename = document.getElementById("gallery2Filename");
    const closeGallery2Modal = gallery2Modal.querySelector(".close");
    const prevBtn = document.getElementById("prevGallery2Btn");
    const nextBtn = document.getElementById("nextGallery2Btn");

    let currentIndex = 0;

    function updateGallery2Image(index) {
        const img = gallery2Items[index];
        gallery2Image.src = img.src;
        gallery2Filename.textContent = img.alt;
    }

    gallery2Items.forEach((img, index) => {
        img.addEventListener("click", () => {
            currentIndex = index;
            updateGallery2Image(currentIndex);
            gallery2Modal.style.display = "flex";
        });
    });

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateGallery2Image(currentIndex);
        }
    });

    nextBtn.addEventListener("click", () => {
        if (currentIndex < gallery2Items.length - 1) {
            currentIndex++;
            updateGallery2Image(currentIndex);
        }
    });

    closeGallery2Modal.addEventListener("click", () => {
        gallery2Modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === gallery2Modal) {
            gallery2Modal.style.display = "none";
        }
    });
});