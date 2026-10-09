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
        msg.innerHTML = 'Votre logiciel de messagerie devrait s’ouvrir avec le message prérempli. ' +
          'Si rien ne s’ouvre, écrivez-nous directement à ' +
          '<a href="mailto:contact@fitnesssudessonne.fr">contact@fitnesssudessonne.fr</a> ' +
          'ou sur <a href="https://wa.me/33648918609" target="_blank" rel="noopener">WhatsApp</a>.';
      }
    });
  }

  // Mesure d'audience : Google Analytics ne se charge qu'après un accord explicite.
  // Le choix est conservé 6 mois, puis redemandé (recommandation CNIL).
  const GA_ID = 'G-25L0VD9JPE';
  const CONSENT_KEY = 'fse-consentement';
  const CONSENT_MAX_AGE = 1000 * 60 * 60 * 24 * 182;

  function readConsent() {
    try {
      const c = JSON.parse(localStorage.getItem(CONSENT_KEY));
      if (c && Date.now() - c.t < CONSENT_MAX_AGE) return c.v;
    } catch (e) { /* stockage indisponible : on redemandera */ }
    return null;
  }
  function saveConsent(v) {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ v: v, t: Date.now() })); } catch (e) {}
  }
  function loadAnalytics() {
    window['ga-disable-' + GA_ID] = false;
    if (window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    // Cookies limités à 13 mois, durée maximale admise par la CNIL
    window.gtag('config', GA_ID, { cookie_expires: 34128000 });
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }
  function stopAnalytics() {
    window['ga-disable-' + GA_ID] = true;
    const domain = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      const name = c.split('=')[0].trim();
      if (!/^_ga/.test(name)) return;
      ['', '; domain=' + location.hostname, '; domain=.' + domain].forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; path=/' + d;
      });
    });
  }

  function closeBanner() {
    const b = document.getElementById('cookieBanner');
    if (b) b.hidden = true;
    document.body.classList.remove('cookie-open');
  }
  function openBanner() {
    let b = document.getElementById('cookieBanner');
    if (!b) {
      b = document.createElement('div');
      b.id = 'cookieBanner';
      b.className = 'cookie-banner';
      b.setAttribute('role', 'region');
      b.setAttribute('aria-label', 'Cookies');
      b.innerHTML =
        '<p>Avec votre accord, nous utilisons Google Analytics pour mesurer la fréquentation du site. ' +
        '<a href="mentions-legales.html#cookies">En savoir plus</a></p>' +
        '<div class="cookie-actions">' +
        '<button type="button" class="cookie-btn" data-consent="denied">Refuser</button>' +
        '<button type="button" class="cookie-btn" data-consent="granted">Accepter</button>' +
        '</div>';
      b.addEventListener('click', function (e) {
        const v = e.target.getAttribute && e.target.getAttribute('data-consent');
        if (!v) return;
        saveConsent(v);
        closeBanner();
        if (v === 'granted') loadAnalytics(); else stopAnalytics();
      });
      document.body.appendChild(b);
    }
    b.hidden = false;
    document.body.classList.add('cookie-open');
  }

  const consent = readConsent();
  if (consent === 'granted') loadAnalytics();
  else if (consent === null) openBanner();

  document.querySelectorAll('[data-cookie-settings]').forEach(function (btn) {
    btn.addEventListener('click', openBanner);
  });
})();
