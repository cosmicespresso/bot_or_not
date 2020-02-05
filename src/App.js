import React, {Component} from 'react';
import Header from './components/top/Header';
import { preProcessor, runSample } from './helpers/textProcessing'

import Chat from './components/main/Chat';
import Narrator from './components/main/Narrator';
import AudioVis from './components/main/AudioVis';

import MessageBar from './components/input/MessageBar';
import SingleButton from './components/input/SingleButton';
import DoubleButton from './components/input/DoubleButton';

import {stateMap} from './stateMap';
import {getBotDelay, passiveEvent, findNextState} from './Utils';

import uuid from 'uuid';

import './styles/App.css';
import './styles/Top.css';
import './styles/Main.css';
import './styles/Input.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.bots = [{
      "name": "truth_bot_setting",
      "sessionId": uuid.v4(),
      "projectId": "g191120-truth-bot-hluhsq",
      "steps": [0, 1, 2, 3, 4, 5] },{
      "name": "truth_bot_answering",
      "sessionId": uuid.v4(),
      "projectId": "c200103-challenge-truth-bot-wc",
      "steps": [6]
    }];
    this.botQueue = [];
    this.isProcessingQueue = false;
    this.ID = 1;

    this.state = { 
      timerOn: false,
      timerStart: 0,
      timerTime: 0,
      currentBot: this.bots[0], 
      ...stateMap[0]};
  	};

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

    let messages;
    //check if message pure punctuation, let it pass if so
    if(text.match(/[a-zA-Z]/g)){
      //breaks sentences into different messages
      messages = text
        .match(/[^.!?]+[.!?]*/g)
        .map(str => str.trim());
    }
    else messages = text;

    //error handling
    if(!messages) messages = "huh??";

    this.botQueue = this.botQueue.concat(messages);

    // start processing bot queue
    const isQuick = !this.state.isBotTyping;
    this.setState({isBotTyping: true}, () => this.processBotQueue(isQuick));
  }

  handleSubmitText = async (text) => {
    // append user text
    this.appendMessage(text, true);

    const preProcess = await preProcessor(text, this.state.currentBot);

    if(!preProcess){
        runSample(text, this.state.currentBot)
        .then( 
          botResponse => { 
            this.processResponse(botResponse); })
    }
    else this.processResponse(preProcess);
  }

  handleResize = (e) => {
    const window = e.target || e;
    const y = window.innerHeight;
    const header = document.querySelector('.container header');
    const input = document.querySelector('.container .text-form') || document.querySelector('.container .single-button') || document.querySelector('.container .double-button')  ;
    let dialogHeight = y - 2*header.offsetHeight - input.offsetHeight - 5; /*ULTRA HACKY*/
    this.setState({dialogHeight});
  }

  // startTimer = () => {
  //   this.setState({
  //     timerOn: true,
  //     timerTime: this.state.timerTime,
  //     timerStart: Date.now() - this.state.timerTime
  //   });
  //   this.timer = setInterval(() => {
  //     this.setState({
  //       timerTime: Date.now() - this.state.timerStart
  //     });
  //   }, 10);
  // };

  // stopTimer = () => {
  //   this.setState({ timerOn: false });
  //   clearInterval(this.timer);
  // };

  // resetTimer = () => {
  //   this.setState({
  //     timerStart: 0,
  //     timerTime: 0
  //   });
  // };

  configureTimer = (props, state) => {
    state.main === 'Chat' ? console.log('should keep time') : console.log('no time needed')
  }

  componentWillMount() {
    this.configureTimer(this.props, this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    this.configureTimer(nextProps, nextState);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize, passiveEvent());
    this.handleResize(window);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, passiveEvent());
  }

  handleButtonClick = (e) => {
    e.preventDefault();
    if (this.ID < stateMap.length) {
      ++this.ID;
    } else {
      this.ID = 1;
    }
    this.handleProgression(this.props, this.state);
  }

  handleProgression =  (props, state) => {
    // which bot are we on
    const bot = this.bots.filter(function (key, val){
      return key.steps.includes(this.step)}.bind(this))

    // update bot, if it changes on this step
    if(bot.length > 0 && this.state.currentBot !== bot[0]){
      this.setState({currentBot: bot[0]})
    }

    // retrieve next state from StateMap
    let nextState = findNextState(this.ID, stateMap) 

    // update state
    this.setState({ ...nextState})
  }

  render() {
    let seconds = ("0" + (Math.floor(this.state.timerTime / 1000) % 60)).slice(-2);
    return (
      <div className="App">
        <div className="container">
          {/*-----------------------------TOP-----------------------------*/}     
          <Header title={ this.state.main === 'Chat' ? `00:${seconds}` : this.state.headerText} /> 

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
            <AudioVis ref={this.audioVis} dialogHeight={this.state.dialogHeight}/>
          }    

          {/*-----------------------------INPUT-----------------------------*/}     
          {this.state.input === 'MessageBar' &&
            <MessageBar onSubmit={this.handleSubmitText}/>
          }          
          {this.state.input === 'SingleButton' &&
            <SingleButton click={this.handleButtonClick} buttonText={this.state.singleButtonText} />
          }          
          {this.state.input === 'DoubleButton' &&
            <DoubleButton click={this.handleButtonClick} button1={this.state.button1Text} button2={this.state.button2Text} />
          }
        </div>
      </div>
    );
  }
}

export default App