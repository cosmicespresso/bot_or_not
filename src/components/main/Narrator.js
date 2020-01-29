import React from 'react';

function Narrator(props)  {
	return (
		<div className="narrator" style={{height: `${props.dialogHeight}px`}}>
			<div className="field-top">{props.headline}</div>
			<div className="field-bottom">{props.text}</div>
		</div>
	);
}

export default Narrator;
