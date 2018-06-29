'use strict';
let R = require("./rest-api-requires");
let appUtil = require('../util/appUtil');
let fs = require('fs');
let database = require("../controllers/database");
let jsonvalidator= require('../controllers/jsonvalidator');
let timeout = require('connect-timeout');
let allRoles;
let mapPhrases=new Map();
let transactionController=require('../controllers/transactionController');
//var expressMetrics = require('express-metrics');

//let compression = require('compression');
//var helmet = require('helmet');

exports.setHeader=(response, header, value)=>{
   try {
    response.setHeader(header, value);
   } catch (error) {
    response.headers[header]=value;
  }
};

function validatePermision(user,restrictionUser,userRoles,allRolesx){
    let found=false;
    R.logger.debug(`validatePermision...${restrictionUser}`,userRoles);

    let promise = new Promise((resolve, reject)=>{
        if(allRolesx!=null){
            for(let i=0; i<allRolesx.length; i++){
                let rolDB=allRolesx[i].record.role;
                let restrictions=allRolesx[i].record.restrictions;
                //R.logger.debug('i['+i+']:', rolDB  ,restrictions);
                for(let j=0; j<userRoles.length; j++){
                    let userRol=userRoles[j].rol;
                    //R.logger.debug('j['+j+']:',userRol,rolDB);
                    if(rolDB==userRol){
                        R.logger.debug(`Rol found: ${userRol}`)
                        for(let k=0; k<restrictions.length; k++){
                            let restrictionDB=restrictions[k].restriction;
                           if(restrictionDB===restrictionUser){
                              R.logger.debug(`restriccion[${restrictionUser}] found for rol[${userRol}]`);
                             found=true;
                            }
                       }
                    }
               }
           }
        }
         if(found){
             R.logger.info(`The User[${user}] have permissions: ${restrictionUser}`);
             resolve();
         }else{
             R.logger.error(`The User[${user}] DON'T have permissions: ${restrictionUser}`);
             reject({error:'User don\'t have permission'} );
         }
    });
    return promise;
    
  }

  let hasPermisson = (user, userRoles,restriction,projectId)=>{
  return new Promise((resolve, reject) => {
    if(allRoles == null){
        R.logger.debug('Find roles in DB',projectId,R.constants.INDEX_ROL);
        database.find(projectId, R.constants.INDEX_ROL,{}).then(result=>{
                allRoles=result.records;
                R.logger.debug('Roles found:' +allRoles.length);
                validatePermision(user,restriction,userRoles,allRoles).
                    then( resultValidate=>{
                        resolve();
                    }, errorvaliadtePermission =>{
                        R.logger.error('Error check permissions:'+ errorvaliadtePermission);
                        reject(errorvaliadtePermission);
                    });
        }, error=>{
            allRoles=null;
            reject({error:'Error finding roles in DB' +error});
        });
    }else{
        R.logger.debug('Finding roles in memory->' + allRoles.length);
        validatePermision(user,restriction,userRoles,allRoles).
        then( resultValidate=>{
            resolve();
        }, errorvaliadtePermission =>{
            R.logger.error('Error finding roles:'+ errorvaliadtePermission);
            reject(errorvaliadtePermission);
        });
        }    
  });
};
exports.hasPermisson=hasPermisson;

function haltOnTimedout(request, response, next){
  if (!request.timedout)
    next();  
}

function init(app, restName, limit){
    app.use(timeout(R.properties.get('app.restlet.response.timeout')));
    app.use(R.bodyParser.urlencoded({limit, extended: false }));  
    app.use(haltOnTimedout);
    app.use(R.bodyParser.json({limit}));
    app.use(R.methodOverride());
    let portStats=R.properties.get(`${restName}.stats.PORT`);
/*    if(portStats!=undefined){
        R.logger.info('Start statistics in port:', portStats);
        app.use(expressMetrics({
             port: portStats
           }));
         }*/
    //app.use(helmet);
    //app.use(compression);
    

    app.use(R.session({
        resave: false,
        secret: 'API-REST-NODE',
        saveUninitialized: false
    }));

    return R.express.Router();
}
exports.init = init;

function haltOnTimedout(req, res, next){
  if (!req.timedout) next();
}

