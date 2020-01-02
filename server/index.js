const dialogflow = require('dialogflow');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());
app.use(pino);

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.post('/api/botRequest', async (req, res) => {
  console.log("bot text is", req.body);
  const response = await runSample(req.body.botText);
  console.log(response);
  res.send(
    response,
  );
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);


// A unique identifier for the given session
const sessionId = uuid.v4();
const projectId = 'g191120-truth-bot-hluhsq'


// Create a new session
const sessionClient = new dialogflow.SessionsClient({
    keyFilename: 'src/keys/truthbot.json'
});

const contextsClient = new dialogflow.ContextsClient({
    keyFilename: 'src/keys/truthbot.json'
});

const sessionPath = sessionClient.sessionPath(projectId, sessionId);

async function chooseTruth() {
  const deleteRequest = {
    parent: sessionPath,
  }

  //delete all existing contexts
  await contextsClient.deleteAllContexts(deleteRequest);

  let truth = truths[Math.floor(Math.random()*truths.length)];

  const contextId = truth.context;

  //path for contexts
  const contextPath = contextsClient.contextPath(
    projectId,
    sessionId,
    contextId
  );

  // The context query request.
  const createContextRequest = {
    parent: sessionPath,
    context: {
          name: contextPath,
          lifespanCount: 5,
    },
  };

    //create a new context
  const createdContext = await contextsClient.createContext(createContextRequest);

  console.log(truth.truth)
}

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(userString) {

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

  const contextRequest = {
    parent: sessionPath,
  }

  // Send request and log result
  const intentResponse = await sessionClient.detectIntent(intentRequest);
  const [contextResponse] = await contextsClient.listContexts(contextRequest);
  const intentResult = intentResponse[0].queryResult;
  if(contextResponse !== undefined && contextResponse.length !== 0){
    var name = contextResponse[0].name.split("/").slice(-1)[0];
  }
  
  console.log(`bot says: ${intentResult.fulfillmentText} (with intent ${intentResult.intent.displayName} ${name ? 'and context '+name : ''})`);

  return intentResult.fulfillmentText;

}

// function handleInput(request){
// 	console.log("handling", request)
// }
