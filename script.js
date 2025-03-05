document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ JavaScript 실행됨"); // 확인용

    // ✅ 요소 가져오기
    const compCardBtn = document.getElementById("compCardBtn");
    const videoCheckBtn = document.getElementById("videoCheckBtn");

    const modalCompCard = document.getElementById("modalCompCard");
    const modalVideoCheck = document.getElementById("modalVideoCheck");

    const closeButtons = document.querySelectorAll(".modal .close");

    // ✅ 컴카드 버튼 클릭 시 모달 열기
    if (compCardBtn && modalCompCard) {
        compCardBtn.addEventListener("click", function () {
            console.log("✅ Comp Card 버튼 클릭됨");
            modalCompCard.style.display = "flex";
        });
    }

    // ✅ 비디오 체크 버튼 클릭 시 모달 열기
    if (videoCheckBtn && modalVideoCheck) {
        videoCheckBtn.addEventListener("click", function () {
            console.log("✅ Video Check 버튼 클릭됨");
            modalVideoCheck.style.display = "flex";
        });
    }

    // ✅ 닫기 버튼 클릭 시 해당 모달 닫기
    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            console.log("✅ 모달 닫기 버튼 클릭됨");
            this.closest(".modal").style.display = "none";
        });
    });

    // ✅ ESC 키를 누르면 모든 모달 닫기
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            console.log("✅ ESC 키 눌림 - 모든 모달 닫기");
            document.querySelectorAll(".modal").forEach(modal => {
                modal.style.display = "none";
            });
        }
    });

    // ✅ 모달 바깥을 클릭하면 닫기
    document.addEventListener("click", function (event) {
        document.querySelectorAll(".modal").forEach(modal => {
            if (event.target === modal) {
                console.log("✅ 모달 바깥 클릭됨 - 모달 닫기");
                modal.style.display = "none";
            }
        });
    });
});