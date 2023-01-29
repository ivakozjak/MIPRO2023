var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/TradeRedescriptions.db');

db.serialize(function() {

    db.each("SELECT elementName FROM ElementTable WHERE elementID=12", function(err, row) {
        console.log("Country " + row.elementName);
    });
});

db.close();