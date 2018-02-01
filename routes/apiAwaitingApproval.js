var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = 'mongodb://root:anhanh123@ds117758.mlab.com:17758/admintraffic';
router.post('/', function(req, res, next) {
	try{
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
				db.collection('userlist').find({"member":false , "master":false, "admin" :false}).toArray((err, result)=> {
					res.send(result)
					assert.equal(null,err);
					db.close();
				});
		});
	}catch(e){
		res.redirect("/")
	}
});

module.exports = router;
