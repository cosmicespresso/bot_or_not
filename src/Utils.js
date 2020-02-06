const BOT_DELAY = 4000;
const BOT_SPEED = 0.1;
const BOT_MAX_CHARS = 350;

export const getBotDelay = (msg, isQuick = false) => {
  let delay = isQuick ? BOT_DELAY / 2 : BOT_DELAY;
  let speed = isQuick ? BOT_SPEED * 2 : BOT_SPEED;
  return msg.length > BOT_MAX_CHARS ? delay : Math.floor(msg.length / speed);
}

export const getStateAtStep = (step, stateMap) => {
  for (var i = 0; i < stateMap.length; i++) {
    if (stateMap[i].step === step ) {
      return stateMap[i]
    }
  }
  return stateMap[0]
}

export const getSeconds = (time) => {
	var seconds = (Math.floor(time / 1000) % 60);
	return seconds;
}

export const advanceStep = (step, stateMap) => {
 
  let nextStep;
  if (step < stateMap.length) {
    nextStep = ++step;
  } 
  else {
    nextStep = 2 // Hack for now since we want to go through same flow multiple times
  }

  return nextStep;
}


