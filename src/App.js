import React, {Component} from 'react';
import Header from './components/top/Header';

import Chat from './components/main/Chat';
import Narrator from './components/main/Narrator';
import AudioVis from './components/main/AudioVis';

import MessageBar from './components/input/MessageBar';
import SingleButton from './components/input/SingleButton';
import DoubleButton from './components/input/DoubleButton';

import {stateMap} from './stateMap';

import keys from './keys/truthbot.json';

import './styles/App.css';
import './styles/Top.css';
import './styles/Main.css';
import './styles/Input.css';

const BOT_DELAY = 4000;
const BOT_SPEED = 0.01;
const BOT_MAX_CHARS = 350;

function getBotDelay(msg, isQuick = false) {
  let delay = isQuick ? BOT_DELAY / 2 : BOT_DELAY;
  let speed = isQuick ? BOT_SPEED * 2 : BOT_SPEED;
  return msg.length > BOT_MAX_CHARS ? delay : Math.floor(msg.length / speed);
}

class App extends Component {
  constructor(props) {
    super(props);
    
    this.botQueue = [];
    this.isProcessingQueue = false;
    this.step = 0;

    this.state = {
      messages: [],
      isBotTyping: false,
      headerText: stateMap[0].headerText,
      main: stateMap[0].main,
      fieldTop: stateMap[0].fieldTop,
      fieldBottom: stateMap[0].fieldBottom,
      input: stateMap[0].input,
      inputText: stateMap[0].inputText
    };
  }

  appendMessage = (text, isUser = false, next = () => {}) => {
    let messages = this.state.messages.slice();
    messages.push({isUser, text});
    this.setState({messages, isBotTyping: this.botQueue.length > 0}, next);
  }

  processBotQueue = (isQuick = false) => {
    if (!this.isProcessingQueue && this.botQueue.length) {
      this.isProcessingQueue = true;
      const nextMsg = this.botQueue.shift();
      setTimeout(() => {
        this.isProcessingQueue = false;
        this.appendMessage(nextMsg, false, this.processBotQueue);
      }, getBotDelay(nextMsg, isQuick));
    }
  }

  processResponse = (text) => {
    const messages = text
      .match(/[^.!?]+[.!?]*/g)
      .map(str => str.trim());
    this.botQueue = this.botQueue.concat(messages);

    // start processing bot queue
    const isQuick = !this.state.isBotTyping;
    this.setState({isBotTyping: true}, () => this.processBotQueue(isQuick));
  }

  getResponse = (text) => {
    return this.dialogflow.textRequest(text)
      .then(data => data.result.fulfillment.speech);
  }

 handleSubmitText = async (text) => {
    // append user text
    this.appendMessage(text, true);
    const response = await fetch('/api/botRequest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ botText: text }),
    });
    const botResponse = await response.text();
    this.processResponse(botResponse)
  }

  handleButtonClick = (e) => {
    console.log(e.target);
  } 

  handleProgression = (e) => {
    if (this.step < stateMap.length-1) {
      ++this.step;
    } else {
      this.step = 0;
    }
    this.setState((prevState, props) => {
      return {
        headerText: stateMap[this.step].headerText,
        main: stateMap[this.step].main,
        fieldTop: stateMap[this.step].fieldTop,
        fieldBottom: stateMap[this.step].fieldBottom,
        input: stateMap[this.step].input,
        inputText: stateMap[this.step].inputText
      };
    })
  }

  handleResize = (e) => {
    const window = e.target || e;
    const y = window.innerHeight;
    const header = document.querySelector('.container header');
    const input = document.querySelector('.container .text-form') || document.querySelector('.container .single-button') || document.querySelector('.container .double-button')  ;
    let dialogHeight = y - 2*header.offsetHeight - input.offsetHeight - 5; /*ULTRA HACKY*/
    this.setState({dialogHeight});
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize(window);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          {/*-----------------------------TOP-----------------------------*/}     
          <Header title={this.state.headerText} /> 

          {/*-----------------------------MAIN-----------------------------*/}     
          {this.state.main === 'Chat' && 
            <Chat 
            messages={this.state.messages}
            isBotTyping={this.state.isBotTyping}
            dialogHeight={this.state.dialogHeight} />
          }
          {this.state.main === 'Narrator'  && 
            <Narrator dialogHeight={this.state.dialogHeight} headline={this.state.fieldTop} text={this.state.fieldBottom}/>
          }            
          {this.state.main === 'AudioVis'  && 
            <AudioVis dialogHeight={this.state.dialogHeight}/>
          }    

          {/*-----------------------------INPUT-----------------------------*/}     
          {this.state.input === 'MessageBar' &&
            <MessageBar onSubmit={this.handleSubmitText}/>
          }          
          {this.state.input === 'SingleButton' &&
            <SingleButton buttonText={this.state.inputText} />
          }          
          {this.state.input === 'DoubleButton' &&
            <DoubleButton button1={this.state.inputText} button2={this.state.inputText} />
          }
        </div>
        <button className='hack' onClick={this.handleProgression}>next</button>
      </div>
    );
  }
}

export default App