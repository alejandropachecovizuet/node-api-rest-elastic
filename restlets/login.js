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
        authenticate(request, response);    
});

function authenticate(request, response){
        const {method, url, body, body :{username, pwd}}=request;
        const thisService=`[${method}]${url}`;
        
        R.logger.debug("Authenticate service:", thisService);

        jsonvalidator.validateVsSchema("authenticate_schema",body).then(resultValidateSchema=>{
                let queryObj={"query": {"bool": {"must": [{"match": {"_id": username}},{ "match": { "pwd":  pwd }}]}}};    
                elasticController.find('app_user',queryObj).then(result=>{
                        if(result.responses[0].hits.total > 0){
                                R.logger.debug(`Se autentico el usuario ${username} correctamente!!!`);
                                var resx=result.responses[0].hits.hits[0];
                                resx.token=R.jwtController.sign(resx).token;
                                restApiUtil.sendResponse(response,R.constants.HTTP_OK,'', body, thisService,resx.token);
                        }else{
                                request.body.pwd='************';
                                R.logger.error('No existe el usuario/password indicado:',body);
                                restApiUtil.sendResponse(response,R.constants.HTTP_UNAUTHORIZED, '', body,thisService);
                        }
                }, error=>{
                        R.logger.error("No se authentico el usuario:" + request.body.username + "->" + error);
                        restApiUtil.sendResponse(request.body,response,servicex,R.constants.HTTP_UNAUTHORIZED,error);
                })

        },errors=> {
                R.logger.error('No paso la validación de esquema', url);
                restApiUtil.sendResponse(request.body,response,thisService,R.constants.HTTP_BAD_REQUEST,error);     
                });
};
    

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