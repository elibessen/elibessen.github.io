const words = [
  "Computer Scientist.",
  "Frontend Developer.",
  "AI Student.",
  "Technology Administrator.",
  "Web Developer.",
  "Software Engineer.",
  "Systems Thinker.",
  "Technology Enthusiast.",
  "Creative Coder.",
];

const typewriter = document.getElementById("typewriter");
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let lastTimestamp = 0;
let delay = 80;
let pauseUntil = 0;

function step(timestamp) {
  if (timestamp < pauseUntil) {
    requestAnimationFrame(step);
    return;
  }

  if (timestamp - lastTimestamp < delay) {
    requestAnimationFrame(step);
    return;
  }
  lastTimestamp = timestamp;

  const currentWord = words[wordIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typewriter.textContent = currentWord.substring(0, charIndex);

  if (!isDeleting && charIndex === currentWord.length) {
    pauseUntil = timestamp + 1800; // pause before deleting
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    pauseUntil = timestamp + 600; // pause before typing next
  }

  delay = isDeleting ? 50 : 80;
  requestAnimationFrame(step);
}

document.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(step);
});
