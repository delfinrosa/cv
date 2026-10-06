// Etiquetas de tecnología: al hacer clic se muestra su bloque de detalle debajo.
// Solo hay uno abierto a la vez; volver a pulsar la misma etiqueta lo cierra.
document.addEventListener("DOMContentLoaded", () => {
  const buttons = Array.from(document.querySelectorAll(".tag-btn"));

  buttons.forEach((btn) =>
    btn.addEventListener("click", () => {
      const opening = btn.getAttribute("aria-expanded") !== "true";
      buttons.forEach((b) => {
        const on = opening && b === btn;
        b.setAttribute("aria-expanded", on);
        document.getElementById(b.getAttribute("aria-controls")).hidden = !on;
      });
    })
  );
});

// Lightbox: clic en una imagen de un bloque de etiqueta la abre en grande.
// Se navega con las flechas del teclado o los botones, y se cierra con Esc.
// El cambio de imagen con flechas es instantáneo a propósito: es una acción repetida.
document.addEventListener("DOMContentLoaded", () => {
  const ZOOMABLE = ".tech-detail img";
  if (!document.querySelector(ZOOMABLE)) return;
  let images = [];

  // Íconos de Font Awesome
  const icon = (name) => `<i class="fa-solid ${name}" aria-hidden="true"></i>`;

  const box = document.createElement("div");
  box.className = "lightbox";
  box.innerHTML = `
    <button class="lightbox__close" aria-label="Cerrar">${icon("fa-xmark")}</button>
    <button class="lightbox__prev" aria-label="Anterior">${icon("fa-chevron-left")}</button>
    <img alt="">
    <button class="lightbox__next" aria-label="Siguiente">${icon("fa-chevron-right")}</button>`;
  document.body.appendChild(box);

  const big = box.querySelector("img");
  let current = 0;

  const show = (i) => {
    current = (i + images.length) % images.length;
    big.src = images[current].src;
    big.alt = images[current].alt;
  };
  const open = (i) => { show(i); box.classList.add("open"); };
  const close = () => box.classList.remove("open");

  // Las flechas recorren solo el grupo de la imagen pulsada (su galería o su bloque).
  document.querySelectorAll(ZOOMABLE).forEach((img) =>
    img.addEventListener("click", () => {
      images = Array.from(img.closest(".tech-detail").querySelectorAll("img"));
      open(images.indexOf(img));
    })
  );
  box.querySelector(".lightbox__close").addEventListener("click", close);
  box.querySelector(".lightbox__prev").addEventListener("click", () => show(current - 1));
  box.querySelector(".lightbox__next").addEventListener("click", () => show(current + 1));
  box.addEventListener("click", (e) => { if (e.target === box) close(); });

  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
});
