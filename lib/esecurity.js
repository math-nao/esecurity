
/**
 * Module dependencies.
 */
 
var fs = require('fs');

/**
 * Expose middleware getters.
 */
 
exports.middleware = {};

/**
 * Load bundled middleware.
 */

fs.readdirSync(__dirname + '/middleware').forEach(function(filename){
  if (!/\.js$/.test(filename)) return;
  
  var 
    name = filename.replace(/\.js$/i, ''),
    load = function(){ return require('./middleware/' + name); };
  
  exports.middleware.__defineGetter__(name, load);
  exports.__defineGetter__(name, load);
});
