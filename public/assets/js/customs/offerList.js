'use strict';
var table = $('tbody');
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
			sortItems.setData(res.offerList, res.admin)
			if(res.offerList.length===500&&!sortItems.searchMethod){
				sortItems.countStart += 500;
				sortItems.countEnd += 500;
				sortItems.getAPI();
			}
		}else {
			console.log(res)
		}
	});
};
SortItems.prototype.setData = function(data, user){
	if(sortItems.countStart===0){
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
		if(index < countItem){
			elementHtml += `<tr role="row" class="odd fixcenter sel-items" style="color: #fff">
							<td class="sorting_1" tabindex="0" style="color: #fff">${val.index}</td>			
							<td class="sorting_1" tabindex="0" style="color: #fff">${val.offeridSet}</td>`;
			if(val.platformSet==="android"){
				elementHtml += `<td><img class="platformIcon" src="./assets/images/android.png" alt="" style="width: 30px;border-radius:15em;"></td>`;
			}else{
				elementHtml += `<td><img class="platformIcon" src="./assets/images/apple.png" alt="" style="width: 30px;border-radius:15em;"></td>`;
			}
				elementHtml += `<td><img src="${val.imgSet}" class="iconItems" alt="" style="width: 30px;border-radius:15em;"></td>
								<td class="showItems-name">${val.nameSet}</td>`;
			if(affID.isAdmin){
				elementHtml += `<td style="color: #fff;">${val.urlSet}</td>`;
			}else{
				elementHtml += `<td style="color: #fff;">${pathRedirect}</td>`;
			}
				elementHtml += `<td>${val.paySet}</td>
								<td>${val.capSet}</td>
								<td style="max-width:10px;">${val.countrySet}</td>
								<td> Click </td>
								<td> Conversion </td>
								<td> CVR </td>
							</tr>`;
		}
	});
	table.append(elementHtml);
	sortItems.delEventDown();
	sortItems.eventDown();
	if($(".iconItems")[0].width){
		setTimeout(()=>{
			var widthItem = `${$(".iconItems")[0].width}px`;
			$(".platformIcon").css("width",)
		},200)
	}
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
			sortItems.setData(data.offerList, data.admin, true)
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
			sortItems.setData(res.offerList, res.admin, true)
		});
	}
});
