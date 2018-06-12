'use strict';
var R = require("../util/rest-api-requires");

/**
* Delete an existing index
*/
exports.deleteIndex= index => R.elasticClient.indices.delete({index: index});

/**
* create the index
*/
exports.initIndex = index =>R.elasticClient.indices.create({index});

/**
* check if the index exists
*/
exports.indexExists = index => R.elasticClient.indices.exists({index});

exports.initMapping = (index, type, mapping) => R.elasticClient.indices.putMapping({
        index,
        type,
        body: mapping});

exports.add = (index, uuid,body) => R.elasticClient.index({
        index,
        type:index,
        id:uuid,
        body
    });

let find = (index, queryObj,type) => R.elasticClient.msearch({
    index,
    type,
    body: [
    // match all query, on all indices and types
    {},queryObj
    ]
   });
exports.find=find;

exports.findById = (index,id) => {
    var queryObj={"query": {"bool": {"must": [{"match": {"_id": id}}]}}};
    return find(index,queryObj,index);
};

exports.deleteById = (index, type, id) => {
    let promise = new Promise((resolve, reject)=> {
        R.elasticClient.delete({index,type,id})
        .then(response=> {
           resolve();
        },error =>{
            reject(error);
        })
    });
    return promise;
};


exports.getSuggestions = (index,input) => R.elasticClient.suggest({
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
