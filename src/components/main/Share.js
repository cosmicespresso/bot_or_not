import React from 'react';
import twitter from '../../assets/twitter.svg'
import instagram from '../../assets/instagram.svg'
import email from '../../assets/email.svg'
import facebook from '../../assets/facebook.svg'


function Share()  {

	const shareTexts = [
	  "blurb 1",
	  "blurb 2",
	  "blurb 3"
	];

	const url = 'https://www.botor.no/'

	function twitterShare() {
	  const text = shareTexts[Math.floor(Math.random() * (shareTexts.length - 1))];
	  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
	}	


	function facebookShare() {
	  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
	}
	return (
		<div>
				<h4>SHARE </h4>
				<div className='share'>
					<a id="twitter" href={twitterShare()} rel="noopener noreferrer" target="_blank" > <img src={twitter} alt='twitter share' /> </a>

					<a id="instagram" href="https://instagram.com/foreignobj" rel="noopener noreferrer" target="_blank" ><img src={instagram} alt='instagram share' /> </a>					
					
					<a id="facebook" href={facebookShare()} rel="noopener noreferrer" target="_blank" ><img src={facebook} alt='facebook share' /> </a>

					<a id="email" rel="noopener noreferrer"  href={`mailto:?subject=${encodeURIComponent("BOT OR NOT - Mozilla Creative Awards 2019")}&body=${encodeURIComponent("BOT OR NOT is a series of truth challenges where the player gets matched with an opponent and they have to guess if they are playing with a human or a bot.\n\n 🤖 https://www.botor.no/ 🤷‍♀️ \n\nCreated by FOREIGN OBJECTS as part of the Mozilla Creative Media Awards 2019 program. \nhttps://www.foreignobjects.net/")}`}><img src={email} alt='email' /></a>
				</div>
		</div>
	);
}

export default Share;
