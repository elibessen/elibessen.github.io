setTimeout(() => {
  const intro = document.getElementById("intro-screen");
  if (intro) intro.style.display = "none";
}, 4500);

window.addEventListener("load", () => {
  const page = document.getElementById("page");
  if (page) {
    page.classList.remove("hidden");
  }
});
