'use strict';
var table = $('tbody');
var sortItems = new SortItems;
var paginationUL = $('#pag');
var countItemsInSide = 50;
var countItemsReportClick = 50;
var country = $("#country");
var platform = $("#os");
var result = $("#result");
var download = $('#download-btn');
var sortOS = $("#os");
var sortCountry = $("#country");
var tagDownload = $("#download-btn");
var rowsTable = $("fixcenter");
var members = $("#members");
var search = $('#search');
function SortItems() {
	this.list;
	this.admin;
}
SortItems.prototype.getAPI = function(){
	$.post("/trackinglink", function(res) {
		sortItems.setData(res.offerList, res.admin)
	});
};
SortItems.prototype.setData = function(data, boolean){
	this.list = data;
	this.admin = boolean;
	table.empty();
	sortItems.render(countItemsInSide);
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
	var lengthofListOffers = this.list.length;
	$.each(this.list, function(index, val) {
		var pathRedirect = `http://${window.location.href.split("//")[1].split("/")[0]}/checkparameter/?offer_id=${index}&aff_id=${affID.isID}`;
		if(index < countItem){
			elementHtml += `<tr role="row" class="odd fixcenter sel-items" style="color: #fff">
								<td class="sorting_1" tabindex="0" style="color: #fff">${index}</td>
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
		console.log('click');
		sortItems.delEventDown();
		tagDownload.children().children().removeClass("fa-download").addClass('fa-spinner fa-pulse')
		sortItems.download("OfferList.txt")
	});
};
SortItems.prototype.delEventDown = function(argument){
	tagDownload.unbind('click');
};
SortItems.prototype.download = function(filename){
	var text = "";
	let affID = this.admin;
    $.each(this.list,function(index, el) {
        text+= `http://${window.location.href.split("//")[1].split("/")[0]}/checkparameter/?offer_id=${index}&aff_id=${affID.isID}|${el.countrySet}|${el.platformSet.toUpperCase()}\r\n`;
    });
    var blob = new Blob([text],{type:"octet/stream"});
    var url  = window.URL.createObjectURL(blob);
    $("#download").attr("href",url);
    $("#download").attr("download", filename);
    tagDownload.children().children().removeClass("fa-spinner fa-pulse").addClass('fa-download')
    sortItems.eventDown();
};
sortItems.getAPI();
window.onscroll = function(){
    sortItems.scroll();
}

// sortOS.change(function(event) {
// 	let valueOSSelect = event.target.value;
// 	let valueCountrySelect = sortCountry.val().toUpperCase();
// 	sortItems.sortList(valueCountrySelect, valueOSSelect);
// });
// sortCountry.change(function(event) {
// 	let valueOSSelect = sortOS.val();
// 	let valueCountrySelect = event.target.value.toUpperCase();
// 	sortItems.sortList(valueCountrySelect, valueOSSelect);
// });
// search.keyup(function(event) {
// 	let valueOSSelect = sortOS.val();
// 	let valueCountrySelect = sortCountry.val().toUpperCase();
// 	sortItems.sortList(valueCountrySelect, valueOSSelect, search.val());
// });
// refresh.click(()=>{
// 	window.location.href = window.location.href;
// })