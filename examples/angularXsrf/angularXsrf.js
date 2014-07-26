var esecurity = require('../..');
var express = require('express');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');

var app = express();

app.use(cookieParser());
app.use(expressSession({ secret: 'esecurity example' }));
app.use(bodyParser());

app.use(esecurity.angularXsrf({
    skip: function (req, res) {
        return /^\/noxsrf/i.test(req.url);
    },
    cookie: {
        path: '/',
        secure: false
    }
}));

app.use(function(req, res){
    res.end('Hello world.');
});

app.listen(9898);

