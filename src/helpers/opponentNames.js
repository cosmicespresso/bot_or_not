
/**
* A function that fetches a JSON to be used for randomly generating opponent names.
*/
let names = [
	'alice',
	'bob',
	'charlie',
	'noodle',
	'asfdghj',
	'blaaaa',
	'ayayayay',
	'your name here',
	'beep beep',
	'gary',
	'dave',
	'mark',
	'matt'
]

export const getOpponentName = async () => {
  const opponent = names[Math.floor(Math.random()*names.length)]
  return opponent 
}
