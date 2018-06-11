'use strict';
var Ajv = require('ajv');
var R = require("../util/rest-api-requires");

/*Schema definitions*/
/*http://jsonschema.net/#/ - ayuda a generar los esquemas*/

var schemasEquivalent={
    "app_test":"app_catalog",
    "app_city":"app_catalog",
    "app_estate":"app_catalog"
}
var schemas={
    "authenticate_schema":{
      "description": "Schema for login authentication",
      "properties": {
        "username": { "type": "string"},
        "pwd": { "type": "string"},

      },
       "additionalProperties": false,
       "required": [ "username","pwd" ],
    }
    ,"app_catalog":{
      "description": "Schema for all catalogs",
      "properties": {
        "description": { "type": "string"},

      },
       "additionalProperties": false,
       "required": [ "description" ],
    }
    ,"app_rol":{
      "description": "Schema for Security Roles"
      ,"properties": {
        "role": {"type": "string"}            
        ,"restrictions": {
          "type": "array"
          ,"items": {
            "properties": {
              "restriction": {
                "type": "string"
              }
            }
            ,"required": ["restriction"]
          }
        }
      }
      ,"required": ["role","restrictions"]
    }
    ,"app_user":{
      "description": "Schema for user index ",
      "properties": {
//        "username": { "type": "string"}
        "pwd": { "type": "string"}
        ,"status": { "enum": 
                     [ 1, 2, 3 ]
                   }
        ,"roles":{"type": "array",
                     "items":{
                     "properties": {
                        "rol": {"type": "string"}
                     }
                    ,"required": [ "rol"]
                    ,"additionalProperties": false
                   }
                 }
        ,"attributes":{
            "properties": {
                "name": { "type": "string"}
                ,"firstName": { "type": "string"}
                ,"lastName": { "type": "string"}
                ,"gender": { "enum": 
                     [ "M", "F"]
                   }
                ,"age": { "type": "number"}
                ,"birthday": { "type": "string"
                               ,"pattern":"^([0-9]{2})-([0-9]{2})-([1-2]{1})([0-9]{3})$"
                             }
                ,"email": { "type": "string"
                            ,"pattern":"^[_A-Za-z0-9-\\+.]*@[_A-Za-z0-9-\\+]*.[_A-Za-z]{2,3}$"   
                          }
            }
           ,"additionalProperties": false
           ,"required": [ "name","firstName","lastName","gender","age","birthday","email"]
         }
        ,"socialAccounts":{"type": "array",
             "items":{
                 "properties": {
                    "username": { "type": "string"}
                    ,"type": { "enum": 
                                ["facebook","pinterest","twitter"]
                             }
                    ,"uid": { "type": "string"}
                    ,"token": { "type": "string"}
                    ,"email": { "type": "string"
                                ,"pattern":"^[_A-Za-z0-9-\\+.]*@[_A-Za-z0-9-\\+]*.[_A-Za-z]{2,3}$"   
                              }
                    }
                ,"additionalProperties": false
                ,"required": [ "type","uid","token","email"]                           
                }
            }
          ,"created": { "type": "string"
                        ,"pattern":"^[2-3]{1}[0-9]{3}[0-9]{2}[0-9]{2}T[0-9]{2}[0-9]{2}[0-9]{2}Z$"
                      }
          ,"user_created": { "type": "string"}
          ,"updated": { "type": "string"
                        ,"pattern":"^[2-3]{1}[0-9]{3}[0-9]{2}[0-9]{2}T[0-9]{2}[0-9]{2}[0-9]{2}Z$"
                      }
          ,"user_updated": { "type": "string"}
        }
       ,"additionalProperties": false
       ,"required": [ "pwd","status","roles","attributes","socialAccounts"]
    }
};


function validateVsSchema(schemaName, data,callbackError){
    var schemaEquivalent = schemasEquivalent[schemaName];
    var env=R.properties.get('app.environtment');
    var schema;
    if(schemaEquivalent!=undefined){
        schema = schemas[schemaEquivalent];
    }else{
        schema = schemas[schemaName];
    }
    if(schema==undefined){
    R.logger.fatal('>>>>>>>>>>>>>>>>>>>'+schema);
        if(env==null || env==R.constants.ENVIRONTMENT_PROD){
    R.logger.fatal('1');
            callbackError('');
        }else{
    R.logger.fatal('2');
            callbackError('{"error":"No se ha definido el squema para:' + schemaName+'"}');
        }
    }
    var ajv = new Ajv({allErrors: true});
    var validate = ajv.compile(schema);
    var valid = validate(data);
    if (valid){
        R.logger.trace('El json es valido !!!!->'+JSON.stringify(data));
    } else{
        R.logger.error('El JSON no es valido:' + JSON.stringify(validate.errors));
        if(env==null || env==R.constants.ENVIRONTMENT_PROD){
            callbackError('');
        }else{
            callbackError(validate.errors);
        }
    }
}
exports.validateVsSchema=validateVsSchema;

function validateVsSchemaForUpdate(schemaName, data,callbackError){
    var schema_tmp = schemas[schemaName];
    var schema = JSON.parse(JSON.stringify(schema_tmp))
    schema.required.push('created');
    schema.required.push('user_created');
    var ajv = new Ajv({allErrors: true});
    var validate = ajv.compile(schema);
    var valid = validate(data);
    if (valid){
        R.logger.trace('El json es valido!!->'+JSON.stringify(data));
    } else{
        R.logger.error('El JSON no es valido:' + JSON.stringify(validate.errors));
        var env=R.properties.get('app.environtment');
        if(env==null || env==R.constants.ENVIRONTMENT_PROD){
            callbackError('');
        }else{
            callbackError(validate.errors);
        }
    }
}
exports.validateVsSchemaForUpdate=validateVsSchemaForUpdate;
