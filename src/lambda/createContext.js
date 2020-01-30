import fetch from 'node-fetch';
import dialogflow from 'dialogflow';
const botAuth = JSON.parse(process.env.master_bot);

exports.handler = async (event) => {
  // "event" has information about the path, body, headers, etc. of the request
  const context = JSON.parse(event.body).context;
  console.log("creating context", context);
  return {
    statusCode: 200,
    body: "set context"
  }
}