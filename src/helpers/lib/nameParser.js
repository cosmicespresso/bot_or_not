//perhaps give each its own regex....
//maybe also regexs/symbols for variables


export const nameParser = 
[
	{
		"name": "hi",
		"regex": "",
		"usertext": ["hi botName","hey botName","hiii botName", "heya botName"],
		"responses": [
			{
				"response": "hi playerName",
				"context": ""
			},

			{
				"response": "hello playerName :)",
				"context": ""
			}
		]
	},


	{
		"name": "realName",
		"regex": /\?/g,
		"usertext": ["are you really called botName", "is botName your real name", "are you actually called botName"],
		"responses": [
			{
				"response": "haha yes... are you really called playerName?",
				"context": "name"
			},

			{
				"response": "i am... are you called playerName??",
				"context": "name"
			},

			{
				"response": "yes haha, does botName sound made up? Are you really called playerName?",
				"context": "name"
			}
		]
	},

	{
		"name": "bothCalled",
		"regex": /\!/g,
		"usertext": ["haha we're both called botName", "you're called botName too!", "", "we are both called botName", "we're both called botName", "another botName"],
		"responses": [
				{
					"response": "lol, this is true",
					"context": "name"
				}
			]
	},
]
