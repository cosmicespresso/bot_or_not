import fetch from 'node-fetch';
import { sessionClient } from './runSample';
import { contextsClient } from './createContext';
import dialogflow from 'dialogflow';
const botAuth = JSON.parse(process.env.master_bot);

exports.handler = async (event) => {
	// "event" has information about the path, body, headers, etc. of the request
	const request = JSON.parse(event.body);
	const response = await deleteAllContexts(request);
	return{
		statusCode: 200,
		body: response
	}
}

async function deleteAllContexts(request){
	//set sessionclient for this project
	contextsClient.projectId = request.bot.projectId;
	sessionClient.projectId = request.bot.projectId;

	const sessionPath = sessionClient.sessionPath(request.bot.projectId, request.bot.sessionId);

	const deleteRequest = {
	    parent: sessionPath,
	  }
	try {
	  await contextsClient.deleteAllContexts(deleteRequest);
      return 'deleted contexts'
    }
    catch(e){
      return 'error deleting context'
    }
}