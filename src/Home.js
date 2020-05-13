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
import {getBotDelay, getSeconds, getBrowserName, asyncTimeout} from './helpers/Utils';
import {getStateAtStep, advanceStep, bots} from './helpers/StateHelpers';
import { textProcessor, chooseTruth, handleError, getFiller, listContexts } from './helpers/textProcessing'
import { handleResize, handleHeaderText } from './helpers/DOM'

import './styles/App.css';
import './styles/Top.css';
import './styles/Main.css';
import './styles/Input.css';

class Home extends Component {
  
  constructor(props) {
    super(props);
    this.botQueue = [];
    this.isProcessingQueue = false;
    this.shouldUpdate = false;
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.desktopDetected = this.innerWidth >= 768; // it misses landscape mode for mobile 
    this.state = {  
      opponent: '', // name of the bot, initialized from an external array
      name: '', // name of the player
      timerTime: 0, 
      timerStart: 0,
      timeouts: [],
      asyncTimeouts: [],
      isBotTyping: false,
      currentBot: bots[0], // initialize bots
      ...getStateAtStep(1, stateMap), // Importing game states from stateMap object and initializing to step = 1
      result: '' // Defines which text ('correct' or 'incorrect') will be rendered in the End view
  	};
  }

  /**
  * Returns a random number between min (inclusive) and max (exclusive)
  */
  getRandomInt = (min, max) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
  * A function that appends what the user just typed to the array of messages to be rendered.
  */
  appendMessage = (text, isUser = false, next = () => {}) => {
    let messages = this.state.messages.slice();
    messages.push({isUser, text});
    this.setState({messages, isBotTyping: this.botQueue.length > 0}, next);
    this.awaitUserInput('how r u?', 10000, messages.length, this.state.step)
  }

