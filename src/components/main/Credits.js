import React from 'react';
import Share from './Share'

function Credits(props)  {
	return (
		<div className={props.creditsClass} style={{height: `${props.dialogHeight}px`}}>
			<div className='text' style={{fontSize: `${props.fontSize}px`}}>
				<p>This project as conceived and executed by <a href="https://www.foreignobjects.net/" rel="noopener noreferrer" target="_blank" >FOREIGN OBJECTS</a>, is a design and research studio exploring the internet through the production of cultural artifacts. We build environments, tools and discourses that imagine new ways of living with the web.</p> 
				<p>This is an <a href="https://github.com/Kallirroi/bot_or_not" rel="noopener noreferrer" target="_blank" >open source project</a>.</p> 
				<p>We received financial support from Mozilla for this project. The contents do not necessarily reflect the views of Mozilla and do not speak for or on behalf Mozilla.</p> 
				<Share />
			</div>
		</div>
	);
}

export default Credits;
