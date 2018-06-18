let R = require('../util/rest-api-requires');
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

exports.add = (projectId,index, uuid,body) => getInstance().add(projectId,index, uuid, body);
exports.update = (projectId,index, uuid,body) => getInstance().update(projectId,index, uuid, body);
exports.find= (projectId,index, queryObj,type)=> getInstance().find(projectId,index, queryObj,type);
exports.findById = (projectId,index,id) => getInstance().findById(projectId,index,id);
exports.deleteById = (projectId,index, type, id) => getInstance().deleteById(projectId,index, type, id); 
