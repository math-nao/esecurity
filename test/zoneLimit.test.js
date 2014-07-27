var esecurity = require('..');
var express = require('express');
var request = require('./support/http');

describe('zoneLimit', function() {
    it('should work with default options', function(done) {
        var app = express();

        app.use(esecurity.zoneLimit());
        
        app.use(function(req, res){
          res.end('none');
        });

        request(app)
        .get('/')
        .expect(200, done);
        
    });

    it('should work with several instantiations', function(done) {
        var app = express();

        app.use(esecurity.zoneLimit());
        app.use(esecurity.zoneLimit());
        
        app.use(function(req, res){
          res.end('none');
        });

        request(app)
        .get('/')
        .expect(200, done);
    });

    it('should work with a valid zone limit', function(done) {
        var app = express();

        app.use(esecurity.zoneLimit({
            rate: 1,
            window: 4
        }));
        
        app.use(function(req, res){
          res.end('none');
        });

        request(app)
        .get('/')
        .expect(200, done);
        
    });
  
    it('should fail with a zone limit reached', function(done) {
        var app = express();

        app.use(esecurity.zoneLimit({
            rate: 1,
            window: 4
        }));
        
        app.use(function(req, res){
          res.end('none');
        });

        request(app)
        .get('/')
        .end(function(err, res) {
            request(app)
            .get('/')
            .expect(429, done);
        });
    });
  
    it('should work with a previous zone limit reached', function(done) {
        var app = express();

        var timeWindow = 2;

        app.use(esecurity.zoneLimit({
            rate: 1,
            window: timeWindow,
            delayGc: 10 * timeWindow
        }));
        
        app.use(function(req, res){
          res.end('none');
        });

        request(app)
        .get('/')
        .end(function(err, res) {
            request(app)
            .get('/')
            .expect(429);

            setTimeout(function (){
                request(app)
                .get('/')
                .expect(200, done);
            }, 1.5 * timeWindow * 1E3);
        });
    });
  
    it('should work with garbagecollector option', function(done) {
        var app = express();

        var timeWindow = 2;
        app.use(esecurity.zoneLimit({
            rate: 1,
            window: timeWindow,
            delayGc: 1,
            log: function (msg) {
                //console.log(msg);
            }
        }));
        
        app.use(function(req, res){
          res.end('none');
        });

        request(app)
        .get('/')
        .end(function(err, res) {
            request(app)
            .get('/')
            .expect(429);

            setTimeout(function (){
                request(app)
                .get('/')
                .expect(200, done);
            }, 1.5 * timeWindow * 1E3);
        });
    });
  
    it('should work with log option', function(done) {
        var app = express();

        app.use(esecurity.zoneLimit({
            rate: 1,
            window: 4,
            log: function (msg) {
                //console.log(msg);
            }
        }));
        
        app.use(function(req, res){
          res.end('none');
        });

        request(app)
        .get('/')
        .end(function(err, res) {
            request(app)
            .get('/')
            .expect(429, done);
        });
    });
});
