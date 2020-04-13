export const handleResize = (window, innerHeight) => {
  const header = document.querySelector('.container header');
  const input = document.querySelector('.container .text-form') 
              || document.querySelector('.container .single-button') 
              || document.querySelector('.container .double-button');
  // the last calculation is the 10px margin for the header and the input as well as the 2px border on very top and bottom
  let dialogWidth = header.offsetWidth;
  let dialogHeight = innerHeight - header.offsetHeight - input.offsetHeight - 4*10 - 2*2; 
  

  return {dialogWidth, dialogHeight};
}

export const handleHeaderText = (main, opponent, headerText, timer, name) => {
  let title 
  if (main === 'Chat') { 
    title = `Playing with ${opponent}                00:${timer}`
  }
  else if ((main === 'Narrator' || main === 'NarratorWait') && name !== ''){ 
    title = `You are playing with ${opponent}`
  }
  else {
    title = headerText
  }
  return title
}
