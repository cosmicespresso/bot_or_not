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
		console.log('App.js called me');
		this.setState({ record: false });
	}

	componentDidMount() {
		console.log('AudioVis mounted');
		this.startRecording();
	}

	componentWillUnmount() {
		console.log('AudioVis unmounted');
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
		          className="field-top"
		          />
		          <div onClick={this.stopRecording} className='AudioVis-button'>
					<p>Stop recording</p>
				  </div>
			</div>
		);
	}
}

export default AudioVis;
