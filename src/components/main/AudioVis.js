import React, {Component} from 'react';
import { ReactMic } from '@cleandersonlobo/react-mic';


class AudioVis extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
	      record: false
	    }
	}

	startRecording = () => {
    this.setState({
      record: true
		});
	}

	stopRecording = () => {
		this.setState({
	  	record: false
		});
	}

	onData(recordedBlob) {
		console.log('chunk of real-time data is: ', recordedBlob);
	}

	onStop(recordedBlob) {
		console.log('recordedBlob is: ', recordedBlob);
	}

	componentDidMount() {
		console.log('AudioVis mounted, starting recording');
	}

	componentWillUnmount() {
		console.log('AudioVis unmounted, stopping recording');
	}

	render(props) {
		return (
			<div className="narrator" style={{height: `${this.props.dialogHeight}px`}}>
				<ReactMic
		          record={this.state.record}
		          onStop={this.onStop}
		          onData={this.onData}
		          visualSetting='frequencyBars'
		          className="sound-wave"
		          strokeColor="#FF2D55"
		          backgroundColor="#fff"
		          className="field-top"
		          />
		          <button onClick={this.startRecording} type="button">Start</button>
        		  <button onClick={this.stopRecording} type="button">Stop</button>
			</div>
		);
	}
}

export default AudioVis;
