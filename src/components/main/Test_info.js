import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class Test_info extends Component {
	render() {
		return (
			<div className="messages-wrapper" style={{height: `${this.props.dialogHeight}px`}}>
				Info!!
			</div>
		);
	}
}
export default Test_info;
