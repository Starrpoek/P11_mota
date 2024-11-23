document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.querySelector('.fullscreen-overlay');
    const fullscreenImg = document.getElementById('fullscreen-img');
    const fullscreenRef = document.getElementById('fullscreen-ref');
    const fullscreenCat = document.getElementById('fullscreen-cat');
    const prevButton = document.querySelector('.nav-container__prev');
    const nextButton = document.querySelector('.nav-container__next');

    let photoIDs = []; // Liste des IDs disponibles
    let currentID = null; // ID actuellement affiché

    /**
     * Initialiser les données depuis la variable photoData
     */
    function initializePhotos() {
        if (!photoData || !photoData.photos) {
            console.error('Aucune donnée photo disponible.');
            return;
        }

        // Charger les IDs et les trier
        photoIDs = photoData.photos.map(photo => photo.id).sort((a, b) => b - a); // Tri décroissant
        console.log('Liste des IDs disponibles :', photoIDs);

        // Définit le premier ID comme celui actuel
        currentID = photoIDs[0];
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
