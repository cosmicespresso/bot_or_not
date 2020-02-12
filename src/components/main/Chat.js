import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Exchange from './Exchange';
import { ReactMic } from '@cleandersonlobo/react-mic';

class Chat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			record: false
		}
	}

	scrollToBottom = () => {
		const end = ReactDOM.findDOMNode(this.scrollTarget);
		end.scrollIntoViewIfNeeded({behavior: 'smooth'});
	}

	startRecording = () => {
		console.log('start recording')
    	this.setState({
      		record: true
		});
	}

	stopRecording = () => {
		console.log('stop recording')
		this.setState({
	  		record: false
		});
	}

	onStop(recordedBlob) {
		console.log('recordedBlob is: ', recordedBlob);
	}

	componentDidMount() {
		if (this.props.choice === 'Dare') this.startRecording();
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

		let displayChat = !this.state.record ? 'visible' :'none';
		let displayAudioVis = this.state.record ? 'flex' : 'none';

		return (
			<div> 
				{/* ---- Chat ---- */}
				<div style={{display: displayChat , height: `${this.props.dialogHeight}px`}} 
					className="messages-wrapper" >
					<div className="messages">
						{groups.map((group, i) =>
							<Exchange key={i} group={group}/>
						)}
						<div style={{ float: "left", clear: "both" }} ref={el => this.scrollTarget = el} > </div>
					</div>
				</div>
	            
				{/* ---- AudioVis ---- */}
	            <div className="narrator" style={{display: displayAudioVis, height: `${this.props.dialogHeight}px`}}>
					<ReactMic
			          record={this.state.record}
			          onStop={this.onStop}
			          visualSetting='frequencyBars'
			          className="sound-wave"
			          strokeColor="#FF2D55"
			          backgroundColor="#fff"
			          />
					<div onClick={this.stopRecording} className='AudioVis-button '>
						<p>Stop</p>
					</div>
				</div>
			</div>
		);
	}
}
export default Chat;
