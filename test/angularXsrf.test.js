var esecurity = require('..');
var express = require('express');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var request = require('./support/http');

describe('angularXsrf', function () {
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
        app.use(esecurity.angularXsrf());
        
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
        app.use(esecurity.angularXsrf());
        
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
        app.use(esecurity.angularXsrf());
        
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
  
    it('should not set token (option POST)', function (done) {
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
        app.use(esecurity.angularXsrf());
        
        app.use(function (req, res) {
          res.end(req.xsrfToken() || 'none');
        });

        request(app)
        .post('/')
        .end(function (err, res) {
            // should have session cookie
            res.headers.should.have.property('set-cookie');

            res.headers['set-cookie'].forEach(function (cookie) {
                cookie.should.not.startWith('XSRF-TOKEN=');
            });

            done();
        });
    });
  
    it('should not set token (option VERB)', function (done) {
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
        app.use(esecurity.angularXsrf());
        
        app.use(function (req, res) {
          res.end(req.xsrfToken() || 'none');
        });

        request(app)
        .options('/')
        .end(function (err, res) {
            // should have session cookie
            res.headers.should.have.property('set-cookie');

            res.headers['set-cookie'].forEach(function (cookie) {
                cookie.should.not.startWith('XSRF-TOKEN=');
            });

            done();
        });
    });
  
    it('should not set token (head VERB)', function (done) {
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
        app.use(esecurity.angularXsrf());
        
        app.use(function (req, res) {
          res.end(req.xsrfToken() || 'none');
        });

        request(app)
        .head('/')
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
        app.use(esecurity.angularXsrf({
            log: function (msg) {
                //console.log(msg);
            }
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
            
            /*res.headers['set-cookie'].forEach(function (cookie) {
                requestApp.set('Cookie', cookie);
            });*/
            
            requestApp.set('X-XSRF-Token', token)
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
        app.use(esecurity.angularXsrf());
        app.use(esecurity.angularXsrf());
        app.use(esecurity.angularXsrf());
        
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
        app.use(esecurity.angularXsrf({
            skip: function (req, res) {
                if (req.path == '/foobar')
                    return true;

                return false;
            }
        }));
        
        app.use(function (req, res) {
          res.end(req.xsrfToken() || 'none');
        });

        request(app)
        .get('/foobar')
        .end(function (err, res) {

            res.headers.should.have.property('set-cookie');
            
            res.headers['set-cookie'].forEach(function (cookie) {
                cookie.should.not.startWith('XSRF-TOKEN=');
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
    });
});
