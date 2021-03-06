var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = require("./pathDb");

router.get("/",(req, res, next)=>{
	if(req.user){
		try {
			var query = {
					"idFacebook": req.user.id
 				}
 			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('userlist').findOne(query,function(err,result){
						var download;
						if(result.admin){
							download     = `<li class="has_sub">
				                                <a href="/userrequest" class="waves-effect"><i class="fa fa-envelope-o"></i> <span> User request </span></a>
				                            </li>
											<li class="has_sub">
						                        <a href="/download" class="waves-effect"><i class="fa fa-download" hidden="true"></i> <span> Download </span></a>
						                    </li>`;
						}else{
							download  = ``;
						}
						    renderPage(download)
						assert.equal(null,err);
						db.close();
					});
			});
		} catch(e) {
			res.redirect("/")
		}
	  	function renderPage(download) {
	  		var admin =`<li>
		       			<a href="/admin" class="waves-effect"><i class="zmdi zmdi-view-dashboard"></i> <span> Dashboard </span> </a>
		    		</li>`;
			res.render("conversion",{
				"name"  : req.user.displayName,
				"avatar": req.user.photos[0].value,
				"admin" : admin,
				"download": download
			})
	  	}
	}else{
		res.redirect("/")
	}
})

module.exports = router;