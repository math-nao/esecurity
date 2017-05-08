
var 
    utils = require('../utils'),    
    crypto = require('crypto');

module.exports = function XsrfConstructor(opts) {

    opts = opts || {};
    opts.skip = opts.skip || function (req, res) {};
    opts.angular = opts.angular || false;
    opts.cookieName = opts.cookieName || '';
    opts.cookie = opts.cookie || {};
    opts.cookie.path = opts.cookie.path || '/';
    opts.log = opts.log || false;
    
    if (opts.angular === true) {
        opts.cookieName = 'XSRF-TOKEN';
        // Angular needs to read the cookie
        opts.cookie.httpOnly = false;
    }

    var isCookieEnabled = ('' !== opts.cookieName);
    var isLogEnable = ('function' === typeof opts.log);
    
    return function Xsrf(req, res, next) {
        
        // self-awareness
        if (req._esecurity_angularxsrf) {
            return next();
        }

        req._esecurity_angularxsrf = true;
        
        if ('function' == typeof opts.skip && opts.skip(req, res)) {
            return next();
        }
        
        var generateToken = function () {
                return crypto.createHash('sha1').update(
                            crypto.randomBytes(35)
                        ).digest('hex');
            },
            addXsrfCookie = function () {

                res.cookie(
                    opts.cookieName,
                    req.xsrfToken(),
                    opts.cookie
                );

            },
            getXsrfToken = function (type) {

                if ('session' === type) {
                    return req.session && req.session._esecurity_xsrf;
                }

                if (req.get('x-xsrf-token')) {
                    return req.get('x-xsrf-token');
                }
                else if ('POST' === req.method) {
                    return req.body['xsrf-token'] || req.body['XSRF-TOKEN'];
                }
                else {
                    return req.query['xsrf-token'] || req.query['XSRF-TOKEN'];
                }

            };
        
        // get token
        req.xsrfToken = function () {

            if (!req.session._esecurity_xsrf) {
                req.session._esecurity_xsrf = generateToken();
            }
            
            return req.session._esecurity_xsrf;

        };
        
        switch (req.method) {
            case 'OPTIONS':
            case 'HEAD':
                break;
            case 'GET':

                if (!getXsrfToken() || !getXsrfToken('session')) {
                    
                    if (isCookieEnabled) {
                        addXsrfCookie();
                    }
                    
                    return next();
                }

                break;
            default:
                
                if (!getXsrfToken() || !getXsrfToken('session') || getXsrfToken() !== getXsrfToken('session')) {
                    isLogEnable && opts.log('[' + req.ip + '] - 403 - XSRF token does not match.', req);
                    return next(utils.error(403, 'XSRF token does not match.'));
                }
                
                break;
        }
        
        return next();
    };
};
