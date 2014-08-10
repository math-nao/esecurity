var esecurity = require('..');
var express = require('express');
var request = require('./support/http');

/*describe('sendFileLimit', function () {
    it('should work with a valid zone limit', function (done) {
        var app = express();

        app.use(esecurity.zoneLimit({
            rate: 1,
            window: 4
        }));

        request(app)
        .get('/')
        .expect(200, done);
        
    });
  
    it('should fail with a zone limit reached', function (done) {
        var app = express();

        app.use(esecurity.zoneLimit({
            rate: 1,
            window: 4
        }));

        request(app)
        .get('/')
        .end(function (err, res) {
            request(app)
            .get('/')
            .expect(403, done);
        });
    });
});*/
