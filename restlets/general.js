'use strict';
/*
 xDocRestName:General
 * */
var R = require("../util/rest-api-requires");
var restApiUtil = require("../util/restApiUtil");
var elasticController = require("../controllers/elasticsearch");
var jsonvalidator = require('../controllers/jsonvalidator');
var appUtil = require('../util/appUtil');
var app = R.express();
var rest='general';
var changes={}
var indexes=['app_rol'];
var pingResponse='pong';

var router=restApiUtil.init(app);


function initChangesControl(){
    if(JSON.stringify(changes)=='{}'){
       for(var i=0; i<indexes.length; i++){
          changes[indexes[i]]='20160101T000000Z';
       }
    }
}
function updateChangesControl(index){
    initChangesControl();
    R.logger.fatal(changes);
    R.logger.fatal(changes[index]);
    if(changes[index]!=null){
        changes[index]=appUtil.getCurrentDateForElastic();
    }
    R.logger.fatal(changes);
}

function find(request, response){
    var index=request.params.index, type=request.params.type;//||request.params.index;
    var thisService='/'+index+'/'+type+'/_search -POST(search)';
    var findCallback =function(){
        elasticController.find(index,type,request.body).then(
                function(result){
                    //R.logger.debug('Resultado de la busqueda:' +result);
                    restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_OK,result.responses[0].hits);
            }, function(error){
                    R.logger.fatal('No es posible realizar la búsqueda + ' +JSON.stringify(error));
                    restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_OK,error);
            });
    }
    
    var failCallback=function(){
       restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_UNAUTHORIZED,'');        
    }
    
    var params={
        callback:{success:findCallback, fail: failCallback}        
        ,secure:{headers:request.headers, restriction:'app.db.'+request.params.index+'.search'}
        };
    R.logger.trace(thisService+'->'+JSON.stringify(params));
    restApiUtil.execute(params);    
}

function findById(request, response){
    var index=request.params.index,id=request.params.id;
    var thisService='/'+index+'/_searchById/'+id+' -POST(search)';
    R.logger.trace(thisService);
    var findCallback =function(){
        elasticController.findById(index,id).then(
                function(result){
                    restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_OK,result.responses[0].hits);
            }, function(error){
                    R.logger.fatal('No es posible realizar la búsqueda del id['+id+']->' +JSON.stringify(error));
                    restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_OK,error);
            });
    }
    
    var fail=function(){
       restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_UNAUTHORIZED,'');        
    }
    
    var params={
        callback:{success:findCallback, fail: fail}        
        ,secure:{headers:request.headers, restriction:'app.db.'+request.params.index+'.search'}
        };
    R.logger.trace(thisService+'->'+JSON.stringify(params));
    restApiUtil.execute(params);    
}

function add(request, response){
    var isvalidJson=true;
    var index=request.params.index, id=request.params.id;
    var thisService='/'+index+'/'+id+'-PUT(add)';
    
    if(index.indexOf("app_") >-1){
        var addCallback =function(){

            jsonvalidator.validateVsSchema(index,request.body,function(error){
                R.logger.error('No paso la validación de esquema:'+'['+index+']'+error);
                isvalidJson=false;
                restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_BAD_REQUEST,error);     
            });

            if(isvalidJson){
                elasticController.findById(index ,id).then(
                        function(result){
                            if(result.responses[0].hits==undefined || result.responses[0].hits.total==0){
                            request.body.created=appUtil.getCurrentDateForElastic();
                            request.body.user_created=request.headers.ux;
                            elasticController.add(index,index,id,request.body).then(function (result) { 
                                                updateChangesControl(index);
                                                restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_OK,result);
                                          }); 
                            }else{
                            R.logger.error('Duplicated key:['+index+']['+id+']');
                                restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_DUPLICATED,'{"error":"'+ R.constants.ERROR_DUPLICATED_KEY+'"}');
                            }
                    }, function(error){
                            R.logger.fatal('No es posible realizar la búsqueda['+index+']['+id+']:' +JSON.stringify(error));
                            restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_OK,error);
                    });
   
            }
            };

        var fail=function(){
            restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_UNAUTHORIZED,'');        
        };

        var params={
            callback:{success:addCallback, fail: fail}        
            ,secure:{headers:request.headers, restriction:'app.db.'+request.params.index+'.add'}
            };
        R.logger.trace(thisService+'->'+JSON.stringify(params));
        restApiUtil.execute(params);    
    }else{
         restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_BAD_REQUEST,R.constants.ERROR_REJECT_INVALID_PARAMS);
    }
}

