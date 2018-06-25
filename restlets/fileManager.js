'use strict';
/*
 xDocRestName:FileManager
 * */
let R = require("../util/rest-api-requires");
let restApiUtil = require("../util/restApiUtil");
let controller = require('../controllers/fileManagerController');

let app = R.express();
let rest='fileManager';

let router=restApiUtil.init(app);

router.route('/file').put(function(request, response) { //xDoc-Desc:Servicio que permte subir un archivo en base64: {"file":"base64", "Nombre":"Nombre del archivo"}  xDoc-Response:200 OK 
        controller.add(request, response)
        .then(({response, httpCode, bodyOut, bodyIn, service,startTime}=response)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime )
        ,({response, httpCode, bodyOut, bodyIn, service,startTime}=error)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime ));    
});

router.route('/file/:id').get(function(request, response) { //xDoc-Desc:Busca el registro <b>:id</b> xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token
        const {params: {id}}=request;
       if(id.startsWith('G')){
               R.logger.info('Es publico!!!!', id);
                controller.findByIdGlobal(request, response)
                .then(({response, httpCode, bodyOut, bodyIn, service,startTime}=response)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime, true )
                ,({response, httpCode, bodyOut, bodyIn, service,startTime}=error)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime ));    
       }else{
        R.logger.info('Es privado!!!!', id);
                controller.findById(request, response)
                .then(({response, httpCode, bodyOut, bodyIn, service,startTime}=response)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime, true )
                ,({response, httpCode, bodyOut, bodyIn, service,startTime}=error)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime ));                   
       }

    });
    
router.route('/file/:id').delete(function(request, response) { //xDoc-Desc:Servicio que permite borrar un archivo:{"projectId":"projectId", "user": {"username":'x@x.com', "pwd":"123456"}}  xDoc-Response:200 OK 
        controller.delete(request, response)
        .then(({response, httpCode, bodyOut, bodyIn, service,startTime}=response)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime )
        ,({response, httpCode, bodyOut, bodyIn, service,startTime}=error)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime ));    
});

router.route('/_stats').get( (request, response)=> restApiUtil.stats(request,response)); /* xDoc-NoDoc */    

let _PORT_=R.properties.get(rest+'.PORT');
restApiUtil.startService(rest,app, router ,_PORT_);