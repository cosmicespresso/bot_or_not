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
  /*
  * HANDLE RESTART
  */
  else if (currentStep==stateMap.length) {
    nextStep = 3
  }
  
  return nextStep;
}

export const bots = [
  {
    "name": "intro_bot",
    "sessionId": uuid.v4(),
    "projectId": "prolific-texter-uhpjbf",
    "steps": [0, 1, 2, 3] 
  },

  {
    "name": "truth_bot_asking",
    "sessionId": uuid.v4(),
    "projectId": "u170220-truth-bot-regenerat-hw",
    "steps": [4, 5, 8, 9] 
  },

  // {
  //   "name": "dare_bot",
  //   "sessionId": uuid.v4(),
  //   "projectId": "g191120-truth-bot-hluhsq",
  //   "steps": [8, 9] 
  // },

  {
    "name": "truth_bot_answering",
    "sessionId": uuid.v4(),
    "projectId": "c200103-challenge-truth-bot-wc",
    "steps": [6, 7, 10, 11, 12]
  }
];