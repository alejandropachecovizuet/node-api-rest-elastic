'use strict;'
 let dateFormat = require('date-format');

 exports.getCurrentDateForElastic = ()=> dateFormat.asString('yyyyMMddThhmmssZ', new Date());

