<?php

/**
 * Plugin Name: Custom Ajax Search
 * Description: Ajax search for WordPress
 * Version: 1.0
 * Author: Arischvaran Puvanesvaran
 **/

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class CustomAjaxSearch
{
    function __construct()
    {
        add_action('init', array($this, 'custom_ajax_search_init'));
    }

    // Enqueue scripts and styles
    function custom_ajax_search_init()
    {
        if (!is_admin()) {
            // styles
            wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
            wp_enqueue_style('custom-ajax-search', plugin_dir_url(__FILE__) . 'build/style-index.css', array(), '1.0', 'all');
            wp_enqueue_style('custom-ajax-search', plugin_dir_url(__FILE__) . 'build/index.css', array(), '1.0', 'all');
            // scripts
            wp_enqueue_script('jquery');
            wp_enqueue_script('custom-ajax-search', plugin_dir_url(__FILE__) . 'build/index.js', array('jquery'), '1.0', true);
            wp_localize_script('custom-ajax-search', 'searchData', array(
                'root_url' => esc_url_raw(get_site_url()),
                'nonce' => wp_create_nonce('wp_rest'),
            ));
        }
    }
}

$customAjaxSearch = new CustomAjaxSearch();

// Ajax search
include('inc/search-logic.php');
