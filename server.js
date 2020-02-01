const proxy = require('http-proxy-middleware')
const Bundler = require('parcel-bundler')
const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment');

const bundler = new Bundler('src/site/index.html', {
  cache: false
})

const app = express()

app.use(
  '/.netlify/functions',
  proxy({
    target: 'http://localhost:9000',
    pathRewrite: {
        '^/\.netlify/functions':''
    }
  })
)

app.post('/', express.json(), (req, res) => {
	console.log('heyyyy')
  const agent = new WebhookClient({ request: req, response: res })

function getWishFood() {
    //if contains emoji
    console.log('called getwishfood')
    var regex = /([\uD800-\uDBFF][\uDC00-\uDFFF])/g
    var emoji = agent.request_.body.queryResult.queryText.match(regex);

    console.log(agent.request_.body.queryResult.parameters, emoji)

    agent.add(agent.request_.body.queryResult.fulfillmentText);
  }

//maps an intent (in this case, wish food) 
//to a function that gets triggered when an intent is called
let intentMap = new Map();
  intentMap.set('Wish Food', getWishFood);
  agent.handleRequest(intentMap);
})


app.use(bundler.middleware())

app.listen(Number(process.env.PORT || 1234))