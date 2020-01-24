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

	render() {
		return (
			<div className="narrator" style={{height: '200px'}}>
				<ReactMic
		          record={this.state.record}
		          className="sound-wave"
		          onStop={this.onStop}
		          onData={this.onData}
		          strokeColor="#000000"
		          backgroundColor="#FF4081" />
		        <button onClick={this.startRecording} type="button">Start</button>
		        <button onClick={this.stopRecording} type="button">Stop</button>
			</div>
		);
	}
}

export default AudioVis;
