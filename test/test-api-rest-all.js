let expect  = require('chai').expect;
let request = require('request');
let jwt = require('../controllers/jwt');

let token=''; 
let tokenExpired='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJ0ZXN0Iiwicm9sZXMiOlt7InJvbCI6InRlc3QifV0sImlhdCI6MTUyODgyMjQ4OCwiZXhwIjoxNTI4ODIyODQ4fQ.oBdAZyrUdbMYEhErycpjIPWzlIBjVf6S8g9m7_6TVD0'; 
let user='x@x.com';
let randomId= Math.random()+'';
let projectId='unit-test11';
let pwd=jwt.encrypt('123456',projectId);
process.env.NODE_ENV = 'test';
protocol='http';

describe('Unit test api-rest - general service', function() {

/**
 * ADMIN SERVVICES
 */


step('init-project', function(done) {
    let url=`${protocol}://localhost:19999/project/${projectId}/_init`;
       let formString={
        projectDescription:"Proyecto de prueba",	
        user:{
            email:"x@x.com",
            pwd:"123456"	
         }
        };
    console.debug(url, formString);

    request.post({url,  body: formString, json:true} , function(error, response, body) {
        console.info("\t\tResponse: ",response.body);
        expect(response.statusCode).to.equal(200);
        done();
        });
    });
    
/**
 * LOGIN SERVVICES
 */

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
    step('authenticate-ok', function(done) {
        setTimeout(()=> {
        request.post({url:`${protocol}://localhost:20001/authenticate`,  form: {"email":"x@x.com", pwd, projectId}, json:true } , function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            token=response.headers['x-access-token'];
            expect(response.statusCode).to.equal(200);
            done();
            })}, 1300);
        });
        
/**
 * GENERAL SERVICES
 */
    step('add-1', function(done) {
        //console.log(`Add registry: ${randomId}`);
        let urlStr=`${protocol}://localhost:20000/test/1`
        request.put({url:urlStr,  form: {"description":"Test"},headers: {
            'x-access-token': token
            ,'x-projectid':projectId
            ,'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);

            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    step('add', function(done) {
        //console.log(`Add registry: ${randomId}`);
        let urlStr=`${protocol}://localhost:20000/test/${randomId}`
        request.put({url:urlStr,  form: {"description":"Test"},headers: {
            'x-access-token': token
            ,'x-projectid':projectId
            ,'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);

            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    step('add-header-projectid-missing', function(done) {
        //console.log(`Add registry: ${randomId}`);
        let urlStr=`${protocol}://localhost:20000/test/${randomId}`
        request.put({url:urlStr,  form: {"description":"Test"},headers: {
            'x-access-token': token,
            'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);

            expect(response.statusCode).to.equal(401);
            done();
        });
    });

    step('add-header-token-missing', function(done) {
        //console.log(`Add registry: ${randomId}`);
        let urlStr=`${protocol}://localhost:20000/test/${randomId}`
        request.put({url:urlStr,  form: {"description":"Test"},headers: {
            'x-projectid':projectId,
            'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);

            expect(response.statusCode).to.equal(401);
            done();
        });
    });

    step('add-header-user-missing', function(done) {
        //console.log(`Add registry: ${randomId}`);
        let urlStr=`${protocol}://localhost:20000/test/${randomId}`
        request.put({url:urlStr,  form: {"description":"Test"},headers: {
            'x-access-token': token,
            'x-projectid':projectId} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);

            expect(response.statusCode).to.equal(401);
            done();
        });
    });


    step('add-token-whith-user-incorrect', function(done) {
        let urlStr=`${protocol}://localhost:20000/test/${randomId}`
        request.put({url:urlStr,  form: {"description":"Test"},headers: {
            'x-access-token': token,
            'x-projectid':projectId,
            'x-user':`${user}xx`} } , function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(401);
            done();
        });
    });

    step('add-token-incorrect', function(done) {
        let urlStr=`${protocol}://localhost:20000/test/${randomId}`
        request.put({url:urlStr,  form: {"description":"Test"},headers: {
            'x-access-token': `${token}x`,
            'x-projectid':projectId,
            'x-user':user} } , function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(401);
            done();
        });
    });
    step('add-token-expired', function(done) {
        let urlStr=`${protocol}://localhost:20000/test/${randomId}`
        request.put({url:urlStr,  form: {"description":"Test"},headers: {
            'x-access-token': tokenExpired,
            'x-projectid':projectId,
            'x-user':user} } , function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(401);
            done();
        });
    });

    step('add-collection-not-authorized', function(done) {
        let urlStr=`${protocol}://localhost:20000/testx/${randomId}`
        request.put({url:urlStr,  form: {"description":"Test"},headers: {
            'x-access-token': token,
            'x-projectid':projectId,
            'x-user':user} } , function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(401);
            done();
        });
    });


    step('search-by-id-ok', function(done) {
        let urlStr=`${protocol}://localhost:20000/test/_searchById/1`;
        //console.log('Buscando ...', randomId);
        request({url:urlStr,headers: {
            'x-access-token': token,
            'x-projectid':projectId,
            'x-user':user}}, function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    step('search-by-id-not-found', function(done) {
        let urlStr=`${protocol}://localhost:20000/test/_searchById/10000000`;
        //console.log('Buscando ...', randomId);
        request({url:urlStr,headers: {
            'x-access-token': token,
            'x-projectid':projectId,
            'x-user':user}}, function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
    step('search-by-id-not-found-index', function(done) {
        let urlStr=`${protocol}://localhost:20000/testx/_searchById/10000000`;
        //console.log('Buscando ...', randomId);
        request({url:urlStr,headers: {
            'x-access-token': token,
            'x-projectid':projectId,
            'x-user':user}}, function(error, response, body) {
            console.info("\t\tResponse: ",body.body);
            expect(response.statusCode).to.equal(200);
            done();
        });
    });


    step('search-ok', function(done) {
        let urlStr=`${protocol}://localhost:20000/test/_search`;
        //console.log('Buscando ...', randomId);
        request.post({url:urlStr,headers: {
            'x-access-token': token,
            'x-projectid':projectId,
            'x-user':user}}, function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    step('search-not-found-index', function(done) {
        let urlStr=`${protocol}://localhost:20000/testx/_search`;
        //console.log('Buscando ...', randomId);
        request.post({url:urlStr,headers: {
            'x-access-token': token,
            'x-projectid':projectId,
            'x-user':user}}, function(error, response, body) {
            //console.info("\t\tResponse: ",body.body);
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    step('update-not-found', function(done) {
        //console.log(`Add registry: ${randomId}`);
        let urlStr=`${protocol}://localhost:20000/test/3333/_update`
        request.put({url:urlStr,  form: {"description":"Test"},headers: {
            'x-access-token': token,
            'x-projectid':projectId,
            'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);

            expect(response.statusCode).to.equal(404);
            done();
        });
    });

    step('delete-not-exits', function(done) {
        //console.log(`Del registry: ${randomId}`);
        let urlStr=`${protocol}://localhost:20000/test/33333`
        request.del({url:urlStr,headers: {
            'x-access-token': token,
            'x-projectid':projectId,
            'x-user':user}} , function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(404);
            done();
        });
    });

    step('update-ok', function(done) {
        //console.log(`Add registry: ${randomId}`);
        let urlStr=`${protocol}://localhost:20000/test/1/_update`
        setTimeout(()=> {
        request.put({url:urlStr,  form: {"description":"Test"},headers: {
            'x-access-token': token,
            'x-projectid':projectId,
            'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);

            expect(response.statusCode).to.equal(200);
            done();
        })},1000);
    });

    step('delete', function(done) {
        //console.log(`Del registry: ${randomId}`);
        let urlStr=`${protocol}://localhost:20000/test/${randomId}`
        setTimeout(()=> {
            request.del({url:urlStr,headers: {
                'x-access-token': token,
                'x-projectid':projectId,
                'x-user':user}} , function(error, response, body) {
                console.info("\t\tResponse: ",response.body);
                expect(response.statusCode).to.equal(200);
                done();
            });
        }, 1000);
    });

    step('add-duplicated', function(done) {
        let urlStr=`${protocol}://localhost:20000/test/1`
        setTimeout(()=> {
        request.put({url:urlStr,  form: {"description":"Test"},headers: {
            'x-access-token': token,
            'x-projectid':projectId,
            'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);

            expect(response.statusCode).to.equal(409);
            done();
        })
       },1000);
    });

    step('delete', function(done) {
        //console.log(`Del registry: ${randomId}`);
        let urlStr=`${protocol}://localhost:20000/test/1`
        setTimeout(()=> {
            request.del({url:urlStr,headers: {
                'x-access-token': token,
                'x-projectid':projectId,
                'x-user':user}} , function(error, response, body) {
                console.info("\t\tResponse: ",response.body);
                expect(response.statusCode).to.equal(200);
                done();
            });
        }, 10);
    });

    step('changes', function(done) {
        request({url:`${protocol}://localhost:20000/changes`,headers: {
            'x-access-token': token,
            'x-projectid':projectId,
            'x-user':user}} , function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    step('ping-ok', function(done) {
        request({url:`${protocol}://localhost:20000/ping`,headers: {
            'x-access-token': token,
            'x-projectid':projectId,
            'x-user':user}} , function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    step('fail', function(done) {
        request({url:`${protocol}://localhost:20000/fail`,headers: {
            'x-access-token': token,
            'x-projectid':projectId,
            'x-user':user}} , function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    step('ping-state-fail', function(done) {
        request({url:`${protocol}://localhost:20000/ping`,headers: {
            'x-access-token': token,
            'x-projectid':projectId,
            'x-user':user}} , function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(409);
            done();
        });
    });

    step('fix', function(done) {
        request({url:`${protocol}://localhost:20000/fix`,headers: {
            'x-access-token': token,
            'x-projectid':projectId,
            'x-user':user}} , function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    step('ping-2do-ok', function(done) {
        request({url:`${protocol}://localhost:20000/ping`,headers: {
            'x-access-token': token,
            'x-projectid':projectId,
            'x-user':user}} , function(error, response, body) {
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

    step('init-project-duplicated', function(done) {
        let url=`${protocol}://localhost:19999/project/${projectId}/_init`;
           let formString={
            projectDescription:"Proyecto de prueba",	
            user:{
                email:"x@x.com",
                pwd:"123456"	
             }
            };
        console.debug(url, formString);
        setTimeout(()=> {
        request.post({url,  body: formString, json:true} , function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(409);
            done();
            });
        })
    },1000);

        step('delete-project', function(done) {
            //console.log(`Del registry: ${randomId}`);
            let urlStr=`${protocol}://localhost:19999/project/${projectId}`
            setTimeout(()=> {
                request.del({url:urlStr,headers: {
                    'x-access-token': token,
                    'x-projectid':projectId,
                    'x-user':user}} , function(error, response, body) {
                    console.info("\t\tResponse: ",response.body);
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            }, 0);
        });

step('delete-user', function(done) {
    //console.log(`Del registry: ${randomId}`);
    let urlStr=`${protocol}://localhost:20000/users/${user}`
    setTimeout(()=> {
        request.del({url:urlStr,headers: {
            'x-access-token': token,
            'x-projectid':projectId,
            'x-user':user}} , function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(200);
            done();
        });
    }, 1000);
});

step('delete-rol', function(done) {
    //console.log(`Del registry: ${randomId}`);
    let urlStr=`${protocol}://localhost:20000/roles/admin`
    setTimeout(()=> {
        request.del({url:urlStr,headers: {
            'x-access-token': token,
            'x-projectid':projectId,
            'x-user':user}} , function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(200);
            done();
        });
    }, 1000);
});

});
