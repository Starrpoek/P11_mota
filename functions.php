<?php

/**
 * ====================================
 * 1. ENQUEUE STYLES ET SCRIPTS
 * ====================================
 * Cette fonction charge les fichiers CSS et JS nécessaires au thème.
 * Elle ajoute également les dépendances externes comme jQuery et Select2.
 */
function mota_theme_enqueue_assets() {
    // CSS principal du thème
    wp_enqueue_style('mota-theme-style', get_stylesheet_uri(), [], filemtime(get_stylesheet_directory() . '/style.css'), 'all');

    // CSS pour la modale
    wp_enqueue_style('contact-modal-style', get_template_directory_uri() . '/assets/css/contact-modal.css', [], filemtime(get_template_directory() . '/assets/css/contact-modal.css'), 'all');

    // Select2 pour les filtres
    wp_enqueue_style('select2-css', 'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css');

    // JavaScript principal
    wp_enqueue_script('jquery');
    wp_enqueue_script('select2-js', 'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js', ['jquery'], null, true);
    wp_enqueue_script('filters-js', get_template_directory_uri() . '/assets/js/filters.js', ['jquery', 'select2-js'], filemtime(get_template_directory() . '/assets/js/filters.js'), true);
    wp_enqueue_script('theme-scripts', get_template_directory_uri() . '/assets/js/scripts.js', ['jquery'], filemtime(get_template_directory() . '/assets/js/scripts.js'), true);
    wp_enqueue_script('infinite-scroll', get_template_directory_uri() . '/assets/js/infinite-scroll.js', ['jquery'], filemtime(get_template_directory() . '/assets/js/infinite-scroll.js'), true);

    // Ajout d'une variable JS globale pour AJAX
    $ajax_params = ['ajax_url' => admin_url('admin-ajax.php')];

    wp_localize_script('filters-js', 'theme_ajax', $ajax_params);
    wp_localize_script('infinite-scroll', 'theme_ajax', $ajax_params);
    wp_localize_script('theme-scripts', 'theme_ajax', $ajax_params);
}
add_action('wp_enqueue_scripts', 'mota_theme_enqueue_assets');

/**
 * ====================================
 * 2. ENREGISTREMENT DES MENUS DU THÈME
 * ====================================
 * Enregistre deux emplacements de menu dans le thème :
 * - "Menu Principal" pour le menu principal.
 * - "Menu Pied de Page" pour le footer.
 */
function mota_theme_setup() {
    register_nav_menus([
        'main_menu' => __('Menu Principal', 'mota-theme'),
        'footer_menu' => __('Menu Pied de Page', 'mota-theme'),
    ]);
}
add_action('after_setup_theme', 'mota_theme_setup');

/**
 * ====================================
 * 3. RÉCUPÉRATION DES MÉTADONNÉES PERSONNALISÉES
 * ====================================
 * Récupère tous les champs personnalisés d'un article.
 * Cette fonction est utilisée pour obtenir des données spécifiques.
 */
function mota_get_all_custom_fields($post_id) {
    if (!is_numeric($post_id)) {
        return [];
    }

    $fields = get_post_meta($post_id);
    $cleaned_fields = [];

    foreach ($fields as $key => $value) {
        $cleaned_fields[$key] = maybe_unserialize($value[0]);
    }

    return $cleaned_fields;
}

/**
 * ====================================
 * 4. AJAX : CHARGEMENT DES PHOTOS AVEC PAGINATION
 * ====================================
 * Charge plus d'articles pour le CPT "Photos" avec les filtres sélectionnés.
 */
function load_more_photos_ajax() {
    // Récupère les paramètres de la requête AJAX
    $paged = isset($_POST['page']) ? intval($_POST['page']) : 1;
    $posts_per_page = 8;
    $category = isset($_POST['category']) ? intval($_POST['category']) : 0;
    $format = isset($_POST['format']) ? intval($_POST['format']) : 0;

    // Préparation de la requête WP_Query
    $args = [
        'post_type' => 'photo',
        'posts_per_page' => $posts_per_page,
        'paged' => $paged,
        'orderby' => 'date',
        'order' => 'DESC',
    ];

    if ($category) {
        $args['tax_query'][] = [
            'taxonomy' => 'categorie',
            'field' => 'term_id',
            'terms' => $category,
        ];
    }

    if ($format) {
        $args['tax_query'][] = [
            'taxonomy' => 'format',
            'field' => 'term_id',
            'terms' => $format,
        ];
    }

    // Exécution de la requête
    $custom_query = new WP_Query($args);

    if ($custom_query->have_posts()) {
        ob_start(); // Capture la sortie
        while ($custom_query->have_posts()) {
            $custom_query->the_post();
            get_template_part('templates-parts/photo-bloc'); // Affiche chaque bloc
        }
        $html = ob_get_clean(); // Récupère le HTML généré
        wp_reset_postdata();

        wp_send_json_success(['html' => $html]);
    } else {
        wp_send_json_error(['message' => 'Aucun résultat trouvé.']);
    }

    wp_die(); // Terminer proprement la requête AJAX
}
add_action('wp_ajax_load_more_photos', 'load_more_photos_ajax');
add_action('wp_ajax_nopriv_load_more_photos', 'load_more_photos_ajax');

/**
 * ====================================
 * 5. AJAX : RÉCUPÉRER LES FILTRES DISPONIBLES
 * ====================================
 * Retourne la liste des catégories et formats disponibles.
 */
function get_filters_terms() {
    $categories = get_terms(['taxonomy' => 'categorie', 'hide_empty' => true]);
    $formats = get_terms(['taxonomy' => 'format', 'hide_empty' => true]);

    $response = [
        'categories' => [],
        'formats' => [],
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
add_action('wp_ajax_get_filters_terms', 'get_filters_terms');
add_action('wp_ajax_nopriv_get_filters_terms', 'get_filters_terms');

/**
 * ====================================
 * 6. AJAX : FILTRAGE DES PHOTOS
 * ====================================
 * Filtre les photos en fonction des critères (catégorie, format, ordre).
 */
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
            'field' => 'term_id',
            'terms' => $category,
        ];
    }

    if ($format) {
        $args['tax_query'][] = [
            'taxonomy' => 'format',
            'field' => 'term_id',
            'terms' => $format,
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
        die();
    } else {
        wp_send_json_error(['message' => 'Aucun résultat trouvé.']);
        die();
    }

    wp_die();
}
add_action('wp_ajax_filter_photos', 'filter_photos_ajax');
add_action('wp_ajax_nopriv_filter_photos', 'filter_photos_ajax');
