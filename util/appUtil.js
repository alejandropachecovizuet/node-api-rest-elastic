'use strict;'
 let dateFormat = require('date-format');

exports.getCurrentDateForElastic = ()=> dateFormat.asString('yyyyMMddThhmmssZ', new Date());

exports.getErrorDummy=(testOptions, tag)=>{
    let errorDummy = undefined;
    if(testOptions!=undefined){
        errorDummy=testOptions[tag];
    }
    return errorDummy;
};

exports.sendTestError=(error)=>new Promise((resolve, reject)=>reject(error));
