let sleep = require('thread-sleep');
let expect  = require('chai').expect;
let request = require('request');
let jwt = require('../controllers/jwt');
let admin = require('../controllers/adminController');
let login = require('../controllers/loginController');
let fileManager = require('../controllers/fileManagerController');
let b64s = require('./b64s');

let projectId='unit-test-file1';
let user='x@x.com';
let token=''; 
let pwd=jwt.encrypt('123456',projectId);
let lastIdFile='';
let subId='';

describe('*********************************** Unit test api-rest - INSIDE- file manager *********************************** ', function() {
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

    step('authenticate-ok-inside', async ()=> {
        sleep(3000);
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
    let testName='b64_all_zip-unzip-inside';
    step(`add-${testName}`, async ()=> {
        let body={"file":b64s.b64_all_zip ,"name":"Archivo de prueba unitaria" ,"unzipFormat":"zip"};
        request={method:'', url:'/test', body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.add(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.warning).to.equal(undefined);
            expect(result.bodyOut.id).to.be.a('string');
            lastIdFile=result.bodyOut.id;
            console.info('lastIdFile:',lastIdFile);

        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step(`search-${testName}`, async ()=> {
        sleep(1000);
        request={method:'', url:`/test-search-${testName}`, params:{id:lastIdFile, projectId}, headers: {}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.findByIdGlobal(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.files).to.have.lengthOf(6);
            subId=result.bodyOut.files[0].uuid;
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step(`search-subId-${testName}`, async ()=> {
        sleep(1000);
        request={method:'', url:'/test', params:{id:lastIdFile, subId, projectId}, headers: {}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.findByIdGlobal(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.files).to.equal(undefined);
            subId=result.bodyOut.uuid;
            lastIdFile=undefined;
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    testName='b64_all_zip-errorunzip-inside';
    step(`add-${testName}`, async ()=> {
        let body={"file":b64s.b64_all_zip ,"name":"Archivo de prueba unitaria" ,"unzipFormat":"tar"};
        request={method:'', url:'/test', body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.add(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.warning).to.be.a('string');
            expect(result.bodyOut.id).to.be.a('string');

            lastIdFile=result.bodyOut.id;
            console.info('lastIdFile:',lastIdFile);

        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step(`search-${testName}`, async ()=> {
        sleep(1000);
        request={method:'', url:'/test', params:{id:lastIdFile, projectId}, headers: {}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.findByIdGlobal(request, response);
            //console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.file).to.be.a('string');
            lastIdFile=undefined;
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });


    testName='b64_all_zip-nounzip-inside';
    step(`add-${testName}`, async ()=> {
        let body={"file":b64s.b64_all_zip ,"name":"Archivo de prueba unitaria"};
        request={method:'', url:'/test', body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.add(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.warning).to.equal(undefined);
            expect(result.bodyOut.id).to.be.a('string');

            lastIdFile=result.bodyOut.id;
            console.info('lastIdFile:',lastIdFile);

        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step(`search-${testName}`, async ()=> {
        sleep(1000);
        request={method:'', url:'/test', params:{id:lastIdFile, projectId}, headers: {}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.findByIdGlobal(request, response);
            //console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.file).to.be.a('string');
            lastIdFile=undefined;
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    testName='b64_one_zip_unzip-inside';
    step(`add-${testName}`, async ()=> {
        let body={"file":b64s.b64_one_zip ,"name":"Archivo de prueba unitaria","unzipFormat":"zip"};
        request={method:'', url:'/test', body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.add(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.warning).to.equal(undefined);
            expect(result.bodyOut.id).to.be.a('string');

            lastIdFile=result.bodyOut.id;
            console.info('lastIdFile:',lastIdFile);

        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step(`search-${testName}`, async ()=> {
        sleep(1000);
        request={method:'', url:'/test', params:{id:lastIdFile, projectId}, headers: {}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.findByIdGlobal(request, response);
            //console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.file).to.be.a('string');
            lastIdFile=undefined;
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    testName='b64_one_gz_unzip-inside';
    step(`add-${testName}`, async ()=> {
        let body={"file":b64s.b64_one_gz ,"name":"Archivo de prueba unitaria","unzipFormat":"gz"};
        request={method:'', url:'/test', body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.add(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.warning).to.equal(undefined);
            expect(result.bodyOut.id).to.be.a('string');

            lastIdFile=result.bodyOut.id;
            console.info('lastIdFile:',lastIdFile);

        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step(`search-${testName}`, async ()=> {
        sleep(1000);
        request={method:'', url:'/test', params:{id:lastIdFile, projectId}, headers: {}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.findByIdGlobal(request, response);
            //console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.file).to.be.a('string');
            lastIdFile=undefined;
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    testName='b64_one_bz2_unzip-inside';
    step(`add-${testName}`, async ()=> {
        let body={"file":b64s.b64_one_bz2 ,"name":"Archivo de prueba unitaria","unzipFormat":"bz2"};
        request={method:'', url:'/test', body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.add(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.warning).to.equal(undefined);
            expect(result.bodyOut.id).to.be.a('string');

            lastIdFile=result.bodyOut.id;
            console.info('lastIdFile:',lastIdFile);

        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step(`search-${testName}`, async ()=> {
        sleep(1000);
        request={method:'', url:'/test', params:{id:lastIdFile, projectId}, headers: {}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.findByIdGlobal(request, response);
            //console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.file).to.be.a('string');
            lastIdFile=undefined;
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });
    
    testName='b64_one_tar_unzip-inside';
    step(`add-${testName}`, async ()=> {
        let body={"file":b64s.b64_one_tar ,"name":"Archivo de prueba unitaria","unzipFormat":"tar"};
        request={method:'', url:'/test', body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.add(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.warning).to.equal(undefined);
            expect(result.bodyOut.id).to.be.a('string');

            lastIdFile=result.bodyOut.id;
            console.info('lastIdFile:',lastIdFile);

        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step(`search-${testName}`, async ()=> {
        sleep(1000);
        request={method:'', url:'/test', params:{id:lastIdFile, projectId}, headers: {}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.findByIdGlobal(request, response);
            //console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.file).to.be.a('string');
            lastIdFile=undefined;
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    testName='b64_one_tar_gz_unzip-inside';
    step(`add-${testName}`, async ()=> {
        let body={"file":b64s.b64_one_tar_gz ,"name":"Archivo de prueba unitaria","unzipFormat":"tar.gz"};
        request={method:'', url:'/test', body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.add(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.warning).to.equal(undefined);
            expect(result.bodyOut.id).to.be.a('string');

            lastIdFile=result.bodyOut.id;
            console.info('lastIdFile:',lastIdFile);

        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step(`search-${testName}`, async ()=> {
        sleep(1000);
        request={method:'', url:'/test', params:{id:lastIdFile, projectId}, headers: {}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.findByIdGlobal(request, response);
            //console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.file).to.be.a('string');
            lastIdFile=undefined;
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });
    
    testName='b64_one_tar_bz2_unzip-inside';
    step(`add-${testName}`, async ()=> {
        let body={"file":b64s.b64_one_tar_bz2 ,"name":"Archivo de prueba unitaria","unzipFormat":"tar.bz2"};
        request={method:'', url:'/test', body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.add(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.warning).to.equal(undefined);
            expect(result.bodyOut.id).to.be.a('string');

            lastIdFile=result.bodyOut.id;
            console.info('lastIdFile:',lastIdFile);

        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step(`search-${testName}`, async ()=> {
        sleep(1000);
        request={method:'', url:'/test', params:{id:lastIdFile, projectId}, headers: {}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.findByIdGlobal(request, response);
            //console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.file).to.be.a('string');
            lastIdFile=undefined;
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });
    
    testName='b64_one_tgz_unzip-inside';
    step(`add-${testName}`, async ()=> {
        let body={"file":b64s.b64_one_tgz ,"name":"Archivo de prueba unitaria","unzipFormat":"tgz"};
        request={method:'', url:'/test', body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.add(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.warning).to.equal(undefined);
            expect(result.bodyOut.id).to.be.a('string');

            lastIdFile=result.bodyOut.id;
            console.info('lastIdFile:',lastIdFile);

        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step(`search-${testName}`, async ()=> {
        sleep(1000);
        request={method:'', url:'/test', params:{id:lastIdFile, projectId}, headers: {}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.findByIdGlobal(request, response);
            //console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.file).to.be.a('string');
            lastIdFile=undefined;
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    testName='b64_one_tbz2_unzip-inside';
    step(`add-${testName}`, async ()=> {
        let body={"file":b64s.b64_one_tbz2 ,"name":"Archivo de prueba unitaria","unzipFormat":"tbz2"};
        request={method:'', url:'/test', body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.add(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.warning).to.equal(undefined);
            expect(result.bodyOut.id).to.be.a('string');

            lastIdFile=result.bodyOut.id;
            console.info('lastIdFile:',lastIdFile);

        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step(`search-${testName}`, async ()=> {
        sleep(1000);
        request={method:'', url:'/test', params:{id:lastIdFile, projectId}, headers: {}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.findByIdGlobal(request, response);
            //console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.file).to.be.a('string');
            lastIdFile=undefined;
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step('search-not-found-inside', async ()=> {
        sleep(1000);
        request={method:'', url:'/test', params:{id:'P77b4d1c0-78b6-11e8-9239-ade58e6e5671', projectId}, headers: {}};
        response={headers:[]};
        let code=404;
        try {
            const result = await fileManager.findByIdGlobal(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            lastIdFile=undefined;
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step('error-schema-inside', async ()=> {
        let body={"file":b64s.b64_one_tbz2 ,"name":"Archivo de prueba unitaria","unzipFormatx":"tbz2"};
        request={method:'', url:'/test', body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=400;
        try {
            const result = await fileManager.add(request, response);
            //console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.warning).to.equal(undefined);
            expect(result.bodyOut.id).to.equal(undefined);

        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step('error-schema-inside', async ()=> {
        let body={};
        request={method:'', url:'/test', body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=400;
        try {
            const result = await fileManager.add(request, response);
            //console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.warning).to.equal(undefined);
            expect(result.bodyOut.id).to.equal(undefined);

        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });


    testName='b64_one_zip_unzip-inside';
    step(`add-${testName}`, async ()=> {
        let body={"file":b64s.b64_one_zip ,"name":"Archivo de prueba unitaria","unzipFormat":"zip" ,"scope":"Private"};
        request={method:'', url:'/test', body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.add(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.warning).to.equal(undefined);
            expect(result.bodyOut.id).to.be.a('string');

            lastIdFile=result.bodyOut.id;
            console.info('lastIdFile:',lastIdFile);

        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    testName='b64_txt_typefile_error-inside';
    step(`add-${testName}`, async ()=> {
        let body={"file":'aG9sYQo=' ,"name":"Archivo de prueba unitaria" ,"scope":"Private"};
        request={method:'', url:'/test', body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.add(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.  warning).to.equal(undefined);
            expect(result.bodyOut.id).to.be.a('string');

            lastIdFile=result.bodyOut.id;
            console.info('lastIdFile:',lastIdFile);

        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    
    step(`search-${testName}`, async ()=> {
        sleep(1000);
        request={method:'', url:'/test', params:{id:lastIdFile, projectId}, headers: {'x-access-token': token ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.findById(request, response);
            //console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.file).to.be.a('string');
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step(`search-error-notautorized-${testName}`, async ()=> {
        sleep(1000);
        request={method:'', url:'/test', params:{id:lastIdFile, projectId}, headers: {}};
        response={headers:[]};
        let code=401;
        try {
            const result = await fileManager.findById(request, response);
            //console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step('add-b64_one_zip_unzip-error-add-inside', async ()=> {
        let body={"file":b64s.b64_one_zip ,"name":"Archivo de prueba unitaria","unzipFormat":"zip" ,"scope":"Private"};
        let testOptions={err_db_add_files:'Error provocado para las pruebas unitarias - Agregando registro'};        
        request={testOptions, method:'', url:'/test', body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=500;
        try {
            const result = await fileManager.add(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.warning).to.equal(undefined);
            expect(result.bodyOut.id).to.be.a('string');

            console.info('lastIdFile:',lastIdFile);

        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step('search-error-findBy-inside', async ()=> {
        let testOptions={err_db_findById_files:'Error provocado para las pruebas unitarias - buscando el registro registro'};        
        request={testOptions,method:'', url:'/test', params:{id:'lastIdFile', projectId}, headers: {'x-access-token': token  ,'x-user':user}};
        response={headers:[]};
        let code=500;
        try {
            const result = await fileManager.findById(request, response);
            //console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.file).to.be.a('string');
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });
    
    step('add-b64_one_zip_unzip-error-extract-file-inside', async ()=> {
        let body={"file":b64s.b64_one_zip ,"name":"Archivo de prueba unitaria","unzipFormat":"zip" ,"scope":"Private"};
        let testOptions={err_extract_file:'Error provocado para las pruebas unitarias - al extraer el registro'};        
        request={testOptions, method:'', url:'/test', body, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.add(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
            expect(result.bodyOut.warning).to.be.a('string');
            expect(result.bodyOut.id).to.be.a('string');

            console.info('lastIdFile:',lastIdFile);

        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step('delete-error-findById-inside', async ()=> {
        let testOptions={err_db_findById_files:'Error provocado para las pruebas unitarias - buscando el registro registro'};        
        request={testOptions,method:'', url:'/test', params:{id:lastIdFile}, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=404;
        try {
            const result = await fileManager.deleteById(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step('delete-not-exists-inside', async ()=> {
        request={method:'', url:'/test', params:{id:`${lastIdFile}x`}, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=404;
        try {
            const result = await fileManager.deleteById(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step('delete-not-autorizad-inside', async ()=> {
        request={method:'', url:'/test', params:{id:lastIdFile}, headers: {'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=401;
        try {
            const result = await fileManager.deleteById(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });

    step('delete-inside', async ()=> {
        request={method:'', url:'/test', params:{id:lastIdFile}, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=200;
        try {
            const result = await fileManager.deleteById(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });
    
    step('delete-not-found-inside', async ()=> {
        request={method:'', url:'/test', params:{id:lastIdFile}, headers: {'x-access-token': token ,'x-projectid':projectId ,'x-user':user}};
        response={headers:[]};
        let code=404;
        try {
            const result = await fileManager.deleteById(request, response);
            console.info("\t\tResponse: ",result);
            expect(result.httpCode).to.equal(code)
        } catch (error) {
            console.error(error);
            expect(error.httpCode).to.equal(code);                
        }
    });



});
