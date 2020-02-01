module.exports = {
  externals: { 
  	dialogflow: 'dialogflow',
  	'node-fetch': 'node-fetch',
  	uuid: 'uuid' 
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  }
};