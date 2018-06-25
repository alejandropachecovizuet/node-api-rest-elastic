'use strict';
let R = require("../../util/rest-api-requires");

let elasticsearch= require("elasticsearch");
let elasticClient=undefined;

let getInstance= ()=>{
        if(elasticClient===undefined){
            R.logger.info('************ CREATING A CLIENT INSTANCE OF ELASTIC SEARCH ************')
            elasticClient=new elasticsearch.Client({  
                host: R.properties.get('app.elasticsearch.host'),
                log: R.properties.get('app.elasticsearch.log')
            //    plugins:[deleteByQuery]
            });
        }
        return elasticClient;
    };

/**
* Delete an existing index
*/
//exports.deleteIndex= index => getInstance().indices.delete({index: index});

/**
* create the index
*/
//exports.initIndex = index =>getInstance().indices.create({index});

/**
* check if the index exists
*/
//exports.indexExists = index => getInstance().indices.exists({index});

/*exports.initMapping = (index, type, mapping) => getInstance().indices.putMapping({
        index,
        type,
        body: mapping});
*/
let add = (projectId,index, uuid,body) => {
    //R.logger.debug('ADD->',projectId,index, uuid,body);
    return getInstance().index({
        index:`${projectId}.${index}`,
        type:index,
        id:uuid,
        body
    })};
exports.add = add;

exports.update = (projectId,index, uuid,body) => add(projectId,index, uuid,body);
    
let find = (projectId,index, queryObj,type) => new Promise((resolve, reject)=> getInstance().msearch({
        index:`${projectId}.${index}`,
        type,
        body: [
        // match all query, on all indices and types
        {},queryObj
        ]
    }).then(result=> {
        //R.logger.info(projectId+'.'+index, 'TRAAAAAXAAA',result);
        let total=0;
        let records = [];
        if( result.responses[0].hits!=undefined){
            total=result.responses[0].hits.total
            let array = result.responses[0].hits.hits;
            array.forEach(function (value) {
                records.push(value._source);
              });
            }
            //R.logger.info('RESULTTT:',{total, records});
            resolve({total, records})        
        }
    ,error=> reject(error)));

exports.find=find;

exports.findById = (projectId,index,id) => find(projectId,index,{"query": {"bool": {"must": [{"match": {"_id": id}}]}}},index,);

exports.deleteById = (projectId,index, type, id) => {
    let promise = new Promise((resolve, reject)=> {
        getInstance().delete({index:`${projectId}.${index}`,type,id})
        .then(response=> {
           resolve();
        },error =>{
            reject(error);
        })
    });
    return promise;
};


exports.getSuggestions = (index,input) => getInstance().suggest({
        index: index,
        type: "document",
        body: {
            docsuggest: {
                text: input,
                completion: {
                    field: "suggest",
                    fuzzy: true
                }
            }
        }
    });