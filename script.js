// Fitness Sud Essonne — interactions

(function () {
  'use strict';

  // Fond de navigation au défilement
  const nav = document.getElementById('mainNav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Menu mobile
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Apparition douce des sections au défilement
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const blocks = document.querySelectorAll('.section .inner');
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    blocks.forEach(function (b) { b.classList.add('reveal'); io.observe(b); });
  }

  // Formulaire de contact : compose un e-mail réel (site statique, sans serveur)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const val = id => (document.getElementById(id) || {}).value || '';
      const sujet = val('cS') || 'Contact depuis le site';
      const corps = 'Bonjour,\n\n' + val('cM') + '\n\n' +
                    val('cP') + ' ' + val('cN') + '\n' + val('cE');
      const lien = 'mailto:contact@fitnesssudessonne.fr' +
                   '?subject=' + encodeURIComponent('[Site] ' + sujet) +
                   '&body=' + encodeURIComponent(corps);
      window.location.href = lien;
      const msg = document.getElementById('formMsg');
      if (msg) {
        msg.style.display = 'block';
        msg.textContent = '✔ Votre messagerie s’ouvre avec le message prérempli. Vous pouvez aussi nous écrire directement sur WhatsApp.';
      }
    });
  }
})();
