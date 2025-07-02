const timeline = document.querySelector(".timeline");
const timelineLine = document.getElementById("timeline-line");
const items = Array.from(document.querySelectorAll(".timeline-item"));

const scrollProgressBar = document.getElementById("scroll-progress");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollProgressBar.style.width = scrollPercent + "%";
});

items.forEach((item) => {
  const date = item.getAttribute("data-date");
  const dateEl = document.createElement("div");
  dateEl.classList.add("timeline-date");

  if (item.classList.contains("left")) {
    dateEl.classList.add("left");
  } else {
    dateEl.classList.add("right");
  }

  const line = document.createElement("span");
  line.classList.add("line");

  const label = document.createElement("span");
  label.textContent = date;

  if (dateEl.classList.contains("left")) {
    // Left side content, horizontal line on left side of date label
    dateEl.appendChild(line);
    dateEl.appendChild(label);
  } else {
    // Right side content, horizontal line on right side of date label
    dateEl.appendChild(label);
    dateEl.appendChild(line);
  }

  timeline.appendChild(dateEl);
  item._dateEl = dateEl;
});

function update() {
  const scrollTop = window.scrollY || window.pageYOffset;
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;

  const timelineRect = timeline.getBoundingClientRect();
  const timelineTop = scrollTop + timelineRect.top;
  const timelineHeight = timeline.offsetHeight;

  let progress = (scrollTop + viewportHeight - timelineTop) / timelineHeight;
  progress = Math.min(Math.max(progress, 0), 1);

  timelineLine.style.height = progress * timelineHeight + "px";

  items.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const dateEl = item._dateEl;

    // Define visibility threshold:
    // When item top is below 85% of viewport height AND
    // item bottom is above 15% of viewport height
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
    const topPosition =
      itemCenter - timelineTopScroll - dateEl.offsetHeight / 2;

    dateEl.style.top = topPosition + "px";
  });
}

window.addEventListener("scroll", update);
window.addEventListener("resize", update);
window.addEventListener("load", update);

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.getElementById("scroll-progress").style.width = scrollPercent + "%";
});
