var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");


/* GET home page. */
router.post('/', function(req, res, next) {
	try {
		if(req.user){
			var query = {
				"idFacebook": req.user.id
					}
				mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('userlist').findOne(query,function(err,result){
						if(result.admin){
							let queryRequest = {
								"member" : true
							}
							var dataRespon = [];
							db.collection('userlist').find(queryRequest).toArray((err, result)=> {
								result.forEach( function(element, index) {
									if(element.request!==undefined&&element.request.length>0){
										element.request.forEach( function(ele, i) {
											console.log(ele)
											dataRespon.push(ele)
										});
									}
								});	
								res.send(dataRespon)
								assert.equal(null,err);
								db.close();
							});
						}else{
							res.redirect("/")
						}
						assert.equal(null,err);
						db.close();
					});
			});
		}else{
			res.redirect("/")
		}
	} catch(e) {
		console.log(e);
	}
});

module.exports = router;
