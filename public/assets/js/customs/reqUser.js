'use strict';
var table = $('#renderDataOffer');
var sortItems = new SortItems;
var paginationUL = $('#pag');
var requestItems;
function SortItems() {
	this.admin;
	this.request;
	this.searchMethod = false;
	this.countStart = 0;
	this.countEnd = 500;
}
SortItems.prototype.getAPI = function(){
	requestItems = $.post("/listrequest", function(res) {
		console.log(res)
		// if(res.mes){
			sortItems.setData(res)
		// 	if(res.offerList.length===500&&!sortItems.searchMethod){
		// 		sortItems.countStart += 500;
		// 		sortItems.countEnd += 500;
		// 		sortItems.getAPI();
		// 	}
		// }else {
		// 	console.log(res)
		// }
	});
};
SortItems.prototype.setData = function(data){
	// if(sortItems.countStart===0){
		this.request = data;
		this.admin = data.affID;
		table.empty();
		sortItems.render();		
	// }else{
	// 	$.each(data, function(index, val) {
	// 		sortItems.list.push(val)
	// 	});
	// }
};
SortItems.prototype.render = function(){
	var elementHtml = "";
	var affID = this.admin;
	$.each(this.request, function(index, val) {
		// var pathRedirect = `http://${window.location.href.split("//")[1].split("/")[0]}/checkparameter/?offer_id=${val.index}&aff_id=${affID.isID}`;
		elementHtml+=  `<div class="offerItems">
				            <ul class="offerItems-nonePd block-img">
				                <img class="image-logo" src="${val.app.imgSet}" alt="">
				                <div class="respon-checkbox">
				                    <div class="checkbox checkbox-primary">
				                        <input id="checkbox2" type="checkbox" name="" value="">
				                        <label for="checkbox2">
				                        </label>
				                    </div>
				                </div>
				            </ul>
				            <ul class="offerItems-nonePd block-name-platform">
				                <ul class="container-name-platform fix-margin">`;
		switch (val.app.platformSet) {
			case "android":
				elementHtml += `<li class="style-list-of-items style-plat"><img class="img-opacity" src="./assets/images/android.png" alt=""></li>`;
				break;
			case "ios":
				elementHtml += `<li class="style-list-of-items style-plat"><img class="img-opacity" src="./assets/images/apple.png" alt=""></li>`;
				break;
		}
				elementHtml += `<li class="style-list-of-items style-name"><a class="text-nameApp" href="">${val.app.nameSet}</a></li>
				                </ul>
				                <li class="style-list-of-items flex-items fixline-text">
				                    <div class="content-info flex-left id-prevlink content-flex">
				                        <ul class="fix-margin custom-margin-respone">
				                        	<a class="text-block" href="">#${val.app.index}</a>
				                        </ul>
				                        <ul class="fix-margin custom-margin-respone"><a class="paytext" href="">$${new Number(val.app.paySet)}</a></ul>
				                    </div>
				                    <div class="content-info flex-left id-prevlink content-flex">
				                        <ul class="fix-margin "><a class="color-green prelink" href="${val.app.prevLink}"><i class="fa fa-external-link-square"></i>Preview</a></ul>
				                        <ul class="fix-margin "><a class="upper-case text-block" href="">${val.app.offerType}</a></ul>
				                    </div>
				                    <div class="content-info flex-left last-info line-1366 click-show-${index} goals-bnt content-flex">
				                        <ul class="fix-margin custom-margin-respone">
				                            <li class="flex-left" href="">KPIs<a class="box-green">!</a></li>
											<ul class="fix-margin-content-goals">
												<a style='display: none; line-height: 1.2em;'>${val.app.descriptionSet}</a>
											</ul>
				                        </ul>
				                    </div>
				                    <div class="content-info maxwidth-size line-1366 content-flex country-size-block">
				                        <ul class="offerItems-nonePd fix-margin flex-left country-size">
				                            <li class="style-list-of-items">
				                                <a class="upper-case text-block" href="#">${val.app.countrySet}</a>
				                            </li>
				                            <li class="style-list-of-items">`;
		if(val.app.categorySet===""){
				elementHtml +=		`<a class="" href="#">${val.app.categorySet}</a>`;
		}else{
				elementHtml +=		`<a class="boxcategory" href="#">${val.app.categorySet}</a>`;
		}
				elementHtml +=		`</li>
				                        </ul>
				                    </div>
				                    <div class="content-info center-btn content-flex resize-btn">
				                        <ul class="offerItems-nonePd container-btn">
				                            <button class="btn-content-request">
				                                <i class="fa fa-shopping-cart m-r-xs icon-btn"></i>
				                                <p class="text-btn">Request offer</p>
				                            </button>
				                        </ul>
				                    </div>
				                </li>
				            </ul>
				        </div>`;
	});
	table.append(elementHtml);
};
SortItems.prototype.eventShowbtn = function(){
	$(".goals-bnt").click(function(event) {
		var itemsClick = $(`.${$(event.target).parent().parent().attr("class").split("content-info flex-left last-info line-1366 ")[1].split(" ")[0]}`);
		if(itemsClick.attr("class").indexOf("active")!==-1){
			itemsClick.children().children('ul').children().fadeOut("slow");
			itemsClick.removeClass('active')
		}else{
			itemsClick.addClass('active')
			itemsClick.children().children('ul').children().fadeIn("slow");
		}
	});
};
sortItems.getAPI();