var esecurity = require('../..');
var express = require('express');

var app = express();

app.use(esecurity.cors({
    origin: '*',
    credentials: true,
    methods: ['POST'],
    headers: ['X-PINGOTHER'],
    exposeHeaders: ['X-PINGOTHER'],
    maxAge: 60
}));

app.use(function(req, res){
    res.end('Hello world.');
});

app.listen(9898);

