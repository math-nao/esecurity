/*!
 * ESecurity
 * Copyright(c) 2013 Mathieu Naouache
 * MIT Licensed
 */

var http = require('http');

exports.error = function(code, msg){
  var err = new Error(msg || http.STATUS_CODES[code]);
  
  err.status = code;
  
  return err;
};
