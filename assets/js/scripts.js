document.addEventListener('DOMContentLoaded', function () {
    // Modal handling
    const openModalButton = document.querySelector('a[href="#contactModal"]');
    const openPhotoModalButton = document.getElementById('openPhotoModal');
    const modal = document.getElementById('contactModal');
    const closeModalButton = document.getElementById('closeModal');

    function openModal(event) {
        event.preventDefault();
        if (modal) {
            modal.style.display = 'block';
            if (event.target && event.target.dataset.reference) {
                const referenceValue = event.target.dataset.reference;
                const formReferenceField = document.getElementById('reference');
                if (formReferenceField) {
                    formReferenceField.value = referenceValue;
                }
            }
        }
    }

    if (openModalButton) {
        openModalButton.addEventListener('click', openModal);
    }

    if (openPhotoModalButton) {
        openPhotoModalButton.addEventListener('click', openModal);
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', function () {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', function (event) {
        if (modal && event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Filter handling
    const categoryFilter = document.getElementById("filter-category");
    const formatFilter = document.getElementById("filter-format");
    const orderFilter = document.getElementById("filter-order");
    
    const photosContainer = document.getElementById("photos");

    // Fonction pour charger les filtres
    function populateFilters() {
        fetch(theme_ajax.ajax_url + "?action=get_filters_terms")
            .then((response) => response.json())
            .then((data) => {
                if (data.categories && categoryFilter) {
                    data.categories.forEach((category) => {
                        const option = document.createElement("option");
                        option.value = category.id;
                        option.textContent = category.name;
                        categoryFilter.appendChild(option);
                    });
                }

                if (data.formats && formatFilter) {
                    data.formats.forEach((format) => {
                        const option = document.createElement("option");
                        option.value = format.id;
                        option.textContent = format.name;
                        formatFilter.appendChild(option);
                    });
                }
                if (typeof jQuery !== 'undefined') {
                    jQuery('.filter-select').select2({
                        minimumResultsForSearch: -1 
                    });
                    jQuery('.filter-select').on('change', filterPhotos);
                }
            })
            .catch((error) =>
                console.error("Erreur lors du chargement des filtres :", error)
            );
    }

    // Fonction pour filtrer les photos
    function filterPhotos() {
        const category = categoryFilter ? categoryFilter.value : "";
        const format = formatFilter ? formatFilter.value : "";
        const order = orderFilter ? orderFilter.value : "DESC";

        const formData = new FormData();
        formData.append("action", "filter_photos");
        formData.append("category", category);
        formData.append("format", format);
        formData.append("order", order);
        formData.append("page", 1);

        fetch(theme_ajax.ajax_url, {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success && data.data.html) {
                    photosContainer.innerHTML = data.data.html;
                } else {
                    photosContainer.innerHTML = "<p>Aucune photo trouvée.</p>";
                }
            })
            .catch((error) =>
                console.error("Erreur lors du filtrage des photos :", error)
            );
    }

    // Charger les filtres au chargement de la page
    populateFilters();

    // Ajouter des écouteurs sur les filtres
    if (categoryFilter) {
        categoryFilter.addEventListener("change", filterPhotos);
    }
    if (formatFilter) {
        formatFilter.addEventListener("change", filterPhotos);
    }
    if (orderFilter) {
        orderFilter.addEventListener("change", filterPhotos);
    }
});

// Récupération des éléments nécessaires
const fullscreenOverlay = document.getElementById('fullscreen-overlay');
const fullscreenImg = document.getElementById('fullscreen-img');
const fullscreenRef = document.getElementById('fullscreen-ref');
const fullscreenCat = document.getElementById('fullscreen-cat');

// Fonction pour afficher l'overlay avec les informations de la photo
function openFullscreen(imageSrc, refText, catText) {
    fullscreenImg.src = imageSrc; // Affichage de l'image
    fullscreenRef.textContent = refText; // Affichage de la référence
    fullscreenCat.textContent = catText; // Affichage de la catégorie
    
    fullscreenOverlay.style.display = 'flex'; // Affichage de l'overlay
}

// Ajout d'un événement sur les icônes "fullscreen" pour afficher l'image en fullscreen
const fullscreenIcons = document.querySelectorAll('.photo-bloc__hover-fullscreen'); // Sélection des icônes fullscreen
fullscreenIcons.forEach(icon => {
    icon.addEventListener('click', function() {
        const parentBloc = icon.closest('.photo-bloc'); // On trouve le parent contenant l'image
        
        // Récupérer l'URL de l'image, la référence et la catégorie depuis le parent
        const imageSrc = parentBloc.querySelector('.photo-bloc__picture-img').src;
        const refText = parentBloc.querySelector('.photo-bloc__hover-ref') ? parentBloc.querySelector('.photo-bloc__hover-ref').textContent : '';
        const catText = parentBloc.querySelector('.photo-bloc__hover-cat') ? parentBloc.querySelector('.photo-bloc__hover-cat').textContent : '';
        
        openFullscreen(imageSrc, refText, catText); // Ouvrir l'overlay avec les données
    });
});
// Sélectionne le bouton de fermeture
const closeOverlayBtn = document.getElementById('close-overlay');
// Ajoute un gestionnaire de clic pour fermer l'overlay
closeOverlayBtn.addEventListener('click', () => {
    const overlay = document.getElementById('fullscreen-overlay');
    overlay.style.display = 'none'; // Cache l'overlay
});

// Fonction pour fermer l'overlay lorsque l'on clique en dehors de l'image
fullscreenOverlay.addEventListener('click', function(e) {
    if (e.target === fullscreenOverlay) {
        fullscreenOverlay.style.display = 'none'; // Masquer l'overlay
    }
});

