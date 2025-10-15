<?php
    // Show errors
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);

    // Load environment variables
    require_once __DIR__ . '/load-env.php';

    header('Content-Type: application/json');

    // Check for access_token and location_id
    if (empty($_POST['access_token'])) {
        echo json_encode(['error' => 'Access token missing']);
        exit;
    }

    if (empty($_POST['location_id'])) {
        echo json_encode(['error' => 'Location ID missing']);
        exit;
    }

    $access_token = $_POST['access_token'];
    $location_id  = $_POST['location_id'];

    // Endpoint for funnel pages
    $url = "https://services.leadconnectorhq.com/funnels/funnel/list/?locationId=" . urlencode($location_id);

    // Initialize cURL
    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer $access_token",
            "Accept: application/json",
            "Version: 2021-07-28"
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);
    curl_close($curl);

    // Return response
    if ($err) {
        echo json_encode([
            'error' => 'cURL Error',
            'details' => $err
        ]);
    } else {
        echo $response;
    }
?>