<?php

function mota_theme_enqueue_styles() {
    wp_enqueue_style( 'mota-theme-style', get_stylesheet_uri() );
    wp_enqueue_style('theme-style', get_stylesheet_uri());
    wp_enqueue_style( 'contact-modal-style', get_template_directory_uri() . '/assets/css/contact-modal.css', array(), null, 'all' );

    wp_enqueue_script('theme-scripts', get_template_directory_uri() . '/assets/js/scripts.js', array(), null, true);
}
function mota_theme_setup() {
    register_nav_menus( array(
        'main_menu' => __( 'Menu Principal', 'mota-theme' ),
    ) );
}

add_action( 'wp_enqueue_scripts', 'mota_theme_enqueue_styles' );
add_action( 'after_setup_theme', 'mota_theme_setup' );

?>