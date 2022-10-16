/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */


// ################################# COSNTANTES Y VARIALES ##########################################
// TODO(developer): Set to client ID and API key from the Developer Console
// // OJO personal credenciales
// const API_KEY = 'AIzaSyA2r4OT8tGX9FqurHLxIw9mMf4ZMMeHn1Y';
// const CLIENT_ID = '230506550343-2etbcce4dketmg53abs27mf7b3mdkvtu.apps.googleusercontent.com';

// OJO keoCedenciales
// const API_KEY = 'AIzaSyCIuWOfeqXGPTobKv_T3-zL1BUdEV83zIA';
// const CLIENT_ID = '557628586214-e18d5di67f9hhd6b838e79ebi42pej5k.apps.googleusercontent.com';

const API_KEY = 'AIzaSyAMQMbpD_e_KIgZaOdWjSt34H6tlQSc0XA';
const CLIENT_ID = '235361249422-m6ot9tcgs4844b1138uut1vps1thg6b3.apps.googleusercontent.com';


// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
// const DISCOVERY_DOC = 'https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events';

// let CALENDAR_ID;
// const date = new Date();
// const datetime = new DateTime();

// console.log("Date:", date);
// console.log("DateTime:", datetime);


let tokenClient;
let gapiInited = true;
let gisInited = true;


// ###############################################################################################################


















// ############################################ AUTENTIFICACIÓN #################################################
document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';

function authenticate() {
    return gapi.auth2.getAuthInstance()
    .signIn({ scope: SCOPES })
    .then(function () { console.log("Sign-in successful"); },
    function (err) { console.error("Error signing in", err); });
}
function loadClient() {
    gapi.client.setApiKey(API_KEY);
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
    .then(function () { console.log("GAPI client loaded for API"); },
    function (err) { console.error("Error loading GAPI client for API", err); });
}
// ##################################################################################################




/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        // cosole.log(resp);
        document.getElementById('signout_button').style.visibility = 'visible';
        document.getElementById('authorize_button').innerText = 'Refresh';
        //await listUpcomingEvents();
    };

    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    // console.log(token);
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('contentEvents').innerText = '';
        document.getElementById('contentCalendars').innerText = '';
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

// ###############################################################################################################












// ################################################# List Claendar ################################################

// Make sure the client is loaded and sign-in is complete before calling this method.
async function  executeListCalendar() {
    //return gapi.client.calendar.calendarList.list({
    let response;
    const request = {
        "maxResults": 10,
        "minAccessRole": "writer",
        "showDeleted": false,
        "showHidden": false
    };
    response = await gapi.client.calendar.calendarList.list(request)
    .then(function (response) {
        // Handle the results here (response.result has the parsed body).
        //console.log("Response Result", response.result);
        //console.log("Response Body", response.body);
        //console.log("Response", response);
        
        const responseJson = JSON.parse(response.body);
        //console.log("Response", responseJson);
                const calendars = responseJson.items;
                //console.log("Calendarios Json", calendars);
                //console.log("Items de calendarios: ",calendars.length);
                if (!calendars || calendars.length == 0) {
                    document.getElementById('contentCalendar').innerText = 'No Calendar found.';
                    //return;
                }
                // Flatten to string to display
                const output = calendars.reduce(
                    (str, calendar) =>
                        `${str}ID: ${calendar.id} Titulo=> ${calendar.summary} TimeZone=> ${calendar.timeZone}\n`,
                        'Calendars:\n');
                        //console.log(calendars);

                        document.getElementById('contentCalendars').innerText = output;
                    },
                    function (err) { console.error("Execute error", err); });
                    
                
}

// ###############################################################################################################













        

// #################################### List Event of Calendar ################################################

