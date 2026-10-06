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

// Pestañas internas de las páginas de proyecto.
// Se puede enlazar directo a una pestaña con #id-del-panel (ej. #tab-movil).
document.addEventListener("DOMContentLoaded", () => {
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  if (!tabs.length) return;

  const select = (tab, updateHash = true) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (updateHash) history.replaceState(null, "", "#" + tab.getAttribute("aria-controls"));
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;
      const next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus();
      select(next);
    });
  });

  const fromHash = tabs.find((t) => "#" + t.getAttribute("aria-controls") === location.hash);
  select(fromHash || tabs[0], false);
});

// Lightbox para las galerías de proyectos: clic en una imagen la abre en grande.
// Se navega con las flechas del teclado o los botones, y se cierra con Esc.
document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".gallery img")) return;
  let images = [];

  const box = document.createElement("div");
  box.className = "lightbox";
  box.innerHTML = `
    <button class="lightbox__close" aria-label="Cerrar">&times;</button>
    <button class="lightbox__prev" aria-label="Anterior">&#8249;</button>
    <img alt="">
    <button class="lightbox__next" aria-label="Siguiente">&#8250;</button>`;
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

  // Las flechas recorren solo la galería de la imagen pulsada (no las de otras pestañas).
  document.querySelectorAll(".gallery img").forEach((img) =>
    img.addEventListener("click", () => {
      images = Array.from(img.closest(".gallery").querySelectorAll("img"));
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