function startService(service,app,router, port){
    app.use(router);
    let protocol=R.properties.get('app.protocol');

    if(protocol=='https'){
        let https = require('https');
        let privateKey  = fs.readFileSync('.certs/key.pem', 'utf8');
        let certificate = fs.readFileSync('.certs/cert.pem', 'utf8');
        let credentials = {key: privateKey, cert: certificate};

        let httpsServer = https.createServer(credentials, app);
        httpsServer.listen(port, function() {  
           R.logger.info(`[${service}](${protocol})Node server running on ${port}, process: ${process.pid},user:${process.getuid()},database:${R.properties.get('app.database.use')}`);
        });
    }else{
        let http = require('http');
        let httpServer = http.createServer(app);
        httpServer.listen(port, function() {  
            R.logger.info(`[${service}](${protocol})Node server running on ${port}, process: ${process.pid},user:${process.getuid()},database:${R.properties.get('app.database.use')}`);
        });
    }
}
exports.startService = startService;
/*
exports.validateTokenAndPermission= ({headers, restriction}, testOptions)=>{
    let promise = new Promise((resolve, reject) => {
        let projectId=headers['x-projectid'];
        if(projectId===undefined){
            reject('projectId not found');
        }else{
            getPhrase(projectId,testOptions).then((phrase)=>{
                if(restriction){    
                    let token = headers['x-access-token'];
                    let tokenusername = headers['ux'];
                    R.jwtController.verify(token,tokenusername, phrase, projectId).then( (decodeToken) => {
                        hasPermisson(tokenusername, decodeToken.roles, restriction, decodeToken.projectId).then(resultHasPermission =>{
                            resolve();
                        }, errorHasPermission =>reject(errorHasPermission));
                    }, (errorToken)=>reject(errorToken));
               }else{
                   resolve();
               }
            });
        }
   });
   return promise;
}
*/
let sendResponse = (request, response, httpCode, bodyOut, bodyIn, service,startTime, notShowResponse) => {
    R.logger.info('response---->', bodyIn);
    if(bodyIn!=undefined && bodyIn.pwd!=undefined){
        bodyIn.pwd="*********";
    }
    if(bodyIn!=undefined && bodyIn.user!=undefined && bodyIn.user.pwd!=undefined){
        bodyIn.user.pwd="*********";
    }
    const timeElapsed=startTime===undefined?0:new Date().getTime()-startTime;

    R.logger.info(`service-response: ${service}`,httpCode, notShowResponse===true?'':bodyOut, bodyIn,`Elapsed time:${timeElapsed} milliseconds`);
    response.status(httpCode).send(bodyOut);
    transactionController.addAync(request, response,httpCode, bodyOut ,timeElapsed);
}
exports.sendResponse=sendResponse;

let getPhrase=(projectId,testOptions)=>{
    let errorDummy = appUtil.getErrorDummy(testOptions,'err_phrase');
    if(errorDummy===undefined){
       return new Promise((resolve, reject)=>{
        let phrase=mapPhrases.get(projectId);
        if(phrase){
            R.logger.info('Obteing phrases in memory', phrase);
            resolve(phrase);
        }else{
            R.logger.info('Obtein phrases in DB!!!',projectId)
            database.findById('general', R.constants.INDEX_PROJECT,projectId,testOptions).then(result => {
                phrase=result.phrase
                mapPhrases.set(projectId,phrase)
                R.logger.debug('phrase-->', result);
                if(!phrase){
                    reject({error:'project not exists:'+projectId});
                }
                resolve(phrase);
            },error=>reject({error}));
        }
    });
    }else {
        R.logger.info('**Returning error dummy->',errorDummy);
        return appUtil.sendTestError({errorDummy});
    }
}; 
exports.getPhrase=getPhrase;

let validateAll=(validations,request={}, params,testOptions)=>{    
    R.logger.info('validate all....', request.body);
    let errorDummy = appUtil.getErrorDummy(testOptions,`err_schema`);
    if(errorDummy===undefined){
        return new Promise((resolve, reject)=>{
            R.logger.info('validations[0]',validations[0]);
            let validation=validations[0];
            if(validations.length>1){
                validate(validation,request,params).then((result)=>
                    validateAll(validations.slice(1,validations.length),request, params).then(
                        ()=>resolve()
                        ,error=>reject(error)
                    )
                ,error=>reject(error)
                );
            }else{
                validate(validation,request,params).then(
                    ()=>resolve()
                    ,error=>reject(error));
                }    
        })
    }else {
        R.logger.info('**Returning error dummy->',errorDummy);
        return appUtil.sendTestError({httpcode:R.constants.HTTP_BAD_REQUEST, error:errorDummy});
    }
};
exports.validateAll=validateAll;

