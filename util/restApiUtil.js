'use strict';
let R = require("./rest-api-requires");
let fs = require('fs');
let elasticController = require("../controllers/elasticsearch");
let jsonvalidator= require('../controllers/jsonvalidator');
let timeout = require('connect-timeout');
let allRoles;

//var restApiUtil={
function validatePermision(user,restrictionUser,userRoles,allRolesx){
    let found=false;
    R.logger.debug(`validatePermision...${restrictionUser}`,userRoles);

    let promise = new Promise((resolve, reject)=>{
        if(allRolesx!=null){
            for(var i=0; i<allRolesx.length; i++){
                var rolDB=allRolesx[i]._source.role;
                var restrictions=allRolesx[i]._source.restrictions;
                //console.log('i['+i+']:', rolDB  ,restrictions);
                for(var j=0; j<userRoles.length; j++){
                    var userRol=userRoles[j].rol;
                    //console.log('j['+j+']:',userRol,rolDB);
                    if(rolDB==userRol){
                        console.debug(`Rol encontrado: ${userRol}`)
                        for(var k=0; k<restrictions.length; k++){
                            var restrictionDB=restrictions[k].restriction;
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

  let hasPermisson = (user, userRoles,restriction)=>{
  let promise =new Promise((resolve, reject) => {
    if(allRoles == null){
        R.logger.debug('Obteniendo los roles de base de datos');
        elasticController.find(R.constants.INDEX_ROL,{}).then(result=>{
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
        secret: 'mesaV1',
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
        var https = require('https');
        var privateKey  = fs.readFileSync('certs/key.pem', 'utf8');
        var certificate = fs.readFileSync('certs/cert.pem', 'utf8');
        var credentials = {key: privateKey, cert: certificate};

        var httpsServer = https.createServer(credentials, app);
        httpsServer.listen(port, function() {  
        R.logger.info('['+service+'](HTTPS)Node server running on ' + port + ', proceso: ' + process.pid );
//        console.log(process);
        console.log(process.getuid());
        console.log(process.getgid());
        console.log(process.id);
            
            
        });
    }else{
        var http = require('http');
        var httpServer = http.createServer(app);
        httpServer.listen(port, function() {  
        R.logger.info(`[${service}](HTTP)Node server running on : ${port} , proceso: ${process.pid}`);
        });
    }
}
exports.startService = startService;

exports.validateTokenAndPermission= ({headers, restriction})=>{
    let promise = new Promise((resolve, reject) => {
//        if(restriction  && !restriction.includes('app_test')){
    if(restriction){    
            let token = headers['x-access-token'];
            let tokenusername = headers['ux'];
            R.jwtController.verify(token,tokenusername).then( roles => {
                hasPermisson(tokenusername, roles, restriction).then(resultHasPermission =>{
                    resolve();
                }, errorHasPermission =>reject(errorHasPermission));
            }, (errorToken)=>reject(errorToken));
       }else{
           resolve();
       }
   });
   return promise;
}
exports.sendResponse = (response, httpCode, bodyOut, bodyIn, service, token='') => {
    if(bodyIn.pwd){
        bodyIn.pwd="*********";
    }
    R.logger.info(`service-response: ${service}`,httpCode, bodyOut, bodyIn, token);
    if(token){
        response.setHeader("x-access-token", token);
    }
    response.status(httpCode).send(bodyOut);
}
