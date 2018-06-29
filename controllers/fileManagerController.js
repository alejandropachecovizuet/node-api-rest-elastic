let R = require("../util/rest-api-requires");
let restApiUtil = require("../util/restApiUtil");
let fs = require('fs');
let appUtil = require('../util/appUtil');
let fileUtil = require('../util/fileUtil');
let database = require("./database");
const fileType = require('file-type');
const uuid = require('uuid/v1');

//let util = require('util');
                                     
exports.add=(request, response)=>{
    return new Promise((resolve,reject)=>{    
        const {method, url, body, body: {file, name, scope=R.constants.SCOPE_GLOBAL}, headers}=request;
        const contentType=undefined;
        const thisService=`[${method}]${url}`;
        const projectId=headers[R.constants.HEADER_PROJECTID];
        const testOptions=request.testOptions;
        R.logger.debug(thisService);

        const id=scope.substr(0,1)+uuid();
        
        let startTime = new Date().getTime();
        restApiUtil.validateAll(['projectid_header','user_header','token_header','restriction','schema','validate_token']    
                      ,request,{schema:'file_manager_schema',restriction:`app.db.files.add`}).then(
                 ()=>{
                    body["time_created"]=appUtil.getCurrentDateForElastic();
                    body["user_created"]=request.headers[R.constants.HEADER_USER];
                    extractFile(body,testOptions)
                        .then(result=>{
                            //R.logger.info('-------------->', result);
                            body["file"]= result.file;
                            body["fileType"]= result.fileType;        
                            body["files"]= result.files;     
                            let unzip_ids=undefined;
                            if(result.files!=undefined){
                                unzip_ids=[];
                                for (var i = 0; i < result.files.length; i++) {
                                        R.logger.debug('Addd->', result.files[i].uuid);
                                        unzip_ids.push(result.files[i].uuid);
                                    }
                                  }
                            database.add(projectId,R.constants.INDEX_FILES,id,body,testOptions).then(resultAdd => {
                                                let warning=result.warning; 
                                                resolve({response, httpCode:R.constants.HTTP_OK, bodyOut:{id, unzip_ids, warning}, bodyIn:'', service:thisService,startTime});
                                            }, error => 
                                            reject({response, httpCode:R.constants.HTTP_INTERNAL, bodyOut:error, bodyIn:'', service:thisService,startTime})
                                            )
                            }) 
                    },error=>{
                        R.logger.error('Error en las validaciones',error);
                        reject({response, httpCode:R.constants.HTTP_BAD_REQUEST, bodyOut:error, bodyIn:'', service:thisService,startTime}) }
                )
    });
};

exports.findById=(request, response)=>{
    return new Promise((resolve,reject)=>{    
        const {method, url, body, params: {id}, headers}=request;
        const thisService=`[${method}]${url}`;
        const testOptions=request.testOptions;
        
        let startTime = new Date().getTime();
        R.logger.debug(thisService);
    
        restApiUtil.validateAll(['user_header','token_header','restriction','validate_token']
                    ,request,{restriction:`app.db.files.search`}).then(
                ()=>findByIdGlobal(request,response)
                    .then(result =>resolve(result)
                    ,error=>reject(error))
                ,error=> reject({response, httpCode:error.httpcode, bodyOut:error.error, bodyIn:body, service:thisService,startTime})
            )
        });
    };
    
