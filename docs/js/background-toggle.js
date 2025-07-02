const toggle = document.getElementById("theme-toggle");
const body = document.body;
const changedSection = document.body;
const footer = document.querySelector("#footer");

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function updateBackground() {
  const footerRect = footer.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  const fadeStart = windowHeight + 50;
  const fadeEnd = fadeStart - 400;
  const distanceToFooter = footerRect.top;

  const isDarkMode = changedSection.classList.contains("dark-mode");

  if (distanceToFooter <= fadeStart && distanceToFooter >= fadeEnd) {
    let progress = (fadeStart - distanceToFooter) / (fadeStart - fadeEnd);
    progress = clamp(progress, 0, 1);

    let colorValue;
    if (isDarkMode) {
      // Dark mode: fade black -> white
      colorValue = Math.round(255 * progress);
    } else {
      // Light mode: fade white -> black
      colorValue = Math.round(255 * (1 - progress));
    }

    const rgb = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
    changedSection.style.backgroundColor = rgb;
    footer.style.backgroundColor = rgb;
  } else if (distanceToFooter < fadeEnd) {
    // Past fade zone
    if (isDarkMode) {
      changedSection.style.backgroundColor = "rgb(255, 255, 255)";
      footer.style.backgroundColor = "rgb(255, 255, 255)";
    } else {
      changedSection.style.backgroundColor = "rgb(0, 0, 0)";
      footer.style.backgroundColor = "rgb(0, 0, 0)";
    }
  } else {
    // Default background before fade zone
    if (isDarkMode) {
      changedSection.style.backgroundColor = "rgb(0, 0, 0)";
      footer.style.backgroundColor = "";
    } else {
      changedSection.style.backgroundColor = "rgb(255, 255, 255)";
      footer.style.backgroundColor = "";
    }
  }
}

function setTheme(darkMode) {
  if (darkMode) {
    body.classList.add("dark-mode");
    toggle.checked = true;
  } else {
    body.classList.remove("dark-mode");
    toggle.checked = false;
  }
  localStorage.setItem("darkMode", darkMode);
  updateBackground(); // Immediately update background on theme change
}

// Load saved theme or default to system preference
const storedTheme = localStorage.getItem("darkMode");
if (storedTheme !== null) {
  setTheme(storedTheme === "true");
} else {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark);
}

toggle.addEventListener("change", () => {
  setTheme(toggle.checked);
});

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("open");

  // Accessibility toggle
  const expanded = hamburger.getAttribute("aria-expanded") === "true" || false;
  hamburger.setAttribute("aria-expanded", !expanded);
});

window.addEventListener("scroll", updateBackground);
window.addEventListener("resize", updateBackground);
updateBackground();
