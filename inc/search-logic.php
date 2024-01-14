<?php

add_action('rest_api_init', 'quotesRegisterSearch');

function quotesRegisterSearch()
{
    register_rest_route('quotes/v1', 'search', array(
        'methods' => WP_REST_SERVER::READABLE,
        'callback' => 'quotesSearchResults',
        'permission_callback' => function () {
            return true;
        }
    ));
}

function quotesSearchResults($data)
{
    $nonce = $data->get_header('X-WP-Nonce');

    if (!wp_verify_nonce($nonce, 'wp_rest')) {
        // Nonce is invalid; handle accordingly (e.g., return an error response)
        return new WP_Error('Authentication', 'Authentication failed!', array('status' => 403));
    }

    $mainQuery = new WP_Query(array(
        'post_type' => array('post', 'page', 'quote-author', 'famous-quote'),
        's' => sanitize_text_field($data['term']),
        'posts_per_page' => 10,
    ));

    $results = array(
        'generalInfo' => array(),
    );

    while ($mainQuery->have_posts()) {
        $mainQuery->the_post();

        $postType = ucwords(preg_replace("/[-]+/", " ", get_post_type()));

        array_push($results['generalInfo'], array(
            'title' => esc_html(get_the_title()),
            'permalink' => esc_url(get_the_permalink()),
            'postType' => esc_html($postType),
            'postTypeSlug' => esc_attr(get_post_type()),
        ));
    }

    return $results;
}
