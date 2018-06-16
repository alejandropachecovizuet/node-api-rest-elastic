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

router.route('/project/:projectId/_init').post(function(request, response) { //xDoc-Desc:Servicio que inicaliza el proyecto:{"projectId":"projectId", "user": {"username":'x@x.com', "pwd":"123456"}}  xDoc-Response:200 OK 
        initProject(request, response);    
});
router.route('/project/:projectId').delete(function(request, response) { //xDoc-Desc:Servicio que inicaliza el proyecto:{"projectId":"projectId", "user": {"username":'x@x.com', "pwd":"123456"}}  xDoc-Response:200 OK 
        deleteProject(request, response);    
});

router.route('/_stats').get( (request, response)=> restApiUtil.stats(request,response)); /* xDoc-NoDoc */    

function initProject(request, response){
        const {method, url, body, params: {projectId}, headers}=request;
        const {projectDescription: description,user: {email, pwd }} = body;
        const phrase=R.jwtController.guid();
        const thisService=`[${method}]${url}`;
        
        let startTime = new Date().getTime();
        R.logger.debug(thisService);
    
        restApiUtil.validateAll(['schema'],request,{schema:'admin_init_schema'}).then(
                ()=>elasticController.findById(R.constants.INDEX_PROJECT ,projectId).then(
                        result=>{
                            R.logger.debug('Record found!!!');
                            if(result.responses[0].hits==undefined || result.responses[0].hits.total==0){
                                let bodyProject={
                                        description,
                                        plan:'initial',
                                        phrase,
                                        time_created:appUtil.getCurrentDateForElastic(),
                                        user_created:email,                        
                                };
                                elasticController.add(R.constants.INDEX_PROJECT,projectId ,bodyProject).then(
                                        () => { 
                                        R.logger.info(`project ${projectId} added `);
                                        let bodyRol={"role": "admin",
                                                     "restrictions":[{"restriction":"app.db.users.add"},
                                                                     {"restriction":"app.db.users.delete"},
                                                                     {"restriction":"app.db.users.update"},
                                                                     {"restriction":"app.db.users.search"},
                                                                     {"restriction":"app.db.roles.add"},
                                                                     {"restriction":"app.db.roles.delete"},
                                                                     {"restriction":"app.db.roles.update"},
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
                                        elasticController.add(`${projectId}.${R.constants.INDEX_ROL}`,'admin' ,bodyRol).then(
                                                () => { 
                                                let userBody={
                                                        projectId,
                                                        "status":1,
                                                        "pwd":R.jwtController.encrypt(pwd,phrase),
                                                        "roles":[{"rol":"admin"}],
                                                        time_created:appUtil.getCurrentDateForElastic(),
                                                        user_created:email,                        
                                                        };
                                                elasticController.add(`${projectId}.${R.constants.INDEX_USER}`,email ,userBody).then(
                                                        (result) => { 
                                                                R.logger.info(`User ${email} added `);
                                                                restApiUtil.sendResponse(response,R.constants.HTTP_OK, result, body,thisService, startTime);
                                                        }, 
                                                        error => { 
                                                                R.logger.error('Error inserting user', error);
                                                                //ROLLBACK
                                                                deleteUser(`${projectId}.${R.constants.INDEX_USER}`,email);
                                                        });     
                                        },(error)=>{
                                                R.logger.error('Error inserting rol', error);
                                                //ROLLBACK
                                                deleteRol('admin');
                                                } 
                                        );//rol
                                
                                 }, error => restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL, error, body,thisService,startTime));                                                 
                        }else{
                                R.logger.error('Duplicated project', url);
                                restApiUtil.sendResponse(response, R.constants.HTTP_DUPLICATED, R.constants.ERROR_DUPLICATED_KEY, body,thisService,startTime);
                        }
                }, error => {
                        R.logger.debug('Error finding project', error);
                        restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL, error, body,thisService, startTime)})                                                 
                ,({httpcode,error}=errorValidate)=> restApiUtil.sendResponse(response,httpcode, error , body ,thisService,startTime)
        )
};
                             
                        
function deleteProject(request, response){
        let startTime = new Date().getTime();
        const {method, url, body, params: {projectId}}=request;
        const thisService=`[${method}]${url}`;
        R.logger.info('DELETE PROJECT!!!!!',projectId);
        elasticController.deleteById(R.constants.INDEX_PROJECT, R.constants.INDEX_PROJECT ,projectId).then(() => { 
                R.logger.info(`Project ${projectId} deleted `);
                restApiUtil.sendResponse(response,R.constants.HTTP_OK, '', body,thisService,startTime);
        }, error => {
                restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL, error, body,thisService, startTime);
        }); 
}

function deleteRol(id){
        elasticController.deleteById(R.constants.INDEX_ROL, R.constants.INDEX_ROL ,id).then(() => { 
                R.logger.info(`Rol ${id} deleted `);
        }, error => R.logger.error('Error, dont delete rol:',id))}; 

function deleteUser(index,id){
        elasticController.deleteById(index, index ,id).then(() => { 
                R.logger.info(`User ${id} deleted `);
        }, error => R.logger.error('Error, dont delete user:',id))}; 
        



let _PORT_=R.properties.get(rest+'.PORT');
restApiUtil.startService(rest,app, router ,_PORT_);