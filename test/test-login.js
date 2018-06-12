let expect  = require('chai').expect;
let request = require('request');

process.env.NODE_ENV = 'test';
let randomId= Math.random();
protocol='http';

describe('Unit test api-rest - login service', function() {

    step('authenticate-ok', function(done) {
    request.post({url:`${protocol}://localhost:20001/authenticate`,  form: {"username":"test", "pwd":"123456"} } , function(error, response, body) {
        console.info("\t\tResponse: ",response.body);
        expect(response.statusCode).to.equal(200);
        done();
        });
    });
    step('authenticate-body-vacio', function(done) {
        request.post({url:`${protocol}://localhost:20001/authenticate`,  form: {} } , function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(400);
            done();
            });
        });
  step('login-stats', function(done) {
        request(`${protocol}://localhost:20001/_stats` , function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
});
