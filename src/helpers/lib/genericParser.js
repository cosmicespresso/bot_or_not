//perhaps give each its own regex....
//maybe also regexs/symbols for variables


export const genericParser = 
[
	{
		"name": "blacklist",
		"regex": "//",
		"usertext": ["alpha","beta","gamma"],
		"responses": [
			{
				"response": "that's not cool",
				"context": "blacklist"
			}
		]
	},


	{
		"name": "awkward",
		"regex": "/\[r, m]/",
		"usertext": ["er", "um", "awkward", "this is awkward", "lol this is awkward"],
		"responses": [
			{
				"response": "lol idk... what's your favourite color",
				"context": "color"
			},

			{
				"response": "omg so awkward... do u have a favorite band lol",
				"context": "band"
			},

			{
				"response": "omg i have no idea what to say haha",
				"context": "awkward"
			}
		]
	},

	{
		"name": "what",
		"regex": "/\?/g",
		"usertext": ["what", "what?", "What", "What??", "what??", "what???", "what!", "wat", "wattt", "wat", "lol what"],
		"responses": [
				{
					"response": "where r u?",
					"context": "where"
				},

				{
					"response": "what's your name haha",
					"context": "name"
			},


				{
					"response": "do you watch bake off?",
					"context": "bakeoff"
				},

				{
					"response": "when was the last time u went outside?",
					"context": "outside"
				}
			]
	},
]
