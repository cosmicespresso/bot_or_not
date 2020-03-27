const natural = require('natural');
const compendium = require('compendium-js');

//text processing lib
const truths = require('./lib/truths.json');
const dares = require('./lib/dares.json');
const blacklist = require('./lib/blacklist.json');
const wyrResponse = require('./lib/wyrResponse.json');

export const runSample = async (sample, bot) => {
  const response = await fetch(".netlify/functions/runSample", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      userString: sample,
      bot: bot }),
    })

  return response.text();
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

export const chooseTruth = async (bot) => {
  deleteAllContexts(bot);
  let truth = truths[Math.floor(Math.random()*truths.length)];
  const contextId = truth.context;
  await createContext(contextId, 5, bot);
  await listContexts(bot);

  return truth.truth;
}

export const chooseDare = async (bot) => {
  deleteAllContexts(bot);
  let dare = dares[Math.floor(Math.random()*dares.length)];
  console.log(dare);
  const contextId = dare.context;
  await createContext(contextId, 5, bot);
  await listContexts(bot);

  return dare.dare;
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

async function parseTruthChallenge(sent, bot) {
  //parse out obvious would you rathers
  var subSent;
  
  if(natural.LevenshteinDistance("Would you rather", sent, {search: true}).distance < 3){
    //remove substring
    var subSent = sent.replace(natural.LevenshteinDistance("Would you rather", sent, {search: true}).substring, '').trim();
  }

  else if(natural.LevenshteinDistance("would u rather", sent, {search: true}).distance < 3){
    var subSent = sent.replace(natural.LevenshteinDistance("would u rather", sent, {search: true}).substring, '').trim();
  }

  else if(natural.LevenshteinDistance("wd u rather", sent, {search: true}).distance < 3){
    var subSent = sent.replace(natural.LevenshteinDistance("wd u rather", sent, {search: true}).substring, '').trim();
  }

  if(subSent) {
    var options = subSent.split(' or ');
    options = options.map(function(str) {return str = toFirstPerson(str.replace(/\?+/g, ""));});

    if(options.length > 1){
      const response = replacementGrammar(options, wyrResponse);
      return response;
    }
  }

  //check it's a question
  //recompose into full sentence
  const profile = compendium.analyse(sent)[0].profile;

  if(profile.types.includes('interrogative')){
    console.log(`asked a ${profile.dirtiness > 0.15 ? "dirty " : ''}question in the ${profile.main_tense} tense`)
  }

  else{
    await createContext('notQuestion', 5, bot);
  }

}

export const preProcessor = async (sent, bot, context) => {
  let sentArr = sent.split(" ");

  //check against words blacklist
  let matched = sentArr.filter(word => blacklist.includes(word))
  if(matched.length !== 0){
    await createContext('blacklist', 5, bot);
    return "hey, not cool";
  }

  if(sent === 'truth') {
    const output = await chooseTruth(bot);
    return output;
  }

  let parsed;

  switch(context){
    case "truthChallenge":
      parsed = await parseTruthChallenge(sent, bot);
      break;
  }

  if(parsed !== undefined){
    console.log('parsed', parsed)
    return parsed;
  }
}
