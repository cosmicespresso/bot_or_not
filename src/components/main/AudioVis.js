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

	onStop(props, recordedBlob) {
		console.log('recordedBlob is: ', recordedBlob);
	}

	render(props) {
		return (
			<div className="narrator" style={{display: this.props.visible ? 'flex' : 'none' , height: `${this.props.dialogHeight}px`}}>
				<ReactMic
		          record={this.state.record}
		          onStop={this.onStop}
		          onData={this.onData}
		          visualSetting='frequencyBars'
		          className="sound-wave"
		          strokeColor="#FF2D55"
		          backgroundColor="#fff"
		          />
        		  <div className='double-button'>
					<div onClick={() => {this.startRecording(); }}  className='AudioVis-button '>
						<p>Start</p>
					</div>
					<div  onClick={() => {this.stopRecording(); this.props.audioStop(); }}  className='AudioVis-button '>
						<p>Stop</p>
					</div>
				</div>
			</div>
		);
	}
}

export default AudioVis;
