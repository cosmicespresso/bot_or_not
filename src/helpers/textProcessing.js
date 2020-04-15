const natural = require('natural');
const compendium = require('compendium-js');

//text processing lib
const blacklist = require('./lib/blacklist.json');
const whats = require('./lib/whats.json');
const awkwards = require('./lib/awkwards.json');

//these aren't constant: entries get removed
let truths = require('./lib/truths.json');
let wyrResponse = require('./lib/wyrResponse.json');
let questions = require('./lib/questions.json');
let awkwardQuestions = require('./lib/awkwardQuestions.json');
let notQuestion = require('./lib/notQuestion.json');
let genericResponse = require('./lib/genericResponse.json');

//set up question answering for truth challenge
let askedQuestion = false;

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
  let response = genericResponse[Math.floor(Math.random()*genericResponse.length)];

  //remove the element so not repeating ourselves
  const index = genericResponse.indexOf(response);
  if (index > 0) {
    genericResponse.splice(index, 1);
  }

  return response;
}

/**
* A function that chooses a truth challenge for the player
*/
export const chooseTruth = async (bot) => {
  await deleteAllContexts(bot);
  let truth = await getResponse(truths, bot)

  return truth.response;
}

/**
* A function that replaces words in a sentence with random selection from
* an array of options. Kind of abstract in itself, used for responses with a
* particularly structured syntax
*/
async function replacementGrammar(options, sentences){
  var sentence = sentences[Math.floor(Math.random()*sentences.length)];
  var matches = (sentence.match(/\$/g) || []).length;
  for(let i=0; i<matches; i++) {
    let optIndex = Math.floor(Math.random()*options.length);
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
function getResponse(responseArr) {
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
  //parse out obvious would you rathers
  const wyrVariants = ["Would you rather", "would u rather", "wd u rather"]
  let subSent = levenshteinVariants(sent, wyrVariants)

  if(subSent) {
    var options = subSent.split(' or ');
    options = options.map(function(str) {return str = toFirstPerson(str.replace(/\?+/g, ""));});

    if(options.length > 1){
      const response = replacementGrammar(options, wyrResponse);
      askedQuestion = true;
      return response;
    }
  }

  //check it's a question
  //recompose into full sentence
  const profile = compendium.analyse(sent)[0].profile;

  if(profile.types.includes('interrogative')){
    askedQuestion = true;
  }

  else{
    const noQuestionResponse = await getResponse(notQuestion, bot)
    return noQuestionResponse.response;
  }

}


/**
* A parser that gets applied to all sentences that the user submits,
* checking for things which are easier to handle in middleware before
* deciding whether to pass to dialogflow
*/
async function genericParser(sent, bot) {
  let sentArr = sent.split(" ");

  //check against words blacklist
  let matched = sentArr.filter(word => blacklist.includes(word))
  
  if(matched.length !== 0){
    createContext('blacklist', 5, bot);
    return "hey, not cool";
  }

  if(sent === 'truth') {
    const output = await chooseTruth(bot);
    return output.response;
  }

  //breaking the what loop
  if(whats.includes(sent.replace(/\?/g, ''))) {
    const output = await getResponse(questions, bot);
    return output.response;
  }

  //breaking the what loop
  if(awkwards.includes(sent.replace(/\[r, m]/g, ''))) {
    const output = await getResponse(awkwardQuestions, bot);
    return output.response;
  }

}

/**
* This structures the order in which user inputs are processed, and
* decides whether to send to bot
*/
export const textProcessor = async (sent, bot, context) => {

  let parsed = await genericParser(sent, bot)

  switch(bot.name){
    case "truth_bot_answering":
      if(!askedQuestion){
        parsed = await parseTruthChallenge(sent, bot);
      }
      break;
  }

  //if something came out the parsing step
  if(parsed !== undefined){
    console.log('parsed', parsed)
    return parsed;
  }

  //if nothing send the bot
  else {
    const botResponse = await runSample(sent, bot);
    return botResponse;
  }
}
