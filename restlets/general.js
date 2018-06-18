'use strict';
/*
 xDocRestName:General
 * */
let R = require("../util/rest-api-requires");
let restApiUtil = require("../util/restApiUtil");
let database = require("../controllers/database");
let jsonvalidator = require('../controllers/jsonvalidator');
let appUtil = require('../util/appUtil');
let app = R.express();
let rest='general';
let changes={}
let indexes=['roles'];
let pingResponse='pong';

let router=restApiUtil.init(app);


function initChangesControl(){
    if(JSON.stringify(changes)==='{}'){
       for(let i=0; i<indexes.length; i++){
          changes[indexes[i]]='20160101T000000Z';
       }
    }
}
function updateChangesControl(index){
    initChangesControl();
    if(changes[index]!=null){
        changes[index]=appUtil.getCurrentDateForElastic();
        R.logger.debug('apply changes',index,changes[index]);
    }
}

function add_dummy(request, response){
    const {method, url, body, params: {index, id}, headers}=request;
    const thisService=`[${method}]${url}`;
    const projectId=headers['x-projectid'];
    let startTime = new Date().getTime();
    R.logger.debug(thisService);
    database.find(projectId,index ,{}).then(
        result=>{
                     R.logger.info('OOOOOOKKKKKK', result);
                     restApiUtil.sendResponse(response, R.constants.HTTP_OK, result, request.body,thisService,startTime);
                    },error=>restApiUtil.sendResponse(response, R.constants.HTTP_NOT_FOUND, error, request.body,thisService,startTime));
                }


function add(request, response){
    const {method, url, body, params: {index, id}, headers}=request;
    const thisService=`[${method}]${url}`;
    const projectId=headers['x-projectid'];
    
    let startTime = new Date().getTime();
    R.logger.debug(thisService);

    restApiUtil.validateAll(['projectid_header','user_header','token_header','restriction','schema','validate_token']
                ,request,{schema:index,restriction:`app.db.${request.params.index}.add`}).then(
             ()=>database.findById(projectId, index,id).then(
                    resultFind=>{
                        R.logger.debug('Record found!!!');
                        if(resultFind.total==0){
                            body["time_created"]=appUtil.getCurrentDateForElastic();
                            body["user_created"]=request.headers['x-user'];
                            database.add(projectId,index,id,body).then(resultAdd => { 
                                                updateChangesControl(index);
                                                restApiUtil.sendResponse(response,R.constants.HTTP_OK, resultAdd, request.body,thisService,startTime);
                                            }, error => {
                                                restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL, error, request.body,thisService,startTime);
                                            }); 
                        }else{
                            R.logger.error('Duplicated key', url);
                            restApiUtil.sendResponse(response, R.constants.HTTP_DUPLICATED, R.constants.ERROR_DUPLICATED_KEY, body,thisService,startTime);
                        }
                    },error=>restApiUtil.sendResponse(response, R.constants.HTTP_NOT_FOUND, error, request.body,thisService,startTime))
                ,({httpcode,error}=errorValidate)=> restApiUtil.sendResponse(response,httpcode, error , body ,thisService,startTime)
        )};

function findById(request, response){
    const {method, url, body, params: {index, id}, headers}=request;
    const thisService=`[${method}]${url}`;
    const projectId=headers['x-projectid'];
    
    let startTime = new Date().getTime();
    R.logger.debug(thisService);

    restApiUtil.validateAll(['projectid_header','user_header','token_header','restriction','validate_token']
                ,request,{restriction:`app.db.${request.params.index}.search`}).then(
            ()=>database.findById(projectId, index,id).then(result =>restApiUtil.sendResponse(response,R.constants.HTTP_OK,result,body,thisService,startTime)
            ,error=>{
                    R.logger.fatal(`No es posible realizar la búsqueda del id[${id}]`, error);
                    restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL,error,body,thisService,startTime);
                    })
                ,({httpcode,error}=errorValidate)=> restApiUtil.sendResponse(response,httpcode, error , body ,thisService,startTime)
        )};

function find(request, response){
    const {method, url, body, params: {index, id}, headers}=request;
    const thisService=`[${method}]${url}`;
    const projectId=headers['x-projectid'];
    
    let startTime = new Date().getTime();
    R.logger.debug(thisService);

    restApiUtil.validateAll(['projectid_header','user_header','token_header','restriction','validate_token']
                ,request,{restriction:`app.db.${request.params.index}.search`}).then(
            ()=>database.find(projectId,index,body,index).then(result=>restApiUtil.sendResponse(response,R.constants.HTTP_OK,result,body,thisService, startTime)
            ,error =>{
                    R.logger.fatal(`No es posible realizar la búsqueda:`,error);
                    restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL,error,body,thisService,startTime);
                })
                ,({httpcode,error}=errorValidate)=> restApiUtil.sendResponse(response,httpcode, error , body ,thisService,startTime)
        )};
   
