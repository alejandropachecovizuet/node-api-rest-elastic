'use strict';
/*
 xDocRestName:Login
 * */
let R = require("../util/rest-api-requires");
let restApiUtil = require("../util/restApiUtil");
let jsonvalidator = require('../controllers/jsonvalidator');
let database = require("../controllers/database");
let util = require('util');
let app = R.express();
let rest='login',name='';

let router=restApiUtil.init(app);

router.route('/authenticate').post(function(request, response) { //xDoc-Desc:Authenticación del usuario xDoc-JSON-Example:{"username":"luisXV", "pwd":"123456"}  xDoc-Response:Usuario + Token 
        authenticate(request, response);    
});

router.route('/_stats').get( (request, response)=> restApiUtil.stats(request,response)); /* xDoc-NoDoc */    

function authenticate(request, response){
        const {method, url, body}=request;
        const thisService=`[${method}]${url}`;
        let startTime = new Date().getTime();
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
                                        restApiUtil.sendResponse(response,R.constants.HTTP_UNAUTHORIZED, 'Password incorrect', body,thisService,startTime);
                                }
                                let databaseProp = R.properties.get('app.database.use');
                                let queryObj;    
                                if(databaseProp==='elastic'){
                                        queryObj={"query": {"bool": {"must": [{"match": {"_id": email}},{ "match": { "pwd":  pwdEncripted}}]}}};
                                }else if(databaseProp==='mongo'){
                                        queryObj={"_id": email, 'pwd':pwdEncripted};
                                }
                                                        
                                R.logger.info('query user',queryObj);
                                database.find(projectId, R.constants.INDEX_USER,queryObj).then(result=>{
                                        R.logger.debug('User-->',result,email, pwdEncripted);
                                        if(result.total > 0){
                                                R.logger.debug(`User authenticated ${email}!!!`);
                                                let resx=result.records[0];
                                                R.logger.info('RESSSSSULT->',resx);
                                                response.setHeader("x-projectid", projectId);
                                                response.setHeader("x-access-token", R.jwtController.sign(email,resx, phrase).token);
                                                restApiUtil.sendResponse(response,R.constants.HTTP_OK,'', body, thisService,startTime);
                                        }else{
                                                restApiUtil.sendResponse(response,R.constants.HTTP_UNAUTHORIZED, 'User/Password not found', body,thisService,startTime);
                                        }
                                }, error=>{
                                        R.logger.error(`Error authenticate user: ${request.body.email}->`,error);
                                        restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL, error, body,thisService,startTime);
                                        })
                                },(error)=>restApiUtil.sendResponse(response,R.constants.HTTP_UNAUTHORIZED, 'ProjectId not found', body,thisService,startTime));
                },({httpcode,error}=errorValidate)=> restApiUtil.sendResponse(response,httpcode, error , body ,thisService,startTime)
            );
};
    


let _PORT_=R.properties.get(rest+'.PORT');
restApiUtil.startService(rest,app, router ,_PORT_);