import React from 'react';

function End(props)  {
	return (
		<div className={props.endClass} style={{height: `${props.dialogHeight}px`}}>
			<div className="end-top">{props.headline}</div>
			<div className="end-bottom">{props.text}</div>
		</div>
	);
}

export default End;