function update(request, response){
    const {method, url, body, params: {index, id}, headers}=request;
    const thisService=`[${method}]${url}`;
    const projectId=headers['x-projectid'];
    
    let startTime = new Date().getTime();
    R.logger.debug(thisService);

    restApiUtil.validateAll(['projectid_header','user_header','token_header','schema','restriction','validate_token']
                ,request,{schema:index,restriction:`app.db.${request.params.index}.update`}).then(
            ()=>database.findById(projectId,index ,id).then(
                    resultFind=>{
                        R.logger.debug('Record found!!!');
                        if(resultFind.total==1){
                            let data = resultFind.records[0];
                            body["time_updated"]=appUtil.getCurrentDateForElastic();
                            body["user_updated"]=request.headers['x-user'];
                            body["time_created"]=data.time_created;
                            body["user_created"]=data.user_created;
                                database.update(projectId, index,id,body).then(resultAdd => { 
                                                updateChangesControl(index);
                                                restApiUtil.sendResponse(response,R.constants.HTTP_OK, resultAdd, request.body,thisService,startTime);
                                            }, error => {
                                                restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL, error, request.body,thisService,startTime);
                                            }); 
                        }else{
                            R.logger.error('Recdord not found', url);
                            restApiUtil.sendResponse(response, R.constants.HTTP_NOT_FOUND, R.constants.ERROR_NOT_FOUND, body,thisService,startTime);
                            }
                    },error=>restApiUtil.sendResponse(response, R.constants.HTTP_NOT_FOUND, error, request.body,thisService,startService, startTime))
                ,({httpcode,error}=errorValidate)=> restApiUtil.sendResponse(response,httpcode, error , body ,thisService,startTime)
        )
};

function deleteById(request, response){
    const {method, url, body, params: {index, id}, headers}=request;
    const thisService=`[${method}]${url}`;
    const projectId=headers['x-projectid'];
    
    let startTime = new Date().getTime();
    R.logger.debug(thisService);

    restApiUtil.validateAll(['projectid_header','user_header','token_header','restriction','validate_token']
                ,request,{restriction:`app.db.${request.params.index}.delete`}).then(
            ()=>database.findById(projectId, index ,id).then(
                    resultFind=>{
                        R.logger.debug('Record found!!!');
                        if(resultFind.total==1){
                            database.deleteById(projectId, index, index,id).then(result=>restApiUtil.sendResponse(response,R.constants.HTTP_OK,'',body,thisService,startTime)
                            ,errordelete=>{
                                  R.logger.error('No fue posible borrar el registro['+index+']['+id+']:',errordelete.message);
                                  if(errordelete.message==='Not Found'){
                                    restApiUtil.sendResponse(response, R.constants.HTTP_NOT_FOUND, error, request.body,thisService,startService,startTime);
                                }else{
                                    restApiUtil.sendResponse(response,R.constants.HTTP_INTERNAL,errordelete,body,thisService,startTime);
                                }
                            });
                        }else{
                            R.logger.error('Recdord not found', url);
                            restApiUtil.sendResponse(response, R.constants.HTTP_NOT_FOUND, R.constants.ERROR_NOT_FOUND, body,thisService,startTime);
                            }
                    },error=>restApiUtil.sendResponse(response, R.constants.HTTP_NOT_FOUND, error, request.body,thisService,startTime))
                ,({httpcode,error}=errorValidate)=>restApiUtil.sendResponse(response,httpcode, error , body ,thisService,startTime))
};


router.route('/_stats').get( (request, response)=> restApiUtil.stats(request,response)); /* xDoc-NoDoc */    

router.route('/:index/:id').put(function(request, response) { //xDoc-Desc:Agrega un registro en el indice <b>:index</b>  y el id <b>:id</b> xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token xDoc-JSON-Example: {"cve": "1","description":"Activo"}
    add(request,response);
});

router.route('/:index/:id/dummy').put(function(request, response) { //xDoc-Desc:Agrega un registro en el indice <b>:index</b>  y el id <b>:id</b> xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token xDoc-JSON-Example: {"cve": "1","description":"Activo"}
    add_dummy(request,response);
});

router.route('/:index/_search').post(function(request, response) { //xDoc-Desc:Busca todos los registros en el indice <b>:index</b> que cumplan con el query xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token xDoc-JSON-Example:{"query": {"match_all": {}}}
    find(request,response);
});

router.route('/:index/_searchById/:id').get(function(request, response) { //xDoc-Desc:Busca el registro <b>:id</b> en el indice <b>:index</b> xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token
    findById(request,response);
});

router.route('/:index/:id/_update').put(function(request, response) { //xDoc-Desc:Actualiza el registro indicado en <b>:id(_id de elasticsearch)</b> del catalogo <b>:index</b> xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token xDoc-JSON-Example:<b>NO_BODY</b> 
    update(request,response);
});

router.route('/:index/:id').delete(function(request, response) { //xDoc-Desc:Borra el registro indicado en <b>:id(_id de elasticsearch)</b> del catalogo <b>:index</b> xDoc-Header:<b>x-access-token</b>=Token xDoc-Header:<b>ux</b>=Usuario con el que se creó el Token xDoc-JSON-Example:<b>NO_BODY</b> 
    deleteById(request,response);
});

router.route('/changes').get(function(request, response) { //xDoc-Desc:Regresa la fecha última en que fuerón actualizados los catalogos
    let startTime = new Date().getTime();
    initChangesControl();
    restApiUtil.sendResponse(response,R.constants.HTTP_OK,changes,request.body,'/changes',startTime);
});

router.route('/ping').get(function(request, response) { /* xDoc-NoDoc */
		     if(pingResponse=='pong'){
                response.status(200).send(pingResponse);
				 }else{
                response.status(409).send(pingResponse);
				 }
});

router.route('/fail').get(function(request, response) {/* xDoc-NoDoc */
		     pingResponse='pong...pong...pong...pong...';
             response.status(200).send('fallando .....');
});
router.route('/fix').get(function(request, response) {/* xDoc-NoDoc */
		     pingResponse='pong';
             response.status(200).send('[bitacora]corregido!!!!!!!!!!!!!!!');
});

let _PORT_=R.properties.get(rest+'.PORT');
restApiUtil.startService(rest,app, router ,_PORT_);