async function executeListEvents() { // busca todos los eventos en el calendario de calendarId
    let response;
    CALENDAR_ID = document.getElementById('calendarID').value;
    console.log(CALENDAR_ID)
    try {
        const request = {
            'calendarId': CALENDAR_ID,
            // 'timeMin': (new Date()).toISOString(), // induca desde donde comenzara la busqueda
            'showDeleted': false,
            'singleEvents': true,
            //'maxResults': 10,
            'orderBy': 'startTime',
            "alwaysIncludeEmail": true,
            "showHiddenInvitations": true,
            "prettyPrint": true,
            "alt": "json"                    
        };
        response = await gapi.client.calendar.events.list(request);
        
    } catch (err) {
        document.getElementById('contentEvents').innerText = err.message;
        console.log(err.message);
        return;
    }
    
    const events = response.result.items;
    if (!events || events.length == 0 || undefined) {
        document.getElementById('contentEvents').innerText = 'No events found.';
        return;
    }
    // Flatten to string to display
    const output = events.reduce(
        (str, event) => 
        `${str}ID: ${event.id} Summary=> ${event.summary} Start=> (${event.start.dateTime || event.start.date})  End=> (${event.end.dateTime || event.end.date})  Location=> ${event.location} \n`,
        'Events:\n');
        console.log(events);
        document.getElementById('contentEvents').innerText = output;
    }
    
// ###############################################################################################################





// #################################### Function for add time in hour ############################################

function addHoursToDate(objDate, intHours) {
    var numberOfMlSeconds = objDate.getTime();
    var addMlSeconds = (intHours * 60) * 60000;
    var newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
 
    return newDateObj.toISOString();
}
// ###############################################################################################################

// ##################################### Insert Event of Calendar ################################################

// Make sure the client is loaded and sign-in is complete before calling this method.
async function executeInsertEvent() {
    // let control = document.getElementById('calendarIdInsertEvent').value;
    // console.log(control)
    const date = new Date();
    console.log("Date:", );



    CALENDAR_ID = document.getElementById('calendarID').value;
    
    return gapi.client.calendar.events.insert( // json que se enviara a la api de google           
    {
        'calendarId': CALENDAR_ID,
        'resource': {
            'end': {
            'dateTime': addHoursToDate(date, 0.5),//date.toISOString(),
            'timeZone': 'UTC'
            },
            'start': {
                'dateTime': date.toISOString(),
                'timeZone': 'UTC'
            },
            'attendees': [
                {
                    'email': 'Jose2889@gmail.com'
                },
                {
                    'email': 'edgardoll4@gmail.com',
                    'comment': 'Gmail comment',
                    'displayName': 'edgardo gmail'
                },
                {
                    "email": "keopllaner@gmail.com"
                }
            ],
        'eventType': 'default',
        'summary': 'TEST DOCUMENTATION GOOGLE API CODE JACASCRIPT',
        'description': 'Prueba desde el codigo javascript documentation localhost',
        'guestsCanInviteOthers': false,
        'guestsCanSeeOtherGuests': false,
        'location': 'Caracas Venezuela',
        'status': 'confirmed'
        }
    })
    .then(async function (response) {
        // Handle the results here (response.result has the parsed body).
            console.log("Response", JSON.parse(response.body));
            await executeListEvents();
        },
        function (err) { console.error("Execute error", err); });
}
    
// ###############################################################################################################












// ######################Eliminar evento############################### 
async function executeDeleteEvent() {
    CALENDAR_ID = document.getElementById('calendarID').value;
    let control = document.getElementById('eventID').value;
    console.log(control)
    return gapi.client.calendar.events.delete({
    'calendarId': CALENDAR_ID,
    'eventId': control,
    'sendNotifications': true,
    'sendUpdates': 'none' // Values:  all none externalOnly
    })
    .then( async function(response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
        //document.getElementById('eventID').value = '';
        await executeListEvents();
    },
    function(err) { console.error("Execute error", err); });
}

// gapi.load("client:auth2", function() {
//     gapi.auth2.init({client_id: CLIENT_ID});
// })