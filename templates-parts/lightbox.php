<?php 
$refPhoto = get_field("reference_photo");
$post = get_the_ID();
$category = get_the_terms($post, "categorie");

if (!empty($category) && !is_wp_error($category)) {
    $categoryPhoto = $category[0]->name;
} else {
    $categoryPhoto = 'aucune-categorie';
}

$typePhoto = get_field("type");
$format = get_the_terms($post, "format");
$formatPhoto = !empty($format) && !is_wp_error($format) ? $format[0]->name : 'aucun-format';
$datePhoto = get_the_date("Y");
$url = get_permalink();
$id = get_the_ID();    
?>

<!-- Conteneur pour le mode plein écran -->
<div class="fullscreen-overlay" data-index="0" data-cat="<?php echo esc_attr($categoryPhoto); ?>">
    <div class="fullscreen-overlay__content">
        <!-- Bouton de fermeture -->
        <img id="close-overlay" src="<?php echo get_template_directory_uri(); ?>/assets/img/close.svg" alt="Fermer" class="fullscreen-overlay__close">
        
        <!-- Conteneur pour les images "précédente" et "suivante" -->
        <div class="fullscreen-overlay__nav-container">
            <!-- Image de la photo précédente (prev) -->
            <button class="nav-container__prev">
            <img src="<?php echo get_template_directory_uri(); ?>/assets/img/arrow-left.svg" alt="Précédente" class="fullscreen-overlay__nav fullscreen-overlay__prev">
            <img src="<?php echo get_template_directory_uri(); ?>/assets/img/arrow-left-hover.svg" alt="Précédente" class="fullscreen-overlay__nav fullscreen-overlay__prev-hover">Précédente
            </button>
            <!-- Conteneur pour l'image principale et les textes -->
            <div class="fullscreen-overlay__img-container">
                <!-- Photo principale -->
                <img id="fullscreen-img" src="" alt="Fullscreen Image" class="fullscreen-overlay__img">
                <!-- Textes sous la photo -->
                <div class="fullscreen__txt">
                    <p id="fullscreen-ref" class="fullscreen-overlay__text fullscreen-overlay__ref"></p>
                    <p id="fullscreen-cat" class="fullscreen-overlay__text fullscreen-overlay__cat"></p>
                </div>
            </div>
            <!-- Image de la photo suivante (next) -->
            <button class="nav-container__next">Suivante
            <img src="<?php echo get_template_directory_uri(); ?>/assets/img/arrow-right.svg" alt="Suivante" class="fullscreen-overlay__nav fullscreen-overlay__next">
            <img src="<?php echo get_template_directory_uri(); ?>/assets/img/arrow-right-hover.svg" alt="Suivante" class="fullscreen-overlay__nav fullscreen-overlay__next-hover">
            </button>
        </div>
    </div>
</div>