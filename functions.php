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

/* Function pour afficher plus d'article avec AJAX */
function load_more_photos_ajax() {
    $paged = isset($_POST['page']) ? $_POST['page'] : 1;
    $posts_per_page = 10;
    $total_posts = 16;
    $offset = ($paged - 1) * $posts_per_page;

    $args = array(
        'post_type' => 'photo',
        'posts_per_page' => $posts_per_page,
        'paged' => $paged,
        'orderby' => 'date',
        'order' => 'DESC',
    );

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

add_action('wp_ajax_load_more_photos', 'load_more_photos_ajax');
add_action('wp_ajax_nopriv_load_more_photos', 'load_more_photos_ajax');

add_action( 'wp_enqueue_scripts', 'mota_theme_enqueue_styles' );
add_action( 'after_setup_theme', 'mota_theme_setup' );
?>
