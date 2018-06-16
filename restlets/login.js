'use strict';
/*
 xDocRestName:Login
 * */
let R = require("../util/rest-api-requires");
let restApiUtil = require("../util/restApiUtil");
let jsonvalidator = require('../controllers/jsonvalidator');
let elasticController = require("../controllers/elasticsearch");
let util = require('util');
let app = R.express();
let rest='login',name='';

let router=restApiUtil.init(app);

router.route('/authenticate').post(function(request, response) { //xDoc-Desc:Authenticación del usuario xDoc-JSON-Example:{"username":"luisXV", "pwd":"123456"}  xDoc-Response:Usuario + Token 
        authenticate(request, response);    
});

router.route('/_stats').get( (request, response)=> restApiUtil.sendResponse(response,R.constants.HTTP_OK,{pid:process.pid, memory_usage: process.memoryUsage(), cpu_usage:process.cpuUsage(), args:process.argv},request.body,'stats')); /* xDoc-NoDoc */    

function authenticate(request, response){
        const {method, url, body}=request;
        const thisService=`[${method}]${url}`;
        R.logger.debug(thisService);

        restApiUtil.validateAll(['schema'],request,{schema:'authenticate_schema'}).then(
                ()=>{
                        R.logger.debug('validations is ok!!');
                        let {projectId, email, pwd}=body;
                        restApiUtil.getPhrase(projectId).then(phrase=>{
                                let pwdEncripted;
                                try {
                                        pwdEncripted=R.jwtController.encrypt(R.jwtController.decrypt(pwd,projectId),phrase);
                                } catch (error) {
                                        restApiUtil.sendResponse(response,R.constants.HTTP_UNAUTHORIZED, 'Password incorrect', body,thisService);
                                }
                                let queryObj={"query": {"bool": {"must": [{"match": {"_id": email}},{ "match": { "pwd":  pwdEncripted}}]}}};    
                                R.logger.trace('query user',queryObj);
                                elasticController.find(`${projectId}.${R.constants.INDEX_USER}`,queryObj).then(result=>{
                                        R.logger.debug('User-->',result.responses[0].hits);
                                        if(result.responses[0].hits.total > 0){
                                                R.logger.debug(`User authenticated ${email}!!!`);
                                                let resx=result.responses[0].hits.hits[0];
                                                response.setHeader("x-projectid", projectId);
                                                response.setHeader("x-access-token", R.jwtController.sign(resx, phrase).token);
                                                restApiUtil.sendResponse(response,R.constants.HTTP_OK,'', body, thisService);
                                        }else{
                                                restApiUtil.sendResponse(response,R.constants.HTTP_UNAUTHORIZED, 'User/Password not found', body,thisService);
                                        }
                                }, error=>{
                                        R.logger.error(`Error authenticate user: ${request.body.email}->`,error);
                                        restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL, error, body,thisService);
                                        })
                                },(error)=>restApiUtil.sendResponse(response,R.constants.HTTP_UNAUTHORIZED, 'ProjectId not found', body,thisService));
                },({httpcode,error}=errorValidate)=> restApiUtil.sendResponse(response,httpcode, error , body ,thisService)
            );

/*
        jsonvalidator.validateVsSchema("authenticate_schema",body).then(resultValidateSchema=>{
                let {projectId, email, pwd}=body;
                let pwdEncripted;
                restApiUtil.getPhrase(projectId).then(phrase=>{
                        try {
                           console.trace('*******************************************phrase', phrase);
                           pwdEncripted=R.jwtController.encrypt(R.jwtController.decrypt(pwd,projectId),phrase);
                        } catch (error) {
                                restApiUtil.sendResponse(response,R.constants.HTTP_UNAUTHORIZED, '', body,thisService);
                        }
                        let queryObj={"query": {"bool": {"must": [{"match": {"_id": email}},{ "match": { "pwd":  pwdEncripted}}]}}};    
                        R.logger.trace('query user',queryObj);
                        elasticController.find(`${projectId}.${R.constants.INDEX_USER}`,queryObj).then(result=>{
                                R.logger.debug('Usuario-->',result.responses[0].hits);
                                if(result.responses[0].hits.total > 0){
                                        R.logger.debug(`Se autentico el usuario ${email} correctamente!!!`);
                                        let resx=result.responses[0].hits.hits[0];
                                        response.setHeader("x-projectid", projectId);
                                        response.setHeader("x-access-token", R.jwtController.sign(resx, phrase).token);
                                        restApiUtil.sendResponse(response,R.constants.HTTP_OK,'', body, thisService);
                                }else{
                                        request.body.pwd='************';
                                        R.logger.error('No existe el usuario/password indicado:',body);
                                        restApiUtil.sendResponse(response,R.constants.HTTP_UNAUTHORIZED, '', body,thisService);
                                }
                        }, error=>{
                                R.logger.error(`No se authentico el usuario: ${request.body.email}->`,error);
                                restApiUtil.sendResponse(response,R.constants.HTTP_UNAUTHORIZED, error, body,thisService);
                                })
                        });
        },errors=> {
                R.logger.error('No paso la validación de esquema', url);
                restApiUtil.sendResponse(response,R.constants.HTTP_BAD_REQUEST,errors,body,thisService);     
                });
  */              
};
    


let _PORT_=R.properties.get(rest+'.PORT');
restApiUtil.startService(rest,app, router ,_PORT_);