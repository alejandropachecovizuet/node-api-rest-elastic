'use strict';
/*
 xDocRestName:FileManager
 * */
let R = require("../util/rest-api-requires");
let restApiUtil = require("../util/restApiUtil");
let controller = require('../controllers/fileManagerController');

let app = R.express();
let rest='fileManager';

let router=restApiUtil.init(app, R.properties.get('app.restlet.file.limit'));

router.route('/file').put(function(request, response) { //xDoc-Desc:Servicio que permte subir un archivo en base64: {"file":"base64", "Nombre":"Nombre del archivo"}  xDoc-Response:200 OK 
        controller.add(request, response)
        .then(({response, httpCode, bodyOut, bodyIn, service,startTime}=response)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime )
        ,({response, httpCode, bodyOut, bodyIn, service,startTime}=error)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime ));    
});

let find=(request, response)=>{
        const {params: {id}}=request;
       if(id.startsWith('G')){
                controller.findByIdGlobal(request, response)
                .then(({response, httpCode, bodyOut, bodyIn, service,startTime}=response)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime, true )
                ,({response, httpCode, bodyOut, bodyIn, service,startTime}=error)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime ));    
       }else{
                controller.findById(request, response)
                .then(({response, httpCode, bodyOut, bodyIn, service,startTime}=response)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime, true )
                ,({response, httpCode, bodyOut, bodyIn, service,startTime}=error)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime ));                   
       }
}

let findb64=(request, response)=>{
        const {params: {id}}=request;
       if(id.startsWith('G')){
                controller.findByIdGlobal(request, response)
                .then(({response, httpCode, bodyOut, bodyIn, service,startTime}=response)=>restApiUtil.sendResponse(response, httpCode, getOnlyB64(bodyOut), bodyIn, service,startTime, true )
                ,({response, httpCode, bodyOut, bodyIn, service,startTime}=error)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime ));    
       }else{
                controller.findById(request, response)
                .then(({response, httpCode, bodyOut, bodyIn, service,startTime}=response)=>restApiUtil.sendResponse(response, httpCode, getOnlyB64(bodyOut), bodyIn, service,startTime, true )
                ,({response, httpCode, bodyOut, bodyIn, service,startTime}=error)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime ));                   
       }
}

let getOnlyB64= (bodyResponse)=>{
        
        if(bodyResponse.file!=undefined){
          return bodyResponse.file;
        }else if(bodyResponse.files!=undefined && bodyResponse.files.length===1){
          return bodyResponse.files[0].file;
        }
}

router.route('/file/:projectId/:id').get(function(request, response) { //xDoc-Desc:Busca el registro <b>:id</b> xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token
        find(request, response);
    });
    
router.route('/file/:projectId/:id/:subId').get(function(request, response) { //xDoc-Desc:Busca el registro <b>:id</b> xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token
        find(request, response);
});

router.route('/fileb64/:projectId/:id').get(function(request, response) { //xDoc-Desc:Busca el registro <b>:id</b> xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token
        findb64(request, response);
    });
    
router.route('/fileb64/:projectId/:id/:subId').get(function(request, response) { //xDoc-Desc:Busca el registro <b>:id</b> xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token
        findb64(request, response);
});


router.route('/file/:id').delete(function(request, response) { //xDoc-Desc:Servicio que permite borrar un archivo:{"projectId":"projectId", "user": {"username":'x@x.com', "pwd":"123456"}}  xDoc-Response:200 OK 
        controller.deleteById(request, response)
        .then(({response, httpCode, bodyOut, bodyIn, service,startTime}=response)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime )
        ,({response, httpCode, bodyOut, bodyIn, service,startTime}=error)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime ));    
});

router.route('/_stats').get( (request, response)=> restApiUtil.stats(request,response)); /* xDoc-NoDoc */    

let _PORT_=R.properties.get(rest+'.PORT');
restApiUtil.startService(rest,app, router ,_PORT_);