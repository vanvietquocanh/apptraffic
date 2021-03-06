var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');
const pathMongodb = require("./pathDb");

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.user){
		try{
				var query = {
					"idFacebook": req.user.id
 				}
 				var admin = false;
 				if(req.user.id === "904759233011090"){
 					admin = true;
 				}
 				var today = new Date();
 				var strToday = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} - ${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
 				var dataInsert = {
 					"idFacebook": req.user.id,
 					"profile"   : req.user,
 					"timeregis" : strToday,
 					"report" 	: [],
 					"request" 	: [],
					"admin"     : admin,
					"master"    : false,
					"member"    : false,
					"affiliate"	: false,
					"aff"		: {
						collectionApp:[],
						lenghtApp:[]
					}
 				}
			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('userlist').findOne(query,function(err,result){
						function renderPage(route, admin, download){
							res.render(route,{
								"name"    : req.user.displayName,
								"avatar"  : req.user.photos[0].value,
								"admin"   : admin,
								"download": download
							})
							res.end();
						}
						if(result){
								var admin = `<li>
		                               			<a href="/dashboard" class="waves-effect"><i class="zmdi zmdi-view-dashboard"></i><span> Dashboard </span> </a>
		                            		</li>`;
		                        var download = `<li class="has_sub">
					                                <a href="/userrequest" class="waves-effect"><i class="fa fa-envelope-o"></i> <span> User request </span></a>
					                            </li>
		                        				<li class="has_sub">
					                                <a href="/download" class="waves-effect"><i class="fa fa-download"></i> <span> Download </span></a>
					                            </li>`;
							if(result.member){
								download = `<li class="has_sub">
				                                <a href="/myoffers" class="waves-effect"><i class="ti ti-layout-list-post"></i> <span> My Offers </span></span></a>
				                            </li>`;
		                            renderPage("profile",admin, download)
							}else if(result.admin||result.master){
		                        renderPage("index", admin, download)
							}else{
								res.render("error",{
									error:{
										status: "",
										stack : "Your application has been reviewed by our team. We will contact soon !"
									}, message: ""
								})
							}
							assert.equal(null,err);
							db.close();
						}else{
							db.collection('userlist').insertOne(dataInsert,(err,result)=>{
							})
							res.render("error",{
								error:{
									status: "",
									stack : "Your application has been reviewed by our team. We will contact soon !"
								}, message: ""
							})
							res.end();
						};
						assert.equal(null,err);
						db.close();
					});
			});
		}catch(e){
			res.redirect("/")
			res.end();
		}
	}else{
		res.redirect("/")
		res.end();
	}
});

module.exports = router;
