/*
let expect  = require('chai').expect;
let request = require('request');

process.env.NODE_ENV = 'test';
let randomId= Math.random();
protocol='http';

describe('Unit test api-rest - Loopback service', function() {

step('loopback', function(done) {
    request.post({uri:`${protocol}://localhost:20002/loopback`,  form: {"username":"luisXV", "loopback":"test"}} , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
   });
}); 
*/