var esecurity = require('../..');
var express = require('express');

var app = express();

app.use(esecurity.clickJacking({
    sameOrigin: true
}));

app.use(function(req, res){
    if (!/\.js$/i.test(req.url)) 
        res.sendfile(__dirname + '/test.html');
});

app.listen(9898);

