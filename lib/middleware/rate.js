 
var utils = require('../utils');

module.exports = function RateConstructor(opts) {

	opts = opts || {};
	opts.rate = parseInt(opts.rate) || 100;
	opts.window = parseInt(opts.window) || 900;
	opts.enableHeaders = opts.enableHeaders || false;
	opts.keyZone = opts.keyZone || function(req) { return req.ip; };
    
	return function rate(req, res, next){
        
        if (!req.session) {
            console.log('esecurity.rate: Session support is needed');
            return next();
	    }
	    
        if (!req.route || !req.route.path) {
            console.log('esecurity.rate: Route path is needed');
            return next();
        }
        
        var keyZone = req.route.path + '::' + req.route.method; //opts.keyZone(req);
	    
        // self-awareness
        if (req._esecurity_rate && req._esecurity_rate[keyZone])
            return next();

        if (!req._esecurity_rate)
            req._esecurity_rate = {};
        
        req._esecurity_rate[keyZone] = true;
        
        if (!req.session._esecurity_rate)
            req.session._esecurity_rate = {};
        
		var rateLimitReached = true, currentTime = parseInt(Date.now() / 1E3);
		
        if (!req.session._esecurity_rate[keyZone])  
            req.session._esecurity_rate[keyZone] = { t: currentTime, v: 0 };
        
        if (currentTime - req.session._esecurity_rate[keyZone].t > opts.window) {
            req.session._esecurity_rate[keyZone].t = currentTime;
            req.session._esecurity_rate[keyZone].v = 0;
            rateLimitReached = false;
        }
        
        if (req.session._esecurity_rate[keyZone].v < opts.rate) {
            ++req.session._esecurity_rate[keyZone].v;
            rateLimitReached = false;
        }
        
        if (opts.enableHeaders) {
            // the rate limit ceiling for that given request
            res.set('X-Rate-Limit-Limit', Math.max(0, opts.rate));
            
            // the number of requests left for the N minute window
            res.set('X-Rate-Limit-Remaining', Math.max(0, opts.rate - req.session._esecurity_rate[keyZone].v));
            
            // the remaining window before the rate limit resets in UTC epoch seconds
            res.set('X-Rate-Limit-Reset', Math.max(0, req.session._esecurity_rate[keyZone].t + opts.window));
        }
        
        if (rateLimitReached)
            return next(utils.error(429, '{"errors": [{"code": 88, "message": "Rate limit exceeded"}]}'));
        
        return next();
    };
};
