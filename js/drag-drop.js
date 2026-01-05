/**
 * Bento Grid Drag and Drop Layout
 * Uses SortableJS for high-performance grid reordering
 */

document.addEventListener('DOMContentLoaded', () => {
    initDragDrop();
});

function initDragDrop() {
    const grid = document.querySelector('.bento-grid');
    const toggleBtn = document.getElementById('edit-layout-toggle');
    const resetBtn = document.getElementById('reset-layout-btn');

    if (!grid || !toggleBtn) return;

    let sortable = null;
    let isEditMode = false;

    // Load saved layout
    loadLayout(grid);

    toggleBtn.addEventListener('click', () => {
        isEditMode = !isEditMode;

        if (isEditMode) {
            grid.classList.add('edit-mode');
            toggleBtn.classList.add('active');
            toggleBtn.querySelector('span').textContent = 'Save Layout';
            resetBtn.style.display = 'flex';

            // Add visual cue for editable tiles
            grid.querySelectorAll('.tile').forEach(tile => {
                tile.style.outline = '2px dashed var(--color-accent-primary)';
                tile.style.outlineOffset = '2px';
                tile.style.cursor = 'grab';
                // Stop floating animation in edit mode for better UX
                tile.style.animation = 'none';
            });

            // Initialize Sortable
            sortable = new Sortable(grid, {
                animation: 150,
                ghostClass: 'dragging',
                chosenClass: 'drag-chosen',
                dragClass: 'drag-active',
                onEnd: () => {
                    saveLayout(grid);
                }
            });
        } else {
            grid.classList.remove('edit-mode');
            toggleBtn.classList.remove('active');
            toggleBtn.querySelector('span').textContent = 'Edit Layout';
            resetBtn.style.display = 'none';

            // Remove visual cues
            grid.querySelectorAll('.tile').forEach(tile => {
                tile.style.outline = '';
                tile.style.outlineOffset = '';
                tile.style.cursor = '';
                // Restore animations
                tile.style.animation = '';
            });

            if (sortable) {
                sortable.destroy();
                sortable = null;
            }
        }
    });

    resetBtn.addEventListener('click', () => {
        localStorage.removeItem('bento-layout');
        window.location.reload();
    });
}

function saveLayout(grid) {
    const items = grid.querySelectorAll('.tile');
    const itemIds = Array.from(items).map(item => item.dataset.id);
    localStorage.setItem('bento-layout', JSON.stringify(itemIds));
}

function loadLayout(grid) {
    const savedLayout = localStorage.getItem('bento-layout');
    if (!savedLayout) return;

    const itemIds = JSON.parse(savedLayout);
    const tiles = Array.from(grid.querySelectorAll('.tile'));

    // Reorder based on saved IDs
    itemIds.forEach(id => {
        const tile = tiles.find(t => t.dataset.id === id);
        if (tile) {
            grid.appendChild(tile);
        }
    });
}
