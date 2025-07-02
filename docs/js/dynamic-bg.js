const changedSection = document.body;
const footer = document.querySelector("#footer");

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function updateBackground() {
  const footerRect = footer.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Start fade 100px before footer hits viewport bottom
  const fadeStart = windowHeight + 50;
  // Fade ends 400px below that start (longer fade range)
  const fadeEnd = fadeStart - 400;

  const distanceToFooter = footerRect.top;

  if (distanceToFooter <= fadeStart && distanceToFooter >= fadeEnd) {
    let progress = (fadeStart - distanceToFooter) / (fadeStart - fadeEnd);
    progress = clamp(progress, 0, 1);

    const colorValue = Math.round(255 * (1 - progress));
    const rgb = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;

    changedSection.style.backgroundColor = rgb;
    footer.style.backgroundColor = rgb;
  } else if (distanceToFooter < fadeEnd) {
    // Fully black background past fade zone
    changedSection.style.backgroundColor = "rgb(0, 0, 0)";
    footer.style.backgroundColor = "rgb(0, 0, 0)";
  } else {
    // Default white background before fade zone
    changedSection.style.backgroundColor = "rgb(255, 255, 255)";
    footer.style.backgroundColor = "rgb(255, 255, 255)";
  }
}

window.addEventListener("scroll", updateBackground);
window.addEventListener("resize", updateBackground);
updateBackground();
