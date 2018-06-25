var dbs = db.getMongo().getDBNames();
dbs.forEach(function(dbName) {
    db = db.getMongo().getDB( dbName );
        print("Dropping " + dbName + " database");
        db.dropDatabase();
})


