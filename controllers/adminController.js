let R = require("../util/rest-api-requires");
let restApiUtil = require("../util/restApiUtil");
let appUtil = require('../util/appUtil');
let database = require("./database");
const uuid = require('uuid/v1');
let util = require('util');
const GENERAL_PROJECT='general';

function initProject(request, response){
    return new Promise((resolve,reject)=>{
    const {method, url, body, params: {projectId}, headers}=request;
    const {projectDescription: description,user: {email, pwd }} = body;
    const phrase=uuid();
    const thisService=`[${method}]${url}`;
    const testOptions=request.testOptions;
    
    let startTime = new Date().getTime();
    R.logger.debug(thisService);
    restApiUtil.validateAll(['schema'],request,{schema:'admin_init_schema'},testOptions).then(
            ()=>{
                R.logger.debug('Valitaion is OK!!!!');                
                database.findById(GENERAL_PROJECT,R.constants.INDEX_PROJECT ,projectId,testOptions).then(
                    result=>{
                        R.logger.debug('Record found!!!',result);
                        if(result.total==0){0
                            let bodyProject={
                                    description,
                                    plan:'initial',
                                    phrase,
                                    time_created:appUtil.getCurrentDateForElastic(),
                                    user_created:email,                        
                            };
                            R.logger.debug('adding project...', projectId);
                            database.add(GENERAL_PROJECT,R.constants.INDEX_PROJECT,projectId ,bodyProject,testOptions).then(
                                    () => { 
                                    R.logger.info(`project ${projectId} added `);
                                    let bodyRol={"role": "admin",
                                                 "restrictions":[{"restriction":"app.db.users.add"},
                                                                 {"restriction":"app.db.users.delete"},
                                                                 {"restriction":"app.db.users.update"},
                                                                 {"restriction":"app.db.users.search"},
                                                                 {"restriction":"app.db.roles.add"},
                                                                 {"restriction":"app.db.roles.delete"},
                                                                 {"restriction":"app.db.roles.update"},
                                                                 {"restriction":"app.db.roles.search"},
                                                                 {"restriction":"app.db.files.add"},
                                                                 {"restriction":"app.db.files.delete"},
                                                                 {"restriction":"app.db.files.update"},
                                                                 {"restriction":"app.db.files.search"},
                                                                 {"restriction":"app.db.test.add"},
                                                                 {"restriction":"app.db.test.delete"},
                                                                 {"restriction":"app.db.test.update"},
                                                                 {"restriction":"app.db.test.search"},
                                                                 {"restriction":"app.db.testx.add"},
                                                                 {"restriction":"app.db.testx.search"},
                                                            ],
                                            time_created:appUtil.getCurrentDateForElastic(),
                                            user_created:email,                        
                                          };
                                    database.add(projectId, R.constants.INDEX_ROL, 'admin' ,bodyRol,testOptions).then(
                                            () => { 
                                            let userBody={
                                                    projectId,
                                                    "status":1,
                                                    "pwd":R.jwtController.encrypt(pwd,phrase),
                                                    "roles":[{"rol":"admin"}],
                                                    time_created:appUtil.getCurrentDateForElastic(),
                                                    user_created:email,                        
                                                    };
                                            database.add(projectId, R.constants.INDEX_USER, email ,userBody,testOptions).then(
                                                    (result) => { 
                                                            R.logger.info(`User ${email} added `);
                                                            R.logger.info('Project, user and rol created succefully',response);
                                                            //restApiUtil.sendResponse(response,R.constants.HTTP_OK, result, body,thisService, startTime);
                                                            resolve({response, httpCode:R.constants.HTTP_OK, bodyOut:result, bodyIn:body, service:thisService,startTime});
                                                    }, 
                                                    error => { 
                                                            R.logger.error('Error inserting user', error);
                                                            //ROLLBACK
                                                            rollbackRol(projectId,'admin',testOptions);
                                                            rollbackProject(projectId,testOptions);
                                                            reject({response, httpCode:R.constants.HTTP_INTERNAL, bodyOut:error, bodyIn:body, service:thisService,startTime});
                                                    });     
                                    },(error)=>{
                                            R.logger.error('Error inserting rol', error);
                                            //ROLLBACK
                                            rollbackProject(projectId,testOptions);
                                            reject({response, httpCode:R.constants.HTTP_INTERNAL, bodyOut:error, bodyIn:body, service:thisService,startTime});
                                        } 
                                    );//rol
                            
                             }, error => {
                                 R.logger.error('Error creating project', error);
                                 reject({response, httpCode:R.constants.HTTP_INTERNAL, bodyOut:error, bodyIn:body, service:thisService,startTime});
                                 //restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL, error, body,thisService,startTime)
                                });                                                 
                    }else{
                            R.logger.error('Duplicated project', url);
                            //restApiUtil.sendResponse(response, R.constants.HTTP_DUPLICATED, R.constants.ERROR_DUPLICATED_KEY, body,thisService,startTime);
                            reject({response, httpCode:R.constants.HTTP_DUPLICATED, bodyOut:R.constants.HTTP_DUPLICATED, bodyIn:body, service:thisService,startTime});
                        }
            }, error => {
                    R.logger.debug('Error finding project', error);
                    reject({response, httpCode:R.constants.HTTP_INTERNAL, bodyOut:error, bodyIn:body, service:thisService,startTime});
                    //restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL, error, body,thisService, startTime)
                }) }                                                
            ,error=> {
                R.logger.info('Valitaion is ERROR!!!!', error);                
                reject({response, httpCode:error.httpcode, bodyOut:error.error, bodyIn:body, service:thisService,startTime});
                //restApiUtil.sendResponse(response,error.httpcode, error.error , body ,thisService,startTime)
            }
    )
});
}
exports.initProject=initProject;
                         
                    
function deleteProject(request, response){
    return new Promise((resolve,reject)=>{
    let startTime = new Date().getTime();
    const {method, url, body, params: {projectId}}=request;
    const thisService=`[${method}]${url}`;
    const testOptions=request.testOptions;

    R.logger.info('DELETE PROJECT!!!!!',projectId);
    database.deleteById(GENERAL_PROJECT,R.constants.INDEX_PROJECT, R.constants.INDEX_PROJECT ,projectId,testOptions).then(() => { 
            R.logger.info(`Project ${projectId} deleted `);
            resolve({response, httpCode:R.constants.HTTP_OK, bodyOut:'', bodyIn:body, service:thisService,startTime});
            //restApiUtil.sendResponse(response,R.constants.HTTP_OK, '', body,thisService,startTime);
    }, error => {
            //restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL, error, body,thisService, startTime);
            reject({response, httpCode:R.constants.HTTP_INTERNAL, bodyOut:error, bodyIn:body, service:thisService,startTime});
    }); 
}); 
}
exports.deleteProject=deleteProject;

function rollbackRol(projectId,id,testOptions){
    R.logger.info('Rollback rol add ...')
    setTimeout(()=> {
     database.deleteById(projectId,R.constants.INDEX_ROL, R.constants.INDEX_ROL ,id,testOptions)
                .then(() => R.logger.info(`Rol ${id} deleted `)
                , error => R.logger.error('Error, dont delete rol:',id));
    },1000)}; 
    
function rollbackProject(projectId,testOptions){
        R.logger.info('Rollback project add ...')
        setTimeout(()=>{ 
        database.deleteById('general',R.constants.INDEX_PROJECT, R.constants.INDEX_PROJECT ,projectId,testOptions)
                .then(() => R.logger.info(`Project ${projectId} deleted `)
                ,error => R.logger.error('Error, dont delete project:',projectId))} 
        ,1000)}; 