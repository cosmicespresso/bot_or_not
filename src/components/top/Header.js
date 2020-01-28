import React, {Component} from 'react';

// function Header(props) {

// 	return(
// 		<header onClick={props.handleClick}>
// 			<h1>{props.title}</h1>
// 		</header>
// 	);
// }

class Header extends Component {
	render(props) {
		return(
				<header onClick={this.props.click}>
					<h1>{this.props.title}</h1>
				</header>
			);

		}

	}

export default Header;

