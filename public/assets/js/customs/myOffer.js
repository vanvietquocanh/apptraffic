'use strict';
var sortItems = new SortItems;
var paginationUL = $('#pag');
var countItemsInSide = 50;
var countItemsReportClick = 50;
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
			alert("load xong")
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
SortItems.prototype.render = function(countItem){
	var elementHtml = "";
	var affID = this.admin;
	$.each(this.list, function(index, val) {
		elementHtml+= `<div class="grid-table">
					        <div class="grid-table-block">
					             <div class="grid-table-block-pay">
					                <ul class="grid-table-block-image">
					                    <img class="${val.imgSet}" alt="appflood">
					                </ul>
					                <ul class="grid-table-block-name">
					                    <li class="text-grid name-app">${val.nameSet}</li>
					                </ul>
					                <ul class="grid-table-block-CPI">
					                    <li class="text-grid keys_value">CPI</li>
					                    <li class="text-grid valueOf">$99 <i class=""></i></li>
					                </ul>
					            </div>
					            <div class="grid-table-block-info">
					                <ul class="grid-table-block-info-geo">
					                    <li class="text-grid keys_value">Geo</li>
					                    <li class="text-grid valueOf">JP</li>
					                </ul>
					                <ul class="grid-table-block-info-category">
					                    <li class="text-grid keys_value">Category</li>
					                    <li class="text-grid valueOf"></li>
					                </ul>
					            </div>
					            <ul class="btn-approved">
					                <button id="btnApproved">Approved</button>
					            </ul>
					        </div>
					        <div class="fixed-item">
					            <ul class="fixed-item-content">
					                <button id="btnLink"><i class="fa fa-chain"></i></button>
					            </ul>
					        </div>
					    </div>`;
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
