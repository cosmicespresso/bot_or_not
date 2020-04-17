import React from 'react';

function About(props)  {
	return (
		<div className={props.aboutClass} style={{height: `${props.dialogHeight}px`}}>
			<div className='text' style={{fontSize: `${props.fontSize}px`}}>
				<p>Chatbots have been around for almost as long as computers. The game you just played is a kind of "Turing test", named after the pioneering computer scientist, Alan Turing, who planted the seed of the modern chatbot in 1950 with a simple question: can machines think? Or, to put it more mundanely, could a machine convince a human, through conversation, that it was actually human?</p> 			
				<p>Seventy years later, the implications of Turing's "imitation game" are more than merely philosophical. Looking at today's technological landscape, it seems clear that these autonomous, artificial conversational agents, or chatbots, are here to stay. Primitive chatbots are everywhere, from Russian bots on Twitter to "smart" voice assistants in our homes to personal therapy bots who respond to our most intimate thoughts by text. </p> 
				<p>Of course, not all of these bots are designed to deceive users into thinking they're human, but many of them are designed to imitate human-like behaviour, to great effect. As language and speech processing technologies improve, many chatbots are already integrating seamlessly into roles once inhabited by humans, at times interacting with other people on our behalf. Whether or not they are transparent about their non-human nature, chatbots exert an increasing amount of agency in a mediated world, and we need to be aware of this.</p>
			</div>
		</div>
	);
}

export default About;
