var esecurity = require('../..');
var express = require('express');

var app = express();

// Need a https connection

app.use(esecurity.hsts({
    maxAge: 60,
    includeSudomains: true
}));

app.use(function(req, res){
    res.sendfile(__dirname + '/test.html');
});

app.listen(9898);

console.log('Listening on port 9898...');

