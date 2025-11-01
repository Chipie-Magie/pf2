// =================

// CANVAS FOND ÉTOILÉ
const canvas = document.getElementById("universe");
const ctx = canvas.getContext("2d");

let w = window.innerWidth;
let h = window.innerHeight;
canvas.width = w;
canvas.height = h;

let stars = [];
const numStars = 100;

function initStars() {
    stars = Array.from({ length: numStars }, () => {
        const z = Math.random() * w;
        const radius = Math.random() * 1 + 0.5;
        const vz = 0.1 + Math.random() * 0.3;

        const px = Math.random() * w;
        const py = Math.random() * h;

        return { x: px, y: py, z, radius, vz, color: `rgba(${180 + Math.random() * 75},${180 + Math.random() * 75},255,0.9)` };
    });
}

// Initialisation des étoiles
initStars();

// Mouvement de la souris pour perspective
let mouseX = 0, mouseY = 0;
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
    ctx.fillStyle = '#04177d';
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


// =========================

// === DÉTECTION DE LA SECTION ACTIVE ===

// Associe chaque section à une couleur de dot personnalisée
const sectionColors = {
    "#cr": "#fa13a1",
    "#infos": "#ffd166",
    "#projets": "#00eade",
    "#contact": "#e75c28"
};

// Sélection des sections et des dots
const sections = document.querySelectorAll("main section");
const dots = document.querySelectorAll(".dot");

// Création d’un observateur pour suivre les sections visibles
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Identifie la section actuellement visible
                const id = `#${entry.target.id}`;

                // Supprime la couleur active précédente
                dots.forEach((dot) => {
                    dot.classList.remove("active");
                    dot.style.backgroundColor = "transparent"; // on vide le fond
                });

                // Trouve le dot lié à la section visible
                const activeDot = document.querySelector(`.dot[data-target="${id}"]`);
                if (activeDot) {
                    activeDot.classList.add("active");
                    activeDot.style.backgroundColor = sectionColors[id] || "white"; // couleur personnalisée
                }
            }
        });
    },
    {
        threshold: 0.6, // section visible à 60% avant de changer le dot
    }
);

// Active l’observation sur chaque section
sections.forEach((section) => observer.observe(section));

// === PERMET DE CLIQUER SUR LES DOTS POUR ALLER À UNE SECTION ===
dots.forEach((dot) => {
    dot.addEventListener("click", () => {
        const targetId = dot.dataset.target;
        const section = document.querySelector(targetId);
        section.scrollIntoView({ behavior: "smooth", inline: "start" });
    });
});






// Modification des liens du Header

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("main section");
    const navLinks = document.querySelectorAll("header nav ul li a");

    const sectionColors = {
        cr: "#fa13a1",       // section 1
        infos: "#ffe128", // section 2
        projets: "#00eade", // section 3
        contact: "#e75c28"     // section 4
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");

                    // Supprime la classe active de tous les liens
                    navLinks.forEach((link) => {
                        link.classList.remove("active-link");
                        link.style.color = "rgba(100, 150, 255, 0.4)";
                    });

                    // Ajoute la classe active au lien correspondant
                    const activeLink = document.querySelector(`header nav a[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add("active-link");
                        activeLink.style.color = sectionColors[id] || "black";
                    }
                }
            });
        },
        {
            root: document.querySelector("main"),
            threshold: 0.6
        }
    );

    sections.forEach((section) => observer.observe(section));
});




// Bouton Gooey


// Sélection du bouton
const btn = document.querySelector(".gooey-btn");

// Initialisation des variables CSS pour amorcer l'animation
btn.style.setProperty("--x", 50);
btn.style.setProperty("--y", 50);

// Fonction qui met à jour les variables CSS --x et --y
function moveBg(e) {
    const rect = e.target.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;

    // Si c'est un événement tactile, on prend le premier point de contact
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }

    // Calcul des coordonnées relatives pour l'effet gooey
    const xPercent = ((clientX - rect.x) / rect.width) * 100;
    const yPercent = ((clientY - rect.y) / rect.height) * 100;

    e.target.style.setProperty("--x", xPercent);
    e.target.style.setProperty("--y", yPercent);
}

// Déplacement souris (desktop)
btn.addEventListener("pointermove", moveBg);

// Déplacement tactile (mobile)
btn.addEventListener("touchmove", moveBg, { passive: true });

// 🔹 Amorcer l'animation au premier contact n'importe où sur l'écran (mobile)
function initGooey(e) {
    const rect = btn.getBoundingClientRect();
    let clientX, clientY;

    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const xPercent = ((clientX - rect.x) / rect.width) * 100;
    const yPercent = ((clientY - rect.y) / rect.height) * 100;

    btn.style.setProperty("--x", xPercent);
    btn.style.setProperty("--y", yPercent);

    // On ne déclenche ça qu'une seule fois
    document.removeEventListener("touchstart", initGooey);
    document.removeEventListener("pointerdown", initGooey);
}

// Écoute le premier touch ou clic n'importe où pour amorcer l'animation
document.addEventListener("touchstart", initGooey, { passive: true });
document.addEventListener("pointerdown", initGooey);
