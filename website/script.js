document.addEventListener('DOMContentLoaded', () => {
    // Setup Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the element is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the active class to trigger the clean reveal animation
                entry.target.classList.add('active');
                // Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with the 'reveal-block' class
    const revealBlocks = document.querySelectorAll('.reveal-block');
    revealBlocks.forEach(block => {
        revealObserver.observe(block);
    });
});

    // --- Scent Builder Logic ---
    const noteItems = document.querySelectorAll('.note-item');
    const formulaDisplay = document.getElementById('formula-display');
    const saveFormulaBtn = document.getElementById('save-formula-btn');
    const customBuilderOption = document.getElementById('opt-custom-builder');
    const selectScentDropdown = document.querySelector('select[name="scent"]');
    
    // Store selected notes
    const selectedNotes = {
        exit: null,
        heart: null,
        base: null
    };

    function updateFormulaDisplay() {
        const parts = [];
        if (selectedNotes.exit) parts.push(selectedNotes.exit);
        if (selectedNotes.heart) parts.push(selectedNotes.heart);
        if (selectedNotes.base) parts.push(selectedNotes.base);

        if (parts.length === 0) {
            formulaDisplay.textContent = 'Select one note from each tier.';
            formulaDisplay.style.color = '#888';
            saveFormulaBtn.disabled = true;
        } else if (parts.length < 3) {
            formulaDisplay.textContent = parts.join(' + ') + '...';
            formulaDisplay.style.color = 'var(--text-color)';
            saveFormulaBtn.disabled = true;
        } else {
            formulaDisplay.textContent = parts.join(' + ');
            formulaDisplay.style.color = 'var(--accent-color)';
            saveFormulaBtn.disabled = false;
        }
    }

    noteItems.forEach(item => {
        item.addEventListener('click', () => {
            const tierContainer = item.closest('.note-options');
            const tierName = tierContainer.dataset.tier;
            const noteName = item.querySelector('span').textContent;

            // Remove selected class from all items in this tier
            tierContainer.querySelectorAll('.note-item').forEach(el => el.classList.remove('selected'));
            
            // Add selected class to clicked item
            item.classList.add('selected');

            // Update state
            selectedNotes[tierName] = noteName;
            
            updateFormulaDisplay();
        });
    });

    saveFormulaBtn.addEventListener('click', () => {
        // Update the dropdown in the buying section
        const customName = formulaDisplay.textContent;
        customBuilderOption.textContent = 'Custom: ' + customName;
        selectScentDropdown.value = 'custom-builder';
        
        // Scroll to buying section
        document.getElementById('buy-section').scrollIntoView({ behavior: 'smooth' });
    });

    // --- Expand Tier Logic ---
    const expandBtns = document.querySelectorAll('.expand-tier-btn');
    expandBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const wrapper = btn.closest('.note-options-wrapper');
            const hiddenNotes = wrapper.querySelectorAll('.note-item.hidden-note');
            
            if (btn.classList.contains('expanded')) {
                // Collapse
                const allNotes = wrapper.querySelectorAll('.note-item');
                // We keep the first 5 visible, plus the currently selected one if it's beyond the first 5
                allNotes.forEach((note, index) => {
                    if (index >= 5 && !note.classList.contains('selected')) {
                        note.classList.add('hidden-note');
                    }
                });
                btn.classList.remove('expanded');
            } else {
                // Expand
                hiddenNotes.forEach(note => {
                    note.classList.remove('hidden-note');
                });
                btn.classList.add('expanded');
            }
        });
    });
