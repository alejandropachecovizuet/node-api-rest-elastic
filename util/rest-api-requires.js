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

let elasticsearch= require("elasticsearch");
let elasticClient = new elasticsearch.Client({  
    host: properties.get('app.elasticsearch.host'),
    log: properties.get('app.elasticsearch.log')
//    plugins:[deleteByQuery]
});
define("elasticsearch", elasticsearch);
define("elasticClient", elasticClient);
//define("elastic", require('../controllers/elasticsearch'));