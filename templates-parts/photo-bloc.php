<div class="photo-bloc-container">

    <div class="photo-bloc"> 
        <div class="photo-bloc__picture">
            <img src="<?php echo get_the_post_thumbnail_url(); ?>" class="photo-bloc__picture-img" alt="<?php the_title_attribute(); ?>">
        </div>
        <div class="photo-bloc__hover">
            <!-- Bouton pour agrandir l'image -->
            <img src="<?php echo get_template_directory_uri(); ?>/assets/img/Icon_fullscreen.svg" alt="Agrandir" class="photo-bloc__hover-icon photo-bloc__hover-fullscreen">
            <!-- Bouton pour voir la photo (avec lien vers la page de l'article) -->
            <a href="<?php echo get_permalink(); ?>" class="photo-bloc__hover-icon photo-bloc__hover-eye">
                <img src="<?php echo get_template_directory_uri(); ?>/assets/img/Icon_eye.svg" alt="Voir">
            </a>
            <!-- Référence de la photo -->
            <p class="photo-bloc__hover-text photo-bloc__hover-ref">
            <?php
                $refPhoto = get_field("reference_photo");
                if ($refPhoto) {
                    echo $refPhoto;
                }
                ?>
            </p>
            <!-- Catégorie de la photo -->
            <p class="photo-bloc__hover-text photo-bloc__hover-cat">
                <?php
                $categories = get_the_terms(get_the_ID(), 'categorie');
                if ($categories) {
                    echo esc_html($categories[0]->name);
                }
                ?>
            </p>
        </div>
        
    </div>
</div>
<!-- Conteneur pour le mode plein écran -->
<div id="fullscreen-overlay" class="fullscreen-overlay">
    <div class="fullscreen-overlay__content">
        <!-- Bouton de fermeture -->
        <img id="close-overlay" src="<?php echo get_template_directory_uri(); ?>/assets/img/close.svg" alt="Fermer" class="fullscreen-overlay__close">
        <img id="fullscreen-img" src="" alt="Fullscreen Image" class="fullscreen-overlay__img">
            <!-- Texte de la référence de la photo -->
             <div class="fullscreen__txt">
            <p id="fullscreen-ref" class="fullscreen-overlay__text fullscreen-overlay__ref"></p>
            <!-- Texte de la catégorie de la photo -->
            <p id="fullscreen-cat" class="fullscreen-overlay__text fullscreen-overlay__cat"></p>
             </div>
    </div>
</div>