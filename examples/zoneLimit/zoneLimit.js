var esecurity = require('../..');
var express = require('express');

var app = express();

app.use(esecurity.zoneLimit({
    rate: 1,
    window: 4
}));

app.use(function(req, res){
    res.end('Hello world.');
});

app.listen(9898);

