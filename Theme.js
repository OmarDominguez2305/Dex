const savedTheme = localStorage.getItem("dex-theme") || "light";
document.documentElement.dataset.theme = savedTheme;

function toggleTheme() {
    const theme =
        document.documentElement.dataset.theme === "light"
            ? "dark"
            : "light";

    document.documentElement.dataset.theme = theme;
    localStorage.setItem("dex-theme", theme);
}

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("themeButton");
    if (button) {
        button.textContent =
            document.documentElement.dataset.theme === "light" ? "☀️" : "🌙";
        button.onclick = toggleTheme;
    }
});