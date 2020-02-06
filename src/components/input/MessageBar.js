import React, {Component} from 'react';
import {EntypoMic} from 'react-entypo';
import Audio from './Audio';

class MessageBar extends Component {
	constructor(props) {
		super(props);
		this.state = {value: ''};
	}
	
	handleAudio = (e) => {
		console.log('done listening to audio')
		const last = e.results.length - 1;
		this.setState((prevState, props) => {
			return {
				value: prevState.value + e.results[last][0].transcript
			};
		});
	}

	handleChange = (e) => {
		const value = e.target.value;
		if (value.length >= 256) {
			alert('You have reached 256 character limit!');
		}
		this.setState({value});
	}

	handleListen = () =>{
		console.log('listening to audio')
		this.audio.listen();
	}

	handleSubmit = (e) =>{
		e.preventDefault();
		this.props.onSubmit(this.state.value);
		this.setState({value: ''});
	}

	componentDidMount() {
		this._text.focus();
		this.audio = new Audio(this.handleAudioStart, this.handleAudio, this.handleAudioError);
	}

	render() {
		return (
			<div>
				<form className="text-form" onSubmit={this.handleSubmit}>
					<input className="text-input"
								 type="search"
								 name="inputText"
								 placeholder="Your message"
								 value={this.state.value}
								 ref={input => this._text = input}
								 onChange={this.handleChange}
								 autoComplete={'off'}
								 required />
					<button className="btn-voice" type="button" value="Voice" onClick={this.handleListen}>
						<EntypoMic/>
					</button>
				</form>
	      	</div>
		);
	}
}
export default MessageBar;
