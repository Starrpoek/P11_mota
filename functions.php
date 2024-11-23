<?php

/**
 * ====================================
 * 1. ENQUEUE STYLES ET SCRIPTS
 * ====================================
 * Cette section charge les fichiers CSS et JS nécessaires au thème
 * et ajoute des variables globales pour les appels AJAX.
 */
function mota_enqueue_assets() {
    // CSS principal
    wp_enqueue_style(
        'mota-theme-style',
        get_stylesheet_uri(),
        [],
        filemtime(get_stylesheet_directory() . '/style.css')
    );

    // CSS pour la modale
    wp_enqueue_style(
        'contact-modal-style',
        get_template_directory_uri() . '/assets/css/contact-modal.css',
        [],
        filemtime(get_template_directory() . '/assets/css/contact-modal.css')
    );

    // CSS pour Select2 (bibliothèque utilisée pour les filtres)
    wp_enqueue_style(
        'select2-css',
        'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css'
    );

    // JS principal
    wp_enqueue_script('jquery'); // Chargement de jQuery
    wp_enqueue_script(
        'select2-js',
        'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js',
        ['jquery'], null, true
    );
    wp_enqueue_script(
        'filters-js',
        get_template_directory_uri() . '/assets/js/filters.js',
        ['jquery', 'select2-js'],
        filemtime(get_template_directory() . '/assets/js/filters.js'),
        true
    );
    wp_enqueue_script(
        'theme-scripts',
        get_template_directory_uri() . '/assets/js/scripts.js',
        ['jquery'],
        filemtime(get_template_directory() . '/assets/js/scripts.js'),
        true
    );
    function enqueue_custom_scripts() {
        // Enqueue ton script principal
        wp_enqueue_script(
            'navigation-overlay', // Handle unique
            get_template_directory_uri() . '/assets/js/navigation-overlay.js', // Chemin vers le fichier
            array('jquery'), // Dépendances (si nécessaire)
            '1.0.0', // Version
            true // Charger dans le footer
        );
    }

    // Variables globales pour AJAX
    wp_localize_script('filters-js', 'theme_ajax', [
        'ajax_url' => admin_url('admin-ajax.php'), // URL pour les appels AJAX
        'nonce' => wp_create_nonce('mota_nonce')   // Sécurité AJAX
    ]);
}
add_action('wp_enqueue_scripts', 'mota_enqueue_assets');
add_action('wp_enqueue_scripts', 'enqueue_custom_scripts');

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
 * AJAX : Charger plus d'articles
 * ====================================
 * Charge dynamiquement des articles supplémentaires pour le CPT "photo",
 * en tenant compte des filtres appliqués.
 */
function load_more_photos_ajax() {
    check_ajax_referer('mota_nonce', 'nonce'); // Vérification de sécurité AJAX

    $paged = isset($_POST['page']) ? intval($_POST['page']) : 1; // Page actuelle
    $category = isset($_POST['category']) ? intval($_POST['category']) : 0; // ID de catégorie
    $format = isset($_POST['format']) ? intval($_POST['format']) : 0; // ID de format
    $order = isset($_POST['order']) ? sanitize_text_field($_POST['order']) : 'DESC'; // Ordre de tri

    // Préparer les arguments de la requête WP_Query
    $args = [
        'post_type' => 'photo',
        'posts_per_page' => 8,
        'paged' => $paged,
        'orderby' => 'date',
        'order' => $order,
        'tax_query' => [], // Initialisation pour ajouter des filtres
    ];

    // Appliquer la catégorie si définie
    if ($category) {
        $args['tax_query'][] = [
            'taxonomy' => 'categorie',
            'field' => 'term_id',
            'terms' => $category,
        ];
    }

    // Appliquer le format si défini
    if ($format) {
        $args['tax_query'][] = [
            'taxonomy' => 'format',
            'field' => 'term_id',
            'terms' => $format,
        ];
    }

    // Exécuter la requête WP_Query
    $query = new WP_Query($args);

    if ($query->have_posts()) {
        ob_start();
        while ($query->have_posts()) {
            $query->the_post();
            get_template_part('templates-parts/photo-bloc'); // Chargement du template
        }
        $html = ob_get_clean();
        wp_reset_postdata();
        wp_send_json_success(['html' => $html]); // Retourner le HTML généré
    } else {
        wp_send_json_error(['message' => 'Aucun autre article disponible.']);
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

/**
 * ====================================
 * 7. DATA POUR NAV OVERLAY
 * ====================================
 * Récupère les informations pour utiliser les ID des articles.
 */
function enqueue_navigation_overlay_data() {
    // Récupération de tous les articles du CPT "Photos"
    $args = array(
        'post_type'      => 'photo',
        'posts_per_page' => -1, // Charger tous les articles
        'orderby'        => 'ID',
        'order'          => 'DESC',
    );

    $query = new WP_Query($args);
    $photos = array();

    if ($query->have_posts()) :
        while ($query->have_posts()) : $query->the_post();
            $photos[] = array(
                'id'    => get_the_ID(),
                'src'   => get_the_post_thumbnail_url(),
                'ref'   => get_field('reference_photo'),
                'cat'   => !empty(get_the_terms(get_the_ID(), 'categorie')) 
                    ? get_the_terms(get_the_ID(), 'categorie')[0]->name 
                    : '',
            );
        endwhile;
        wp_reset_postdata();
    endif;

    // Localiser les données dans une variable JS
    wp_localize_script('navigation-overlay', 'photoData', array(
        'photos' => $photos,
    ));
}
add_action('wp_enqueue_scripts', 'enqueue_navigation_overlay_data');
