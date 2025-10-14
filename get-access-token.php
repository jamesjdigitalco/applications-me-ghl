<?php
    // Show all errors
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);

    // Load .env variables
    require_once __DIR__ . '/load-env.php';

    // Token endpoint
    $tokenUrl = 'https://services.leadconnectorhq.com/oauth/token';

    // Make sure the code exists
    if (!isset($_GET['code'])) {
        die(json_encode(['error' => 'Missing authorization code']));
    }

    // Prepare data for POST
    $data = [
        'client_id' => $_ENV['CLIENT_ID'],
        'client_secret' => $_ENV['CLIENT_SECRET'],
        'grant_type' => 'authorization_code',
        'code' => $_GET['code'],
        'redirect_uri' => 'http://applications-me.iamcebu.local/get-access-token.php' // must match your registered URL exactly
    ];

    // Initialize cURL
    $ch = curl_init($tokenUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/x-www-form-urlencoded'
    ]);

    // Execute request
    $response = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        echo json_encode([
            'error' => 'cURL error: ' . curl_error($ch)
        ]);
        curl_close($ch);
        exit;
    }

    curl_close($ch);

    // Output the response
    header('Content-Type: application/json');
    if ($httpcode !== 200) {
        echo json_encode([
            'error' => 'Failed to fetch token',
            'status_code' => $httpcode,
            'response' => json_decode($response, true),
            'data_sent' => $data
        ], JSON_PRETTY_PRINT);
    } else {
        echo $response;
    }
?>