<?php
/**
 * Plugin Name: KwDig Markdown Paste
 * Description: Markdownを変換して貼り付け、空行を含むすべての改行をbrとして扱います。
 * Version: 1.0.3
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * License: GPL-2.0-or-later
 * Text Domain: markdown-paste-linebreaks
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function mplb_enqueue_editor() {
    $screen = get_current_screen();
    if ( ! $screen || 'post' !== $screen->base || ! current_user_can( 'edit_posts' ) ) { return; }
    $base = plugin_dir_url( __FILE__ );
    wp_enqueue_script( 'mplb-markdown-it', $base . 'assets/vendor/markdown-it.min.js', array(), '14.1.0', true );
    wp_enqueue_script( 'mplb-converter', $base . 'assets/converter.js', array( 'mplb-markdown-it' ), '1.0.3', true );
    wp_enqueue_script( 'mplb-editor', $base . 'assets/editor.js', array( 'mplb-converter', 'wp-blocks', 'wp-data' ), '1.0.3', true );
    wp_enqueue_style( 'mplb-editor', $base . 'assets/editor.css', array(), '1.0.3' );
}
add_action( 'admin_enqueue_scripts', 'mplb_enqueue_editor' );
function mplb_media_button( $editor_id ) {
    echo '<button type="button" class="button mplb-open" data-editor="' . esc_attr( $editor_id ) . '">Markdown貼り付け</button>';
}
add_action( 'media_buttons', 'mplb_media_button', 20 );
function mplb_block_assets() {
    wp_enqueue_script( 'mplb-block-menu', plugin_dir_url( __FILE__ ) . 'assets/block-menu.js', array( 'mplb-editor', 'wp-plugins', 'wp-edit-post', 'wp-element' ), '1.0.3', true );
}
add_action( 'enqueue_block_editor_assets', 'mplb_block_assets' );
