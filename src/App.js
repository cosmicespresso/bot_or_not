import React, {Component} from 'react';

import Header from './components/top/Header';

import Chat from './components/main/Chat';
import Narrator from './components/main/Narrator';
import NarratorWait from './components/main/NarratorWait';
import Credits from './components/main/Credits';
import End from './components/main/End';
import About from './components/main/About';

import MessageBar from './components/input/MessageBar';
import SingleButton from './components/input/SingleButton';
import DoubleButton from './components/input/DoubleButton';

import {stateMap} from './stateMap';
import {opponent} from './helpers/opponentNames';
import {getBotDelay, getSeconds} from './helpers/Utils';
import {getStateAtStep, advanceStep, bots} from './helpers/StateHelpers';
import { textProcessor, runSample, chooseTruth } from './helpers/textProcessing'
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
      opponent: opponent, 
      timerTime: 0, 
      timerStart: 0,
      isBotTyping: false,
      currentBot: bots[0],
      ...getStateAtStep(1, stateMap),
      result: ''
  	};
  }

  appendMessage = (text, isUser = false, next = () => {}) => {
    let messages = this.state.messages.slice();
    messages.push({isUser, text});
    this.setState({messages, isBotTyping: this.botQueue.length > 0}, next);
  }

  processBotQueue = (isQuick = false) => {
    if (!this.isProcessingQueue && this.botQueue.length) {
      console.log(this.botQueue)
      this.isProcessingQueue = true;
      const nextMsg = this.botQueue.shift();
      setTimeout(() => {
        this.isProcessingQueue = false;
        this.appendMessage(nextMsg, false, this.processBotQueue);
      }, getBotDelay(nextMsg, isQuick));
    }
  }

  processResponse = (text) => {
    //check if message pure punctuation, let it pass if so
    if (text.match(/[a-zA-Z]/g)){
      //breaks sentences into different messages
      text = text
        .match(/[^.!?]+[.!?]*/g)
        .map(str => str.trim());
    }
    else if (!text) {
      text = 'huh??';
    }

    this.botQueue = this.botQueue.concat(text);
    // start processing bot queue
    const isQuick = !this.state.isBotTyping;
    this.setState({isBotTyping: true}, () => this.processBotQueue(isQuick));
  }

  handleSubmitText = async (text) => {
    if (this.state.step !== 3) { 
    // message bar function except for step 3 
      this.appendMessage(text, true);
      const response = await textProcessor(text, this.state.currentBot);
      this.processResponse(response);
    }

    else {  
    // handle step 3 (player entering their name)
      this.shouldUpdate = true;
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

    // grab text of button
    let target = e.target.firstElementChild !== null ?  e.target.firstElementChild.textContent  : e.target.textContent;
    
    /*
    * EDGE CASE
    */
    if (this.state.step === 17 && target==='Human 🤷‍♀️') this.setState({result: 'You are incorrect - this was a bot! '})
    if (this.state.step === 17 && target==='Bot 🤖') this.setState({result: 'You are correct - this was a bot! '})

    this.setState({ timerStart: Date.now()});
    this.shouldUpdate = true;
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
    this.checkTimeout('NarratorWait');

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
    
    const HeaderColor= this.state.main === 'Chat'  ? '#FF2D55' : '#00f';
    const placeHolderText = this.state.step === 3 ? 'Enter your name' : 'Say something...'
    let title;
    if (this.state.main === 'Chat') { 
      title = `Playing with ${this.state.opponent}       00:${timer}`
    }
    else if ((this.state.main === 'Narrator' || this.state.main === 'NarratorWait') && this.state.name !== '') { 
      title = `You are playing with ${this.state.opponent}`
    }
    else {
      title = this.state.headerText
    }

    return (
      <div className='App'>
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
          {this.state.main === 'NarratorWait'  && 
            <NarratorWait 
            dialogHeight={this.state.dialogHeight} 
            headline={this.state.opponent+ ' ' +this.state.fieldTop} 
            text={this.state.fieldBottom}/>
          }   
          {this.state.main === 'Chat' &&
            <Chat 
            time={getSeconds(this.state.timerTime)}
            messages={this.state.messages}
            isBotTyping={this.state.isBotTyping}
            dialogHeight={this.state.dialogHeight} />
          }            
          {this.state.main === 'End' &&
            <End 
            dialogHeight={this.state.dialogHeight} 
            headline={this.state.result} 
            text={this.state.fieldBottom}/>
          }            
          {this.state.main === 'About' &&
            <About 
            dialogHeight={this.state.dialogHeight} />
          }              
          {this.state.main === 'Credits'  && 
            <Credits 
            dialogHeight={this.state.dialogHeight} 
            headline={this.state.fieldTop} 
            text={this.state.fieldBottom}/>
          }   
          {/*-----------------------------INPUT-----------------------------*/}     
          
          {this.state.input === 'MessageBar' && 
            <MessageBar onSubmit={this.handleSubmitText} placeholder={placeHolderText}/>
          }          
          {this.state.input === 'SingleButton' &&
            <SingleButton click={ this.state.main === 'NarratorWait' ? null : this.handleClick} 
            buttonText={this.state.singleButtonText} />
          }          
          {this.state.input === 'DoubleButton' &&
            <DoubleButton click={this.handleClick} 
            button1={this.state.button1Text} 
            button2={this.state.button2Text} />
          }
        </div>
      </div>
    );
  }
}

export default App