let sleep = require('thread-sleep');
let expect  = require('chai').expect;
let jwt = require('../controllers/jwt');
let admin = require('../controllers/adminController');
let general = require('../controllers/generalController');
let login = require('../controllers/loginController');
process.env.NODE_ENV = "test";


let token=''; 
let token5='';
let token7='';
let tokenExpired='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJ0ZXN0Iiwicm9sZXMiOlt7InJvbCI6InRlc3QifV0sImlhdCI6MTUyODgyMjQ4OCwiZXhwIjoxNTI4ODIyODQ4fQ.oBdAZyrUdbMYEhErycpjIPWzlIBjVf6S8g9m7_6TVD0'; 
let user='x@x.com';
let randomId= Math.random()+'';
let projectId='unit-test3';
let pwd=jwt.encrypt('123456',projectId);
process.env.NODE_ENV = 'test';
protocol='http';

describe('*********************************** Unit test api-rest - general service INSIDE *********************************** ', function() {
    step('init-project-inside', async ()=> {
        let body={
            projectDescription:"Proyecto de prueba",	
            user:{
                email:"x@x.com",
                pwd:"123456"	
            }
            };
        request={ method:'', url:'/init-project-test', body, params: {projectId}, headers: {'x-projectid':projectId}};
        response={};
        let code=200;
        try {
            const result = await admin.initProject(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
        });    


    step('init-project-error-add-user-inside', async ()=> {
        let body={
            projectDescription:"Proyecto de prueba",	
            user:{
                email:"x@x.com",
                pwd:"123456"	
            }
            };
        let testOptions={err_db_add_users:'Error provocado para las pruebas unitarias - agregar el usuario'};
        request={testOptions, method:'', url:'/init-project-test', body, params: {projectId:`${projectId}err`}, headers: {'x-projectid':projectId}};
        response={};
        let code=500;
        try {
            const result = await admin.initProject(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
        });    

    step('init-project-error-findBy-inside', async ()=> {
        let body={
            projectDescription:"Proyecto de prueba",	
            user:{
                email:"x@x.com",
                pwd:"123456"	
            }
            };
        let testOptions={err_db_findById_projects:'Error provocado para las pruebas unitarias - busqueda de projecto'};
        request={testOptions, method:'', url:'/init-project-test', body, params: {projectId:`${projectId}err1`}, headers: {'x-projectid':projectId}};
        response={};
        let code=500;
        try {
            const result = await admin.initProject(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
        });    
            
        
    step('init-project-error-add-project-inside', async ()=> {
        let body={
            projectDescription:"Proyecto de prueba",	
            user:{
                email:"x@x.com",
                pwd:"123456"	
            }
            };
        let testOptions={err_db_add_projects:'Error provocado para las pruebas unitarias - Agregando proyecto'};
        request={testOptions, method:'', url:'/init-project-test', body, params: {projectId:`${projectId}err2`}, headers: {'x-projectid':projectId}};
        response={};
        let code=500;
        try {
            const result = await admin.initProject(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
        });    
    
    step('init-project-error-add-rol-inside', async ()=> {
        let body={
            projectDescription:"Proyecto de prueba",	
            user:{
                email:"x@x.com",
                pwd:"123456"	
            }
            };
        let testOptions={err_db_add_roles:'Error provocado para las pruebas unitarias - Agregando rol'};
        request={testOptions, method:'', url:'/init-project-test', body, params: {projectId:`${projectId}err3`}, headers: {'x-projectid':projectId}};
        response={};
        let code=500;
        try {
            const result = await admin.initProject(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    step('init-project-error-add-rol-and-delete-project-inside', async ()=> {
        let body={
            projectDescription:"Proyecto de prueba",	
            user:{
                email:"x@x.com",
                pwd:"123456"	
            }
            };
        let testOptions={err_db_add_roles:'Error provocado para las pruebas unitarias - Agregando rol', err_db_delete_projects:'Error provocado para las pruebas unitarias -borrado de projecto'};
        request={testOptions, method:'', url:'/init-project-test', body, params: {projectId:`${projectId}err${randomId}`.replace('.', '')}, headers: {'x-projectid':projectId}};
        response={};
        let code=500;
        try {
            const result = await admin.initProject(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
        });
                                
    
    step('init-project-error-add-user-inside', async ()=> {
        let body={
            projectDescription:"Proyecto de prueba",	
            user:{
                email:"x@x.com",
                pwd:"123456"	
            }
            };
        let testOptions={err_db_add_users:'Error provocado para las pruebas unitarias - Agregando usuario'};
        request={testOptions, method:'', url:'/init-project-test', body, params: {projectId:`${projectId}err6`}, headers: {'x-projectid':projectId}};
        response={};
        let code=500;
        try {
            const result = await admin.initProject(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
        });    
    step('init-project-error-add-user-and-delete-ron-inside', async ()=> {
        let body={
            projectDescription:"Proyecto de prueba",	
            user:{
                email:"x@x.com",
                pwd:"123456"	
            }
            };
        let testOptions={err_db_add_users:'Error provocado para las pruebas unitarias - Agregando usuario', err_db_delete_roles:'Error provocado para las pruebas unitarias - Borrado de rol'};
        request={testOptions, method:'', url:'/init-project-test', body, params: {projectId:`${projectId}err${randomId+1}`.replace('.', '')}, headers: {'x-projectid':projectId}};
        response={};
        let code=500;
        try {
            const result = await admin.initProject(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    
    step('init-project-error-schema', async ()=> {
        let body={
            projectDescription:"Proyecto de prueba",	
            user:{
                email:"x@x.com",
                pwd:"123456"	
            }
            };
        let testOptions={err_schema:'Error provocado para las pruebas unitarias -En validación de schema'};
        request={testOptions, method:'', url:'/init-project-test', body, params: {projectId:`${projectId}err8`}, headers: {'x-projectid':projectId}};
        response={};
        let code=400;
        try {
            const result = await admin.initProject(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    step('authenticate-body-vacio-inside', async ()=> {
        let body={};
        request={method:'', url:'/test', body, headers: {}};
        response={};
        let code=400;
        try {
            const result = await login.authenticate(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
        });    

    step('authenticate-ok-inside', async ()=> {
        sleep(1000);
        let body={email:"x@x.com", pwd, projectId};
        request={method:'', url:'/test', body, headers: {}};
        response={headers:[]};
        let code=200;
        try {
            const result = await login.authenticate(request, response);
            token=result.response.headers['x-access-token'];
            console.trace('****************TOKEN**************',token)
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step('authenticate-passwordIncorrect-inside', async ()=> {
        let body={email:"x@x.com", pwd:`${pwd}x`, projectId};
        request={method:'', url:'/test', body, headers: {}};
        response={headers:[]};
        let code=401;
        try {
            const result = await login.authenticate(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step('authenticate-user-not-found-inside', async ()=> {
        let body={email:"x@x.comx", pwd, projectId};
        request={method:'', url:'/test', body, headers: {}};
        response={headers:[]};
        let code=401;
        try {
            const result = await login.authenticate(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });


    step('add-schema-not-found-inside', async ()=> {
        //sleep(1000);
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{id:1, index:'testx' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=400;
        try {
            const result = await general.add(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error('********************xccxxc',error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    step('add-1-inside', async ()=> {
        //sleep(1000);
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{id:1, index:'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await general.add(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error('********************xccxxc',error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    step('add-error-add-inside', async ()=> {
        let body={"description":"Test"};
        let testOptions={err_db_add_test:'Error provocado para las pruebas unitarias - Agregando registro'};
        request={testOptions,method:'', url:'/test', params:{'id':randomId, index:'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
            let code=500;
        try {
            const result = await general.add(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    step('add-error-findById-inside', async ()=> {
        let body={"description":"Test"};
        let testOptions={err_db_findById_test:'Error provocado para las pruebas unitarias - buscando registro'};
        request={testOptions,method:'', url:'/test', params:{'id':randomId, index:'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
            let code=404;
        try {
            const result = await general.add(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    


    step('token-not-corresponding-user-inside', async ()=> {
        let body={"email":"x@x.com", pwd, projectId};;
        request={method:'', url:'/test', params:{'id':randomId, 'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':`x${user}`}};
        response={headers:[]};
        let code=401;
        try {
            const result = await general.add(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    step('add-header-projectid-missing-inside', async ()=> {
        //console.log(`Add registry: ${randomId}`);
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':randomId, 'index':'test' }, body, headers: {'x-access-token': token ,'x-user':user}};
        response={headers:[]};
        let code=401;
        try {
            const result = await general.add(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    step('add-header-token-missing-inside', async ()=> {
        //console.log(`Add registry: ${randomId}`);
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':randomId, 'index':'test' }, body, headers: {'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=401;
        try {
            const result = await general.add(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    
            
    step('add-header-user-missing-inside', async ()=> {
        //console.log(`Add registry: ${randomId}`);
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':randomId, 'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId}};
        response={headers:[]};
        let code=401;
        try {
            const result = await general.add(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    
        
    step('add-token-whith-user-incorrect-inside', async ()=> {
        //console.log(`Add registry: ${randomId}`);
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':randomId, 'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':`${user}xx`}};
        response={headers:[]};
        let code=401;
        try {
            const result = await general.add(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    
        
    step('add-token-incorrect-inside', async ()=> {
        //console.log(`Add registry: ${randomId}`);
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':randomId, 'index':'test' }, body, headers: {'x-access-token': `${token}x` ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=401;
        try {
            const result = await general.add(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    step('add-token-expired-inside', async ()=> {
        //console.log(`Add registry: ${randomId}`);
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':randomId, 'index':'test' }, body, headers: {'x-access-token': tokenExpired ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=401;
        try {
            const result = await general.add(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    
   
    step('add-collection-not-authorized-inside', async ()=> {
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':randomId, 'index':'testy' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=401;
        try {
            const result = await general.add(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    
                
    step('add-ok-inside', async ()=> {
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':randomId, 'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
            let code=200;
        try {
            const result = await general.add(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    step('search-by-id-ok-inside', async ()=> {
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':1, 'index':'test' }, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await general.findById(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    step('search-missing-projectid-inside', async ()=> {
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':1, 'index':'test' }, headers: {'x-access-token': token ,'x-user':user}};
        response={headers:[]};
        let code=401;
        try {
            const result = await general.findById(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    
            
    step('search-by-id-error-findById-inside', async ()=> {
        let body={"description":"Test"};
        let testOptions={err_db_findById_test:'Error provocado para las pruebas unitarias - buscando registro'};
        request={testOptions,method:'', url:'/test', params:{'id':1, 'index':'test' }, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=500;
        try {
            const result = await general.findById(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    
            

    step('search-by-id-not-found-inside', async ()=> {
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':10000000, 'index':'test' }, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await general.findById(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

        
    step('search-by-id-not-found-index-inside', async ()=> {
        request={method:'', url:'/test', params:{'id':1, 'index':'testx' }, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await general.findById(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    


    step('search-ok-inside', async ()=> {
        let body={};
        request={method:'', url:'/test', params:{'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await general.find(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    step('search-token-incorrect-inside', async ()=> {
        let body={};
        request={method:'', url:'/test', params:{'index':'test' }, body, headers: {'x-access-token': `${token}x` ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=401;
        try {
            const result = await general.find(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    
            
    step('search-error-find_db-inside', async ()=> {
        let body={};
        let testOptions={err_db_find_test:'Error provocado para las pruebas unitarias - buscando registros'};
        request={testOptions,method:'', url:'/test', params:{'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=500;
        try {
            const result = await general.find(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    


    step('search-not-found-index-inside', async ()=> {
        let body={};
        request={method:'', url:'/test', params:{'index':'testx' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await general.find(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    step('update-not-found-inside', async ()=> {
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':3333,'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=404;
        try {
            const result = await general.update(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    


    step('delete-not-exits-inside', async ()=> {
        request={method:'', url:'/test', params:{'id':3333,'index':'test' }, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=404;
        try {
            const result = await general.deleteById(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    step('update-ok-inside', async ()=> {
        sleep(1000);        
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':1,'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await general.update(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    step('update-missing-user-inside', async ()=> {
        //sleep(1000);        
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':1,'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId}};
        response={headers:[]};
        let code=401;
        try {
            const result = await general.update(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    


    step('update-error-update-inside', async ()=> {
        let body={"description":"Test"};
        let testOptions={err_db_update_test:'Error provocado para las pruebas unitarias - actualizando registro'};
        request={testOptions,method:'', url:'/test', params:{'id':1,'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=500;
        try {
            const result = await general.update(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    step('update-error-findById-inside', async ()=> {
        let body={"description":"Test"};
        let testOptions={err_db_findById_test:'Error provocado para las pruebas unitarias - buscando registro'};
        request={testOptions,method:'', url:'/test', params:{'id':1,'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=404;
        try {
            const result = await general.update(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    step('delete-error-in-delete-inside', async ()=> {
        let testOptions={err_db_delete_test:'Error provocado para las pruebas unitarias - borrando registro'};
        request={testOptions,method:'', url:'/test', params:{'id':randomId,'index':'test' }, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=500;
        try {
            const result = await general.deleteById(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    step('delete-error-findById-inside', async ()=> {
        let testOptions={err_db_findById_test:'Error provocado para las pruebas unitarias - buscando registro'};
        request={testOptions,method:'', url:'/test', params:{'id':randomId,'index':'test' }, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=404;
        try {
            const result = await general.deleteById(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    step('delete-error-token-bad-inside', async ()=> {
        request={method:'', url:'/test', params:{'id':randomId,'index':'test' }, headers: {'x-access-token': `${token}x` ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=401;
        try {
            const result = await general.deleteById(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    step('delete-inside', async ()=> {
        //sleep(1000);        
        request={method:'', url:'/test', params:{'id':randomId,'index':'test' }, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await general.deleteById(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    
           
    step('add-duplicated-inside', async ()=> {
        let body={"description":"Test"};
        request={method:'', url:'/test', params:{'id':1, 'index':'test' }, body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=409;
        try {
            const result = await general.add(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error('********************xccxxc',error);
            expect(error.httpCode).to.equal(code);                
        }
});    

    step('delete-inside', async ()=> {
        request={method:'', url:'/test', params:{'id':1,'index':'test' }, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await general.deleteById(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
});    

    step('init-project-duplicated-inside', async ()=> {
        let body={
            projectDescription:"Proyecto de prueba",	
            user:{
                email:"x@x.com",
                pwd:"123456"	
            }
            };
        request={method:'', url:'/init-project-duplicated-test', body, params: {projectId}, headers: {'x-projectid':projectId}};
        response={};
        let code=409;
        try {
            const result = await admin.initProject(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
        });    

    step('delete-project-error-delete-inside', async ()=> {
        let testOptions={err_db_delete_projects:'Error provocado para las pruebas unitarias - borrado de proyecto'};
        request={testOptions, method:'', url:'/test', params:{'projectId':projectId }};
        response={headers:[]};
        let code=500;
        try {
            const result = await admin.deleteProject(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    
    
    step('delete-project-inside', async ()=> {
        request={method:'', url:'/test', params:{'projectId':projectId }};
        response={headers:[]};
        let code=200;
        try {
            const result = await admin.deleteProject(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

        step('delete-user-inside', async ()=> {
        request={method:'', url:'/test', params:{'id':user,'index':'users' },  headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await general.deleteById(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    

    step('delete-rol-inside', async ()=> {
        request={method:'', url:'/test', params:{'id':'admin','index':'roles' },  headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await general.deleteById(request, response);
            expect(result.httpCode).to.equal(code)            
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });
    

    step('authenticate-error-findById-projects-inside', async ()=> {
        //sleep(1000);
        let body={email:"x@x.com", pwd, projectId};
        let testOptions={err_phrase:'Error provocado para las pruebas unitarias -Consulta de la phrase'};
        request={testOptions,method:'', url:'/test', body, headers: {}};
        response={headers:[]};
        let code=401;
        try {
            const result = await login.authenticate(request, response);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });    
});
