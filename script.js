// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Button click handlers (placeholder for future integration)
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple effect styles dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Carrossel de Depoimentos =====
(function () {
  const carousel = document.querySelector('.testimonials .carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');
  const dotsNav = carousel.querySelector('.carousel-dots');
  const dots = Array.from(dotsNav.children);

  let index = 0;
  let autoplayId = null;
  const AUTO_DELAY = 5000; // ms

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, i) => {
      slide.setAttribute('aria-label', `${i + 1} de ${slides.length}`);
    });
    dots.forEach((dot, i) => {
      const selected = i === index;
      dot.setAttribute('aria-selected', selected ? 'true' : 'false');
      dot.tabIndex = selected ? 0 : -1;
    });
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    update();
    restartAutoplay();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  // Controles
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Teclado (acessibilidade)
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // Swipe (mobile)
  let startX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoplay();
  });
  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - startX;
    // pequena resistência visual opcional (não alteramos o transform final aqui)
  });
  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const delta = endX - startX;
    if (Math.abs(delta) > 50) {
      delta < 0 ? next() : prev();
    } else {
      update(); // volta para a posição
    }
    isDragging = false;
    restartAutoplay();
  });

  // Autoplay
  function startAutoplay() {
    stopAutoplay();
    autoplayId = setInterval(next, AUTO_DELAY);
  }
  function stopAutoplay() {
    if (autoplayId) clearInterval(autoplayId);
    autoplayId = null;
  }
  function restartAutoplay() {
    startAutoplay();
  }

  // Pausa autoplay ao focar em controles (UX melhor p/ teclado)
  [prevBtn, nextBtn, ...dots].forEach(el => {
    el.addEventListener('focus', stopAutoplay);
    el.addEventListener('blur', restartAutoplay);
  });

  // Inicializa
  update();
  startAutoplay();
})();


(function () {
  const section = document.querySelector('#como-funciona.how-it-works');
  if (!section) return;

  const sourceCards = [...section.querySelectorAll('.actions-grid .action-card')];
  const dynamic = section.querySelector('.hiw-dynamic');
  const prevBtn = section.querySelector('.hiw-prev');
  const nextBtn = section.querySelector('.hiw-next');

  // Transforma os cards em um modelo simples
  const steps = sourceCards.map(card => {
    const title = card.querySelector('.action-title')?.textContent?.trim() || '';
    const details = [...card.querySelectorAll('.action-detail')].map(d => d.textContent.trim());
    return { title, details };
  });

  let index = 0;

  function render(i) {
    const step = steps[i];
    if (!step) return;
    // Monta o HTML do conteúdo dinâmico
    const listItems = step.details.map(t => `<li>${t}</li>`).join('');
    dynamic.innerHTML = `
      <h3>${step.title}</h3>
      <ul>${listItems}</ul>
    `;
  }

  // Controles
  prevBtn?.addEventListener('click', () => {
    index = (index - 1 + steps.length) % steps.length;
    render(index);
  });
  nextBtn?.addEventListener('click', () => {
    index = (index + 1) % steps.length;
    render(index);
  });

  // Teclado (acessibilidade)
  section.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') nextBtn?.click();
    if (e.key === 'ArrowLeft') prevBtn?.click();
  });

  // Primeira renderização
  render(index);
})();

