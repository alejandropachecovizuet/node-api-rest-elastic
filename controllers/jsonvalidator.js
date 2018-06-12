'use strict';
let Ajv = require('ajv');
let R = require("../util/rest-api-requires");

/*Schema definitions*/
/*http://jsonschema.net/#/ - ayuda a generar los esquemas*/

const schemasEquivalent={
    "app_test":"app_catalog",
    "app_city":"app_catalog",
    "app_estate":"app_catalog"
}
const schemas={
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

exports.validateVsSchema = (schemaName, data) =>{
    let promesa= new Promise((resolve, reject) => {
        const schemaEquivalent = schemasEquivalent[schemaName];
        const schema = schemaEquivalent?schemas[schemaEquivalent]:schemas[schemaName];
        if(!schema){
            reject();
        }
        let ajv = new Ajv({allErrors: true});
        let validate = ajv.compile(schema);
        let valid = validate(data);
        if (valid){
            R.logger.debug('El json es valido!!');
            resolve(data);
        } else{
            R.logger.error('El JSON NO es valido:',validate.errors);
            reject(validate.errors);
        }
    
    });

    return promesa;
    
};

exports.validateVsSchemaForUpdate = (schemaName, data) =>{
    let promesa= new Promise((resolve, reject) => {
        const schemaEquivalent = schemasEquivalent[schemaName];
        const schema = schemaEquivalent?schemas[schemaEquivalent]:schemas[schemaName];
        if(!schema){
            reject();
        }
        schema.required.push('time_created');
        schema.required.push('user_created');
        let ajv = new Ajv({allErrors: true});
        let validate = ajv.compile(schema);
        let valid = validate(data);
        if (valid){
            R.logger.debug('El json es valido!!');
            resolve(data);
        } else{
            R.logger.error('El JSON NO es valido:',validate.errors);
            reject(validate.errors);
        }
    
    });

    return promesa;
    
};


