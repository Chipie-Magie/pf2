// CANVAS FOND ÉTOILÉ
const canvas = document.getElementById("universe");
const ctx = canvas.getContext("2d");

let w = window.innerWidth;
let h = window.innerHeight;
canvas.width = w;
canvas.height = h;

let stars = [];
const numStars = 400;

function initStars() {
  stars = Array.from({ length: numStars }, () => {
    const z = Math.random() * w;
    const radius = Math.random() * 1 + 0.5;
    const vz = 0.1 + Math.random() * 0.3;

    const px = Math.random() * w;
    const py = Math.random() * h;

    return {
      x: px,
      y: py,
      z,
      radius,
      vz,
      color: `rgba(${180 + Math.random() * 75},${
        180 + Math.random() * 75
      },255,0.9)`,
    };
  });
}

// Initialisation des étoiles
initStars();

// Mouvement de la souris pour perspective
let mouseX = 0,
  mouseY = 0;
document.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX - w / 2) / w;
  mouseY = (e.clientY - h / 2) / h;
});

// Fonction pour redimensionner le canvas correctement
function resizeCanvas() {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;

  // On recalcule les étoiles pour qu'elles restent visibles
  for (let star of stars) {
    star.x = Math.random() * w;
    star.y = Math.random() * h;
    star.z = Math.random() * w;
  }
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", () => {
  // On attend un petit délai pour que window.innerWidth/innerHeight se stabilisent
  setTimeout(resizeCanvas, 200);
});

function animate() {
  ctx.fillStyle = "#04177d";
  ctx.fillRect(0, 0, w, h);

  for (let star of stars) {
    star.z -= star.vz;
    if (star.z <= 0) {
      star.z = w;
      star.x = Math.random() * w;
      star.y = Math.random() * h;
      star.radius = Math.random() * 1.5 + 0.5;
      star.vz = 0.1 + Math.random() * 0.3;
    }

    const k = 128.0 / star.z;
    const px = (star.x - w / 2) * k + w / 2 + mouseX * 200;
    const py = (star.y - h / 2) * k + h / 2 + mouseY * 200;

    if (px >= 0 && px <= w && py >= 0 && py <= h) {
      const size = star.radius * (1 - star.z / w);
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.fill();
    }
  }

  requestAnimationFrame(animate);
}

animate();
