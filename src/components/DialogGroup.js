import React, {Component} from 'react';

const Message = (props) => (
	<div
		className="message">
		{props.text === null ? <TypingAnimation/> : <p>{props.text}</p>}
	</div>
);

const TypingAnimation = (props) => (
	<div id="wave">
		<span className="dot"></span>
		<span className="dot"></span>
		<span className="dot"></span>
	</div>
);


class DialogGroup extends Component {
	render() {
		const messages = this.props.group.messages.map((text, i) => (
			<Message
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
export default DialogGroup;
