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
		this.setState({ record: true });
	}	

	stopRecording = () => {
		this.setState({ record: false });
	}

	onStop(recordedBlob) {
		console.log('recordedBlob is: ', recordedBlob);
	}

	componentDidMount() {
		console.log('should start');
		this.startRecording();
	}

	componentWillUnmount() {
		console.log('should stop');
	}

	render(props) {
		return (
			<div className="narrator" style={{height: `${this.props.dialogHeight}px`}}>
				<ReactMic
		          record={this.state.record}
		          onStop={this.onStop}
		          visualSetting='frequencyBars'
		          className="sound-wave"
		          strokeColor="#FF2D55"
		          backgroundColor="#fff"
		          />
		          <button onClick={this.stopRecording} type="button">Stop</button>
			</div>
		);
	}
}

export default AudioVis;
