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
const numStars = 100; // tu peux augmenter pour plus dense
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
        infos: "#ffd166", // section 2
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

// JS robuste pour le bouton "gooey"
const btn = document.querySelector(".gooey-btn");

// utilitaires pour lire coords selon le type d'événement
function getClientXY(e) {
    if (!e) return null;
    if (e.clientX !== undefined && e.clientY !== undefined) return { x: e.clientX, y: e.clientY };
    if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return null;
}

// mise à jour immédiate des variables CSS (--x, --y)
function setVars(xPercent, yPercent, withTransition = false) {
    if (withTransition) {
        // applique une transition uniquement pour le reset
        btn.style.transition = "--x 0.55s cubic-bezier(.2,.9,.2,1), --y 0.55s cubic-bezier(.2,.9,.2,1)";
    } else {
        // pas de transition pendant le suivi -> rendre instantané
        btn.style.transition = "none";
    }
    btn.style.setProperty("--x", xPercent);
    btn.style.setProperty("--y", yPercent);

    // si on a appliqué une transition pour le reset, l'enlever après la fin
    if (withTransition) {
        window.setTimeout(() => {
            // retire la transition inline pour que les prochains pointermove soient fluides
            btn.style.transition = "";
        }, 600);
    }
}

// calcul et application des coords (utilise getBoundingClientRect du bouton)
function updateFromEvent(e, withTransition = false) {
    const coords = getClientXY(e);
    if (!coords) return;
    const rect = btn.getBoundingClientRect();
    const xPercent = ((coords.x - rect.left) / rect.width) * 100;
    const yPercent = ((coords.y - rect.top) / rect.height) * 100;
    setVars(xPercent, yPercent, withTransition);
}

// recentre au centre doucement
function resetToCenter() {
    setVars(50, 50, true);
}

// --- Initialisation : force des valeurs par défaut (important pour certains mobiles) ---
setVars(50, 50, false);

// --- Écouteurs pointer (couvre mouse + touch + stylus) ---
btn.addEventListener("pointerdown", (e) => {
    // déclenche immédiatement même sans mouvement
    updateFromEvent(e, false);
    // capte les pointermove globaux pour suivre même si le doigt sort du bouton
    btn.setPointerCapture(e.pointerId);
});

btn.addEventListener("pointermove", (e) => {
    updateFromEvent(e, false);
});

btn.addEventListener("pointerup", (e) => {
    try { btn.releasePointerCapture(e.pointerId); } catch (err) { }
    resetToCenter();
});

btn.addEventListener("pointercancel", () => {
    resetToCenter();
});

btn.addEventListener("pointerleave", (e) => {
    // si mouse leave, recentre ; si touch leave, pointerup/pointercancel gèrera
    if (e.pointerType === "mouse") resetToCenter();
});

// --- Fallbacks pour les navigateurs très anciens sans pointer events ---
btn.addEventListener("touchstart", (e) => { updateFromEvent(e, false); }, { passive: true });
btn.addEventListener("touchmove", (e) => { updateFromEvent(e, false); }, { passive: true });
btn.addEventListener("touchend", () => { resetToCenter(); }, { passive: true });


