'use strict';
const colors = require('colors');
const R=require("./rest-api-requires");

const levels={
        trace:'fatal.error.warn.info.debug.trace'
        ,debug:'fatal.error.warn.info.debug'
        ,info:'fatal.error.warn.info'
        ,warn:'fatal.error.warn'
        ,error:'fatal.error'
        ,fatal:'fatal'
        ,none:''
        ,off:''
    };

function log(currentLevel,messagex, ...moreMessages){  
    let levelProperties = R.properties.get('app.logger.level');
        if(levelProperties!=null){
            levelProperties=levelProperties.toLowerCase();
            const levelSupported=levels[levelProperties];
            if(levelSupported && levelSupported.indexOf(currentLevel)>-1){
                printMessage(currentLevel, messagex, ...moreMessages);
              }else {
                 printMessage(currentLevel, messagex, ...moreMessages);
                }

        }else{
                 console.log('No esta configurado el log LEVEL de la aplicación'.red);
        }
    }
function printMessage(currentLevel,messagex, ...moreMessages){
    const time=new Date().toISOString();
        if(currentLevel=='fatal'){
            console.error(time, currentLevel, messagex, ...moreMessages);
        }else if(currentLevel=='error'){
            console.error(time, currentLevel, messagex, ...moreMessages);
        }else if(currentLevel=='warn'){
            console.warn(time, currentLevel, messagex, ...moreMessages);
        }else if(currentLevel=='info'){
            console.info(time, currentLevel, messagex, ...moreMessages);
        }else if(currentLevel=='debug'){
            console.debug(time, currentLevel, messagex, ...moreMessages);
        }else if(currentLevel=='trace'){
            console.trace(time, currentLevel, messagex, ...moreMessages);
        }
}

exports.fatal = (message, ...moreMessages) =>log('fatal',message,...moreMessages);
exports.error = (message, ...moreMessages) =>log('error',message,...moreMessages);
exports.warn = (message, ...moreMessages) =>log('warn',message,...moreMessages);
exports.info = (message, ...moreMessages) =>log('info',message,...moreMessages);
exports.debug = (message, ...moreMessages) =>log('debug',message,...moreMessages);
exports.trace = (message, ...moreMessages) =>log('trace',message,...moreMessages);
