'use strict';
var R = require("../util/rest-api-requires");

/**
* Delete an existing index
*/
function deleteIndex(indexName) {  
    return R.elasticClient.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;

/**
* create the index
*/
function initIndex(indexName) {  
    return R.elasticClient.indices.create({
        index: indexName
    });
}
exports.initIndex = initIndex;

/**
* check if the index exists
*/
function indexExists(indexName) {  
    return R.elasticClient.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists;  

function initMapping(indexName, typeName, mapping) {  
    return R.elasticClient.indices.putMapping({
        index: indexName,
        type: typeName,
/*        body: {
            properties: {
                id: { type: "string" },
                nombre: { type: "string" },
                apellidop: { type: "string" },
                apellidom: { type: "string" },
                frase: { type: "string" },
                suggest: {
                    type: "completion",
                    analyzer: "simple",
                    search_analyzer: "simple",
                    payloads: true
                }
            }
        }*/
        body: mapping
    });
}
exports.initMapping = initMapping;


function add(indexName, typeName,uuid,obj) {  
    //R.logger.debug('add->' + indexName + "-->" + typeName + '-->' + obj);
    return R.elasticClient.index({
        index: indexName,
        type: typeName,
        id:uuid,
        body:obj
    });
}
exports.add = add;

function find(indexName, typeName,queryObj) {  
return R.elasticClient.msearch({
    index: indexName,
    type: typeName,
  body: [
    // match all query, on all indices and types
    {},queryObj
  ]
});
}
exports.find = find;

function findById(indexName,id) {
    var queryObj={"query": {"bool": {"must": [{"match": {"_id": id}}]}}};
return find(indexName,indexName,queryObj)
}

exports.findById = findById;

function deleteById(indexName, typeName, id) {
    var deferred = R.q.defer();
    R.elasticClient.delete({
        index: indexName,
        type: typeName,
        id:id
    }, function (error, resp) {
        if (error) {
            console.error('DeleteObject error - elastic:' + error);
            deferred.reject(error);
        }else{
        deferred.resolve({success:true, _id:id});
        }
    });
        return deferred.promise;
}

exports.deleteById = deleteById;

function getSuggestions(input) {  
    return R.elasticClient.suggest({
        index: indexName,
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
    })
}
exports.getSuggestions = getSuggestions;
