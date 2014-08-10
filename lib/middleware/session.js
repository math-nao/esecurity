
var 
    utils = require('../utils'),    
    crypto = require('crypto');

module.exports = function SessionConstructor(opts) {

    opts = opts || {};
    opts.key = opts.key || function (req) { return req.get('user-agent'); };
    
    return function session(req, res, next) {
        
        if (!req.session) {
            console.log('esecurity.session: Session support is needed');
            return next();
        }
        
        // self-awareness
        if (req._esecurity_session)
            return next();
        
        req._esecurity_session = true;
        
        var generateToken = function () {
            return crypto.createHash('sha1').update(opts.key()).digest('hex');
        };
        
        if (!req.session._esecurity_session)
            req.session._esecurity_session = {};
        
        if (!req.session._esecurity_session['token'])
            req.session._esecurity_session['token'] = generateToken();
        else if (req.session._esecurity_session['token'] != generateToken())
            return req.session.regenerate(function (err) {
                next();
            });
        
        return next();
    };
};
