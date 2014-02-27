var esecurity = require('..');
var express = require('express');
var request = require('./support/http');

describe('mimeSniffing', function() {
    it('should work', function(done) {
        var app = express();

        app.use(esecurity.mimeSniffing());

        request(app)
        .get('/')
        .expect('x-content-type-options', 'nosniff', done);
    });
});