function update(request, response){
    var isvalidJson=true;
    var index=request.params.index ,id=request.params.id;
    
    var thisService='/'+index+'/'+id+'-UPDATE';
    console.log("Service--->" + thisService);
    if(request.body!='undefined' && JSON.stringify(request.body)!='{}' && index.indexOf("app_") >-1){
        console.log("1");
        var addCallback1 =function(){
            console.log('successs!!!!!');
        }
        var addCallback =function(){
                console.log("2");
            jsonvalidator.validateVsSchemaForUpdate(index,request.body,function(error){
                console.log("3");
                R.logger.error('No paso la validación de esquema:'+error);
                isvalidJson=false;
                restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_BAD_REQUEST,error);     
            });
            console.log("4");

            if(isvalidJson){
                console.log("Find record ...");
                elasticController.findById(index,id).then(
                        function(result){
                            if(result.responses[0].hits.total==1){
                            request.body.updated=appUtil.getCurrentDateForElastic();
                            request.body.user_updated=request.headers.ux;
                            console.log("updating in elasticsearch ...");
                            elasticController.add(index,index,id,request.body).then(function (result) { 
                                            updateChangesControl(index);
                                            restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_OK,result);
                                          }); 
                            }else{
                                R.logger.error(R.constants.ERROR_NOT_FOUND+':['+index+']['+id+']');
                                restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_NOT_FOUND,R.constants.ERROR_NOT_FOUND);
                            }
                    }, function(error){
                            R.logger.fatal('No es posible realizar la búsqueda del registro a actualizar['+index+']['+id+']:' +JSON.stringify(error));
                            restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_OK,error);
                    });
            }
   
            }

        var fail=function(){
            restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_UNAUTHORIZED,'');        
        }

        var params={
            callback:{success:addCallback, fail: fail}        
            ,secure:{headers:request.headers, restriction:'app.db.'+request.params.index+'.update'}
            };
        R.logger.trace(thisService+'->'+JSON.stringify(params));
        console.log('excecuting ....')
        restApiUtil.execute(params);    
    }else{
         restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_BAD_REQUEST,R.constants.ERROR_REJECT_INVALID_PARAMS);
    }
}


function deleteById(request, response){
    var index=request.params.index, id=request.params.id;
    var thisService='/'+index+'/'+id+'-DELETE';
    
    var deleteFunct =function(){
                elasticController.findById(index,id).then(
                        function(result){
                            if(result.responses[0].hits.total==1){
                               elasticController.deleteById(index,index,id).then(function(result){
                                     restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_OK,result);
                                                       }).fail(function(errordelete){
                                                         R.logger.error('No fue posible eliminar el objeto['+index+']['+id+']:' + errordelete);
                                                         restApiUtil.sendResponse(request.body,response,thisService,errordelete.status,errordelete);
                                                       });
                            }else{
                            R.logger.error(R.constants.ERROR_NOT_FOUND+':['+index+']['+id+']');
                            restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_NOT_FOUND,R.constants.ERROR_NOT_FOUND);
                            }
                    }, function(error){
                            R.logger.fatal('No es posible realizar la búsqueda del registro a borrar['+index+']['+id+']:' +JSON.stringify(error));
                            restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_OK,error);
                    });
    }

    
    var fail=function(){
       restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_UNAUTHORIZED,'');        
    }
    
    var params={
        callback:{success:deleteFunct, fail: fail}        
        ,secure:{headers:request.headers, restriction:'app.db.'+request.params.index+'.delete'}
        };
    R.logger.trace(thisService+'->'+JSON.stringify(params));
    restApiUtil.execute(params);    
}

router.route('/:index/:id').put(function(request, response) { //xDoc-Desc:Agrega un registro en el indice <b>:index</b>  y el id <b>:id</b> xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token xDoc-JSON-Example: {"cve": "1","description":"Activo"}
    add(request,response);
});

router.route('/:index/_search').post(function(request, response) { //xDoc-Desc:Busca todos los registros en el indice <b>:index</b> que cumplan con el query xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token xDoc-JSON-Example:{"query": {"match_all": {}}}
    find(request,response);
});

router.route('/:index/_searchById/:id').get(function(request, response) { //xDoc-Desc:Busca el registro <b>:id</b> en el indice <b>:index</b> xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token
    findById(request,response);
});

router.route('/:index/:id/_update').put(function(request, response) { //xDoc-Desc:Actualiza el registro indicado en <b>:id(_id de elasticsearch)</b> del catalogo <b>:index</b> xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token xDoc-JSON-Example:<b>NO_BODY</b> 
    console.log("updating ..................");
    update(request,response);
});

router.route('/:index/:id').delete(function(request, response) { //xDoc-Desc:Borra el registro indicado en <b>:id(_id de elasticsearch)</b> del catalogo <b>:index</b> xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token xDoc-JSON-Example:<b>NO_BODY</b> 
    deleteById(request,response);
});

router.route('/changes').get(function(request, response) { //xDoc-Desc:Regresa la fecha última en que fuerón actualizados los catalogos
    initChangesControl();
    restApiUtil.sendResponse(request.body,response,'/changes',R.constants.HTTP_OK,changes);
});

router.route('/ping') .post(function(request, response) { /* xDoc-NoDoc */
		     if(pingResponse=='pong'){
                response.status(200).send(pingResponse);
				 }else{
                response.status(409).send(pingResponse);
				 }
});
router.route('/getPing').get(function(request, response) { /* xDoc-NoDoc */
		     if(pingResponse=='pong'){
                response.status(200).send(pingResponse);
				 }else{
                response.status(409).send(pingResponse);
				 }
});
router.route('/fail').get(function(request, response) {/* xDoc-NoDoc */
		     pingResponse='pong...pong...pong...pong...';
             response.status(200).send('fallando .....');
});
router.route('/fix').get(function(request, response) {/* xDoc-NoDoc */
		     pingResponse='pong';
             response.status(200).send('[bitacora]corregido!!!!!!!!!!!!!!!');
});

var _PORT_=R.properties.get(rest+'.PORT');
restApiUtil.startService(rest,app, router ,_PORT_);
