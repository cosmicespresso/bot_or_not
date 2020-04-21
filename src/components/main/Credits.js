import React from 'react';
import twitter from '../../assets/twitter.svg'
import instagram from '../../assets/instagram.svg'
import email from '../../assets/email.svg'


function Credits(props)  {
	return (
		<div className={props.creditsClass} style={{height: `${props.dialogHeight}px`}}>
			<div className='text' style={{fontSize: `${props.fontSize}px`}}>
				<p>We are grateful to the Mozilla Foundation for their support of this project with a <a href="https://foundation.mozilla.org/en/awards/" rel="noopener noreferrer" target="_blank" >Creative Media Award </a> in 2019. In particular, thank you to Jenn Beard, Brett Gaylor, and the other 2019 Creative Awards Recipients. </p> 
				<p>This project as conceived and executed by <a href="https://www.foreignobjects.net/" rel="noopener noreferrer" target="_blank" >FOREIGN OBJECTS</a>, is a design and research studio exploring the internet through the production of cultural artifacts. We build environments, tools and discourses that imagine new ways of living with the web.</p> 
				<h4>SHARE </h4>
				<div className='share'>
					<a href="https://www.foreignobjects.net/" rel="noopener noreferrer" target="_blank" > <img src={twitter} alt='twitter share' /> </a>
					<a href="https://www.foreignobjects.net/" rel="noopener noreferrer" target="_blank" ><img src={instagram} alt='instagram share' /> </a>
					<a href="https://www.foreignobjects.net/" rel="noopener noreferrer" target="_blank" > <img src={email} alt='email' /> </a>
				</div>
			</div>
		</div>
	);
}

export default Credits;
