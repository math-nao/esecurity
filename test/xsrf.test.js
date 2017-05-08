var esecurity = require('..');
var express = require('express');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var request = require('./support/http');

describe('xsrf', function () {

    describe('basic support', function () {

        it('should work with a valid token', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf());
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .get('/')
            .end(function (err, res) {
                
                // should have session cookie
                res.headers.should.have.property('set-cookie');

                var requestApp = request(app).post('/');

                res.headers['set-cookie'].forEach(function (cookie) {
                    cookie.should.not.startWith('XSRF-TOKEN=');
                    requestApp.set('Cookie', cookie);
                });

                var token = res.text;
                
                requestApp
                .send({ 'xsrf-token': token })
                .expect(200, done);
            });
        });
    
        it('should fail with an invalid token', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf());
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .get('/')
            .end(function (err, res) {
                
                // should have session cookie
                res.headers.should.have.property('set-cookie');

                var requestApp = request(app).post('/');

                res.headers['set-cookie'].forEach(function (cookie) {
                    cookie.should.not.startWith('XSRF-TOKEN=');
                    requestApp.set('Cookie', cookie);
                });

                var token = "An invalid token";
                
                requestApp
                .send({ 'xsrf-token': token })
                .expect(403, done);
            });
        });

        it('should work with several instantiations', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf());
            app.use(esecurity.xsrf());
            app.use(esecurity.xsrf());
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .get('/')
            .end(function (err, res) {
                
                // should have session cookie
                res.headers.should.have.property('set-cookie');

                var requestApp = request(app).post('/');

                res.headers['set-cookie'].forEach(function (cookie) {
                    cookie.should.not.startWith('XSRF-TOKEN=');
                    requestApp.set('Cookie', cookie);
                });

                var token = res.text;
                
                requestApp
                .send({ 'xsrf-token': token })
                .expect(200, done);
            });
        });
    
        it('should fail with an empty token', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf());
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .get('/')
            .end(function (err, res) {
                
                // should have session cookie
                res.headers.should.have.property('set-cookie');

                var requestApp = request(app).post('/');

                res.headers['set-cookie'].forEach(function (cookie) {
                    cookie.should.not.startWith('XSRF-TOKEN=');
                    requestApp.set('Cookie', cookie);
                });

                var token = '';
                
                requestApp
                .send({ 'xsrf-token': token })
                .expect(403, done);
            });
        });
    
        it('should set token only one time by session (GET verb)', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf());
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .get('/')
            .expect(200)
            .end(function (err, res) {
                
                // should have session cookie
                res.headers.should.have.property('set-cookie');

                var requestApp = request(app).get('/');

                res.headers['set-cookie'].forEach(function (cookie) {
                    cookie.should.not.startWith('XSRF-TOKEN=');
                    requestApp.set('Cookie', cookie);
                });

                var token = res.text;

                requestApp
                .query({ 'xsrf-token': token })
                .expect(200, done);
            });
        });
    
        it('should not set token (POST verb)', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf());
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .post('/')
            .expect(403)
            .end(function (err, res) {
                
                // should have session cookie
                res.headers.should.have.property('set-cookie');

                done();
            });
        });
    
        it('should not set token (PUT verb)', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf());
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .put('/')
            .expect(403)
            .end(function (err, res) {
                
                // should have session cookie
                res.headers.should.have.property('set-cookie');

                done();
            });
        });
    
        it('should not set token (PATCH verb)', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf());
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .patch('/')
            .expect(403)
            .end(function (err, res) {
                
                // should have session cookie
                res.headers.should.have.property('set-cookie');

                done();
            });
        });
    
        it('should not set token (DELETE verb)', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf());
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .del('/')
            .expect(403)
            .end(function (err, res) {
                
                // should have session cookie
                res.headers.should.have.property('set-cookie');

                done();
            });
        });
    
        it('should not set token (HEAD verb)', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf());
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .head('/')
            .expect(403)
            .end(function (err, res) {
                
                // should have session cookie
                res.headers.should.have.property('set-cookie');

                done();
            });
        });

        it('should work with log option', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf({
                log: function (msg) {
                    //console.log(msg);
                }
            }));
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .post('/')
            .expect(403)
            .end(function (err, res) {
                
                // should have session cookie
                res.headers.should.have.property('set-cookie');

                res.headers['set-cookie'].forEach(function (cookie) {
                    cookie.should.not.startWith('XSRF-TOKEN=');
                });

                done();
            });
        });

        it('should work with skip option', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf({
                skip: function (req, res) {
                    if (req.path == '/foobar')
                        return true;

                    return false;
                }
            }));
            
            app.use(function (req, res) {
                res.end('none');
            });

            request(app)
            .get('/foobar')
            .end(function (err, res) {
                
                // should have session cookie
                res.headers.should.have.property('set-cookie');

                res.headers['set-cookie'].forEach(function (cookie) {
                    cookie.should.not.startWith('XSRF-TOKEN=');
                });

                // expect default value 'none' because req.xsrfToken returns undefined
                res.text.should.be.equal('none');

                request(app)
                .post('/')
                .expect(403, done);
            });
        });

    });

    describe('angular support', function () {

        it('should work with a valid token', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf({
                angular: true
            }));
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .get('/')
            .end(function (err, res) {
                
                res.headers.should.have.property('set-cookie');

                var token = res.text;
                
                var requestApp = request(app).post('/');
                
                res.headers['set-cookie'].forEach(function (cookie) {
                    requestApp.set('Cookie', cookie);
                });
                
                requestApp.set('X-XSRF-Token', token)
                .expect(200, done);
            });
        });
    
        it('should fail with an invalid token', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf({
                angular: true
            }));
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .get('/')
            .end(function (err, res) {

                res.headers.should.have.property('set-cookie');

                var token = "An invalid token";
                
                var requestApp = request(app).post('/');
                
                res.headers['set-cookie'].forEach(function (cookie) {
                    requestApp.set('Cookie', cookie);
                });
                
                requestApp.set('X-XSRF-Token', token)
                .expect(403, done);
            });
        });
    
        it('should fail with no token', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf({
                angular: true
            }));
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .get('/')
            .end(function (err, res) {

                res.headers.should.have.property('set-cookie');

                var token = "";
                
                var requestApp = request(app).post('/');
                
                res.headers['set-cookie'].forEach(function (cookie) {
                    requestApp.set('Cookie', cookie);
                });
                
                requestApp.set('X-XSRF-Token', token)
                .expect(403, done);
            });
        });
    
        it('should set token only one time by session (GET verb)', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf({
                angular: true
            }));
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .get('/')
            .expect(403)
            .end(function (err, res) {
                
                // should have session cookie
                res.headers.should.have.property('set-cookie');

                var requestApp = request(app).get('/');

                res.headers['set-cookie'].forEach(function (cookie) {
                    requestApp.set('Cookie', cookie);
                });

                var token = res.text;

                requestApp
                .query({ 'xsrf-token': token })
                .expect(200, done);
            });
        });
    
        it('should not set token (POST verb)', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf({
                angular: true
            }));
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .post('/')
            .expect(403)
            .end(function (err, res) {
                // should have session cookie
                res.headers.should.have.property('set-cookie');

                res.headers['set-cookie'].forEach(function (cookie) {
                    cookie.should.not.startWith('XSRF-TOKEN=');
                });

                done();
            });
        });
    
        it('should not set token (PUT verb)', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf({
                angular: true
            }));
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .put('/')
            .expect(403)
            .end(function (err, res) {
                // should have session cookie
                res.headers.should.have.property('set-cookie');

                res.headers['set-cookie'].forEach(function (cookie) {
                    cookie.should.not.startWith('XSRF-TOKEN=');
                });

                done();
            });
        });
    
        it('should not set token (PATCH verb)', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf({
                angular: true
            }));
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .patch('/')
            .expect(403)
            .end(function (err, res) {
                // should have session cookie
                res.headers.should.have.property('set-cookie');

                res.headers['set-cookie'].forEach(function (cookie) {
                    cookie.should.not.startWith('XSRF-TOKEN=');
                });

                done();
            });
        });
    
        it('should not set token (DELETE verb)', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf({
                angular: true
            }));
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .del('/')
            .expect(403)
            .end(function (err, res) {
                // should have session cookie
                res.headers.should.have.property('set-cookie');

                res.headers['set-cookie'].forEach(function (cookie) {
                    cookie.should.not.startWith('XSRF-TOKEN=');
                });

                done();
            });
        });
    
        it('should not set token (HEAD verb)', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf({
                angular: true
            }));
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .head('/')
            .expect(403)
            .end(function (err, res) {
                // should have session cookie
                res.headers.should.have.property('set-cookie');

                res.headers['set-cookie'].forEach(function (cookie) {
                    cookie.should.not.startWith('XSRF-TOKEN=');
                });
                
                done();
            });
        });

        it('should work with log option', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf({
                angular: true,
                log: function (msg) {
                    //console.log(msg);
                }
            }));
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .post('/')
            .expect(403)
            .end(function (err, res) {
                
                res.headers.should.have.property('set-cookie');

                res.headers['set-cookie'].forEach(function (cookie) {
                    cookie.should.not.startWith('XSRF-TOKEN=');
                });

                done();
            });
        });

        it('should work with several instantiations', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf({
                angular: true
            }));
            app.use(esecurity.xsrf({
                angular: true
            }));
            app.use(esecurity.xsrf({
                angular: true
            }));
            
            app.use(function (req, res) {
                res.end(req.xsrfToken() || 'none');
            });

            request(app)
            .get('/')
            .end(function (err, res) {

                res.headers.should.have.property('set-cookie');

                var token = res.text;
                
                var requestApp = request(app).post('/');
                
                res.headers['set-cookie'].forEach(function (cookie) {
                    requestApp.set('Cookie', cookie);
                });
                
                requestApp.set('X-XSRF-Token', token)
                .expect(200, done);
            });
        });

        it('should work with skip option', function (done) {
            var app = express();

            app.use(cookieParser());
            app.use(expressSession({ 
                resave: true,
                saveUninitialized: true,
                secret: 'esecurity_test'
            }));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(esecurity.xsrf({
                angular: true,
                skip: function (req, res) {
                    if (req.path == '/foobar')
                        return true;

                    return false;
                }
            }));
            
            app.use(function (req, res) {
                res.end('none');
            });

            request(app)
            .get('/foobar')
            .end(function (err, res) {

                // should have cookie
                res.headers.should.have.property('set-cookie');
                
                res.headers['set-cookie'].forEach(function (cookie) {
                    cookie.should.not.startWith('XSRF-TOKEN=');
                });

                // expect default value 'none' because req.xsrfToken returns undefined
                res.text.should.be.equal('none');

                request(app)
                .post('/')
                .expect(403)
                .end(function (err, res) {

                    res.headers.should.have.property('set-cookie');

                    done();
                });
            });
        });

    });

});
