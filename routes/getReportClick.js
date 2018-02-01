var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.user){
		var html = "";
		// <th class="sorting fixcenter" tabindex="0" aria-controls="datatable-responsive" rowspan="1" colspan="1" aria-label="Image: activate to sort column ascending" style="width: 0px;text-align: center;">idFacebook</th>
	  	var admin =`<li>
		       			<a href="/admin" class="waves-effect"><i class="zmdi zmdi-view-dashboard"></i> <span> Dashboard </span> </a>
		    		</li>`;
		res.render("reportClick",{
			"name"  : req.user.displayName,
			"avatar": req.user.photos[0].value,
			"admin" : admin,
			"idFacebook": html
		})
	}else{
		res.redirect("/")
	}
});

module.exports = router;
