jQuery(document).ready(function ($) {
    // Applique Select2 à tes filtres
    $(".filter-select").select2();

    // Appelle filterPhotos() à chaque changement de filtre
    $("#filter-category, #filter-format, #filter-order").on("change", function () {
        filterPhotos();
    });
});
