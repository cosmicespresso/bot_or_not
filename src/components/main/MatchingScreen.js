import React from 'react';

function MatchingScreen(props)  {
	return (
		<div className={props.narratorWaitClass} style={{height: `${props.dialogHeight}px`}}>
			<div className="text" style={{fontSize: `${props.fontSize}px`}}>{props.headline}</div>
		</div>
	);
}

export default MatchingScreen;
