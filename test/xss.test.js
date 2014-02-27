var esecurity = require('..');
var express = require('express');
var request = require('./support/http');

describe('XSS', function() {    
    it('should work with block mode', function(done) {
        var app = express();

        app.use(esecurity.xss());

        request(app)
        .get('/')
        .expect('x-xss-protection', '1;mode=block', done);
    });
    
    it('should work without block', function(done) {
        var app = express();

        app.use(esecurity.xss({ blockMode: false }));

        request(app)
        .get('/')
        .expect('x-xss-protection', '1', done);
    });
});

