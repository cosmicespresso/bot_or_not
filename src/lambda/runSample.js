import fetch from 'node-fetch';
import dialogflow from 'dialogflow';
const botAuth = JSON.parse(process.env.master_bot);

exports.handler = async (event) => {
  // "event" has information about the path, body, headers, etc. of the request
  const request = JSON.parse(event.body)
  const botResponse = await botRequest(request);
  const response = JSON.stringify(botResponse)

  // The "callback" ends the execution of the function and returns a response back to the caller
  return {
    'statusCode': 200,
    'body': response
  }
}

//sets up session client to auth to all the projects
//this can be accesses from other lambdas
export let sessionClient = new dialogflow.SessionsClient({
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

  try {
      const intentResponse =  await sessionClient.detectIntent(intentRequest);
      const intentResult = await intentResponse[0].queryResult;
      const botResponse = {
        'text': intentResult.fulfillmentText,
        'intent': intentResult.intent.displayName,
      }
      console.log(botResponse);
      return botResponse;
    }

    catch (err) {
        console.log("caught", err)
        return ''
    }
}