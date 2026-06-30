// Fitness Sud Essonne — interactions

(function () {
  'use strict';

  // Fond de navigation au défilement
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Menu mobile
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  // Formulaire de contact
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const msg = document.getElementById('formMsg');
      if (msg) {
        msg.style.display = 'block';
        msg.textContent = '✔ Message envoyé. Nous vous répondrons dans les 48 h.';
      }
      form.reset();
    });
  }
})();
