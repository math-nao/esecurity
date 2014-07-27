var esecurity = require('..');
var express = require('express');
var request = require('./support/http');

describe('cors', function() {
    describe('with credentials', function() {
        it('should work with default options', function(done) {

            var app = express();

            app.use(esecurity.cors());
    
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .get('/')
            .expect(200, done);
        });
        it('should work with several instantiations', function(done) {

            var app = express();

            app.use(esecurity.cors());
            app.use(esecurity.cors());
            app.use(esecurity.cors());
    
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .get('/')
            .expect(200, done);
        });

        it('should fail with a invalid method', function(done) {
            var app = express();

            var originAllowed = 'http://domain.com';
            app.use(esecurity.cors({
                origin: '*',
                methods: ['POST']
            }));
    
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .options('/')
            .set('Origin', originAllowed)
            .set('Access-Control-Request-Method', 'PUT')
            .end(function(err, res) {
                res.headers.should.not.have.property('access-control-allow-methods', 'PUT');
                console.log(res.status);
                done();
            });
        });

        it('should fail with a invalid request header', function(done) {
            var app = express();

            var originAllowed = 'http://domain.com';
            app.use(esecurity.cors({
                origin: '*',
                methods: ['GET'],
                headers: ['X-PINGOTHER']
            }));
    
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .options('/')
            .set('Origin', originAllowed)
            .set('Access-Control-Request-Method', 'GET')
            .set('Access-Control-Request-Headers', 'X-FOOBAR')
            .end(function(err, res) {
                res.headers.should.not.have.property('access-control-allow-headers', 'X-FOOBAR');
                console.log(res.status);
                done();
            });
        });
    });

    describe('with credentials', function() {
        describe('preflight request', function() {
            it('should work with a valid request', function(done) {
                var app = express();

                var originAllowed = 'http://domain.com';
                app.use(esecurity.cors({
                    origin: '*',
                    credentials: true,
                    methods: ['POST'],
                    headers: ['X-PINGOTHER'],
                    exposeHeaders: ['X-PINGOTHER'],
                    maxAge: 60
                }));
        
                app.use(function(req, res){
                  res.end('none');
                });

                request(app)
                .options('/')
                .set('Origin', originAllowed)
                .set('Access-Control-Request-Method', 'POST')
                .set('Access-Control-Request-Headers', 'X-PINGOTHER')
                .expect('access-control-allow-credentials', 'true')
                .expect('access-control-allow-methods', 'POST')
                .expect('access-control-allow-headers', 'X-PINGOTHER')
                .expect('access-control-max-age', '60')
                .expect('access-control-allow-origin', originAllowed)
                .expect(204, done);
            });

            it('should work with methods, headers and exposeHeaders options as string', function(done) {
                var app = express();

                var originAllowed = 'http://domain.com';
                app.use(esecurity.cors({
                    origin: '*',
                    credentials: true,
                    methods: 'POST',
                    headers: 'X-PINGOTHER',
                    exposeHeaders: 'X-PINGOTHER',
                    maxAge: 60
                }));
        
                app.use(function(req, res){
                  res.end('none');
                });

                request(app)
                .options('/')
                .set('Origin', originAllowed)
                .set('Access-Control-Request-Method', 'POST')
                .set('Access-Control-Request-Headers', 'X-PINGOTHER')
                .expect('access-control-allow-credentials', 'true')
                .expect('access-control-allow-methods', 'POST')
                .expect('access-control-allow-headers', 'X-PINGOTHER')
                .expect('access-control-max-age', '60')
                .expect('access-control-allow-origin', originAllowed)
                .expect(204, done);
            });
          
            it('should fail with an invalid request', function(done) {
                var app = express();

                var originAllowed = 'http://domain.com';
                app.use(esecurity.cors({
                    origin: originAllowed,
                    credentials: true,
                    methods: ['POST'],
                    headers: ['X-PINGOTHER'],
                    exposeHeaders: ['X-PINGOTHER'],
                    maxAge: 60
                }));
        
                app.use(function(req, res){
                  res.end('none');
                });

                request(app)
                .options('/')
                .set('Origin', 'http://evil.com')
                .end(function(err, res) {
                    res.headers.should.not.have.property('access-control-allow-credentials');
                    res.headers.should.not.have.property('access-control-request-methods');
                    res.headers.should.not.have.property('access-control-request-headers');
                    res.headers.should.not.have.property('access-control-max-age');
                    res.headers.should.not.have.property('access-control-expose-headers');
                    res.headers.should.not.have.property('access-control-allow-origin');
                    res.statusCode.should.equal(200);
                    done();
                });
            });
        });
        
        describe('desired request', function() {
            it('should work with a valid request', function(done) {
                var app = express();

                var originAllowed = 'http://domain.com';
                app.use(esecurity.cors({
                    origin: originAllowed,
                    credentials: true
                }));
        
                app.use(function(req, res){
                  res.end('none');
                });

                request(app)
                .get('/')
                .set('Origin', originAllowed)
                .expect('access-control-allow-origin', originAllowed)
                .expect('access-control-allow-credentials', 'true', done);
            });

            it('should work with methods, headers and exposeHeaders options as string', function(done) {
                var app = express();

                var originAllowed = 'http://domain.com';
                app.use(esecurity.cors({
                    methods: 'GET,PUT,POST,DELETE',
                    headers: 'Origin,X-Requested-With,Content-Type,Accept',
                    exposeHeaders: '',
                    origin: originAllowed,
                    credentials: true
                }));
        
                app.use(function(req, res){
                  res.end('none');
                });

                request(app)
                .get('/')
                .set('Origin', originAllowed)
                .expect('access-control-allow-origin', originAllowed)
                .expect('access-control-allow-credentials', 'true', done);
            });
          
            it('should fail with an invalid request', function(done) {
                var app = express();

                var originAllowed = 'http://domain.com';
                app.use(esecurity.cors({
                    origin: originAllowed,
                    credentials: true
                }));
        
                app.use(function(req, res){
                  res.end('none');
                });

                request(app)
                .get('/')
                .set('Origin', 'http://evil.com')
                .end(function(err, res) {
                    res.headers.should.not.have.property('access-control-allow-origin');
                    res.headers.should.not.have.property('access-control-allow-credentials');
                    done();
                });
            });
        });
    });
    
    describe('without credentials', function() {
        describe('preflight request', function() {
            it('should work with a valid request', function(done) {
                var app = express();

                var originAllowed = 'http://domain.com';
                app.use(esecurity.cors({
                    origin: originAllowed,
                    methods: ['POST'],
                    headers: ['X-PINGOTHER'],
                    exposeHeaders: ['X-PINGOTHER'],
                    maxAge: 60
                }));
        
                app.use(function(req, res){
                  res.end('none');
                });

                request(app)
                .options('/')
                .set('Origin', originAllowed)
                .set('Access-Control-Request-Method', 'POST')
                .set('Access-Control-Request-Headers', 'X-PINGOTHER')
                .expect('access-control-allow-methods', 'POST')
                .expect('access-control-allow-headers', 'X-PINGOTHER')
                .expect('access-control-max-age', '60')
                .expect('access-control-allow-origin', originAllowed)
                .expect(204, done)
                /*.end(function(err, res) {
                    console.log(res.headers);
                    done();
                });*/
            });
          
            it('should fail with an invalid request', function(done) {
                var app = express();

                var originAllowed = 'http://domain.com';
                app.use(esecurity.cors({
                    origin: originAllowed,
                    methods: ['POST'],
                    headers: ['X-PINGOTHER'],
                    exposeHeaders: ['X-PINGOTHER'],
                    maxAge: 60
                }));
        
                app.use(function(req, res){
                  res.end('none');
                });

                request(app)
                .options('/')
                .set('Origin', 'http://evil.com')
                .end(function(err, res) {
                    res.headers.should.not.have.property('access-control-allow-origin');
                    res.headers.should.not.have.property('access-control-request-method');
                    res.headers.should.not.have.property('access-control-request-headers');
                    res.headers.should.not.have.property('access-control-max-age');
                    res.headers.should.not.have.property('access-control-expose-headers');
                    res.statusCode.should.equal(200);
                    done();
                });
            });
        });
        
        describe('desired request', function() {
            it('should work with a valid request', function(done) {
                var app = express();

                var originAllowed = 'http://domain.com';
                app.use(esecurity.cors({
                    origin: originAllowed
                }));
        
                app.use(function(req, res){
                  res.end('none');
                });

                request(app)
                .get('/')
                .set('Origin', originAllowed)
                .expect('Access-Control-Allow-Origin', originAllowed, done);
            });
          
            it('should fail with an invalid request', function(done) {
                var app = express();

                var originAllowed = 'http://domain.com';
                app.use(esecurity.cors({
                    origin: originAllowed
                }));
        
                app.use(function(req, res){
                  res.end('none');
                });

                request(app)
                .get('/')
                .set('Origin', 'http://evil.com')
                .end(function(err, res) {
                    res.headers.should.not.have.property('access-control-allow-origin');
                    done();
                });
            });
        });
    });
});
