import React from 'react';

function NarratorWait(props)  {
	return (
		<div className={props.narratorWaitClass} style={{height: `${props.dialogHeight}px`}}>
			<div className="field-top">{props.headline}</div>
		</div>
	);
}

export default NarratorWait;
