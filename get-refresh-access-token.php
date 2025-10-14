<?php
    // Show errors
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    // Load environment variables
    require_once __DIR__ . '/load-env.php';

    // OAuth endpoint
    $tokenUrl = 'https://services.leadconnectorhq.com/oauth/token';

    // Read refresh token (passed via GET, POST, or stored value)
    $refresh_token = $_GET['refresh_token'] ?? $_POST['refresh_token'] ?? null;

    if (!$refresh_token) {
        echo json_encode(['error' => 'Missing refresh_token']);
        exit;
    }

    // Prepare the data
    $data = [
        'client_id' => $_ENV['CLIENT_ID'],
        'client_secret' => $_ENV['CLIENT_SECRET'],
        'grant_type' => 'refresh_token',
        'refresh_token' => $refresh_token
    ];

    // Use application/x-www-form-urlencoded
    $ch = curl_init($tokenUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data)); // <-- important
    $response = curl_exec($ch);
    $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    // Output
    header('Content-Type: application/json');
    if ($error) {
        echo json_encode(['error' => 'Request failed', 'details' => $error]);
    } else {
        echo json_encode([
            'status_code' => $status_code,
            'response' => json_decode($response, true)
        ]);
    }
?>
