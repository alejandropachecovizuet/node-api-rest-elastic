var expect  = require('chai').expect;
var request = require('request');

process.env.NODE_ENV = 'test';
let randomId= Math.random();

describe('Unit test api-rest - Loopback service', function() {

step('loopback', function(done) {
    request.post({uri:'http://localhost:20002/loopback',  form: {"username":"luisXV", "loopback":"test"}} , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
   });
}); 