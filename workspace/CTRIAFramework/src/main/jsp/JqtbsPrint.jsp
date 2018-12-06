<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib uri="/canvastags" prefix="cttags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
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
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
<META HTTP-EQUIV="Expires" CONTENT="-1">

<cttags:canvasScriptInitalizer moduleId="ext" mergedName="ext.js"/>
<cttags:canvasScriptInitalizer moduleId="CT_CORE" mergedName="CT_CORE.js"/>
<cttags:canvasScriptInitalizer moduleId="CT_METADATA_JS" mergedName="CT_METADATA_JS.js"/>
<cttags:canvasScriptInitalizer moduleId="CT_METADATA_SER" mergedName="CT_METADATA_SER.js"/>
<cttags:canvasScriptInitalizer moduleId="FORMATTER" mergedName="FORMATTER.js"/>
<cttags:canvasScriptInitalizer moduleId="jqtbs_CT_VIEW_BASE" mergedName="jqtbs_CT_VIEW_BASE.js"/>
<cttags:linkstyle themeId="DEFAULT" fontSizeId="small"/>

<script src="../javascript/combine/jqtbs.js"></script>
<link rel="stylesheet" href="../UIArena/theme/system/jqtbs/structure/jqtbs-structure.css">

<style type='text/css'>
	.center {
  width: 700px ;
  margin-left: auto ;
  margin-right: auto ;
  text-align:center;
  }
  
	.printheader{
	font-family:arial;
	font-size:16px;
	color:#000;
	}
	.body{margin-left: 10px;}
	.printLogo{padding: 0px !important;
 		height:80px;
  		width:100%;
  		background:url(../UIArena/theme/system/ext/images/headerlogo.png) no-repeat 0px 0px;
  	}
  	.printbanner{
		display:none;
	}
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
	#print-content {
		margin: 45px;
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
 
	
  	@page {
	  size: A4 ;
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
</style>
<title>Canvas Technology</title>

</head>
<body>
	 <div class="printLogo">  
 		<div class="printbanner"></div>
		<div align="center" class="printLabel"></div>
		<div class="printbtn-dv"><a class="printicon" onclick="window.print()" title="Print"></a></div>
 	</div>
	
	
	<div id="page-title" align="center">
	</div>
	
	<div id='page-header' class="printheader">	
	</div>
  	
    <div id='print-content' class='group-details'>
    	<div class='title' align="center"></div>
    	<div align="right" class='info'>
    	</div>
    </div>
    
</body>

<script type="text/javascript">
function alignData(type,tdata) {
	if(type=='date' || type== 'float' || type== 'time' || type== 'int' || type== 'percentage' || type== 'rate' ) {
		tdata.css("text-align","right");
	} else {
		tdata.css("text-align","left");
	}
	
}
function formatData(format, value, metadata) {
    if (!format) return value;
    switch (format.toUpperCase()) {
        case "DATE":
            var inFormat = 'd/m/Y';
            if (!value) {
                value = "";
            }
            if (!cbx.isDate(value)) {
                value = new Date.parseDate(value, inFormat);
            }
            value = value.dateFormat("m/d/Y");
            return value;
            break;
        case "AMOUNT":
        case "FLOAT":
            var islinkedCurrAvail = false;
            var curr = metadata.LINKED_SOURCE_CCY;
            var currAppend = metadata.FLD_APPEND_CURRENCY_MODE || '';
            var currDecimalPlaceList = cbx.globalcurrency.metadata.getCurrDecimalPlaceList();
            var currList = currDecimalPlaceList;
            var val = value;
            if (currList != null) {
                var currDecForLinkedCurr = currList[curr];
                if (currDecForLinkedCurr != undefined && currDecForLinkedCurr.trim() != '') {
                    (islinkedCurrAvail = true);
                }
            }
            var currBasedDecimal = 2;
            if (!cbx.isEmpty(val)) {
                if (!curr || curr.trim() == '' || curr == '') {
                    curr = iportal.systempreferences.getDefaultBankCCY();
                    if (!curr || curr.trim() == '' || curr == '') {
                        curr = cbx.globalcurrency.metadata.getDefaultCurrency();
                    }
                }
                if (curr && curr != '' && curr.trim() != '') {
                    currBasedDecimal = currList[curr];
                }
                try {
                    if (val.charAt(0) == ".") {
                        val = "0" + val;
                    }
                } catch (err) {}
                
                val = new String(val);
                var sn = iportal.util.stringnumber.getInstance();
                val = sn.formatterFactory[iportal.preferences.getAmountFormat()](val.replace(/,/g, ""), currBasedDecimal);
                if (islinkedCurrAvail == true) {

                    if (currAppend == "PREFIX") {
                        val = curr + " " + val;
                    } else if (currAppend == "POSTFIX") {
                        val = val + " " + curr;
                    }
                } else {
                    val = val;
                }
            }
            value = val;
            return value;
            break;
        case "STRING":

            var width = 10; // config
            var drillDownReq = metadata.DRILLDOWN_IND;
            if (cbx.isEmpty(value) || (cbx.isString(value) && value.length < 1)) {
                return "--";
            } else {
                if (width < Math.floor(iportal.preferences.getAverageFontWidth() * value.length)) {
                    value = value.replace(/'/g, "&#145;");
                    value = value.replace(/"/g, '&#34;');
                }
            }
            return value;
            break;
        case "PERCENTAGE":
            var align = 'right';
            if (!cbx.isEmpty(value)) {
                var v = value + ' %';
                return v;
            } else {
                return "--";
            }
            break;
        case "TRANSLATEDVALUE":
            var rb = CRB.getBundle(this.bundleKey) || CRB.getFWBundle();
            if (!cbx.isEmpty(value)) {
                value = new String('LBL_' + value);
                try {
                    if (rb[value] == undefined) {
                        value = '?' + value + '?';
                    } else {
                        value = rb[value];
                    }
                } catch (e) {
                    value = '?' + value + '?';
                }
                return value;
            } else {
                return "--";
            }
            break;
         default:
            return value;
    }
    return value;
}
var widgetID = "${param.elementIdForConfirmationMsg}";
var viewDef = window.opener.IMM.getViewDefinition(widgetID);
var viewID = viewDef.md.VIEWS_LIST[0].VIEW_ID;
var viewMD = viewDef.md.VIEW_MD;
var viewType = viewMD.FLD_VIEW_TYPE;
var viewHeader = viewMD.FLD_COLUMN_LIST;
var bundleKey = viewMD.FLD_BUNDLE_KEY;


var rb = window.opener.CRB.getBundle(bundleKey) || window.opener.CRB.getFWBundle();
var title = rb[viewMD.VIEW_DISPLAY_NM] || viewMD.VIEW_DISPLAY_NM; 
var params = window.opener.IGPM.params;
var url='<%=request.getContextPath()%>'+'/WidgetControllerServlet';


if(viewType =="CLASSIC_GRID" || viewType =="LIST" || viewType =="PAGING" || viewType =="PROPERTY" || viewType =="ADVGROUP" || viewType =="GROUP") {
	var viewData = window.opener.IMM.getViewMetaData(viewID);
	
	$.ajax({
		url: url,
		data: params,
		success: function(data) {
			var data = JSON.parse(data);
			var totalCount = data.response.value.ADDITIONAL_DATA.TOTAL_NUM_RECORDS;
			var updatedTime = data.response.value.ADDITIONAL_DATA.LAST_UPDATED_DT_TM;
			var records = data.response.value.ALL_RECORDS;
			$("#print-content .title").append("<p><b>"+title+"</b></p>");
			$("#print-content .info").append("<p><b>Report generated on : "+updatedTime+"</b></p>");
			$("#print-content .info").append("<p><b>Total Number of records : "+totalCount+"</b></p>");
			$("#print-content").append("<center><div><table><caption></caption><thead><tr class='info'></tr></thead><tbody></tbody></table></div></center>");
			$(document).find("div table").addClass("table table-condensed table-striped table-bordered table-hover ct-listview");
			$.each(viewHeader,function(index,value){
				if(value.FLD_COLUMN_ID != "CONTEXT" && value.FLD_HIDDEN_IND != "Y") {
					var columnID = value.FLD_COLUMN_ID;
					var columnName = rb['LBL_'+value.FLD_COLUMN_DISPLAY_NAME_KEY]|| value.FLD_COLUMN_DISPLAY_NAME_KEY;       //LBL_ added for taking values from property file
					var thead = $("<th/>",{
						text: columnName
					});
					$(document).find("table thead tr").append(thead);
				}
			});
			$(document).find("div table thead tr th").css("text-align","center");
			$.each(records,function(index,value){
				var trow = $("<tr/>");
				$.each(viewHeader,function(i,v){
					if(v.FLD_COLUMN_ID != "CONTEXT" && v.FLD_HIDDEN_IND != "Y") {
						var type = v["FLD_DATA_TYPE"];
						var data = value[v["FLD_COLUMN_ID"]];
						data = formatData(type,data,v);
						
						var tdata = $("<td>", {
							text: data
						});
						alignData(type,tdata);
						$(trow).append(tdata);
						$(document).find("table tbody").append(trow);	
					}
				});
			});
		}
	});

} else if (viewType == "CHART") {
	var svg = params.HTMLDATA;
	$(document).find("#print-content").append("<center><p><b>"+title+"</b></p></center>");
	$("#print-content").append("<center>"+svg+"</center>");
	$("#print-content").addClass("center");
}

</script>
</html>