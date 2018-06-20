'use strict';
/*
 xDocRestName:Login
 * */
let R = require("../util/rest-api-requires");
let restApiUtil = require("../util/restApiUtil");
let app = R.express();
let rest='login',name='';
let controller = require('../controllers/loginController');


let router=restApiUtil.init(app);

router.route('/authenticate').post(function(request, response) { //xDoc-Desc:Authenticación del usuario xDoc-JSON-Example:{"username":"luisXV", "pwd":"123456"}  xDoc-Response:Usuario + Token 
        controller.authenticate(request, response)
        .then(({response, httpCode, bodyOut, bodyIn, service,startTime}=response)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime )
        ,({response, httpCode, bodyOut, bodyIn, service,startTime}=error)=>restApiUtil.sendResponse(response, httpCode, bodyOut, bodyIn, service,startTime ));    
});

router.route('/_stats').get( (request, response)=> restApiUtil.stats(request,response)); /* xDoc-NoDoc */    

let _PORT_=R.properties.get(rest+'.PORT');
restApiUtil.startService(rest,app, router ,_PORT_);