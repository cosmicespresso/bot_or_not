import React, {Component} from 'react';

import Header from './components/top/Header';
import Chat from './components/main/Chat';
import Narrator from './components/main/Narrator';
import Round from './components/main/Round';

import MessageBar from './components/input/MessageBar';
import SingleButton from './components/input/SingleButton';
import DoubleButton from './components/input/DoubleButton';

import {stateMap} from './stateMap';
import {getBotDelay, getSeconds} from './helpers/Utils';
import {getStateAtStep, advanceStep, bots} from './helpers/StateHelpers';
import { preProcessor, runSample, chooseTruth } from './helpers/textProcessing'
import { maxWindowHeight, handleResize } from './helpers/DOM'

import './styles/App.css';
import './styles/Top.css';
import './styles/Main.css';
import './styles/Input.css';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.botQueue = [];
    this.isProcessingQueue = false;
    this.shouldUpdate = false;

    this.state = { 
      name: '',
      choice: '',
      timerTime: 0,
      timerStart: 0,
      isBotTyping: false,
      currentBot: bots[0],
      ...getStateAtStep(1, stateMap)
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
    let messages;
    //check if message pure punctuation, let it pass if so
    if (text.match(/[a-zA-Z]/g)){
      //breaks sentences into different messages
      messages = text
        .match(/[^.!?]+[.!?]*/g)
        .map(str => str.trim());
    }
    else messages = text;
    // error handling
    if (!messages) {
      messages = 'huh??';
      console.log('error handling messages:', messages)
    }
    this.botQueue = this.botQueue.concat(messages);
    // start processing bot queue
    const isQuick = !this.state.isBotTyping;
    this.setState({isBotTyping: true}, () => this.processBotQueue(isQuick));
  }

  handleSubmitText = async (text) => {
    // append user text

    if (this.state.step !== 1) {
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
    // handle name submission in Intro
    else {
      this.shouldUpdate = true;
      this.setState({name: text})
    }
  }

  startTimer = () => {
    this.setState({
      timerTime: Date.now(),
      timerStart: Date.now()
    });
    this.timer = setInterval(() => {
      this.setState({
        timerTime: Date.now() - this.state.timerStart
      });
    }, 10);
  };

  handleClick = (e) => {
    this.setState({ timerStart: Date.now()});
    this.shouldUpdate = true;
    
    let target = e.target.firstElementChild !== null ? 
                  e.target.firstElementChild.textContent 
                  : e.target.textContent;
    if (target === 'Chat' || target === 'Truth' || target ==='Dare' || target ==='Bot') this.setState({choice: target})
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    this.configureState(nextProps, nextState);
  }

  componentDidMount() {
    let dialogHeight = handleResize(window);
    this.setState({dialogHeight});
    window.addEventListener('resize', handleResize);
    this.startTimer();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', handleResize);
    clearInterval(this.timer);
  }

  configureBots = () => {
    // which bot are we on
    const bot = bots.filter(function (key, val){
      return key.steps.includes(this.state.step)}.bind(this))

    // update bot, if it changes on this step
    if (bot.length > 0 && this.state.currentBot !== bot[0]){
      this.setState({currentBot: bot[0]})

      //if it's a truth bot, get a truth challenge
      if (bot[0].name === "truth_bot_asking"){
        chooseTruth(bot[0]).then( 
          botResponse => { 
            console.log(botResponse);
            this.appendMessage(botResponse); 
          })
        }
      }

      //clear out the message queue
      this.setState({botQueue: []})
  }

  checkTimeout = (Component) => {
    if (this.state.main === Component && 
        !this.shouldUpdate &&
        this.state.timeLimit === getSeconds(this.state.timerTime))
    {
      this.setState({ timerStart: Date.now()});
      this.shouldUpdate = true;
    }
  }

  configureState = (props, state) => {
    // check if a component has timed out 
    this.checkTimeout('Chat');

    // advancing and updating state happens here 
    if (this.shouldUpdate) { 
      this.shouldUpdate = false;
      // get next state
      let nextStep =  advanceStep(this.state.step, stateMap);
      // update bots
      this.configureBots();
      // update state
      this.setState({...getStateAtStep(nextStep, stateMap)})
    }
  }

  render() {
    let seconds = getSeconds(this.state.timerTime);
    let timer = seconds < 10  ? `0${seconds}` : seconds;
    
    const AppStyle = this.state.step >= stateMap.length-1 ? 'App-Gameover' : 'App'
    const HeaderColor= this.state.main === 'Chat'  ? '#FF2D55' : '#00f';
    const infoColor= this.state.step === stateMap.length ? '#fff' : '#FF2D55';
    const placeHolderText = this.state.step === 1 ? 'Enter your name' : 'Say something...'
    const endingText = this.state.choice === 'Bot' ? 'Correct!' : 'You were fooled!'
    
    let title = ''
    if (this.state.main === 'Narrator' || this.state.main === 'Round' || this.state.main === 'Ending') {
      title = this.state.name ? `Playing as: ${this.state.name}` : this.state.headerText
    } else {
      title =  this.state.step < 12 ? `${this.state.choice}  00:${timer}` : `Playing as: ${this.state.name}`
    }

    return (
      <div className={AppStyle}>
        <div className="container">
          
          {/*-----------------------------TOP-----------------------------*/}     
          
          <Header 
          title={title} 
          color={HeaderColor} /> 

          {/*-----------------------------MAIN-----------------------------*/}   
          
          {this.state.main === 'Narrator'  && 
            <Narrator 
            dialogHeight={this.state.dialogHeight} 
            headline={this.state.fieldTop} 
            text={this.state.fieldBottom}/>
          }            
          {this.state.main === 'Round'  && 
            <Round 
            dialogHeight={this.state.dialogHeight} 
            headline={this.state.fieldTop} 
            text={this.state.fieldBottom}/>
          }   
          {this.state.main === 'Chat' &&
            <Chat 
            time={getSeconds(this.state.timerTime)}
            choice={this.state.choice}
            messages={this.state.messages}
            isBotTyping={this.state.isBotTyping}
            dialogHeight={this.state.dialogHeight} />
          }            
          {this.state.main === 'Ending' &&
            <Narrator 
            dialogHeight={this.state.dialogHeight} 
            headline={endingText} 
            text={this.state.fieldBottom}/>
          }              

          {/*-----------------------------INPUT-----------------------------*/}     
          
          {this.state.input === 'MessageBar' && 
            <MessageBar onSubmit={this.handleSubmitText} placeholder={placeHolderText}/>
          }          
          {this.state.input === 'SingleButton' &&
            <SingleButton click={this.handleClick} 
            buttonText={this.state.singleButtonText} />
          }          
          {this.state.input === 'DoubleButton' &&
            <DoubleButton click={this.handleClick} 
            button1={this.state.button1Text} 
            button2={this.state.button2Text} />
          }
        </div>
        {/*-----------------------------INFO-----------------------------*/}     
        { window.innerHeight > `${maxWindowHeight}` && 
          <div className="info" style={{color: infoColor}} > 
            a <a href="https://www.foreignobjects.net/"rel="noopener noreferrer" target="_blank">
            FOREIGN OBJECTS</a> early prototype 
          </div>
        }
      </div>
    );
  }
}

export default App