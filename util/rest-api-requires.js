function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

  
let PropertiesReader = require('properties-reader');
let properties = PropertiesReader('./app.properties')
define("properties", properties);
exports.properties=properties;

define("logger", require('./logger'));
define("jwtController", require('../controllers/jwt'));
define("constants", require('../util/constants'));
define("jwt", require('jsonwebtoken'));
define("express", require('express'));
define("bodyParser", require('body-parser'));
define("methodOverride", require('method-override'));
let session = require('express-session');
define("session", require('express-session'));