let getHeaderParamOBody=(request, paramName)=>{
    let param=undefined
    try {
        if(!appUtil.isJsonEmpty(request.headers)){
            param=request.headers[paramName];
            }
         if(paramName===R.constants.HEADER_PROJECTID){
             paramName='projectId';
         }

         if(param===undefined){
            param=appUtil.isJsonEmpty(request.params)?undefined:request.params[paramName];
         }             
         if(param===undefined){
            param=appUtil.isJsonEmpty(request.body)?undefined:request.body[paramName];
         }             
        } catch (error) {
            R.logger.error(error);
        }
    if(param===undefined && paramName==='projectId'){
        param='general';
    }
    return param;
}
exports.getHeaderParamOBody=getHeaderParamOBody;

let validate=(validation, request, params)=>{
    const {headers, body}=request;
    R.logger.debug('Validating ...', validation);
    let projectId=getHeaderParamOBody(request,R.constants.HEADER_PROJECTID);
    let token=getHeaderParamOBody(request,R.constants.HEADER_TOKEN);
    let user=getHeaderParamOBody(request,R.constants.HEADER_USER);
    R.logger.debug('-->projectId', projectId );
    
    return new Promise((resolve, reject) => {
        switch(validation) {
            case 'projectid_header':
                !projectId?reject({httpcode:R.constants.HTTP_UNAUTHORIZED, error:{error:'projectId not found'}}) : resolve();
                break;
            case 'user_header':
                !user?reject({httpcode:R.constants.HTTP_UNAUTHORIZED, error:'userid not found'}) : resolve();
                break;
            case 'token_header':
                !token?reject({httpcode:R.constants.HTTP_UNAUTHORIZED, error:{error:'token not found'}}) : resolve();
                break;
            case 'schema':
                R.logger.debug('validating schema....');
                jsonvalidator.validateVsSchema(params.schema,body)
                    .then(
                        ()=>resolve()
                        ,error=>reject({httpcode:R.constants.HTTP_BAD_REQUEST, error}));
                break;
            case 'validate_token':
                getPhrase(projectId).then(
                    phrase=> R.jwtController.verify(token,user, phrase, projectId)
                        .then( 
                            ()=> resolve()
                            ,error=>reject({httpcode:R.constants.HTTP_UNAUTHORIZED, error}))
                    ,error=> reject({httpcode:R.constants.HTTP_UNAUTHORIZED, error})
                );
                break;
            case 'restriction':
                getPhrase(projectId).then(
                    phrase=> R.jwtController.verify(token,user, phrase, projectId)
                        .then( 
                            decodeToken=>{
                                let restriction=params.restriction;
                                if(!restriction){
                                    reject({httpcode:R.constants.HTTP_UNAUTHORIZED, detail:'restriction not found', error});
                                }else{
                                    hasPermisson(user, decodeToken.roles, params.restriction, decodeToken.projectId).then(
                                        result => resolve(result)
                                        ,error =>reject({httpcode:R.constants.HTTP_UNAUTHORIZED, detail:`'Don't have Permission:${restriction}`, error}));
                                }
                            }
                            ,error=> reject({httpcode:R.constants.HTTP_UNAUTHORIZED, error}))
                        ,error=> reject({httpcode:R.constants.HTTP_UNAUTHORIZED, error}));
                break;
            default:
                reject({httpcode:R.constants.HTTP_INTERNAL, error:'validation not foud'});
                break;
        };
    });
  }
  exports.validate=validate;

  exports.stats=(request,response)=>{
      let responseBody = {pid:process.pid, memory_usage: process.memoryUsage(), cpu_usage:process.cpuUsage(), args:process.argv};
      sendResponse(request, response,R.constants.HTTP_OK,responseBody,request.body,'stats'); 
    }
