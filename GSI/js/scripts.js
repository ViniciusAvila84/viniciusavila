"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  mainNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  mainNav.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.getElementById("current-year").textContent = String(new Date().getFullYear());

const carousel = document.getElementById("hero-carousel");
const carouselSlides = Array.from(carousel.querySelectorAll(".carousel-slide"));
const carouselDots = Array.from(carousel.querySelectorAll(".carousel-dot"));
const carouselToggle = carousel.querySelector("[data-carousel-toggle]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeSlide = 0;
let carouselTimer;
let carouselPaused = reducedMotion.matches;
let userStartedCarousel = false;

function showSlide(index) {
  activeSlide = (index + carouselSlides.length) % carouselSlides.length;

  carouselSlides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeSlide;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  carouselDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeSlide;
    dot.classList.toggle("is-active", isActive);
    if (isActive) {
      dot.setAttribute("aria-current", "true");
    } else {
      dot.removeAttribute("aria-current");
    }
  });
}

function stopCarousel() {
  window.clearInterval(carouselTimer);
  carouselTimer = undefined;
}

function startCarousel() {
  stopCarousel();
  if (
    carouselPaused ||
    (reducedMotion.matches && !userStartedCarousel) ||
    document.hidden ||
    carousel.matches(":hover") ||
    carousel.contains(document.activeElement)
  ) return;

  carouselTimer = window.setInterval(() => showSlide(activeSlide + 1), 1000);
}

function updateCarouselToggle() {
  carouselToggle.setAttribute("aria-pressed", String(carouselPaused));
  carouselToggle.setAttribute("aria-label", carouselPaused ? "Iniciar apresentação" : "Pausar apresentação");
  carouselToggle.querySelector("span").textContent = carouselPaused ? "▶" : "Ⅱ";
}

carousel.querySelector("[data-carousel-prev]").addEventListener("click", () => {
  showSlide(activeSlide - 1);
  startCarousel();
});

carousel.querySelector("[data-carousel-next]").addEventListener("click", () => {
  showSlide(activeSlide + 1);
  startCarousel();
});

carouselDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
    startCarousel();
  });
});

carouselToggle.addEventListener("click", () => {
  carouselPaused = !carouselPaused;
  if (!carouselPaused) userStartedCarousel = true;
  updateCarouselToggle();
  startCarousel();
});

carousel.addEventListener("mouseenter", stopCarousel);
carousel.addEventListener("mouseleave", startCarousel);
carousel.addEventListener("focusin", stopCarousel);
carousel.addEventListener("focusout", (event) => {
  if (!carousel.contains(event.relatedTarget)) startCarousel();
});

document.addEventListener("visibilitychange", startCarousel);
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches && !userStartedCarousel) {
    carouselPaused = true;
    updateCarouselToggle();
  }
  startCarousel();
});

updateCarouselToggle();
startCarousel();

document.getElementById("contact-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const message = [
    "Olá! Gostaria de conversar com a GSI.",
    "",
    `Nome: ${data.get("name")}`,
    `Telefone: ${data.get("phone")}`,
    `Serviço de interesse: ${data.get("service")}`,
    `Mensagem: ${data.get("message")}`,
  ].join("\n");

  const whatsappUrl = new URL("https://api.whatsapp.com/send");
  whatsappUrl.searchParams.set("phone", "5551983114650");
  whatsappUrl.searchParams.set("text", message);
  window.open(whatsappUrl.toString(), "_blank", "noopener,noreferrer");
});
