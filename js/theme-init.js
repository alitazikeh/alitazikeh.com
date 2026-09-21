(function () {
  var theme = null;
  try {
    var saved = window.localStorage.getItem("portfolio-theme");
    if (saved === "dark" || saved === "light") {
      theme = saved;
    }
  } catch (error) {
    // System preference remains available when storage is blocked.
  }
  if (!theme) {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.dataset.theme = theme;
})();
