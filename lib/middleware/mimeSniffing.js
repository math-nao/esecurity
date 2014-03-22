
module.exports = function MimeSniffingConstructor(opts) {

	opts = opts || {};
    
	return function mimeSniffing(req, res, next){
	    
        // self-awareness
        if (req._esecurity_mimesniffing)
            return next();

        req._esecurity_mimesniffing = true;        
        
        res.set('X-Content-Type-Options', 'nosniff');
        
        return next();
    };
};
