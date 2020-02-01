import React from 'react';

function DoubleButton(props) {
	return(
		<div onClick={props.click} className='double-button'>
			<div className='single-button'>
				<p>{props.button1}</p>
			</div>
			<div className='single-button'>
				<p>{props.button2}</p>
			</div>
		</div>
	);
}
export default DoubleButton;
