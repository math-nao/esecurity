
module.exports = function ClickJackingConstructor(opts) {

	opts = opts || {};
	opts.deny = opts.deny || true;
	opts.sameOrigin = opts.sameOrigin || false;
	opts.allowFrom = opts.allowFrom || false;
	opts.jsUrl = opts.jsUrl || "clickjacking_protection.js";
    
	return function clickJacking(req, res, next){
	    
        // self-awareness
        if (req._esecurity_clickjacking)
            return next();

        req._esecurity_clickjacking = true;
        
        if (opts.jsUrl && opts.jsUrl.charAt(0) !== "/")
            opts.jsUrl = "/" + opts.jsUrl;
        
        if (opts.jsUrl && opts.jsUrl === req.url)
            return res.sendfile("utils/clickjackingProtection.js", {
                root: __dirname,
                maxAge: opts.maxAge
            });
            
        var frameOptions = "DENY";
        if (opts.sameOrigin) frameOptions = "SAMEORIGIN";
        else if (opts.allowFrom) frameOptions = "ALLOW-FROM " + opts.allowFrom;
        else if (opts.deny) frameOptions = "DENY";
        
        res.set("X-Frame-Options", frameOptions);
        
        return next();
    };
};