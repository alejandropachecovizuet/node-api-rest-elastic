let R = require('../util/rest-api-requires');
let appUtil = require('../util/appUtil');
let database=undefined;

let getInstance= ()=>{
    if(database===undefined){
        let databaseProp = R.properties.get('app.database.use');
        R.logger.info('DATABASE', databaseProp);
        if(database===undefined){
            switch (databaseProp) {
                case 'elastic':
                    database= require("./db/elasticsearch");
                    break;
                case 'mongo':
                    database= require("./db/mongo");
                     break;
                default:
                    database= require("./db/elasticsearch");
                break;
            } 
        }
    }
    return database;   
};

exports.add = (projectId,index, uuid,body,testOptions) => {
    let errorDummy = appUtil.getErrorDummy(testOptions,`err_db_add_${index}`);
    if(errorDummy===undefined){
       return getInstance().add(projectId,index, uuid,body);
    }else {
        R.logger.info('**Returning error dummy->',errorDummy);
        return appUtil.sendTestError(errorDummy);
    }
}

exports.update = (projectId,index, uuid,body,testOptions) =>{
    let errorDummy = appUtil.getErrorDummy(testOptions,`err_db_update_${index}`);
    if(errorDummy===undefined){
       return getInstance().update(projectId,index, uuid, body);
    }else {
        R.logger.info('**Returning error dummy->',errorDummy);
        return appUtil.sendTestError(errorDummy);
    }
}

exports.find= (projectId,index, queryObj,type,testOptions)=> {
    let errorDummy = appUtil.getErrorDummy(testOptions,`err_db_find_${index}`);
    if(errorDummy===undefined){
       return getInstance().find(projectId,index, queryObj,type);
    }else {
        R.logger.info('**Returning error dummy->',errorDummy);
        return appUtil.sendTestError(errorDummy);
    }
}
exports.findById = (projectId,index,id,testOptions) => {
    let errorDummy = appUtil.getErrorDummy(testOptions,`err_db_findById_${index}`);
    if(errorDummy===undefined){
       return getInstance().findById(projectId,index,id);
    }else {
        R.logger.info('**Returning error dummy->',errorDummy);
        return appUtil.sendTestError(errorDummy);
    }
}
exports.deleteById = (projectId,index, type, id,testOptions) => {
    let errorDummy = appUtil.getErrorDummy(testOptions,`err_db_delete_${index}`);
    if(errorDummy===undefined){
       return getInstance().deleteById(projectId,index, type, id); 
    }else {
        R.logger.info('**Returning error dummy->',errorDummy);
        return appUtil.sendTestError(errorDummy);
    }
}

