document.addEventListener('DOMContentLoaded', function () {
    console.log('Script chargé'); // Confirme que le script est chargé

    /**
     * ===========================
     * 1. Gestion des modales
     * ===========================
     */
    const openModalButton = document.querySelector('a[href="#contactModal"]');
    const openPhotoModalButton = document.getElementById('openPhotoModal');
    const modal = document.getElementById('contactModal');
    const closeModalButton = document.getElementById('closeModal');

    function openModal(event) {
        event.preventDefault();
        if (modal) {
            modal.style.display = 'block';
            const referenceValue = event.target?.dataset.reference || '';
            const formReferenceField = document.getElementById('reference');
            if (formReferenceField) formReferenceField.value = referenceValue;
        }
    }

    openModalButton?.addEventListener('click', openModal);
    openPhotoModalButton?.addEventListener('click', openModal);
    closeModalButton?.addEventListener('click', () => modal && (modal.style.display = 'none'));
    window.addEventListener('click', (event) => {
        if (event.target === modal) modal.style.display = 'none';
    });

    /**
     * ===========================
     * 2. Gestion des filtres AJAX
     * ===========================
     */
    const categoryFilter = document.getElementById('filter-category');
    const formatFilter = document.getElementById('filter-format');
    const orderFilter = document.getElementById('filter-order');
    const photosContainer = document.getElementById('photos');

    function populateFilters() {
        fetch(theme_ajax.ajax_url + "?action=get_filters_terms")
            .then((response) => response.json())
            .then((data) => {
                if (data.categories && categoryFilter) {
                    data.categories.forEach((category) => {
                        const option = document.createElement('option');
                        option.value = category.id;
                        option.textContent = category.name;
                        categoryFilter.appendChild(option);
                    });
                }

                if (data.formats && formatFilter) {
                    data.formats.forEach((format) => {
                        const option = document.createElement('option');
                        option.value = format.id;
                        option.textContent = format.name;
                        formatFilter.appendChild(option);
                    });
                }

                if (typeof jQuery !== 'undefined') {
                    jQuery('.filter-select').select2({ minimumResultsForSearch: -1 });
                }
            })
            .catch((error) => console.error('Erreur lors du chargement des filtres :', error));
    }

    function filterPhotos() {
        const category = categoryFilter?.value || '';
        const format = formatFilter?.value || '';
        const order = orderFilter?.value || 'DESC';

        const formData = new FormData();
        formData.append('action', 'filter_photos');
        formData.append('category', category);
        formData.append('format', format);
        formData.append('order', order);
        formData.append('page', 1);

        fetch(theme_ajax.ajax_url, { method: 'POST', body: formData })
            .then((response) => response.json())
            .then((data) => {
                if (data.success && data.data.html) {
                    photosContainer.innerHTML = data.data.html;
                    attachFullscreenEvents(); // Réattache les événements fullscreen
                } else {
                    photosContainer.innerHTML = '<p>Aucune photo trouvée.</p>';
                }
            })
            .catch((error) => console.error('Erreur lors du filtrage des photos :', error));
    }

    populateFilters();

    /**
     * ===========================
     * 3. Gestion des miniatures dynamiques
     * ===========================
     */
    const thumbnailDisplay = document.querySelector('.thumbnail-display');
    const arrows = document.querySelectorAll('.nav-icon-link');

    if (thumbnailDisplay) {
        arrows.forEach((arrow) => {
            arrow.addEventListener('mouseover', function () {
                const thumbnailUrl = this.getAttribute('data-thumbnail');
                console.log('URL de la miniature détectée :', thumbnailUrl);

                if (thumbnailUrl) {
                    thumbnailDisplay.innerHTML = `<img src="${thumbnailUrl}" alt="Miniature">`;
                    thumbnailDisplay.style.display = 'block';
                } else {
                    console.log('Aucune URL de miniature trouvée');
                }
            });

            arrow.addEventListener('mouseout', function () {
                thumbnailDisplay.style.display = 'none';
                thumbnailDisplay.innerHTML = '';
            });
        });
    }

    /**
     * ===========================
     * 4. Gestion du fullscreen
     * ===========================
     */
    const fullscreenOverlay = document.getElementById('fullscreen-overlay');
    const fullscreenImg = document.getElementById('fullscreen-img');
    const fullscreenRef = document.getElementById('fullscreen-ref');
    const fullscreenCat = document.getElementById('fullscreen-cat');
    const closeOverlayBtn = document.getElementById('close-overlay');

    function openFullscreen(imageSrc, refText, catText) {
        fullscreenImg.src = imageSrc;
        fullscreenRef.textContent = refText;
        fullscreenCat.textContent = catText;
        fullscreenOverlay.style.display = 'flex';
    }

    function closeFullscreen() {
        fullscreenOverlay.style.display = 'none';
    }

    closeOverlayBtn?.addEventListener('click', closeFullscreen);
    fullscreenOverlay?.addEventListener('click', (event) => {
        if (event.target === fullscreenOverlay) closeFullscreen();
    });

    function attachFullscreenEvents() {
        const fullscreenIcons = document.querySelectorAll('.photo-bloc__hover-fullscreen');
        fullscreenIcons.forEach((icon) => {
            icon.removeEventListener('click', handleFullscreenClick);
            icon.addEventListener('click', handleFullscreenClick);
        });
    }

    function handleFullscreenClick(event) {
        const icon = event.currentTarget;
        const parentBloc = icon.closest('.photo-bloc');

        if (parentBloc) {
            const imageSrc = parentBloc.querySelector('.photo-bloc__picture-img')?.src || '';
            const refText = parentBloc.querySelector('.photo-bloc__hover-ref')?.textContent || '';
            const catText = parentBloc.querySelector('.photo-bloc__hover-cat')?.textContent || '';
            openFullscreen(imageSrc, refText, catText);
        }
    }

    attachFullscreenEvents();
});
