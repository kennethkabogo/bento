/**
 * CARD.IO - Main JavaScript
 * Interactive effects and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initNavScroll();
    initCardTilt();
    initIntersectionAnimations();

    console.log('💳 Card.io initialized!');
});

// Smooth scroll for anchor links
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

// Nav background on scroll
function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            nav.style.background = 'rgba(10, 10, 15, 0.8)';
        }
    });
}

// Card 3D tilt effect
function initCardTilt() {
    const card = document.querySelector('.card-preview');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.querySelector('.card-inner').style.transform =
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.querySelector('.card-inner').style.transform =
            'perspective(1000px) rotateX(0) rotateY(0)';
    });
}

// Intersection Observer for fade-in animations
function initIntersectionAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe feature cards and example cards
    document.querySelectorAll('.feature-card, .example-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

// Add animation class styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .feature-card:nth-child(1) { transition-delay: 0ms; }
    .feature-card:nth-child(2) { transition-delay: 100ms; }
    .feature-card:nth-child(3) { transition-delay: 200ms; }
    .feature-card:nth-child(4) { transition-delay: 300ms; }
    .feature-card:nth-child(5) { transition-delay: 400ms; }
    .feature-card:nth-child(6) { transition-delay: 500ms; }
    
    .example-card:nth-child(1) { transition-delay: 0ms; }
    .example-card:nth-child(2) { transition-delay: 100ms; }
    .example-card:nth-child(3) { transition-delay: 200ms; }
    .example-card:nth-child(4) { transition-delay: 300ms; }
`;
document.head.appendChild(style);

// Reduce motion for accessibility
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
}
