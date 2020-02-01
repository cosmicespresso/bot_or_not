import React from 'react';

function SingleButton(props) {
	return(
		<div onClick={props.click} className='single-button'>
			<p>{props.buttonText}</p>
		</div>
	);
}
export default SingleButton;
