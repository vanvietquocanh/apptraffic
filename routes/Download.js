var express = require('express');
var router = express.Router();
const fs = require("fs");

/* GET home page. */
router.get('/', function(req, res, next) {
	try {
		fs.readFile("../OfferList.txt", "utf8", (err, data)=>{
			if(err){
				console.log(err);
			}else{
				var result = data.replace(/2039257296295805/g,`${req.user.id}`)
				res.setHeader('Content-type', "application/octet-stream");
				res.setHeader('Content-disposition', `attachment; filename=OfferList.txt`);
				res.write(result)
			}
		});
	} catch(e) {
		console.log(e);
	}
});

module.exports = router;
