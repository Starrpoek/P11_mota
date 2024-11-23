/**
 * Gestion des filtres et du bouton "Charger plus" via AJAX
 * - Initialise Select2 pour les filtres.
 * - Réinitialise la pagination et le bouton "Charger plus" lorsque les filtres changent.
 * - Charge dynamiquement des articles supplémentaires avec le bouton "Charger plus".
 */

jQuery(document).ready(function ($) {
    let page = 1; // Variable globale pour la pagination
    const loadMoreButton = $("#load-more-button"); // Bouton "Charger plus"

    /**
     * ==============================
     * Réinitialisation du bouton "Charger plus"
     * ==============================
     * - Réactive le bouton.
     * - Réinitialise le texte à "Charger plus".
     */
    function resetLoadMoreButton() {
        loadMoreButton.prop("disabled", false); // Réactiver le bouton
        loadMoreButton.text("Charger plus"); // Réinitialiser le texte
    }

    /**
     * ==============================
     * Réinitialisation de la pagination
     * ==============================
     * - Réinitialise la page à 1.
     * - Réinitialise le bouton "Charger plus".
     */
    function resetPagination() {
        page = 1; // Réinitialiser la page
        resetLoadMoreButton(); // Réinitialiser l'état du bouton
    }

    /**
     * ==============================
     * Fonction pour filtrer les photos via AJAX
     * ==============================
     * - Envoie une requête AJAX avec les filtres sélectionnés.
     * - Réinitialise la pagination et le contenu des articles.
     */
    function filterPhotos() {
        // Récupérer les valeurs des filtres
        const category = $("#filter-category").val();
        const format = $("#filter-format").val();
        const order = $("#filter-order").val();

        // Réinitialiser la pagination
        resetPagination();

        // Requête AJAX
        $.ajax({
            url: theme_ajax.ajax_url, // URL définie dans wp_localize_script
            type: "POST",
            data: {
                action: "filter_photos", // Action définie dans functions.php
                nonce: theme_ajax.nonce, // Sécurité AJAX
                category: category, // Filtre catégorie
                format: format, // Filtre format
                order: order, // Ordre de tri
                page: 1, // Réinitialiser à la première page
            },
            beforeSend: function () {
                $("#photos").html('<p>Chargement des photos...</p>'); // Afficher un message temporaire
            },
            success: function (response) {
                if (response.success) {
                    $("#photos").html(response.data.html); // Mettre à jour les articles
                    attachFullscreenEvents(); // Réattacher les événements fullscreen
                    attachLightboxEvents(); // Réattacher les événements lightbox
                } else {
                    $("#photos").html('<p>Aucune photo trouvée.</p>'); // Afficher un message d'erreur
                }
            },
            error: function () {
                console.error("Erreur lors du chargement des photos.");
                $("#photos").html('<p>Une erreur est survenue.</p>'); // Afficher un message d'erreur
            },
        });
    }

    /**
     * ==============================
     * Fonction pour charger plus de photos
     * ==============================
     * - Incrémente la pagination.
     * - Charge des articles supplémentaires via AJAX.
     */
    function loadMorePhotos() {
        page++; // Passer à la page suivante

        // Récupérer les valeurs des filtres
        const category = $("#filter-category").val();
        const format = $("#filter-format").val();
        const order = $("#filter-order").val();

        // Requête AJAX
        $.ajax({
            url: theme_ajax.ajax_url,
            type: "POST",
            data: {
                action: "load_more_photos", // Action définie dans functions.php
                nonce: theme_ajax.nonce, // Sécurité AJAX
                category: category, // Filtre catégorie
                format: format, // Filtre format
                order: order, // Ordre de tri
                page: page, // Charger la page suivante
            },
            beforeSend: function () {
                loadMoreButton.text("Chargement..."); // Indiquer que ça charge
            },
            success: function (response) {
                if (response.success) {
                    $("#photos").append(response.data.html); // Ajouter les nouveaux articles
                    loadMoreButton.text("Charger plus"); // Réinitialiser le texte
                    attachFullscreenEvents(); // Réattacher les événements fullscreen
                    attachLightboxEvents(); // Réattacher les événements lightbox
                } else {
                    loadMoreButton.text("Aucun autre article disponible");
                    loadMoreButton.prop("disabled", true); // Désactiver le bouton
                }
            },
            error: function () {
                alert("Une erreur s’est produite lors du chargement.");
            },
        });
    }

    /**
     * ==============================
     * Événements sur les filtres et le bouton "Charger plus"
     * ==============================
     */
    $(".filter-select").select2({
        minimumResultsForSearch: -1, // Désactive la recherche dans Select2
    });

    // Lancer le filtrage lorsqu'un filtre est modifié
    $("#filter-category, #filter-format, #filter-order").on("change", filterPhotos);

    // Charger plus d'articles au clic sur le bouton
    loadMoreButton.on("click", loadMorePhotos);
});
