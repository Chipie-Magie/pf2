// CANVAS AVION

// === AVION ANIMÉ ===

// On crée un canvas séparé au-dessus du fond étoilé
const planeCanvas = document.createElement("canvas");
planeCanvas.id = "planeCanvas";
planeCanvas.style.position = "fixed";
planeCanvas.style.top = 0;
planeCanvas.style.left = 0;
planeCanvas.style.pointerEvents = "none"; // ne bloque pas les clics
planeCanvas.width = window.innerWidth;
planeCanvas.height = window.innerHeight;
document.body.appendChild(planeCanvas);

const ctxPlane = planeCanvas.getContext("2d");

// Image de l’avion
const planeImg = new Image();
planeImg.src = "im/plane.png"; // ton image transparente

// Points clés du trajet
const points = [
  { x: 0, y: 0 }, // coin supérieur gauche
  { x: window.innerWidth * 0.66, y: window.innerHeight * 0.2 }, // 1/3 du bord droit en haut
  { x: window.innerWidth * 0.1, y: window.innerHeight * 0.5 }, // milieu gauche
  {
    x: window.innerWidth / 2,
    y: document.querySelector(".gooey-btn").getBoundingClientRect().bottom + 80, // sous le bouton
  },
];

let progress = 0;
const speed = 0.002; // vitesse de progression
let trail = []; // pour le filet lumineux

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getBezierPoint(p0, p1, p2, p3, t) {
  const cx = 3 * (p1.x - p0.x);
  const bx = 3 * (p2.x - p1.x) - cx;
  const ax = p3.x - p0.x - cx - bx;

  const cy = 3 * (p1.y - p0.y);
  const by = 3 * (p2.y - p1.y) - cy;
  const ay = p3.y - p0.y - cy - by;

  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x: ax * t3 + bx * t2 + cx * t + p0.x,
    y: ay * t3 + by * t2 + cy * t + p0.y,
  };
}

function animatePlane() {
  ctxPlane.clearRect(0, 0, planeCanvas.width, planeCanvas.height); // pas d’effet de traînée

  if (progress < 1) {
    progress += speed;

    // Position sur une courbe lissée
    const p = getBezierPoint(
      points[0],
      points[1],
      points[2],
      points[3],
      progress
    );
    trail.push(p);

    // Garde une longueur limitée pour le filet
    if (trail.length > 50) trail.shift();

    // --- Filet lumineux ---
    ctxPlane.beginPath();
    for (let i = 0; i < trail.length - 1; i++) {
      const tAlpha = i / trail.length;
      ctxPlane.strokeStyle = `rgba(0, 234, 222, ${tAlpha})`; // turquoise lumineux
      ctxPlane.lineWidth = 2;
      ctxPlane.shadowBlur = 10;
      ctxPlane.shadowColor = "rgba(0, 234, 222, 1)";
      ctxPlane.moveTo(trail[i].x, trail[i].y);
      ctxPlane.lineTo(trail[i + 1].x, trail[i + 1].y);
      ctxPlane.stroke();
    }

    // --- Calcul direction ---
    if (trail.length > 2) {
      const prev = trail[trail.length - 2];
      const angle = Math.atan2(p.y - prev.y, p.x - prev.x);

      // --- Avion ---
      if (planeImg.complete) {
        ctxPlane.save();
        ctxPlane.translate(p.x, p.y);
        ctxPlane.rotate(angle);
        const scale = 0.1; // taille de l'avion
        const w = planeImg.width * scale;
        const h = planeImg.height * scale;
        ctxPlane.drawImage(planeImg, -w / 2, -h / 2, w, h);
        ctxPlane.restore();
      }
    }

    requestAnimationFrame(animatePlane);
  } else {
    // --- Arrivé : avion fixe sous le bouton ---
    const last = points[3];
    ctxPlane.save();
    ctxPlane.translate(last.x, last.y);
    const scale = 0.15;
    const w = planeImg.width * scale;
    const h = planeImg.height * scale;
    ctxPlane.drawImage(planeImg, -w / 2, -h / 2, w, h);
    ctxPlane.restore();
  }
}

// Lancer l'animation une fois l'image chargée
planeImg.onload = () => animatePlane();
