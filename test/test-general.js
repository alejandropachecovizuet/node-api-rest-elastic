var expect  = require('chai').expect;
var request = require('request');

process.env.NODE_ENV = 'test';
let randomId= Math.random();

describe('Unit test api-rest - general service', function() {

step('search by id', function(done) {
    request('http://localhost:20000/app_test/_searchById/6' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});

step('add', function(done) {
    console.log(`Add registry: ${randomId}`);
    let urlStr=`http://localhost:20000/app_test/${randomId}`
    request.put({url:urlStr,  form: {"description":"Test"} } , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});


step('delete', function(done) {
    console.log(`Del registry: ${randomId}`);
    let urlStr=`http://localhost:20000/app_test/${randomId}`
    setTimeout(function() {
        request.del({url:urlStr} , function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    }, 1000);
  });

step('changes', function(done) {
    request({url:'http://localhost:20000/changes'} , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
  });

});
