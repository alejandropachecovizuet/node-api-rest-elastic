for serv in $(ps -fea | grep node | grep "restlets" | awk '{print $2}')
do
echo $serv
kill -9 $serv
done 
