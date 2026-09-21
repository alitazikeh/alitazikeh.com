(function () {
  var systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  var theme = systemTheme;
  try {
    window.localStorage.removeItem("portfolio-theme");
    var saved = JSON.parse(window.localStorage.getItem("portfolio-theme-choice") || "null");
    if (saved && saved.system === systemTheme && (saved.theme === "dark" || saved.theme === "light")) {
      theme = saved.theme;
    } else {
      window.localStorage.removeItem("portfolio-theme-choice");
    }
  } catch (error) {
    // System preference remains available when storage is blocked.
  }
  document.documentElement.dataset.theme = theme;
})();
