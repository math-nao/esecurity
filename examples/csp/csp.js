var esecurity = require('../..');
var express = require('express');

var app = express();

app.use(esecurity.csp());

app.use(function(req, res){
    res.end('Hello world.');
});

app.listen(9898);

