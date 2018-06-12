curl 'localhost:9200/_cat/indices?v'
echo "borrando indices ....";
#curl -XDELETE 'http://localhost:9200/app_catalog'
#curl -XDELETE 'http://localhost:9200/app-test'
#curl -XDELETE 'http://localhost:9200/app_user'
curl -XDELETE 'http://localhost:9200/app_rol'

currentDate=`date +%Y%m%dT%H%M00Z`

echo "Insertando roles....";
sed s/"currentDate"/$currentDate/g json/rol.json > json/rol.json.tmp
curl -X PUT http://localhost:9200/app_rol/rol/SuperAdmin -H 'Content-Type: application/json' --data-binary "@json/rol.json.tmp"

rm json/rol.json.tmp

echo "creando mappings....";
curl -X PUT 'http://localhost:9200/app_user' -H 'Content-Type: application/json' -d \
'{
  "mappings": {
    "user": {
      "properties": {
            "pwd":{"type" : "string", "index": "not_analyzed"},
            "status":{"type" : "integer"},
            "roles":{
                "properties" : {
                   "rol":{"type" : "string", "index": "not_analyzed"}
                    }
                },
            "attributes":{
                "properties" : {
					"name":{"type":"string", "index": "not_analyzed"},
					"firstName":{"type":"string", "index": "not_analyzed"},
					"lastName":{"type" : "string", "index": "not_analyzed"},
					"gender" :{"type" : "string", "index": "not_analyzed"},
					"age":{"type" : "integer"},
					"birthdate":  {"type":   "date", "format": "dd-MM-yyyy"},
					"email":  {"type":   "string", "index": "not_analyzed"}
				}
			},
			"socialAccounts":{
                "properties" : {
					"type": {"type" : "string", "index": "not_analyzed"},
					"uid": {"type" : "string", "index": "not_analyzed"},
					"token": {"type" : "string", "index": "not_analyzed"},
					"username": {"type" : "string", "index": "not_analyzed"},
					"email": {"type" : "string", "index": "not_analyzed"}
				}
			}
			,"created":{"type":"date", "format":"basic_date_time_no_millis"}
			,"user_created":{"type":"string"}
			,"updated":{"type":"string"}
			,"user_updated":{"type":"string"}
      }
    }
  }
}'

echo "Consultando el mapping del indice..."
curl -XGET 'http://localhost:9200/app_user/_mapping'

echo "Insertando usuario chingon!!!!!";
sed s/"currentDate"/$currentDate/g json/user.json > json/user.json.tmp
curl -X PUT http://localhost:9200/app_user/init/chingon -H 'Content-Type: application/json' --data-binary "@json/user.json.tmp"
curl -X PUT http://localhost:9200/app_user/init/test -H 'Content-Type: application/json' -d \
'{
	"estatus": 1,
	"pwd":"123456",	
	"roles":[{"rol":"test"}],
	"attributes": {		}
}'
curl -X PUT http://localhost:9200/app_rol/rol/test -H 'Content-Type: application/json' -d \
'{"role": "test",
 "restrictions":[{"restriction":"app.db.app_test.add"},
                {"restriction":"app.db.app_test.delete"},
                {"restriction":"app.db.app_test.update"},
                {"restriction":"app.db.app_test.search"},
                {"restriction":"app.db.app_testx.delete"},
                {"restriction":"app.db.app_testx.update"},
                {"restriction":"app.db.app_testx.search"}
		       ]
	,"user_created":"init"
}'

rm json/user.json.tmp
echo "Nuevos indices ....";
curl 'localhost:9200/_cat/indices?v'