import fetch from 'node-fetch';
import dialogflow from 'dialogflow';
const uuid = require('uuid');
let truthbotPrivateKey = (process.env.truthbot_private_key);
let truthbotClientEmail = process.env.truthbot_client_email;
let truthbotProjectId = process.env.truthbot_project_id;

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

// Create a new session
const sessionClient = new dialogflow.SessionsClient({
    projectId: truthbotProjectId,
    credentials: {
      private_key: truthbotPrivateKey,
      client_email: truthbotClientEmail
    }
});

const sessionPath = sessionClient.sessionPath(truthbotProjectId, sessionId);
console.log('sessionpath is', sessionClient);


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