<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Security Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains security-related configuration options for the
    | application including rate limiting, password policies, and more.
    |
    */

    'rate_limiting' => [
        'login' => [
            'max_attempts' => 5,
            'decay_minutes' => 5,
        ],
        'api' => [
            'max_attempts' => 60,
            'decay_minutes' => 1,
        ],
        'password_reset' => [
            'max_attempts' => 3,
            'decay_minutes' => 15,
        ],
    ],

    'password_policy' => [
        'min_length' => 8,
        'require_uppercase' => true,
        'require_lowercase' => true,
        'require_numbers' => true,
        'require_symbols' => false,
        'max_age_days' => 90,
        'history_count' => 5,
    ],

    'session' => [
        'lifetime' => 120, // minutes
        'secure' => env('SESSION_SECURE_COOKIE', false),
        'http_only' => true,
        'same_site' => 'lax',
    ],

    'csrf' => [
        'enabled' => true,
        'excluded_routes' => [
            'api/*',
        ],
    ],

    'input_validation' => [
        'sanitize_strings' => true,
        'max_string_length' => 1000,
        'allowed_html_tags' => [],
        'blocked_patterns' => [
            '/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/mi',
            '/javascript:/i',
            '/vbscript:/i',
            '/onload\s*=/i',
            '/onerror\s*=/i',
        ],
    ],

    'file_upload' => [
        'max_size' => 10240, // KB
        'allowed_types' => ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
        'scan_for_viruses' => false, // Enable if antivirus scanning is available
    ],

    'logging' => [
        'log_failed_logins' => true,
        'log_password_changes' => true,
        'log_sensitive_operations' => true,
        'retention_days' => 90,
    ],

    'headers' => [
        'x_frame_options' => 'DENY',
        'x_content_type_options' => 'nosniff',
        'x_xss_protection' => '1; mode=block',
        'strict_transport_security' => 'max-age=31536000; includeSubDomains',
        'content_security_policy' => "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
    ],
];
