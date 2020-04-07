import uuid from 'uuid';

export const getStateAtStep = (step, stateMap) => {
  for (var i = 0; i < stateMap.length; i++) {
    if (stateMap[i].step === step ) {
      // console.log(step, stateMap[i].main)
      return stateMap[i]
    }
  }
}

export const advanceStep = (currentStep, stateMap) => {
  let nextStep=currentStep;
  if (currentStep < stateMap.length) {
    ++nextStep;
  }
  return nextStep;
}

export const bots = [
  {
    "name": "intro_bot",
    "sessionId": uuid.v4(),
    "projectId": "prolific-texter-uhpjbf",
    "steps": [5] 
  },

  {
    "name": "truth_bot_asking",
    "sessionId": uuid.v4(),
    "projectId": "u170220-truth-bot-regenerat-hw",
    "steps": [7, 13] 
  },

  {
    "name": "truth_bot_answering",
    "sessionId": uuid.v4(),
    "projectId": "c200103-challenge-truth-bot-wc",
    "steps": [9]
  }
];