import natural from 'natural';
import compendium from 'compendium-js';

import { genericParser } from './lib/genericParser.js';
import { truthChallengeParser } from './lib/truthChallengeParser.js';

//context specific libs
import { truths } from './lib/truths.js';
import { notQuestion } from './lib/notQuestion.js';
import { repetition } from './lib/repetition.js';
import { genericResponse } from './lib/genericResponse.js';

//set up question answering for truth challenge
let askedQuestion = false;
let botBuffer = [];

/**
* A function that sends a processed string to the bot
* and returns a response
*/
export const runSample = async (sample, bot) => {
  let response;
  try{
    response = await fetch(".netlify/functions/runSample", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userString: sample,
        bot: bot }),
      })

    if(response.status === 200){
        return response.text();
    }
    else{
        return handleError();
    }
  }
  catch(e){
    console.log('caught an error', e)
    return handleError();
  }
}

/**
* A function that wipes current contexts,
* used to help the bot change the topic
*/
async function deleteAllContexts(bot) {
  const response = await fetch(".netlify/functions/deleteAllContexts", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      bot: bot })
  })
}

/**
* A function that lists the current contexts
* to better diagnose bot snafus.
* used in debugging, not in production
*/
async function listContexts(bot) {
  const response = await fetch(".netlify/functions/listContexts", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      bot: bot })
  })

  console.log(response);
}

/**
* A function that creates a new context from the bot end.
* we use this when the bot starts a new conversation from the
* server side, rather than dialogflow: it allows us to pick
* responses at random then define what the conversation is
* going to be about
*/
async function createContext(context, lifespan, bot) {
  const response = await fetch(".netlify/functions/createContext", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      contextId: context, 
      lifespan: lifespan,
      bot: bot })
  })
}

/**
* A function that handles server errors and sends a generic response
* this can be invoked in a bunch of different places, but normally runs
* when dialogflow doesn't respond, or we get a blank messahge
*/
export const handleError = () => {
  let output = genericResponse[Math.floor(Math.random()*genericResponse.length)];

  //remove the element so not repeating ourselves
  const index = genericResponse.indexOf(output);
  if (index > 0) {
    genericResponse.splice(index, 1);
  }

  return output.response;
}

/**
* A function that chooses a truth challenge for the player
*/
export const chooseTruth = async (bot) => {
  await deleteAllContexts(bot);
  let truth = getResponse(truths, bot)

  return truth.response;
}

/**
* A function that replaces words in a sentence with random selection from
* an array of options. Kind of abstract in itself, used for responses with a
* particularly structured syntax
*/
async function replacementGrammar(options, sentences){
  let sentence = sentences[Math.floor(Math.random()*sentences.length)].response;
  const matches = (sentence.match(/\$/g) || []).length;
  for(let i=0; i<matches; i++) {
    const optIndex = Math.floor(Math.random()*options.length);
    sentence = sentence.replace(/\$/, options[optIndex]);
    options.splice(optIndex, 1);
  }
  return sentence;
}

/**
* A function that turns a 'you' phrase into an 'I' phrase
*/
function toFirstPerson(sent) {
  sent = sent.replace("your", "my");
  sent = sent.replace("you", "I");
  sent = sent.replace("yourself", "myself");

  return sent;
}

/**
* A function that gets a response from an array of responses, and sets
* an associated context
*/
function getResponse(responseArr, bot) {
  let response = responseArr[Math.floor(Math.random()*responseArr.length)];

  //remove the element so not repeating ourselves
  const index = responseArr.indexOf(response);
  if (index > 0) {
    responseArr.splice(index, 1);
  }

  if(response.context){
    createContext(response.context, 5, bot);
  }

  return response;
}

/**
* A fuzzy-matching function to detect variants of the same phrase
*/
function levenshteinVariants(sent, variants) {
  let subSent;

  variants.forEach( variant => {
    if(natural.LevenshteinDistance(variant, sent, {search: true}).distance < 3){
      subSent = sent.replace(natural.LevenshteinDistance(variant, sent, {search: true}).substring, '').trim();
    }
  })

  return subSent;
}

/**
* A parser specific to 'truth challenges' from the user
*/
async function parseTruthChallenge(sent, bot) {
  //parse out obvious challenge syntax
  for ( const type of truthChallengeParser ) {
    let subSent = levenshteinVariants(sent, type.usertext)

    if(subSent) {
      var options = subSent.split(' or ');
      options = options.map(function(str) {return str = toFirstPerson(str.replace(/\?+/g, ""));});

      if(options.length > 1){
        const response = replacementGrammar(options, type.responses);
        askedQuestion = true;
        return response;
      }
    }
  }

  //check it's a question
  //recompose into full sentence
  const profile = compendium.analyse(sent)[0].profile;

  if(profile.types.includes('interrogative')){
    askedQuestion = true;
  }

  else{
    const noQuestionResponse = getResponse(notQuestion, bot)
    return noQuestionResponse.response;
  }

}

/**
* This function checks either user's or bot messages for
* repeats, according to a buffer
*/
function checkPreviousMessages (sent, messages, isUser, buffer) {
  let msgFilter = isUser ? messages.filter(msg => msg.isUser) : messages.filter(msg => !msg.isUser)
  msgFilter = msgFilter.slice(Math.max(msgFilter.length - buffer, 0))
  const matches = msgFilter.filter(msg => msg.text === sent).length;
  return matches;
}

/**
* A parser that gets applied to all sentences that the user submits,
* checking for things which are easier to handle in middleware before
* deciding whether to pass to dialogflow
*/
async function parseGeneric(sent, bot, messages) {
  let sentArr = sent.split(" ");

  if(sent === 'truth') {
    const output = await chooseTruth(bot);
    return output.response;
  }

  //checks against common forms of response
  //e.g. what?????, banned words etc
  for (const type of genericParser) {
    const regex = new RegExp(type.regex, 'i');
    if(type.usertext.includes(sent.replace(regex, ''))) {
      const output = getResponse(type.responses, bot);
      return output.response;
    }
  }

    //check if the user is repeating themselves
  if(checkPreviousMessages(sent, messages, true, 2) > 0){
    const output = getResponse(repetition, bot);
    return output.response;
  }
}

/**
* This structures the order in which user inputs are processed, and
* decides whether to send to bot
*/
export const textProcessor = async (sent, bot, messages) => {

  let botResponse = await parseGeneric(sent, bot, messages)

  switch(bot.name){
    case "truth_bot_answering":
      if(!askedQuestion){
        botResponse = await parseTruthChallenge(sent, bot);
      }
      break;
  }

  //if nothing send the bot
  if(botResponse === undefined || botResponse === ''){
    botResponse = await runSample(sent, bot);
  }

  //check if the bot is repeating itself
  if(checkPreviousMessages(botResponse, botBuffer, false, 8) > 0){
    botResponse = handleError();
  }

  //this is necessary as bot responses split between queue
  //and messages arrays
  botBuffer.push({ 'text': botResponse, 'isUser': false})

  return botResponse;
}
