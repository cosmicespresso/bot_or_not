export const handleResize = (e) => {
  const window = e.target || e;
  
  const y = window.innerHeight;
  
  const header = document.querySelector('.container header');

  const input = document.querySelector('.container .text-form') 
              || document.querySelector('.container .single-button') 
              || document.querySelector('.container .double-button');
  
  let dialogHeight = y - header.offsetHeight - input.offsetHeight - 4*10 - 4; // the last calculation is the 10px margin for the header and the input as well as the 2px solid line on very top and bottom
  return dialogHeight;
}


export const handleHeaderText = (main, opponent, headerText, timer) => {
  let title 
  if (main === 'Chat') { 
    title = `Playing with ${opponent}                00:${timer}`
  }
  else if (main === 'Narrator' || main === 'NarratorWait') { 
    title = `You are playing with ${opponent}`
  }
  else {
    title = headerText
  }
  return title
}