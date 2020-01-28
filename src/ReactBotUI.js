import React, {Component} from 'react';
import Header from './components/Header';
import Dialog from './components/Dialog';
import Input from './components/Input';
import uuid from 'uuid';
import './styles/App.css';

const BOT_DELAY = 4000;
const BOT_SPEED = 0.01;
const BOT_MAX_CHARS = 250;

function getBotDelay(msg, isQuick = false) {
  let delay = isQuick ? BOT_DELAY / 2 : BOT_DELAY;
  let speed = isQuick ? BOT_SPEED * 2 : BOT_SPEED;
  return msg.length > BOT_MAX_CHARS ? delay : Math.floor(msg.length / speed);
}

class ReactBotUI extends Component {
  constructor(props) {
    super(props);
    this.botQueue = [];
    this.bots = [{
      "name": "truth_bot_answering",
      "sessionId": uuid.v4()
    },
    {
      "name": "truth_bot_setting",
      "sessionId": uuid.v4()
    }];
    this.isProcessingQueue = false;
    this.state = {
      title: props.title || 'React Bot UI',
      messages: [],
      isBotTyping: false,
      isOpen: props.isOpen !== undefined ? props.isOpen : true,
      isVisible: props.isVisible !== undefined ? props.isVisible : true,
      currentBot: {}
    };

    this.appendMessage = this.appendMessage.bind(this);
    this.processBotQueue = this.processBotQueue.bind(this);
    this.processResponse = this.processResponse.bind(this);
    this.getResponse = this.getResponse.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleSubmitText = this.handleSubmitText.bind(this);
  }

  appendMessage(text, isUser = false, next = () => {}) {
    let messages = this.state.messages.slice();
    messages.push({isUser, text});
    this.setState({messages, isBotTyping: this.botQueue.length > 0}, next);
  }

  processBotQueue(isQuick = false) {
    if (!this.isProcessingQueue && this.botQueue.length) {
      this.isProcessingQueue = true;
      const nextMsg = this.botQueue.shift();
      setTimeout(() => {
        this.isProcessingQueue = false;
        this.appendMessage(nextMsg, false, this.processBotQueue);
      }, getBotDelay(nextMsg, isQuick));
    }
  }

  processResponse(text) {
    const messages = text
      .match(/[^.!?]+[.!?]*/g)
      .map(str => str.trim());
    this.botQueue = this.botQueue.concat(messages);

    // start processing bot queue
    const isQuick = !this.state.isBotTyping;
    this.setState({isBotTyping: true}, () => this.processBotQueue(isQuick));
  }

  getResponse(text) {
    return this.dialogflow.textRequest(text)
      .then(data => data.result.fulfillment.speech);
  }

  async handleSubmitText(text) {
    // append user text
    this.appendMessage(text, true);

    await fetch(".netlify/functions/botRequest", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userString: text,
        bot: this.state.currentBot }),
      })
      .then( response => response.text())
      .then( botResponse => { this.processResponse(botResponse); })
  }

  handleResize(e) {
    const window = e.target || e;
    const y = window.innerHeight;
    const header = document.querySelector('.container header');
    const input = document.querySelector('.container .text-form');
    let dialogHeight = y - header.offsetHeight - input.offsetHeight;
    this.setState({dialogHeight});
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize(window);
  }

  componentWillMount() {
    this.setState({currentBot: this.bots[0]})
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    return (
      <div className="container">
        <Header title={this.state.title} />
        <div>
          <Dialog messages={this.state.messages}
                  isBotTyping={this.state.isBotTyping}
                  isUserHidden={this.props.isUserHidden}
                  dialogHeight={this.state.dialogHeight} />
          <Input onSubmit={this.handleSubmitText} />
        </div>
      </div>
    );
  }
}

export default ReactBotUI