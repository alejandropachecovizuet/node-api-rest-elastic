APP=eventBusListener.js
PORT=$1
me=`basename "$0"`
if [ "$APPS_HOME" == "" ]; 
then
   export APPS_HOME=/home/lmiranda/apv/Personal/mesa/node/test
fi
if [ "$MESA_MESOS_HOME" == "" ]; 
then
   export MESA_MESOS_HOME=/home/lmiranda/apv/Personal/mesa/mesos/
fi

if [ "$PORT" != "" ]; 
then
   $APPS_HOME/bin/startApp.sh $APP $PORT 
else
  echo "USO: ./$me PORT";
fi
