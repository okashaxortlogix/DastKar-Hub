<?php

return [
    /*
    |--------------------------------------------------------------------------
    | New Seller Discovery Boost Configuration
    |--------------------------------------------------------------------------
    |
    | Enables controlled, temporary exposure for newly approved artisans
    | so their handcrafted products are discovered by buyers without
    | overriding relevance or permanently displacing established sellers.
    |
    */
    'new_seller_boost' => [
        'enabled' => env('DISCOVERY_NEW_SELLER_BOOST_ENABLED', true),
        'duration_days' => (int) env('DISCOVERY_NEW_SELLER_BOOST_DAYS', 30), // 1st complete month
        'max_boost_score' => (float) env('DISCOVERY_NEW_SELLER_BOOST_MAX_SCORE', 0.20), // 20% discovery boost
        'decay_type' => env('DISCOVERY_NEW_SELLER_BOOST_DECAY', 'linear'), // linear decay if inconsistent
        'min_seller_status' => 'active',
        'allowed_verification_statuses' => ['basic', 'verified', 'established'],
        'consistency' => [
            'enabled' => true,
            'min_on_time_delivery_rate' => 90.0,
            'max_cancellation_rate' => 5.0,
            'require_in_stock_products' => true,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Seller Diversity / Listing Limits
    |--------------------------------------------------------------------------
    |
    | Prevents a single seller or guild from monopolizing search/discovery
    | listings by capping maximum consecutive products per seller.
    |
    */
    'max_products_per_seller' => (int) env('DISCOVERY_MAX_PRODUCTS_PER_SELLER', 3),

    /*
    |--------------------------------------------------------------------------
    | Freshness Window
    |--------------------------------------------------------------------------
    |
    | Number of days during which a newly created handcrafted product receives
    | an extra freshness boost signal.
    |
    */
    'freshness_window_days' => (int) env('DISCOVERY_FRESHNESS_WINDOW_DAYS', 30),

    /*
    |--------------------------------------------------------------------------
    | Cold-Start Neutral Defaults
    |--------------------------------------------------------------------------
    |
    | Default values assigned to new products or makers with zero history,
    | preventing lack of historical data from being penalized as bad performance.
    |
    */
    'cold_start' => [
        'neutral_rating_score' => 0.50,
        'neutral_engagement_score' => 0.40,
        'neutral_conversion_score' => 0.40,
        'min_review_sample_size' => 3,
        'prior_average_rating' => 4.50,
    ],

    /*
    |--------------------------------------------------------------------------
    | Ranking Signal Weights
    |--------------------------------------------------------------------------
    |
    | Transparent composite weights for scoring products. Total sums to 1.00.
    |
    */
    'weights' => [
        'relevance' => 0.30,
        'reviews' => 0.15,
        'quality' => 0.10,
        'engagement' => 0.10,
        'conversion' => 0.10,
        'seller_trust' => 0.10,
        'freshness' => 0.05,
        'availability' => 0.10,
    ],

    /*
    |--------------------------------------------------------------------------
    | Stock Availability Penalty
    |--------------------------------------------------------------------------
    |
    | Out-of-stock products receive severe discovery down-ranking.
    |
    */
    'out_of_stock_multiplier' => 0.10,
];
