'use strict';
/*
 xDocRestName:FileManagerStream
 * */
let R = require("../util/rest-api-requires");
let restApiUtil = require("../util/restApiUtil");
let fs = require('fs');
let controller = require('../controllers/fileManagerStreamController');

let app = R.express();
let rest='fileManagerStream';

let router=restApiUtil.init(app, rest, '150mb' );

router.route('/stream/:id').put(function(request, response, next) { //xDoc-Desc:Servicio que permte subir un archivo en base64: {"file":"base64", "Nombre":"Nombre del archivo"}  xDoc-Response:200 OK 
    R.logger.info('-->headers',request.headers);
    controller.upload(request, response, next)
    .then(({response, httpCode, bodyOut, bodyIn, service,startTime}=response)=>restApiUtil.sendResponse(request, response, httpCode, bodyOut, bodyIn, service,startTime )
    ,({response, httpCode, bodyOut, bodyIn, service,startTime}=error)=>restApiUtil.sendResponse(request, response, httpCode, bodyOut, bodyIn, service,startTime ));    
});


router.route('/stream/:projectId/:id').get(function(request, response) { //xDoc-Desc:Busca el registro <b>:id</b> xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token
    const {params: {id}}=request;
    if(id.startsWith('P')){
        controller.download(request, response);
    }else{
        controller.downloadPublic(request, response);
    }
    });
    
router.route('/_stats').get( (request, response)=> restApiUtil.stats(request,response)); /* xDoc-NoDoc */    

let _PORT_=R.properties.get(rest+'.PORT');
restApiUtil.startService(rest,app, router ,_PORT_);