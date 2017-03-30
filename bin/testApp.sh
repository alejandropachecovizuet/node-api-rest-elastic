IP=$1
PORT=$2
CONTEXT=$3
me=`basename "$0"`
if [[ "$IP" != "" && "$PORT" != "" && "$CONTEXT" != "" ]]; 
then
   echo "--------------------------------"
   echo "login:"`curl -X POST -H "Accept: application/json" -d '{"usuario":"apv"}' http://$IP:$PORT/$CONTEXT`
   echo ""
   echo "ping:"
   curl -I -X POST -H "Accept: application/json" -d '{"usuario":"apv"}' http://$IP:$PORT/$CONTEXT/ping
   echo ""
   echo "fail:"
   curl -X POST -H "Accept: application/json" -d '{"usuario":"apv"}' http://$IP:$PORT/$CONTEXT/fail
   echo ""
   echo "ping:"
   curl -X POST -H "Accept: application/json" -d '{"usuario":"apv"}' http://$IP:$PORT/$CONTEXT/ping
   echo ""
   echo "fix:"
   curl -X POST -H "Accept: application/json" -d '{"usuario":"apv"}' http://$IP:$PORT/$CONTEXT/fix
   echo ""
   echo "ping:"
   curl -X POST -H "Accept: application/json" -d '{"usuario":"apv"}' http://$IP:$PORT/$CONTEXT/ping
   echo ""
else
  echo "USO: ./%me IP PORT CONTEXT";
fi

