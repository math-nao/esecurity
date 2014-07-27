var esecurity = require('..');
var express = require('express');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var request = require('./support/http');

describe('rate', function() {

    describe('with basic setup', function() {
        it('should work with default option', function(done) {
            var app = express();
            
            app.use(cookieParser());
            app.use(expressSession({ secret: 'SECRET_KEY' }));
            
            app.get('/', esecurity.rate(), function(req, res, next) {
                res.end('Hello');
            });

            request(app)
            .get('/')
            .expect(200, done);
            
        });

        it('should work with several instantiations', function(done) {
            var app = express();
            
            app.use(cookieParser());
            app.use(expressSession({ secret: 'SECRET_KEY' }));
            
            app.get('/', esecurity.rate(), esecurity.rate(), function(req, res, next) {
                res.end('Hello');
            });

            request(app)
            .get('/')
            .expect(200, done);
            
        });

        it('should fail without sessions', function(done) {
            var app = express();
            
            app.get('/', esecurity.rate(), function(req, res, next) {
                res.end('Hello');
            });

            request(app)
            .get('/')
            .expect(200, done);
            
        });
    });
    
    describe('with headers disabled', function() {

        it('should work with a valid rate limit', function(done) {
            var app = express();
            
            app.use(cookieParser());
            app.use(expressSession({ secret: 'SECRET_KEY' }));
            
            app.get('/', esecurity.rate({ rate: 1, window: 4 }), function(req, res, next) {
                res.end('Hello');
            });

            request(app)
            .get('/')
            .expect(200, done);
            
        });
      
        it('should fail with a reached rate limit', function(done) {
            var app = express();
            
            app.use(cookieParser());
            app.use(expressSession({ secret: 'SECRET_KEY' }));

            app.get('/', esecurity.rate({ rate: 1, window: 4 }), function(req, res, next) {
                res.end('Hello');
            });

            request(app)
            .get('/')
            .end(function(err, res) {
                request(app)
                .get('/')
                .set('Cookie', res.headers['set-cookie'][0].split(';')[0])
                .expect(429, done);
            });
        });
      
        it('should work with a previous reached rate limit', function(done) {
            var app = express();

            var timeWindow = 2;
            
            app.use(cookieParser());
            app.use(expressSession({ secret: 'SECRET_KEY' }));

            app.get('/', esecurity.rate({ rate: 1, window: timeWindow }), function(req, res, next) {
                res.end('Hello');
            });

            request(app)
            .get('/')
            .end(function(err, res) {
                request(app)
                .get('/')
                .set('Cookie', res.headers['set-cookie'][0].split(';')[0])
                .expect(429);

                setTimeout(function (){
                    request(app)
                    .get('/')
                    .set('Cookie', res.headers['set-cookie'][0].split(';')[0])
                    .expect(200, done);
                }, 1.5 * timeWindow * 1E3);
            });
        });
    });
    
    describe('with headers enabled', function() {
        it('should work with a valid rate limit', function(done) {
            var app = express();
            
            app.use(cookieParser());
            app.use(expressSession({ secret: 'SECRET_KEY' }));

            var rateVal = 1, windowVal = 4;
            app.get('/', esecurity.rate({ rate: rateVal, window: windowVal, enableHeaders: true }), function(req, res, next) {
                res.end('Hello');
            });

            request(app)
            .get('/')
            .expect('x-rate-limit-limit', String(rateVal))
            .expect('x-rate-limit-remaining', String(Math.max(0, rateVal - 1)))
            .expect(200)
            .end(function(err, res) {
                res.header['x-rate-limit-reset'].should.be.approximately(parseInt(Date.now() / 1E3) + windowVal, 5);
                done();
            });
            
        });
      
        it('should fail with a reached rate limit', function(done) {
            var app = express();
            
            app.use(cookieParser());
            app.use(expressSession({ secret: 'SECRET_KEY' }));
            
            var rateVal = 1, windowVal = 4;
            app.get('/', esecurity.rate({ rate: rateVal, window: windowVal, enableHeaders: true }), function(req, res, next) {
                res.end('Hello');
            });

            request(app)
            .get('/')
            .expect('x-rate-limit-limit', String(rateVal))
            .expect('x-rate-limit-remaining', String(Math.max(0, rateVal - 1)))
            .end(function(err, res) {
                res.header['x-rate-limit-reset'].should.be.approximately(parseInt(Date.now() / 1E3) + windowVal, 5);
                
                request(app)
                .get('/')
                .set('Cookie', res.headers['set-cookie'][0].split(';')[0])
                .expect('x-rate-limit-limit', String(rateVal))
                .expect('x-rate-limit-remaining', String(Math.max(0, rateVal - 2)))
                .expect(429)
                .end(function(err, res) {
                    res.header['x-rate-limit-reset'].should.be.approximately(parseInt(Date.now() / 1E3) + windowVal, 5);
                    done();
                });
            });
        });
    });
});
