// === DÉTECTION DE LA SECTION ACTIVE ===

// Associe chaque section à une couleur de dot personnalisée
const sectionColors = {
  "#cr": "#00eade",
  "#infos": "#ffd166",
  "#projets": "#fa13a1",
  "#contact": "#e75c28",
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
    cr: "#00eade", // section 1
    infos: "#ffe128", // section 2
    projets: "#fa13a1", // section 3
    contact: "#e75c28", // section 4
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
          const activeLink = document.querySelector(
            `header nav a[href="#${id}"]`
          );
          if (activeLink) {
            activeLink.classList.add("active-link");
            activeLink.style.color = sectionColors[id] || "black";
          }
        }
      });
    },
    {
      root: document.querySelector("main"),
      threshold: 0.6,
    }
  );

  sections.forEach((section) => observer.observe(section));
});
