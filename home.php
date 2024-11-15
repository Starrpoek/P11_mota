<?php get_header(); 
?>

<?php 
$random_image = get_posts(array(
    'post_type' => 'photo', 
    'posts_per_page' => 1, 
    'orderby' => 'rand', 
));

if ($random_image) {
    $post = $random_image[0];
    $thumbnail_id = get_post_thumbnail_id($post->ID);
    $thumbnail_url = wp_get_attachment_image_url($thumbnail_id, 'full'); 
}
?>

<div id="home" class="home-hero hero-background" style="background-image: url('<?php echo $thumbnail_url ?>');">
    <h1 class="home-hero__title">Photographe Event</h1>
</div>

<article class="homepage-photos">
    <div class="homepage-photos__content">
        <?php
        $args = array(
            'post_type' => 'photo',
            'posts_per_page' => 10,
            'orderby' => 'date',
            'order' => 'DESC',
        );

        $homepage_query = new WP_Query($args);

        if ($homepage_query->have_posts()) {
            while ($homepage_query->have_posts()) {
                $homepage_query->the_post();
                
                get_template_part('templates-parts/photo-bloc');
            }
            wp_reset_postdata();
        } else {
            echo "<p>Aucune photo trouvée.</p>";
        }
        ?>
    </div>
</article>


<?php get_footer(); 
?>
