'use strict';
var R = require("./rest-api-requires");
var fs = require('fs');
var elasticController = require("../controllers/elasticsearch");
var jsonvalidator= require('../controllers/jsonvalidator');
var timeout = require('connect-timeout');
var allRoles;

//var restApiUtil={
function validatePermision(user,restriction,userRoles,allRolesx){
    var deferred = R.q.defer();
    var found=false;
    R.logger.trace('validatePermision...'+restriction+','+JSON.stringify(userRoles));
    if(allRolesx!=null){
       for(var i=0; i<allRolesx.length; i++){
           var rolDB=allRolesx[i]._source.role;
           var restrictions=allRolesx[i]._source.restrictions;
//           console.log('i['+i+']:' + rolDB + "->" + JSON.stringify(restrictions));
           for(var j=0; j<userRoles.length; j++){
               var userRol=userRoles[j].rol;
//               console.log('j['+j+']:' + userRol );
               if(rolDB==userRol){
                   for(var k=0; k<restrictions.length; k++){
                       var restrictionDB=restrictions[k].restriction;
  //                     console.log('k['+k+']:' + restrictionDB + '->'+restriction);
                       if(restrictionDB==restriction){
                         R.logger.debug('restriccion['+restriction+'] encontrada en rol['+userRol+']');
                        found=true;
                       }
                  }
               }
          }
      }
   }
    if(found){
        R.logger.info('El usuario['+user+'] SI tiene permisos para la restricción:' + restriction);
        deferred.resolve({found: true});
    }else{
        R.logger.error('El usuario['+user+'] NO tiene permisos para la restricción:' + restriction);
        deferred.reject({found: false});
    }
    return deferred.promise;
  }

function hasPermisson(user, userRoles,restriction){
  var deferred = R.q.defer();
  if(allRoles == null){
      R.logger.trace('Obteniendo los roles de base de datos');
      elasticController.find(R.constants.INDEX_ROL,undefined,{}).then(
        function(result){
            allRoles=result.responses[0].hits.hits;
            R.logger.trace('Numero de roles encontrados:' +allRoles.length);
            validatePermision(user,restriction,userRoles,allRoles).then(
                function(resultValidate){
                    deferred.resolve({valid: true});
                }).fail(function(errorvaliadtePermission){
                    R.logger.error('Error en la validación de permisos:'+ errorvaliadtePermission);
                    deferred.reject({valid: false});
                });
    }, function(error){
            R.logger.fatal('No es posible buscar los roles en base de datos + ' +error);
            allRoles=null;
            deferred.reject({valid: false});
    });
  }else{
      R.logger.trace('Obteniendo los roles de la memoria->' + allRoles.length);
      return validatePermision(user,restriction,userRoles,allRoles);
  }    
    return deferred.promise;
}
exports.hasPermisson = hasPermisson;

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
        R.logger.info('['+service+'](HTTP)Node server running on ' + port + ', proceso: ' + process.pid);
        });
    }
}
exports.startService = startService;
    
function execute(params){
       if(params.secure!=null){
            var token = params.secure.headers['x-access-token'];
            var tokenusername = params.secure.headers['ux'];
            R.jwtController.verify(token,tokenusername).then(function(resultValidationToken){
                hasPermisson(tokenusername, resultValidationToken.roles, params.secure.restriction).then(function(resultHasPermission){
                    R.logger.trace('calling callback ...');
                    params.callback.success();
                    }).fail(function(errorHasPermission){
                        R.logger.error('No tiene permisos '+tokenusername+' con los roles'+JSON.stringify( resultValidationToken.roles)+', restriccion:' + params.secure.restriction);  
                        params.callback.fail();
                    });
                }).fail(function(errorToken){
                    R.logger.fatal('errorToken::'+JSON.stringify(errorToken));
                    params.callback.fail();
                });
       }else{
            params.callback.success();
       }
   }
exports.execute = execute;

function sendResponse(body,response, service ,httpCode, obj){
    if(body.pwd!=undefined){
        body.pwd="*********";
    }
    R.logger.info('{service-response{service:'+service+',body:'+JSON.stringify(body)+',httpCode:'+httpCode+',response:'+JSON.stringify(obj)+'}}');
    response.status(httpCode).send(obj);
    }
exports.sendResponse = sendResponse;
