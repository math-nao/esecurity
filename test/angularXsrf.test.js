var esecurity = require('..');
var express = require('express');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var request = require('./support/http');

describe('angularXsrf', function() {
    it('should work with a valid token', function(done) {
        var app = express();

        app.use(cookieParser());
        app.use(expressSession({ secret: 'esecurity test' }));
        app.use(bodyParser());
        app.use(esecurity.angularXsrf());
        
        app.use(function(req, res){
          res.end(req.xsrfToken() || 'none');
        });

        request(app)
        .get('/')
        .end(function(err, res) {
            var token = res.text;
            
            var requestApp = request(app).post('/');
            
            res.headers['set-cookie'].forEach(function(cookie) {
                requestApp.set('Cookie', cookie);
            });
            
            requestApp.set('X-XSRF-Token', token)
            .expect(200, done);
        });
    });
  
    it('should fail with an invalid token', function(done) {
        var app = express();

        app.use(cookieParser());
        app.use(expressSession({ secret: 'esecurity test' }));
        app.use(bodyParser());
        app.use(esecurity.angularXsrf());
        
        app.use(function(req, res){
          res.end(req.xsrfToken() || 'none');
        });

        request(app)
        .get('/')
        .end(function(err, res) {
            var token = "An invalid token";
            
            var requestApp = request(app).post('/');
            
            res.headers['set-cookie'].forEach(function(cookie) {
                requestApp.set('Cookie', cookie);
            });
            
            requestApp.set('X-XSRF-Token', token)
            .expect(403, done);
        });
    });
  
    it('should fail with no token', function(done) {
        var app = express();

        app.use(cookieParser());
        app.use(expressSession({ secret: 'esecurity test' }));
        app.use(bodyParser());
        app.use(esecurity.angularXsrf());
        
        app.use(function(req, res){
          res.end(req.xsrfToken() || 'none');
        });

        request(app)
        .get('/')
        .end(function(err, res) {
            var token = "";
            
            var requestApp = request(app).post('/');
            
            res.headers['set-cookie'].forEach(function(cookie) {
                requestApp.set('Cookie', cookie);
            });
            
            requestApp.set('X-XSRF-Token', token)
            .expect(403, done);
        });
    });
});
