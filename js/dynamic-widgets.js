/* ===================================
   BENTO DYNAMIC WIDGETS
   Time, Tech Stack, and Theme Logic
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTimeWidget();
    initTechStack();
    initThemeManager();
    initTileSpotlight();
});

/**
 * Updates the 'Now' tile with current local time and status
 */
function initTimeWidget() {
    const timeEl = document.getElementById('current-time');
    const dateEl = document.getElementById('current-date');
    if (!timeEl) return;

    function updateTime() {
        const now = new Date();
        timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (dateEl) {
            dateEl.textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
        }
    }

    updateTime();
    setInterval(updateTime, 60000);
}

/**
 * Handles the tech stack display (scroll or random highlight)
 */
function initTechStack() {
    const stackItems = document.querySelectorAll('.stack-item');
    if (stackItems.length === 0) return;

    // Optional: Add a subtle pulse animation to a random item setiap 3 detik
    setInterval(() => {
        const randomItem = stackItems[Math.floor(Math.random() * stackItems.length)];
        randomItem.classList.add('pulse');
        setTimeout(() => randomItem.classList.remove('pulse'), 2000);
    }, 5000);
}

/**
 * Theme management and persistence
 */
function initThemeManager() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const savedTheme = localStorage.getItem('bento-theme') || 'default';

    applyTheme(savedTheme);

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            applyTheme(theme);
            localStorage.setItem('bento-theme', theme);
        });
    });
}

function applyTheme(theme) {
    document.body.className = theme === 'default' ? '' : `theme-${theme}`;

    // Update active state in UI
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
}

/**
 * Spotlight effect that follows mouse within tiles
 */
function initTileSpotlight() {
    const tiles = document.querySelectorAll('.tile-spotlight');

    tiles.forEach(tile => {
        tile.addEventListener('mousemove', (e) => {
            const rect = tile.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            tile.style.setProperty('--mouse-x', `${x}px`);
            tile.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}
