<div class="photo-bloc-container">
    <?php 
        $refPhoto = get_field("reference_photo");
        $categories = get_the_terms(get_the_ID(), 'categorie');
    ?>

    <div class="photo-bloc" 
        data-src="<?php echo esc_attr($thumbnail_url); ?>"
        data-ref="<?php echo esc_attr($refPhoto); ?>"
        data-cat="<?php echo esc_attr($categories_string); ?>"
        data-index="<?php echo $index; ?>">
        <div class="photo-bloc__picture">
            <img src="<?php echo get_the_post_thumbnail_url(); ?>" class="photo-bloc__picture-img" alt="<?php the_title_attribute(); ?>">
        </div>
        <div class="photo-bloc__hover">
            <!-- Lien pour agrandir l'image -->
            <a href="#" class="photo-bloc__hover-icon photo-bloc__hover-fullscreen">
            <img src="<?php echo get_template_directory_uri(); ?>/assets/img/Icon_fullscreen.svg" alt="Agrandir">
            </a>
            <!-- Bouton pour voir la photo (avec lien vers la page de l'article) -->
            <a href="<?php echo get_permalink(); ?>" class="photo-bloc__hover-icon photo-bloc__hover-eye">
                <img src="<?php echo get_template_directory_uri(); ?>/assets/img/Icon_eye.svg" alt="Voir">
            </a>
            <!-- Référence de la photo -->
            <p class="photo-bloc__hover-text photo-bloc__hover-ref">
            <?php
                
                if ($refPhoto) {
                    echo $refPhoto;
                }
                ?>
            </p>
            <!-- Catégorie de la photo -->
            <p class="photo-bloc__hover-text photo-bloc__hover-cat">
                <?php

                if ($categories) {
                    echo esc_html($categories[0]->name);
                }
                ?>
            </p>
        </div>
        
    </div>
</div>
<!-- Conteneur pour le mode plein écran -->
 <?php /*
<div id="fullscreen-overlay" class="fullscreen-overlay">
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
*/
