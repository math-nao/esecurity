
var 
    utils = require('../utils'),    
    crypto = require('crypto');

module.exports = function AngularXsrfConstructor(opts) {

    opts = opts || {};
    opts.skip = opts.skip || function(req, res) {};
    opts.cookie = opts.cookie || {};
    opts.cookie.path = opts.cookie.path || '/';
    opts.log = opts.log || false;
    
    // Angular needs to read the cookie
    opts.cookie.httpOnly = false;
    
    var isLogEnable = "function" === typeof opts.log;
    
    return function angularXsrf(req, res, next){
        
        // self-awareness
        if (req._esecurity_angularxsrf)
            return next();

        req._esecurity_angularxsrf = true;
        
        if ("function" == typeof opts.skip && opts.skip(req, res))
            return next();
        
        var 
            generateToken = function() {
                return crypto.createHash('sha1').update(
                            crypto.randomBytes(35)
                        ).digest('hex');
            },
            addXsrfCookie = function() {
                res.cookie(
                    'XSRF-TOKEN',
                    req.xsrfToken(),
                    opts.cookie
                );
            },
            getXsrfToken = function(type) {
                type = type || 'req';
                
                if ('req' === type)
                    return req.get('x-xsrf-token')
                            || (req.method === 'POST' && req.body && (req.body['xsrf-token'] || req.body['XSRF-TOKEN']))
                            || (req.method !== 'POST' && req.query && (req.query['xsrf-token'] || req.query['XSRF-TOKEN']));
                else if ('session' === type)
                    return req.session && req.session._esecurity_xsrf;
                
                return false;
            };
        
        // get token
        req.xsrfToken = function() {
            return req.session._esecurity_xsrf || (req.session._esecurity_xsrf = generateToken());
        };
        
        switch (req.method) {
            case 'OPTIONS':
            case 'HEAD':
                break;
            case 'GET':
                if (!getXsrfToken('req') || !getXsrfToken('session')) {
                    addXsrfCookie();
                    return next();
                }
            default:
                if (!getXsrfToken('req') || !getXsrfToken('session') || getXsrfToken('req') !== getXsrfToken('session'))
                    return next(utils.error(403, 'XSRF token does not match.')) && isLogEnable && opts.log('[' + req.ip + '] - 403 - XSRF token does not match.', req);
                
                break;
        }
        
        return next();
    };
};
