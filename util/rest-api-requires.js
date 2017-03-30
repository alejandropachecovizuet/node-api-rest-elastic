function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./app.properties')
define("properties", properties);

define("logger", require('./logger'));
define("jwtController", require('../controllers/jwt'));
define("q", require('q'));
define("constants", require('../util/constants'));
define("jwt", require('jsonwebtoken'));
define("express", require('express'));
define("bodyParser", require('body-parser'));
define("methodOverride", require('method-override'));
var session = require('express-session');
define("session", require('express-session'));

var elasticsearch= require("elasticsearch");
//var deleteByQuery = require("elasticsearch-deletebyquery");
var elasticClient = new elasticsearch.Client({  
    host: properties.get('app.elasticsearch.host'),
    log: properties.get('app.elasticsearch.log')
//    plugins:[deleteByQuery]
});
define("elasticsearch", elasticsearch);
define("elasticClient", elasticClient);
//define("elastic", require('../controllers/elasticsearch'));