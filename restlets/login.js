'use strict';
/*
 xDocRestName:Login
 * */
let R = require("../util/rest-api-requires");
let restApiUtil = require("../util/restApiUtil");
let jsonvalidator = require('../controllers/jsonvalidator');
let elasticController = require("../controllers/elasticsearch");
let util = require('util');

let app = R.express();
let rest='login',name='';

let router=restApiUtil.init(app);

router.route('/authenticate').post(function(request, response) { //xDoc-Desc:Authenticación del usuario xDoc-JSON-Example:{"username":"luisXV", "pwd":"123456"}  xDoc-Response:Usuario + Token 
        authenticate(request, response);    
});

router.route('/_stats').get( (request, response)=> restApiUtil.sendResponse(response,R.constants.HTTP_OK,{pid:process.pid, memory_usage: process.memoryUsage(), cpu_usage:process.cpuUsage(), args:process.argv},request.body,'stats')); /* xDoc-NoDoc */    

function authenticate(request, response){
        const {method, url, body, body :{username, pwd}}=request;
        const thisService=`[${method}]${url}`;
        
        R.logger.debug("Authenticate service:", thisService);

        jsonvalidator.validateVsSchema("authenticate_schema",body).then(resultValidateSchema=>{
                let queryObj={"query": {"bool": {"must": [{"match": {"_id": username}},{ "match": { "pwd":  pwd }}]}}};    
                elasticController.find('app_user',queryObj).then(result=>{
                        if(result.responses[0].hits.total > 0){
                                R.logger.debug(`Se autentico el usuario ${username} correctamente!!!`);
                                let resx=result.responses[0].hits.hits[0];
                                resx.token=R.jwtController.sign(resx).token;
                                restApiUtil.sendResponse(response,R.constants.HTTP_OK,'', body, thisService,resx.token);
                        }else{
                                request.body.pwd='************';
                                R.logger.error('No existe el usuario/password indicado:',body);
                                restApiUtil.sendResponse(response,R.constants.HTTP_UNAUTHORIZED, '', body,thisService);
                        }
                }, error=>{
                        R.logger.error("No se authentico el usuario:" + request.body.username + "->" + error);
                        restApiUtil.sendResponse(response,R.constants.HTTP_UNAUTHORIZED, error, body,thisService);
                        })

        },errors=> {
                R.logger.error('No paso la validación de esquema', url);
                restApiUtil.sendResponse(response,R.constants.HTTP_BAD_REQUEST,errors,body,thisService);     
                });
};
    


let _PORT_=R.properties.get(rest+'.PORT');
restApiUtil.startService(rest,app, router ,_PORT_);