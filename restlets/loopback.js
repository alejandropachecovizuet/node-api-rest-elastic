'use strict';
/*
 xDocRestName:Loopback
 * */
let R = require("../util/rest-api-requires");
let restApiUtil = require("../util/restApiUtil");
let app = R.express();

let router=restApiUtil.init(app);

router.route('/loopback').post(function(request, response) { //xDoc-Desc:Servicio loopback de usuario xDoc-Esteban:prueba xDoc-JSON-Example:{"username":"luisXV", "nombre":"Luis", "apellidop":"Zamora", "apellidom":"Salgado", "frase":"123456", "loopback":{"http":{"code":"404","response":{"Err":"ok","x":"y"}} } } 
        const {method, url, body}=request;
        const thisService=`[${method}]${url}`;
       if(body.loopback==='test'){
                restApiUtil.sendResponse(response,R.constants.HTTP_OK,'',body,thisService);
        }else if(body.loopback==undefined){
                restApiUtil.sendResponse(response,R.constants.HTTP_BAD_REQUEST,R.constants.ERROR_REJECT_INVALID_PARAMS,body,thisService);
       }else{
                restApiUtil.sendResponse(response,body.loopback.http.code,body.loopback.http.response,body,thisService);
        }
});

let _PORT_=R.properties.get('loopback.PORT');
restApiUtil.startService('Loopback',app, router ,_PORT_);
