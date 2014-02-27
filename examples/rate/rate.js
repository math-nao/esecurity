var esecurity = require('../..');
var express = require('express');

var app = express();

app.use(express.cookieParser());
app.use(express.session({ secret: 'SECRET_KEY' }));

app.get('/', esecurity.rate({ rate: 2, window: 5, enableHeaders: true }), function(req, res, next) {
    res.end('Hello world.');
});

app.listen(9898);

