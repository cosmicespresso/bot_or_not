import React, {Component} from 'react';
import Header from './components/top/Header';

import Chat from './components/main/Chat';
import Narrator from './components/main/Narrator';
import AudioVis from './components/main/AudioVis';

import MessageBar from './components/input/MessageBar';
import SingleButton from './components/input/SingleButton';
import DoubleButton from './components/input/DoubleButton';

import {stateMap} from './stateMap';
import {getBotDelay} from './Utils';

import keys from './keys/truthbot.json';

import './styles/App.css';
import './styles/Top.css';
import './styles/Main.css';
import './styles/Input.css';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.botQueue = [];
    this.isProcessingQueue = false;
    this.step = 0;

    this.state = {...stateMap[0]};
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
    this.processResponse(botResponse);
  }

  handleProgression = (e) => {
    if (this.step < stateMap.length-1) {
      ++this.step;
    } else {
      this.step = 0;
    }
    this.setState({...stateMap[this.step]})
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
            <SingleButton click={this.handleProgression} buttonText={this.state.singleButtonText} />
          }          
          {this.state.input === 'DoubleButton' &&
            <DoubleButton click={this.handleProgression} button1={this.state.button1Text} button2={this.state.button2Text} />
          }
        </div>
        <button className='hack' onClick={this.handleProgression}>next</button>
      </div>
    );
  }
}

export default App