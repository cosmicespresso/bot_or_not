import fetch from 'node-fetch';
import dialogflow from 'dialogflow';
const uuid = require('uuid');
const bots = [JSON.parse(process.env.truth_bot_setting), JSON.parse(process.env.truth_bot_answering)];

exports.handler = async (event) => {
    // "event" has information about the path, body, headers, etc. of the request
  const request = JSON.parse(event.body)
  console.log(request)
  //find out which bot they want to talk to
  const bot = bots.filter(function (key, val){ 
    return key.name === request.bot.name})[0]

  const response = await botRequest(request, bot);
  // The "callback" ends the execution of the function and returns a response back to the caller
  return {
    statusCode: 200,
    body: response
  }
}

async function botRequest(request, bot) {
    // The text query request.
    // Send request and log result
  // The text query request.
// Create a new session
  const sessionClient = new dialogflow.SessionsClient({
      projectId: bot.project_id,
      credentials: {
        private_key: bot.private_key,
        client_email: bot.client_email
      }
  });

  const sessionPath = sessionClient.sessionPath(bot.project_id, request.bot.sessionId);

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