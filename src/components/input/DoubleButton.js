import React from 'react';

function DoubleButton(props) {
	return(
		<div className='double-button'>
			<div onClick={props.click}  className='single-button'>
				<p>{props.button1}</p>
			</div>
			<div onClick={props.click}  className='single-button'>
				<p>{props.button2}</p>
			</div>
		</div>
	);
}
export default DoubleButton;
