
/**
* A function that fetches a JSON to be used for randomly generating opponent names.
*/
let url ='https://raw.githubusercontent.com/dariusk/corpora/master/data/colors/wikipedia.json'

export const getOpponentName = async () => {
  const response = await fetch(url);
  const json = await response.json();
  const opponent = await json[getRandomInt(0,json.length-1)].name
  return opponent 
}

/**
* A function that receives a min and max and returns a random Int between them.
*/
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

