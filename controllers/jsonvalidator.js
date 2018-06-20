'use strict';
let Ajv = require('ajv');

/*Schema definitions*/
/*http://jsonschema.net/#/ - ayuda a generar los esquemas*/

const schemasEquivalent={
    "test":"catalog_schema",
    "cities":"catalog_schema",
    "estates":"catalog_schema",
}
const schemas={
  "admin_init_schema":{
    "description": "Schema for init application",
    "properties": {
      "user": {
        "properties": {
          "email": {"type": "string"},
          "pwd":  {"type": "string"},
        },
        "additionalProperties": false,
        "required": ["email","pwd" ],         
      }
      ,"projectDescription":  {"type": "string"},
    },
    "additionalProperties": false,
    "required": ["user","projectDescription"],         
  }
  ,"authenticate_schema":{
      "description": "Schema for login authentication",
      "properties": {
        "projectId": { "type": "string"},
        "email": { "type": "string"},
        "pwd": { "type": "string"},

      },
       "additionalProperties": false,
       "required": [ "projectId","email","pwd" ],
    }
    ,"catalog_schema":{
      "description": "Schema for all catalogs",
      "properties": {
        "description": { "type": "string"},

      },
       "additionalProperties": false,
       "required": [ "description" ],
    }
    ,"roles":{
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
    ,"users":{
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
           ,"required": [ "name","firstName","lastName"]
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
       ,"required": [ "pwd","status","roles"]
    }
};

exports.validateVsSchema = (schemaName, data) => new Promise((resolve, reject) => {
        const schemaEquivalent = schemasEquivalent[schemaName];
        const schema = schemaEquivalent?schemas[schemaEquivalent]:schemas[schemaName];
        if(!schema){
            reject('Schema not found!!!');
        }else {
          let validate = new Ajv({allErrors: true}).compile(schema);
          if (validate(data)){
              resolve(data);
          } else{
              reject(validate.errors);
          }
          }
    });