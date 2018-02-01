var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = 'mongodb://127.0.0.1:27017/admintraffic';

router.get("/",(req, res, next)=>{
	if(req.user){
		var admin =`<li>
	       			<a href="/admin" class="waves-effect"><i class="zmdi zmdi-view-dashboard"></i> <span> Dashboard </span> </a>
	    		</li>`;
		res.render("conversion",{
			"name"  : req.user.displayName,
			"avatar": req.user.photos[0].value,
			"admin" : admin
		})
	}else{
		res.redirect("/")
	}
})

module.exports = router;