
function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("ENVIRONTMENT_PROD", 'PROD'); 
/**** HTTP Response codes *****/
define("HTTP_OK", 200); 
define("HTTP_NO_CONTENT", 204);
define("HTTP_BAD_REQUEST", 400); 
define("HTTP_UNAUTHORIZED", 401);
define("HTTP_FORBIDEN", 403);
define("HTTP_NOT_FOUND", 404);
define("HTTP_CONFLIC", 409); 
define("HTTP_DUPLICATED", 409); //conflic
define("HTTP_INTERNAL", 500); 

/**** Messages *****/


/**** Errors *****/
define("ERROR_TOKEN_INVALID", "'Token invalid!!!.'"); //seconds
define("ERROR_REJECT_AUTH", 'Authentication failed. User not found.');
define("ERROR_REJECT_INVALID_PARAMS", 'Invalid params!');
define("ERROR_DUPLICATED_KEY", 'Duplicated key');
define("ERROR_NOT_FOUND", 'Record not found');

/**** Indexes *****/
define("INDEX_ROL", "roles"); 
define("INDEX_PROJECT", "projects"); 
define("INDEX_USER", "users"); 