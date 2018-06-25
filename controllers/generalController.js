let R = require("../util/rest-api-requires");
let restApiUtil = require("../util/restApiUtil");
let database = require("./database");
let jsonvalidator = require('./jsonvalidator');
let appUtil = require('../util/appUtil');
let changes={}
let indexes=['roles'];
/*
initChangesControl=()=>{
    if(JSON.stringify(changes)==='{}'){
       for(let i=0; i<indexes.length; i++){
          changes[indexes[i]]='20160101T000000Z';
       }
    }
}
exports.initChangesControl=initChangesControl;

updateChangesControl=(index)=>{
    initChangesControl();
    if(changes[index]!=null){
        changes[index]=appUtil.getCurrentDateForElastic();
        R.logger.debug('apply changes',index,changes[index]);
    }
}
exports.updateChangesControl=updateChangesControl;
*/

exports.add=(request, response)=>{
return new Promise((resolve,reject)=>{    
    const {method, url, body, params: {index, id}, headers}=request;
    const thisService=`[${method}]${url}`;
    const projectId=headers['x-projectid'];
    const testOptions=request.testOptions;
    
    let startTime = new Date().getTime();
    R.logger.debug(thisService);

    restApiUtil.validateAll(['projectid_header','user_header','token_header','restriction','schema','validate_token']
                ,request,{schema:index,restriction:`app.db.${index}.add`}).then(
             ()=>database.findById(projectId, index,id,testOptions).then(
                    resultFind=>{
                        R.logger.debug('Record found!!!');
                        if(resultFind.total==0){
                            body["time_created"]=appUtil.getCurrentDateForElastic();
                            body["user_created"]=request.headers['x-user'];
                            database.add(projectId,index,id,body,testOptions).then(resultAdd => { 
                                                //updateChangesControl(index);
                                                resolve({response, httpCode:R.constants.HTTP_OK, bodyOut:resultAdd, bodyIn:body, service:thisService,startTime});
                                                //restApiUtil.sendResponse(response,R.constants.HTTP_OK, resultAdd, request.body,thisService,startTime);
                                            }, error => {
                                                reject({response, httpCode:R.constants.HTTP_INTERNAL, bodyOut:error, bodyIn:body, service:thisService,startTime});
                                                //restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL, error, request.body,thisService,startTime);
                                            }); 
                        }else{
                            R.logger.error('Duplicated key', url);
                            reject({response, httpCode:R.constants.HTTP_DUPLICATED, bodyOut:R.constants.HTTP_DUPLICATED, bodyIn:body, service:thisService,startTime});
                            //restApiUtil.sendResponse(response, R.constants.HTTP_DUPLICATED, R.constants.ERROR_DUPLICATED_KEY, body,thisService,startTime);
                        }
                    },error=>reject({response, httpCode:R.constants.HTTP_NOT_FOUND, bodyOut:error, bodyIn:body, service:thisService,startTime})
                    //restApiUtil.sendResponse(response, R.constants.HTTP_NOT_FOUND, error, request.body,thisService,startTime)
                ),error=>reject({response, httpCode:error.httpcode, bodyOut:error.error, bodyIn:body, service:thisService,startTime}) //restApiUtil.sendResponse(response,httpcode, error , body ,thisService,startTime)
        )
    });
    };

exports.findById=(request, response)=>{
return new Promise((resolve,reject)=>{    
    const {method, url, body, params: {index, id}, headers}=request;
    const thisService=`[${method}]${url}`;
    const projectId=headers['x-projectid'];
    const testOptions=request.testOptions;
    
    let startTime = new Date().getTime();
    R.logger.debug(thisService);

    restApiUtil.validateAll(['projectid_header','user_header','token_header','restriction','validate_token']
                ,request,{restriction:`app.db.${index}.search`}).then(
            ()=>database.findById(projectId, index,id,testOptions).then(result =>resolve({response, httpCode:R.constants.HTTP_OK, bodyOut:result, bodyIn:body, service:thisService,startTime})
                //restApiUtil.sendResponse(response,R.constants.HTTP_OK,result,body,thisService,startTime)
            ,error=>{
                    R.logger.fatal(`No es posible realizar la búsqueda del id[${id}]`, error);
                    //restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL,error,body,thisService,startTime);
                    reject({response, httpCode:R.constants.HTTP_INTERNAL, bodyOut:error, bodyIn:body, service:thisService,startTime});
                    })
                ,error=> reject({response, httpCode:error.httpcode, bodyOut:error.error, bodyIn:body, service:thisService,startTime})
                //restApiUtil.sendResponse(response,httpcode, error , body ,thisService,startTime)
        )
    });
};

exports.find=(request, response)=>{
return new Promise((resolve,reject)=>{    
    const {method, url, body, params: {index, id}, headers}=request;
    const thisService=`[${method}]${url}`;
    const projectId=headers['x-projectid'];
    const testOptions=request.testOptions;
    
    let startTime = new Date().getTime();
    R.logger.debug(thisService);

    restApiUtil.validateAll(['projectid_header','user_header','token_header','restriction','validate_token']
                ,request,{restriction:`app.db.${index}.search`}).then(
            ()=>database.find(projectId,index,body,index,testOptions).then(result=>resolve({response, httpCode:R.constants.HTTP_OK, bodyOut:result, bodyIn:body, service:thisService,startTime})
                //restApiUtil.sendResponse(response,R.constants.HTTP_OK,result,body,thisService, startTime)
            ,error =>{
                    R.logger.fatal(`No es posible realizar la búsqueda:`,error);
                    //restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL,error,body,thisService,startTime);
                    reject({response, httpCode:R.constants.HTTP_INTERNAL, bodyOut:error, bodyIn:body, service:thisService,startTime});
                })
                ,error=> reject({response, httpCode:error.httpcode, bodyOut:error.error, bodyIn:body, service:thisService,startTime})//restApiUtil.sendResponse(response,httpcode, error , body ,thisService,startTime)
        )
    });
};
   
