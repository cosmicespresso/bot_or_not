import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Exchange from './Exchange';

class Chat extends Component {

	/**
	* A function that takes care of automatically scrolling to the most recent text exchange.
	*/
	scrollToBottom = () => {
		const end = ReactDOM.findDOMNode(this.scrollTarget);
		// end.scrollIntoView({ behavior: 'smooth', block: 'nearest'})
		end.parentNode.scrollTop = end.offsetTop;
	}

	componentDidUpdate() {
		this.scrollToBottom();
	}

	render(props) {
		let groups = [];
		let group, lastMsgIsUser;

		/**
		* A loop that builds the messages array which will be passed onto the Exchange child.
		*/
		for (let msg of this.props.messages) {
			// next group
			if (lastMsgIsUser !== msg.isUser) {
				lastMsgIsUser = msg.isUser;
				group = {isUser: msg.isUser, messages: []};
				groups.push(group);
			}
			group.messages.push(msg.text);
		}

		/**
		* ???????? 
		*/
		if (this.props && this.props.isBotTyping) {
			const endIndex = groups.length - 1;
			if (groups !== undefined && groups[endIndex].isUser) {
				groups.push({isUser: false, messages: [null]});
			} else {
				groups[endIndex].messages.push(null);
			}
		}

		return (
			<div 
				className={this.props.chatClass} 
				style={{height: `${this.props.dialogHeight}px`}} >
				<div className="messages">
					{groups.map((group, i) =>
						<Exchange fontSize={this.props.fontSize} key={i} group={group}/>
					)}
						<div style={{ float: "left", clear: "both" }} ref={el => this.scrollTarget = el} > </div>
				</div>
			</div>
	            
		);
	}
}
export default Chat;
