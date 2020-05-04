/**
* A function that returns a random integer between min and max.
*/
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
* A function that calculates and returns the botDelay in ms
*/
export const getBotDelay = (msg) => {
  const BOT_DELAY = 5000;
  const BOT_MAX_CHARS = 350;

  let botDelay = BOT_DELAY * msg.length/BOT_MAX_CHARS * getRandomInt(10,25) + getRandomInt(0, 2500);
  
  if (botDelay > 6500) botDelay = 6500; //upper limit for reply wait

  return botDelay;
}

/**
* A function that receives raw time data and converts it to seconds.
*/
export const getSeconds = (time) => {
  var seconds = (Math.floor(time / 1000) % 60);
  return seconds;
}


/**
* sets timeout asyncronously, allows us to cancel it too
*/
export const asyncTimeout = (ms) => {
  var timeout, promise;

  promise = new Promise(function(resolve, reject) {
    timeout = setTimeout(function() {
      resolve('completed timeout');
    }, ms);
  }); 

  return {
     promise:promise, 
     cancel:function(){clearTimeout(timeout);} //return a canceller as well
   };
}


/**
* A function that detects and returns browser type.
*/
export const getBrowserName = () => {
  if ( navigator.userAgent.indexOf("Edge") > -1 && navigator.appVersion.indexOf('Edge') > -1 ) {
      return 'Edge';
  }
  else if( navigator.userAgent.indexOf("Opera") !== -1 || navigator.userAgent.indexOf('OPR') !== -1 )
  {
      return 'Opera';
  }
  else if( navigator.userAgent.indexOf("Chrome") !== -1 )
  {
      return 'Chrome';
  }
  else if( navigator.userAgent.indexOf("Safari") !== -1)
  {
      return 'Safari';
  }
  else if( navigator.userAgent.indexOf("Firefox") !== -1 ) 
  {
      return 'Firefox';
  }
  else if( ( navigator.userAgent.indexOf("MSIE") !== -1 ) || (!!document.documentMode === true ) ) //IF IE > 10
  {
      return 'IE';
  }  
  else 
  {
      return 'unknown';
  }
}