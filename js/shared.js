/* AutoCare Automotive Services — shared.js */
/* Shared across index.html, services.html, about.html, contact.html */

// ── Hamburger Menu ──
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navlinks');
  if (!hamburger || !navLinks) return;

  function closeNav() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    // Also close any open submenus
    document.querySelectorAll('.submenu').forEach(s => s.classList.remove('open'));
  }

  hamburger.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      closeNav();
    } else {
      hamburger.classList.add('active');
      navLinks.classList.add('open');
    }
  });

  // Submenu toggle on mobile (only matters on pages that have .submenu-toggle elements)
  document.querySelectorAll('.submenu-toggle').forEach(toggle => {
    toggle.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        const submenu = this.nextElementSibling;
        if (submenu) submenu.classList.toggle('open');
      }
      // On desktop, CSS :hover handles the submenu — no JS needed
    });
  });

  // Close the nav when clicking outside of it
  document.addEventListener('click', e => {
    if (!e.target.closest('.navbar')) {
      closeNav();
    }
  });

  // Close any open mobile submenus if the window is resized back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      document.querySelectorAll('.submenu').forEach(s => s.classList.remove('open'));
    }
  });
})();

// ── Slideshow (homepage only — silently does nothing on pages without slides) ──
(function () {
  const slides = document.getElementsByClassName('myslide');
  const dots   = document.getElementsByClassName('dot');
  if (!slides.length) return;

  let slideIndex = 0;
  let timer;

  function showSlide(n) {
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
      if (dots[i]) dots[i].classList.remove('active-dot');
    }
    slideIndex = (n + slides.length) % slides.length;
    slides[slideIndex].style.display = 'block';
    if (dots[slideIndex]) dots[slideIndex].classList.add('active-dot');
  }

  function nextSlide() { showSlide(slideIndex + 1); }

  function startAuto() { timer = setInterval(nextSlide, 4000); }
  function resetAuto() { clearInterval(timer); startAuto(); }

  // Used by the onclick="currentSlide(n)" attributes on the dots in index.html
  window.currentSlide = n => { showSlide(n - 1); resetAuto(); };

  showSlide(0);
  startAuto();
})();

// ── Contact form validation (contact.html only) ──
(function () {
  const form = document.querySelector('.container form');
  if (!form) return;

  const fields = [
    { el: document.getElementById('fname'),   label: 'First name' },
    { el: document.getElementById('lname'),   label: 'Last name' },
    { el: document.getElementById('email'),   label: 'Email' },
    { el: document.getElementById('message'), label: 'Message' }
  ];

  // Create one error message <span> under each field, reused on every submit
  fields.forEach(f => {
    if (!f.el) return;
    const errorSpan = document.createElement('span');
    errorSpan.className = 'field-error';
    errorSpan.style.display = 'none';
    f.el.insertAdjacentElement('afterend', errorSpan);
    f.errorEl = errorSpan;
  });

  function showError(field, message) {
    field.el.style.borderColor = '#D85A30';
    field.errorEl.textContent = message;
    field.errorEl.style.display = 'block';
  }

  function clearError(field) {
    field.el.style.borderColor = '';
    field.errorEl.style.display = 'none';
  }

  form.addEventListener('submit', function (e) {
    let isValid = true;

    fields.forEach(field => {
      if (!field.el) return;

      if (!field.el.value.trim()) {
        showError(field, 'Please fill out this field.');
        isValid = false;
        return;
      }

      // Email gets an extra check on top of the empty check
      if (field.el === document.getElementById('email')) {
        const value = field.el.value.trim().toLowerCase();
        if (!value.endsWith('@gmail.com')) {
          showError(field, 'Please enter a valid @gmail.com email address.');
          isValid = false;
          return;
        }
      }

      clearError(field);
    });

    if (!isValid) {
      e.preventDefault();
    }
  });

  // Clear the error for a field as soon as the user starts fixing it
  fields.forEach(field => {
    if (!field.el) return;
    field.el.addEventListener('input', () => clearError(field));
  });
})();
