let R = require("../util/rest-api-requires");
let restApiUtil = require("../util/restApiUtil");
let fs = require('fs');
let appUtil = require('../util/appUtil');
let fileUtil = require('../util/fileUtil');
let database = require("./database");
const fileType = require('file-type');
const uuid = require('uuid/v1');

//let util = require('util');
                                     
exports.upload=(request, response, next)=>{
    return new Promise((resolve,reject)=>{    
        const {method, url, body: {scope=R.constants.SCOPE_GLOBAL}, params: {id}, headers}=request;
        const thisService=`[${method}]${url}`;
        const projectId=headers['x-projectid'];
        const testOptions=request.testOptions;
        R.logger.debug(thisService);

        //const id=scope.substr(0,1)+uuid();
        
        let startTime = new Date().getTime();
        restApiUtil.validateAll(['projectid_header','user_header','token_header','restriction','validate_token']    
                      ,request,{restriction:`app.db.stream.add`}).then(
                 ()=>{
                        let path=`/tmp/${projectId}/`
                        if (!fs.existsSync(path)){
                            fs.mkdirSync(path);
                        }
                        request.pipe(fs.createWriteStream(path+id));
                        request.on('end', ()=>{next();
                            resolve({response, httpCode:R.constants.HTTP_OK, bodyOut:{id}, bodyIn:'', service:thisService,startTime});
                        });                    
                        try { request.setSocketKeepAlive(true, 4000); } catch (error) {}
                        
                    },error=>{
                        R.logger.error('Error en las validaciones',error);
                        reject({response, httpCode:R.constants.HTTP_BAD_REQUEST, bodyOut:error, bodyIn:'', service:thisService,startTime}) }
                )
    });
};

exports.download=(request, response)=>{
    return new Promise((resolve,reject)=>{    
        const {method, url, params: {id, projectId}, headers}=request;
        const thisService=`[${method}]${url}`;
        const testOptions=request.testOptions;
        R.logger.debug(thisService);
        
        let startTime = new Date().getTime();
        restApiUtil.validateAll(['projectid_header','user_header','token_header','restriction','validate_token']    
                      ,request,{restriction:`app.db.stream.add`}).then(
                 ()=>{
                     downloadPublic(request, response)
                     .then(result =>resolve(result)
                    ,error=>reject(error));
                    },error=>{
                        R.logger.error('Error en las validaciones',error);
                        reject({response, httpCode:R.constants.HTTP_BAD_REQUEST, bodyOut:error, bodyIn:'', service:thisService,startTime}) }
                )
    });
};

let downloadPublic=(request, response)=>{
    const {params: {projectId, id}}=request;
    const path = `/tmp/${projectId}/${id}`
    let head={};
    try {
        const fileSize = fs.statSync(path).size;
        const range = request.headers.range
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-")
            const start = parseInt(parts[0], 10)
            const end = parts[1] 
              ? parseInt(parts[1], 10)
              : fileSize-1
            const chunksize = (end-start)+1
            const file = fs.createReadStream(path, {start, end})
            head = {
              'Content-Range': `bytes ${start}-${end}/${fileSize}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunksize,
              'Content-Type': 'video/mp4',
            }
            response.writeHead(206, head);
            file.pipe(response);
          } else {
            head = {
              'Content-Length': fileSize,
              'Content-Type': 'video/mp4', 
            }
            response.writeHead(200, head);
            fs.createReadStream(path).pipe(response);
          }
              
    } catch (error) {
        response.status(404);
    }

    };
exports.downloadPublic=downloadPublic;

    