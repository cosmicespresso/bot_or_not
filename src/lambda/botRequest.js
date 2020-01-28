import fetch from 'node-fetch';
import dialogflow from 'dialogflow';
const uuid = require('uuid');
let botJSON = JSON.parse(process.env.truth_bot_setting);

exports.handler = async (event) => {
    // "event" has information about the path, body, headers, etc. of the request
  console.log('event', event)
  const response = await botRequest("hello");
  // The "callback" ends the execution of the function and returns a response back to the caller
  return {
    statusCode: 200,
    body: response
  }
}

const sessionId = uuid.v4();
console.log('session id is', sessionId)

// Create a new session
const sessionClient = new dialogflow.SessionsClient({
    projectId: botJSON.project_id,
    credentials: {
      private_key: botJSON.private_key,
      client_email: botJSON.client_email
    }
});

const sessionPath = sessionClient.sessionPath(botJSON.project_id, sessionId);

async function botRequest(userString) {
    // The text query request.
    // Send request and log result
  // The text query request.
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