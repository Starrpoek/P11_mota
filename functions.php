<?php

function mota_theme_enqueue_styles() {
    wp_enqueue_style( 'mota-theme-style', get_stylesheet_uri() );
    wp_enqueue_style( 'contact-modal-style', get_template_directory_uri() . '/assets/css/contact-modal.css', array(), null, 'all' );

    wp_enqueue_script('theme-scripts', get_template_directory_uri() . '/assets/js/scripts.js', array(), null, true);
    wp_enqueue_script('infinite-scroll', get_template_directory_uri() . '/assets/js/infinite-scroll.js', array('jquery'), null, true);
    wp_localize_script('infinite-scroll', 'theme_ajax', array( 'ajax_url' => admin_url('admin-ajax.php'), ));
}
/* Chargement du menu wp */
function mota_theme_setup() {
    register_nav_menus( array(
        'main_menu' => __( 'Menu Principal', 'mota-theme' ),
    ) );
}

function get_all_custom_fields( $post_id ) {
    $fields = get_post_meta( $post_id );
    
    $cleaned_fields = array();
    foreach ( $fields as $key => $value ) {
        $cleaned_fields[ $key ] = maybe_unserialize( $value[0] );
    }

    return $cleaned_fields;
}

/* Function pour afficher plus d'article avec AJAX  avec les filtres */
function load_more_photos_ajax() {
    $paged = isset($_POST['page']) ? $_POST['page'] : 1;
    $posts_per_page = 8;

    $category = isset($_POST['category']) ? intval($_POST['category']) : 0;
    $format = isset($_POST['format']) ? intval($_POST['format']) : 0;

    $args = array(
        'post_type' => 'photo',
        'posts_per_page' => $posts_per_page,
        'paged' => $paged,
        'orderby' => 'date',
        'order' => 'DESC',
    );

    if ($category) {
        $args['tax_query'][] = [
            'taxonomy' => 'categorie',
            'field'    => 'term_id',
            'terms'    => $category,
        ];
    }

    if ($format) {
        $args['tax_query'][] = [
            'taxonomy' => 'format',
            'field'    => 'term_id',
            'terms'    => $format,
        ];
    }

    $custom_query = new WP_Query($args);

    if ($custom_query->have_posts()) {
        while ($custom_query->have_posts()) {
            $custom_query->the_post();
            get_template_part('templates-parts/photo-bloc');
        }
        wp_reset_postdata();
    }
    
    wp_die();
}
/* Function pour afficher les filtres avec AJAX */
function get_filters_terms() {
    $categories = get_terms(['taxonomy' => 'categorie', 'hide_empty' => true]);
    $formats = get_terms(['taxonomy' => 'format', 'hide_empty' => true]);

    $response = [
        'categories' => [],
        'formats'    => [],
    ];

    if (!is_wp_error($categories)) {
        foreach ($categories as $category) {
            $response['categories'][] = [
                'id' => $category->term_id,
                'name' => $category->name,
            ];
        }
    }

    if (!is_wp_error($formats)) {
        foreach ($formats as $format) {
            $response['formats'][] = [
                'id' => $format->term_id,
                'name' => $format->name,
            ];
        }
    }

    wp_send_json($response);
}

/* Function pour traitement des filtres AJAX : */
function filter_photos_ajax() {
    $paged = isset($_POST['page']) ? intval($_POST['page']) : 1;
    $posts_per_page = 8;

    $category = isset($_POST['category']) ? intval($_POST['category']) : 0;
    $format = isset($_POST['format']) ? intval($_POST['format']) : 0;
    $order = isset($_POST['order']) ? sanitize_text_field($_POST['order']) : 'DESC';

    $args = [
        'post_type' => 'photo',
        'posts_per_page' => $posts_per_page,
        'paged' => $paged,
        'orderby' => 'date',
        'order' => $order,
    ];

    if ($category) {
        $args['tax_query'][] = [
            'taxonomy' => 'categorie',
            'field'    => 'term_id',
            'terms'    => $category,
        ];
    }

    if ($format) {
        $args['tax_query'][] = [
            'taxonomy' => 'format',
            'field'    => 'term_id',
            'terms'    => $format,
        ];
    }

    $custom_query = new WP_Query($args);

    if ($custom_query->have_posts()) {
        ob_start();
        while ($custom_query->have_posts()) {
            $custom_query->the_post();
            get_template_part('templates-parts/photo-bloc');
        }
        $html = ob_get_clean();
        wp_reset_postdata();

        wp_send_json_success(['html' => $html]);
    } else {
        wp_send_json_error(['message' => 'Aucun résultat trouvé.']);
    }

    wp_die();
}

/* Function pour afficher plus d'article avec AJAX */
add_action('wp_ajax_load_more_photos', 'load_more_photos_ajax');
add_action('wp_ajax_nopriv_load_more_photos', 'load_more_photos_ajax');
/* Function pour afficher les filtres avec AJAX */
add_action('wp_ajax_get_filters_terms', 'get_filters_terms');
add_action('wp_ajax_nopriv_get_filters_terms', 'get_filters_terms');
/* Function pour traitement des filtres AJAX : */
add_action('wp_ajax_filter_photos', 'filter_photos_ajax');
add_action('wp_ajax_nopriv_filter_photos', 'filter_photos_ajax');

/* Chargement du menu wp */
add_action( 'wp_enqueue_scripts', 'mota_theme_enqueue_styles' );
add_action( 'after_setup_theme', 'mota_theme_setup' );
?>
