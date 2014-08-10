
var utils = require('../utils');

module.exports = function filterReqConstructor(opts) {

    opts = opts || {};
    opts.host = opts.host || function (host) { return true; };
    opts.agent = opts.agent || function (agent) { return true; };
    opts.referer = opts.referer || function (referer) { return true; };
    opts.method = opts.method || function (method) { return true; };
    opts.url = opts.url || function (url) { return true; };
    opts.ip = opts.ip || function (ip) { return true; };
    opts.custom = opts.custom || function (req, res) { return true; };
    opts.log = opts.log || false;
    
    var isLogEnable = "function" === typeof opts.log;

    return function filterReq(req, res, next) {

        // self-awareness
        if (req._esecurity_filterReq)
            return next();

        req._esecurity_filterReq = true;
      
        // limit by rules
        if (opts.host && !opts.host(req.get('host'))) {
            isLogEnable && opts.log('[' + req.ip + '] - 403 - Host <' + req.get('host') + '> not granted', req);
            return next(utils.error(403, 'Host not granted'));
        }


        if (opts.agent && !opts.agent(req.get('user-agent'))) {
            isLogEnable && opts.log('[' + req.ip + '] - 403 - User-Agent <' + req.get('user-agent') + '> not granted', req);
            return next(utils.error(403, 'User-Agent not granted'));
        }

        if (opts.referer && !opts.referer(req.get('referer'))) {
            isLogEnable && opts.log('[' + req.ip + '] - 403 - Referer <' + req.get('referer') + '> not granted', req);
            return next(utils.error(403, 'Referer not granted'));
        }
        
        if (opts.method && !opts.method(req.method)) {
            isLogEnable && opts.log('[' + req.ip + '] - 403 - Method <' + req.method + '> not granted', req);
            return next(utils.error(403, 'Method not granted'));
        }
        
        if (opts.url && !opts.url(req.url)) {
            isLogEnable && opts.log('[' + req.ip + '] - 403 - URL <' + req.url + '> not granted', req);
            return next(utils.error(403, 'URL not granted'));
        }
        
        if (opts.ip && !opts.ip(req.ip)) {
            isLogEnable && opts.log('[' + req.ip + '] - 403 - IP <' + req.ip + '> not granted', req);
            return next(utils.error(403, 'IP not granted'));
        }
        
        if (opts.custom && !opts.custom(req, res)) {
            isLogEnable && opts.log('[' + req.ip + '] - 403 - Forbidden by custom rule', req);
            return next(utils.error(403, 'Forbidden.'));
        }

        next();
    };
};

