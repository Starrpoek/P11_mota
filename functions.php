<?php

function mota_theme_enqueue_styles() {
    wp_enqueue_style( 'mota-theme-style', get_stylesheet_uri() );
}
function mota_theme_setup() {
    register_nav_menus( array(
        'main_menu' => __( 'Menu Principal', 'mota-theme' ),
    ) );
}

add_action( 'wp_enqueue_scripts', 'mota_theme_enqueue_styles' );
add_action( 'after_setup_theme', 'mota_theme_setup' );
?>