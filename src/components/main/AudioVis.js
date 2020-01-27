import React, {Component} from 'react';
import { ReactMic } from 'react-mic';

class AudioVis extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
	      record: false
	    }
	}
	
	startRecording = () => {
		console.log('started recording')
		this.setState({ record: true });
	}

	stopRecording = () => {
		this.setState({ record: false });
	}

	onData(recordedBlob) {
		console.log('chunk of real-time data is: ', recordedBlob);
	}

	onStop(recordedBlob) {
		console.log('recordedBlob is: ', recordedBlob);
	}

	render(props) {
		return (
			<div className="narrator" style={{height: `${this.props.dialogHeight}px`}}>
				<ReactMic
		          record={true}
		          visualSetting="frequencyBars"
		          className="sound-wave"
		          onStop={this.onStop}
		          onData={this.onData}
		          strokeColor="#FF2D55"
		          backgroundColor="#fff" />
			</div>
		);
	}
}

export default AudioVis;
