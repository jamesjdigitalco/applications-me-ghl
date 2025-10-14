let ghlCode = ''
let accessTokenResponse = null
let refreshAccessTokenResponse = null
let currentAccessToken = ''
let currentLocationId = ''

$(document).ready(function() {

    console.log("Custom JS loaded.")

    // Initialize the elements of the page
    showHideSection(false, 'access-token-section')
    showHideSection(false, 'refresh-access-token-section')
    showHideSection(false, 'campaigns-section')

    // Get the GHL Code
    ghlCode = $.trim($('#ghl-code').text())

    // Determine if to show "Get Access Token" button
    if (ghlCode.length > 0) {
        // Show the Get Access Token button when there is a GHL code
        showHideSection(true, 'access-token-section')
    }

    // When Get Access Token button is clicked    
    $('#get-access-token-button').click(function() {
        getAccessToken()
    })

    // When Refresh Access Token button is clicked
    $('#refresh-access-token-button').click(function() {
        getRefreshAccessToken()
    })

    // When Get Campaigns button is clicked
    $('#get-campaigns-button').click(function() {
        getCampaigns()
    })
})

/**
 * Hide or show the a section
 * @param {boolean} show - true to show, false to hide
 * @param {string} sectionId - the elementID of the section to show/hide
 * @returns void
 */
showHideSection = (show, sectionId) => {
    if (show) {
        $(`#${sectionId}`).show()
    } else {
        $(`#${sectionId}`).hide()
    }
}

/**
 * Get Access Token from GHL using the GHL code
 * @returns void
 */
function getAccessToken() {
    if (ghlCode.length === 0) {
        console.error('No GHL code available. Cannot get access token.')
        return
    }
    $.ajax({
        url: "/get-access-token.php",
        type: "GET",
        data: { code: ghlCode },
        success: function(response) {
            accessTokenResponse = response
            console.log(accessTokenResponse)
            if (accessTokenResponse.access_token) {
                currentAccessToken = accessTokenResponse.access_token
                currentLocationId = accessTokenResponse.locationId
                // Show the refresh access token section when there is an access token
                showHideSection(true, 'refresh-access-token-section')
                // Show the campaigns section when there is an access token
                showHideSection(true, 'campaigns-section')
            }
        }, finally: function() {
            console.log('Request for getting access token has been completed')
        }
    })
}

/**
 * Get a new access token using the refresh token
 * @returns void
 */
function getRefreshAccessToken() {
    if (!accessTokenResponse || !accessTokenResponse.refresh_token) {
        console.error('No refresh token available. Cannot refresh access token.')
        return
    }
    $.ajax({
        url: 'get-refresh-access-token.php',
        type: 'POST',
        data: { refresh_token: accessTokenResponse.refresh_token },
        dataType: 'json',
        success: function(response) {
            refreshAccessTokenResponse = response
            if (refreshAccessTokenResponse.response && refreshAccessTokenResponse.response.access_token) {
                currentAccessToken = refreshAccessTokenResponse.response.access_token
                currentLocationId = refreshAccessTokenResponse.response.locationId
                console.log(refreshAccessTokenResponse.response)
                // Show the campaigns section when there is a refreshed access token
                showHideSection(true, 'campaigns-section')
            } else {
                // Hide the campaigns section if getting refresh token fails
                showHideSection(false, 'campaigns-section')
                console.error('⚠️ Refresh failed:', response)
            }
        },
        error: function(xhr, status, error) {
            // Hide the campaigns section if getting refresh token fails
            showHideSection(false, 'campaigns-section')
            console.error('❌ Error:', error)
        }, finally: function() {
            console.log('Request for getting refresh access token has been completed')
        }
    })
}

/**
 * Gets all the campaigns
 * @returns void
 */
function getCampaigns() {
    if (currentAccessToken.length === 0) {
        console.error('No access token available. Cannot get campaigns.')
        return
    }
    $.ajax({
        url: 'get-campaigns.php',
        type: 'POST',
        data: {
            access_token: currentAccessToken,
            location_id: currentLocationId
        },
        success: function(response) {
            console.log('API response:', response)
            if (response.campaigns) {
                // Example: log each campaign name
                response.campaigns.forEach(c => console.log(c.name))
            } else if (response.error) {
                console.error('Error:', response.error)
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error:', error)
        }
    })
}