let expect  = require('chai').expect;
let request = require('request');

let token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJ0ZXN0Iiwicm9sZXMiOlt7InJvbCI6InRlc3QifV0sImlhdCI6MTUyODgyNDcyOSwiZXhwIjoxODg4ODI0NzI5fQ.r8yPM3svhwo7Xcs5fcjSQ104XIbM0juNnwrnAe7qlSE'; 
let tokenExpired='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJ0ZXN0Iiwicm9sZXMiOlt7InJvbCI6InRlc3QifV0sImlhdCI6MTUyODgyMjQ4OCwiZXhwIjoxNTI4ODIyODQ4fQ.oBdAZyrUdbMYEhErycpjIPWzlIBjVf6S8g9m7_6TVD0'; 
let user='test';
let randomId= Math.random()+'';
process.env.NODE_ENV = 'test';
protocol='http';

describe('Unit test api-rest - general service', function() {

step('add', function(done) {
    //console.log(`Add registry: ${randomId}`);
    let urlStr=`${protocol}://localhost:20000/app_test/${randomId}`
    request.put({url:urlStr,  form: {"description":"Test"},headers: {
        'x-access-token': token,
        'ux':user} } , function(error, response, body) {        
        console.info("\t\tResponse: ",response.body);

        expect(response.statusCode).to.equal(200);
        done();
    });
});

step('add-duplicated', function(done) {
    let urlStr=`${protocol}://localhost:20000/app_test/1`
    request.put({url:urlStr,  form: {"description":"Test"},headers: {
        'x-access-token': token,
        'ux':user} } , function(error, response, body) {        
        console.info("\t\tResponse: ",response.body);

        expect(response.statusCode).to.equal(409);
        done();
    });
});

step('add-token-whith-user-incorrect', function(done) {
    let urlStr=`${protocol}://localhost:20000/app_test/${randomId}`
    request.put({url:urlStr,  form: {"description":"Test"},headers: {
        'x-access-token': token,
        'ux':`${user}xx`} } , function(error, response, body) {
        console.info("\t\tResponse: ",response.body);
        expect(response.statusCode).to.equal(401);
        done();
    });
});

step('add-token-incorrect', function(done) {
    let urlStr=`${protocol}://localhost:20000/app_test/${randomId}`
    request.put({url:urlStr,  form: {"description":"Test"},headers: {
        'x-access-token': `${token}x`,
        'ux':user} } , function(error, response, body) {
        console.info("\t\tResponse: ",response.body);
        expect(response.statusCode).to.equal(401);
        done();
    });
});
step('add-token-expired', function(done) {
    let urlStr=`${protocol}://localhost:20000/app_test/${randomId}`
    request.put({url:urlStr,  form: {"description":"Test"},headers: {
        'x-access-token': tokenExpired,
        'ux':user} } , function(error, response, body) {
        console.info("\t\tResponse: ",response.body);
        expect(response.statusCode).to.equal(401);
        done();
    });
});

step('add-collection-not-authorized', function(done) {
    let urlStr=`${protocol}://localhost:20000/app_testx/${randomId}`
    request.put({url:urlStr,  form: {"description":"Test"},headers: {
        'x-access-token': token,
        'ux':user} } , function(error, response, body) {
        console.info("\t\tResponse: ",response.body);
        expect(response.statusCode).to.equal(401);
        done();
    });
});


step('search-by-id-ok', function(done) {
    let urlStr=`${protocol}://localhost:20000/app_test/_searchById/1`;
    //console.log('Buscando ...', randomId);
    request({url:urlStr,headers: {
        'x-access-token': token,
        'ux':user}}, function(error, response, body) {
        console.info("\t\tResponse: ",response.body);
        expect(response.statusCode).to.equal(200);
        done();
    });
});

step('search-by-id-not-found', function(done) {
    let urlStr=`${protocol}://localhost:20000/app_test/_searchById/10000000`;
    //console.log('Buscando ...', randomId);
    request({url:urlStr,headers: {
        'x-access-token': token,
        'ux':user}}, function(error, response, body) {
        console.info("\t\tResponse: ",response.body);
        expect(response.statusCode).to.equal(200);
        done();
    });
});
step('search-by-id-not-found-index', function(done) {
    let urlStr=`${protocol}://localhost:20000/app_testx/_searchById/10000000`;
    //console.log('Buscando ...', randomId);
    request({url:urlStr,headers: {
        'x-access-token': token,
        'ux':user}}, function(error, response, body) {
        console.info("\t\tResponse: ",body.body);
        expect(response.statusCode).to.equal(200);
        done();
    });
});


step('search-ok', function(done) {
    let urlStr=`${protocol}://localhost:20000/app_test/_search`;
    //console.log('Buscando ...', randomId);
    request.post({url:urlStr,headers: {
        'x-access-token': token,
        'ux':user}}, function(error, response, body) {
        console.info("\t\tResponse: ",response.body);
        expect(response.statusCode).to.equal(200);
        done();
    });
});

step('search-not-found-index', function(done) {
    let urlStr=`${protocol}://localhost:20000/app_testx/_search`;
    //console.log('Buscando ...', randomId);
    request.post({url:urlStr,headers: {
        'x-access-token': token,
        'ux':user}}, function(error, response, body) {
        //console.info("\t\tResponse: ",body.body);
        expect(response.statusCode).to.equal(200);
        done();
    });
});


step('delete', function(done) {
    //console.log(`Del registry: ${randomId}`);
    let urlStr=`${protocol}://localhost:20000/app_test/${randomId}`
    setTimeout(function() {
        request.del({url:urlStr,headers: {
            'x-access-token': token,
            'ux':user}} , function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(200);
            done();
        });
    }, 1000);
  });

  step('delete-not-exits', function(done) {
    //console.log(`Del registry: ${randomId}`);
    let urlStr=`${protocol}://localhost:20000/app_test/33333`
    request.del({url:urlStr,headers: {
        'x-access-token': token,
        'ux':user}} , function(error, response, body) {
        console.info("\t\tResponse: ",response.body);
        expect(response.statusCode).to.equal(404);
        done();
    });
  });

step('changes', function(done) {
    request({url:`${protocol}://localhost:20000/changes`,headers: {
        'x-access-token': token,
        'ux':user}} , function(error, response, body) {
        console.info("\t\tResponse: ",response.body);
        expect(response.statusCode).to.equal(200);
        done();
    });
  });

  step('ping-ok', function(done) {
    request({url:`${protocol}://localhost:20000/ping`,headers: {
        'x-access-token': token,
        'ux':user}} , function(error, response, body) {
        console.info("\t\tResponse: ",response.body);
        expect(response.statusCode).to.equal(200);
        done();
    });
  });

  step('fail', function(done) {
    request({url:`${protocol}://localhost:20000/fail`,headers: {
        'x-access-token': token,
        'ux':user}} , function(error, response, body) {
        console.info("\t\tResponse: ",response.body);
        expect(response.statusCode).to.equal(200);
        done();
    });
  });

  step('ping-state-fail', function(done) {
    request({url:`${protocol}://localhost:20000/ping`,headers: {
        'x-access-token': token,
        'ux':user}} , function(error, response, body) {
        console.info("\t\tResponse: ",response.body);
        expect(response.statusCode).to.equal(409);
        done();
    });
  });

  step('fix', function(done) {
    request({url:`${protocol}://localhost:20000/fix`,headers: {
        'x-access-token': token,
        'ux':user}} , function(error, response, body) {
        console.info("\t\tResponse: ",response.body);
        expect(response.statusCode).to.equal(200);
        done();
    });
  });

  step('ping-2do-ok', function(done) {
    request({url:`${protocol}://localhost:20000/ping`,headers: {
        'x-access-token': token,
        'ux':user}} , function(error, response, body) {
        console.info("\t\tResponse: ",response.body);
        expect(response.statusCode).to.equal(200);
        done();
    });
  });

  step('general-stats', function(done) {
    request(`${protocol}://localhost:20001/_stats` , function(error, response, body) {
        console.info("\t\tResponse: ",response.body);
        expect(response.statusCode).to.equal(200);
        done();
    });
  });

});
