var esecurity = require('../..');
var express = require('express');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');

var app = express();

app.use(cookieParser());

app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: 'esecurity example'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(esecurity.xsrf({
    skip: function (req, res) {
        return /^\/noxsrf/i.test(req.url);
    },
    cookie: {
        path: '/',
        secure: false
    }
}));

app.get('/api/xsrf.json', function(req, res, next){
    res.json({ 'xsrf': req.xsrfToken() });
});

app.get('/', function(req, res, next){
    res.end('Hello world.');
});

app.listen(9898);

console.log('Listening on port 9898...');

