FORMAT_DATE="date +%Y/%m/%d-%H:%M:%S"

logger (){
	echo `$FORMAT_DATE` $1
}
getService (){
	value=`echo $1 | awk -F"/" '{print $NF}'`
	echo $value
}


DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FILES=$DIR/../restlets/*js
cd ..
CMD=$DIR/startApp.sh
for js in $(ls $FILES)
do
 echo $js
 service=`getService $js`
 nohup $CMD $service & 
done 
$DIR/xdoc.sh
cd bin
