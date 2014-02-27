
var esecurity = require('..');
var express = require('express');
var request = require('./support/http');

describe('HSTC', function() {
    it('should work without subdomains', function(done) {
        var app = express();
        
        app.use(function(req, res, next) {
            req._esecurity_hsts_test_bypass_ssl = true;
            return next();
        });
        app.use(esecurity.hsts({
            maxAge: 60
        }));

        request(app)
        .get('/')
        .expect('strict-transport-security', 'max-age=60', done);
    });
    
    it('should work with subdomains', function(done) {
        var app = express();

        app.use(function(req, res, next) {
            req._esecurity_hsts_test_bypass_ssl = true;
            return next();
        });
        app.use(esecurity.hsts({
            maxAge: 60,
            includeSudomains: true
        }));

        request(app)
        .get('/')
        .expect('strict-transport-security', 'max-age=60;includeSubDomains', done);
    });
});

