import React, {Component} from 'react';
import AudioRecorder from 'react-audio-recorder';

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

	simulateClick = (e) => {
		e.click()
	}

	componentDidMount() {
		console.log('AudioVis mounted, starting recording');
		// this.startRecording();
	}

	componentWillUnmount() {
		console.log('AudioVis unmounted, stopping recording');
	}

	render(props) {
		return (
			<div className="narrator" style={{height: `${this.props.dialogHeight}px`}}>
				<AudioRecorder />
			</div>
		);
	}
}

export default AudioVis;
