'use strict';
/*
 xDocRestName:Login
 * */
var R = require("../util/rest-api-requires");
var restApiUtil = require("../util/restApiUtil");
var jsonvalidator = require('../controllers/jsonvalidator');
var elasticController = require("../controllers/elasticsearch");
var util = require('util');

var app = R.express();
var rest='login',name='';

var router=restApiUtil.init(app);

router.route('/authenticate').post(function(request, response) { //xDoc-Desc:Authenticación del usuario xDoc-JSON-Example:{"username":"luisXV", "pwd":"123456"}  xDoc-Response:Usuario + Token 
       var servicex=rest+name;  
        jsonvalidator.validateVsSchema('authenticate_schema',request.body,function(error){
            restApiUtil.sendResponse(request.body,response,servicex,R.constants.HTTP_BAD_REQUEST,error);        
        });
    
        if(request.body == null || request.body == {} || request.body.username == undefined || request.body.pwd == undefined){
                R.logger.error("Bad Request-authenticate:" + JSON.stringify(request.body));
                restApiUtil.sendResponse(request.body,response,servicex,R.constants.HTTP_BAD_REQUEST,"");
        }else{
//                controller.authenticate(request.body).then(
                var queryObj={"query": {"bool": {"must": [{"match": {"_id": request.body.username}},{ "match": { "pwd":  request.body.pwd }}]}}};    
               elasticController.find('app_user',undefined,queryObj).then(
                    function(result){
                        if(result.responses[0].hits.total > 0){
                           R.logger.debug("Se autentico el usuario " + request.body.username + " correctamente!!!");
                           var resx=result.responses[0].hits.hits[0];
                            resx.token=R.jwtController.sign(resx).token;
                           restApiUtil.sendResponse(request.body,response,servicex,R.constants.HTTP_OK,"["+JSON.stringify(resx)+"]");
                        }else{
                           request.body.pwd='************';
                           R.logger.error('No existe el usuario/password indicado:' +JSON.stringify(request.body));
                           restApiUtil.sendResponse(request.body,response,servicex,R.constants.HTTP_UNAUTHORIZED,{});
                        }
                }, function(error){
                        R.logger.error("No se authentico el usuario:" + request.body.username + "->" + error);
                        restApiUtil.sendResponse(request.body,response,servicex,R.constants.HTTP_UNAUTHORIZED,error);
                });
        }    
});

router.route('/login/stat').get(function(request, response) { //xDoc-NoDoc
    var usage = require('usage');
    var servicex=rest+'-stat';  
    var respuesta ='{memory:'+util.inspect(process.memoryUsage())+',uptime:'+process.uptime()+'}';
    usage.lookup(process.pid, function(err, result) {
    result.uptime=+process.uptime();
    restApiUtil.sendResponse('',response,servicex,R.constants.HTTP_OK,result);
    });
});

var _PORT_=R.properties.get(rest+'.PORT');
restApiUtil.startService(rest,app, router ,_PORT_);