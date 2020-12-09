var express = require("express");
var app = express();
var mssql = require("mssql");
var config = require("./config.js");
var bodyParser = require("body-parser");
var cors = require("cors");

//cors credentials
app.use(
	cors({
		credentials: true,
		// origin: "http://hbs-310s-it-xxx.times.uh.edu",
		origin: "http://localhost:3000",
		exposedHeaders: ["Origin", "X-Requested-With", "Content-Type, Accept"],
	})
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/get_Studentinfo/:id?", function (req, res) {
	const inputValue = req.params.id;
	mssql.connect(config, function (err) {
		if (err) {
			return callback(err);
		} else var request = new mssql.Request();
		request.input("ID", mssql.Int, inputValue);

		request.execute("dbo.GET_Student_information", function (err, recordsets, returnValue) {
			if (err) {
				console.log(err);
			} else var str = JSON.stringify(recordsets);
			res.send(recordsets.recordsets[0][0]); //send to front_end
			console.log(str);
		});
	});
});

// save answers with id
// once a time
app.put("/UpdateCATAnswer/:id?", function (req, res) {
	const id = req.params.id;
	const question = req.body.question;
	const answer = req.body.answer;

	mssql.connect(config, function (err) {
		if (err) {
			return callback(err);
		} else var request = new mssql.Request();
		request.input("ID___", mssql.Int, id);
		request.input("cat_question", mssql.NVarChar, question);

		request.input("cat_answer", mssql.NVarChar, answer);
		request.execute("dbo.UpdateCATAnswer", function (err, result) {
			if (err) {
				console.log("dbo.UpdateCATAnswer: " + err);
			}
			let str = JSON.stringify(result);
			res.send(str); //send to front_end
		});
	});
});

app.put("/InsertStudentInformation", function (req, res) {

	const FirstName = req.body.FirstName;
	const LastName = req.body.LastName;
	const Gender = req.body.Gender;
	const School = req.body.School;
	const Grade = req.body.Grade;
	const Ethnicity = req.body.Ethnicity;
	const EthnicityOther = req.body.EthnicityOther;
	const PrimaryLanguage = req.body.PrimaryLanguage;
	const OtherLanguageHome = req.body.OtherLanguageHome;
	const languagesHome = req.body.languagesHome;
	const OtherLanguagePeople = req.body.OtherLanguagePeople + languagesHome;
	const HomeroomTeacher = req.body.HomeroomTeacher;

	mssql.connect(config, function (err) {
		if (err) {
			return callback(err);
        } else 
      	var request = new mssql.Request();
 		request.input("FirstName", mssql.NVarChar, FirstName)
		request.input("LastName", mssql.NVarChar, LastName)
		request.input("Gender", mssql.NVarChar, Gender)
		request.input("School", mssql.NVarChar, School)
		request.input("Grade", mssql.NVarChar, Grade)
		request.input("Ethnicity", mssql.NVarChar, Ethnicity)
		request.input("EthnicityOther", mssql.NVarChar, EthnicityOther)
		request.input("PrimaryLanguage", mssql.NVarChar, PrimaryLanguage)
		request.input("OtherLanguageHome", mssql.NVarChar, OtherLanguageHome)
		request.input("OtherLanguagePeople", mssql.NVarChar, OtherLanguagePeople)
		request.input("HomeroomTeacher", mssql.NVarChar, HomeroomTeacher)
        
        request.execute("dbo.InsertStudentInformation", function (err, result) {
			if (err) {
				console.log("dbo.InsertStudentInformation: " + err);
			}
			
			let str = JSON.stringify(result);
			console.log(str)
			res.send(str); //send to front_end
		});
	});
});


require("./routes/nextQuestion")(app);

// app.get("/", function (req, res) {
// 	var sql = require("mssql");

// 	// config for your database
// 	// connect to your database
// 	sql.connect(config, function (err) {
// 		// if (err) console.log(err);
// 		// create Request object
// 		var request = new sql.Request();
// 		// query to the database and get the records
// 		request.query("select * from Student_Information", function (err, recordset) {
// 			// if (err) console.log(err);
// 			// send records as a response
// 			res.send(recordset);
// 		});
// 	});
// });

var server = app.listen(5000, function () {
	console.log("Server is running..");
	const addr = server.address();
	console.log(`Server listening at http://${addr.address}:${addr.port}`);
});

// module.exports = app;
