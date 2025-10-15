let ghlCode = ''
let accessTokenResponse = null
let refreshAccessTokenResponse = null
let currentAccessToken = ''
let currentLocationId = ''
const loadingElement = `<div class="text-center"><img src="images/loading.webp" /></div>`

$(document).ready(function() {

    console.log("Custom JS loaded.")

    // Initialize the elements of the page
    showHideSection(false, 'access-token-section')
    showHideSection(false, 'refresh-access-token-section')
    showHideSection(false, 'others-section')

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

    // When Get Forms button is clicked
    $('#get-forms-button').click(function() {
        getForms()
    })

    // When Get Funnel Pages button is clicked
    $('#get-funnel-pages-button').click(function() {
        getFunnelPages()
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
                $('#current-access-token').val(currentAccessToken)
                currentLocationId = accessTokenResponse.locationId
                // Show the refresh access token section when there is an access token
                showHideSection(true, 'refresh-access-token-section')
                // Show the campaigns section when there is an access token
                showHideSection(true, 'others-section')
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
                $('#current-access-token').val(currentAccessToken)
                currentLocationId = refreshAccessTokenResponse.response.locationId
                console.log(refreshAccessTokenResponse.response)
                // Show the campaigns section when there is a refreshed access token
                showHideSection(true, 'others-section')
            } else {
                // Hide the campaigns section if getting refresh token fails
                showHideSection(false, 'others-section')
                console.error('⚠️ Refresh failed:', response)
            }
        },
        error: function(xhr, status, error) {
            // Hide the campaigns section if getting refresh token fails
            showHideSection(false, 'others-section')
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
    $('#display-results').html(loadingElement)
    $.ajax({
        url: 'get-campaigns.php',
        type: 'POST',
        data: {
            access_token: currentAccessToken,
            location_id: currentLocationId
        },
        success: function(response) {
            console.log(response)
            if (response.campaigns) {
                let tempHtml = `<h3>Campaigns</h3>`
                tempHtml += `<table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Campaign Name</th>
                            <th>Location ID</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                <tbody>`
                // Example: log each campaign name
                response.campaigns.forEach(c => {
                    tempHtml += `<tr>
                        <td>${c.id}</td>
                        <td>${c.name}</td>
                        <td>${c.locationId}</td>
                        <td>${c.status}</td>
                    </tr>`
                })
                tempHtml += `</tbody></table>`
                $('#display-results').html(tempHtml)
            } else if (response.error) {
                console.error('Error:', response.error)
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error:', error)
        }
    })
}

/**
 * Gets all the forms
 * @returns void
 */
function getForms() {
    if (currentAccessToken.length === 0) {
        console.error('No access token available. Cannot get campaigns.')
        return
    }
    $('#display-results').html(loadingElement)
    $.ajax({
        url: 'get-forms.php',
        type: 'POST',
        data: {
            access_token: currentAccessToken,
            location_id: currentLocationId
        },
        success: function(response) {
            console.log(response)
            if (response.forms) {
                let tempHtml = `<h3>Forms</h3>`
                tempHtml += `<table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Form Name</th>
                            <th>Location ID</th>
                        </tr>
                    </thead>
                <tbody>`
                // Example: log each campaign name
                response.forms.forEach(c => {
                    tempHtml += `<tr>
                        <td>${c.id}</td>
                        <td>${c.name}</td>
                        <td>${c.locationId}</td>
                    </tr>`
                })
                tempHtml += `</tbody></table>`
                $('#display-results').html(tempHtml)
            } else if (response.error) {
                console.error('Error:', response.error)
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error:', error)
        }
    })
}

/**
 * Gets all the funnel pages
 * @returns void
 */
function getFunnelPages() {
    if (currentAccessToken.length === 0) {
        console.error('No access token available. Cannot get campaigns.')
        return
    }
    $('#display-results').html(loadingElement)
    $.ajax({
        url: 'get-funnel-pages.php',
        type: 'POST',
        data: {
            access_token: currentAccessToken,
            location_id: currentLocationId
        },
        success: function(response) {
            console.log(response)
            if (response.funnels) {
                let tempHtml = `<h3>Funnel Pages</h3>`
                tempHtml += `<table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Funnel Name</th>
                            <th>URL</th>
                            <th>Deleted</th>
                            <th>Date Added</th>
                            <th></th>
                        </tr>
                    </thead>
                <tbody>`
                // Example: log each campaign name
                response.funnels.forEach(c => {
                    tempHtml += `<tr>
                        <td>${c.name}</td>
                        <td>${c.url}</td>
                        <td>${c.deleted}</td>
                        <td>${c.dateAdded}</td>
                        <td><button onClick="moreInformationOnFunnel('${c._id}')" type="button" class="btn btn-secondary btn-sm">More Information</button></td>
                    </tr>`
                })
                tempHtml += `</tbody></table>`
                $('#display-results').html(tempHtml)
            } else if (response.error) {
                console.error('Error:', response.error)
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error:', error)
        }
    })
}

/**
 * Displays more information about a funnel
 * @param {string} funnelId 
 */
function moreInformationOnFunnel(funnelId) {
    if (currentAccessToken.length === 0) {
        console.error('No access token available. Cannot get campaigns.')
        return
    }
    $.ajax({
        url: 'get-funnel-information.php',
        type: 'POST',
        data: {
            access_token: currentAccessToken,
            location_id: currentLocationId,
            funnel_id: funnelId
        },
        success: function(response) {
            console.log(response)
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error:', error)
        }
    })
}