import React from 'react';

function Header(props) {

	return(
		<header>
			<span className='text'>{props.title}</span>
		</header>
	);
}

export default Header;

