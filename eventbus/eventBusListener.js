var express = require("express"),  
    app = express(),
    bodyParser  = require("body-parser"),
    _ = require("underscore"),
    methodOverride = require("method-override");

app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());  
app.use(methodOverride());

var router = express.Router();
var _PORT_=8090;
var pingResponse='pong';
var numCalls=0;

function run_cmd(cmd, args, callback){
   var spawn = require("child_process").spawn;
   var child = spawn(cmd, args);
   var resp = "";
   child.stdout.on('data', function(buffer){ resp+=buffer.toString()});
   child.stdout.on('end', function(){ callback(resp)});
}

function updateHAProxy(body){
	 var eventType = JSON.stringify(body.eventType);
	 var appId='';
	 var taskStatus='';
	 var str = '';
	 if(eventType == '"status_update_event"'){
		  taskStatus = JSON.stringify(body.taskStatus);
		  appId = JSON.stringify(body.appId);

		  if(taskStatus == '"TASK_KILLED"' || taskStatus == '"TASK_RUNNING"'){
				 numCalls=numCalls+1;
				 str = '['+numCalls+']['+new Date()+']actualizando HAProxy...'  + eventType + '->:' + taskStatus + '->:' + appId + '->'+JSON.stringify(body)+'\n';
				 console.log(str);
				   new run_cmd('/home/lmiranda/apv/Personal/mesa/mesos/bin/environment/updateHAProxy.sh', [], function (text){console.log(text)});
				  }
	      }
      return str;
	}
	
router.route('/eventBusListener')
    .post(function(req, res) {
			res.status(200).send(updateHAProxy(req.body));
});
router.route('/eventBusListener/stat')
    .post(function(req, res) {
             res.status(200).send('Num llamadas: ' + numCalls+'\n');
});

app.use(router);

app.listen(_PORT_, function() {  
  console.log('[eventBusListener]Node server running on ' + _PORT_ + ', proceso: ' + process.pid );
});
