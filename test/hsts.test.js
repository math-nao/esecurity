
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
    
    it('should not send headers if no secure connection', function(done) {
        var app = express();

        app.use(esecurity.hsts());

        request(app)
        .get('/')
        .end(function(err, res) {
            res.headers.should.not.have.property('strict-transport-security');
            done();
        });
    });
    
    it('should work with default options', function(done) {
        var app = express();

        app.use(function(req, res, next) {
            req._esecurity_hsts_test_bypass_ssl = true;
            return next();
        });

        app.use(esecurity.hsts());

        request(app)
        .get('/')
        .expect('strict-transport-security', /max-age=\d+/, done);
    });
    
    it('should work with several instantiations', function(done) {
        var app = express();

        app.use(function(req, res, next) {
            req._esecurity_hsts_test_bypass_ssl = true;
            return next();
        });

        app.use(esecurity.hsts());
        app.use(esecurity.hsts());

        request(app)
        .get('/')
        .expect('strict-transport-security', /max-age=\d+/, done);
    });
});

