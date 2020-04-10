export const fontSizes = (height) => {
    /*
    * FONT SIZES
    */     
    const baseFontSize = height/window.innerHeight*18;
    const mediumFontSize = height/window.innerHeight*24;
    const largeFontSize = height/window.innerHeight*48;

    return {baseFontSize, mediumFontSize, largeFontSize}
}

export const fontColors = (main) => {
    const headerColor = main === 'Chat'  ? '#FF2D55' : '#00f';
    const narratorColor = "#00f";
    const endColor = '#00f';
    const aboutColor = '#00f';
    const creditsColor = '#00f';

    return {headerColor, narratorColor, endColor, aboutColor, creditsColor}
}

export const classNames = (main, step) => {

    const activeTheme = 'theme2'
    /*
    * TOP
    */      
    const appClass = `App ${activeTheme}`;
    const headerClass= `header ${activeTheme}`;
    /*
    * MAIN
    */     
    const narratorClass = `narrator ${activeTheme}`;
    const narratorWaitClass = `narrator ${activeTheme} wait`;
    const chatClass = `messages-wrapper ${activeTheme}`;
    const endClass = `end ${activeTheme}`;
    const aboutClass = `about ${activeTheme}`;
    const creditsClass = `credits ${activeTheme}`;
    /*
    * INPUT
    */  
    const placeHolderText = step === 3 ? 'Enter your name' : 'Say something...'
    const singleButtonClass = main === 'NarratorWait' ? `single-button ${activeTheme} wait` : `single-button ${activeTheme}`
    const doubleButtonClass = `double-button ${activeTheme}`
    const messageBarClass = `text-form ${activeTheme}`

    return {appClass, headerClass, narratorClass, narratorWaitClass, chatClass, endClass, aboutClass, creditsClass, placeHolderText, singleButtonClass, doubleButtonClass, messageBarClass}
}
