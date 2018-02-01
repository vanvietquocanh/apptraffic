"use strict";
var table = $('tbody');
var sortItems = new SortItems;
var paginationUL = $('#pag');
var countItemsReportClick = 50;
var country = $("#country");
var platform = $("#os");
var result = $("#result");
var download = $('#download-btn');
var sortOS = $("#os");
var sortCountry = $("#country");
var tagDownload = $("#download");
var rowsTable = $("fixcenter");
var search = $('#search');
var refresh = $("#refresh")
function SortItems() {
	this.dataReportClick;
}
SortItems.prototype.getAPI = function(path){
	$.post(path, function(res) {
		sortItems.setDataReport(res);
	});
};
SortItems.prototype.setDataReport = function(data){
	this.dataReportClick = data;
	sortItems.renderReport(countItemsReportClick)
};
SortItems.prototype.renderReport = function(countItem) {
	var elementHtml = "";
	var lengthofListReportClick = this.dataReportClick.length;
	$.each(this.dataReportClick, function(index, val) {
		if(index < countItem){
			elementHtml += `<tr role="row" class="odd fixcenter sel-items" style="color: #fff">
								<td class="sorting_1" tabindex="0" style="color: #fff">${val.id}</td>
								<td class="sorting_1" tabindex="0" style="color: #fff">${val.appName}</td>
								<td class="sorting_1" tabindex="0" style="color: #fff">${val.name}</td>
								<td class="showItems-name">${val.idOffer}</td>
								<td style="color: #fff;">${val.time}</td>
								<td style="color: #fff;">${val.ip}</td>
								<td>${val.agent}</td>
								<td style="max-width:10px;">${val.country}</td>
								<td>${val.key}</td>
							</tr>`;
		}
	});
	table.append(elementHtml);
}
SortItems.prototype.scroll = ()=>{
	var heightScreen = $("#datatable-responsive_wrapper").height();
	console.log($(window).scrollTop(), heightScreen/1000*500)
	if($(window).scrollTop() > heightScreen/1000*500){
		table.empty();
		countItemsReportClick=countItemsReportClick+50;
		sortItems.renderReport(countItemsReportClick);
	}
}

// SortItems.prototype.download = function(filename){
// 	var text = "";
//     $.each(this.list,function(index, el) {
//         text+= `\r\n${el.url}|${(el.country[0])?el.country[0].country_code:""}|${el.name}|${el.id}|${el.platform.split(".png")[0].split("/images/")[1]}`;
//     });
//     var blob = new Blob([text],{type:"octet/stream"});
//     var url  = window.URL.createObjectURL(blob);
//     tagDownload.attr("href",url);
//     tagDownload.download = filename;
// };
// SortItems.prototype.sortList = function(valueCountrySelect, valueOSSelect, keySearch){
// 	if(valueCountrySelect === "ALL"){
// 		valueCountrySelect = "";
// 	}
// 	if(valueOSSelect==="all"){
// 		valueOSSelect = "";
// 	}
// 	var list = this.list.filter(function(items) {
// 		var nameApp;
// 		if(items.icon.name === undefined){
// 			nameApp = items.icon.id;
// 		}else{
// 			nameApp = items.icon.name;
// 		}
// 		if(items.country[0] === undefined || items.country[0] === null)
// 			return;
// 		else {
// 			return items.country[0].country_code.indexOf(valueCountrySelect)!==-1
// 					&& items.platform.split("./assets/images/")[1].split(".png").indexOf(valueOSSelect)!==-1
// 					&& nameApp.toUpperCase().indexOf(keySearch.toUpperCase())!==-1;
// 		}
// 	});
// 	table.empty();
// 	list.map(function(val, index){
// 		sortItems.render(null, val, index)
// 	})
// };
