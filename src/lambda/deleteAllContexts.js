import fetch from 'node-fetch';
import { sessionClient } from './runSample';
import { contextsClient } from './createContext';
import dialogflow from 'dialogflow';
const botAuth = JSON.parse(process.env.master_bot);

exports.handler = async (event) => {
	// "event" has information about the path, body, headers, etc. of the request
	const request = JSON.parse(event.body);
	await deleteAllContexts(request);
	return{
		statusCode: 200,
		body: "deleted all contexts"
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

	await contextsClient.deleteAllContexts(deleteRequest);
}