<div class="photo-bloc-container <?php echo wp_is_mobile() ? 'mobile' : ''; ?>">
    <?php 
        $refPhoto = get_field("reference_photo");
        $categories = get_the_terms(get_the_ID(), 'categorie');
        $index = get_the_ID();
    ?>

    <div class="photo-bloc" 
        data-src="<?php echo esc_url(get_the_post_thumbnail_url()); ?>"
        data-ref="<?php echo esc_attr($refPhoto); ?>"
        data-cat="<?php echo esc_attr(!empty($categories) ? $categories[0]->name : ''); ?>"
        data-index="<?php echo $index; ?>">

        <?php if (wp_is_mobile()) : ?>
            <!-- Version mobile : L'image entière est cliquable -->
            <a href="<?php echo get_permalink(); ?>" class="photo-bloc__picture">
                <img src="<?php echo esc_url(get_the_post_thumbnail_url()); ?>" 
                     class="photo-bloc__picture-img" 
                     alt="<?php the_title_attribute(); ?>">
            </a>
        <?php else : ?>
            <!-- Version desktop : Version avec le hover -->
            <div class="photo-bloc__picture">
                <img src="<?php echo esc_url(get_the_post_thumbnail_url()); ?>" 
                     class="photo-bloc__picture-img" 
                     alt="<?php the_title_attribute(); ?>">
            </div>
            <div class="photo-bloc__hover">
                <!-- Lien pour agrandir l'image -->
                <a class="photo-bloc__hover-icon photo-bloc__hover-fullscreen">
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/img/Icon_fullscreen.svg" alt="Agrandir">
                </a>
                <!-- Bouton pour voir la photo (avec lien vers la page de l'article) -->
                <a href="<?php echo get_permalink(); ?>" class="photo-bloc__hover-icon photo-bloc__hover-eye">
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/img/Icon_eye.svg" alt="Voir">
                </a>
                <!-- Référence de la photo -->
                <p class="photo-bloc__hover-text photo-bloc__hover-ref">
                    <?php echo esc_html($refPhoto); ?>
                </p>
                <!-- Catégorie de la photo -->
                <p class="photo-bloc__hover-text photo-bloc__hover-cat">
                    <?php echo !empty($categories) ? esc_html($categories[0]->name) : ''; ?>
                </p>
            </div>
        <?php endif; ?>

    </div>
</div>
