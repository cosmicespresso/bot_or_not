import React from 'react';
import twitter from '../../assets/twitter.svg'
import instagram from '../../assets/instagram.svg'
import email from '../../assets/email.svg'

function SocialMediaButton(props) {
	return(
		<div className='single-button'>
			<p>Share 
				<span className='icons'>
					<img src={twitter} height='45%' alt='twitter share' /> 
					<img src={instagram} height='45%' alt='instagram share' /> 
					<img src={email} height='45%' alt='email' /> 
				</span>
			</p>
		</div>
	);
}
export default SocialMediaButton;
