import React from 'react';

function About(props)  {
	return (
		<div className={props.aboutClass} style={{height: `${props.dialogHeight}px`}}>
			<div className='text' style={{fontSize: `${props.fontSize}px`}}>
				
				<h4>WHO WAS I TALKING WITH?</h4>
				<p>The game you just played is a kind of "Turing Test", named after the pioneering computer scientist, <a href="https://en.wikipedia.org/wiki/Alan_Turing" rel="noopener noreferrer" target="_blank">Alan Turing</a>, who wanted to understand if a machine could convince someone that it was actually human.</p> 	
				<p>Today, more and more sophisticated bots are proliferating online and off, and it's getting harder to tell who's human. While this technology can be useful, it can also be used dishonestly: either through scam bots on Tinder and Instagram, or corporate bots that steal your data.</p> 
				
				<h4>LEARN MORE</h4>
				<p>There is a ton to learn about bots - particularly how to identify them - which you can explore by visiting <a href="https://about.botor.no/" rel="noopener noreferrer" target="_blank">about.botor.no</a>.</p> 

				<h4>DISCLAIMER</h4>
				<p><emph>This particular</emph> bot does not record your conversation or store any information about you. However, this website does use Google Analytics to identify the kind of device you visited with, and where you accessed it from.</p>
			</div>
		</div>
	);
}

export default About;