let findByIdGlobal=(request, response)=>{
    const {method, url, body, params: {id, subId, projectId}, headers}=request;
    const thisService=`[${method}]${url}`;
    const testOptions=request.testOptions;

    let startTime = new Date().getTime();
    R.logger.debug(thisService);
    return new Promise((resolve,reject)=>    
        database.findById(projectId, R.constants.INDEX_FILES,id,testOptions).then(result =>{
        if(!appUtil.isJsonEmpty(result)){
            //R.logger.info('result:',result);
            if(subId===undefined || result.files=== undefined){
                R.logger.info('-------------------------------->', subId);
                resolve({response, httpCode:R.constants.HTTP_OK, bodyOut:result, bodyIn:body, service:thisService,startTime});
            }else{
                //console.info('**********************************************',result.files);
                let arr=result.files;
                //let arrResult=[];
                let obj=undefined;
                for (var i = 0; i < arr.length; i++) {
                    if(arr[i].uuid==subId){
                        R.logger.info('found->', arr[i].uuid);
                        obj=arr[i];
                        }
                  }
                resolve({response, httpCode:R.constants.HTTP_OK, bodyOut:obj, bodyIn:body, service:thisService,startTime});                
            }
        }else{
            reject({response, httpCode: R.constants.HTTP_NOT_FOUND, bodyOut:R.constants.HTTP_NOT_FOUND, bodyIn:body, service:thisService,startTime});                        
        }
    },error=>{
            R.logger.fatal(`No es posible realizar la búsqueda del id[${id}]`, error);
            reject({response, httpCode:R.constants.HTTP_INTERNAL, bodyOut:error, bodyIn:body, service:thisService,startTime});
    }))};
exports.findByIdGlobal=findByIdGlobal;    

let extractFile=(body,testOptions)=>new Promise((resolve, reject)=>{
    if(body.unzipFormat===undefined){
        resolve({file:body.file, fileType});        
    }else{
        R.logger.info('extract file:', body.name)
        const data=Buffer.from(body.file, 'base64');
        const fileTypeFile= fileType(data);
        const prefix=fileTypeFile===null?'':`data:${fileTypeFile.mime};base64,`;
        let x='';
        if(appUtil.getErrorDummy(testOptions,'err_extract_file')!=undefined){
            x='fail';
        }

        const fileTmp=`/tmp/${uuid()}.${x}${body.unzipFormat}`;
        R.logger.info(fileTmp);
        fs.writeFileSync(fileTmp,data, err=>{});
        R.logger.info('Se descomprime el archivo porque viene en zip');
        fileUtil.extractAndObtainB64(fileTmp).then(list=>{
            if(list.length===1){
                resolve({file:list[0].file});
            }else{
                resolve({files:list});                
            }
            },error=>resolve({file:`${prefix}${body.file}`, warning:'It is not possible to unzip the file, but the original file was saved'}));	
    }
});


exports.deleteById=(request, response)=>{
    return new Promise((resolve,reject)=>{    
        const {method, url, body, params: {id}, headers}=request;
        const thisService=`[${method}]${url}`;
        const projectId=headers[R.constants.HEADER_PROJECTID];
        const testOptions=request.testOptions;
        const index='files';
        
        let startTime = new Date().getTime();
        R.logger.debug(thisService);
    
        restApiUtil.validateAll(['projectid_header','user_header','token_header','restriction','validate_token']
                    ,request,{restriction:'app.db.files.delete'}).then(
                ()=>database.findById(projectId, index ,id,testOptions).then(
                        resultFind=>{
                            R.logger.debug('Record found!!!');
                            if(!appUtil.isJsonEmpty(resultFind)){
                                database.deleteById(projectId, index, index,id,testOptions).then(result=>resolve({response, httpCode:R.constants.HTTP_OK, bodyOut:result, bodyIn:body, service:thisService,startTime})
                                ,error=>{
                                      R.logger.error('No fue posible borrar el registro['+index+']['+id+']:',error.message);
                                      if(error.message==='Not Found'){
                                        reject({response, httpCode:R.constants.HTTP_NOT_FOUND, bodyOut:error, bodyIn:body, service:thisService,startTime});
                                    }else{
                                        reject({response, httpCode:R.constants.HTTP_INTERNAL, bodyOut:error, bodyIn:body, service:thisService,startTime});
                                    }
                                });
                            }else{
                                R.logger.error('Recdord not found', url);
                                reject({response, httpCode:R.constants.HTTP_NOT_FOUND, bodyOut:R.constants.ERROR_NOT_FOUND, bodyIn:body, service:thisService,startTime});
                                }
                        },error=>reject({response, httpCode:R.constants.HTTP_NOT_FOUND, bodyOut:error, bodyIn:body, service:thisService,startTime})
                    ),error=>reject({response, httpCode:error.httpcode, bodyOut:error.error, bodyIn:body, service:thisService,startTime})
                )
        });
    };
    