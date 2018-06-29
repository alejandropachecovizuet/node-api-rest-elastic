let R = require("../util/rest-api-requires");
let restApiUtil = require("../util/restApiUtil");
let sleep = require('thread-sleep');
let appUtil = require('../util/appUtil');
let database = require("../controllers/database");
const uuid = require('uuid/v1');
let transactions=[];
let lastSend=undefined;

exports.addAync= (request, response, httpCode, bodyOut ,timeResponse )=>{
        const {method, url}=request;
        const remoteIp = request.headers["X-Forwarded-For"] || request.headers["x-forwarded-for"] || request.client.remoteAddress;
        const apiKey = restApiUtil.getHeaderParamOBody(request,R.constants.HEADER_API_KEY);
       // const email= restApiUtil.getHeaderParamOBody(request,R.constants.HEADER_USER);
       const email='test';
        const projectId= restApiUtil.getHeaderParamOBody(request,R.constants.HEADER_PROJECTID);
        R.logger.info('--->>>>>>', projectId);
        let error=httpCode===R.constants.HTTP_OK?undefined:bodyOut;
        const date=appUtil.getCurrentDateForElastic();
        const records=2*R.properties.get('app.cache.transactions.save.records');
        const seconds=R.properties.get('app.cache.transactions.save.time');
        const contentLengthIn = request.headers['content-length'];
        console.info('Save transaction for',projectId, typeof(error), '-->' ,error);
        if(typeof(error)==='string'){
            error={error};
        }else if(typeof(error)==='number'){
            error={error:`${error}`};
        }
        let transaction={date, projectId, apiKey, email, url:`[${method}]${url}`, remoteIp, httpCode, timeResponse, error, contentLengthIn };

        transactions.push({index: {_index: `general.${projectId}.${R.constants.INDEX_TRANSACTIONS}`, _type: `${projectId}.${R.constants.INDEX_TRANSACTIONS}`, _id: uuid()}},transaction);
        //transactions.push(transaction);
        if(lastSend===undefined){
            lastSend=new Date().getTime();
        }
        R.logger.info('------>', transactions.length, '---->', new Date().getTime() - lastSend, seconds*1000    );
        if(transactions.length===records | new Date().getTime() - lastSend > seconds*1000){
            let clone= transactions.slice(0);
            transactions.length=0;
            database.addAll(clone,R.constants.INDEX_TRANSACTIONS)
            .then(result => R.logger.info('all transactions saved', `general.${projectId}.${R.constants.INDEX_TRANSACTIONS}`, transaction)
               ,error=>{R.logger.fatal('No se guardo la bitacora', error);
            });
//            sleep(10000);
            lastSend=undefined;
        }
    };