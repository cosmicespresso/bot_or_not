import uuid from 'uuid';

export const getStateAtStep = (step, stateMap) => {
  for (var i = 0; i < stateMap.length; i++) {
    if (stateMap[i].step === step ) {
      console.log(step, stateMap[i].main)
      return stateMap[i]
    }
  }
  // return stateMap[0]
}

export const advanceStep = (currentStep, stateMap) => {
  let nextStep=currentStep;
  if (currentStep < stateMap.length) {
    ++nextStep;
  } 
  else {
    nextStep=2;
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