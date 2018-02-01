var express = require('express');
var router = express.Router();
var request = require("request");
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = 'mongodb://127.0.0.1:27017/admintraffic';
router.post('/', function(req, res, next) {
	function callRequestGet(network, db, query) {
		try {
			request.get({
			    url: network.link
			}, function (err, respon) {
			   saveDB(network, db, query, respon) 	
			});
		} catch(e) {
			callRequest(network);
		}
	}
	function saveDB(network, db, query, respon) {
		var dataSave = {
	    		$push:{
	    			"offerList":{
	    				"name" : network.name,
		    			"data" : JSON.parse(respon.body)
	    			}
	    		}
	    	}
	    try{
			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('userlist').updateOne(query,dataSave,{upsert: true},(err,result)=>{
						console.log(err)
						if(!err){
							res.send("Successfully saved MongoDB data!");
						}
					})
			});
		}catch(e){
			res.redirect("/")
		}
	}
	function callRequestPost(network, db, query) {
		try {
			request.post({
			    url: network.link
			}, function (err, respon) {
				saveDB(network, db, query, respon)
			});
		} catch(e) {
			callRequestPost(network);
		}
	}
	function requetEmpty(network) {
		var query = {
						"dataAPITrackinglink" : true
					}
		var reset = {
			$set : {
				"offerList" : []
			}
		}
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
			db.collection("userlist").updateOne(query, reset, (err, result)=>{
				if(!err){
					network.forEach((api, index)=>{
						switch (api.method) {
							case "GET":
									callRequestGet(api, db, query)
								break;
							case "POST":
									callRequestPost(api, db, query)
								break;
						}
					})
				}
			})
		})
	}
	try{
		function findLinkAPI(db) {
			let query = {
				"isNetwork" : true
			}
			db.collection("userlist").findOne(query, (err, result)=>{
				requetEmpty(result.NetworkList)
			})
		}
		var query = {
			"idFacebook" : req.user.id
		}
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
				db.collection('userlist').findOne(query,function(err,result){
					if(result.admin){
						findLinkAPI(db)
					}else{
						res.send("Mày đéo phải admin");
					}
				assert.equal(null,err);
				db.close();
			});
		});
	}catch(e){
		res.redirect("/")
		res.end();
	}
});

module.exports = router;
