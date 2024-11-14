<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package WordPress
 * @subpackage mota-theme
 * @since mota-theme 1.0
 */

get_header(); 
?>

<?php if( have_posts() ) : while( have_posts() ) : the_post(); ?>
    
	<h1><?php the_title(); ?></h1>

	<?php the_content(); ?>

<?php endwhile; endif; ?>

<?php
get_footer();
?>
