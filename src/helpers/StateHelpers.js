import uuid from 'uuid';


/**
* A function that receives the current step and returns the object at that step from stateMap array.
* Essential in progressing through the game.
*/
export const getStateAtStep = (step, stateMap) => {
  for (var i = 0; i < stateMap.length; i++) {
    if (stateMap[i].step === step ) {
      return stateMap[i]
    }
  }
}

/**
* A function that receives the current step and returns the next step. 
* Essential in progressing through the game.
*/
export const advanceStep = (currentStep, stateMap) => {
  let nextStep=currentStep;
  if (currentStep < stateMap.length) {
    ++nextStep;
  }
  return nextStep
}


/**
* An array that holds the different bots invoked throughout the game.
* It also provides the steps for which they are active.
*/
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
    "steps": [8, 14] 
  },

  {
    "name": "truth_bot_answering",
    "sessionId": uuid.v4(),
    "projectId": "c200103-challenge-truth-bot-wc",
    "steps": [11]
  }
];