const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) menuToggle.textContent = "☰";
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

// На широкому екрані кнопки змінюють видимі картки, на телефоні перемикають одну картку.
const track = document.querySelector(".work-track");
const prev = document.querySelector(".carousel-arrow.prev");
const next = document.querySelector(".carousel-arrow.next");
let workIndex = 0;
function updateWorkCarousel() {
  const cards = [...document.querySelectorAll(".work-card")];
  if (!cards.length) return;
  const mobile = window.matchMedia("(max-width: 680px)").matches;
  if (mobile) {
    cards.forEach((card, index) => card.style.display = index === workIndex ? "block" : "none");
  } else {
    cards.forEach(card => card.style.display = "block");
    track.style.transform = "translateX(0)";
  }
}
prev?.addEventListener("click", () => {
  const count = document.querySelectorAll(".work-card").length;
  workIndex = (workIndex - 1 + count) % count;
  updateWorkCarousel();
});
next?.addEventListener("click", () => {
  const count = document.querySelectorAll(".work-card").length;
  workIndex = (workIndex + 1) % count;
  updateWorkCarousel();
});
window.addEventListener("resize", updateWorkCarousel);
updateWorkCarousel();

document.getElementById("contactForm")?.addEventListener("submit", event => {
  event.preventDefault();
  const note = document.getElementById("formNote");
  note.textContent = "Дякую! Форма працює в демонстраційному режимі. Щоб повідомлення реально надсилалися, потрібно підключити поштовий сервіс або сервер.";
  note.style.color = "#8fda65";
});
