/*!
 * ESecurity
 * Copyright(c) 2013 Mathieu Naouache
 * MIT Licensed
 */
    
module.exports = function CorsConstructor(opts) {

	opts = opts || {};
	opts.origin = opts.origin || '*';
	opts.credentials = opts.credentials || false;
	opts.methods = opts.methods || ['GET', 'PUT', 'POST', 'DELETE'];
	opts.headers = opts.headers || ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'];
	opts.exposeHeaders = opts.exposeHeaders || false;
	opts.maxAge = opts.maxAge || 0;
	
	'string' === typeof opts.methods && (opts.methods = opts.methods.split(','));
	'string' === typeof opts.headers && (opts.headers = opts.headers.split(','));
	
	// ensure methods are in uppercase
	opts.methods.forEach(function(method, key) {
	    opts.methods[key] = String(method).toUpperCase();
	});
    
	return function cors(req, res, next){
	    
        // self-awareness
        if (req._esecurity_cors)
            return next();

        req._esecurity_cors = true;
        
        // Exit if it is a same-origin request
        if (!req.get('origin'))
            return next();
            
        // check allowed origin
        if ('*' !== opts.origin && req.get('origin') !== opts.origin)
            return next();
            
        // handle preflight requests
        if ('OPTIONS' === req.method) {
        
            // check allowed methods
            if (!~opts.methods.indexOf(req.get('access-control-request-method')))
                return next();
                
            // check allowed headers
            var headersAllowed = false;
            req.get('access-control-request-headers').split(',').some(function(header) {
                if (~opts.headers.indexOf(header)) {
                    headersAllowed = true;
                    return true;
                }
            });
            
            if (!headersAllowed)
                return next();
                
            // add CORS headers
            
            if (opts.credentials) {
                res.set('Access-Control-Allow-Origin', req.headers.origin);
                res.set('Access-Control-Allow-Credentials', 'true');
            }
            else {
                res.set('Access-Control-Allow-Origin', opts.origin);
            }
            
            if (opts.maxAge)
                res.set('Access-Control-Max-Age', opts.maxAge);
            
            res.set('Access-Control-Allow-Methods', opts.methods.join(','));
            res.set('Access-Control-Allow-Headers', opts.headers.join(','));
            
            if (opts.exposeHeaders)
                res.set('Access-Control-Expose-Headers', opts.exposeHeaders.join(','));
            
            res.send(204);
        }
        else {
            if (opts.credentials) {
                res.set('Access-Control-Allow-Origin', req.headers.origin);
                res.set('Access-Control-Allow-Credentials', 'true');
            }
            else {
                res.set('Access-Control-Allow-Origin', opts.origin);
            }
            
            return next();
        }
    };
};
