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
    const form = modal?.querySelector('form'); // Sélectionner le formulaire dans la modale

    function openModal(event) {
        event.preventDefault();
        if (modal) {
            modal.style.display = 'block';
            const referenceValue = event.target?.dataset.reference || '';
            const formReferenceField = document.getElementById('reference');
            if (formReferenceField) formReferenceField.value = referenceValue;
        }
    }

    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            if (form) form.reset(); // Réinitialiser le formulaire à chaque fermeture de la modale
        }
    }

    openModalButton?.addEventListener('click', openModal);
    openPhotoModalButton?.addEventListener('click', openModal);
    closeModalButton?.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
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

    // Fonction pour peupler les filtres
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

    // Fonction pour filtrer les photos via AJAX
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

                    // Réattacher les événements après filtrage
                    window.attachFullscreenEvents();
                    window.attachLightboxEvents();

                } else {
                    photosContainer.innerHTML = '<p>Aucune photo trouvée.</p>';
                }
            })
            .catch((error) => console.error('Erreur lors du filtrage des photos :', error));
    }

    window.filterPhotos = filterPhotos;

    // Initialisation : chargement des filtres
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
                if (thumbnailUrl) {
                    thumbnailDisplay.innerHTML = `<img src="${thumbnailUrl}" alt="Miniature">`;
                    thumbnailDisplay.style.display = 'block';
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
    const fullscreenOverlay = document.querySelector('.fullscreen-overlay');
    const fullscreenImg = document.getElementById('fullscreen-img');
    const fullscreenRef = document.getElementById('fullscreen-ref');
    const fullscreenCat = document.getElementById('fullscreen-cat');
    const closeOverlayBtn = document.getElementById('close-overlay');

    function openFullscreen(imageSrc, refText, catText) {
        if (!fullscreenOverlay || !fullscreenImg || !fullscreenRef || !fullscreenCat) {
            console.error('Éléments manquants pour afficher le fullscreen.');
            return;
        }
        fullscreenImg.src = imageSrc || '';
        fullscreenRef.textContent = refText || 'Inconnu';
        fullscreenCat.textContent = catText || 'Inconnu';
        fullscreenOverlay.style.display = 'flex';
    }

    function closeFullscreen() {
        if (!fullscreenOverlay) {
            console.error('Impossible de fermer le fullscreen, élément introuvable.');
            return;
        }
        fullscreenOverlay.style.display = 'none';
    }

    closeOverlayBtn?.addEventListener('click', closeFullscreen);
    fullscreenOverlay?.addEventListener('click', (event) => {
        if (event.target === fullscreenOverlay) {
            closeFullscreen();
        }
    });

    window.attachFullscreenEvents = function attachFullscreenEvents() {
        const fullscreenIcons = document.querySelectorAll('.photo-bloc__hover-fullscreen');

        fullscreenIcons.forEach((icon) => {
            icon.removeEventListener('click', handleFullscreenClick);
            icon.addEventListener('click', handleFullscreenClick);
        });
    };

    function handleFullscreenClick(event) {
        const icon = event.currentTarget;
        const parentBloc = icon.closest('.photo-bloc');

        if (!parentBloc) {
            console.error('Bloc parent introuvable pour l\'icône cliquée.');
            return;
        }

        const imageSrc = parentBloc.querySelector('.photo-bloc__picture-img')?.src || '';
        const refText = parentBloc.querySelector('.photo-bloc__hover-ref')?.textContent || 'Inconnu';
        const catText = parentBloc.querySelector('.photo-bloc__hover-cat')?.textContent || 'Inconnu';

        openFullscreen(imageSrc, refText, catText);
    }

    window.attachLightboxEvents = function attachLightboxEvents() {
        const fullscreenIcons = document.querySelectorAll('.photo-bloc__hover-fullscreen');

        fullscreenIcons.forEach((icon) => {
            icon.removeEventListener('click', handleLightboxClick);
            icon.addEventListener('click', handleLightboxClick);
        });
    };

    window.handleLightboxClick =function handleLightboxClick(event) {
        event.preventDefault();
        const icon = event.currentTarget;
        const parentBloc = icon.closest('.photo-bloc');

        if (parentBloc) {
            const index = parentBloc.getAttribute('data-index');
            if (index === null || index.trim() === '') {
                console.error('Attribut data-index manquant ou vide pour le bloc parent.', parentBloc);
            } else {
                openLightbox(index);
            }
        } else {
            console.error('Impossible de trouver le bloc parent pour l’élément fullscreen cliqué.', icon);
        }
    }

    function openLightbox(index) {

        index = parseInt(index, 10);
        if (isNaN(index) || index < 0) {
            console.error('Index invalide pour la lightbox :', index);
            return;
        }

        const listePhotos = [];
        document.querySelectorAll('.photo-bloc').forEach((photoBloc) => {
            const photo = {
                src: photoBloc.getAttribute('data-src') || '',
                ref: photoBloc.getAttribute('data-ref') || 'Inconnu',
                cat: photoBloc.getAttribute('data-cat') || 'Inconnu',
                index: parseInt(photoBloc.getAttribute('data-index'), 10) || -1,
            };

            if (photo.src && photo.index !== -1) {
                listePhotos.push(photo);
            } else {
                console.warn('Photo invalide détectée :', photoBloc, photo);
            }
        });

        const selectedPhoto = listePhotos.find(photo => photo.index === index);
        if (!selectedPhoto) {
            console.error('Photo non trouvée pour l’index :', index);
            return;
        }

        fullscreenImg.src = selectedPhoto.src;
        fullscreenRef.textContent = selectedPhoto.ref;
        fullscreenCat.textContent = selectedPhoto.cat;
    }

    // Appels initiaux
    window.attachFullscreenEvents();
    window.attachLightboxEvents();

    const hamMenu = document.querySelector(".ham-menu");
    const offScreenMenu = document.querySelector(".off-screen-menu");
    const body = document.body;
    
    hamMenu.addEventListener("click", () => {
      hamMenu.classList.toggle("active");
      offScreenMenu.classList.toggle("active");
    
      // Ajouter ou retirer la classe no-scroll
      if (offScreenMenu.classList.contains("active")) {
        body.classList.add("no-scroll");
      } else {
        body.classList.remove("no-scroll");
      }
    });
});
