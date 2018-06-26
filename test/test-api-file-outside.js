let sleep = require('thread-sleep');
let expect  = require('chai').expect;
let request = require('request');
let jwt = require('../controllers/jwt');
let b64s = require('./b64s');

let projectId='unit-test-file';
let user='x@x.com';
let token=''; 
let pwd=jwt.encrypt('123456',projectId);
let lastIdFile='';
let subId='';

describe('*********************************** Unit test api-rest - file manager *********************************** ', function() {
    step('init-project-outside', function(done) {
        let url=`http://localhost:19999/project/${projectId}/_init`;
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

    step('authenticate-ok-outside', function(done) {
        sleep(1000);
        request.post({url:'http://localhost:20001/authenticate',  form: {"email":"x@x.com", pwd, projectId}, json:true } , function(error, response, body) {
            console.info("\t\tResponse: ",response.body);
            token=response.headers['x-access-token'];
            expect(response.statusCode).to.equal(200);
            done();
            });
        });
                

    let testName='b64_all_zip-unzip-outside';
    step(`add-${testName}`, function(done) {
        let urlStr='http://localhost:20003/file';
      //  console.log('TOKENNNNN>',token);
        request.put({url:urlStr,  form: {"file":b64s.b64_all_zip
        ,"name":"Archivo de prueba unitaria"
        ,"unzipFormat":"zip"
       },headers: {
            'x-access-token': token
            ,'x-projectid':projectId
            ,'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);
            let bodyresponse=JSON.parse(response.body);
            lastIdFile=bodyresponse.id;
            console.info('lastIdFile:',lastIdFile);
            expect(response.statusCode).to.equal(200);
            expect(bodyresponse.warning).to.equal(undefined);
            expect(bodyresponse.id).to.be.a('string');
            done();
        });
    });

    step(`search-${testName}`, function(done) {
        sleep(1000);
        let urlStr=`http://localhost:20003/file/${projectId}/${lastIdFile}`;
        request.get({url:urlStr,headers: {} } , function(error, response, body) {        
            //console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).files).to.have.lengthOf(6);
            subId=JSON.parse(response.body).files[0].uuid;
            done();
        });
    });

    step(`search-subId-${testName}`, function(done) {
        sleep(1000);
        let urlStr=`http://localhost:20003/file/${projectId}/${lastIdFile}/${subId}`;
        request.get({url:urlStr,headers: {} } , function(error, response, body) {        
            //console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).files).to.have.lengthOf(1);
            done();
        });
    });

    
    step(`searchb64-${testName}`, function(done) {
        sleep(1000);
        let urlStr=`http://localhost:20003/fileb64/${projectId}/${lastIdFile}`;
        request.get({url:urlStr,headers: {} } , function(error, response, body) {        
            //console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.be.a('string');
            done();
        });
    });

    step(`searchb64-subId-${testName}`, function(done) {
        sleep(1000);
        let urlStr=`http://localhost:20003/file/${projectId}/${lastIdFile}/${subId}`;
        request.get({url:urlStr,headers: {} } , function(error, response, body) {        
            //console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.be.a('string');
            done();
        });
    });
    

    testName='b64_all_zip-errorunzip-outside';
    step(`add-${testName}`, function(done) {
        let urlStr='http://localhost:20003/file';
        request.put({url:urlStr,  form: {"file":b64s.b64_all_zip
        ,"name":"Archivo de prueba unitaria"
        ,"unzipFormat":"tar"
       },headers: {
            'x-access-token': token
            ,'x-projectid':projectId
            ,'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);
            let bodyresponse=JSON.parse(response.body);
            lastIdFile=bodyresponse.id;
            console.info('lastIdFile:',lastIdFile);
            expect(response.statusCode).to.equal(200);
            expect(bodyresponse.warning).to.be.a('string');
            expect(bodyresponse.id).to.be.a('string');            
            done();
        });
    });

    step(`search-${testName}`, function(done) {
        sleep(1000);
        let urlStr=`http://localhost:20003/file/${projectId}/${lastIdFile}`;
        request.get({url:urlStr,headers: {} } 
            , function(error, response, body) {        
            //console.info("\t\tResponse: ",JSON.parse(response.body).file);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).file).to.be.a('string');
            expect(JSON.parse(response.body).files).to.equal(undefined);
            lastIdFile=undefined;
            done();
        });
    });

    testName='b64_all_zip-nounzip-outside';
    step(`add-${testName}`, function(done) {
        let urlStr='http://localhost:20003/file';
        request.put({url:urlStr,  form: {"file":b64s.b64_all_zip
        ,"name":"Archivo de prueba unitaria"
       },headers: {
            'x-access-token': token
            ,'x-projectid':projectId
            ,'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);
            let bodyresponse=JSON.parse(response.body);
            lastIdFile=bodyresponse.id;
            console.info('lastIdFile:',lastIdFile, 'warning', JSON.parse(response.body).warning);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).warning).to.equal(undefined);
            expect(JSON.parse(response.body).id).to.be.a('string');
            done();
        });
    });

    step(`search-${testName}`, function(done) {
        sleep(1000);
        let urlStr=`http://localhost:20003/file/${projectId}/${lastIdFile}`;
        request.get({url:urlStr,headers: {} } 
            , function(error, response, body) {        
            //console.info("\t\tResponse: ",JSON.parse(response.body).file);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).file).to.be.a('string');
            expect(JSON.parse(response.body).files).to.equal(undefined);
            lastIdFile=undefined;
            done();
        });
    });

    testName='b64_one_zip_unzip-outside';
    step(`add-${testName}`, function(done) {
        let urlStr='http://localhost:20003/file';
        request.put({url:urlStr,  form: {"file":b64s.b64_one_zip
        ,"name":"Archivo de prueba unitaria"
        ,"unzipFormat":"zip"
       },headers: {
            'x-access-token': token
            ,'x-projectid':projectId
            ,'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);
            lastIdFile=JSON.parse(response.body).id;
            console.info('lastIdFile:',lastIdFile);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).warning).to.equal(undefined);
            expect(JSON.parse(response.body).id).to.be.a('string');
            done();
        });
    });

    step(`search-${testName}`, function(done) {
        sleep(1000);
        let urlStr=`http://localhost:20003/file/${projectId}/${lastIdFile}`;
        request.get({url:urlStr,headers: {} } 
            , function(error, response, body) {        
            //console.info("\t\tResponse: ",JSON.parse(response.body).file);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).file).to.be.a('string');
            expect(JSON.parse(response.body).files).to.equal(undefined);
            lastIdFile=undefined;
            done();
        });
    });


    testName='b64_one_gz_unzip-outside';
    step(`add-${testName}`, function(done) {
        let urlStr='http://localhost:20003/file';
        request.put({url:urlStr,  form: {"file":b64s.b64_one_gz
        ,"name":"Archivo de prueba unitaria"
        ,"unzipFormat":"gz"
       },headers: {
            'x-access-token': token
            ,'x-projectid':projectId
            ,'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);
            lastIdFile=JSON.parse(response.body).id;
            console.info('lastIdFile:',lastIdFile);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).warning).to.equal(undefined);
            expect(JSON.parse(response.body).id).to.be.a('string');
            done();
        });
    });

    step(`search-${testName}`, function(done) {
        sleep(1000);
        let urlStr=`http://localhost:20003/file/${projectId}/${lastIdFile}`;
        request.get({url:urlStr,headers: {} } 
            , function(error, response, body) {        
            //console.info("\t\tResponse: ",JSON.parse(response.body).file);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).file).to.be.a('string');
            expect(JSON.parse(response.body).files).to.equal(undefined);
            lastIdFile=undefined;
            done();
        });
    });


    testName='b64_one_bz2_unzip-outside';
    step(`add-${testName}`, function(done) {
        let urlStr='http://localhost:20003/file';
        request.put({url:urlStr,  form: {"file":b64s.b64_one_bz2
        ,"name":"Archivo de prueba unitaria"
        ,"unzipFormat":"bz2"
       },headers: {
            'x-access-token': token
            ,'x-projectid':projectId
            ,'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);
            lastIdFile=JSON.parse(response.body).id;
            console.info('lastIdFile:',lastIdFile);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).warning).to.equal(undefined);
            expect(JSON.parse(response.body).id).to.be.a('string');
            done();
        });
    });

    step(`search-${testName}`, function(done) {
        sleep(1000);
        let urlStr=`http://localhost:20003/file/${projectId}/${lastIdFile}`;
        request.get({url:urlStr,headers: {} } ,
             function(error, response, body) {        
            //console.info("\t\tResponse: ",JSON.parse(response.body).file);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).file).to.be.a('string');
            expect(JSON.parse(response.body).files).to.equal(undefined);
            lastIdFile=undefined;
            done();
        });
    });

    testName='b64_one_tar_unzip-outside';
    step(`add-${testName}`, function(done) {
        let urlStr='http://localhost:20003/file';
        request.put({url:urlStr,  form: {"file":b64s.b64_one_tar
        ,"name":"Archivo de prueba unitaria"
        ,"unzipFormat":"tar"
       },headers: {
            'x-access-token': token
            ,'x-projectid':projectId
            ,'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);
            lastIdFile=JSON.parse(response.body).id;
            console.info('lastIdFile:',lastIdFile);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).warning).to.equal(undefined);
            expect(JSON.parse(response.body).id).to.be.a('string');
            done();
        });
    });

    step(`search-${testName}`, function(done) {
        sleep(1000);
        let urlStr=`http://localhost:20003/file/${projectId}/${lastIdFile}`;
        request.get({url:urlStr,headers: {} } 
            , function(error, response, body) {        
            //console.info("\t\tResponse: ",JSON.parse(response.body).file);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).file).to.be.a('string');
            expect(JSON.parse(response.body).files).to.equal(undefined);
            lastIdFile=undefined;
            done();
        });
    });

    testName='b64_one_tar_gz_unzip-outside';
    step(`add-${testName}`, function(done) {
        let urlStr='http://localhost:20003/file';
        request.put({url:urlStr,  form: {"file":b64s.b64_one_tar_gz
        ,"name":"Archivo de prueba unitaria"
        ,"unzipFormat":"tar.gz"
       },headers: {
            'x-access-token': token
            ,'x-projectid':projectId
            ,'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);
            lastIdFile=JSON.parse(response.body).id;
            console.info('lastIdFile:',lastIdFile);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).warning).to.equal(undefined);
            expect(JSON.parse(response.body).id).to.be.a('string');
            done();
        });
    });

    step(`search-${testName}`, function(done) {
        sleep(1000);
        let urlStr=`http://localhost:20003/file/${projectId}/${lastIdFile}`;
        request.get({url:urlStr,headers: {} } 
            , function(error, response, body) {        
            //console.info("\t\tResponse: ",JSON.parse(response.body).file);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).file).to.be.a('string');
            expect(JSON.parse(response.body).files).to.equal(undefined);
            lastIdFile=undefined;
            done();
        });
    });

    testName='b64_one_tar_bz2_unzip-outside';
    step(`add-${testName}`, function(done) {
        let urlStr='http://localhost:20003/file';
        request.put({url:urlStr,  form: {"file":b64s.b64_one_tar_bz2
        ,"name":"Archivo de prueba unitaria"
        ,"unzipFormat":"tar.bz2"
       },headers: {
            'x-access-token': token
            ,'x-projectid':projectId
            ,'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);
            lastIdFile=JSON.parse(response.body).id;
            console.info('lastIdFile:',lastIdFile);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).warning).to.equal(undefined);
            expect(JSON.parse(response.body).id).to.be.a('string');
            done();
        });
    });

    step(`search-${testName}`, function(done) {
        sleep(1000);
        let urlStr=`http://localhost:20003/file/${projectId}/${lastIdFile}`;
        request.get({url:urlStr,headers: {} } 
            , function(error, response, body) {        
            //console.info("\t\tResponse: ",JSON.parse(response.body).file);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).file).to.be.a('string');
            expect(JSON.parse(response.body).files).to.equal(undefined);
            lastIdFile=undefined;
            done();
        });
    });

    testName='b64_one_tgz_unzip-outside';
    step(`add-${testName}`, function(done) {
        let urlStr='http://localhost:20003/file';
        request.put({url:urlStr,  form: {"file":b64s.b64_one_tgz
        ,"name":"Archivo de prueba unitaria"
        ,"unzipFormat":"tgz"
       },headers: {
            'x-access-token': token
            ,'x-projectid':projectId
            ,'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);
            lastIdFile=JSON.parse(response.body).id;
            console.info('lastIdFile:',lastIdFile);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).warning).to.equal(undefined);
            expect(JSON.parse(response.body).id).to.be.a('string');
            done();
        });
    });

    step(`search-${testName}`, function(done) {
        sleep(1000);
        let urlStr=`http://localhost:20003/file/${projectId}/${lastIdFile}`;
        request.get({url:urlStr,headers: {} } 
            , function(error, response, body) {        
            //console.info("\t\tResponse: ",JSON.parse(response.body).file);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).file).to.be.a('string');
            expect(JSON.parse(response.body).files).to.equal(undefined);
            lastIdFile=undefined;
            done();
        });
    });


    testName='b64_one_tbz2_unzip-outside';
    step(`add-${testName}`, function(done) {
        let urlStr='http://localhost:20003/file';
        request.put({url:urlStr,  form: {"file":b64s.b64_one_tbz2
        ,"name":"Archivo de prueba unitaria"
        ,"unzipFormat":"tbz2"
       },headers: {
            'x-access-token': token
            ,'x-projectid':projectId
            ,'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);
            lastIdFile=JSON.parse(response.body).id;
            console.info('lastIdFile:',lastIdFile);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).warning).to.equal(undefined);
            expect(JSON.parse(response.body).id).to.be.a('string');
            done();
        });
    });

    step(`search-${testName}`, function(done) {
        sleep(1000);
        let urlStr=`http://localhost:20003/file/${projectId}/${lastIdFile}`;
        request.get({url:urlStr,headers: {} } 
            , function(error, response, body) {        
            //console.info("\t\tResponse: ",JSON.parse(response.body).file);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).file).to.be.a('string');
            expect(JSON.parse(response.body).files).to.equal(undefined);
            lastIdFile=undefined;
            done();
        });
    });

    
    step('search-not-found-outside', function(done) {
        sleep(1000);
        let urlStr=`http://localhost:20003/file/${projectId}/P77b4d1c0-78b6-11e8-9239-ade58e6e5671`;
        request.get({url:urlStr,headers: {
            'x-access-token': token
            ,'x-user':user} } , function(error, response, body) {        
            //console.info("\t\tResponse: ",JSON.parse(response.body).file);
            expect(response.statusCode).to.equal(404);
            lastIdFile=undefined;
            done();
        });
    });


    step('error-schema-outside', function(done) {
        let urlStr=`http://localhost:20003/file`;
        request.put({url:urlStr,  form: {"file":b64s.b64_one_tbz2
        ,"namex":"Archivo de prueba unitaria"
        ,"unzipFormat":"tbz2"
       },headers: { 
            'x-access-token': token
            ,'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    testName='error-body-vacio-outside';
    step(`add-${testName}`, function(done) {
        let urlStr='http://localhost:20003/file';
        request.put({url:urlStr,  form: {},headers: {
            'x-access-token': token
            ,'x-projectid':projectId
            ,'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    testName='b64_one_zip_private_unzip-outside';
    step(`add-${testName}`, function(done) {
        let urlStr='http://localhost:20003/file';
        request.put({url:urlStr,  form: {"file":b64s.b64_one_zip
        ,"name":"Archivo de prueba unitaria"
        ,"unzipFormat":"zip","scope":"Private" 
       },headers: {
            'x-access-token': token
            ,'x-projectid':projectId
            ,'x-user':user} } , function(error, response, body) {        
            console.info("\t\tResponse: ",response.body);
            lastIdFile=JSON.parse(response.body).id;
            console.info('lastIdFile:',lastIdFile);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).warning).to.equal(undefined);
            expect(JSON.parse(response.body).id).to.be.a('string');
            done();
        });
    });

    step(`search-${testName}`, function(done) {
        sleep(1000);
        let urlStr=`http://localhost:20003/file/${projectId}/${lastIdFile}`;
        request.get({url:urlStr,headers: {
            'x-access-token': token
            ,'x-user':user} } , function(error, response, body) {        
            //console.info("\t\tResponse: ",JSON.parse(response.body).file);
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).file).to.be.a('string');
            expect(JSON.parse(response.body).files).to.equal(undefined);
            done();
        });
    });

    step(`search-error-notautorized-${testName}`, function(done) {
        sleep(1000);
        let urlStr=`http://localhost:20003/file/${projectId}/${lastIdFile}`;
        request.get({url:urlStr,headers: {} } 
            , function(error, response, body) {        
            expect(response.statusCode).to.equal(401);
            done();
        });
    });

    step(`delete-${testName}`, function(done) {
        let urlStr=`http://localhost:20003/file/${lastIdFile}`;
        request.delete({url:urlStr,headers: {
            'x-access-token': token
            ,'x-projectid':projectId
            ,'x-user':user} } , function(error, response, body) {        
            //console.info("\t\tResponse: ",JSON.parse(response.body).file);
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    step(`delete-not-found-${testName}`, function(done) {
        let urlStr=`http://localhost:20003/file/${lastIdFile}`;
        request.delete({url:urlStr,headers: {
            'x-access-token': token
            ,'x-projectid':projectId
            ,'x-user':user} } , function(error, response, body) {        
            //console.info("\t\tResponse: ",JSON.parse(response.body).file);
            expect(response.statusCode).to.equal(404);
            done();
        });
    });

});
