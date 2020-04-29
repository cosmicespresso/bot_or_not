import React, {Component} from 'react';

import Header from './components/top/Header';

import Chat from './components/main/Chat';
import Narrator from './components/main/Narrator';
import NarratorWait from './components/main/NarratorWait';
import MatchingScreen from './components/main/MatchingScreen';
import Credits from './components/main/Credits';
import End from './components/main/End';
import About from './components/main/About';

import MessageBar from './components/input/MessageBar';
import SingleButton from './components/input/SingleButton';
import DoubleButton from './components/input/DoubleButton';

import {stateMap} from './stateMap';
import {getOpponentName} from './helpers/opponentNames';
import {classNames, fontSizes, fontColors} from './helpers/styles';
import {getBotDelay, getSeconds, getBrowserName} from './helpers/Utils';
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
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.desktopDetected = this.innerWidth >= 768; // it misses landscape mode for mobile 
    this.state = {  
      opponent: '', // name of the opponent, initialized from an external array
      name: '', // name of the player
      timerTime: 0, 
      timerStart: 0,
      isBotTyping: false,
      currentBot: bots[0], // initialize bots
      ...getStateAtStep(1, stateMap), // Importing game states from stateMap object and initializing to step = 1
      result: '' // Defines which text ('correct' or 'incorrect') will be rendered in the End view
  	};
  }


  /**
  * A function that appends what the user just typed to the array of messages to be rendered.
  */
  appendMessage = (text, isUser = false, next = () => {}) => {
    let messages = this.state.messages.slice();
    messages.push({isUser, text});
    this.setState({messages, isBotTyping: this.botQueue.length > 0}, next);
  }

  /**
  * A function that goes through the bot's incoming responses from Dialogflow 
  * and directs them to frontend.
  */
  processBotQueue = () => {
    if (!this.isProcessingQueue && this.botQueue.length) {
      this.isProcessingQueue = true;
      const nextMsg = this.botQueue.shift();
      setTimeout(() => {
        this.isProcessingQueue = false;
        this.appendMessage(nextMsg, false, this.processBotQueue);
      }, getBotDelay(nextMsg));
    }
  }

  /**
  * A function that sanitizes typed messages before they are appended to the bot queue.
  */
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
    this.setState({isBotTyping: true}, () => this.processBotQueue());
  }

  /**
  * A function that initializes and maintains a timer that runs throughout the game.
  */
  startTimer = () => {
    this.setState({
      timerStart: Date.now()
    });
    this.timer = setInterval(() => {
      // this.listenForInnerHeightChange();
      this.setState({
        timerTime: Date.now() - this.state.timerStart
      });
    });
  }

  /**
  * A function that times out and adds a message if the user hasn't said anything
  */
  awaitUserInput = (response, timeout) => {
      setTimeout(() => {
        if(this.state.messages.length === 0) {
          //adds a blank message to kickstart the 'bot dots'
          this.appendMessage('');
          this.processResponse(response); 
          }
        }, timeout)
  }


  /**
  * A function that handles all form submission (via messageBar component).
  * It also accounts for edge cases like step 3.
  */
  handleSubmitText = async (text) => {
    this.setState({name: text})
    if (this.state.step !== 3) {  // message bar function except for step 3 where we want the user to enter their own name
      this.appendMessage(text, true);
      const response = await textProcessor(text, this.state.currentBot, this.state.messages);
      this.processResponse(response);
    }
    else {this.shouldUpdate = true; } // handle step 3 (player entering their name)
  }

  /**
  * A function that handles all button presses. 
  * It resets the timer for every component run.
  * It prepares the transition to the next view (this.shouldUpdate = true).
  * It also accounts for edge cases like step 17.
  */
  handleClick = (e) => {
    let target = e.target.firstElementChild !== null ?  e.target.firstElementChild.textContent  : e.target.textContent;
    if (this.state.step === 18 && target==='Human 🤷‍♀️') this.setState({result: 'You are incorrect - this was a bot! '})
    if (this.state.step === 18 && target==='Bot 🤖') this.setState({result: 'You are correct - this was a bot! '})

    this.setState({ timerStart: Date.now()});
    this.shouldUpdate = true;
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    this.configureState(nextProps, nextState);
  }

  /**
  * Initializes event listeners, the timer, and resizing for the component.
  */
  componentDidMount() {
    // detect and initialize screen sizes
    let screenSizes = handleResize(window,this.innerHeight);
    this.setState({dialogWidth: screenSizes.dialogWidth, dialogHeight: this.desktopDetected ? screenSizes.dialogHeight * 0.9 : screenSizes.dialogHeight});
    
    // add resizing listener
    window.addEventListener('resize', handleResize);
    
    // start timer
    this.startTimer();

    // initialize opponent name via getOpponentName() function
    getOpponentName().then( (opponent) => this.setState({opponent: opponent}))
    
    // log the browser type for debugging help
    console.log('Browser type:', getBrowserName(), 'Platform:', window.navigator.platform);
  }

  /**
  * Removes event listener for resizing and clears timer for the component.
  */
  componentWillUnmount() {
    window.removeEventListener('resize', handleResize);
    clearInterval(this.timer);
  }

  /**
  * A function that determines which bot we should be invoking at the current view.
  */
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
            this.appendMessage('');
            this.processResponse(botResponse);
          })
        }
    }
  }

  /**
  * A function that determines whether to add a timeout to the chat window
  * to engage the user if they've not said anything
  */
  configureChat = () => {
      if(this.state.step === 4) this.awaitUserInput('hey', 5000); //intro
      if(this.state.step === 11) this.awaitUserInput('...are u going to ask a question', 10000); //user truth challenge
  }
    
  /**
  * A function that checks whether a component has timed out.
  * It resets the timer if so.
  * It marks the component for update.
  */
  checkTimeout = (Component) => {
    if (this.state.main === Component && 
        !this.shouldUpdate &&
        this.state.timeLimit <= this.state.timerTime)
    {
      this.setState({ timerStart: Date.now()});
      this.shouldUpdate = true;
    }
  }

  /**
  * A function that takes care of progressing through the game.
  * It takes care of components which time out. 
  * It calculates the next step and updates the state.
  * It updates the bots.
  */
  configureState = (props, state) => { // advancing and updating state happens here 
    
    // check if a component has timed out 
    this.checkTimeout('Chat');
    this.checkTimeout('NarratorWait');
    this.checkTimeout('MatchingScreen');
    
    if (this.shouldUpdate) {
      this.shouldUpdate = false;
      
      let nextStep =  advanceStep(this.state.step, stateMap); // get next state
      this.configureBots(); // update bots
      this.configureChat(); // configure the chat start state
      this.setState({...getStateAtStep(nextStep, stateMap)}) // update state
    }
  }

  render() {
    /*
    * TIME
    */ 
    let seconds = getSeconds(this.state.timeLimit- this.state.timerTime);
    let timer = seconds < 10  ? `0${seconds}` : seconds;
    /*
    * HEADER TEXT
    */ 
    const title = handleHeaderText(this.state.step, this.state.main, this.state.opponent, this.state.headerText, timer, this.state.name);
    /*
    * FONT COLORS AND SIZES
    */ 
    const fontColorsConfig = fontColors(this.state.main)
    const fontSizesConfig = fontSizes(this.state.dialogHeight, this.innerHeight)
    /*
    * CLASSES
    */ 
    const classesConfig = classNames(this.state.main, this.state.step)

    return (
      <div id='App' className={classesConfig.appClass}>
        <div className={classesConfig.containerClass}>
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
          {this.state.main === 'MatchingScreen'  && 
            <MatchingScreen 
              fontSize={fontSizesConfig.largeFontSize}
              narratorWaitClass={classesConfig.narratorWaitClass}
              dialogHeight={this.state.dialogHeight} 
              headline={'Hi ' + this.state.name+ ', ' +this.state.fieldTop} 
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
              click={this.state.main === 'NarratorWait' || this.state.main === 'MatchingScreen' ? null : this.handleClick}  
              step={this.state.step}
              buttonText={this.state.singleButtonText} />
          }      
          {this.state.input === 'DoubleButton' &&
            <DoubleButton 
              fontSize={fontSizesConfig.baseFontSize}
              singleButtonClass={classesConfig.singleButtonClass}
              click={this.handleClick} 
              step={this.state.step}
              button1={this.state.button1Text} 
              button2={this.state.button2Text} />
          }
        </div>
      </div>
    );
  }
}

export default App