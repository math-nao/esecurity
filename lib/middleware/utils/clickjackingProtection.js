/*!
 * ESecurity
 * Copyright(c) 2013 Mathieu Naouache
 * MIT Licensed
 */
 
(function(){
    function clickJackingProtection(){
        document.write = false;
        
        window.top.location = window.self.location;
        
        setTimeout(function(){
            document.body.innerHTML = '';
        },0);
        
        window.self.onload = function(){
            document.body.innerHTML = '';
        }
    }
    
    if (window.top !== window.self) {
        try{
            window.top.location.host || clickJackingProtection();
        } catch(e){
            clickJackingProtection();
        }
    }
})();
