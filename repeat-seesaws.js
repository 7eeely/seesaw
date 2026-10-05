// scroll-images.js
// Repeats ONE image forever: a new copy is added each time the user scrolls near the bottom.

(() => {
  // ---------- CONFIG ----------
  const IMAGE_PATH = "images/seesaw.png";  // path to your image
  const TRIGGER_DISTANCE = 300;            // px from the bottom that triggers the next copy
  const CONTAINER_ID = "image-container";  // optional: an element with this id in your HTML
  // ----------------------------

  let container = document.getElementById(CONTAINER_ID);
  if (!container) {
    container = document.createElement("div");
    container.id = CONTAINER_ID;
    document.body.appendChild(container);
  }

  const style = document.createElement("style");
  style.textContent = `
    #${CONTAINER_ID} { display: flex; flex-direction: column; align-items: flex-start; gap: 24px; padding: 24px 0; }
    #${CONTAINER_ID} img {
      width: 200px;
      max-width: 90%;
      height: auto;
    }
  `;
  document.head.appendChild(style);

  let broken = false;

  function nearBottom() {
    return (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - TRIGGER_DISTANCE
    );
  }

  function addImage() {
    const img = new Image();
    img.alt = "seesaw";
    img.src = IMAGE_PATH;

    img.onload = () => {
      container.appendChild(img);
      checkScroll(); // keep adding if the page is still short
    };

    img.onerror = () => {
      console.warn("Could not load image:", img.src);
      broken = true; // stop so it doesn't retry forever
    };
  }

  let pending = false;
  function checkScroll() {
    if (pending || broken) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      if (nearBottom()) addImage();
    });
  }

  window.addEventListener("scroll", checkScroll, { passive: true });
  window.addEventListener("resize", checkScroll);
  checkScroll();
})();// scroll-images.js
// Repeats ONE image forever: a new copy is added each time the user scrolls near the bottom.

(() => {
  // ---------- CONFIG ----------
  const IMAGE_PATH = "images/seesaw.png";  // <-- change to your image's real path
  const TRIGGER_DISTANCE = 300;            // px from the bottom that triggers the next copy
  const CONTAINER_ID = "image-container";  // optional: an element with this id in your HTML
  // ----------------------------

  let container = document.getElementById(CONTAINER_ID);
  if (!container) {
    container = document.createElement("div");
    container.id = CONTAINER_ID;
    document.body.appendChild(container);
  }

  const style = document.createElement("style");
  style.textContent = `
    #${CONTAINER_ID} { display: flex; flex-direction: column; align-items: start; gap: 24px; padding: 24px 0; }
    #${CONTAINER_ID} img {
      width: 200px; 
      max-width: 90%;
      height: auto;
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    #${CONTAINER_ID} img.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  let broken = false;

  function nearBottom() {
    return (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - TRIGGER_DISTANCE
    );
  }

  function addImage() {
    const img = new Image();
    img.alt = "seesaw";
    img.src = IMAGE_PATH;

    img.onload = () => {
      container.appendChild(img);
      requestAnimationFrame(() => img.classList.add("visible"));
      checkScroll(); // keep adding if the page is still short
    };

    img.onerror = () => {
      console.warn("Could not load image:", img.src);
      broken = true; // stop so it doesn't retry forever
    };
  }

  let pending = false;
  function checkScroll() {
    if (pending || broken) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      if (nearBottom()) addImage();
    });
  }

  window.addEventListener("scroll", checkScroll, { passive: true });
  window.addEventListener("resize", checkScroll);
  checkScroll();
})();// scroll-images.js
// Adds one image from the "images" folder each time the user scrolls near the bottom of the page.

(() => {
  // ---------- CONFIG ----------
  const IMAGE_FOLDER = "images/";          // folder that holds your images
  const IMAGES = [                         // browsers can't list a folder, so list the filenames here
    "seesaw.png"
  ];
  const LOOP = true;                      // true = start over from the first image after the last
  const TRIGGER_DISTANCE = 200;            // px from the bottom of the page that triggers the next image
  const CONTAINER_ID = "image-container";  // optional: an element with this id in your HTML
  // ----------------------------

  // Use the existing container, or create one at the end of <body>
  let container = document.getElementById(CONTAINER_ID);
  if (!container) {
    container = document.createElement("div");
    container.id = CONTAINER_ID;
    document.body.appendChild(container);
  }

  // Basic styles (fade-in effect) injected so no CSS file is needed
  const style = document.createElement("style");
  style.textContent = `
    #${CONTAINER_ID} { display: flex; flex-direction: column; align-items: left; gap: 24px; padding: 24px 0; }
    #${CONTAINER_ID} img {
      max-width: 90%;
      height: 250;
      opacity: 1;
    }
    #${CONTAINER_ID} img.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  let index = 0;
  let loading = false;
  let failures = 0;

  function nearBottom() {
    return (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - TRIGGER_DISTANCE
    );
  }

  function addNextImage() {
    if (loading) return;

    if (index >= IMAGES.length) {
      if (LOOP) {
        index = 0;
      } else {
        window.removeEventListener("scroll", onScroll);
        return;
      }
    }

    loading = true;
    const file = IMAGES[index++];
    const img = new Image();
    img.alt = file;
    img.src = IMAGE_FOLDER + file;

    img.onload = () => {
      failures = 0;
      container.appendChild(img);
      requestAnimationFrame(() => img.classList.add("visible"));
      loading = false;
      onScroll(); // if the page is still short, keep adding
    };

    img.onerror = () => {
      console.warn("Could not load image:", img.src);
      failures++;
      loading = false;
      if (failures < IMAGES.length) onScroll(); // skip to the next one
    };
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      if (nearBottom()) addNextImage();
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll(); // check once on load
})();
