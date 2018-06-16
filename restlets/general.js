'use strict';
/*
 xDocRestName:General
 * */
let R = require("../util/rest-api-requires");
let restApiUtil = require("../util/restApiUtil");
let elasticController = require("../controllers/elasticsearch");
let jsonvalidator = require('../controllers/jsonvalidator');
let appUtil = require('../util/appUtil');
let app = R.express();
let rest='general';
let changes={}
let indexes=['roles'];
let pingResponse='pong';

let router=restApiUtil.init(app);


function initChangesControl(){
    if(JSON.stringify(changes)==='{}'){
       for(let i=0; i<indexes.length; i++){
          changes[indexes[i]]='20160101T000000Z';
       }
    }
}
function updateChangesControl(index){
    initChangesControl();
    if(changes[index]!=null){
        changes[index]=appUtil.getCurrentDateForElastic();
        R.logger.debug('apply changes',index,changes[index]);
    }
}

function find(request, response){
    const {method, url, body, params: {index, id}, headers}=request;
    const thisService=`[${method}]${url}`;
    const projectId=headers['x-projectid'];
    
    R.logger.debug("findById Service:", index, thisService);
    
    restApiUtil.validateTokenAndPermission({headers, restriction:`app.db.${request.params.index}.search`}).then(resultToken=>
        elasticController.find(`${projectId}.${index}`,body,index).then(result=>restApiUtil.sendResponse(response,R.constants.HTTP_OK,result.responses[0].hits,body,thisService)
        ,error =>{
                R.logger.fatal(`No es posible realizar la búsqueda:`,error);
                restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL,error,body,thisService);
        }),errortoken=>{
            R.logger.fatal('errortoken:', errortoken)
            restApiUtil.sendResponse(response,R.constants.HTTP_UNAUTHORIZED, errortoken, body,thisService);        
            }
    );
}



function findById(request, response){
    const {method, url, body, params: {index, id}, headers}=request;
    const thisService=`[${method}]${url}`;
    
    const projectId=headers['x-projectid'];
    R.logger.debug("findById Service:", index, thisService);
    
    restApiUtil.validateTokenAndPermission({headers, restriction:`app.db.${request.params.index}.search`}).then(resultToken=>
            elasticController.findById(`${projectId}.${index}`,id).then(result =>restApiUtil.sendResponse(response,R.constants.HTTP_OK,result.responses[0].hits,body,thisService,)
            ,error=>{
                    R.logger.fatal(`No es posible realizar la búsqueda del id[${id}]`, error);
                    restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL,error,body,thisService);
                    }),
        (errortoken)=>{
            R.logger.fatal('errortoken:', errortoken)
            restApiUtil.sendResponse(response,R.constants.HTTP_UNAUTHORIZED, errortoken, body,thisService);        
            }
    );
}



function add(request, response){
    const {method, url, body, params: {index, id}, headers}=request;
    const thisService=`[${method}]${url}`;
    
    const projectId=headers['x-projectid'];
    R.logger.debug("Add Service:", index, thisService);
    
    restApiUtil.validateTokenAndPermission({headers, restriction:`app.db.${request.params.index}.add`}).then(resultToken=>
        jsonvalidator.validateVsSchema(index, body).then(()=>
            elasticController.findById(`${projectId}.${index}` ,id).then(
                resultFind=>{
                    R.logger.debug('Si pudo realizar la consulta del registro');
                    if(resultFind.responses[0].hits==undefined || resultFind.responses[0].hits.total==0){
                        body["time_created"]=appUtil.getCurrentDateForElastic();
                        body["user_created"]=request.headers.ux;
                        elasticController.add(`${projectId}.${index}`,id,body).then(resultAdd => { 
                                            updateChangesControl(index);
                                            restApiUtil.sendResponse(response,R.constants.HTTP_OK, resultAdd, request.body,thisService);
                                        }, error => {
                                            restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL, error, request.body,thisService);
                                        }); 
                    }else{
                        R.logger.error('Duplicated key', url);
                        restApiUtil.sendResponse(response, R.constants.HTTP_DUPLICATED, R.constants.ERROR_DUPLICATED_KEY, body,thisService,);
                    }
            }, error=>{
                    R.logger.fatal('No es posible realizar la búsqueda', url, error,);
                    restApiUtil.sendResponse(response, R.constants.HTTP_NOT_FOUND, error, request.body,thisService);
            }),        
            error=>{
                R.logger.fatal('No cumple con el esquema', error,);
                restApiUtil.sendResponse(response, R.constants.HTTP_BAD_REQUEST, error, request.body,thisService);
        }),
        (errortoken)=>{
            R.logger.fatal('errortoken:', errortoken)
            restApiUtil.sendResponse(response,R.constants.HTTP_UNAUTHORIZED, errortoken, body,thisService);        
            }
    );
}


