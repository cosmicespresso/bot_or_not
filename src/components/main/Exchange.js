import React, {Component} from 'react';

/**
* A functional component that renders each player's message.
*/
function Message(props) {
	return (
		<div className="message" style={{fontSize: `${props.fontSize}px`}}>
		{props.text === null ? <TypingAnimation/> : <p>{props.text}</p>}
	</div>
	)
};

/**
* A functional component that renders the typing animation if the bot is typing.
*/
function TypingAnimation(props) {
	return (
		<div id="wave">
			<span className="dot"></span>
			<span className="dot"></span>
			<span className="dot"></span>
		</div>
	)
};


/**
* A class component which receives a grouped messages array and decouples it between the user and the bot.
* A child of the Chat component.
*/
class Exchange extends Component {

	constructor(props) {
		super(props);
	}
	
	render(props) {
		const messages = this.props.group.messages.map((text, i) => (
			<Message
				fontSize={this.props.fontSize}
				key={i}
				text={text}/>
		));
		return (
			<div className={`group group-${this.props.group.isUser ? 'user' : 'bot'}`}>
				{messages}
			</div>
		);
	}
}
export default Exchange;
