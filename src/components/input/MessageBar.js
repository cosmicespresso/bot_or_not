import React, {Component} from 'react';
import {EntypoPaperPlane} from 'react-entypo';

class MessageBar extends Component {
	
	constructor(props) {
		super(props);
		this.state = {value: ''};
	}

	handleChange = (e) => {
		const value = e.target.value;
		if (value.length >= 256) {
			alert('You have reached 256 character limit!');
		}
		this.setState({value});
	}

	handleSubmit = (e) =>{
		e.preventDefault();
		this.props.onSubmit(this.state.value);
		this.setState({value: ''});
	}

	componentDidMount() {
		this._text.focus();
	}

	render(props) {
		console.log(props)
		
		return (
			<div>
				<form className={props ? props.messageBarClass : 'text-form'} onSubmit={this.handleSubmit}>
					<input className="text-input"
						 type="search"
						 name="inputText"
						 placeholder={this.props.placeholder}
						 value={this.state.value}
						 ref={input => this._text = input}
						 onChange={this.handleChange}
						 autoComplete={'off'}
						 required />
					<button className="btn-send" type="submit" value="Send">
						<EntypoPaperPlane/>
					</button>
				</form>
	    </div>
		);
	}
}
export default MessageBar;
