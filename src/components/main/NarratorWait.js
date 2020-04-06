import React from 'react';

function NarratorWait(props)  {
	return (
		<div className="narrator wait" style={{height: `${props.dialogHeight}px`}}>
			<div className="field-top">{props.headline}</div>
		</div>
	);
}

export default NarratorWait;
