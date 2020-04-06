import React from 'react';

function About(props)  {
	return (
		<div className="about" style={{height: `${props.dialogHeight}px`}}>
			<div className='text'>
				<p style={{color: '#FF2D55'}}>Who is on the other end?</p> 
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. A condimentum vitae sapien pellentesque. Et malesuada fames ac turpis egestas. Dictum varius duis at consectetur lorem donec massa. In ante metus dictum at tempor commodo ullamcorper a. Pretium quam vulputate dignissim suspendisse in est ante. </p> 			
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. A condimentum vitae sapien pellentesque. Et malesuada fames ac turpis egestas. Dictum varius duis at consectetur lorem donec massa. In ante metus dictum at tempor commodo ullamcorper a. Pretium quam vulputate dignissim suspendisse in est ante. </p> 
				
				<p style={{color: '#FF2D55'}}>CREDITS</p> 
				<div>FOREIGN OBJECTS (<a href="https://www.foreignobjects.net/" target="_blank">link</a>)</div> 
				<div>The Mozilla Foundation (<a href="https://foundation.mozilla.org/fr/" target="_blank">link</a>)</div> 

			</div>
		</div>
	);
}

export default About;