function update(request, response){
    const {method, url, body, params: {index, id}, headers}=request;
    const thisService=`[${method}]${url}`;
    
    const projectId=headers['x-projectid'];
    R.logger.debug("Add Service:", index, thisService);
    
    restApiUtil.validateTokenAndPermission({headers, restriction:`app.db.${request.params.index}.update`}).then(resultToken=>
        jsonvalidator.validateVsSchema(index, body).then(()=>
            elasticController.findById(`${projectId}.${index}` ,id).then(
                resultFind=>{
                    R.logger.debug('Si pudo realizar la consulta del registro');
                    if(resultFind.responses[0].hits.total==1){
                        let data = resultFind.responses[0].hits.hits[0]._source;
                        body["time_updated"]=appUtil.getCurrentDateForElastic();
                        body["user_updated"]=request.headers.ux;
                        body["time_created"]=data.time_created;
                        body["user_created"]=data.user_created;
                        elasticController.add(`${projectId}.${index}`,id,body).then(resultAdd => { 
                                            updateChangesControl(index);
                                            restApiUtil.sendResponse(response, R.constants.HTTP_OK, resultAdd, request.body,thisService);
                                        }, error => {
                                            restApiUtil.sendResponse(response, R.constants.HTTP_INTERNAL, error, request.body,thisService);
                                        }); 
                    }else{
                        R.logger.error('No encontro el registro', url);
                        restApiUtil.sendResponse(response, R.constants.HTTP_NOT_FOUND, R.constants.ERROR_NOT_FOUND, body,thisService,);
                    }
            }, error=>{
                    R.logger.fatal('No es posible realizar la búsqueda', url, error,);
                    restApiUtil.sendResponse(response, R.constants.HTTP_NOT_FOUND, error, request.body,thisService);
            }),        
            error=>{
                R.logger.fatal('No cumple con el esquema', error,);
                restApiUtil.sendResponse(response, R.constants.HTTP_BAD_REQUEST, error, request.body,thisService);
        }),
        (errortoken)=>{
            R.logger.fatal('errortoken:', errortoken)
            restApiUtil.sendResponse(response,R.constants.HTTP_UNAUTHORIZED, errortoken, body,thisService);        
            }
    );
}


function deleteById(request, response){
    const {method, url, body, params: {index, id}, headers}=request;
    const thisService=`[${method}]${url}`;
    const projectId=headers['x-projectid'];
    
    R.logger.debug("deleteById Service:", index, thisService, `${projectId}.${index}`, `${projectId}.${index}`.split(".")[1] ,id);
    
    restApiUtil.validateTokenAndPermission({headers, restriction:`app.db.${request.params.index}.delete`}).then(resultToken=>
            elasticController.findById(`${projectId}.${index}`,id).then(
                resultFind=>{
                    R.logger.debug('Si pudo realizar la consulta del registro');
                    if(resultFind.responses[0].hits.total==1){
                        elasticController.deleteById(`${projectId}.${index}`,index,id).then(result=>restApiUtil.sendResponse(response,R.constants.HTTP_OK,'',body,thisService)
                          ,errordelete=>{
                                R.logger.error('No fue posible borrar el registro['+index+']['+id+']:',errordelete);
                                restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL,errordelete,body,thisService);
                      });
                     }else{
                     R.logger.error(R.constants.ERROR_NOT_FOUND+':['+index+']['+id+']');
                     restApiUtil.sendResponse(response,R.constants.HTTP_NOT_FOUND,`No se encontro el documento[${index}][${id}]`,body,thisService);
                     }
            }, error=>{
                    R.logger.fatal('No es posible realizar la búsqueda', url, error,);
                    restApiUtil.sendResponse(response, R.constants.HTTP_NOT_FOUND, error, request.body,thisService);
            }),
        (errortoken)=>{
            R.logger.fatal('errortoken:', errortoken)
            restApiUtil.sendResponse(response,R.constants.HTTP_UNAUTHORIZED, errortoken, body,thisService);        
            }
    );
}

router.route('/_stats').get( (request, response)=> restApiUtil.sendResponse(response,R.constants.HTTP_OK,{pid:process.pid, memory_usage: process.memoryUsage(), cpu_usage:process.cpuUsage(), args:process.argv},request.body,'stats')); /* xDoc-NoDoc */

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
    update(request,response);
});

router.route('/:index/:id').delete(function(request, response) { //xDoc-Desc:Borra el registro indicado en <b>:id(_id de elasticsearch)</b> del catalogo <b>:index</b> xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token xDoc-JSON-Example:<b>NO_BODY</b> 
    deleteById(request,response);
});

router.route('/changes').get(function(request, response) { //xDoc-Desc:Regresa la fecha última en que fuerón actualizados los catalogos
    initChangesControl();
    restApiUtil.sendResponse(response,R.constants.HTTP_OK,changes,request.body,'/changes');
});

router.route('/ping').get(function(request, response) { /* xDoc-NoDoc */
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

let _PORT_=R.properties.get(rest+'.PORT');
restApiUtil.startService(rest,app, router ,_PORT_);
