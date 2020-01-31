const truths = require('./lib/truths.json');
const wyrResponse = require('./lib/wyrResponse.json');
const blacklist = require('./lib/blacklist.json');
const natural = require('natural');


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

async function createContext(context) {
  await fetch(".netlify/functions/createContext", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ context: context })
  })
}

async function chooseTruth() {
  console.log('choosing truth')
  return "blaaaaah"
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


export const preProcessor = async (sent) => {
  console.log("preprocessor called", sent);
  let sendToDF = true;
  let sentArr = sent.split(" ");

  //check against words blacklist
  let matched = sentArr.filter(word => blacklist.includes(word))
  if(matched.length !== 0){
    await createContext('blacklist');
  }

  //is this a truth challenge? NB should replace with button press
  if(natural.LevenshteinDistance("truth", sent, {search: true}).distance < 3){
    const output = await chooseTruth();
    return output;
  }

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
      sendToDF = false;
      const output = replacementGrammar(options, wyrResponse);
      return output;
    }
  }
}
