var expect  = require('chai').expect;
var request = require('request');

process.env.NODE_ENV = 'test';
let randomId= Math.random();

describe('Unit test api-rest - login service', function() {

    step('authenticate', function(done) {
    request.post({url:'http://localhost:20001/authenticate',  form: {"username":"test", "pwd":"123456"} } , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});

});
