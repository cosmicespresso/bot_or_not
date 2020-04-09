import React from 'react';

function Header(props) {
	return(
		<header className={props.headerClass}>
			<span style={{color: props.color}} className='text'>{props.title}</span>
		</header>
	);
}

export default Header;

