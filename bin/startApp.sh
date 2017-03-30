APP=$1
PORT=$2
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
me=`basename "$0"`

if [ "$PORT" != "" ]; then
   echo "ejecutando servicio "$APP "en el puerto: " $PORT
   sed s/"var _PORT_=R.properties.get(rest+'.PORT');"/"var _PORT_=$PORT;"/g $DIR/../restlets/$APP > $DIR/../restlets/$APP.$PORT
   node $DIR/../restlets/$APP.$PORT
   rm $DIR/../restlets/$APP.$PORT
 else 
   echo "ejecutando servicio "$APP "en el puerto default"
    node $DIR/../restlets/$APP
  fi
