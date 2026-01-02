// Interactive Features for Bento Clone
// - Drag and Drop tile rearranging
// - LocalStorage persistence
// - Cursor glow effect

(function () {
    'use strict';

    // State management
    let editMode = false;
    let draggedElement = null;
    const STORAGE_KEY = 'bento-tile-order';

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        setupEditControls();
        setupCursorGlow();
        loadTileOrder();
    }

    // =====================
    // Edit Mode Controls
    // =====================

    function setupEditControls() {
        const grid = document.querySelector('.bento-grid');
        if (!grid) return;

        // Create edit controls container
        const controls = document.createElement('div');
        controls.className = 'edit-controls';
        controls.innerHTML = `
            <button class="edit-toggle" title="Toggle Edit Mode">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>Edit</span>
            </button>
            <button class="reset-layout" style="display: none;" title="Reset Layout">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                    <path d="M21 3v5h-5"></path>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                    <path d="M3 21v-5h5"></path>
                </svg>
                <span>Reset</span>
            </button>
        `;

        document.body.appendChild(controls);

        // Event listeners
        const toggleBtn = controls.querySelector('.edit-toggle');
        const resetBtn = controls.querySelector('.reset-layout');

        toggleBtn.addEventListener('click', toggleEditMode);
        resetBtn.addEventListener('click', resetLayout);
    }

    function toggleEditMode() {
        editMode = !editMode;
        const grid = document.querySelector('.bento-grid');
        const toggleBtn = document.querySelector('.edit-toggle');
        const resetBtn = document.querySelector('.reset-layout');
        const tiles = document.querySelectorAll('.bento-tile');

        if (editMode) {
            grid.classList.add('edit-mode');
            toggleBtn.classList.add('active');
            toggleBtn.querySelector('span').textContent = 'Done';
            resetBtn.style.display = 'flex';

            // Enable dragging
            tiles.forEach(tile => {
                tile.draggable = true;
                tile.addEventListener('dragstart', handleDragStart);
                tile.addEventListener('dragend', handleDragEnd);
                tile.addEventListener('dragover', handleDragOver);
                tile.addEventListener('drop', handleDrop);
            });
        } else {
            grid.classList.remove('edit-mode');
            toggleBtn.classList.remove('active');
            toggleBtn.querySelector('span').textContent = 'Edit';
            resetBtn.style.display = 'none';

            // Disable dragging
            tiles.forEach(tile => {
                tile.draggable = false;
                tile.removeEventListener('dragstart', handleDragStart);
                tile.removeEventListener('dragend', handleDragEnd);
                tile.removeEventListener('dragover', handleDragOver);
                tile.removeEventListener('drop', handleDrop);
            });
        }
    }

    // =====================
    // Drag and Drop
    // =====================

    function handleDragStart(e) {
        draggedElement = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');

        // Remove drag-over class from all tiles
        const tiles = document.querySelectorAll('.bento-tile');
        tiles.forEach(tile => tile.classList.remove('drag-over'));
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        e.dataTransfer.dropEffect = 'move';

        // Add visual feedback
        const tiles = document.querySelectorAll('.bento-tile');
        tiles.forEach(tile => tile.classList.remove('drag-over'));

        if (this !== draggedElement) {
            this.classList.add('drag-over');
        }

        return false;
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if (draggedElement !== this) {
            // Swap the elements
            const grid = document.querySelector('.bento-grid');
            const allTiles = Array.from(grid.children);
            const draggedIndex = allTiles.indexOf(draggedElement);
            const targetIndex = allTiles.indexOf(this);

            if (draggedIndex < targetIndex) {
                grid.insertBefore(draggedElement, this.nextSibling);
            } else {
                grid.insertBefore(draggedElement, this);
            }

            // Save new order
            saveTileOrder();
        }

        this.classList.remove('drag-over');
        return false;
    }

    // =====================
    // LocalStorage Persistence
    // =====================

    function saveTileOrder() {
        const grid = document.querySelector('.bento-grid');
        const tiles = Array.from(grid.children);
        const order = tiles.map((tile, index) => {
            // Create a unique identifier for each tile
            const text = tile.textContent.trim().substring(0, 50);
            const classes = tile.className;
            return { text, classes, index };
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    }

    function loadTileOrder() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;

        try {
            const order = JSON.parse(saved);
            const grid = document.querySelector('.bento-grid');
            const tiles = Array.from(grid.children);

            // Create a map of tiles by their identifier
            const tileMap = new Map();
            tiles.forEach(tile => {
                const text = tile.textContent.trim().substring(0, 50);
                tileMap.set(text, tile);
            });

            // Reorder tiles
            order.forEach(({ text }) => {
                const tile = tileMap.get(text);
                if (tile) {
                    grid.appendChild(tile);
                }
            });
        } catch (error) {
            console.error('Error loading tile order:', error);
        }
    }

    function resetLayout() {
        if (confirm('Reset to default layout? This will clear your custom arrangement.')) {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        }
    }

    // =====================
    // Cursor Glow Effect
    // =====================

    function setupCursorGlow() {
        // Only enable on desktop (non-touch devices)
        if ('ontouchstart' in window) return;

        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);

        let mouseX = 0;
        let mouseY = 0;
        let glowX = 0;
        let glowY = 0;
        let isVisible = false;

        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isVisible) {
                isVisible = true;
                glow.style.opacity = '1';
                glowX = mouseX;
                glowY = mouseY;
            }
        });

        // Smooth animation using requestAnimationFrame
        function animate() {
            if (isVisible) {
                // Lerp for smooth following
                glowX += (mouseX - glowX) * 0.15;
                glowY += (mouseY - glowY) * 0.15;

                // Use transform for GPU acceleration (no repaints)
                glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
            }

            requestAnimationFrame(animate);
        }

        animate();
    }
})();
