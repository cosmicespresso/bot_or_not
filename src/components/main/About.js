import React from 'react';

function About(props)  {
	return (
		<div className={props.aboutClass} style={{height: `${props.dialogHeight}px`}}>
			<div className='text' style={{fontSize: `${props.fontSize}px`}}>
				<p>The game you just played is a kind of "Turing test", named after the pioneering computer scientist, Alan Turing, who wanted to understand if a machine convince someone that it was actually human?</p> 			
				<p>Today, more and more sophisticated bots are proliferating online and off, and it's getting harder to tell who's human. While this technology can be useful, it can also be used dishonestly: either through scam bots on Tinder and Instagram, or corporate bots that steal your data.</p> 
				<p>To read more about bots, including how to identify them, visit <a href="https://about.botor.no/">about.botor.no</a></p> 
				<p><i>this</i> bot not record your conversation or store any information about you. However, this website does use google analytics to identify the kind of device you visited with, and where you accessed it from.</p>
			</div>
		</div>
	);
}

export default About;
