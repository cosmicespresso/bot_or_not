import React from 'react';

function Round(props)  {
	return (
		<div className="round" style={{height: `${props.dialogHeight}px`}}>
			<div className="round-top">{props.headline}</div>
			<div className="round-bottom">{props.text}</div>
		</div>
	);
}

export default Round;
