document.addEventListener("DOMContentLoaded", () => {
  const timeline = document.querySelector(".timeline");
  const timelineLine = document.getElementById("timeline-line");
  const items = Array.from(document.querySelectorAll(".timeline-item"));
  const scrollProgressBar = document.getElementById("scroll-progress");

  // ---------- Scroll Progress ----------
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    if (scrollProgressBar) scrollProgressBar.style.width = scrollPercent + "%";
  }
  window.addEventListener("scroll", updateScrollProgress);
  updateScrollProgress();

  // ---------- Timeline Dates ----------
  items.forEach((item) => {
    const date = item.getAttribute("data-date");
    if (!date) return;

    const dateEl = document.createElement("div");
    dateEl.classList.add("timeline-date", item.classList.contains("left") ? "left" : "right");

    const line = document.createElement("span");
    line.classList.add("line");

    const label = document.createElement("span");
    label.textContent = date;

    if (dateEl.classList.contains("left")) {
      dateEl.appendChild(line);
      dateEl.appendChild(label);
    } else {
      dateEl.appendChild(label);
      dateEl.appendChild(line);
    }

    timeline.appendChild(dateEl);
    item._dateEl = dateEl;
  });

  // ---------- Timeline Update ----------
  function updateTimeline() {
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const timelineRect = timeline.getBoundingClientRect();
    const timelineTop = scrollTop + timelineRect.top;
    const timelineHeight = timeline.offsetHeight;

    let progress = (scrollTop + viewportHeight - timelineTop) / timelineHeight;
    progress = Math.min(Math.max(progress, 0), 1);
    if (timelineLine) timelineLine.style.height = progress * timelineHeight + "px";

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const dateEl = item._dateEl;

      const itemTopVisible = rect.top <= viewportHeight * 0.85;
      const itemBottomVisible = rect.bottom >= viewportHeight * 0.15;

      if (itemTopVisible && itemBottomVisible) {
        item.classList.add("visible");
        dateEl.classList.add("visible");
      } else {
        item.classList.remove("visible");
        dateEl.classList.remove("visible");
      }

      const itemCenter = rect.top + scrollTop + rect.height / 2;
      const timelineTopScroll = timelineRect.top + scrollTop;
      const topPosition = itemCenter - timelineTopScroll - dateEl.offsetHeight / 2;
      dateEl.style.top = topPosition + "px";
    });
  }

  window.addEventListener("scroll", updateTimeline);
  window.addEventListener("resize", updateTimeline);
  updateTimeline();
});