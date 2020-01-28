import fetch from 'node-fetch';
import dialogflow from 'dialogflow';
const uuid = require('uuid');
let botJSON = JSON.parse(process.env.truth_bot_setting);

exports.handler = async (event) => {
    // "event" has information about the path, body, headers, etc. of the request
  const request = JSON.parse(event.body)
  console.log(request.bot.session_id)
  const response = await botRequest(request.botText, request.bot.session_id);
  // The "callback" ends the execution of the function and returns a response back to the caller
  return {
    statusCode: 200,
    body: response
  }
}

// Create a new session
const sessionClient = new dialogflow.SessionsClient({
    projectId: botJSON.project_id,
    credentials: {
      private_key: botJSON.private_key,
      client_email: botJSON.client_email
    }
});

async function botRequest(userString, sessionId) {
    // The text query request.
    // Send request and log result
  // The text query request.
  const sessionPath = sessionClient.sessionPath(botJSON.project_id, sessionId);

  const intentRequest = {
    session: sessionPath,
    queryInput: {
      text: {
        text: userString,
        languageCode: 'en-US',
      },
    },
  };

  const intentResponse = await sessionClient.detectIntent(intentRequest);
  const intentResult = intentResponse[0].queryResult;
  return intentResult.fulfillmentText;
}