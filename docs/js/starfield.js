const canvas = document.getElementById("starfield");

if (canvas) {
  const ctx = canvas.getContext("2d");
  const footer = canvas.parentElement;

  let stars = [];
  let shootingStars = [];
  let animationFrame;
  let lastTime = performance.now();

  // Star settings
  const MAX_STARS = 700;
  const STARTING_STARS = 500;
  const CHANGE_INTERVAL = 500;

  // Shooting star settings
  const SHOOTING_STAR_MIN_TIME = 5000;
  const SHOOTING_STAR_MAX_TIME = 7500;

  // Chance for a normal star to become a bright star
  const BRIGHT_STAR_CHANCE = 0.000025;

  let changeTimer = 0;

  let shootingStarTimer =
    SHOOTING_STAR_MIN_TIME +
    Math.random() * (SHOOTING_STAR_MAX_TIME - SHOOTING_STAR_MIN_TIME);

  // Mouse position
  const mouse = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    active: false,
  };

  // Track whether the footer is visible
  let footerVisible = false;

  // Resize the canvas to match the footer
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();

    let dpr = window.devicePixelRatio || 1;

    if (dpr > 2) {
      dpr = 2;
    }

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Only create stars the first time
    if (stars.length === 0) {
      createInitialStars();
    }
  }

  // Create the starting stars
  function createInitialStars() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    for (let i = 0; i < STARTING_STARS; i++) {
      stars.push(createStar(Math.random() * width, Math.random() * height));
    }
  }

  // Create a normal star
  function createStar(x, y) {
    return {
      x: x,
      y: y,

      // Slow natural movement
      driftX: (Math.random() - 0.5) * 0.008,
      driftY: (Math.random() - 0.5) * 0.008,

      // Movement caused by the mouse
      velocityX: 0,
      velocityY: 0,

      // Star appearance
      size: Math.random() * 1.3 + 0.4,
      opacity: Math.random() * 0.45 + 0.15,
      twinkleSpeed: Math.random() * 0.0015 + 0.0005,
      phase: Math.random() * Math.PI * 2,

      // Used when stars appear and disappear
      lifeOpacity: 0,
      targetOpacity: 1,
      fadingOut: false,

      // Bright star effect
      bright: false,
      brightTimer: 0,
      brightDuration: 0,
      brightStrength: 0,
    };
  }

  // Create a shooting star
  function createShootingStar() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const startSide = Math.random();

    let x;
    let y;

    // Random starting position near the top of the footer
    if (startSide < 0.5) {
      x = Math.random() * width;
      y = Math.random() * height * 0.35;
    } else {
      x = width * (0.5 + Math.random() * 0.5);
      y = Math.random() * height * 0.25;
    }

    const angle = Math.PI * 0.65 + (Math.random() - 0.5) * 0.3;

    const speed = 0.7 + Math.random() * 0.5;

    shootingStars.push({
      x: x,
      y: y,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      length: 80 + Math.random() * 80,
      size: 1.2 + Math.random(),
      life: 0,
      maxLife: 900 + Math.random() * 500,
    });
  }

  // Update shooting star positions and lifetimes
  function updateShootingStars(deltaTime) {
    shootingStarTimer -= deltaTime;

    if (shootingStarTimer <= 0 && shootingStars.length === 0) {
      createShootingStar();

      shootingStarTimer =
        SHOOTING_STAR_MIN_TIME +
        Math.random() * (SHOOTING_STAR_MAX_TIME - SHOOTING_STAR_MIN_TIME);
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const star = shootingStars[i];

      star.x += star.velocityX * deltaTime;
      star.y += star.velocityY * deltaTime;
      star.life += deltaTime;

      if (star.life > star.maxLife) {
        shootingStars.splice(i, 1);
      }
    }
  }

  // Draw shooting stars
  function drawShootingStars() {
    let colour;

    if (document.body.classList.contains("dark-mode")) {
      colour = "40, 40, 40";
    } else {
      colour = "255, 255, 255";
    }

    for (const star of shootingStars) {
      const progress = star.life / star.maxLife;
      let opacity = 1;

      if (progress < 0.15) {
        opacity = progress / 0.15;
      } else if (progress > 0.7) {
        opacity = 1 - (progress - 0.7) / 0.3;
      }

      const angle = Math.atan2(star.velocityY, star.velocityX);

      const tailX = star.x - Math.cos(angle) * star.length;

      const tailY = star.y - Math.sin(angle) * star.length;

      // Create the shooting star tail
      const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y);

      gradient.addColorStop(0, `rgba(${colour}, 0)`);

      gradient.addColorStop(0.7, `rgba(${colour}, ${opacity * 0.25})`);

      gradient.addColorStop(1, `rgba(${colour}, ${opacity})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(star.x, star.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = star.size;
      ctx.stroke();

      // Draw the bright point
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

      ctx.fillStyle = `rgba(${colour}, ${opacity})`;

      ctx.fill();
    }
  }

  // Track mouse position
  footer.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();

    mouse.targetX = event.clientX - rect.left;
    mouse.targetY = event.clientY - rect.top;
    mouse.active = true;
  });

  // Disable mouse interaction when leaving the footer
  footer.addEventListener("mouseleave", () => {
    mouse.active = false;
    mouse.targetX = -1000;
    mouse.targetY = -1000;
  });

  // Smoothly move a value towards a target
  function lerp(current, target, amount) {
    return current + (target - current) * amount;
  }

  // Add a new star
  function addStar() {
    if (stars.length < MAX_STARS) {
      const star = createStar(
        Math.random() * canvas.clientWidth,
        Math.random() * canvas.clientHeight,
      );

      stars.push(star);
    }
  }

  // Pick a random star and fade it out
  function removeStar() {
    const available = stars.filter((star) => !star.fadingOut);

    if (available.length > 0 && stars.length > 1) {
      const star = available[Math.floor(Math.random() * available.length)];

      star.fadingOut = true;
      star.targetOpacity = 0;
    }
  }

  // Slowly change the number of stars
  function changeStars(deltaTime) {
    changeTimer += deltaTime;

    if (changeTimer >= CHANGE_INTERVAL) {
      changeTimer = 0;

      if (Math.random() < 0.5 && stars.length < MAX_STARS) {
        addStar();
      } else if (stars.length > 1) {
        removeStar();
      }
    }
  }

  // Occasionally make a star become very bright
  function updateBrightStars(star, deltaTime) {
    if (!star.bright && Math.random() < BRIGHT_STAR_CHANCE) {
      star.bright = true;
      star.brightTimer = 0;
      star.brightDuration = 1000 + Math.random() * 1500;
      star.brightStrength = 3 + Math.random() * 3;
    }

    if (star.bright) {
      star.brightTimer += deltaTime;

      if (star.brightTimer > star.brightDuration) {
        star.bright = false;
        star.brightTimer = 0;
        star.brightStrength = 0;
      }
    }
  }

  // Footer element mouse interaction
  const footerElements = [
    document.querySelector(".footer-content h3"),
    document.querySelector(".footer-content p"),
    document.querySelector(".footer-content .emaillink"),
  ];

  const footerData = footerElements.filter(Boolean).map((element) => ({
    element: element,
    targetX: 0,
    targetY: 0,
    x: 0,
    y: 0,
  }));

  const footerRadius = 150;
  const footerMaxMove = 15;
  let footerAnimation;

  // Move footer elements away from the mouse
  footer.addEventListener("mousemove", (event) => {
    footerData.forEach((data) => {
      const rect = data.element.getBoundingClientRect();

      const dx = rect.left + rect.width / 2 - event.clientX;

      const dy = rect.top + rect.height / 2 - event.clientY;

      const distance = Math.hypot(dx, dy);

      if (distance >= footerRadius || distance === 0) {
        data.targetX = 0;
        data.targetY = 0;
      } else {
        const influence = 1 - distance / footerRadius;

        data.targetX = (dx / distance) * influence * footerMaxMove;

        data.targetY = (dy / distance) * influence * footerMaxMove;
      }
    });

    if (!footerAnimation) {
      animateFooter();
    }
  });

  // Return footer elements to their original positions
  footer.addEventListener("mouseleave", () => {
    footerData.forEach((data) => {
      data.targetX = 0;
      data.targetY = 0;
    });

    if (!footerAnimation) {
      animateFooter();
    }
  });

  // Smoothly animate footer elements
  function animateFooter() {
    let moving = false;

    footerData.forEach((data) => {
      data.x += (data.targetX - data.x) * 0.08;

      data.y += (data.targetY - data.y) * 0.08;

      data.element.style.transform = `translate(${data.x}px, ${data.y}px)`;

      if (
        Math.abs(data.targetX - data.x) > 0.01 ||
        Math.abs(data.targetY - data.y) > 0.01
      ) {
        moving = true;
      }
    });

    if (moving) {
      footerAnimation = requestAnimationFrame(animateFooter);
    } else {
      footerAnimation = null;
    }
  }

  // Main animation loop
  function draw(time) {
    const deltaTime = Math.min(time - lastTime, 32);

    lastTime = time;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    ctx.clearRect(0, 0, width, height);

    // Smoothly move the mouse position
    mouse.x = lerp(mouse.x, mouse.targetX, 0.12);

    mouse.y = lerp(mouse.y, mouse.targetY, 0.12);

    // Change star colour based on dark mode
    let colour;

    if (document.body.classList.contains("dark-mode")) {
      colour = "40, 40, 40";
    } else {
      colour = "255, 255, 255";
    }

    changeStars(deltaTime);
    updateShootingStars(deltaTime);

    // Update normal stars
    for (let i = stars.length - 1; i >= 0; i--) {
      const star = stars[i];

      // Slowly move the star
      star.x += star.driftX * deltaTime;
      star.y += star.driftY * deltaTime;

      // Mouse repulsion
      if (mouse.active) {
        const dx = star.x - mouse.x;
        const dy = star.y - mouse.y;
        const distance = Math.hypot(dx, dy);
        const radius = 80;

        if (distance < radius && distance > 0) {
          const influence = 1 - distance / radius;

          const smooth = influence * influence * (3 - 2 * influence);

          const force = smooth * 0.018;

          star.velocityX += (dx / distance) * force;

          star.velocityY += (dy / distance) * force;
        }
      }

      // Apply mouse movement
      star.x += star.velocityX * deltaTime;
      star.y += star.velocityY * deltaTime;

      // Slowly stop mouse movement
      star.velocityX *= 0.94;
      star.velocityY *= 0.94;

      if (Math.abs(star.velocityX) < 0.0001) {
        star.velocityX = 0;
      }

      if (Math.abs(star.velocityY) < 0.0001) {
        star.velocityY = 0;
      }

      // Wrap stars around the edges
      if (star.x < 0) {
        star.x = width;
      }

      if (star.x > width) {
        star.x = 0;
      }

      if (star.y < 0) {
        star.y = height;
      }

      if (star.y > height) {
        star.y = 0;
      }

      // Fade stars in and out
      star.lifeOpacity = lerp(star.lifeOpacity, star.targetOpacity, 0.1);

      // Delete stars after fading out
      if (star.fadingOut && star.lifeOpacity < 0.01) {
        stars.splice(i, 1);
        continue;
      }

      // Gentle twinkle
      const twinkle = Math.sin(time * star.twinkleSpeed + star.phase) * 0.2;

      const opacity = Math.max(0.05, Math.min(0.7, star.opacity + twinkle));

      updateBrightStars(star, deltaTime);

      let brightOpacity = opacity;
      let brightFade = 0;

      if (star.bright) {
        const progress = star.brightTimer / star.brightDuration;

        if (progress < 0.2) {
          brightFade = progress / 0.2;
        } else if (progress > 0.75) {
          brightFade = 1 - (progress - 0.75) / 0.25;
        } else {
          brightFade = 1;
        }

        brightOpacity = opacity + star.brightStrength * brightFade;
      }

      // Fade stars near the top of the footer
      const fadeStart = height * 0.009;
      const fadeEnd = height * 0.2;

      let positionOpacity = 1;

      if (star.y < fadeStart) {
        positionOpacity = 0;
      } else if (star.y < fadeEnd) {
        positionOpacity = (star.y - fadeStart) / (fadeEnd - fadeStart);
      }

      const finalOpacity = brightOpacity * star.lifeOpacity * positionOpacity;

      // Draw the star
      ctx.beginPath();

      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

      ctx.fillStyle = `rgba(${colour}, ${finalOpacity})`;

      ctx.fill();

      // Bright star glow and flare
      if (star.bright) {
        const glowOpacity = Math.min(0.5, brightFade * 0.5);

        // Outer glow
        ctx.beginPath();

        ctx.arc(star.x, star.y, star.size * 6, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(${colour}, ${glowOpacity * 0.2})`;

        ctx.fill();

        // Horizontal flare
        ctx.beginPath();

        ctx.moveTo(star.x - star.size * 7, star.y);

        ctx.lineTo(star.x + star.size * 7, star.y);

        ctx.strokeStyle = `rgba(${colour}, ${glowOpacity})`;

        ctx.lineWidth = 1;
        ctx.stroke();

        // Vertical flare
        ctx.beginPath();

        ctx.moveTo(star.x, star.y - star.size * 7);

        ctx.lineTo(star.x, star.y + star.size * 7);

        ctx.strokeStyle = `rgba(${colour}, ${glowOpacity})`;

        ctx.stroke();

        // Bright centre
        ctx.beginPath();

        ctx.arc(star.x, star.y, star.size * 1.8, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(${colour}, ${brightFade})`;

        ctx.fill();
      }
    }

    // Draw shooting stars after normal stars
    drawShootingStars();

    animationFrame = requestAnimationFrame(draw);
  }

  // Start the animation
  function startAnimation() {
    if (!animationFrame && footerVisible && !document.hidden) {
      lastTime = performance.now();

      animationFrame = requestAnimationFrame(draw);
    }
  }

  // Stop the animation
  function stopAnimation() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }

  // Stop animation if footer isn't in view
  const footerObserver = new IntersectionObserver((entries) => {
    const entry = entries[0];

    footerVisible = entry.isIntersecting;

    if (footerVisible) {
      startAnimation();
    } else {
      stopAnimation();
    }
  });

  footerObserver.observe(footer);

  // Resize the canvas when the window changes size
  window.addEventListener("resize", resizeCanvas);

  // Pause the animation when the tab is hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAnimation();
    } else {
      startAnimation();
    }
  });

  // Start
  resizeCanvas();
}
