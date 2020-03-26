const truths = require('./lib/truths.json');
const blacklist = require('./lib/blacklist.json');

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


export const preProcessor = async (sent, bot) => {
  let sentArr = sent.split(" ");

  //check against words blacklist
  let matched = sentArr.filter(word => blacklist.includes(word))
  if(matched.length !== 0){
    await createContext('blacklist', 5, bot);
  }

  if(sent === 'truth') {
    const output = await chooseTruth(bot);
    return output;
  }
}
