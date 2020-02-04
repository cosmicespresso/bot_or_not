import { LevenshteinDistance } from 'natural';
const truths = require('./lib/truths.json');
const wyrResponse = require('./lib/wyrResponse.json');
const blacklist = require('./lib/blacklist.json');
// const natural = 'peanut';

function toFirstPerson(sent) {
  sent = sent.replace("your", "my");
  sent = sent.replace("you", "I");
  sent = sent.replace("yourself", "myself");

  return sent;
}

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

async function chooseTruth(bot) {
  deleteAllContexts(bot);
  let truth = truths[Math.floor(Math.random()*truths.length)];
  const contextId = truth.context;
  await createContext(contextId, 5, bot);
  await listContexts(bot);

  return truth.truth;
}

async function replacementGrammar(options, sentences){
  let sentence = sentences[Math.floor(Math.random()*sentences.length)];
  let matches = (sentence.match(/\$/g) || []).length;
  for(var i=0; i<matches; i++) {
    const optIndex = Math.floor(Math.random()*options.length);
    sentence = sentence.replace(/\$/, options[optIndex]);
    options.splice(optIndex, 1);
  }
  return sentence;
}


export const preProcessor = async (sent, bot) => {
  console.log("preprocessor called", sent);
  let sendToDF = true;
  let sentArr = sent.split(" ");

  //check against words blacklist
  let matched = sentArr.filter(word => blacklist.includes(word))
  if(matched.length !== 0){
    await createContext('blacklist', 5, bot);
  }

  //is this a truth challenge? NB should replace with button press
  if(LevenshteinDistance("truth", sent, {search: true}).distance < 1){
    const output = await chooseTruth(bot);
    return output;
  }

  //parse out obvious would you rathers
  var subSent;

  if(LevenshteinDistance("Would you rather", sent, {search: true}).distance < 3){
    //remove substring
    var subSent = sent.replace(LevenshteinDistance("Would you rather", sent, {search: true}).substring, '').trim();
  }

  else if(LevenshteinDistance("would u rather", sent, {search: true}).distance < 3){
    var subSent = sent.replace(LevenshteinDistance("would u rather", sent, {search: true}).substring, '').trim();
  }

  else if(LevenshteinDistance("wd u rather", sent, {search: true}).distance < 3){
    var subSent = sent.replace(LevenshteinDistance("wd u rather", sent, {search: true}).substring, '').trim();
  }

  if(subSent) {
    var options = subSent.split(' or ');
    options = options.map(function(str) {return str = toFirstPerson(str.replace(/\?+/g, ""));});

    if(options.length > 1){
      sendToDF = false;
      const output = replacementGrammar(options, wyrResponse);
      return output;
    }
  }
}
