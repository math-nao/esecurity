var esecurity = require('../..');
var express = require('express');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var app = express();

app.use(cookieParser());
app.use(expressSession({ secret: 'SECRET_KEY' }));

app.get('/', esecurity.rate({ rate: 2, window: 5, enableHeaders: true }), function(req, res, next) {
    res.end('Hello world.');
});

app.listen(9898);

