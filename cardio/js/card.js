/**
 * CARD.IO - Digital Card Page JavaScript
 * Save contact, share, and QR code functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    initQRToggle();
    initSaveContact();
    initShare();
    initParticles();

    console.log('💳 Card loaded!');
});

// QR Code Toggle
function initQRToggle() {
    const toggle = document.getElementById('qr-toggle');
    const container = document.getElementById('qr-container');

    if (!toggle || !container) return;

    toggle.addEventListener('click', () => {
        container.classList.toggle('active');
        toggle.innerHTML = container.classList.contains('active')
            ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
               </svg> Hide QR Code`
            : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
               </svg> Show QR Code`;
    });
}

// Save Contact (vCard download)
function initSaveContact() {
    const btn = document.getElementById('save-contact');
    if (!btn) return;

    btn.addEventListener('click', () => {
        // Generate vCard data
        const vCard = `BEGIN:VCARD
VERSION:3.0
N:Chen;Marcus;;;
FN:Marcus Chen
TITLE:Senior Product Designer
ORG:Stripe
EMAIL:marcus@example.com
URL:https://marcuschen.design
X-SOCIALPROFILE;TYPE=twitter:https://twitter.com/marcuschen
X-SOCIALPROFILE;TYPE=linkedin:https://linkedin.com/in/marcus-chen
NOTE:Crafting delightful digital experiences at Stripe.
END:VCARD`;

        // Create and download file
        const blob = new Blob([vCard], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'marcus-chen.vcf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast('Contact saved! 📱');
    });
}

// Share functionality
function initShare() {
    const btn = document.getElementById('share-card');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        const shareData = {
            title: 'Marcus Chen - Product Designer',
            text: 'Check out my digital business card!',
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    fallbackShare();
                }
            }
        } else {
            fallbackShare();
        }
    });
}

function fallbackShare() {
    // Copy URL to clipboard
    navigator.clipboard.writeText(window.location.href)
        .then(() => showToast('Link copied to clipboard! 🔗'))
        .catch(() => showToast('Could not copy link'));
}

// Toast notification
function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Subtle particle background
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    // Create a few floating particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(99, 102, 241, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float-particle ${Math.random() * 10 + 10}s ease-in-out infinite;
            animation-delay: ${Math.random() * -10}s;
        `;
        container.appendChild(particle);
    }

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle {
            0%, 100% { 
                transform: translate(0, 0) scale(1);
                opacity: 0.5;
            }
            25% { 
                transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) scale(1.2);
                opacity: 0.8;
            }
            50% { 
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0.8);
                opacity: 0.3;
            }
            75% { 
                transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) scale(1.1);
                opacity: 0.6;
            }
        }
    `;
    document.head.appendChild(style);
}

// Reduce motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}
