import uuid from 'uuid';

export const getStateAtStep = (step, stateMap) => {
  for (var i = 0; i < stateMap.length; i++) {
    if (stateMap[i].step === step ) {
      return stateMap[i]
    }
  }
  return stateMap[0]
}

export const advanceStep = (step, stateMap) => {
  let nextStep;
  if (step < stateMap.length) {
    nextStep = ++step;
  } 
  return nextStep;
}

export const bots = [{
  "name": "truth_bot_setting",
  "sessionId": uuid.v4(),
  "projectId": "g191120-truth-bot-hluhsq",
  "steps": [0, 1, 2, 3, 4, 5] },{
  "name": "truth_bot_answering",
  "sessionId": uuid.v4(),
  "projectId": "c200103-challenge-truth-bot-wc",
  "steps": [6]
}];