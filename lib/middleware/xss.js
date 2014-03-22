
module.exports = function XssConstructor(opts) {

	opts = opts || {};
	opts.blockMode = opts.blockMode !== false;
    
	return function xss(req, res, next){
	    
        // self-awareness
        if (req._esecurity_xss)
            return next();

        req._esecurity_xss = true;
        
        var xssHeader = ['1'];
        
        if (opts.blockMode) xssHeader.push('mode=block');
        
        res.set('X-XSS-Protection', xssHeader.join(';'));
        
        return next();
    };
};
