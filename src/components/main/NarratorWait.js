import React from 'react';

function NarratorWait(props)  {
	return (
		<div className={props.narratorWaitClass} style={{height: `${props.dialogHeight}px`}}>
			<div className="text" style={{fontSize: `${props.fontSize}rem`}}>{props.headline}</div>
		</div>
	);
}

export default NarratorWait;
