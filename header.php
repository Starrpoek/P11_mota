<!doctype html>
<html <?php language_attributes(); ?> >
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="keywords" content="photographe, nathalie mota, photo" />
    <meta name="description" content="Site de Nathalie Mota, photographe événementiel." />

    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>  

    <header id="header">
        <div class="container-header">
            <a href="<?php echo esc_url(home_url('/')); ?>" aria-label="Page d'accueil">
                <img src="<?php echo get_template_directory_uri(); ?>/assets/img/logo/logo-nathalie-mota.jpg" alt="Logo de Nathalie Mota">
            </a>
            <nav id="navigation">
                <?php
                wp_nav_menu( array(
                    'theme_location' => 'main_menu',
                    'menu_class' => 'menu',
                    'container' => false,
                ) );
                ?>
            </nav>
        </div>
    </header>
