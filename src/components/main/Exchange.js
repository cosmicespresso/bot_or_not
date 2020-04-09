import React, {Component} from 'react';

function Message(props) {
	return (
		<div className="message" style={{fontSize: `${props.fontSize}rem`}}>
		{props.text === null ? <TypingAnimation/> : <p>{props.text}</p>}
	</div>
	)
};

function TypingAnimation(props) {
	return (
		<div id="wave">
			<span className="dot"></span>
			<span className="dot"></span>
			<span className="dot"></span>
		</div>
	)
};

class Exchange extends Component {
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
