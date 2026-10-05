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
    #${CONTAINER_ID} {
      display: grid;
      grid-template-columns: repeat(auto-fill, 200px); /* column width = image width */
      gap: 24px;
      padding: 24px;
    }
    #${CONTAINER_ID} img {
      width: 200px;
      height: auto;
      display: block;
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
})();
