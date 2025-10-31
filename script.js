// =================

// CANVAS FOND ÉTOILÉ
const canvas = document.getElementById("universe");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Génération des étoiles
const numStars = 300; // tu peux augmenter pour plus dense
const stars = Array.from({ length: numStars }, () => {
    const z = Math.random() * w;
    const radius = Math.random() * 1 + 0.5;
    const vz = 0.1 + Math.random() * 0.3;

    // Calcul d'une position aléatoire projetée sur l'écran
    const k = 128 / z;
    const px = Math.random() * w;
    const py = Math.random() * h;
    const x = (px - w / 2) / k + w / 2;
    const y = (py - h / 2) / k + h / 2;

    return { x, y, z, radius, vz, color: `rgba(${180 + Math.random() * 75},${180 + Math.random() * 75},255,0.9)` };
});

// Mouvement de la souris pour perspective
let mouseX = 0, mouseY = 0;
document.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX - w / 2) / w;
    mouseY = (e.clientY - h / 2) / h;
});

function animate() {
    // Fond
    ctx.fillStyle = '#04177d';
    ctx.fillRect(0, 0, w, h);

    for (let star of stars) {
        // Déplacement selon la profondeur
        star.z -= star.vz;
        if (star.z <= 0) {
            star.z = w;                         // réinitialise en profondeur
            star.x = Math.random() * w;         // nouvelle position aléatoire
            star.y = Math.random() * h;
            star.radius = Math.random() * 1.5 + 0.5;
            star.vz = 0.1 + Math.random() * 0.3;
        }

        // Projection 3D
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

// =========================





