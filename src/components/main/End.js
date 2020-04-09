import React from 'react';

function End(props)  {
	return (
		<div className={props.endClass} style={{height: `${props.dialogHeight}px`}}>
			<div className="end-top" style={{fontSize: `${props.fontSizeTop}rem`}}>{props.headline}</div>
			<div className="end-bottom" style={{fontSize: `${props.fontSizeBottom}rem`}}>{props.text}</div>
		</div>
	);
}

export default End;
