document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("dark-mode");
    const body = document.body;

    if (darkModeToggle) {
        darkModeToggle.addEventListener("change", () => {
            if (darkModeToggle.checked) {
                body.classList.add("dark-mode");
                localStorage.setItem("darkMode", "enabled");
            } else {
                body.classList.remove("dark-mode");
                localStorage.setItem("darkMode", "disabled");
            }
        });

        if (localStorage.getItem("darkMode") === "enabled") {
            body.classList.add("dark-mode");
            darkModeToggle.checked = true;
        }
    }

    const refreshIcon = document.getElementById("refresh-icon");

    function updateRefreshIcon() {
        if (body.classList.contains("dark-mode")) {
            refreshIcon.src = "img/refresh_dark.svg";
        } else {
            refreshIcon.src = "img/refresh_light.svg";
        }
    }

    updateRefreshIcon();

    darkModeToggle.addEventListener("change", updateRefreshIcon);

});
