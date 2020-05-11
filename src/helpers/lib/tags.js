//perhaps give each its own regex....
//maybe also regexs/symbols for variables


export const tags = 
[
	{
		//which, which, what, whose
		"name": "wh-determiner",
		"tag": 'WDT',
		"responses": [
			{
				"response": "that, I think...",
				"context": ""
			},

			{
				"response": "i think that",
				"context": ""
			}
		]
	},


	{
		//how where when why
		"name": "wh-abverb",
		"tag": 'WRB',
		"responses": [
			{
				"response": "I don't know",
				"context": ""
			},

			{
				"response": "dunno lol",
				"context": ""
			},

			{
				"response": "haha not sure",
				"context": ""
			}
		]
	},

	{
		//who, what
		"name": "wh-pronoun",
		"tag": 'WP',
		"responses": [
				{
					"response": "ah not sure about that",
					"context": ""
				},
				{
					"response": "not sure what you mean",
					"context": ""
				}
			]
	},

	{
		//whose
		"name": "wh-posessive",
		"tag": 'WP$',
		"responses": [
				{
					"response": "mine haha",
					"context": ""
				},
				{
					"response": "kanye's",
					"context": ""
				}
			]
	},

	{
		//modal verbs: should, would could
		"name": "modal",
		"tag": 'MD',
		"responses": [
				{
					"response": "don't think so haha",
					"context": ""
				},
				{
					"response": "lol i don't think so",
					"context": ""
				},
				{
					"response": "not sure",
					"context": ""
				}
				// {
				// 	"response": "¯\_(ツ)_/¯",
				// 	"context": ""
				// },
			]
	},

]
