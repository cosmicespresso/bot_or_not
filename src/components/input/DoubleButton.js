import React from 'react';

function DoubleButton(props) {
	return(
		<div className={props.doubleButtonClass}>
			<div onClick={props.click}  className='single-button'>
				<p style={{fontSize: `${props.fontSize}rem`}}>{props.button1}</p>
			</div>
			<div onClick={props.click}  className='single-button'>
				<p style={{fontSize: `${props.fontSize}rem`}}>{props.button2}</p>
			</div>
		</div>
	);
}
export default DoubleButton;
