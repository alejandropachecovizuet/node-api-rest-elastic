let expect  = require('chai').expect;
let jwt = require('../controllers/jwt');
let admin = require('../controllers/adminController');
let general = require('../controllers/generalController');
let login = require('../controllers/loginController');
process.env.NODE_ENV = "test";


let token=''; 
let tokenExpired='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJ0ZXN0Iiwicm9sZXMiOlt7InJvbCI6InRlc3QifV0sImlhdCI6MTUyODgyMjQ4OCwiZXhwIjoxNTI4ODIyODQ4fQ.oBdAZyrUdbMYEhErycpjIPWzlIBjVf6S8g9m7_6TVD0'; 
let user='x@x.com';
let randomId= Math.random()+'';
let projectId='unit-test33';
let pwd=jwt.encrypt('123456',projectId);
process.env.NODE_ENV = 'test';
protocol='http';

describe('*********************************** Unit test api-rest - general service INSIDE *********************************** ', function() {
    step('init-project-inside', function(done) {
        let body={
            projectDescription:"Proyecto de prueba",	
            user:{
                email:"x@x.com",
                pwd:"123456"	
            }
            };
        request={method:'', url:'/init-project-test', body, params: {projectId}, headers: {'x-projectid':projectId}};
        response={};
        admin.initProject(request, response)
        .then(result=>expect(result.httpCode).to.equal(200)
            ,error=>{
                expect(error.response.statusCode).to.equal(0)
            }).finally(done);
        });

        
    step('authenticate-body-vacio-inside', function(done) {
        let body={};
        request={method:'', url:'/test', body, headers: {}};
        response={};
        login.authenticate(request, response)
        .then(result=>expect(result.httpCode).to.equal(200)
            ,error=>expect(error.httpCode).to.equal(400)
            ).finally(done);
        });

    /*
    step('login-stats-inside', function(done) {
        request(`${protocol}://localhost:20001/_stats` , function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
    */

    step('authenticate-ok-inside', function(done) {
        let body={"email":"x@x.com", pwd, projectId};
        request={method:'', url:'/test', body, headers: {}};
        response={headers:[]};
        setTimeout(()=> {
                login.authenticate(request, response)
            .then(result=>{
                token=response.headers['x-access-token'];
                expect(result.httpCode).to.equal(200)}
                ,error=>expect(error.httpCode).to.equal(0)
            ).finally(done)}
        , 1000);
        });

    step('add-1-inside', function(done) {
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':1, 'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        general.add(request, response)
            .then(result=>expect(result.httpCode).to.equal(200)
            ,error=>expect(error.httpCode).to.equal(0)
            ).finally(done);
        });

    step('add-ok-inside', function(done) {
        //console.log(`Add registry: ${randomId}`);
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':randomId, 'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        general.add(request, response)
            .then(result=>expect(result.httpCode).to.equal(200)
            ,error=>expect(error.httpCode).to.equal(0)
            ).finally(done);
        });    

    step('token-not-corresponding-user-inside', function(done) {
        //console.log(`Add registry: ${randomId}`);
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':randomId, 'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':`x${user}`}};
        response={headers:[]};
        general.add(request, response)
            .then(result=>expect(result.httpCode).to.equal(200)
            ,error=>expect(error.httpCode).to.equal(0)
            ).finally(done);
        });    
            
    step('add-header-projectid-missing-inside', function(done) {
        //console.log(`Add registry: ${randomId}`);
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':randomId, 'index':'test' }, body, headers: {'x-access-token': token ,'x-user':user}};
        response={headers:[]};
        general.add(request, response)
            .then(result=>expect(result.httpCode).to.equal(0)
            ,error=>expect(error.httpCode).to.equal(401)
            ).finally(done);
        });    

    step('add-header-token-missing-inside', function(done) {
        //console.log(`Add registry: ${randomId}`);
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':randomId, 'index':'test' }, body, headers: {'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        general.add(request, response)
            .then(result=>expect(result.httpCode).to.equal(0)
            ,error=>expect(error.httpCode).to.equal(401)
            ).finally(done);
        });    
            
    step('add-header-user-missing-inside', function(done) {
        //console.log(`Add registry: ${randomId}`);
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':randomId, 'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId}};
        response={headers:[]};
        general.add(request, response)
            .then(result=>expect(result.httpCode).to.equal(0)
            ,error=>expect(error.httpCode).to.equal(401)
            ).finally(done);
        });    
        
    step('add-token-whith-user-incorrect-inside', function(done) {
        //console.log(`Add registry: ${randomId}`);
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':randomId, 'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':`${user}xx`}};
        response={headers:[]};
        general.add(request, response)
            .then(result=>expect(result.httpCode).to.equal(0)
            ,error=>expect(error.httpCode).to.equal(401)
            ).finally(done);
        });    
        
    step('add-token-incorrect-inside', function(done) {
        //console.log(`Add registry: ${randomId}`);
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':randomId, 'index':'test' }, body, headers: {'x-access-token': `${token}x` ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        general.add(request, response)
            .then(result=>expect(result.httpCode).to.equal(0)
            ,error=>expect(error.httpCode).to.equal(401)
            ).finally(done);
        });    

    step('add-token-expired-inside', function(done) {
        //console.log(`Add registry: ${randomId}`);
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':randomId, 'index':'test' }, body, headers: {'x-access-token': tokenExpired ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        general.add(request, response)
            .then(result=>expect(result.httpCode).to.equal(0)
            ,error=>expect(error.httpCode).to.equal(401)
            ).finally(done);
        });    
   
    step('add-collection-not-authorized-inside', function(done) {
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':randomId, 'index':'testx' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        general.add(request, response)
            .then(result=>expect(result.httpCode).to.equal(0)
            ,error=>expect(error.httpCode).to.equal(401)
            ).finally(done);
        });    
                

    step('search-by-id-ok-inside', function(done) {
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':1, 'index':'test' }, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        general.findById(request, response)
            .then(result=>expect(result.httpCode).to.equal(200)
            ,error=>expect(error.httpCode).to.equal(0)
            ).finally(done);
        });    

    step('search-by-id-not-found-inside', function(done) {
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':10000000, 'index':'test' }, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        general.findById(request, response)
            .then(result=>expect(result.httpCode).to.equal(200)
            ,error=>expect(error.httpCode).to.equal(0)
            ).finally(done);
        });    

        
    step('search-by-id-not-found-index-inside', function(done) {
        request={method:'', url:'/test', params:{'id':1, 'index':'testx' }, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        general.findById(request, response)
            .then(result=>expect(result.httpCode).to.equal(200)
            ,error=>expect(error.httpCode).to.equal(0)
            ).finally(done);
        });    


    step('search-ok-inside', function(done) {
        let body={};
        request={method:'', url:'/test', params:{'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        general.find(request, response)
            .then(result=>expect(result.httpCode).to.equal(200)
            ,error=>expect(error.httpCode).to.equal(0)
            ).finally(done);
        });    
    
    step('search-not-found-index-inside', function(done) {
        let body={};
        request={method:'', url:'/test', params:{'index':'testx' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        general.find(request, response)
            .then(result=>expect(result.httpCode).to.equal(200)
            ,error=>expect(error.httpCode).to.equal(0)
            ).finally(done);
        });    

    step('update-not-found-inside', function(done) {
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':3333,'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        general.update(request, response)
            .then(result=>expect(result.httpCode).to.equal(0)
            ,error=>expect(error.httpCode).to.equal(404)
            ).finally(done);
        });    

    step('delete-not-exits-inside', function(done) {
        request={method:'', url:'/test', params:{'id':3333,'index':'test' }, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        general.deleteById(request, response)
            .then(result=>expect(result.httpCode).to.equal(0)
            ,error=>expect(error.httpCode).to.equal(404)
            ).finally(done);
        });    

    step('update-ok-inside', function(done) {
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':1,'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        general.update(request, response)
            .then(result=>expect(result.httpCode).to.equal(200)
            ,error=>expect(error.httpCode).to.equal(0)
            ).finally(done);
        });    

    step('delete-inside', function(done) {
        request={method:'', url:'/test', params:{'id':randomId,'index':'test' }, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        setTimeout(()=> {
            general.deleteById(request, response)
            .then(result=>expect(result.httpCode).to.equal(0)
            ,error=>expect(error.httpCode).to.equal(404)
            ).finally(done);
        }, 500);            
        });    
    
    step('add-duplicated-inside', function(done) {
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':1, 'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        setTimeout(()=> {
            general.add(request, response)
            .then(result=>expect(result.httpCode).to.equal(0)
            ,error=>expect(error.httpCode).to.equal(409)
            ).finally(done);
        },500);
    });

    step('delete-inside', function(done) {
        request={method:'', url:'/test', params:{'id':1,'index':'test' }, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        setTimeout(()=> {
            general.deleteById(request, response)
            .then(result=>expect(result.httpCode).to.equal(200)
            ,error=>expect(error.httpCode).to.equal(0)
            ).finally(done);
        }, 500);            
        });    

    step('init-project-duplicated-inside', function(done) {
        let body={
            projectDescription:"Proyecto de prueba",	
            user:{
                email:"x@x.com",
                pwd:"123456"	
            }
            };
        request={method:'', url:'/init-project-duplicated-test', body, params: {projectId}, headers: {'x-projectid':projectId}};
        response={};
        setTimeout(()=> {
            admin.initProject(request, response)
            .then(result=>expect(result.httpCode).to.equal(0)
            ,error=>expect(error.httpCode).to.equal(409)
            ).finally(done);
        },1000);
    });
    
    step('delete-project-inside', function(done) {
        request={method:'', url:'/test', params:{'projectId':projectId }};
        response={headers:[]};
        setTimeout(()=> {
            admin.deleteProject(request, response)
            .then(result=>expect(result.httpCode).to.equal(200)
            ,error=>expect(error.httpCode).to.equal(0)
            ).finally(done);
        }, 500);            
        });    

    step('delete-user-inside', function(done) {
        request={method:'', url:'/test', params:{'id':user,'index':'users' },  headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        setTimeout(()=> {
            general.deleteById(request, response)
            .then(result=>expect(result.httpCode).to.equal(200)
            ,error=>expect(error.httpCode).to.equal(0)
            ).finally(done);
        }, 500);            
        });    

    step('delete-rol-inside', function(done) {
        request={method:'', url:'/test', params:{'id':'admin','index':'roles' },  headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        setTimeout(()=> {
            general.deleteById(request, response)
            .then(result=>expect(result.httpCode).to.equal(200)
            ,error=>expect(error.httpCode).to.equal(0)
            ).finally(done);
        }, 500);            
    });
});