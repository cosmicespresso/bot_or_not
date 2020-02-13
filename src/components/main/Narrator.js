import React from 'react';

function Narrator(props)  {
	return (
		<div className="narrator" style={{height: `${props.dialogHeight}px`}}>
			<div className="field-top">{props.headline}</div>
			<div className="field-bottom"  dangerouslySetInnerHTML={{__html: props.text}} />
		</div>
	);
}

export default Narrator;
