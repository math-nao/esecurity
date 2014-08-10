var esecurity = require('..');
var utils = require('../lib/utils');
var should = require('should');

describe('Utils', function () {
    describe('Error', function () {

        it('should work with a valid code and a valid message', function (done) {
            var err = utils.error(404, 'Sorry, not found :(');
            err.should.have.properties('message', 'status');
            err.should.have.property('message', 'Sorry, not found :(');
            err.should.have.property('status', 404);
            done();
        });

        it('should work with a valid code', function (done) {
            var err = utils.error(404);
            err.should.have.properties('message', 'status');
            err.should.have.property('message', 'Not Found');
            err.should.have.property('status', 404);
            done();
        });

        it('should work with an invalid code', function (done) {
            var err = utils.error(1024);
            err.should.have.properties('message', 'status');
            err.should.have.property('message', '');
            err.should.have.property('status', 1024);
            done();
        });
    });
});

