import React from 'react';

function DoubleButton(props) {
	return(
		<div className='double-button'>
			<div id={props.step === 18 ? 'bot-tag' : null} onClick={props.click}  className={props.singleButtonClass}>
				<p style={{fontSize: `${props.fontSize}px`}}>{props.button1}</p>
			</div>
			<div id={props.step === 18 ? 'human-tag' : null} onClick={props.click}  className={props.singleButtonClass}>
				<p style={{fontSize: `${props.fontSize}px`}}>{props.button2}</p>
			</div>
		</div>
	);
}
export default DoubleButton;
