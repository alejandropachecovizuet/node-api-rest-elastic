'use strict';
let R = require("./rest-api-requires");
let fs = require('fs');
let elasticController = require("../controllers/elasticsearch");
let jsonvalidator= require('../controllers/jsonvalidator');
let timeout = require('connect-timeout');
let allRoles;
let mapPhrases=new Map();

function validatePermision(user,restrictionUser,userRoles,allRolesx){
    let found=false;
    R.logger.debug(`validatePermision...${restrictionUser}`,userRoles);

    let promise = new Promise((resolve, reject)=>{
        if(allRolesx!=null){
            for(let i=0; i<allRolesx.length; i++){
                let rolDB=allRolesx[i]._source.role;
                let restrictions=allRolesx[i]._source.restrictions;
                //R.logger.debug('i['+i+']:', rolDB  ,restrictions);
                for(let j=0; j<userRoles.length; j++){
                    let userRol=userRoles[j].rol;
                    //R.logger.debug('j['+j+']:',userRol,rolDB);
                    if(rolDB==userRol){
                        R.logger.debug(`Rol encontrado: ${userRol}`)
                        for(let k=0; k<restrictions.length; k++){
                            let restrictionDB=restrictions[k].restriction;
                           if(restrictionDB===restrictionUser){
                              R.logger.debug(`restriccion[${restrictionUser}] encontrada en rol[${userRol}]`);
                             found=true;
                            }
                       }
                    }
               }
           }
        }
         if(found){
             R.logger.info(`El usuario[${user}] SI tiene permisos para la restricción: ${restrictionUser}`);
             resolve();
         }else{
             R.logger.error(`El usuario[${user}] NO tiene permisos para la restricción: ${restrictionUser}`);
             reject('El usuario NO tiene permisos');
         }
    });
    return promise;
    
  }

  let hasPermisson = (user, userRoles,restriction,projectId)=>{
  let promise =new Promise((resolve, reject) => {
    if(allRoles == null){
        R.logger.debug('Obteniendo los roles de base de datos',projectId,R.constants.INDEX_ROL);
        elasticController.find(`${projectId}.${R.constants.INDEX_ROL}`,{}).then(result=>{
                allRoles=result.responses[0].hits.hits;
                R.logger.debug('Numero de roles encontrados:' +allRoles.length);
                validatePermision(user,restriction,userRoles,allRoles).
                    then( resultValidate=>{
                        resolve();
                    }, errorvaliadtePermission =>{
                        R.logger.error('Error en la validación de permisos:'+ errorvaliadtePermission);
                        reject(errorvaliadtePermission);
                    });
        }, error=>{
            allRoles=null;
            reject('No es posible buscar los roles en base de datos' +error);
        });
    }else{
        R.logger.debug('Obteniendo los roles de la memoria->' + allRoles.length);
        validatePermision(user,restriction,userRoles,allRoles).
        then( resultValidate=>{
            resolve();
        }, errorvaliadtePermission =>{
            R.logger.error('Error en la validación de permisos:'+ errorvaliadtePermission);
            reject(errorvaliadtePermission);
        });
        }    
  });
  return promise;
};
exports.hasPermisson=hasPermisson;

function haltOnTimedout(request, response, next){
  if (!request.timedout)
    next();  
}

function init(app){
    app.use(timeout(R.properties.get('app.restlet.response.timeout')));
    app.use(R.bodyParser.urlencoded({ extended: false }));  
    app.use(haltOnTimedout);
    app.use(R.bodyParser.json());
    app.use(R.methodOverride());

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


    if(R.properties.get('app.protocol')=='https'){
        let https = require('https');
        let privateKey  = fs.readFileSync('.certs/key.pem', 'utf8');
        let certificate = fs.readFileSync('.certs/cert.pem', 'utf8');
        let credentials = {key: privateKey, cert: certificate};

        let httpsServer = https.createServer(credentials, app);
        httpsServer.listen(port, function() {  
        R.logger.info('['+service+'](HTTPS)Node server running on ' + port + ', proceso: ' + process.pid );
        R.logger.info(process.getuid());
        R.logger.info(process.getgid());
        R.logger.info(process.id);
            
            
        });
    }else{
        let http = require('http');
        let httpServer = http.createServer(app);
        httpServer.listen(port, function() {  
        R.logger.info(`[${service}](HTTP)Node server running on : ${port} , proceso: ${process.pid}`);
        });
    }
}
exports.startService = startService;

