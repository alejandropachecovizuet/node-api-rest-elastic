'use strict';
var colors = require('colors');
var R = require("./rest-api-requires");
var levels={
        trace:'fatal.error.warn.info.debug.trace'
        ,debug:'fatal.error.warn.info.debug'
        ,info:'fatal.error.warn.info'
        ,warn:'fatal.error.warn'
        ,error:'fatal.error'
        ,fatal:'fatal'
        ,none:''
        ,off:''
    };

function log(currentLevel,messagex){
    
    var levelProperties = R.properties.get('app.logger.level');
        if(levelProperties!=null){
            levelProperties=levelProperties.toLowerCase();
            var levelSupported=levels[levelProperties];
            if(levelSupported!=null){
            if(levelSupported.indexOf(currentLevel)>-1){
                printMessage(currentLevel, messagex);
                } 
              }else {
                 printMessage(currentLevel, messagex);
                }

        }else{
                 console.log('No esta configurado el log LEVEL de la aplicación'.red);
        }
    }
function printMessage(currentLevel,messagex){
    var time=new Date().toISOString();
        if(currentLevel=='fatal'){
            console.log(JSON.stringify({time:time, level:currentLevel, message:messagex}).bgYellow);
        }else if(currentLevel=='error'){
            console.log(JSON.stringify({time:time, level:currentLevel, message:messagex}).red);
        }else if(currentLevel=='warn'){
            console.log(JSON.stringify({time:time, level:currentLevel, message:messagex}).yellow);
        }else if(currentLevel=='info'){
            console.log(JSON.stringify({time:time, level:currentLevel, message:messagex}));
        }else if(currentLevel=='debug'){
            console.log(JSON.stringify({time:time, level:currentLevel, message:messagex}).cyan);
        }else if(currentLevel=='trace'){
            console.log(JSON.stringify({time:time, level:currentLevel, message:messagex}).blue);
        }
}


function fatal(message){
    log('fatal',message);
    }
exports.fatal = fatal;

function error(message){
    log('error',message);
    }
exports.error = error;

function warn(message){
    log('warn',message);
    }
exports.warn = warn;

function info(message){
    log('info',message);
    }
exports.info = info;

function debug(message){
    log('debug',message);
    }
exports.debug = debug;

function trace(message){
    log('trace',message);
    }
exports.trace = trace;
