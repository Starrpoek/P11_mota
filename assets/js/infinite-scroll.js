document.addEventListener('DOMContentLoaded', function () {
    let page = 1; // Page actuelle pour la pagination
    const contentContainer = document.querySelector('.homepage-photos__content'); // Conteneur des photos
    const loadMoreButton = document.querySelector('#load-more-button'); // Bouton "Charger plus"
    const noMorePhotosMessage = document.querySelector('#no-more-photos'); // Message "Aucune photo supplémentaire"
    const ajaxUrl = theme_ajax.ajax_url; // URL AJAX
    let loading = false; // Empêche les appels multiples

    /**
     * Réinitialise la pagination, le bouton "Charger plus" et les messages lorsque les filtres changent.
     */
    function resetPagination() {
        page = 1; // Réinitialise la pagination
        loadMoreButton.style.display = 'block'; // Réaffiche le bouton "Charger plus"
        loadMoreButton.textContent = 'Charger plus'; // Réinitialise le texte du bouton
        noMorePhotosMessage.style.display = 'none'; // Cache le message "Photos en cours de tirage..."
        contentContainer.innerHTML = ''; // Vide le conteneur des photos

        // Recharge les photos avec les filtres sélectionnés
        const category = document.getElementById('filter-category')?.value || '';
        const format = document.getElementById('filter-format')?.value || '';
        const order = document.getElementById('filter-order')?.value || 'DESC';

        const formData = new FormData();
        formData.append('action', 'filter_photos');
        formData.append('category', category);
        formData.append('format', format);
        formData.append('order', order);
        formData.append('page', page); // Charge la première page

        fetch(ajaxUrl, {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success && data.data.html.trim() !== '') {
                    contentContainer.innerHTML = data.data.html; // Insère les photos filtrées
                } else {
                    contentContainer.innerHTML = "<p>Aucune photo trouvée.</p>";
                    loadMoreButton.style.display = 'none'; // Cache le bouton si aucun résultat
                }
            })
            .catch((error) => {
                console.error('Erreur lors de la mise à jour des filtres :', error);
            });
    }

    // Attache la réinitialisation aux filtres
    const filters = ['filter-category', 'filter-format', 'filter-order'];
    filters.forEach((filterId) => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', resetPagination);
        }
    });

    /**
     * Fonction pour charger plus de photos via AJAX.
     */
    function loadMorePhotos() {
        if (loading) return; // Empêche les appels multiples

        loading = true; // Marque comme en cours de chargement
        const category = document.getElementById('filter-category')?.value || '';
        const format = document.getElementById('filter-format')?.value || '';
        const order = document.getElementById('filter-order')?.value || 'DESC';

        const formData = new FormData();
        formData.append('action', 'load_more_photos');
        formData.append('page', page + 1); // Page suivante
        formData.append('category', category);
        formData.append('format', format);
        formData.append('order', order);

        loadMoreButton.textContent = 'Chargement...'; // Mise à jour du texte du bouton

        fetch(ajaxUrl, {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json()) // Analyse la réponse JSON
            .then((data) => {
                if (data.success && data.data.html.trim() !== '') {
                    contentContainer.innerHTML += data.data.html; // Ajoute les nouvelles photos
                    page++; // Incrémente la page
                } else {
                    loadMoreButton.style.display = 'none'; // Cache le bouton
                    noMorePhotosMessage.style.display = 'block'; // Affiche le message
                }
                loading = false; // Termine le chargement
                loadMoreButton.textContent = 'Charger plus'; // Réinitialise le texte
            })
            .catch((error) => {
                console.error('Erreur lors du chargement des photos:', error);
                loading = false; // Réinitialise l'état en cas d'erreur
                loadMoreButton.textContent = 'Charger plus'; // Réinitialise le texte
            });
    }

    // Attache l'événement au bouton "Charger plus"
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', loadMorePhotos);
    }
});
