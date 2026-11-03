const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");
const projectCards = document.querySelectorAll(".project-card");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  mainNav.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  mainNav.classList.toggle("is-open", isOpen);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (event) => {
    closeMenu();
    if (reducedMotion || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    document.body.classList.add("is-leaving");
    window.setTimeout(() => {
      window.location.assign(link.href);
    }, 350);
  });
});

document.addEventListener("click", (event) => {
  if (mainNav.classList.contains("is-open") && !mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

if (reducedMotion || !("IntersectionObserver" in window)) {
  projectCards.forEach((card) => card.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  projectCards.forEach((card) => observer.observe(card));
}
