'use strict';
/*
 xDocRestName:General
 * */
let R = require("../util/rest-api-requires");
let restApiUtil = require("../util/restApiUtil");
let app = R.express();
let rest='general';
let controller = require('../controllers/generalController');
let pingResponse='pong';

let router=restApiUtil.init(app, rest);

router.route('/_stats').get( (request, response)=> restApiUtil.stats(request,response)); /* xDoc-NoDoc */    

router.route('/:index/:id').put(function(request, response) { //xDoc-Desc:Agrega un registro en el indice <b>:index</b>  y el id <b>:id</b> xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token xDoc-JSON-Example: {"cve": "1","description":"Activo"}
    controller.add(request, response)
    .then(({response, httpCode, bodyOut, bodyIn, service,startTime}=response)=>restApiUtil.sendResponse(request, response , httpCode, bodyOut, bodyIn, service,startTime )
    ,({response, httpCode, bodyOut, bodyIn, service,startTime}=error)=>restApiUtil.sendResponse(request, response , httpCode, bodyOut, bodyIn, service,startTime ));    
});

router.route('/:index/_search').post(function(request, response) { //xDoc-Desc:Busca todos los registros en el indice <b>:index</b> que cumplan con el query xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token xDoc-JSON-Example:{"query": {"match_all": {}}}
    controller.find(request, response)
    .then(({response, httpCode, bodyOut, bodyIn, service,startTime}=response)=>restApiUtil.sendResponse(request, response , httpCode, bodyOut, bodyIn, service,startTime )
    ,({response, httpCode, bodyOut, bodyIn, service,startTime}=error)=>restApiUtil.sendResponse(request, response , httpCode, bodyOut, bodyIn, service,startTime ));    
});

router.route('/:index/_searchById/:id').get(function(request, response) { //xDoc-Desc:Busca el registro <b>:id</b> en el indice <b>:index</b> xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token
    controller.findById(request, response)
    .then(({response, httpCode, bodyOut, bodyIn, service,startTime}=response)=>restApiUtil.sendResponse(request, response , httpCode, bodyOut, bodyIn, service,startTime )
    ,({response, httpCode, bodyOut, bodyIn, service,startTime}=error)=>restApiUtil.sendResponse(request, response , httpCode, bodyOut, bodyIn, service,startTime ));    
});

router.route('/:index/:id/_update').put(function(request, response) { //xDoc-Desc:Actualiza el registro indicado en <b>:id(_id de elasticsearch)</b> del catalogo <b>:index</b> xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token xDoc-JSON-Example:<b>NO_BODY</b> 
    controller.update(request, response)
    .then(({response, httpCode, bodyOut, bodyIn, service,startTime}=response)=>restApiUtil.sendResponse(request, response , httpCode, bodyOut, bodyIn, service,startTime )
    ,({response, httpCode, bodyOut, bodyIn, service,startTime}=error)=>restApiUtil.sendResponse(request, response , httpCode, bodyOut, bodyIn, service,startTime ));    
});

router.route('/:index/:id').delete(function(request, response) { //xDoc-Desc:Borra el registro indicado en <b>:id(_id de elasticsearch)</b> del catalogo <b>:index</b> xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token xDoc-JSON-Example:<b>NO_BODY</b> 
    controller.deleteById(request, response)
    .then(({response, httpCode, bodyOut, bodyIn, service,startTime}=response)=>restApiUtil.sendResponse(request, response , httpCode, bodyOut, bodyIn, service,startTime )
    ,({response, httpCode, bodyOut, bodyIn, service,startTime}=error)=>restApiUtil.sendResponse(request, response , httpCode, bodyOut, bodyIn, service,startTime ));    
});
/*
router.route('/changes').get(function(request, response) { //xDoc-Desc:Regresa la fecha última en que fuerón actualizados los catalogos
    let startTime = new Date().getTime();
    controller.initChangesControl();
    restApiUtil.sendResponse(request, response ,R.constants.HTTP_OK,{},request.body,'/changes',startTime);
});
*/
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
