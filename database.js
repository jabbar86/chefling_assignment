var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "fruitsalad",
    database: "chefling",
    insecureAuth : true
});

con.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      }
    //   con.query("CREATE DATABASE chefling", function (err, result) {
    //     if (err) throw err;
    //     console.log("Database created");
    //   });
    
      console.log('connected as id ' + con.threadId);

});

module.exports = con;