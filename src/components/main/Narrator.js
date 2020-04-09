import React from 'react';

function Narrator(props)  {
	return (
		<div className={props.narratorClass} style={{height: `${props.dialogHeight}px`}}>
			<div className="field-top">{props.headline}</div>
		</div>
	);
}

export default Narrator;
