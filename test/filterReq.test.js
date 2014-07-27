var esecurity = require('..');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('./support/http');

describe('filterReq', function() {
    describe('basic option', function() {
        it('should work with default option', function(done) {
            var app = express();

            app.use(esecurity.filterReq());
        
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .get('/')
            .set('Host', 'www.domain.com')
            .expect(200, done);
        });
      
        it('should fail with several instantiations', function(done) {
            var app = express();

            app.use(esecurity.filterReq());
            app.use(esecurity.filterReq());
            app.use(esecurity.filterReq());
        
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .get('/')
            .set('Host', 'www.domain.com')
            .expect(200, done);
        });
      
        it('should fail with log option', function(done) {
            var app = express();

            app.use(esecurity.filterReq({
                log: function (msg) {
                    //console.log(msg);
                }
            }));
        
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .get('/')
            .set('Host', 'www.domain.com')
            .expect(200, done);
        });
    });

    describe('host option', function() {
        it('should work with a valid host header', function(done) {
            var app = express();

            app.use(esecurity.filterReq({
                host: function(host) {
                    return /^www\.domain\.com$/.test(host);
                },
                log: function (msg) {
                    //console.log(msg);
                }
            }));
        
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .get('/')
            .set('Host', 'www.domain.com')
            .expect(200, done);
        });
      
        it('should fail with a unsupported host', function(done) {
            var app = express();

            app.use(esecurity.filterReq({
                host: function(host) {
                    return /^www\.domain\.com$/.test(host);
                },
                log: function (msg) {
                    //console.log(msg);
                }
            }));
        
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .get('/')
            .set('Host', 'evil.com')
            .expect(403, done);
        });
    });
    
    describe('useragent option', function() {
        it('should work with a valid user-agent header', function(done) {
            var app = express();

            app.use(esecurity.filterReq({
                agent: function(agent) {
                    return /^esecurity$/.test(agent);
                },
                log: function (msg) {
                    //console.log(msg);
                }
            }));
        
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .get('/')
            .set('User-Agent', 'esecurity')
            .expect(200, done);
        });
      
        it('should fail with a unsupported user-agent header', function(done) {
            var app = express();

            app.use(esecurity.filterReq({
                agent: function(agent) {
                    return /^esecurity$/.test(agent);
                },
                log: function (msg) {
                    //console.log(msg);
                }
            }));
        
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .get('/')
            .set('User-Agent', 'bot')
            .expect(403, done);
        });
    });
    
    describe('referer option', function() {
        it('should work with a valid referer header', function(done) {
            var app = express();

            app.use(esecurity.filterReq({
                referer: function(referer) {
                    return !/^evil\.com$/.test(referer);
                },
                log: function (msg) {
                    //console.log(msg);
                }
            }));
        
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .get('/')
            .set('Referer', 'esecurity')
            .expect(200, done);
        });
      
        it('should fail with a unsupported referer header', function(done) {
            var app = express();

            app.use(esecurity.filterReq({
                referer: function(referer) {
                    return !/^evil\.com$/.test(referer);
                },
                log: function (msg) {
                    //console.log(msg);
                }
            }));
        
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .get('/')
            .set('Referer', 'evil.com')
            .expect(403, done);
        });
    });
    
    describe('method option', function() {
        it('should work with a valid method', function(done) {
            var app = express();

            app.use(esecurity.filterReq({
                method: function(method) {
                    return /^(GET|PUT|DELETE|OPTIONS|HEAD)$/i.test(method);
                },
                log: function (msg) {
                    //console.log(msg);
                }
            }));
        
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .get('/')
            .expect(200, done);
        });
      
        it('should fail with a unsupported method', function(done) {
            var app = express();

            app.use(bodyParser());
            app.use(esecurity.filterReq({
                method: function(method) {
                    return /^(GET|PUT|DELETE|OPTIONS|HEAD)$/i.test(method);
                },
                log: function (msg) {
                    //console.log(msg);
                }
            }));
        
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .post('/')
            .expect(403, done);
        });
    });
    
    describe('url option', function() {
        it('should work with a valid url', function(done) {
            var app = express();

            app.use(esecurity.filterReq({
                url: function(url) {
                    return !/^\/private/i.test(url);
                },
                log: function (msg) {
                    //console.log(msg);
                }
            }));
        
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .get('/public')
            .expect(200, done);
        });
      
        it('should fail with a unsupported url', function(done) {
            var app = express();

            app.use(esecurity.filterReq({
                url: function(url) {
                    return !/^\/private/i.test(url);
                },
                log: function (msg) {
                    //console.log(msg);
                }
            }));
        
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .get('/private')
            .expect(403, done);
        });
    });
    
    describe('ip option', function() {
        it('should work with a valid ip', function(done) {
            var app = express();

            app.use(esecurity.filterReq({
                ip: function(ip) {
                    return /^127\.0\.0\.1$/i.test(ip);
                },
                log: function (msg) {
                    //console.log(msg);
                }
            }));
        
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .get('/')
            .expect(200, done);
        });
      
        it('should fail with a unsupported ip', function(done) {
            var app = express();

            app.use(esecurity.filterReq({
                ip: function(ip) {
                    return /^10\.0\.0\.1$/i.test(ip);
                },
                log: function (msg) {
                    //console.log(msg);
                }
            }));
        
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .get('/')
            .expect(403, done);
        });
    });
    
    describe('custom option', function() {
        it('should work with a valid custom data', function(done) {
            var app = express();

            app.use(esecurity.filterReq({
                custom: function(req, res) {
                    var isAjaxUrl = /^\/ajax/.test(req.url);
                    return !isAjaxUrl || (isAjaxUrl && req.xhr);
                },
                log: function (msg) {
                    //console.log(msg);
                }
            }));
        
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .get('/ajax')
            .set('X-Requested-With', 'XMLHttpRequest')
            .expect(200, done);
        });
      
        it('should fail with a unsupported custom data', function(done) {
            var app = express();

            app.use(esecurity.filterReq({
                custom: function(req, res) {
                    var isAjaxUrl = /^\/ajax/.test(req.url);
                    return !isAjaxUrl || (isAjaxUrl && req.xhr);
                },
                log: function (msg) {
                    //console.log(msg);
                }
            }));
        
            app.use(function(req, res){
              res.end('none');
            });

            request(app)
            .get('/ajax')
            .expect(403, done);
        });
    });
});