  /**
  * A function that goes through the bot's incoming responses from Dialogflow 
  * and directs them to frontend.
  */
  processBotQueue = () => {
    if (!this.isProcessingQueue && this.botQueue.length) {
      this.isProcessingQueue = true;
      const nextMsg = this.botQueue.shift();
      this.state.timeouts.push(setTimeout(() => {
        this.isProcessingQueue = false;
        this.appendMessage(nextMsg, false, this.processBotQueue);
      }, getBotDelay(nextMsg)));
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

    // random pause before the bot starts typing, as if thinking
    setTimeout(() => this.setState({isBotTyping: true}, () => 
      this.processBotQueue()), this.getRandomInt(1100, 3500));
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
  * in a minute. Used at the start of turns w/ an explicit message, or in the middle
  */
  awaitUserInput = async (response, timeout, numMsgs, state) => {
    //sets an async timeout (settimeout not naturally async)
    let timerPromise = asyncTimeout(timeout);
    this.state.asyncTimeouts.push(timerPromise)

    timerPromise.promise.then( async () => {

      if(this.state.messages.length === 0) {
        //if start of interaction, adds a blank 
        //message to kickstart the 'bot dots'
        this.appendMessage('');
        this.processResponse(response); 
      }

   //check if nobody's said anything new, make sure we're still in chat
   //seconds to stop bot typing as round ends (not a bug, but irritating)
      else if(this.state.messages.length === numMsgs && this.state.main === 'Chat' && 
        getSeconds(this.state.timeLimit- this.state.timerTime) > 7) 
      {
        let contexts;
        try {
          contexts = await listContexts(this.state.currentBot)
        }
        catch(e){
          console.log(e)
        }

        //there's the potential for some quite fine control here!

        //if there are existing contexts, trigger the fallback
        // a 'noreply' response
        if(contexts.length){
          response = await textProcessor('noreply', this.state.currentBot, this.state.messages, 
            this.state.opponent, this.state.name);
        }

        //if there are no contexts, trigger a change of subject
        else {
          response = await textProcessor('what???', this.state.currentBot, this.state.messages, 
            this.state.opponent, this.state.name);
        }

        this.processResponse(response); 
      }
    })
    .catch(error => {
      console.log(error)
    });
  }


  /**
  * A function that handles all form submission (via messageBar component).
  * It also accounts for edge cases like step 8.
  */
  handleSubmitText = async (text) => {
    if (this.state.step !== 8) {  // append messages to the queue except for step 8 where we just keep the user's name
      //clear user timer
      this.appendMessage(text, true);
      const response = await textProcessor(text, this.state.currentBot, this.state.messages, this.state.opponent, this.state.name);
      this.processResponse(response);
    }
    else {
      this.setState({name: text})

      this.setState({ timerStart: Date.now()},
        () => this.setState({ timerTime: 0}, // reset the timer since this counts as a step progression
        () => this.shouldUpdate = true))
    } 
  }

  /**
  * A function that handles all button presses. 
  * It resets the timer for every component run.
  * It prepares the transition to the next view (this.shouldUpdate = true).
  * It also accounts for edge cases like step 17.
  */
  handleClick = (e) => {
    let target = e.target.firstElementChild !== null ?  e.target.firstElementChild.textContent  : e.target.textContent;
    if (this.state.step === 24 && target==='Human 🤷‍♀️') this.setState({result: 'You are incorrect - this was a bot! '})
    if (this.state.step === 24 && target==='Bot 🤖') this.setState({result: 'You are correct - this was a bot! '})

    // welcome to callback hell :3
    this.setState({ timerStart: Date.now()},
      () => this.setState({ timerTime: 0},
      () => this.shouldUpdate = true))
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
            this.appendMessage('');
            if(Math.random() > 0.5) this.processResponse(getFiller());
            this.processResponse(botResponse);
          })
        }
    }
  }

  /**
  * A function that determines whether to add a timeout to the chat window
  * to engage the user if they've not said anything, and that clears timeouts
  * from the previous rounds
  */
  configureChat = async () => {

      //clear messages and timeouts if the previous state was a chat
      //big cleaner upper
      if(this.state.main === 'Chat'){

        this.state.timeouts.forEach(timeout => clearTimeout(timeout))
        this.state.asyncTimeouts.forEach(asyncTimeout => asyncTimeout.cancel())

        this.setState({asyncTimeouts: []})
        this.setState({timeouts: []})

        //clear messages from that round
        this.setState({messages: []})
        this.botQueue = [];
        this.isProcessingQueue = false;
      }

      //if the next round is one where the bot posts first, add some takes
      if(this.state.step === 11) this.awaitUserInput('hey', 5000, 0, this.state.step); //intro
      if(this.state.step === 18) this.awaitUserInput('...are u going to ask a question', 15000, 0, this.state.step); //user truth challenge
      if(this.state.step === 28) this.awaitUserInput('hey again :)', 5000, 0, this.state.step); //final free chat

  }
    
  /**
  * A function that checks whether a component has timed out.
  * It resets the timer if so.
  * It marks the component for update.
  */
  checkTimeout = async (Component) => {
    if (this.state.main === Component && 
        !this.shouldUpdate &&
        this.state.timeLimit <= this.state.timerTime)
    {
      this.setState({ timerStart: Date.now()},
        () => this.setState({ timerTime: 0}, // reset the timer since this counts as a step progression
        () => this.shouldUpdate = true))
    }
  }

  /**
  * A function that takes care of progressing through the game.
  * It takes care of components which time out. 
  * It calculates the next step and updates the state.
  * It updates the bots.
  */
  configureState = async (props, state) => { // advancing and updating state happens here 
    
    // check if a component has timed out 
    await this.checkTimeout('Chat');
    await this.checkTimeout('NarratorWait');
    await this.checkTimeout('MatchingScreen');
    
    if (this.shouldUpdate) {
      this.shouldUpdate = false;
      this.configureChat(); // configure the chat start state

      let nextStep =  advanceStep(this.state.step, stateMap); // get next state
      this.configureBots(); // update bots
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

export default Home