function moveBg(e) {
  const rect = e.target.getBoundingClientRect();
  e.target.style.setProperty("--x", ((e.clientX - rect.x) / rect.width) * 100);
  e.target.style.setProperty("--y", ((e.clientY - rect.y) / rect.height) * 100);
}
document.querySelector("button").addEventListener("pointermove", moveBg);

// Ce dont je ne suis pas sure
// ⭐ Remet le bouton au centre (fix réel)
function resetGoo() {
  btn.style.setProperty("--x", "50");
  btn.style.setProperty("--y", "50");

  // 🔧 Force une reflow pour que le CSS prenne bien la valeur
  btn.offsetHeight;
}

// 🔒 Bloque le scroll pendant la déformation (mobile)
function blockScroll(e) {
  e.preventDefault();
  moveBg(e);
}

// Souris
btn.addEventListener("pointermove", moveBg);

// Mobile : empêcher le scroll pendant glissé
btn.addEventListener("touchmove", blockScroll, { passive: false });

// Mobile : retour au centre
btn.addEventListener("touchend", resetGoo);
btn.addEventListener("touchcancel", resetGoo);

/* const btn = document.querySelector("button");
const rect = btn.getBoundingClientRect();
let x, y;

// Déformation normale (souris + mobile)
function moveBg(e) {
  if (e.touches) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  } else {
    x = e.clientX;
    y = e.clientY;
  }

  btn.style.setProperty("--x", ((x - rect.left) / rect.width) * 100);
  btn.style.setProperty("--y", ((y - rect.top) / rect.height) * 100);
}

// ⭐ Remet le bouton au centre
function resetGoo() {
  btn.style.setProperty("--x", ((x - rect.left) / rect.width) * 100);
  btn.style.setProperty("--y", ((y - rect.top) / rect.height) * 100);
}

// 🔒 Bloque le scroll pendant la déformation (mobile)
function blockScroll(e) {
  e.preventDefault(); // indispensable !
  moveBg(e); // continue la déformation
}

// 🖱️ Souris : fonctionnement normal
btn.addEventListener("pointermove", moveBg);

// 📱 Mobile : empêcher le scroll pendant le glissé
btn.addEventListener("touchmove", blockScroll, { passive: false });

// 📱 Quand on lève le doigt → retour au centre
btn.addEventListener("touchend", resetGoo);
btn.addEventListener("touchcancel", resetGoo);
 */
