'use strict';
let R = require("../util/rest-api-requires");
exports.sign=(email, user, phrase) => {
        let message={_id:email,roles:user.roles, projectId:user.projectId};
        R.logger.trace('****message:',message);
        let token = R.jwt.sign(message,  phrase, {
            expiresIn:  R.properties.get('app.token.expire') 
    });
    return {success: true, user:user, token: token};
};

exports.verify= (token,tokenusername,phrase, projectId) =>{
        let promise = new Promise((resolve, reject) => {
            try {
                let decodeToken=R.jwt.verify(token, phrase);
                R.logger.debug(decodeToken);
                if(tokenusername!=decodeToken._id){
                    reject(`No corresponde el usuario ${tokenusername} con el Token->`,decodeToken);
                }
                if(projectId!=decodeToken.projectId){
                    reject(`El project ID del usuario ${tokenusername} con corresponde al projectId enviado`);
                }
                resolve(decodeToken);
            } catch(err) {
                reject(err);
            }
    
        });
    return promise;
};

exports.encrypt= (data, phrase) =>R.jwt.sign(data, phrase);

exports.decrypt= (data, phrase) =>R.jwt.verify(data, phrase); 

exports.guid=()=>{
    let s4=()=>Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      return `${s4()}${s4()}-${s4()}${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
    };
