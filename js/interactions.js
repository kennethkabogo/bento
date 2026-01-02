/**
 * BENTO INTERACTIONS
 * Interactive features and cursor effects
 */

// ============ CURSOR GLOW EFFECT ============
function initCursorGlow() {
  const container = document.getElementById('page-container');

  if (!container) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    container.style.setProperty('--mouse-x', `${x}%`);
    container.style.setProperty('--mouse-y', `${y}%`);
  });
}

// ============ SMOOTH SCROLL ============
function initSmoothScroll() {
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
}

// ============ TILE ANIMATIONS ============
function initTileAnimations() {
  const tiles = document.querySelectorAll('.tile');

  // Intersection Observer for fade-in animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 50);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  tiles.forEach((tile) => {
    tile.style.opacity = '0';
    tile.style.transform = 'translateY(20px)';
    tile.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(tile);
  });
}

// ============ PREVENT DEFAULT ON BUTTON CLICKS ============
function initButtonBehavior() {
  document.querySelectorAll('.follow-button, .btn').forEach(button => {
    button.addEventListener('click', (e) => {
      // Prevent navigation for demo purposes
      if (button.closest('a')) {
        e.stopPropagation();
      }

      // Add click animation
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = '';
      }, 150);
    });
  });
}

// ============ TOOLTIP FOR TILES ============
function initTooltips() {
  const tiles = document.querySelectorAll('.tile[data-tooltip]');

  tiles.forEach(tile => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tile.dataset.tooltip;
    tooltip.style.cssText = `
      position: absolute;
      bottom: calc(100% + 10px);
      left: 50%;
      transform: translateX(-50%);
      background: var(--color-text-primary);
      color: var(--color-text-inverse);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--transition-base);
      z-index: var(--z-tooltip);
    `;

    tile.style.position = 'relative';
    tile.appendChild(tooltip);

    tile.addEventListener('mouseenter', () => {
      tooltip.style.opacity = '1';
    });

    tile.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
  });
}

// ============ LAZY LOAD MEDIA ============
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  const iframes = document.querySelectorAll('iframe[data-src]');

  const lazyLoad = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        element.src = element.dataset.src;
        element.removeAttribute('data-src');
        observer.unobserve(element);
      }
    });
  };

  const observer = new IntersectionObserver(lazyLoad, {
    rootMargin: '50px'
  });

  images.forEach(img => observer.observe(img));
  iframes.forEach(iframe => observer.observe(iframe));
}

// ============ STATS COUNTER ANIMATION ============
function initStatsAnimation() {
  const stats = document.querySelectorAll('.social-stat-value');

  stats.forEach(stat => {
    const targetText = stat.textContent;
    const hasDecimal = targetText.includes('.');
    const hasSuffix = /[KMB]/.test(targetText);
    const suffix = hasSuffix ? targetText.match(/[KMB]/)[0] : '';
    const numericValue = parseFloat(targetText.replace(/[KMB]/g, ''));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateValue(stat, 0, numericValue, 1000, suffix, hasDecimal);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(stat);
  });
}

function animateValue(element, start, end, duration, suffix = '', hasDecimal = false) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (easeOutQuart)
    const easeProgress = 1 - Math.pow(1 - progress, 4);
    const current = start + (end - start) * easeProgress;

    const displayValue = hasDecimal ? current.toFixed(1) : Math.floor(current);
    element.textContent = `${displayValue}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ============ KEYBOARD NAVIGATION ============
function initKeyboardNav() {
  const tiles = Array.from(document.querySelectorAll('.bento-grid .tile, .bento-tile'));

  // Only enable keyboard nav if there are tiles
  if (tiles.length === 0) return;

  let currentIndex = -1;
  let keyboardNavActive = false;

  document.addEventListener('keydown', (e) => {
    // Only intercept arrow keys if keyboard nav is active (user pressed Tab first)
    if (!keyboardNavActive) {
      // Allow Tab to activate keyboard nav
      if (e.key === 'Tab' && tiles.length > 0) {
        keyboardNavActive = true;
        currentIndex = 0;
        tiles[currentIndex].style.outline = '3px solid var(--color-accent-primary)';
        tiles[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        e.preventDefault();
      }
      return;
    }

    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape'].includes(e.key)) {
      return;
    }

    e.preventDefault();

    // Escape exits keyboard nav mode
    if (e.key === 'Escape') {
      tiles[currentIndex].style.outline = '';
      keyboardNavActive = false;
      currentIndex = -1;
      return;
    }

    tiles[currentIndex].style.outline = '';

    switch (e.key) {
      case 'ArrowRight':
        currentIndex = (currentIndex + 1) % tiles.length;
        break;
      case 'ArrowLeft':
        currentIndex = (currentIndex - 1 + tiles.length) % tiles.length;
        break;
      case 'ArrowDown':
        currentIndex = Math.min(currentIndex + 3, tiles.length - 1);
        break;
      case 'ArrowUp':
        currentIndex = Math.max(currentIndex - 3, 0);
        break;
      case 'Enter':
        tiles[currentIndex].click();
        return;
    }

    tiles[currentIndex].style.outline = '3px solid var(--color-accent-primary)';
    tiles[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

// ============ INITIALIZE ALL ============
document.addEventListener('DOMContentLoaded', () => {
  initCursorGlow();
  initSmoothScroll();
  initTileAnimations();
  initButtonBehavior();
  initTooltips();
  initLazyLoading();
  initStatsAnimation();
  initKeyboardNav();

  console.log('🎨 Bento initialized!');
});

// ============ PERFORMANCE OPTIMIZATION ============
// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--transition-fast', '0ms');
  document.documentElement.style.setProperty('--transition-base', '0ms');
  document.documentElement.style.setProperty('--transition-slow', '0ms');
}
