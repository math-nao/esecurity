var esecurity = require('..');
var express = require('express');
var request = require('./support/http');

describe('clickJacking', function () {
    it('should work with default options', function (done) {
        var app = express();

        app.use(esecurity.clickJacking());

        request(app)
        .get('/')
        .expect('x-frame-options', 'DENY', done);
    });

    it('should work with several instantiations', function (done) {
        var app = express();

        app.use(esecurity.clickJacking());
        app.use(esecurity.clickJacking());
        app.use(esecurity.clickJacking());

        request(app)
        .get('/')
        .expect('x-frame-options', 'DENY', done);
    });

    it('should work with DENY', function (done) {
        var app = express();

        app.use(esecurity.clickJacking({
            deny: true
        }));

        request(app)
        .get('/')
        .expect('x-frame-options', 'DENY', done);
    });
    
    it('should work with SAMEORIGIN', function (done) {
        var app = express();

        app.use(esecurity.clickJacking({
            sameOrigin: true
        }));

        request(app)
        .get('/')
        .expect('x-frame-options', 'SAMEORIGIN', done);
    });
    
    it('should work with ALLOW-FROM', function (done) {
        var app = express();

        var testDomain = 'http://www.example.org';
        app.use(esecurity.clickJacking({
            allowFrom: testDomain
        }));

        request(app)
        .get('/')
        .expect('x-frame-options', 'ALLOW-FROM ' + testDomain, done);
    });
    
    it('should fetch js file', function (done) {
        var app = express();

        var url = '/my_js_url.js';
        app.use(esecurity.clickJacking({
            jsUrl: url
        }));

        request(app)
        .get(url)
        .expect(200, done);
    });
});

