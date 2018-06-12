'use strict;'
 var dateFormat = require('date-format');

 exports.getCurrentDateForElastic = ()=> dateFormat.asString('yyyyMMddThhmmssZ', new Date());

