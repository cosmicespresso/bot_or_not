
/**
* A function that fetches a JSON to be used for randomly generating opponent names.
*/
let names = [
	'tom',
	'charlie',
	'sam',
	'gary',
	'david',
	'mark',
	'matt',
	'peter',
	'ryan',
	'alex',
	'joe',
	'dan',
	'toby',
	'ed',
	'jack',
	'rob',
	'chris',
	'steve',
	'mike',
	'john',
	'zach',
	'adam',
	'jake',
	'brad',
	'nick',
	'karthik',
	'jesse',
	'glen',
	'paul',
	'joel',
	'gabe',
	'seth',
	'greg',
	'omar',
	'daryl',
	'ben',
	'luke',
	'max',
	'kyle',
	'will'
]

export const getOpponentName = async () => {
  const opponent = names[Math.floor(Math.random()*names.length)]
  return opponent 
}
