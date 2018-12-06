<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%--
 *
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved.
 *
 --%>
<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ page import="com.intellectdesign.canvas.login.sessions.SessionInfo,
		com.intellectdesign.canvas.properties.MessageManager,
		com.intellectdesign.canvas.login.sessions.SessionManager"%>
<%@ taglib uri="/canvastags" prefix="cttags"%>
<%
	SessionInfo lSessionInfo = null;
	SessionManager lSessionManager = SessionManager.getInstance();
	lSessionInfo = lSessionManager.getUserSessionInfo(request);
	String langId = lSessionInfo.mLanguage;
%> 
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"> 
<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
<META HTTP-EQUIV="Expires" CONTENT="-1">

<cttags:canvasScriptInitalizer moduleId="ext" mergedName="ext.js"/>
<cttags:canvasScriptInitalizer moduleId="CT_CORE" mergedName="CT_CORE.js"/>
<cttags:canvasScriptInitalizer moduleId="CT_METADATA_JS" mergedName="CT_METADATA_JS.js"/>
<cttags:canvasScriptInitalizer moduleId="CT_METADATA_SER" mergedName="CT_METADATA_SER.js"/>
<cttags:canvasScriptInitalizer moduleId="FORMATTER" mergedName="FORMATTER.js"/>
<cttags:linkstyle themeId="DEFAULT" fontSizeId="small"/>
 


