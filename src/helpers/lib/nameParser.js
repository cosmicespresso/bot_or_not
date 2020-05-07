//perhaps give each its own regex....
//maybe also regexs/symbols for variables


export const nameParser = 
[
	{
		"name": "hi",
		"regex": /\!/,
		"usertext": ["hi botName","hey botName", "heyyyy botName","hiii botName", "hii botName", "heya botName", "hey botName :)", "hello botName", "h e l o botName", "henlo botName"],
		"responses": [
			{
				"response": "hi playerName",
				"context": "name"
			},

			{
				"response": "hello playerName :)",
				"context": "name"
			}
		]
	},


	{
		"name": "realName",
		"regex": /\?/g,
		"usertext": ["are you really called botName", "is botName your real name", "are you actually called botName", "is your name really botName"],
		"responses": [
			{
				"response": "haha yes... are you really called playerName?",
				"context": "name"
			},

			{
				"response": "yes, why would I fake being called botName? are you called playerName??",
				"context": "name"
			},

			{
				"response": "yes haha, does botName sound made up? are you really called playerName?",
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

	{
		"name": "friendCalled",
		"regex": /\!/g,
		"usertext": ["my friend is called botName", "i have a friend called botName", "", "botName is my friend's name", "I know a botName", "my friend is called botName", "my dad is called botName", "botName is my dad's name",],
		"responses": [
				{
					"response": "haha, always nice to hear about other botNames",
					"context": "name"
				},
				{
					"response": "a strong name ;)",
					"context": "name"
				},
				{
					"response": "aw, that's nice",
					"context": "name"
				},
				{
					"response": "haha that's nice!",
					"context": "name"
				},
			]
	},

]
