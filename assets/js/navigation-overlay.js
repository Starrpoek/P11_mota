/**
 * 
 * - 
 * - 
 * - 
 */

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.querySelector('.fullscreen-overlay');
    const fullscreenImg = document.getElementById('fullscreen-img');
    const fullscreenRef = document.getElementById('fullscreen-ref');
    const fullscreenCat = document.getElementById('fullscreen-cat');
    const prevButton = document.querySelector('.nav-container__prev');
    const nextButton = document.querySelector('.nav-container__next');

    let photoIDs = []; // Liste des IDs disponibles
    let currentID = null; // ID actuellement affiché
    let currentCategory = null; // Catégorie actuelle

    /**
     * Initialiser les données depuis la variable photoData
     */
    function initializePhotos() {
        if (!photoData || !photoData.photos) {
            console.error('Aucune donnée photo disponible.');
            return;
        }

        // Récupérer la catégorie de la photo actuelle (page utilisant le template `single-photo.php`)
        if (document.body.classList.contains('single-photo')) {
            // Supposons que l'ID de la photo actuelle est déjà défini dans l'attribut `data-index` de l'overlay
            currentID = parseInt(overlay.getAttribute('data-index'), 10);
            currentCategory = overlay.getAttribute('data-cat');

            if (!currentCategory) {
                console.error("Aucune catégorie trouvée pour la photo actuelle.");
                return;
            }

            // Filtrer les photos pour ne garder que celles de la même catégorie
            photoIDs = photoData.photos
                .filter(photo => photo.cat === currentCategory)
                .map(photo => photo.id)
                .sort((a, b) => b - a);

            console.log(`Photos filtrées pour la catégorie "${currentCategory}" :`, photoIDs);

            // S'assurer que l'ID actuel est bien présent dans la liste filtrée
            if (!photoIDs.includes(currentID)) {
                console.warn(`ID actuel (${currentID}) non présent dans la catégorie "${currentCategory}".`);
                currentID = photoIDs.length > 0 ? photoIDs[0] : null;
            }
        } else {
            // Pour les autres pages, charger toutes les photos
            photoIDs = photoData.photos.map(photo => photo.id).sort((a, b) => b - a);
            currentID = photoIDs.length > 0 ? photoIDs[0] : null;
        }

        // Afficher la première photo si elle existe
        if (currentID !== null) {
            displayPhotoByID(currentID);
        } else {
            console.error('Aucune photo disponible après le filtrage.');
        }
    }

    /**
     * Affiche une photo selon son ID
     * @param {number} id - L'ID de la photo à afficher
     */
    function displayPhotoByID(id) {
        const photo = photoData.photos.find(p => p.id === id);
        if (!photo) {
            console.warn(`Aucune donnée trouvée pour l'ID : ${id}`);
            return;
        }

        // Met à jour les éléments de l'overlay avec les données de la photo
        fullscreenImg.src = photo.src || '';
        fullscreenRef.textContent = photo.ref || 'Référence inconnue';
        fullscreenCat.textContent = photo.cat || 'Catégorie inconnue';
        overlay.setAttribute('data-index', id); // Met à jour l'attribut data-index
        currentID = id;
    }

    /**
     * Navigation vers la photo précédente
     */
    function navigatePrev() {
        const currentIndex = photoIDs.indexOf(currentID);
        if (currentIndex === -1) {
            console.error(`ID actuel (${currentID}) introuvable dans la liste.`);
            return;
        }

        // Calcul du nouvel index (navigation circulaire)
        const newIndex = (currentIndex + 1) % photoIDs.length;
        displayPhotoByID(photoIDs[newIndex]);
    }

    /**
     * Navigation vers la photo suivante
     */
    function navigateNext() {
        const currentIndex = photoIDs.indexOf(currentID);
        if (currentIndex === -1) {
            console.error(`ID actuel (${currentID}) introuvable dans la liste.`);
            return;
        }

        // Calcul du nouvel index (navigation circulaire)
        const newIndex = (currentIndex - 1 + photoIDs.length) % photoIDs.length;
        displayPhotoByID(photoIDs[newIndex]);
    }

    /**
     * Attacher les événements de navigation
     */
    function attachNavigationEvents() {
        prevButton?.addEventListener('click', navigatePrev);
        nextButton?.addEventListener('click', navigateNext);
    }

    // Initialisation au chargement de la page
    initializePhotos();
    attachNavigationEvents();

    console.log('Navigation Overlay Script Chargé');
});
