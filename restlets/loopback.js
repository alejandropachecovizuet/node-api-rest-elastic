'use strict';
/*
 xDocRestName:Loopback
 * */
let R = require("../util/rest-api-requires");
let restApiUtil = require("../util/restApiUtil");
let app = R.express();

let router=restApiUtil.init(app, 'loopback');

router.route('/_stats').get( (request, response)=> restApiUtil.stats(request,response)); /* xDoc-NoDoc */    

router.route('/loopback').post(function(request, response) { //xDoc-Desc:Servicio loopback de usuario xDoc-Esteban:prueba xDoc-JSON-Example:{"username":"luisXV", "nombre":"Luis", "apellidop":"Zamora", "apellidom":"Salgado", "frase":"123456", "loopback":{"http":{"code":"404","response":{"Err":"ok","x":"y"}} } } 
        let startTime = new Date().getTime();
        const {method, url, body}=request;
        const thisService=`[${method}]${url}`;
       if(body.loopback==='test'){
                restApiUtil.sendResponse(request, response ,R.constants.HTTP_OK,'',body,thisService,startTime);
        }else if(body.loopback==undefined){
                restApiUtil.sendResponse(request, response ,R.constants.HTTP_BAD_REQUEST,R.constants.ERROR_REJECT_INVALID_PARAMS,body,thisService,startTime);
       }else{
                restApiUtil.sendResponse(request, response ,body.loopback.http.code,body.loopback.http.response,body,thisService,startTime);
        }
});

let _PORT_=R.properties.get('loopback.PORT');
restApiUtil.startService('Loopback',app, router ,_PORT_);
