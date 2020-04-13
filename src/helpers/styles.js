export const fontSizes = (height, innerHeight) => {
    /*
    * FONT SIZES
    */     
    const baseFontSize = height/innerHeight*18;
    const mediumFontSize = height/innerHeight*24;
    const largeFontSize = height/innerHeight*48;

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
    /*
    * OUR THEME
    */  
    const appTheme = 'theme2'
    const containerTheme = 'theme1'
    const componentTheme = 'theme2'
    const chatTheme = 'theme3'
    /*
    * TOP
    */      
    const appClass = `App ${appTheme}`;
    const containerClass = `container ${containerTheme}`;
    const headerClass = main !== 'Chat' ?  `header ${componentTheme}` : `header ${chatTheme}`; // handling Header consistency with Chat
    /*
    * MAIN
    */     
    const narratorClass = `narrator ${componentTheme}`;
    const narratorWaitClass = `narrator ${componentTheme} wait`;
    const chatClass = `messages-wrapper ${chatTheme}`;
    const endClass = `end ${componentTheme}`;
    const aboutClass = `about ${componentTheme}`;
    const creditsClass = `credits ${componentTheme}`;
    /*
    * INPUT
    */  
    const placeHolderText = step === 3 ? 'Enter your name' : 'Say something...'
    const singleButtonClass = main === 'NarratorWait' ? `single-button ${componentTheme} wait` : `single-button ${componentTheme}`
    const doubleButtonClass = `double-button ${componentTheme}`
    const messageBarClass = `text-form ${componentTheme}`

    return {appClass, containerClass, headerClass, narratorClass, narratorWaitClass, chatClass, endClass, aboutClass, creditsClass, placeHolderText, singleButtonClass, doubleButtonClass, messageBarClass}
}
