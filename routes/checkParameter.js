var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');
var randomstring = require("randomstring");

const pathMongodb = 'mongodb://127.0.0.1:27017/admintraffic';
/* GET home page. */
router.get('/', function(req, res, next) {
	function save(dataUpdate, link) {
		var queryUpdate = {
			"isReportClick" : true
		}
		mongo.connect(pathMongodb, (err, db)=>{
			assert.equal(null,err);
			db.collection('userlist').updateOne(queryUpdate, dataUpdate, {upsert:true}, function(err,result){
				res.redirect(link)
				res.end();
			assert.equal(null,err);
			db.close();
		})		
	})
	}
	function checkPostback(app, person) {
		var queryNetwork = {
			"isNetwork" : true
		}
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
		var today = new Date();
 		var strToday = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} - ${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
 		var strRandom = randomstring.generate();
		var dataUpdate = {
			$push : {
				"report" : {
					"appName":app.app_name,
					"name": person.displayName,
		            "idFacebook": person.idFacebook,
		            "idOffer": req.query.offer_id,
		            "id": req.query.aff_id,
		            "time": strToday,
		            "country" : app.geo,
		            "ip": ip,
		            "agent": req.headers['user-agent'],
		            "key" : strRandom
				}
			}
		}
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
				db.collection('userlist').findOne(queryNetwork, function(err,result){
					if(!err){
						if(result.NetworkList.length!==0){
							result.NetworkList.forEach((ele,index)=>{
								if(app.offer_url.indexOf(ele.name.toLowerCase())!==-1){
									var link = `${app.offer_url}+&${ele.postback}=${strRandom}`
									save(dataUpdate,link)
								};
							})
						}
					}
				assert.equal(null,err);
				db.close();
			});
		});
	}
	function checkApp(profile, db) {
		var querySearchOffer = {
			"dataAPITrackinglink" : true
		}
		db.collection('userlist').findOne(querySearchOffer, function(err,result){
			result.offerList.forEach( function(element, index) {
				element.data.offers.forEach( function(el, i) {
					if(i == req.query.offer_id){
						checkPostback(el, profile)
					}

				});
			});
			assert.equal(null,err);
			db.close();
		})
	}
	try {
		var query = {
			"idFacebook" : req.query.aff_id
		}
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
				db.collection('userlist').findOne(query, function(err,result){
					if(result.profile){
						checkApp(result.profile, db)
					}else{
						res.redirect("/")
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
