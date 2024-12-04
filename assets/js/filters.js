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
        loadMoreButton.fadeIn(); // Réafficher le bouton
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
            url: theme_ajax.ajax_url,
            type: "POST",
            data: {
                action: "filter_photos",
                nonce: theme_ajax.nonce,
                category: category,
                format: format,
                order: order,
                page: 1,
            },
            beforeSend: function () {
                $("#photos").html('<p>Chargement des photos...</p>');
            },
            success: function (response) {
                if (response.success) {
                    $("#photos").html(response.data.html);
                    attachFullscreenEvents();
                    attachLightboxEvents();
                } else {
                    $("#photos").html('<p>Aucune photo trouvée.</p>');
                }
            },
            error: function () {
                console.error("Erreur lors du chargement des photos.");
                $("#photos").html('<p>Une erreur est survenue.</p>');
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
        page++;

        // Récupérer les valeurs des filtres
        const category = $("#filter-category").val();
        const format = $("#filter-format").val();
        const order = $("#filter-order").val();

        // Requête AJAX
        $.ajax({
            url: theme_ajax.ajax_url,
            type: "POST",
            data: {
                action: "load_more_photos",
                nonce: theme_ajax.nonce,
                category: category,
                format: format,
                order: order,
                page: page,
            },
            beforeSend: function () {
                loadMoreButton.text("Chargement...");
            },
            success: function (response) {
                if (response.success) {
                    $("#photos").append(response.data.html);
                    loadMoreButton.text("Charger plus");
                    attachFullscreenEvents();
                    attachLightboxEvents();
                } else {
                    loadMoreButton.text("Aucun autre article disponible");
                    loadMoreButton.fadeOut();u
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
        minimumResultsForSearch: -1,
        dropdownParent: $(".filter-select").parent(),
    });
    
    $(".filter-select").on("select2:open", function () {
        const dropdown = $(".select2-container .select2-dropdown");
        
        // Réinitialiser les styles pour préparer l'effet d'ouverture
        dropdown.css({
            opacity: 0,
            transform: "translateY(-10px)",
            transition: "none",
        });
    
        // Appliquer les transitions pour l'effet d'ouverture
        setTimeout(() => {
            dropdown.css({
                opacity: 1,
                transform: "translateY(0)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
            });
        }, 0);
    });
    
    $(".filter-select").on("select2:close", function () {
        const dropdown = $(".select2-container .select2-dropdown");
        
        // Appliquer les transitions pour l'effet de fermeture
        dropdown.css({
            opacity: 0,
            transform: "translateY(-10px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
        });
    
        setTimeout(() => {
            dropdown.css({
                transition: "none",
            });
        }, 300);
    });
    
    // Lancer le filtrage lorsqu'un filtre est modifié
    $("#filter-category, #filter-format, #filter-order").on("change", filterPhotos);

    // Charger plus d'articles au clic sur le bouton
    loadMoreButton.on("click", loadMorePhotos);
});
