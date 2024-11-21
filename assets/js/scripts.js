document.addEventListener('DOMContentLoaded', function () {
    /**
     * ===========================
     * 1. Gestion des modales
     * ===========================
     */
    const openModalButton = document.querySelector('a[href="#contactModal"]');
    const openPhotoModalButton = document.getElementById('openPhotoModal');
    const modal = document.getElementById('contactModal');
    const closeModalButton = document.getElementById('closeModal');

    // Fonction pour ouvrir la modale
    function openModal(event) {
        event.preventDefault();
        if (modal) {
            modal.style.display = 'block';
            // Remplit le champ de référence si présent
            if (event.target && event.target.dataset.reference) {
                const referenceValue = event.target.dataset.reference;
                const formReferenceField = document.getElementById('reference');
                if (formReferenceField) {
                    formReferenceField.value = referenceValue;
                }
            }
        }
    }

    // Gestion des clics pour ouvrir et fermer la modale
    openModalButton?.addEventListener('click', openModal);
    openPhotoModalButton?.addEventListener('click', openModal);
    closeModalButton?.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (modal && event.target === modal) {
            modal.style.display = 'none';
        }
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

    // Fonction pour charger les données des filtres depuis le serveur
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

                // Réinitialise Select2 après le chargement des filtres
                if (typeof jQuery !== 'undefined') {
                    jQuery('.filter-select').select2({
                        minimumResultsForSearch: -1,
                    });
                }
            })
            .catch((error) =>
                console.error('Erreur lors du chargement des filtres :', error)
            );
    }

    // Fonction pour filtrer les photos via AJAX
    window.filterPhotos = function () {
        const category = categoryFilter ? categoryFilter.value : '';
        const format = formatFilter ? formatFilter.value : '';
        const order = orderFilter ? orderFilter.value : 'DESC';

        const formData = new FormData();
        formData.append('action', 'filter_photos');
        formData.append('category', category);
        formData.append('format', format);
        formData.append('order', order);
        formData.append('page', 1);

        fetch(theme_ajax.ajax_url, {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success && data.data.html) {
                    photosContainer.innerHTML = data.data.html;
                    attachFullscreenEvents(); // Réattache les événements fullscreen
                } else {
                    photosContainer.innerHTML = '<p>Aucune photo trouvée.</p>';
                }
            })
            .catch((error) =>
                console.error('Erreur lors du filtrage des photos :', error)
            );
    };

    // Charge les filtres au chargement de la page
    populateFilters();

    /**
     * ===========================
     * 3. Gestion de l'overlay fullscreen
     * ===========================
     */
    const fullscreenOverlay = document.getElementById('fullscreen-overlay');
    const fullscreenImg = document.getElementById('fullscreen-img');
    const fullscreenRef = document.getElementById('fullscreen-ref');
    const fullscreenCat = document.getElementById('fullscreen-cat');
    const closeOverlayBtn = document.getElementById('close-overlay');

    // Fonction pour afficher l'overlay
    function openFullscreen(imageSrc, refText, catText) {
        fullscreenImg.src = imageSrc;
        fullscreenRef.textContent = refText;
        fullscreenCat.textContent = catText;
        fullscreenOverlay.style.display = 'flex';
    }

    // Fonction pour fermer l'overlay
    function closeFullscreen() {
        fullscreenOverlay.style.display = 'none';
    }

    // Ajoute des événements aux icônes fullscreen
    function attachFullscreenEvents() {
        const fullscreenIcons = document.querySelectorAll('.photo-bloc__hover-fullscreen');
        fullscreenIcons.forEach((icon) => {
            icon.removeEventListener('click', handleFullscreenClick); // Supprime les anciens gestionnaires
            icon.addEventListener('click', handleFullscreenClick); // Ajoute le gestionnaire d'événements
        });
    }
    
    // Gestionnaire pour le clic sur un bouton fullscreen
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
    

    // Initialisation des événements fullscreen
    attachFullscreenEvents();

    // Ajout d'un événement pour fermer l'overlay
    closeOverlayBtn?.addEventListener('click', closeFullscreen);
    fullscreenOverlay?.addEventListener('click', (event) => {
        if (event.target === fullscreenOverlay) {
            closeFullscreen();
        }
    });
});
