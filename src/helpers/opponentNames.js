
/**
* A function that fetches a JSON to be used for randomly generating opponent names.
*/
let names = [
	'tom',
	'bob',
	'charlie',
	'sam',
	'gary',
	'david',
	'mark',
	'matt',
	'peter'
]

export const getOpponentName = async () => {
  const opponent = names[Math.floor(Math.random()*names.length)]
  return opponent 
}
