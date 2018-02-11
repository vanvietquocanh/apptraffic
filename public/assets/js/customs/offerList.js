'use strict';
var table = $('#renderDataOffer');
var sortItems = new SortItems;
var paginationUL = $('#pag');
var countItemsInSide = 50;
var countItemsReportClick = 50;
var filterBtn = $("#filter");
var platform = $("#os");
var result = $("#result");
var download = $('#download-btn');
var sortOS = $("#os");
var sortCountry = $("#country");
var tagDownload = $("#download-btn");
var rowsTable = $("fixcenter");
var members = $("#members");
var search = $('#search');
var btnSearch = $("#btn-search");
var requestItems;
function SortItems() {
	this.pending;
	this.list;
	this.admin;
	this.searchMethod = false;
	this.countStart = 0;
	this.countEnd = 500;
}
SortItems.prototype.getAPI = function(){
	var data = {
		start : this.countStart,
		end   : this.countEnd
	}
	requestItems = $.post("/trackinglink", data, function(res) {
		if(res.mes){
		console.log(res.admin)
			sortItems.setData(res.offerList, res.admin, res.admin.pending, res.admin.approved)
			// if(res.offerList.length===500&&!sortItems.searchMethod){
			// 	sortItems.countStart += 500;
			// 	sortItems.countEnd += 500;
			// 	sortItems.getAPI();
			// }
		}else {
			console.log(res)
		}
	});
};
SortItems.prototype.setData = function(data, user, pending, approved){
	this.pending = pending;
	this.approved = approved;
	if(sortItems.countStart===0){
		this.pending = pending;
		this.approved = approved;
		this.list = data;
		this.admin = user;
		table.empty();
		sortItems.render(countItemsInSide);		
	}else{
		$.each(data, function(index, val) {
			sortItems.list.push(val)
		});
	}
};
SortItems.prototype.scroll = ()=>{
	var heightScreen = $("#datatable-responsive_wrapper").height();
	if($(window).scrollTop() > heightScreen/1000*690){
		table.empty();
		countItemsInSide=countItemsInSide+50;
		sortItems.render(countItemsInSide);
	}
}
SortItems.prototype.render = function(countItem){
	var elementHtml = "";
	var affID = this.admin;
	$.each(this.list, function(index, val) {
		var pathRedirect = `http://${window.location.href.split("//")[1].split("/")[0]}/checkparameter/?offer_id=${val.index}&aff_id=${affID.isID}`;
		elementHtml+=  `<div class="offerItems">
				            <ul class="offerItems-nonePd block-img">
				                <img class="image-logo" src="${val.imgSet}" alt="">
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
		switch (val.platformSet) {
			case "android":
				elementHtml += `<li class="style-list-of-items style-plat"><img class="img-opacity" src="./assets/images/android.png" alt=""></li>`;
				break;
			case "ios":
				elementHtml += `<li class="style-list-of-items style-plat"><img class="img-opacity" src="./assets/images/apple.png" alt=""></li>`;
				break;
		}
				elementHtml += `<li class="style-list-of-items style-name"><a class="text-nameApp" href="">${val.nameSet}</a></li>
				                </ul>
				                <li class="style-list-of-items flex-items fixline-text">
				                    <div class="content-info flex-left id-prevlink content-flex">
				                        <ul class="fix-margin custom-margin-respone">
				                        	<a class="text-block" href="">#${val.index}</a>
				                        </ul>
				                        <ul class="fix-margin custom-margin-respone"><a class="paytext" href="">$${new Number(val.paySet)}</a></ul>
				                    </div>
				                    <div class="content-info flex-left id-prevlink content-flex">
				                        <ul class="fix-margin "><a class="color-green prelink" href="${val.prevLink}"><i class="fa fa-external-link-square"></i>Preview</a></ul>
				                        <ul class="fix-margin "><a class="upper-case text-block" href="">${val.offerType}</a></ul>
				                    </div>
				                    <div class="content-info flex-left last-info line-1366 click-show-${index} goals-bnt content-flex">
				                        <ul class="fix-margin custom-margin-respone">
				                            <li class="flex-left" href="">KPIs<a class="box-green">!</a></li>
											<ul class="fix-margin-content-goals">
												<a style='display: none; line-height: 1.2em;'>${val.descriptionSet}</a>
											</ul>
				                        </ul>
				                    </div>
				                    <div class="content-info maxwidth-size line-1366 content-flex country-size-block">
				                        <ul class="offerItems-nonePd fix-margin flex-left country-size">
				                            <li class="style-list-of-items">
				                                <a class="upper-case text-block" href="#">${val.countrySet}</a>
				                            </li>
				                            <li class="style-list-of-items">`;
		if(val.categorySet===""){
				elementHtml +=		`<a class="" href="#">${val.categorySet}</a>`;
		}else{
				elementHtml +=		`<a class="boxcategory" href="#">${val.categorySet}</a>`;
		}
				elementHtml +=		`</li>
				                        </ul>
				                    </div>
				                    <div class="content-info center-btn content-flex resize-btn">
				                        <ul class="offerItems-nonePd container-btn">
				                            <button class="btn-content-request requestapp-${index}">
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
	sortItems.delEventDown();
	sortItems.deleventShowbtn();
	sortItems.eventDown();
	sortItems.eventShowbtn();
	sortItems.pending.forEach((items, index)=>{
		$(`.requestapp-${items.offerId}`).children("i").removeClass('fa-shopping-cart').addClass('fa-spinner fa-pulse');
		$(`.requestapp-${items.offerId}`).css("background","#10c469");
		$(`.requestapp-${items.offerId}`).children("p").html("Pending");
		$(`.requestapp-${items.offerId}`).unbind("click");
	})
};
SortItems.prototype.deleventShowbtn = function(){
	$(".btn-content-request").unbind('click')
}
SortItems.prototype.reqAPIApp = function(data, event){
	try {
		$.post('/userpost', data, function(data, textStatus, xhr) {
			if(data=="ok"){
			}
		});
	} catch(e) {
		sortItems.reqAPIApp(data, event)
	}
}
SortItems.prototype.eventShowbtn = function(){
	$(".btn-content-request").click(function(event) {
		$(`.${event.currentTarget.classList[1]}`).unbind('click');
		$(`.${event.currentTarget.classList[1]}`).children("i").removeClass('fa-shopping-cart').addClass('fa-spinner fa-pulse');
		$(`.${event.currentTarget.classList[1]}`).css("background","#10c469");
		$(`.${event.currentTarget.classList[1]}`).children("p").html("Pending");
		var data = {
			offerId : event.currentTarget.classList[1].split("requestapp-")[1]
		}
		sortItems.reqAPIApp(data, event)
	});
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
SortItems.prototype.eventDown = function(){
	tagDownload.click(function(event) {
		sortItems.delEventDown();
		tagDownload.children().children().removeClass("fa-download").addClass('fa-spinner fa-pulse')
		sortItems.download("OfferList.txt")
	});
};
SortItems.prototype.delEventDown = function(){
	tagDownload.unbind('click');
};
SortItems.prototype.download = function(filename){
	var text = "";
	let affID = this.admin;
    $.each(this.list,function(index, el) {
        text+= `http://${window.location.href.split("//")[1].split("/")[0]}/checkparameter/?offer_id=${el.index}&aff_id=${affID.isID}|${el.countrySet}|${el.platformSet.toUpperCase()}\r\n`;
    });
    var blob = new Blob([text],{type:"octet/stream"});
    var url  = window.URL.createObjectURL(blob);
    $("#download").attr("href",url);
    $("#download").attr("download", filename);
    tagDownload.children().children().removeClass("fa-spinner fa-pulse").addClass('fa-download')
    sortItems.eventDown();
};
sortItems.getAPI();

filterBtn.click(function(event) {
	if(platform.val()!=="all"||sortCountry.val()!=="all"){
		sortItems.searchMethod = true;
		requestItems.abort();
		sortItems.countStart = 0;
		filterBtn.children().removeClass("fa-search").addClass('fa-spin fa-refresh');
		var OS = "";
		var country = "";
		if(platform.val()!=="all"){
			OS = platform.val();
		}
		if(sortCountry.val()!=="all"){
			country = sortCountry.val();
		}
		let data = {
			OS 		: OS,
			country : country
		}
		$.post('/filter', data , function(data, textStatus, xhr) {
			filterBtn.children().removeClass("fa-spin fa-refresh").addClass('fa-search');
			sortItems.setData(data.offerList, data.admin, res.admin.pending, res.admin.approved)
		});
	}
});
btnSearch.click(function(event) {
	if(search.val()!=""){
		sortItems.searchMethod = true;
		requestItems.abort();
		sortItems.countStart = 0;
		var data = {
			query: search.val()
		}
		btnSearch.children().removeClass("fa-search").addClass('fa-spin fa-refresh');
		$.post('/search', data, function(res, textStatus, xhr) {
			btnSearch.children().removeClass("fa-spin fa-refresh").addClass('fa-search');
			sortItems.setData(res.offerList, res.admin, res.admin.pending, res.admin.approved)
		});
	}
});
