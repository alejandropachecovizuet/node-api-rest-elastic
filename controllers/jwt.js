'use strict';
var R = require("../util/rest-api-requires");
exports.sign=user => {
        var message={_id:user._id,roles:user._source.roles};
        //R.logger.fatal(message);
        var token = R.jwt.sign(message,  R.properties.get('app.token.phrase'), {
            expiresIn:  R.properties.get('app.token.expire') // expires in 24 hours
    });
    return {success: true, user:user, token: token};
};

exports.verify= (token,tokenusername) =>{
        let promise = new Promise((resolve, reject) => {
            try {
                let decodeToken=R.jwt.verify(token, R.properties.get('app.token.phrase'));
                R.logger.debug(decodeToken);
                if(tokenusername!=decodeToken._id){
                    reject(`No corresponde el usuario ${tokenusername} con el Token`);
                }
                resolve(decodeToken.roles);
            } catch(err) {
                reject(err);
            }
    
        });
    return promise;
};