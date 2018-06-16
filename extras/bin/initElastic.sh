curl 'localhost:9200/_cat/indices?v'
echo "borrando indices ....";

for indice in $(curl 'localhost:9200/_cat/indices?v' | awk '{print $3}'| grep -v index)
do
URL="http://localhost:9200/$indice"
curl -XDELETE $URL
done

currentDate=`date +%Y%m%dT%H%M00Z`

echo "Insertando roles....";
#sed s/"currentDate"/$currentDate/g json/rol.json > json/rol.json.tmp
#curl -X PUT http://localhost:9200/roles/roles/SuperAdmin -H 'Content-Type: application/json' --data-binary "@json/rol.json.tmp"
#rm json/rol.json.tmp
curl -X PUT http://localhost:9200/roles/roles/SuperAdmin -H 'Content-Type: application/json' -d \
'{"role": "SuperAdmin",
 "restrictions":[{"restriction":"app.db.users.add"},
                {"restriction":"app.db.users.delete"},
                {"restriction":"app.db.users.update"},
                {"restriction":"app.db.users.search"},
				{"restriction":"app.db.roles.add"},
                {"restriction":"app.db.roles.delete"},
                {"restriction":"app.db.roles.update"},
                {"restriction":"app.db.roles.search"},
				{"restriction":"app.db.cities.add"},
				{"restriction":"app.db.cities.delete"},
				{"restriction":"app.db.cities.update"},
				{"restriction":"app.db.cities.search"},
				{"restriction":"app.db.test.add"},
				{"restriction":"app.db.test.delete"},
				{"restriction":"app.db.test.update"},
				{"restriction":"app.db.test.search"},
				{"restriction":"app.db.testx.search"}
		       ]
	,"created":"init"
	,"user_created":"init"
}'

curl -X PUT http://localhost:9200/roles/roles/AppUser -H 'Content-Type: application/json' -d \
'{"role": "AppUser",
 "restrictions":[{"restriction":"app.db.users.add"},
                {"restriction":"app.db.users.update"},
				{"restriction":"app.db.cities.search"}
		       ]
	,"created":"init"
	,"user_created":"init"
}'

echo "creando mappings....";
#curl -X PUT 'http://localhost:9200/users' -H 'Content-Type: application/json' -d \
##'{
#  "mappings": {
#    "user": {
#      "properties": {
#            "pwd":{"type" : "string", "index": "not_analyzed"},
#            "status":{"type" : "integer"},
#            "roles":{
#                "properties" : {
#                   "rol":{"type" : "string", "index": "not_analyzed"}
#                    }
#                },
#            "attributes":{
#                "properties" : {
#					"name":{"type":"string", "index": "not_analyzed"},
#					"firstName":{"type":"string", "index": "not_analyzed"},
#					"lastName":{"type" : "string", "index": "not_analyzed"},
#					"gender" :{"type" : "string", "index": "not_analyzed"},
#					"age":{"type" : "integer"},
#					"birthdate":  {"type":   "date", "format": "dd-MM-yyyy"},
#					"email":  {"type":   "string", "index": "not_analyzed"}
#				}
#			},
#			"socialAccounts":{
#                "properties" : {
#					"type": {"type" : "string", "index": "not_analyzed"},
#					"uid": {"type" : "string", "index": "not_analyzed"},
#					"token": {"type" : "string", "index": "not_analyzed"},
#					"username": {"type" : "string", "index": "not_analyzed"},
#					"email": {"type" : "string", "index": "not_analyzed"}
#				}
#			}
#			,"created":{"type":"date", "format":"basic_date_time_no_millis"}
#			,"user_created":{"type":"string"}
#			,"updated":{"type":"string"}
#			,"user_updated":{"type":"string"}
#      }
#    }
#  }
#}'
#
#echo "Consultando el mapping del indice..."
#curl -XGET 'http://localhost:9200/users/_mapping'

echo "Insertando usuario x@x.com!!!!!";
#sed s/"currentDate"/$currentDate/g json/user.json > json/user.json.tmp
#curl -X PUT http://localhost:9200/users/users/x@x.com -H 'Content-Type: application/json' --data-binary "@json/user.json.tmp"
curl -X PUT http://localhost:9200/users/users/x@x.com -H 'Content-Type: application/json' -d \
'{
	"status": 1,
	"pwd":"123456",	
	"roles":[{"rol":"SuperAdmin"}]
}'
#curl -X PUT http://localhost:9200/users/users/x@x.com -H 'Content-Type: application/json' --data-binary "@json/user.json.tmp"
#
#curl -X PUT http://localhost:9200/users/users/test -H 'Content-Type: application/json' -d \
#'{
#	"estatus": 1,
#	"pwd":"123456",	
#	"roles":[{"rol":"test"}],
#	"attributes": {		}
#}'
#curl -X PUT http://localhost:9200/roles/roles/test -H 'Content-Type: application/json' -d \
#'{"role": "test",
# "restrictions":[{"restriction":"app.db.test.add"},
#                {"restriction":"app.db.test.delete"},
#                {"restriction":"app.db.test.update"},
#                {"restriction":"app.db.test.search"},
#                {"restriction":"app.db.testx.delete"},
#                {"restriction":"app.db.testx.update"},
#                {"restriction":"app.db.testx.search"}
#		       ]
#	,"user_created":"init"
#}'

curl -X PUT http://localhost:9200/test/test/1 -H 'Content-Type: application/json' -d '{"description":"Test"}'
rm json/user.json.tmp
echo "Nuevos indices ....";
curl 'localhost:9200/_cat/indices?v'

