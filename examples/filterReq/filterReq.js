var esecurity = require('../..');
var express = require('express');

var app = express();

app.use(esecurity.filterReq({
    host: function(host) {
        return /^www\.domain\.com$/.test(host);
    },
    agent: function(agent) {
        return /^esecurity$/.test(agent);
    },
    referer: function(referer) {
        return !/^evil\.com$/.test(referer);
    },
    method: function(method) {
        return /^(GET|PUT|DELETE|OPTIONS|HEAD)$/i.test(method);
    },
    url: function(url) {
        return !/^\/private/i.test(url);
    },
    ip: function(ip) {
        return /^127\.0\.0\.1$/i.test(ip);
    },
    custom: function(req, res) {
        var isAjaxUrl = /^\/ajax/.test(req.url);
        return !isAjaxUrl || (isAjaxUrl && req.xhr);
    }
}));

app.use(function(req, res){
    res.end('Hello world.');
});

app.listen(9898);

console.log('Listening on port 9898...');

