function initCardAnimations(container) {
  const cards = container.querySelectorAll(".card");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // stagger effect
          setTimeout(() => {
            entry.target.classList.add("show");
          }, i * 100);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  cards.forEach((card) => observer.observe(card));
}
