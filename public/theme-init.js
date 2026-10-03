(function () {
  "use strict";
  var theme = "light";
  try {
    theme = window.localStorage.getItem("6b-theme") === "dark" ? "dark" : "light";
  } catch (error) {
    theme = "light";
  }
  var root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
})();
