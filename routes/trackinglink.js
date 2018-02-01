var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = 'mongodb://127.0.0.1:27017/admintraffic';
/* GET home page. */
router.post('/', function(req, res, next) {
	try {
		var query1 = {
			"dataAPITrackinglink" : true
		}
		function responData(db, isAdmin) {
			db.collection('userlist').findOne(query1,(err, result)=>{
				result.admin = req.user.id
				res.send(result)
			})
		}
		var query = {
			"idFacebook" : req.user.id
		}
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
				db.collection('userlist').findOne(query, function(err,result){
					if(result.admin){
						responData(db,result.admin)
					}
				assert.equal(null,err);
				db.close();
			});
		});
	} catch(e) {
		res.redirect("/");
		res.end();
	}
});

module.exports = router;
