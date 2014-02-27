/*!
 * ESecurity
 * Copyright(c) 2011 Mathieu Naouache
 * MIT Licensed
 */

module.exports = function HstsConstructor(opts) {

	opts = opts || {};
	opts.maxAge = opts.maxAge || 365 * 24 * 60 * 60;
	opts.includeSudomains = opts.includeSudomains || false;
    
	return function hsts(req, res, next){
	    
        // self-awareness
        if (req._esecurity_hsts)
            return next();

        req._esecurity_hsts = true;
        
        if (!req.secure && !req._esecurity_hsts_test_bypass_ssl)
            return next();
        
        var hstsHeader = ['max-age=' + opts.maxAge];
        
        if (opts.includeSudomains) hstsHeader.push('includeSubDomains');
        
        
        res.set('Strict-Transport-Security', hstsHeader.join(';'));
        
        return next();
    };
};

