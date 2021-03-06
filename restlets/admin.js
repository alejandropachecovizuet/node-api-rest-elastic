'use strict';
/*
 xDocRestName:Admin
 * */
let R = require("../util/rest-api-requires");
let restApiUtil = require("../util/restApiUtil");
let controller = require('../controllers/adminController');

let app = R.express();
let rest='admin';

let router=restApiUtil.init(app);

router.route('/project/:projectId/_init').post(function(request, response) { //xDoc-Desc:Servicio que inicaliza el proyecto:{"projectId":"projectId", "user": {"username":'x@x.com', "pwd":"123456"}}  xDoc-Response:200 OK 
        controller.initProject(request, response)
        .then(({response, httpCode, bodyOut, bodyIn, service,startTime}=response)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime )
        ,({response, httpCode, bodyOut, bodyIn, service,startTime}=error)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime ));    
});
router.route('/project/:projectId').delete(function(request, response) { //xDoc-Desc:Servicio que inicaliza el proyecto:{"projectId":"projectId", "user": {"username":'x@x.com', "pwd":"123456"}}  xDoc-Response:200 OK 
        controller.deleteProject(request, response)
        .then(({response, httpCode, bodyOut, bodyIn, service,startTime}=response)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime )
        ,({response, httpCode, bodyOut, bodyIn, service,startTime}=error)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime ));    
});

router.route('/_stats').get( (request, response)=> restApiUtil.stats(request,response)); /* xDoc-NoDoc */    

let _PORT_=R.properties.get(rest+'.PORT');
restApiUtil.startService(rest,app, router ,_PORT_);