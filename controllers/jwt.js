'use strict';
var R = require("../util/rest-api-requires");
var jwtController={
    sign:function(user) {
         var message={_id:user._id,roles:user._source.roles};
         //R.logger.fatal(message);
         var token = R.jwt.sign(message,  R.properties.get('app.token.phrase'), {
              expiresIn:  R.properties.get('app.token.expire') // expires in 24 hours
        });
        return {success: true, user:user, token: token};
    },

    verify:function(token,tokenusername) {
            var deferred = R.q.defer();
            try {
                var decodeToken=R.jwt.verify(token, R.properties.get('app.token.phrase'));
                R.logger.debug(decodeToken);
                if(tokenusername!=decodeToken._id){
                   R.logger.fatal('No corresponde el usuario['+tokenusername+'] con el Token!!!!->' + decodeToken._id);
                   deferred.reject({valid: false});
                }
                deferred.resolve({valid: true, roles:decodeToken.roles});
            } catch(err) {
                R.logger.fatal('No es posible validar el token!!!'+err);
                deferred.reject({valid: false, error:err});
           }
        return deferred.promise;
    }
}

module.exports = jwtController;
