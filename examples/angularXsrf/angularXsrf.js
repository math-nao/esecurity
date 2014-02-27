var esecurity = require('../..');
var express = require('express');

var app = express();

app.use(express.cookieParser());
app.use(express.session({ secret: 'esecurity example' }));
app.use(express.bodyParser());

app.use(esecurity.angularXsrf({
    skip: function(req, res) {
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

