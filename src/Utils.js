const BOT_DELAY = 4000;
const BOT_SPEED = 0.1;
const BOT_MAX_CHARS = 350;

export const getBotDelay = (msg, isQuick = false) => {
  let delay = isQuick ? BOT_DELAY / 2 : BOT_DELAY;
  let speed = isQuick ? BOT_SPEED * 2 : BOT_SPEED;
  return msg.length > BOT_MAX_CHARS ? delay : Math.floor(msg.length / speed);
}

// Feature detect passive event listeners
// See https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md why this is a good idea

let supportsPassiveOption = false;
if (typeof window !== 'undefined') {
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get: function passive() {
        supportsPassiveOption = true;
      }
    });
    window.addEventListener('test', null, opts);
  } catch (e) {} // eslint-disable-line no-empty
}

// Get the passive event option based on its availability; otherwise just mark the event as not cancelable (which improves performance but not as reliably as {passive: true})
// NEVER CALL preventDefault() IN A PASSIVE EVENT HANDLER
export const passiveEvent = () => {
  return supportsPassiveOption
    ? {passive: true}
    : false;
};

export const findNextState = (ID, stateMap) => {
  for (let i = stateMap.length - 1; i >= 0; i--) {
    if (ID >= stateMap[i].ID) {
      return stateMap[i];
    }
  }
  return stateMap[0];
}