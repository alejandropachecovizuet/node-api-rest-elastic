for serv in $(ps -fea | grep node | grep "restlets" | awk '{print $9}')
do
echo $serv
done 
