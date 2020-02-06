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
  else {
    nextStep = 2 // Hack for now since we want to go through same flow multiple times
  }

  return nextStep;
}