import React from 'react';

function SingleButton(props) {
	return(
		<div id={props.step === 19 ? 'learn-more-tag' : null} onClick={props.click} className={props.singleButtonClass}>
			<p style={{fontSize: `${props.fontSize}px`}}> {props.buttonText}</p>
		</div>
	);
}
export default SingleButton;
