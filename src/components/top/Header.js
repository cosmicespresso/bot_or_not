import React, {Component} from 'react';

class Header extends Component {
	constructor(props) {
		super(props);
      
		this.state = {
			title: props.title || 'Truth or Dare Turing Test'
		};
	}

	render(){
		return(
			<header onClick={this.props.onClick}>
				<h1>{this.state.title}</h1>
			</header>
		);
	}
}
export default Header;
