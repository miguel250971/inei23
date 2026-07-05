  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navList = document.getElementById('navList');
  menuToggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    menuToggle.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Animated stat counters, triggered when in view
  const statEls = document.querySelectorAll('.stat-num');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCount(el){
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (prefersReducedMotion){ el.textContent = target; return; }
    const duration = 1400;
    const start = performance.now();
    function step(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => statObserver.observe(el));

  // Admission form validation + fake submit
  const form = document.getElementById('admissionForm');
  const formMsg = document.getElementById('formMsg');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('parentName').value.trim();
    const age = document.getElementById('studentAge').value;
    const level = document.getElementById('level').value;
    const email = document.getElementById('email').value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !age || !level || !email){
      formMsg.textContent = 'Completa todos los campos antes de enviar.';
      formMsg.className = 'form-msg err';
      return;
    }
    if (!emailPattern.test(email)){
      formMsg.textContent = 'Ingresa un correo electrónico válido.';
      formMsg.className = 'form-msg err';
      return;
    }

    formMsg.textContent = `Gracias, ${name}. Recibimos tu solicitud para ${level} y te contactaremos a ${email}.`;
    formMsg.className = 'form-msg ok';
    form.reset();
  });