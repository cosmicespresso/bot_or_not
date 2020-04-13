import React, {Component} from 'react';
import {EntypoPaperPlane} from 'react-entypo';

class MessageBar extends Component {
	
	constructor(props) {
		super(props);
		this.state = {value: ''};
	}

	handleChange = (e) => {
		e.preventDefault();
		console.log('innerHeight', window.innerHeight, 'dialogHeight', this.props.dialogHeight)
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
		
		return (
			<div>
				<div style={{float: 'left'}}>{this.props.dialogHeight}, {window.innerHeight} </div>
				<form className={this.props.messageBarClass} onSubmit={this.handleSubmit}>
					<input className="text-input"
						style={{fontSize: `${this.props.fontSize}px`}}
						type="search"
						name="inputText"
						placeholder={this.props.placeholder}
						value={this.state.value}
						ref={input => this._text = input}
						onChange={this.handleChange}
						autoComplete={'off'}
						required />
					<button className="btn-send" type="submit" value="Send" style={{fontSize: `${this.props.buttonSize}px`}}>
						<EntypoPaperPlane style={{padding: '2px'}}/>
					</button>
				</form>
	    </div>
		);
	}
}
export default MessageBar;
