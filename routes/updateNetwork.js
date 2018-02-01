var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = 'mongodb://127.0.0.1:27017/admintraffic';
/* GET home page. */
router.post('/', function(req, res, next) {
	function saveDB(){
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		try{
			var query = {
				"isNetwork" : true
			}
			var data = {
				$set : {
					"NetworkList" : req.body.NetworkList
				}							
			}
			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('userlist').updateOne(query,data, {upsert: true},function(err,result){
						if(!err){
							res.send(true)
						}else {
							res.send(false)
						}
					assert.equal(null,err);
					db.close();
				});
			});
		}catch(e){
			res.redirect("/")
			res.end();
		}	
	}
	try {
		var query = {
			"idFacebook" : req.user.id
		}
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
				db.collection('userlist').findOne(query, function(err,result){
					if(result.admin){
						saveDB()
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
