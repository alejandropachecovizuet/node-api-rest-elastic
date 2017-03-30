'use strict;'
 var dateFormat = require('date-format');

function getCurrentDateForElastic(){
    return dateFormat.asString('yyyyMMddThhmmssZ', new Date());
    }
exports.getCurrentDateForElastic=getCurrentDateForElastic;
