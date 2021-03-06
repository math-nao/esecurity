
var utils = require('../utils');

module.exports = function zoneLimitConstructor(opts) {

    opts = opts || {};
    opts.rate = parseInt(opts.rate) || 100;
    opts.window = parseInt(opts.window) || 5;
    opts.delayGc = parseInt(opts.delayGc) || 20;
    opts.keyZone = opts.keyZone || function (req) { return req.ip; };
    opts.log = opts.log || false;

    var counterConnections = {};
    
    var isLogEnable = "function" === typeof opts.log;
      
    var isLimitReached = function (key) {
        var currentTime = parseInt(Date.now() / 1E3);
    
        if (!counterConnections[key])
            counterConnections[key] = { t: currentTime, v: 0 };
        
        var isInWindow = currentTime - counterConnections[key].t < opts.window;
    
        if (isInWindow && counterConnections[key].v + 1 > opts.rate) return true;
        else if (!isInWindow) counterConnections[key] = { t: currentTime, v: 0 };
    
        ++counterConnections[key].v;
    
        return false;
    }

    var timer, garbageCollector = function () {
        timer && clearTimeout(timer);
        timer = setTimeout(function () {
            var currentTime = parseInt(Date.now() / 1E3);
            Object.keys(counterConnections).forEach(function (v) {
                if (currentTime - counterConnections[v].t >= opts.window) {
                    counterConnections[v] = null;
                    delete counterConnections[v];
                }
            });
            garbageCollector();
        }, opts.delayGc * 1E3);
    };

    return function zoneLimit(req, res, next) {

        // self-awareness
        if (req._esecurity_zoneLimit)
            return next();
        
        req._esecurity_zoneLimit = true;
      
        // start garbage collector
        garbageCollector();

        // limit by rate
        var keyZone;
        if (isLimitReached(keyZone = opts.keyZone(req))) {
            isLogEnable && opts.log('[' + req.ip + '] - 429 - Rate limit exceeded for keyzone:' + keyZone, req);
            return next(utils.error(429, 'Rate limit exceeded'));
        }
        
        next();
    };
};

