/**
   * Sample JavaScript code for calendar.events.insert
   * See instructions for running APIs Explorer code samples locally:
   * https://developers.google.com/explorer-help/code-samples#javascript
   */

  function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }
  function loadClient() {
    gapi.client.setApiKey("YOUR_API_KEY");
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  function execute() {
    return gapi.client.calendar.events.insert({
      "calendarId": "CALENDAR_ID",
      "resource": {
        "end": {
          "timeZone": "",
          "dateTime": ""
        },
        "start": {
          "dateTime": "",
          "timeZone": ""
        },
        "attachments": [
          {
            "title": ""
          }
        ],
        "attendees": [
          {
            "email": "",
            "displayName": "",
            "comment": ""
          },
          {
            "email": "",
            "displayName": "",
            "comment": ""
          }
        ],
        "creator": {
          "email": "",
          "displayName": ""
        },
        "location": "",
        "description": "",
        "summary": "",
        "status": "",
        "reminders": {
          "overrides": [
            {
              "method": "",
              "minutes": 0
            },
            {
              "method": "",
              "minutes": 0
            }
          ],
          "useDefault": false
        },
        "htmlLink": ""
      }
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }
  gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "YOUR_CLIENT_ID"});
  });