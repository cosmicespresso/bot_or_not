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

export const handleError = () => {
  let response = genericResponse[Math.floor(Math.random()*genericResponse.length)];

  //remove the element so not repeating ourselves
  const index = genericResponse.indexOf(response);
  if (index > 0) {
    genericResponse.splice(index, 1);
  }

  return response;
}

export const chooseTruth = async (bot) => {
  await deleteAllContexts(bot);
  let truth = await getResponse(truths, bot)

  return truth.response;
}

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

function toFirstPerson(sent) {
  sent = sent.replace("your", "my");
  sent = sent.replace("you", "I");
  sent = sent.replace("yourself", "myself");

  return sent;
}

//this function gets a hard-coded response then sets a context associated with it
async function getResponse(responseArr, bot) {
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

function levenshteinVariants(sent, variants) {
  let subSent;

  variants.forEach( variant => {
    if(natural.LevenshteinDistance(variant, sent, {search: true}).distance < 3){
      subSent = sent.replace(natural.LevenshteinDistance(variant, sent, {search: true}).substring, '').trim();
    }
  })

  return subSent;
}

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
