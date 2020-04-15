import React from 'react';

function Header(props) {
	return(
		<header className={props.headerClass}> 
			<p style={{color: props.color, fontSize: `${props.fontSize}px`}} className='text'>{props.title}</p>
		</header>
	);
}

export default Header;

