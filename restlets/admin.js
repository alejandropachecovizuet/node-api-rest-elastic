'use strict';
/*
 xDocRestName:Admin
 * */
let R = require("../util/rest-api-requires");
let restApiUtil = require("../util/restApiUtil");
let appUtil = require('../util/appUtil');
let jsonvalidator = require('../controllers/jsonvalidator');
let elasticController = require("../controllers/elasticsearch");
let util = require('util');

let app = R.express();
let rest='admin',name='';

let router=restApiUtil.init(app);

router.route('/admin/_init/:projectId').post(function(request, response) { //xDoc-Desc:Servicio que inicaliza el proyecto:{"projectId":"projectId", "user": {"username":'x@x.com', "pwd":"123456"}}  xDoc-Response:200 OK 
        initProject(request, response);    
});
router.route('/admin/project/:projectId').delete(function(request, response) { //xDoc-Desc:Servicio que inicaliza el proyecto:{"projectId":"projectId", "user": {"username":'x@x.com', "pwd":"123456"}}  xDoc-Response:200 OK 
        deleteProject(request, response);    
});

router.route('/_stats').get( (request, response)=> restApiUtil.sendResponse(response,R.constants.HTTP_OK,{pid:process.pid, memory_usage: process.memoryUsage(), cpu_usage:process.cpuUsage(), args:process.argv},request.body,'stats')); /* xDoc-NoDoc */    

function initProject(request, response){
        const {method, url, body, params: {projectId}}=request;
        const thisService=`[${method}]${url}`;
        R.logger.trace('------------------------------>',body.user,'*******************', body ,'----->', request.headers);
        R.logger.debug("Admin-init service:", thisService);

        jsonvalidator.validateVsSchema("admin_init_schema",body).then(resultValidateSchema=>{
                let {projectDescription: description,user: {email, pwd }} = body;
                let phrase=R.jwtController.guid();
                let responseService={projectId:projectId};
                let bodyProject={
                        description,
                        plan:'initial',
                        phrase,
                        time_created:appUtil.getCurrentDateForElastic(),
                        user_created:email,                        
                };
                body.pwd='*******';
                elasticController.findById(R.constants.INDEX_PROJECT,projectId).then((resultFind) => {
                        if(resultFind.responses[0].hits==undefined || resultFind.responses[0].hits.total==0){
                                R.logger.debug('project adding', bodyProject);
                                elasticController.add(R.constants.INDEX_PROJECT,projectId ,bodyProject).then(() => { 
                                        R.logger.info(`project ${projectId} added `);
                                        let bodyRol={"role": "admin",
                                                     "restrictions":[{"restriction":"app.db.users.add"},
                                                                     {"restriction":"app.db.users.delete"},
                                                                     {"restriction":"app.db.users.update"},
                                                                     {"restriction":"app.db.users.search"},
                                                                     {"restriction":"app.db.roles.search"},
                                                                     {"restriction":"app.db.test.add"},
                                                                     {"restriction":"app.db.test.delete"},
                                                                     {"restriction":"app.db.test.update"},
                                                                     {"restriction":"app.db.test.search"},
                                                                     {"restriction":"app.db.testx.search"},
                                                                ],
                                                time_created:appUtil.getCurrentDateForElastic(),
                                                user_created:email,                        
                                              };
                                        elasticController.add(`${projectId}.${R.constants.INDEX_ROL}`,'admin' ,bodyRol).then(() => { 
                                                        let userBody={
                                                                projectId,
                                                                "status":1,
                                                                "pwd":R.jwtController.encrypt(pwd,phrase),
                                                                "roles":[{"rol":"admin"}],
                                                                time_created:appUtil.getCurrentDateForElastic(),
                                                                user_created:email,                        
                                                                };
                                                        elasticController.add(`${projectId}.${R.constants.INDEX_USER}`,email ,userBody).then(() => { 
                                                        R.logger.info(`User ${email} added `);
                                                        restApiUtil.sendResponse(response,R.constants.HTTP_OK, responseService, body,thisService);
                                                }, error => {
                                                        R.logger.error(`error during creation user-> ${email}`);
                                                        elasticController.deleteById(R.constants.INDEX_PROJECT, R.constants.INDEX_PROJECT ,projectId).then(() => { 
                                                                R.logger.info(`Project ${projectId} deleted `);
                                                                restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL, error, body,thisService);
                                                        }, error => {
                                                                restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL, error, body,thisService);
                                                        }); 
                                                });     
                                        },(error)=> restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL, error, body,thisService)
                                );//rol
                                
                                        }, error => {
                                        restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL, error, body,thisService);
                                    });                                                 
                        }else{
                                R.logger.error('Duplicated project', url);
                                restApiUtil.sendResponse(response, R.constants.HTTP_DUPLICATED, R.constants.ERROR_DUPLICATED_KEY, body,thisService,);
                        }
                });
                }, error=>{
                        R.logger.error('No paso la validación de esquema', url);
                        restApiUtil.sendResponse(response,R.constants.HTTP_BAD_REQUEST,error,body,thisService);     
                });
};
    
function deleteProject(request, response){
        const {method, url, body, params: {projectId}}=request;
        const thisService=`[${method}]${url}`;
        R.logger.info('DELETE PROJECT!!!!!',projectId);
        elasticController.deleteById(R.constants.INDEX_PROJECT, R.constants.INDEX_PROJECT ,projectId).then(() => { 
                R.logger.info(`Project ${projectId} deleted `);
                restApiUtil.sendResponse(response,R.constants.HTTP_OK, '', body,thisService);
        }, error => {
                restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL, error, body,thisService);
        }); 
}


let _PORT_=R.properties.get(rest+'.PORT');
restApiUtil.startService(rest,app, router ,_PORT_);