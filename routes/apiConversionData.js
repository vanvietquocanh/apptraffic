var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = 'mongodb://127.0.0.1:27017/admintraffic';
router.post('/', function(req, res, next) {
	try {
		function responseReportClick(condition, db) {
			var query = {
				"isConversion": true
			}
			db.collection('userlist').findOne(query, (err,result)=>{
				var dataResponse = result.conversion.filter(function(val) {
					if(condition){
						return val;
					}else{
						return val.id == req.user.id;
					}
				});
				res.send(dataResponse)
				assert.equal(null,err);
				db.close();
			});
		}
		var userRequest = {
			"idFacebook" : req.user.id
		}
		mongo.connect(pathMongodb, (err, db)=>{
			assert.equal(null, err);
				db.collection("userlist").findOne(userRequest, (err,result)=>{
					if(result.admin){
						responseReportClick(result.admin, db)
					}else {
						responseReportClick(result.admin, db)
					}
				})
		})
	} catch(e) {
		console.log(e);
	}
});

module.exports = router;
