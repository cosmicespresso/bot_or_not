const BOT_DELAY = 4000;
const BOT_SPEED = 0.1;
const BOT_MAX_CHARS = 350;

export const getBotDelay = (msg, isQuick = false) => {
  let delay = isQuick ? BOT_DELAY / 2 : BOT_DELAY;
  let speed = isQuick ? BOT_SPEED * 2 : BOT_SPEED;
  return msg.length > BOT_MAX_CHARS ? delay : Math.floor(msg.length / speed);
}

export const getStateAtStep = (step, stateMap) => {
  for (let i = stateMap.length - 1; i >= 0; i--) {
    if (step >= stateMap[i].step) {
      return stateMap[i];
    }
  }
  return stateMap[0];
}

export const getSeconds = (time) => {
	var seconds = (Math.floor(time / 1000) % 60);
	return seconds;
}

export const advanceState = (step, stateMap, shouldUpdate) => {
  // if the button was clicked 
  let nextStep;
  let currentState = getStateAtStep(step, stateMap);
  switch (currentState.main) {
    case "Narrator":
      if (shouldUpdate && step < stateMap.length) {
        nextStep = ++step;
      } 
      else if (shouldUpdate && step >= stateMap.length) {
        nextStep = 2 // Hack for now since we want to go through same flow multiple times
      }
      break;    
    case "Chat":
      nextStep = step;
      break;
    default:
      throw new Error("Impossible state");
  }

  return [nextStep, shouldUpdate];
}