exports.validateTokenAndPermission= ({headers, restriction})=>{
    let promise = new Promise((resolve, reject) => {
        let projectId=headers['x-projectid'];
        if(projectId===undefined){
            reject('projectId not found');
        }else{
            getPhrase(projectId).then((phrase)=>{
                if(restriction){    
                    let token = headers['x-access-token'];
                    let tokenusername = headers['ux'];
                    console.trace('*****************************', phrase);
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
exports.sendResponse = (response, httpCode, bodyOut, bodyIn, service) => {
    if(bodyIn.pwd){
        bodyIn.pwd="*********";
    }
    R.logger.info(`service-response: ${service}`,httpCode, bodyOut, bodyIn);
    response.status(httpCode).send(bodyOut);
}

let getPhrase=(projectId)=>{
    let promise = new Promise((resolve, reject)=>{
        let phrase=mapPhrases.get(projectId);
        if(phrase){
            R.logger.info('Obteniendo las phrases de memoria', phrase);
            resolve(phrase);
        }else{
            R.logger.info('Obteniendo las phrases de DB!!!',projectId)
            elasticController.findById(R.constants.INDEX_PROJECT,projectId).then(result => {
                if(result.responses[0].hits.total > 0){
                    phrase=result.responses[0].hits.hits[0]._source.phrase
                    mapPhrases.set(projectId,phrase)
                }
                R.logger.debug('phrase-->', result.responses[0].hits.total, phrase);
                if(!phrase){
                    reject('project not exists:'+projectId);
                }
                resolve(phrase);
            });
        }
    });
    return promise;
}; 
exports.getPhrase=getPhrase;

let validateAll=(validations,request={}, params)=>{    
    return new Promise((resolve, reject)=>{
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
    })};
exports.validateAll=validateAll;

let validate=(validation, request, params)=>{
    R.logger.debug('Validating ...', validation);
    const {headers, body}=request;
    const projectId=headers['x-projectid'];
    const token=headers['x-access-token'];
    const user=headers['x-user'];
    
    return new Promise((resolve, reject) => {
        switch(validation) {
            case 'projectid_header':
                !projectId?reject({httpcode:R.constants.HTTP_UNAUTHORIZED, error:'projectId not found'}) : resolve();
                break;
            case 'user_header':
                !user?reject({httpcode:R.constants.HTTP_UNAUTHORIZED, error:'userid not found'}) : resolve();
                break;
            case 'token_header':
                !token?reject({httpcode:R.constants.HTTP_UNAUTHORIZED, error:'token not found'}) : resolve();
                break;
            case 'schema':
                R.logger.debug('validating schema....');
                jsonvalidator.validateVsSchema(params.schema,body)
                    .then(
                        ()=>resolve()
                        ,error=>reject({httpcode:R.constants.HTTP_UNAUTHORIZED, error}));
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
            case 'validate_token':
                getPhrase(projectId).then(
                    phrase=> R.jwtController.verify(token,user, phrase, projectId)
                        .then( 
                            ()=>{
                                let restriction=params.restriction;
                                if(!restriction){
                                    reject({httpcode:R.constants.HTTP_INTERNAL, detail:'restriction not found', error});
                                }else{
                                    hasPermisson(user, decodeToken.roles, permissions.restriction, decodeToken.projectId).then(
                                        () => resolve()
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

