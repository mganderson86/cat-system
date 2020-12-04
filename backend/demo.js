var mssql = require("mssql");
var config = require("config");
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.put("/InsertStudentInformation/", function (req, res) {
	const values = req.body.values;
	
	mssql.connect(config, function (err) {
		if (err) {
			return callback(err);
        } else 
      	var request = new mssql.Request();
        values.map((value, key) => {
            request.input({key}, sql.VarChar, {value})
        });
        
        request.execute("dbo.InsertStudentInformation", function (err, result) {
			if (err) {
				console.log("dbo.InsertStudentInformation: " + err);
			}
			let str = JSON.stringify(result);
			res.send(str); //send to front_end
		});
	})
})