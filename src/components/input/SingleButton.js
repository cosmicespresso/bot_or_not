import React from 'react';

function SingleButton(props) {
	return(
		<div onClick={props.click} className={props.singleButtonClass}>
			<p style={{fontSize: `${props.fontSize}px`}}> {props.buttonText}</p>
		</div>
	);
}
export default SingleButton;
