var esecurity = require('..');
var express = require('express');
var request = require('./support/http');

describe('rate', function() {
    describe('with headers disabled', function() {
        it('should work with a valid rate limit', function(done) {
            var app = express();
            
            app.use(express.cookieParser());
            app.use(express.session({ secret: 'SECRET_KEY' }));
            
            app.get('/', esecurity.rate({ rate: 1, window: 4 }), function(req, res, next) {
                res.end('Hello');
            });

            request(app)
            .get('/')
            .expect(200, done);
            
        });
      
        it('should fail with a reached rate limit', function(done) {
            var app = express();
            
            app.use(express.cookieParser());
            app.use(express.session({ secret: 'SECRET_KEY' }));

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
    });
    
    describe('with headers enabled', function() {
        it('should work with a valid rate limit', function(done) {
            var app = express();
            
            app.use(express.cookieParser());
            app.use(express.session({ secret: 'SECRET_KEY' }));

            var rateVal = 1, windowVal = 4;
            app.get('/', esecurity.rate({ rate: rateVal, window: windowVal, enableHeaders: true }), function(req, res, next) {
                res.end('Hello');
            });

            request(app)
            .get('/')
            .expect('x-rate-limit-limit', String(rateVal))
            .expect('x-rate-limit-remaining', String(Math.max(0, rateVal - 1)))
            .end(function(err, res) {
                res.should.have.status(200);
                res.header['x-rate-limit-reset'].should.be.approximately(parseInt(Date.now() / 1E3) + windowVal, 5);
                done();
            });
            
        });
      
        it('should fail with a reached rate limit', function(done) {
            var app = express();
            
            app.use(express.cookieParser());
            app.use(express.session({ secret: 'SECRET_KEY' }));
            
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
                .end(function(err, res) {
                    res.should.have.status(429);
                    res.header['x-rate-limit-reset'].should.be.approximately(parseInt(Date.now() / 1E3) + windowVal, 5);
                    done();
                });
            });
        });
    });
});
