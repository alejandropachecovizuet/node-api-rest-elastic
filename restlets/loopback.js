'use strict';
/*
 xDocRestName:Loopback
 * */
var R = require("../util/rest-api-requires");
var restApiUtil = require("../util/restApiUtil");
var app = R.express();

var router=restApiUtil.init(app);

router.route('/loopback').post(function(req, res) { //xDoc-Desc:Servicio loopback de usuario xDoc-Esteban:prueba xDoc-JSON-Example:{"username":"luisXV", "nombre":"Luis", "apellidop":"Zamora", "apellidom":"Salgado", "frase":"123456", "loopback":{"http":{"code":"404","response":{"Err":"ok","x":"y"}} } } 
       var servicex='/loopback[POST]';  
        if(req.body.loopback){
             restApiUtil.response(req,res,servicex,req.body.loopback.http.code,req.body.loopback.http.response);
        }else{
             restApiUtil.response(req,res,servicex,R.constants.HTTP_BAD_REQUEST,R.constants.ERROR_REJECT_INVALID_PARAMS);
        }
                
});

var _PORT_=R.properties.get('loopback.PORT');
restApiUtil.startService('Loopback',app, router ,_PORT_);
