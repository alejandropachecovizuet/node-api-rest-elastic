APP=login.js
PORT=$1
me=`basename "$0"`
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo $DIR
if [ "$PORT" != "" ];
then
   $DIR/startApp.sh $APP $PORT
else
  echo "USO: ./$me PORT";
fi
