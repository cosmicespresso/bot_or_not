function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getBotDelay = (msg, isQuick = false) => {

  const BOT_DELAY = 5000;
  // const BOT_SPEED = getRandomInt(10,50);
  const BOT_MAX_CHARS = 350;

  // let delay = isQuick ? BOT_DELAY / 2 : BOT_DELAY;
  // let speed = isQuick ? BOT_SPEED * 2 : BOT_SPEED;
  // let botDelay = msg.length > BOT_MAX_CHARS ? delay : Math.floor(msg.length / speed);

  let botDelay = BOT_DELAY * msg.length/BOT_MAX_CHARS * getRandomInt(10,20);
  console.log(botDelay)
  //upper limit for reply wait
  if(botDelay > 6500){
  	botDelay = 6500;
  }

  return botDelay;
}

export const getSeconds = (time) => {
  var seconds = (Math.floor(time / 1000) % 60);
  return seconds;
}