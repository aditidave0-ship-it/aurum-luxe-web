const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});

nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
}));

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !nav?.classList.contains('open')) return;
  menuButton?.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuButton?.focus();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900 && nav?.classList.contains('open')) {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
  }
}, { passive: true });

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

const footprintPins = document.querySelectorAll('.city-pin[data-city]');
const cityPanels = document.querySelectorAll('[data-city-panel]');
const footprintMap = document.querySelector('.map-stage');

function activateFootprintCity(city) {
  footprintMap?.setAttribute('data-active-city', city);

  footprintPins.forEach(pin => {
    const selected = pin.dataset.city === city;
    pin.classList.toggle('is-active', selected);
    pin.setAttribute('aria-pressed', String(selected));
  });

  cityPanels.forEach(panel => {
    panel.classList.toggle('is-visible', panel.dataset.cityPanel === city);
  });
}

footprintPins.forEach(pin => {
  ['click', 'pointerenter', 'focus'].forEach(eventName => {
    pin.addEventListener(eventName, () => activateFootprintCity(pin.dataset.city));
  });
});

document.querySelector('.footprint-experience')?.addEventListener('pointerleave', event => {
  if (event.pointerType !== 'mouse') return;
  activateFootprintCity('mumbai');
});

const instagramUrl = 'https://www.instagram.com/aurumluxeinteriorsofficial?stkn=MXJrZWQ2Zzh4ZXB0bA%3D%3D&utm_source=qr';
const instagramQr = document.querySelector('#instagram-qr');

if (instagramQr && typeof QRCode !== 'undefined') {
  new QRCode(instagramQr, {
    text: instagramUrl,
    width: 148,
    height: 148,
    colorDark: '#171310',
    colorLight: '#f3eee4',
    correctLevel: QRCode.CorrectLevel.H,
  });
}
