<?php
    // Show all errors
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    // Get ENV variables
    require_once __DIR__ . '/load-env.php';
?>

<!DOCTYPE html>
<html>
<head>
    <title>Applications.me ❤️ GHL - Main</title>
    <link rel="icon" type="image/x-icon" href="images/heart.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <script src="js/custom.js"></script>
    <style>
        .textarea-no-resiize {
            resize: none;
        }
        #funnel-more-information-fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.8);
            display: flex; 
            justify-content: center;
            align-items: center;
        }
        #funnel-more-information-container {
            padding: 10px;
            border-radius: 10px;
            width: 80%;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            background-color: rgba(255, 255, 255, 1);
        }
    </style>
</head>
<body>

<div class="container">
    <h1>Applications.me ❤️ GHL</h1>
    <p>App ID: <b><?php echo $_ENV['APP_ID']; ?></b></p>
    <p>Client ID: <b><?php echo $_ENV['CLIENT_ID']; ?></b></p>
    <p>GHL Code: <b id="ghl-code"><?php echo $_GET['code'] ?? ''; ?></b></p>
    <p>Current Access Token: <textarea type="text" id="current-access-token" class="form-control textarea-no-resiize" disabled readonly></textarea></p>
    <p id="access-token-section">
        <button id="get-access-token-button" class="btn btn-primary">Get Access Token Using GHL Code</button>
    </p>
    <p id="refresh-access-token-section">
        <button id="refresh-access-token-button" class="btn btn-success">Refresh Access Token (Optional if access token has expired after 24 hours)</button>
    </p>
    <p id="others-section">
        <button id="get-campaigns-button" class="btn btn-info">Get Campaigns</button>
        <button id="get-forms-button" class="btn btn-warning">Get Forms</button>
        <button id="get-funnel-pages-button" class="btn btn-dark">Get Funnel Pages</button>
    </p>
    <div id="display-results"></div>
</div>

<div id="funnel-more-information-fullscreen">
    <div id="funnel-more-information-container">
        <h3 class="d-flex justify-content-between align-items-center">
            <span>More Information about <span id="more-information-funnel-name"></span></span>
            <button id="close-more-information-funnel-button" class="btn btn-danger btn-sm">Close</button>
        </h3>
        <div id="more-information-funnel-result"></div>
    </div>
</div>

</body>
</html>