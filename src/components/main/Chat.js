import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Exchange from './Exchange';
import AudioVis from './AudioVis';

class Chat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showAudioVis: false
		}
	}

	scrollToBottom = () => {
		const end = ReactDOM.findDOMNode(this.scrollTarget);
		end.scrollIntoViewIfNeeded({behavior: 'smooth'});
	}

	audioStop = () => {
		console.log('click')
		this.setState({showAudioVis: false})
	}

	componentDidMount() {
		setTimeout(() => { 
			this.setState({ showAudioVis: this.props.choice === 'Dare' ? true : false})
		}, 2000);
	}

	render() {
		let groups = [];
		let group, lastMsgIsUser;
		for (let msg of this.props.messages) {
			// next group
			if (lastMsgIsUser !== msg.isUser) {
				lastMsgIsUser = msg.isUser;
				group = {isUser: msg.isUser, messages: []};
				groups.push(group);
			}
			group.messages.push(msg.text);
		}

		// bot is typing
		if (this.props.isBotTyping) {
			const endIndex = groups.length - 1;
			if (groups[endIndex].isUser) {
				groups.push({isUser: false, messages: [null]});
			} else {
				groups[endIndex].messages.push(null);
			}
		}
		console.log('show audio vis', this.state.showAudioVis)
		return (
			<div> 
				<div className="messages-wrapper" 
					style={{display: !this.state.showAudioVis ? 'visible' :'none', height: `${this.props.dialogHeight}px`}}>
					<div className="messages">
						{groups.map((group, i) =>
							<Exchange key={i} group={group}/>
						)}
						<div style={{ float: "left", clear: "both" }} ref={el => this.scrollTarget = el} />
					</div>
				</div>
	            <AudioVis 
	            	visible={this.state.showAudioVis}
	            	dialogHeight={this.props.dialogHeight}
	            	audioStop={this.audioStop}
	            />
			</div>
		);
	}
}
export default Chat;
