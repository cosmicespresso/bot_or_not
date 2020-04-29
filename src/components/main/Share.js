import React from 'react';
import twitter from '../../assets/twitter.svg'
import instagram from '../../assets/instagram.svg'
import email from '../../assets/email.svg'


function Share()  {
	return (
		<div>
				<h4>SHARE </h4>
				<div className='share'>
					<a id="twitter" href="https://www.foreignobjects.net/" rel="noopener noreferrer" target="_blank" > <img src={twitter} alt='twitter share' /> </a>
					<a id="instagram" href="https://www.foreignobjects.net/" rel="noopener noreferrer" target="_blank" ><img src={instagram} alt='instagram share' /> </a>
					<a id="email" href="https://www.foreignobjects.net/" rel="noopener noreferrer" target="_blank" > <img src={email} alt='email' /> </a>
				</div>
		</div>
	);
}

export default Share;
