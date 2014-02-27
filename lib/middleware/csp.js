/*!
 * ESecurity
 * Copyright(c) 2011 Mathieu Naouache
 * MIT Licensed
 */
 
var util = require("util"),
    path = require("path"),
    fs = require("fs");

module.exports = function CspConstructor(opts) {

	opts = opts || {};
	opts.headers = opts.headers || ["standard"];
	opts.reportOnly = opts.reportOnly || false;
	opts.rules_secure = opts.rules_secure || false;
	opts.defaultSrc = opts.defaultSrc || false;
	opts.scriptSrc = opts.scriptSrc || false;
	opts.objectSrc = opts.objectSrc || false;
	opts.styleSrc = opts.styleSrc || false;
	opts.imgSrc = opts.imgSrc || false;
	opts.mediaSrc = opts.mediaSrc || false;
	opts.frameSrc = opts.frameSrc || false;
	opts.fontSrc = opts.fontSrc || false;
	opts.connectSrc = opts.connectSrc || false;
	opts.sandbox = opts.sandbox || false;
	opts.reportUri = opts.reportUri || false;
	opts.reportFilename = opts.reportFilename || "/tmp/esecurity_cspreport";
	opts.onReport = opts.onReport || onReport;
	
	if (!util.isArray(opts.headers))
	    opts.headers = [opts.headers];
	
	opts.headers.forEach(function(header, key){
	    opts.headers[key] = String(header).toLowerCase();
	});
	
	if (opts.rules_secure) {
	    opts.defaultSrc = ["none"];
	    opts.scriptSrc = ["self", "www.google-analytics.com", "ajax.googleapis.com"];
	    opts.objectSrc = false;
	    opts.styleSrc = ["self"];
	    opts.imgSrc = ["self"];
	    opts.mediaSrc = ["self"];
	    opts.frameSrc = false;
	    opts.fontSrc = false;
	    opts.connectSrc = ["self"];
	    opts.sandbox = false;
	}
	
	function onReport(data) {
	    data = JSON.stringify(data || {});
	    
	    if ("" === data)
	        return;
	    
	    fs.appendFile(opts.reportFilename, "[" + new Date() + "] " + data + "\n", function (err) {
          if (err) throw err;
        });
	}
    
	return function csp(req, res, next){
	    
        // self-awareness
        if (req._esecurity_csp)
            return next();

        req._esecurity_csp = true;
        
        if (opts.reportUri && opts.onReport && "POST" === req.method && opts.reportUri === req.path) {
            opts.onReport(req.body)
            return res.send(200);
        }
        
        var sanitize = function(src) {
            var srcSanitized = [];
            
            if (!util.isArray(src))
                src = [src];
            
            src.forEach(function(elem) {
                elem = String(elem).trim();
                switch (elem.toLowerCase()) {
                    case "none":
                        srcSanitized.push("'none'");
                        break;
                    case "self":
                        srcSanitized.push("'self'");
                        break;
                    case "unsafe-inline":
                        srcSanitized.push("'unsafe-inline'");
                        break;
                    case "unsafe-eval":
                        srcSanitized.push("'unsafe-eval'");
                        break;
                    default:
                        srcSanitized.push(elem);
                }
            });
            
            return srcSanitized.join(" ");
        };
        
        var cspHeader = [];
        
        if (opts.defaultSrc) cspHeader.push('default-src ' + sanitize(opts.defaultSrc));
        if (opts.scriptSrc) cspHeader.push('script-src ' + sanitize(opts.scriptSrc));
        if (opts.objectSrc) cspHeader.push('object-src ' + sanitize(opts.objectSrc));
        if (opts.styleSrc) cspHeader.push('style-src ' + sanitize(opts.styleSrc));
        if (opts.imgSrc) cspHeader.push('img-src ' + sanitize(opts.imgSrc));
        if (opts.mediaSrc) cspHeader.push('media-src ' + sanitize(opts.mediaSrc));
        if (opts.frameSrc) cspHeader.push('frame-src ' + sanitize(opts.frameSrc));
        if (opts.fontSrc) cspHeader.push('font-src ' + sanitize(opts.fontSrc));
        if (opts.connectSrc) cspHeader.push('connect-src ' + sanitize(opts.connectSrc));
        if (opts.sandbox) cspHeader.push('sandbox ' + sanitize(opts.sandbox));
        if (opts.reportUri) cspHeader.push('report-uri ' + sanitize(opts.reportUri));
        
        /*if (!cspHeader.length)
            return next();*/
            
        var headerNames = [];
        
        if (~opts.headers.indexOf("standard"))
            headerNames.push("Content-Security-Policy");
        
        if (~opts.headers.indexOf("experimental"))
            headerNames = headerNames.concat(["X-Content-Security-Policy", "X-Webkit-CSP"]);
        
        headerNames.forEach(function(header) {
            if (opts.reportOnly) header += "-Report-Only";
            res.set(header, cspHeader.join(";"));
        });
        
        return next();
    };
};