<STYLE type="text/css" > 
table.grid-table td {	
	font-family:arial;
}/*Print out Border*/
.group-details{
  	font-family:arial;
}	
table, table td,table th { 
	font-family:arial !important;
}
.printheader, .form-title{
	font-family:arial;
	font-size:16px;
	color:#000;
}

 .body{margin-left: 10px;}
  div {
  	color: #666666;
  	font: arial, tahoma, verdana, sans-serif;
  }
  /* <!-- DIT-7782 start --> */
  .printLogo{padding: 0px !important;
  height:80px;
  width:100%;
  background:url(../UIArena/theme/system/ext/images/headerlogo.png) no-repeat 0px 0px;
  }
  .printLogo1{padding: 0px !important; display: none;}
  .printbanner{
	display:none;
	}
 
  .group-details{
  	/*border-left: 1px solid;*/
  	padding-left: 0px;
  	width: 95%;
  	font: 13px;
  	font-family:arial;
  }
  .ext-gecko .ext-gecko3{overflow: auto !important;}
  .form-title{
  
	padding: 8px 0 4px 0px; height: 25px;
	font-weight: bold;
	font-size: 18px;
	font-weight: bold;
	}
	.bread-crumb{
	padding: 8px 0 4px 5px; height: 25px;
	font-weight: bold;
	font-size: 12px;
	}
	.last-updated-asof{
	padding: 8px 0 4px 5px; height: 25px;
	font-weight: bold;
	font-size: 12px;
	}
  .group-header{
  	width:92%; 
  	float:left; 
  	border-bottom:1px solid;
  	padding: 10px 0; 
  	font-size: 15px;
  	font-weight: bold;
  	
  }
  /*CHG006 */
    .group-key{
	  width:40%; 
	  float: left;
  	  padding:1px 0 1px 2px;
  	  font-size: 12px;
  	  word-wrap: break-word;
  	  font-weight: bold;
  	  padding-top: 7px;
   }

  /*CHG006 */
   .group-values, .amount-css{
  	width:45%; 
  	float: left; 
  	padding:2px 0 2px 4px;
  	word-wrap: break-word;
  	font-weight: normal;
  	font-size: 11px;
  	padding-left: 5px;
  	padding-top: 7px;
  } 
  .amount-css, .grid-table-td-amount{text-align:right; border: 1px solid }// CHG003_592
  .amount-css, .grid-table-td-amount{text-align:right; border: 1px solid !important;}
  .group-content{
  		width: 49%; 
  		/*border-bottom:1px solid; 
  		border-left:1px solid;
  		border-right:1px solid;
  		*/
  		float: left
  }
  .sub-header{width: 100%; font-weight: bold; font-size: 12px;}
  .page-break-class{
  	page-break-after: always;
  	padding: 2px;
  	font-weight:bold;
  }
  
  /*Grid-table css starts*/
  .grid-table{border: 1px solid; width: 100%; font-size:9px; cell-spacing:0px;border-collapse:collapse;padding:0px;}
  .grid-table-th{background:#00883C!important;color: #FFFFFF;} 
  
  .grid-table-td, .grid-table-th, .grid-table-td-amt, .grid-table-th-amt{border: 1px solid !important; }
  
  
 .grid-table-th, .grid-table-th-amt {font-weight: bold; padding: 2px;  //CHG003_592-start
 }
  .ext-ie6.grid-table-th, .grid-table-th-amt {font-weight: bold; padding: 2px; border:1px solid ;
 }   
  .grid-table-td-amt, .grid-table-th-amt {text-align:right;}
  
  .grid-table-td {padding: 1px; border:1px solid ;} 
  
  .form-grid-content{width: 100%;}
 
  .printbtn-dv{
 	  float: right;
    margin-right: 40px;
    margin-top: 30px;
   
  }
	.printicon{
	width:16px;
	height:16px;
	display:inline-block;
	color:#fff;
	background:url(../UIArena/theme/system/ext/images/tools/print.gif) 0px 0px no-repeat;
	
	}
	
	/* Amount for RTL */
	.grid-table-td-amt-rtl {
		text-align: left !important;
	}
	/* For Header in RTL */
	.grid-table-th-rtl {
		text-align: right !important
	}
	
	/* For CBX Logo RTL*/
	.printLogo-rtl {
		background-position: 100% 0px !important
	}
	
	/* For Print Icon RTL */
	.printbtn-dv-rtl {
		float: left !important
	}
	
@MEDIA print {
 
 .printLogo {
    background: url("../UIArena/theme/system/ext/images/headerlogo.png") no-repeat scroll 0 0 transparent;
    height: 80px;
    padding: 0 !important;
    width: 100%;
}
.printicon{
	visibility:hidden;
}
.printbtn-dv{
	visibility:hidden;
}
 
	.printLogo1{padding: 0px !important; display: block;}
	.grid-table{border: 1px solid; width: 100%;border-collapse:collapse; font-size:9px; cell-spacing:0px;}
  	.grid-table-td, .grid-table-th{border: 0px solid}
  	.grid-table-th {font-weight: bold; padding: 2px;}
  	@page {
	  size: A4 landscape;
	}
	.bread-crumb{
		padding: 8px 0 4px 5px; height: 25px;
		font-weight: bold;
		font-size: 11px;
	}
	.last-updated-asof{
		padding: 8px 0 4px 5px; height: 25px;
		font-weight: bold;
		font-size: 10px;
	}
	thead {display: table-header-group;}
	
	/*Print out Border UAT - 7554, 7550,7559, 7549 */
   table.grid-table {
	font-family: arial,sans-serif;
	font-size:11px;
	color:#333333;
	border-width: 1px;
	border-color: #666666;
	border-collapse: collapse;
   }
   table.grid-table th {
	border-width: 1px;
	padding: 8px;
	border-style: solid;
	border-color: #666666;
	background-color: #dedede;
}
	table.grid-table td {
	border-width: 1px;
	padding: 8px;
	border-style: solid;
	border-color: #666666;
	background-color: #ffffff;
}/*Print out Border*/
.group-details{
  	font-family:arial;
}	
table, table td { 
font-family:arial !important;
}
.printbanner{
	display:block;
	}
	.printheader{
font-family:arial;
font-size:16px;
color:#000;
}
}
</STYLE>
 

<script language="javascript"> 
 

/**
 *Updated the api doAmountFormat such that formatting of the amount's fractional
 * decimal number is based on the currency linked with the amount.
 * - Added a new paramater 'curr' which is the currency associated with the amount.
 * - If the curr is null or empty, get the default bank currency from the preference.
 * - if the default bank currency is null or empty, get the default currency maintained
 *   in the orbionedirect.properties file.
 * - get the list of currency-fractional places value data from the cache.
 * - get the number of fractional places for currency from the List.
 * - Use this fractional value for formatting by passing as a paramater in the sn.formatterFactory api.
 */
 
 function callprint(){
	 window.print(); 
 }
  
var doAmountFormat = function(val,curr){
	if(!Ext.isEmpty(val)){ 
   		val = String(val);
   		var sn = canvas.amountFormatter.getInstance();
   		var currDecimalPlaceList=cbx.globalcurrency.metadata.getCurrDecimalPlaceList();
   		var currency = curr;
   		var currBasedDecimal=2;  
		if (!currency || currency.trim() == '' || currency == '') {
			 
			currency = iportal.systempreferences.getDefaultBankCCY();
			if (!currency || currency.trim() == '' || currency == '') {
				 
				currency = cbx.globalcurrency.metadata.getDefaultCurrency();
			}
		}
		if (currency && currency != '' && currency.trim() != '') {
			var currList = currDecimalPlaceList;
			currBasedDecimal = currList[currency];
		}
		 
		val=sn.basicFormatter(val.replace(/,/g, ""),currBasedDecimal);
	if(val.startsWith('-') && !val.endsWith('-')){
   			if(iportal.preferences.getNegativeSignInAmountColumn() == false){
   				val = val.substring(1,val.length);
   				val =  '('+ val +')';
   			}
   			return val;
   		}
   		
   		return val; 
   	}else{
   		return '--';
   	}
}
var doDateFormat = function(val){
	if(!val){
		return '--';
	}
	var dateTimeArr = val.split(" ");
	if(dateTimeArr.length > 1){
		var _date = Date.parseDate(dateTimeArr[0],'d/m/Y');
		return _date.format(canvas.datePreferences.getDateFormat())+' '+dateTimeArr[1];
	}else{
		var _date = Date.parseDate(dateTimeArr[0],'d/m/Y');
		return _date.format(canvas.datePreferences.getDateFormat());
	}
}

 

var translatedValueList = {'LBL_INIT':'In Progress','LBL_QUEUED':'In Progress','LBL_IN_PROGRESS':'In Progress','LBL_GENERATED':'In Progress','LBL_PUBLISHED':'Generated','LBL_NOTIFIED':'Generated','LBL_ENTL_FAILURE':'Failed','LBL_QUOTA_AVAILABILITY_FAILURE':'Failed','LBL_PUBLISHER_FAILED':'Failed','LBL_NOTIFICATION_FAILED':'Failed','LBL_FAILED':'Failed'};
var doTranslatedValueFormat = function(val, viewBundleKey){
	if(cbx.isEmpty(val)){
		return '--';
	}else{
		var viewbundle = window.opener.CRB.getBundle(viewBundleKey);
		return cbx.isEmpty(viewbundle["LBL_"+val]) ? val : viewbundle["LBL_"+val];
	}
}

 
function isEmpty(inputStr){ 
	
	var resStr = null;
	if(inputStr == ""){
		resStr = "--"
	}else{
		resStr = inputStr;
	}
	return resStr;
}

 

function loadPreview(){
	var subjectID = '<%=request.getParameter("elementIdForConfirmationMsg")%>';
	var groupKey =  '<%= MessageManager.getMessage("common","PRINT_GROUP",langId)%>';
	var printModel = window.opener.IGPM[subjectID];
	var cssClass = Ext.isIE ? 'className' : 'class';
	var cell_spacing = Ext.isIE6 ? 'cellSpacing' : 'cellspacing';
	var css_rules = Ext.isIE ? 'Rules' : 'rules';
	var contentDiv;
	var newdiv;
	var newtable;
	if(printModel){
		 
		if(printModel.getMode && printModel.getMode() == 'form'){
			if(printModel.getPageHeader()){
				var title = document.getElementById('page-header');
				newdiv = document.createElement('div');
				newdiv.setAttribute(cssClass,'form-title');
				contentDiv = document.createTextNode(printModel.getPageHeader());
				newdiv.appendChild(contentDiv);
				title.appendChild(newdiv);
			}
			if(printModel.getFieldSets().length){
				var ob,ob1;
				for(var i = 0; i<printModel.getFieldSets().length; i++){
					ob = printModel.getFieldSets()[i];
					if(printModel.getFieldSets()[i].getSectionTitle()){
						var group = document.getElementById('print-content');
						newdiv = document.createElement('div');
						newdiv.setAttribute(cssClass,'group-header');
						contentDiv = document.createTextNode(printModel.getFieldSets()[i].getSectionTitle());
						newdiv.appendChild(contentDiv);
						group.appendChild(newdiv);	
					}							
					for(var j =0 ; j<ob.getFields().length; j++){
						ob1 = printModel.getFieldSets()[i].getFields()[j];
						
						for(var fieldsIndex = 0; fieldsIndex < ob1.getFields().length; fieldsIndex++){
							var fieldAtIndex = ob1.getFields()[fieldsIndex];
							for(var key in fieldAtIndex){
								var contentHTML = '';
								var outerContent = document.getElementById('print-content');
								newdiv = document.createElement('div');
								if(key.indexOf('IPORTAL_LABEL') != -1){
									newdiv.setAttribute(cssClass,key.substring(14,key.length));
									 
								}else if(key.indexOf('IPORTAL_HTML_LABEL') != -1){
									newdiv.setAttribute(cssClass,key.substring(19,key.length));
								 
								}else {
									newdiv.setAttribute(cssClass,'group-content');
								}
								var divId = Ext.id();
								newdiv.setAttribute('id',divId);
								outerContent.appendChild(newdiv);
								
								var innerContent = document.getElementById(divId);
								newdiv = document.createElement('div');
								newdiv.setAttribute(cssClass,'group-key');
								if(key.indexOf('IPORTAL_HTML_LABEL') != -1) {
									contentHTML = fieldAtIndex[key].replace(/\"/g,"'");
								}else if(key.indexOf('IPORTAL_LABEL') != -1){
									contentDiv = document.createTextNode(fieldAtIndex[key]);
								}else {
									contentDiv = document.createTextNode(key);
								}
								if(!contentHTML){
									newdiv.appendChild(contentDiv);
									innerContent.appendChild(newdiv);
								}else {
									 
									innerContent.innerHTML = contentHTML;;
								}
								
								newdiv = document.createElement('div');
								newdiv.setAttribute(cssClass,'group-values');
								
								if(key.indexOf('IPORTAL_LABEL') != -1){
									contentDiv = document.createTextNode(" ");
								}else if(fieldAtIndex[key]=='Select'){
									contentDiv = document.createTextNode("--");
								}else {
									contentDiv = document.createTextNode(isEmpty(fieldAtIndex[key]));
								}
								if(!contentHTML){
									newdiv.appendChild(contentDiv);
									innerContent.appendChild(newdiv);
								}else {
								 
									innerContent.innerHTML = contentHTML;;
								}
							}
						}
						
					}
					
				}
			}
			window.print();
			window.close();
		}else
		if(printModel.getMode && printModel.getMode() == 'grid'){
			var vPrintModel = {};
			Ext.apply(vPrintModel,printModel);
			vPrintModel.storeParamGrid.limit = '1000';
			if(vPrintModel.storeParamGrid.INPUT_ACTION == 'DRILL_DOWN_INVST_SMY'){
				vPrintModel.storeParamGrid.INPUT_ACTION ='DRILL_DOWN_INVST_SMY';
			}else {
				vPrintModel.storeParamGrid.INPUT_ACTION ='PRINT_ACTION';
			}
			vPrintModel.storeParamGrid[iportal.systempreferences.getCSRFKeyName()] = iportal.systempreferences.getCSRFUniqueId();
			Ext.Ajax.request({
				url : '<%=request.getContextPath()%>'+'/WidgetControllerServlet',
				success : function(resp,options){
					var allRecord = Ext.decode(resp.responseText);
					var allRecords = [];		
					
					var currencyCol="";
					
					if(allRecord){
						allRecords = allRecord.response.value.ALL_RECORDS;
					}					
					if(allRecords.length){
						var pageHeaders = vPrintModel.pageHeader;
						var columnHeaders = vPrintModel.columnHeadersGrid;
						var columnHeaderIDs = vPrintModel.columnHeaderIDGrid;
						var columnDataTypeGrid = vPrintModel.columnDataTypeGrid;
						var gridTitle = vPrintModel.gridTitle; 
						var data = [];
						var dataRec = [];
							 
							var linkedCurrColmap = vPrintModel.linkedCurrColums;
							 
							var amtfldindex = [];  
							var currfldindex = []; 
							for ( var obj in linkedCurrColmap) {
								if (linkedCurrColmap.hasOwnProperty(obj)) {
									for ( var prop in linkedCurrColmap[obj]) {
										if (linkedCurrColmap[obj].hasOwnProperty(prop)) {
											amtfldindex.push(columnHeaderIDs.indexOf(prop));
											if(columnHeaderIDs.indexOf(linkedCurrColmap[obj][prop])==-1)
												{
												currencyCol=linkedCurrColmap[obj][prop];
												currfldindex.push(columnHeaderIDs.length);
												}
											else
												currfldindex.push(columnHeaderIDs.indexOf(linkedCurrColmap[obj][prop]));
										}
									}
								}
							}
							 
							Ext.each(allRecords, function (record){
								dataRec = [];
								for ( var columnHeaderID in columnHeaderIDs) {
									dataRec[columnHeaderID]=record[columnHeaderIDs[columnHeaderID]];
								}
								for ( var columnIndex in record) {
									if(columnIndex==currencyCol)
									{
										dataRec[columnHeaderIDs.length] = record[columnIndex];
									}	
								}

								data.push(dataRec);
							});
						 
							if (gridTitle) {
								var gridTitleDiv = document.getElementById('page-title');
								newdiv = document.createElement('div');
								newdiv.setAttribute(cssClass, 'form-title');
								contentDiv = document.createTextNode(gridTitle);
								newdiv.appendChild(contentDiv);
								gridTitleDiv.appendChild(newdiv);
							}
							 
							if (pageHeaders) {
								var title = document.getElementById('page-header');
								newdiv = document.createElement('div');
								newdiv.setAttribute(cssClass, 'form-title');
								contentDiv = document.createTextNode(pageHeaders);
								newdiv.appendChild(contentDiv);
								title.appendChild(newdiv);
							}
						 
							var obTable = document.getElementById('print-content');
							newtable = document.createElement('table');
							var tableId = Ext.id();
							newtable.setAttribute(cssClass, 'grid-table');
							newtable.setAttribute('id', tableId);
							newtable.setAttribute(cell_spacing, '0');
							newtable.setAttribute(css_rules, 'all');
							obTable.appendChild(newtable);
							 

							if (columnHeaders.length) {
								var new_thead = document.createElement('thead');
								newtable.appendChild(new_thead);
								var new_tr = document.createElement('tr');
								new_thead.appendChild(new_tr);
								var new_th, new_td, datarow;
								for ( var colIndex = 0; colIndex < columnHeaders.length; colIndex++) {
									new_th = document.createElement('th');
									new_th.setAttribute(cssClass, 'grid-table-th');
									new_tr.appendChild(new_th);
									new_th.appendChild(document.createTextNode(columnHeaders[colIndex]));
									if(window.iportal.preferences.isLangDirectionRTL()) { 
										new_th.className += " grid-table-th-rtl" 
									}
								}
								var new_tbody = document.createElement('tbody');
								newtable.appendChild(new_tbody);

								for ( var rowIndex = 0; rowIndex < data.length; rowIndex++) {
									
										
									new_tr = document.createElement('tr');
									new_tbody.appendChild(new_tr);
									datarow = data[rowIndex];
									for ( var cellIndex = 0; cellIndex < datarow.length; cellIndex++) {
										
										if(!Ext.isEmpty(currencyCol) && cellIndex==datarow.length-1)
											break;

										new_td = document.createElement('td');
										new_td.setAttribute(cssClass, 'grid-table-td');
							
										new_tr.appendChild(new_td);
										 
										if (columnDataTypeGrid[cellIndex] == 'float'
													|| columnDataTypeGrid[cellIndex] == 'eqccy') {
											new_td.setAttribute(cssClass, 'grid-table-td-amount');
											if(window.iportal.preferences.isLangDirectionRTL()) { 
												new_td.className += " grid-table-td-amt-rtl";
											}
											 
											if (amtfldindex.length > 0) {
												for ( var i = 0; i < amtfldindex.length; i++) {
													if (cellIndex == amtfldindex[i]) {
														var amount = datarow[amtfldindex[i]]; 
														var curr = datarow[currfldindex[i]]; 
														 
														new_td.appendChild(document.createTextNode(doAmountFormat(
																	amount, curr)));
													}
												}
											} else {
												new_td.appendChild(document.createTextNode(doAmountFormat(
															datarow[cellIndex], null)));
											}

										 
										}

										 
										else if (columnDataTypeGrid[cellIndex] == 'time') {
											new_td.appendChild(document
														.createTextNode(doDateFormat(datarow[cellIndex])));
										}
										 
									else if(columnDataTypeGrid[cellIndex] == 'date'){
										new_td.appendChild(document.createTextNode(doDateFormat(datarow[cellIndex])));
									 
									}else if(columnDataTypeGrid[cellIndex] == 'translatedvalue'){
										new_td.appendChild(document.createTextNode(doTranslatedValueFormat(datarow[cellIndex], vPrintModel.viewBundleKey)));
								 
										}
									 
										else {
											new_td.appendChild(document.createTextNode(datarow[cellIndex]
														? datarow[cellIndex] : '--'));
										}
									}
								}
							}
						}
						 
					},
					failure : function (){

					},
					params : vPrintModel.storeParamGrid
				});
			} else {
				var columnHeaders = printModel.columnHeaders;
				var dataArray = [];
				dataArray = printModel.collapseData.copy();
				var primarilyGroupedBy = printModel.primarilyGroupedBy;
				var lastUpdatedAsOf = printModel.lastUpdatedAsOf;
				var amountColumnIndices = printModel.amountColumnIndices;
				lastUpdatedAsOf = lastUpdatedAsOf.replace(/&nbsp;/g, ' ');

				for ( var kIndex = 0; kIndex < dataArray.length; kIndex++) {
					var data = dataArray[kIndex];
					var bCumb = document.getElementById('print-content');
					newdiv = document.createElement('div');
					newdiv.setAttribute(cssClass, 'bread-crumb');
					if (kIndex != 0) {
						contentDiv = document.createTextNode(groupKey + data.pop());
					} else {
						contentDiv = document.createTextNode(groupKey + primarilyGroupedBy);
					}
					newdiv.appendChild(contentDiv);
					bCumb.appendChild(newdiv);

					var obTable = document.getElementById('print-content');
					newtable = document.createElement('table');
					var tableId = Ext.id();
					newtable.setAttribute(cssClass, 'grid-table');
					newtable.setAttribute('id', tableId);
					newtable.setAttribute(cell_spacing, '0');
					newtable.setAttribute(css_rules, 'all');
					obTable.appendChild(newtable);

					if (columnHeaders.length) {
						var new_thead = document.createElement('thead');
						newtable.appendChild(new_thead);
						var new_tr = document.createElement('tr');
						new_thead.appendChild(new_tr);
						var new_th, new_td, datarow;
						for ( var colIndex = 0; colIndex < columnHeaders.length; colIndex++) {
							new_th = document.createElement('th');
							if (amountColumnIndices.indexOf(colIndex) != -1) {
								new_th.setAttribute(cssClass, 'grid-table-th-amt');
							} else {
								new_th.setAttribute(cssClass, 'grid-table-th');
							}

							new_tr.appendChild(new_th);
							if (columnHeaders[colIndex] == 'group') {
								columnHeaders[colIndex] = "";
							}
							new_th.appendChild(document.createTextNode(columnHeaders[colIndex]));
						}
						var new_tbody = document.createElement('tbody');
						newtable.appendChild(new_tbody);
						for ( var rowIndex = 0; rowIndex < data.length; rowIndex++) {
							
							new_tr = document.createElement('tr');
							new_tbody.appendChild(new_tr);
							datarow = data[rowIndex];
							for ( var cellIndex = 0; cellIndex < datarow.length; cellIndex++) {
								new_td = document.createElement('td');
								if (amountColumnIndices.indexOf(cellIndex) != -1) {
									new_td.setAttribute(cssClass, 'grid-table-td-amt');
								} else {
									new_td.setAttribute(cssClass, 'grid-table-td');
								}

								new_tr.appendChild(new_td);
								datarow[cellIndex] = String(datarow[cellIndex]);

								if (datarow[cellIndex] == '' && datarow[cellIndex].trim() == '') {
									datarow[cellIndex] = '--';
								}
								new_td.appendChild(document.createTextNode(datarow[cellIndex]));
							}
						}
					}

					var title = document.getElementById('print-content');
					newdiv = document.createElement('div');
					newdiv.setAttribute(cssClass, 'last-updated-asof');
					contentDiv = document.createTextNode(lastUpdatedAsOf);
					newdiv.appendChild(contentDiv);
					title.appendChild(newdiv);

					newdiv = document.createElement('div');
					newdiv.setAttribute(cssClass, 'page-break-class');
					title.appendChild(newdiv);
					if (kIndex != dataArray.length - 1) {
						newdiv = document.createElement('div');
						newdiv.setAttribute(cssClass, 'printLogo1');
						title.appendChild(newdiv);
						var newimg = document.createElement('img');
						 
						newimg.setAttribute('src', "");  
						newdiv.appendChild(newimg);
					}
				}
			 
			}
		}
		if(window.iportal.preferences.isLangDirectionRTL()) {
			document.body.style.direction='rtl';
			var printLogoDiv = document.getElementsByClassName("printLogo")[0];
			printLogoDiv.className += " printLogo-rtl";
			
			
			var printbtnDiv = document.getElementsByClassName("printbtn-dv")[0];
			printbtnDiv.className += " printbtn-dv-rtl";
			
		}
	
}


</script>
 
</HEAD>
<BODY  onload="javascript:loadPreview(); " >
 
 <div class="printLogo">  
 <div class="printbanner"></div>
		 
		<div align="center" class="printLabel"></div>

 
	<div class="printbtn-dv"><a class="printicon" href="javascript:void(0)" onclick="javascript:callprint()" title="Print"></a></div> 
		</div>
 
<div >
	
	
	<!-- Form Title window.print();window.close();-->
	<!-- //Gagan : Fix: ST-770 Starts-->
	<div id="page-title" align="center">
	</div>
	<!-- //Gagan : Fix: ST-770 Ends -->	
	<div id='page-header' class="printheader">
		
	</div>
    <!-- Booking Details -->
    <div id='print-content'class='group-details'> 
    
    </div>
    

</div>
</BODY>
</HTML>

