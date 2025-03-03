document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ JavaScript 실행됨"); // 콘솔 확인용

    // ✅ 요소 가져오기
    const galleryItems = document.querySelectorAll(".gallery-item img");
    const galleryModal = document.getElementById("galleryModal");
    const galleryImage = document.getElementById("galleryImage");
    const closeModalBtn = document.querySelector(".modal .close");

    // ✅ 갤러리 이미지 클릭 시 모달 열기
    galleryItems.forEach((img) => {
        img.addEventListener("click", function () {
            console.log("✅ 이미지 클릭됨", img.src); // 콘솔 확인용
            galleryImage.src = img.src;
            galleryModal.style.display = "flex";
        });
    });

    // ✅ 모달 닫기 버튼 클릭 시 모달 닫기
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", function () {
            console.log("✅ 모달 닫기 버튼 클릭됨"); // 콘솔 확인용
            galleryModal.style.display = "none";
        });
    }

    // ✅ ESC 키로 모달 닫기
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            console.log("✅ ESC 키 눌림 - 모달 닫힘"); // 콘솔 확인용
            galleryModal.style.display = "none";
        }
    });
});