exports.update=(request, response)=>{
return new Promise((resolve,reject)=>{    
    const {method, url, body, params: {index, id}, headers}=request;
    const thisService=`[${method}]${url}`;
    const projectId=headers['x-projectid'];
    const testOptions=request.testOptions;
    
    let startTime = new Date().getTime();
    R.logger.debug(thisService);

    restApiUtil.validateAll(['projectid_header','user_header','token_header','schema','restriction','validate_token']
                ,request,{schema:index,restriction:`app.db.${index}.update`}).then(
            ()=>database.findById(projectId,index ,id,testOptions).then(
                    resultFind=>{
                        R.logger.debug('Record found!!!');
                        if(resultFind.total==1){
                            let data = resultFind.records[0];
                            body["time_updated"]=appUtil.getCurrentDateForElastic();
                            body["user_updated"]=request.headers['x-user'];
                            body["time_created"]=data.time_created;
                            body["user_created"]=data.user_created;
                                database.update(projectId, index,id,body,testOptions).then(result => { 
                                                //updateChangesControl(index);
                                                resolve({response, httpCode:R.constants.HTTP_OK, bodyOut:result, bodyIn:body, service:thisService,startTime});
                                                //restApiUtil.sendResponse(response,R.constants.HTTP_OK, result, request.body,thisService,startTime);
                                            }, error => {
                                                reject({response, httpCode:R.constants.HTTP_INTERNAL, bodyOut:error, bodyIn:body, service:thisService,startTime});
                                                //restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL, error, request.body,thisService,startTime);
                                            }); 
                        }else{
                            R.logger.error('Recdord not found', url);
                            //restApiUtil.sendResponse(response, R.constants.HTTP_NOT_FOUND, R.constants.ERROR_NOT_FOUND, body,thisService,startTime);
                            reject({response, httpCode:R.constants.HTTP_NOT_FOUND, bodyOut:R.constants.HTTP_NOT_FOUND, bodyIn:body, service:thisService,startTime});
                            }
                    },error=>reject({response, httpCode:R.constants.HTTP_NOT_FOUND, bodyOut:error, bodyIn:body, service:thisService,startTime})//restApiUtil.sendResponse(response, R.constants.HTTP_NOT_FOUND, error, request.body,thisService,startService, startTime)
                )
                ,error=> reject({response, httpCode:error.httpcode, bodyOut:error.error, bodyIn:body, service:thisService,startTime})//restApiUtil.sendResponse(response,httpcode, error , body ,thisService,startTime)
        )
    });        
};

exports.deleteById=(request, response)=>{
return new Promise((resolve,reject)=>{    
    const {method, url, body, params: {index, id}, headers}=request;
    const thisService=`[${method}]${url}`;
    const projectId=headers['x-projectid'];
    const testOptions=request.testOptions;
    
    let startTime = new Date().getTime();
    R.logger.debug(thisService);

    restApiUtil.validateAll(['projectid_header','user_header','token_header','restriction','validate_token']
                ,request,{restriction:`app.db.${index}.delete`}).then(
            ()=>database.findById(projectId, index ,id,testOptions).then(
                    resultFind=>{
                        R.logger.debug('Record found!!!');
                        if(resultFind.total==1){
                            database.deleteById(projectId, index, index,id,testOptions).then(result=>resolve({response, httpCode:R.constants.HTTP_OK, bodyOut:result, bodyIn:body, service:thisService,startTime})
                                //restApiUtil.sendResponse(response,R.constants.HTTP_OK,'',body,thisService,startTime)
                            ,error=>{
                                  R.logger.error('No fue posible borrar el registro['+index+']['+id+']:',error.message);
                                  if(error.message==='Not Found'){
                                    //restApiUtil.sendResponse(response, R.constants.HTTP_NOT_FOUND, error, request.body,thisService,startService,startTime);
                                    reject({response, httpCode:R.constants.HTTP_NOT_FOUND, bodyOut:error, bodyIn:body, service:thisService,startTime});
                                }else{
                                    //restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL,error,body,thisService,startTime);
                                    reject({response, httpCode:R.constants.HTTP_INTERNAL, bodyOut:error, bodyIn:body, service:thisService,startTime});
                                }
                            });
                        }else{
                            R.logger.error('Recdord not found', url);
                            reject({response, httpCode:R.constants.HTTP_NOT_FOUND, bodyOut:R.constants.ERROR_NOT_FOUND, bodyIn:body, service:thisService,startTime});
                            //restApiUtil.sendResponse(response, R.constants.HTTP_NOT_FOUND, R.constants.ERROR_NOT_FOUND, body,thisService,startTime);
                            }
                    },error=>reject({response, httpCode:R.constants.HTTP_NOT_FOUND, bodyOut:error, bodyIn:body, service:thisService,startTime})//restApiUtil.sendResponse(response, R.constants.HTTP_NOT_FOUND, error, request.body,thisService,startTime)
                ),error=>reject({response, httpCode:error.httpcode, bodyOut:error.error, bodyIn:body, service:thisService,startTime})//restApiUtil.sendResponse(response,httpcode, error , body ,thisService,startTime)
            )
    });
};

