export const maxWindowHeight = 700;
export const maxAppHeight = 680;

export const handleResize = (e) => {
    const window = e.target || e;
    
    const y = window.innerHeight > maxWindowHeight 
              ? maxAppHeight 
              : window.innerHeight; 
    
    const header = document.querySelector('.container header');
    
    const input = document.querySelector('.container .text-form') 
                || document.querySelector('.container .single-button') 
                || document.querySelector('.container .double-button');
    
    let dialogHeight = y - 2*header.offsetHeight - input.offsetHeight - 5; /*ULTRA HACKY*/
    return dialogHeight;
}