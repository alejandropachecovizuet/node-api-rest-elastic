FORMAT_DATE="date +%Y/%m/%d-%H:%M:%S"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT=$(basename $(dirname $DIR))
FILES=$DIR/../restlets/*js
HTML=$DIR/../xDoc/$PROJECT.html
AWK=$DIR/../xDoc/awk/xDoc.awk

logger (){
	echo `$FORMAT_DATE` $1
}

find (){
	echo `egrep "$1" $2 | awk -F"$1" '{print $2}'`
}
findPort (){
	key=`echo $1 | awk -F"\/" '{print $NF}'| sed s/".js"/""/g`'.PORT'
	value=`egrep $key $DIR/../app.properties | awk -F"=" '{print $2}'`
	echo $value
}
discoveryServices (){
	echo `egrep "$1" $2 | grep -v "xDoc-NoDoc"| awk -F"xDoc-" -f $AWK`
}

echo "" >$HTML;
echo "<!DOCTYPE html><html><head><title>Rest Api - " $PROJECT "</title>">> $HTML;
echo " <link rel=\"stylesheet\" href=\"css/bootstrap.min.css\">">> $HTML;
echo " <link rel=\"stylesheet\" href=\"css/bootstrap-theme.min.css\">">> $HTML;
echo " <script src=\"js/bootstrap.min.js\"></script>">> $HTML;
echo " <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">">> $HTML;
echo " </head><body>">> $HTML;
var footer= "</body></html>";             
echo 'HEADER:'$header


echo "<h3 align=\"center\">Api Rest - " $PROJECT "</h3>" >> $HTML
for js in $(ls $FILES | sort)
do
name=`find xDocRestName: $js`
port=`findPort $js`
echo "<h4>"$name":"$port"</h4>" >> $HTML
services=`discoveryServices router.route $js`
echo "<p>"$services"</p>" >> $HTML
done 
echo $footer >> $HTML
firefox $HTML &
