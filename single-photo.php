<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package WordPress
 * @subpackage mota-theme
 */

get_header() ?>

<?php 
	$refPhoto = get_field("reference_photo");
	$post = get_the_ID();
	$category = get_the_terms( $post, "categorie");
	$categoryPhoto = $category [0]-> name;
	$typePhoto = get_field ("type");
	$format = get_the_terms ($post , "format");
	$formatPhoto = $format [0]-> name;
	$datePhoto = get_the_date("Y");
	$url = get_permalink();
	$id = get_the_ID();	

?>
<section class="single-photo__page">
	<article class="single-photo__page-details">
		<div class="bloc-details">
			<div class="bloc-details__category-scf">
				<h2><?php echo the_title() ?></h2>
				<p id="ref" class="category-scf">Référence : <span><?php echo $refPhoto ?></span></p>
				<p class="category-scf">Catégorie : <span><?php echo $categoryPhoto ?></span></p>
				<p class="category-scf">Format : <span><?php echo $formatPhoto ?></span></p>
				<p class="category-scf">Type : <span><?php echo $typePhoto ?></span></p>
				<p class="category-scf">Année : <span><?php echo $datePhoto ?></span></p>
			</div>
		    <div class="bloc-details__picture">
                <div class="picture__custom-post">
			        <img class="custom-post" src="<?php echo get_the_post_thumbnail_url(); ?>"alt="photo" >
                </div>
		    </div>
        </div>	
	    <div class="bloc-contact">
            <div class="bloc-contact__form">
			        <p class="form__text-contact">Cette photo vous intéresse ?</p>
			        <button id="openPhotoModal" class="form__button-contact link-modal" data-reference="<?= $refPhoto ?>">Contact</button>
            </div> 
            <div class="bloc-contact__thumbnails-nav">
                <div class="thumbnails-nav">
                    <?php 
                        $previous_post = get_previous_post();
                        $next_post = get_next_post();

                        if (!empty($previous_post)) {
                                $previous_thumbnail = get_the_post_thumbnail($previous_post, 'thumbnail', array('class' => 'previous-thumbnail'));
                                if (!empty($previous_thumbnail)) {
                                    echo $previous_thumbnail;
                                }
                        }

                        if (!empty($next_post)) { 
                                $next_thumbnail = get_the_post_thumbnail($next_post, 'thumbnail', array('class' => 'next-thumbnail'));
                                if (!empty($next_thumbnail)) {
                                    echo $next_thumbnail;
                                }
                        }
                    ?>
                </div>
                <div class="thumbnails-nav__arrows">
                    <?php 
                    if (!empty($previous_post)) {
                        echo '<a href="' . get_permalink($previous_post) . '" class="nav-icon-link previous-icon-link">' .
                        '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="8" viewBox="0 0 26 8" fill="none">' .
                        '<path d="M0.646447 3.64645C0.451184 3.84171 0.451184 4.15829 0.646447 4.35355L3.82843 7.53553C4.02369 7.7308 4.34027 7.7308 4.53553 7.53553C4.7308 7.34027 4.7308 7.02369 4.53553 6.82843L1.70711 4L4.53553 1.17157C4.7308 0.976311 4.7308 0.659728 4.53553 0.464466C4.34027 0.269204 4.02369 0.269204 3.82843 0.464466L0.646447 3.64645ZM1 4.5H26V3.5H1V4.5Z" fill="black"/>' .
                        '</svg></a>';
                    }
                    if (!empty($next_post)) { 
                        echo '<a href="' . get_permalink($next_post) . '" class="nav-icon-link next-icon-link">' .
                        '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="8" viewBox="0 0 26 8" fill="none">' .
                        '<path d="M25.3536 3.64645C25.5488 3.84171 25.5488 4.15829 25.3536 4.35355L22.1716 7.53553C21.9763 7.7308 21.6597 7.7308 21.4645 7.53553C21.2692 7.34027 21.2692 7.02369 21.4645 6.82843L24.2929 4L21.4645 1.17157C21.2692 0.976311 21.2692 0.659728 21.4645 0.464466C21.6597 0.269204 21.9763 0.269204 22.1716 0.464466L25.3536 3.64645ZM25 4.5H0V3.5H25V4.5Z" fill="black"/>                        ' .
                        '</svg></a>';
                    }
                    ?>
                </div>
            </div>
        </div>	
    </article>
    <article class="single-photo__page-more">
        <h3 class="page-more__title"> Vous aimerez aussi </h3>
        <div class="page-more__content">
            <?php
            $current_post_id = get_the_ID();

            $categories = get_the_terms($current_post_id, 'categorie');
            if (!empty($categories) && !is_wp_error($categories)) {
                $category = reset($categories);
                $category_name = esc_html($category->slug);
                $args = array(
                    'post_type' => 'photo',
                    'posts_per_page' => 2,
                    'tax_query' => array(
                        array(
                            'taxonomy' => 'categorie',
                            'field'    => 'slug',
                            'terms'    => $category_name,
                        ),
                    ),
                    'post__not_in' => array($current_post_id),
                    'orderby' => 'rand',
                );
                $custom_query = new WP_Query($args);

                if ($custom_query->have_posts()) {
                    while ($custom_query->have_posts()) {
                        $custom_query->the_post();
                        get_template_part('templates-parts/photo-bloc');
                    }
                    wp_reset_postdata();
                } else {
                    echo "<p>Aucune autre photo trouvée dans cette catégorie.</p>";
                }
            } else {
                echo "<p>Aucune catégorie associée à cette photo.</p>";
            }
            ?>
        </div>
    </article>
</section>




<?php get_footer()?>
