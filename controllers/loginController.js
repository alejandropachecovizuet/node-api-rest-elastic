let R = require("../util/rest-api-requires");
let restApiUtil = require("../util/restApiUtil");
let database = require("./database");

exports.authenticate=(request, response)=>{
return new Promise((resolve,reject)=>{
    const {method, url, body}=request;
    const thisService=`[${method}]${url}`;
    let startTime = new Date().getTime();
    R.logger.debug(thisService);
    const testOptions=request.testOptions;

    restApiUtil.validateAll(['schema'],request,{schema:'authenticate_schema'}).then(
            ()=>{
                    R.logger.debug('validations is ok!!');
                    let {projectId, email, pwd}=body;
                    restApiUtil.getPhrase(projectId,testOptions).then(phrase=>{
                            let pwdEncripted;
                            try {
                                    pwdEncripted=R.jwtController.encrypt(R.jwtController.decrypt(pwd,projectId),phrase);
                            } catch (error) {
                                    reject({response, httpCode:R.constants.HTTP_UNAUTHORIZED, bodyOut:'Password incorrect', bodyIn:body, service:thisService,startTime});
                                    //restApiUtil.sendResponse(response,R.constants.HTTP_UNAUTHORIZED, 'Password incorrect', body,thisService,startTime);
                            }
                            let databaseProp = R.properties.get('app.database.use');
                            let queryObj;    
                            if(databaseProp==='elastic'){
                                    queryObj={"query": {"bool": {"must": [{"match": {"_id": email}},{ "match": { "pwd":  pwdEncripted}}]}}};
                            }else if(databaseProp==='mongo'){
                                    queryObj={"_id": email, 'pwd':pwdEncripted};
                            }
                                                    
                            R.logger.info('query user',queryObj);
                            database.find(projectId, R.constants.INDEX_USER,queryObj,testOptions).then(result=>{
                                    R.logger.debug('User-->',result,email, pwdEncripted);
                                    if(result.total > 0){
                                            R.logger.debug(`User authenticated ${email}!!!`);
                                            let resx=result.records[0];
                                            R.logger.info('RESSSSSULT->',resx);
                                            restApiUtil.setHeader(response, 'x-projectid', projectId);
                                            restApiUtil.setHeader(response, 'x-access-token', R.jwtController.sign(email,resx, phrase).token)


                                            resolve({response, httpCode:R.constants.HTTP_OK, bodyOut:'', bodyIn:body, service:thisService,startTime});
                                            //restApiUtil.sendResponse(response,R.constants.HTTP_OK,'', body, thisService,startTime);
                                    }else{
                                            //restApiUtil.sendResponse(response,R.constants.HTTP_UNAUTHORIZED, 'User/Password not found', body,thisService,startTime);
                                            reject({response, httpCode:R.constants.HTTP_UNAUTHORIZED, bodyOut:'User/Password not found', bodyIn:body, service:thisService,startTime});
                                        }
                            }, error=>{
                                    R.logger.error(`Error authenticate user: ${request.body.email}->`,error);
                                    reject({response, httpCode:R.constants.HTTP_INTERNAL, bodyOut:error, bodyIn:body, service:thisService,startTime});
                                    //restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL, error, body,thisService,startTime);
                                    })
                            },(error)=>reject({response, httpCode:R.constants.HTTP_UNAUTHORIZED, bodyOut:error, bodyIn:body, service:thisService,startTime}))
                            //restApiUtil.sendResponse(response,R.constants.HTTP_UNAUTHORIZED, 'ProjectId not found', body,thisService,startTime));
            },(error)=> reject({response, httpCode:error.httpcode, bodyOut:error.error, bodyIn:body, service:thisService,startTime})
            //restApiUtil.sendResponse(response,httpcode, error , body ,thisService,startTime)
        );
    }); 
};
