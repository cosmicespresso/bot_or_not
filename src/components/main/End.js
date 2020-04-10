import React from 'react';

function End(props)  {
	return (
		<div className={props.endClass} style={{height: `${props.dialogHeight}px`}}>
			<div className="end-top" style={{fontSize: `${props.fontSizeTop}px`}}>{props.headline}</div>
			<div className="end-bottom" style={{fontSize: `${props.fontSizeBottom}px`}}>{props.text}</div>
		</div>
	);
}

export default End;
