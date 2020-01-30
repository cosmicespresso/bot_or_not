import fetch from 'node-fetch';
import dialogflow from 'dialogflow';
const botAuth = JSON.parse(process.env.master_bot);

exports.handler = async (event) => {
  // "event" has information about the path, body, headers, etc. of the request
  const request = JSON.parse(event.body)
  const response = await botRequest(request);

  // The "callback" ends the execution of the function and returns a response back to the caller
  return {
    statusCode: 200,
    body: response
  }
}

//sets up session client to auth to all the projects
let sessionClient = new dialogflow.SessionsClient({
    projectId: '',
    credentials: {
      private_key: botAuth.private_key,
      client_email: botAuth.client_email
    }
});

async function botRequest(request) {
// change session client to be the correct project id (auth is the same across all projects)
  sessionClient.projectId = request.bot.projectId;
  const sessionPath = sessionClient.sessionPath(request.bot.projectId, request.bot.sessionId);

  const intentRequest = {
    session: sessionPath,
    queryInput: {
      text: {
        text: request.userString,
        languageCode: 'en-US',
      },
    },
  };

  const intentResponse = await sessionClient.detectIntent(intentRequest);
  const intentResult = intentResponse[0].queryResult;
  return intentResult.fulfillmentText;
}