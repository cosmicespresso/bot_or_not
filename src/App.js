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
import {classNames, fontSizes, fontColors} from './helpers/styles';
import {getBotDelay, getSeconds} from './helpers/Utils';
import {getStateAtStep, advanceStep, bots} from './helpers/StateHelpers';
import { textProcessor, chooseTruth, handleError } from './helpers/textProcessing'
import { handleResize, handleHeaderText } from './helpers/DOM'

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
    this.desktopDetected = window.innerWidth >= 768; // randomly deciding that for the moment
    this.state = {  
      opponent: opponent, 
      name: '',
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
      text = handleError();
    }

    this.botQueue = this.botQueue.concat(text);
    // start processing bot queue
    const isQuick = !this.state.isBotTyping;
    this.setState({isBotTyping: true}, () => this.processBotQueue(isQuick));
  }

  handleSubmitText = async (text) => {
    this.setState({name: text})
    /*
    *EDGE CASE
    */
    if (this.state.step !== 3) {  // message bar function except for step 3 where we want the user to enter their own name
      this.appendMessage(text, true);
      const response = await textProcessor(text, this.state.currentBot);
      this.processResponse(response);
    }
    else {this.shouldUpdate = true; } // handle step 3 (player entering their name)
  }

  handleMobileKeyboard = (height) => {
    console.log(this.state.dialogHeight, height)
    // if (!this.desktopDetected) this.setState({dialogHeight: 0.81*height})
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
    /*
    * EDGE CASE
    */
    let target = e.target.firstElementChild !== null ?  e.target.firstElementChild.textContent  : e.target.textContent;
    if (this.state.step === 17 && target==='Human 🤷‍♀️') this.setState({result: 'You are incorrect - this was a bot! '})
    if (this.state.step === 17 && target==='Bot 🤖') this.setState({result: 'You are correct - this was a bot! '})

    this.setState({ timerStart: Date.now()});
    this.shouldUpdate = true;
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    this.configureState(nextProps, nextState);
  }

  componentDidMount() {
    let {dialogWidth, dialogHeight} = handleResize(window);

    this.setState({dialogWidth: dialogWidth, dialogHeight: this.desktopDetected ? dialogHeight * 0.9 : dialogHeight});
    window.addEventListener('resize', handleResize);
    window.addEventListener('mobileKeyboard', this.handleMobileKeyboard);
    this.startTimer();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('mobileKeyboard', this.handleMobileKeyboard);
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

  configureState = (props, state) => { // advancing and updating state happens here 
    
    // check if a component has timed out 
    this.checkTimeout('Chat');
    this.checkTimeout('NarratorWait');

    
    if (this.shouldUpdate) { 
      this.shouldUpdate = false;
      
      let nextStep =  advanceStep(this.state.step, stateMap); // get next state
      this.configureBots(); // update bots
      this.setState({...getStateAtStep(nextStep, stateMap)}) // update state
    }
  }

  render() {
    /*
    * TIME
    */ 
    let seconds = getSeconds(this.state.timerTime);
    let timer = seconds < 10  ? `0${seconds}` : seconds;
    /*
    * HEADER TEXT
    */ 
    let title = handleHeaderText(this.state.main, this.state.opponent, this.state.headerText, timer, this.state.name);
    /*
    * FONT COLORS AND SIZES
    */ 
    const fontColorsConfig = fontColors(this.state.main)
    const fontSizesConfig = fontSizes(this.state.dialogHeight)
    /*
    * CLASSES
    */ 
    const classesConfig = classNames(this.state.main, this.state.step)

    return (
      <div className={classesConfig.appClass}>
        <div className="container">
          {/*-----------------------------TOP-----------------------------*/}     
          <Header 
            fontSize={fontSizesConfig.baseFontSize}
            headerClass={classesConfig.headerClass}
            title={title} 
            color={fontColorsConfig.headerColor} /> 

          {/*-----------------------------MAIN-----------------------------*/}   
          {this.state.main === 'Narrator'  && 
            <Narrator 
              fontSize={fontSizesConfig.largeFontSize}
              narratorClass={classesConfig.narratorClass}
              color={fontColorsConfig.narratorColor}
              dialogHeight={this.state.dialogHeight} 
              headline={this.state.fieldTop} 
              text={this.state.fieldBottom}/>
          }                     
          {this.state.main === 'NarratorWait'  && 
            <NarratorWait 
              fontSize={fontSizesConfig.largeFontSize}
              narratorWaitClass={classesConfig.narratorWaitClass}
              dialogHeight={this.state.dialogHeight} 
              headline={this.state.opponent+ ' ' +this.state.fieldTop} 
              text={this.state.fieldBottom}/>
          }   
          {this.state.main === 'Chat' &&
            <Chat 
              fontSize={fontSizesConfig.baseFontSize}
              chatClass={classesConfig.chatClass}
              time={getSeconds(this.state.timerTime)}
              messages={this.state.messages}
              isBotTyping={this.state.isBotTyping}
              dialogHeight={this.state.dialogHeight} />
          }            
          {this.state.main === 'End' &&
            <End 
              fontSizeTop={fontSizesConfig.largeFontSize}
              fontSizeBottom={fontSizesConfig.mediumFontSize}
              endClass={classesConfig.endClass}
              dialogHeight={this.state.dialogHeight} 
              headline={this.state.result} 
              text={this.state.fieldBottom}/>
          }            
          {this.state.main === 'About' &&
            <About 
              fontSize={fontSizesConfig.baseFontSize}
              aboutClass={classesConfig.aboutClass}
              dialogHeight={this.state.dialogHeight} />
          }              
          {this.state.main === 'Credits'  && 
            <Credits 
              fontSize={fontSizesConfig.baseFontSize}
              creditsClass={classesConfig.creditsClass}
              dialogHeight={this.state.dialogHeight} 
              headline={this.state.fieldTop} 
              text={this.state.fieldBottom}/>
          }   

          {/*-----------------------------INPUT-----------------------------*/}     
          {this.state.input === 'MessageBar' && 
            <MessageBar 
              onInputFocus={this.handleMobileKeyboard}
              fontSize={fontSizesConfig.baseFontSize}
              buttonSize={fontSizesConfig.mediumFontSize}
              messageBarClass={classesConfig.messageBarClass}
              onSubmit={this.handleSubmitText} 
              placeholder={classesConfig.placeHolderText}/>
          }   
          {this.state.input === 'SingleButton' &&
            <SingleButton 
              fontSize={fontSizesConfig.baseFontSize}
              singleButtonClass={classesConfig.singleButtonClass}
              click={this.state.main === 'NarratorWait' ? null : this.handleClick}  // disable this button for NarratorWait
              buttonText={this.state.singleButtonText} />
          }      
          {this.state.input === 'DoubleButton' &&
            <DoubleButton 
              fontSize={fontSizesConfig.baseFontSize}
              singleButtonClass={classesConfig.singleButtonClass}
              click={this.handleClick} 
              button1={this.state.button1Text} 
              button2={this.state.button2Text} />
          }
        </div>
      </div>
    );
  }
}

export default App