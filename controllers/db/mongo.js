'use strict';
let R = require("../../util/rest-api-requires");

let MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

exports.add = (projectId,index, uuid,body) => new Promise((resolve, reject)=>{
        MongoClient.connect(url,(err, client)=>{
            body['_id']=uuid;
            client.db(projectId).collection(index).insertOne(body,(err, result)=> err===null?resolve(result):reject(err));
            });
          });     

exports.update = (projectId,index, uuid,body) => new Promise((resolve, reject)=>{
 MongoClient.connect(url,(err, client)=>{
    body['_id']=uuid;
    client.db(projectId).collection(index).updateOne({'_id':uuid},{ $set:body },(err, result)=> err===null?resolve(result):reject(err));
    });
    });     
    
exports.findById = (projectId,index, id) => new Promise((resolve, reject)=>{
  MongoClient.connect(url,(err, client)=>{
    client.db(projectId).collection(index).find({'_id': id}).toArray((err, result)=> {
    if(err===null){
        let records=[];
        if(result!=undefined && result.length){
            records.push(result[0]);
        }
        resolve({total:records.length, records});   
    }else{
        reject(err)}
    });
 });
});     


let find = (projectId,index, queryObj)=> new Promise((resolve, reject)=>{
 R.logger.info('FINDDDD', projectId,index, queryObj);
 MongoClient.connect(url,(err, client)=>{
    client.db(projectId).collection(index).find(queryObj).toArray((err, result)=> {
        if(err===null){
            let records=[];
            if(result!=undefined && result.length){
                records.push(result[0]);
            }
            resolve({total:records.length, records});   
        }else{
            reject(err)}
        });
    });
    });     
exports.find=find;


exports.deleteById = (projectId,index, type, id) => new Promise((resolve, reject)=>{
    R.logger.info(`Deleting [${id}] from ${index} ....`, projectId,index, type, id);
    MongoClient.connect(url,(err, client)=>{
        client.db(projectId).collection(index).deleteOne({'_id': id},(err, result)=> err===null?resolve(result):reject(err));
        });
      });     
