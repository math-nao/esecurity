var esecurity = require('../..');
var express = require('express');

var app = express();

app.use(esecurity.mimeSniffing());

app.use(function(req, res){
    res.end('Hello world.');
});

app.listen(9898);

console.log('Listening on port 9898...');

