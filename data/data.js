
var mysql = require('mysql');

function connection(){
    var con = mysql.createConnection({
        host: "localhost",
        user: "yourusername",
        password: "yourpassword"
      });
    return con;
}

function select(){
    var con = connection();
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM customers", function (err, result, fields) {
          if (err) throw err;
          console.log(result);
        });
      });
}

module.exports.connection = connection;
module.exports.select = select;