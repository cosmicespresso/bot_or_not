function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max)+1);
}

const BOT_DELAY = 4000;
const BOT_SPEED = getRandomInt(4) * 0.001;
const BOT_MAX_CHARS = 350;

export const getBotDelay = (msg, isQuick = false) => {
  let delay = isQuick ? BOT_DELAY / 2 : BOT_DELAY;
  let speed = isQuick ? BOT_SPEED * 2 : BOT_SPEED;
  return msg.length > BOT_MAX_CHARS ? delay : Math.floor(msg.length / speed);
}

export const getSeconds = (time) => {
  var seconds = (Math.floor(time / 1000) % 60);
  return seconds;
}