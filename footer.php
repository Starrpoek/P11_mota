

<footer id="footer">
    
<?php get_template_part('templates-parts/contact-modal', 'contact'); ?>

<?php
 if ( has_nav_menu( 'footer_menu' ) ) : ?>
    <?php 
 wp_nav_menu ( array (
 'theme_location' => 'footer_menu' ,
 'menu_class' => 'footer-links',
 'container' => 'nav',
 ) ); ?>
    <p> Tous droits réservés </p>
    <?php endif;
 ?>
</footer>
<?php wp_footer(); ?>
</body>

</html>