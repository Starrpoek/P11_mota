/**
 * Gestion des filtres avec Select2
 * Initialise Select2 et attache un événement pour mettre à jour les photos au changement de filtre.
 */
jQuery(document).ready(function ($) {
    // Applique Select2 à tous les filtres ayant la classe "filter-select"
    $(".filter-select").select2({
        minimumResultsForSearch: -1, // Désactive la recherche dans le Select2
    });

    // Appelle la fonction filterPhotos() à chaque changement dans les filtres
    $("#filter-category, #filter-format, #filter-order").on("change", function () {
        if (typeof filterPhotos === "function") {
            filterPhotos(); // Vérifie si filterPhotos est défini et l'appelle
        } else {
            console.error("filterPhotos n'est pas défini.");
        }
    });
});
