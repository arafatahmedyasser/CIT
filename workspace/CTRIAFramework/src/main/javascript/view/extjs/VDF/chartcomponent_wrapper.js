/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 * 
 */




Ext.namespace('iportal.chartcomponent.wrapper');

iportal.chartcomponent.wrapper = function(config){

var labelRB = CRB.getFWBundle();
var legendList=[];

/**
* These are the variables and functions are used for chartcomponents
**/
var generatedIds = "" ;				// Genrated ID Collection 
var divid = "" ;					// Genrated DivID 
var uniqueid = "" ;					// Genrated UniqueId  
var chartid = "" ;					// Genrated ChartID 
var nodeRenderer = "" ;				// Function for rendering the Node
var onClickOnNode = "";				// Function for click on the Node
var onClickOnFlowLine = "";			// Function for click on the FlowLine
var onMouseOverOnNode = "";			// Function for mouseOver on the Node
var onMouseOverOnFlowLine = "";		// Function for mouseOver on the FlowLine
var onMouseOutOnNode = "";			// Function for mouseOut on the Node
var onMouseOutOnFlowLine = "";		// Function for mouseOut on the FlowLine
var onDblClickOnNode = "";			// Function for double click on the Node
var onDblClickOnFlowLine = "";		// Function for double click on the FlowLine
var JSONstring = ""	;				// Data
var height = "";
var width = "";
var cpanel="";
var onNodeContextClick="";





	intialize();								// Intialize the data
	configureNode(config.nodeRenderer);			// It configures the nodeRenderer to the component
	
	configureNodeClick(config.nodeClick);		// It configures the click on the node to the component
	configureFlowClick(config.flowClick);		// It configures the click on the flowline to the component
	
	configureNodeOver(config.nodeOver);			// It configures the mouseOver on the node to the component
	configureFlowOver(config.flowOver);			// It configures the mouseOver on the flowline to the component
	
	configureNodeOut(config.nodeOut);			// It configures the mouseOut on the node to the component
	configureFlowOut(config.flowOut);			// It configures the mouseOut on the flowline to the component
	
	configureNodeDblClick(config.nodeDblClick);	// It configures the double click on the node to the component
	configureFlowDblClick(config.flowDblClick);	// It configures the double click on the flowline to the component
	
	configureJSONstring(config.data);			// It configures the input from the server to the component
	
	
	configureSize(config);			// It configures the size of the component
	configureNodeContextClick(config.contextclick);
	
	return getComponent(config.data);			// It returns the component








/**
* This Method is used to generate a uniquie id 
* @return uniqueid 
**/
function getUniqueId(){
	var check=false;
	var requiredId = "";
		while(!check){
			var randomNumber=Math.floor(Math.random()*10000)
			if(generatedIds.indexOf("["+randomNumber+"]")==-1)
				{
					generatedIds+="["+randomNumber+"]"
					check=true;
					requiredId = "1000"+randomNumber
					return requiredId;
				}
		}

}





/**
* This method is used to add a div element in the rendered page under which the chart is drawn
* @param id
**/
// Removed junk blank spaces - (After loading the application as Japanese language, its throwing script error) 
function addElement(id) {
		var chartsDivId = Ext.DomHelper.append(document.body, [{
			id : id,
			cls: 'chartContainer'
			}]);
}
//  Removed junk blank spaces - (After loading the application as Japanese language, its throwing script error)

/**
* This method is used to intialize the chart components
* It intialize by generating unique id , assigning empty function to actions , 
* 				default renderer to node create a div element under which chart is drawn
* @return chartId
**/
function intialize(){
	uniqueid = getUniqueId() ;
	onClickOnNode=function(){};
	onClickOnFlowLine=function(){};
	onMouseOverOnNode=function(){};
	onMouseOverOnFlowLine=function(){};
	onMouseOutOnNode=function(){};
	onMouseOutOnFlowLine=function(){};
	onDblClickOnNode=function(){};
	onDblClickOnFlowLine=function(){};
	onNodeContextClick=function(){};
	nodeRenderer=function(text,b,nid){ 
			var htmlStr = "" ;  
			var template_NodeText = new Ext.Template(
					'<div name="acctNodeText" class = "nodeText">',
						'Node',
					'</div>'
			);				  						
			
				htmlStr += template_NodeText.apply(text);
			
			
			return htmlStr ; 
	}	
	chartid = "ChartsApi";//+ uniqueid ;
	divid=chartid;
	addElement(divid);
	//height = 400;
	//width = 400;
	
}



function getText(val,width){
	if(val == 'null' || val == 'NULL' || val == undefined || val == null || val == '' ){
		return '';
	}
	var metaData='';
	var StringNumber = iportal.util.stringnumber.getInstance();
	var neededWidth = StringNumber.getNeededWidthNoEl(val,metaData);
	if(neededWidth > width){
		var writestring = StringNumber.getStringForWidth(val,width,metaData);
		writestring = writestring.substring(0,writestring.length-9).concat('..');
		
		// Fix for apostraphies and double quotes truncating on tooltips
		val = val.replace(/'/g, "&#145;");
		val = val.replace(/"/g, '&#34;');
		
		return '<div style="color:#006CA2;display:inline" ext:qtip="' + val + '">' + writestring + '</div>';
		
	}
		return val;
		
}

function getTextForNodeHeader(val,width,spanid){
	if(val == 'null' || val == 'NULL' || val == undefined || val == null || val == '' ){
		return '';
	}
	var metaData='';
	var StringNumber = iportal.util.stringnumber.getInstance();
	var neededWidth = StringNumber.getNeededWidthNoEl(val,metaData);
	iportal.liquidity.preferences.setAccNo(spanid,val);
	if(neededWidth > width){
		var writestring = StringNumber.getStringForWidth(val,width,metaData);
		writestring = writestring.substring(0,writestring.length-6).concat('..');
		
		// Fix for apostraphies and double quotes truncating on tooltips
		val = val.replace(/'/g, "&#145;");
		val = val.replace(/"/g, '&#34;');
		
		return '<div style="display:inline" ext:qtip="' + val + '">' + writestring + '</div>';
		
	}
		return val;
		
}




/**
* This method is used to configure the chart components - Node Renderer
**/
function configureNode(customRenderer){

	if( customRenderer != undefined)
	{
		nodeRenderer = customRenderer ;
	}

}

/**
* This method is used to configure the chart components - Input Data
**/
function configureJSONstring(data){
	
	if( data != undefined)
	{
		JSONstring = data ;
	}

}
/**
* This method is used to configure the chart action - Click on the Node 
**/
function configureNodeClick(nodeClick){

	if( nodeClick != undefined)
	{
		onClickOnNode = nodeClick;
	}

}


/**
* This method is used to configure the chart action - Click on the FlowLine 
**/
function configureFlowClick(flowClick){

	if( flowClick != undefined)
	{
		onClickOnFlowLine = flowClick;
	}

}

/**
* This method is used to configure the chart action - Mouse over the Node
**/
function configureNodeOver(nodeOver){

	if( nodeOver != undefined)
	{
		onMouseOverOnNode = nodeOver;
	}

}


/**
* This method is used to configure the chart action - Mouse over the FlowLine
**/
function configureFlowOver(flowOver){

	if( flowOver != undefined)
	{
		onMouseOverOnFlowLine = flowOver;
	}

}

/**
* This method is used to configure the chart action - Mouse out the Node
**/
function configureNodeOut(nodeOut){

	if( nodeOut != undefined)
	{
		onMouseOutOnNode = nodeOut;
	}

}

/**
* This method is used to configure the chart action - Mouse out the FlowLine
**/
function configureFlowOut(flowOut){

	if( flowOut != undefined)
	{
		onMouseOutOnFlowLine = flowOut;
	}

}


/**
* This method is used to configure the chart action - Double Click on the Node 
**/
function configureNodeDblClick(nodeDblClick){

	if( nodeDblClick != undefined)
	{
		onDblClickOnNode = nodeDblClick;
	}

}


/**
* This method is used to configure the chart action - Double Click on the FlowLine 
**/
function configureFlowDblClick(flowDblClick){

	if( flowDblClick != undefined)
	{
		onDblClickOnFlowLine = flowDblClick;
	}

}


/**
* This method is used to configure the chart action - Double Click on the FlowLine 
**/
function configureNodeContextClick(NodeContextClick){

	if( NodeContextClick != undefined)
	{
		onNodeContextClick = NodeContextClick;
	}

}


/**
* This method is used to configure the chart action - Double Click on the FlowLine 
**/
function configureSize(config){

	if( config.height != undefined)
	{
		height = config.height;
	}
		if( config.width != undefined)
	{
		width = config.width-15;
	}

}



/**
* This method is used to draw the chart components
**/	
function drawChart(JSONstring){
		if(true)
		{
			var nid= uniqueid;
		//	var chartData=JSONstring.ORGVIEW_CHART_LIST;
			cpanel= iportal.orgviewcomponent.OrgViewPanel();
			cpanel.setOuterDiv(chartid);
			cpanel.setNodeTextFormator(nodeRenderer);
			cpanel.setNodeID(parseInt(nid));
			cpanel.addChart(JSONstring);
			cpanel.nodeEventHandler("onclick",onClickOnNode);
			cpanel.lineEventHandler("onclick",onClickOnFlowLine);
			
			cpanel.nodeEventHandler("onmouseover",onMouseOverOnNode);
			cpanel.lineEventHandler("onmouseover",onMouseOverOnFlowLine);
			
			cpanel.nodeEventHandler("onmouseout",onMouseOutOnNode );
			cpanel.lineEventHandler("onmouseout",onMouseOutOnFlowLine);
			
			
			cpanel.nodeEventHandler("ondblclick",onDblClickOnNode );
			cpanel.lineEventHandler("ondblclick",onDblClickOnFlowLine);
				
			//cpanel.configure({nodeContextMenu:showAcctNodeContextMenu});
			
			cpanel.nodeEventHandler("onmousedown",function(){});
			cpanel.nodeEventHandler("contextclick",onNodeContextClick);
		}
	}


function getComponentId(){

	return "chartContainer"+divid;
}

function getInnercmp(){

	return cpanel;
}

//This function API for displaying the legend in the specified order.if any new color added to the legend this functionality has to get changed accordingly.
function sortLegend(legend_data){
	var x=0;
	var y=-1;
	var str_legend_data="";
	var out_legend_data=[];//['GREEN','BLUE','LEG_REPEATED','LEG_SUSPENDED'];
	str_legend_data=legend_data;
	
		if (str_legend_data.indexOf("ORANGE") > -1){
		out_legend_data[y+1]="ORANGE";
		}
		if (str_legend_data.indexOf("GREEN")> -1){
		out_legend_data[y+1]="GREEN";
		y=y+1;
		} 
		if (str_legend_data.indexOf("BLACK")> -1){
		out_legend_data[y+1]="BLACK";
		y=y+1;
		} 
		if (str_legend_data.indexOf("BLUE")> -1){
		out_legend_data[y+1]="BLUE";
		y=y+1;
		} 
		if (str_legend_data.indexOf("LEG_REPEATED")> -1){
		out_legend_data[y+1]="LEG_REPEATED";
		y=y+1;
		}
		if (str_legend_data.indexOf("LEG_SUSPEND")> -1){
		out_legend_data[y+1]="LEG_SUSPEND";
		y=y+1;
		}  
	return out_legend_data;
}


//This function API for displaying the legend based on configuration in Resorce bundle.
function rbLegendFilter(legend_data,legendValue){
	var out_legend_data=[];//['GREEN','BLUE','LEG_REPEATED','LEG_SUSPENDED'];
		if (legend_data.indexOf(legendValue)> -1){
			out_legend_data[out_legend_data.length]=legendValue;
		} 
	return out_legend_data;
}


//This API is used to return object which contains class and label values 
//for the corresponding legend 
function generatelegendHTMLFragment(){
	
}


function getLegend(JSONstring){
	
	var tb;
	//JSONstring = Ext.decode('{"ORGVIEW_CHART_LIST":[{"ACC_NO":"1000001001","typeOfStr":"BLUE","nodetype":"1","visibility":"2","text":{"BANK_CODE":null,"accountno":"1000001001","MAX_TXN_AMT":null,"acctno_metadata":"2010_1","INSTR_CCY_CODE":"CNY","currency":"CNY","INSTR_ACC_NAME":null,"SWIFT_CODE":null,"INSTR_ACC_NO":"1000001001","CUST_NAME":null,"HOST_ACCT_ID":"36","SUB_PROD":"ABT","ACC_ID":null,"COUNTRY_CODE":null,"name":"ABC Pty Ltd.","city":"Shanghai China","INSTR_BRANCH_CODE":null,"INSTR_BANK_NAME":null,"HOST_ID":null,"NO_OF_DECIMAL_PLACES":null,"STR_GROUP_ID":"85","ACC_CIF":null,"SRNO":"36","BRANCH_NAME":null,"ENTITY_NAME":null,"ACC_TYPE":null,"MIN_TXN_AMT":null,"HOST_REV_INDI_FLAG":null,"BALANCE_TYPES":null},"uniqueness":"true","flow":"1","children":[{"ACC_NO":"5000001002","typeOfStr":"BLUE","visibility":"2","text":{"BANK_CODE":null,"accountno":"5000001002","MAX_TXN_AMT":null,"acctno_metadata":"2010_1","INSTR_CCY_CODE":"CNY","currency":"CNY","INSTR_ACC_NAME":null,"SWIFT_CODE":null,"INSTR_ACC_NO":"5000001002","CUST_NAME":null,"HOST_ACCT_ID":"30","SUB_PROD":"ABT","ACC_ID":null,"COUNTRY_CODE":null,"name":"XYZ Pty Ltd","city":"Shanghai China","INSTR_BRANCH_CODE":null,"INSTR_BANK_NAME":null,"HOST_ID":null,"NO_OF_DECIMAL_PLACES":null,"ACC_CIF":null,"SRNO":"30","BRANCH_NAME":null,"ENTITY_NAME":null,"ACC_TYPE":null,"MIN_TXN_AMT":null,"HOST_REV_INDI_FLAG":null,"BALANCE_TYPES":null},"suspended":"false","uniqueness":"true","flow":"1","nodetype":"1","children":null,"instDetail":{"INSTR_SUB_MIN_DR_AMOUNT":"","INSTR_CAL_CODE":"","INSTR_REV_IND":"N","STR_TYPE":"HIERARCHY","INSTR_EXE_FREQ_UNIT2":"","LENDING_AMT":"","MIN_BAL":"0","INSTR_CR_MARGIN":"","INSTR_SUSP_END_DATE":"","INSTR_SUSP_STATUS":"NO","INSTR_EXEC_TIME":"","PERCENTAGE_AMT":"0","INSTR_FAILURE_LEVEL":"I","INSTR_SUSP_FLAG":"NO","INSTR_MASTER_CCY_CODE":"CNY","CREDIT_MARGIN":"","INSTR_SUB_BAL_TYPE":"CLR","STR_SUSP_FLG":"N","SUB_AC_SRNO":"30","INSTR_SUPP_OVERLAP":"N","INSTR_MIN_BALANCE":"0","AMOUNT":"12,000.00","STR_GROUP_ID":"85","INSTR_PERCENTAGE":"0","INSTR_MASTER_ACC_CCY":"CNY","EXEC_FREQ":"9","STR_PRIORITY":"3","BORROWING_AMT":"","INSTR_START_DATE":"26/06/2009","NEXT_ACTION_DATE":"2009-07-02","INSTR_EXEC_DATE":"","INSTR_FORCE_DEBIT":"N","INSTR_TRANSFER_AMOUNT":"12,000.00","INSTR_END_DATE":"","SUB_ACCTNAME":"MAPLETREELOG INTEGRATED (SHANGHAI)","INSTR_PRIORITY":"8","STR_ID":"227","INSTR_SUSP_START_DATE":"","INSTR_ID":"8","MASTER_ACCTBRANCH":"Shanghai China","INSTR_EXEC_MODE":"7","INSTR_SWP_TYPE":"Z","INSTR_MAX_BALANCE":"0","EXEC_MODE":"7","INSTR_EXE_FREQ":"8","ICL_ID":"","VISIBILITY":"BAE","INSTR_EXE_FREQ_UNIT1":"","TENOR":"","SUB_PROD":"ABT","INSTR_MASTER_BAL_TYPE":"CLR","MAX_BAL":"0","SWEEP_TYPE":"Z","INSTR_SUB_CCY_CODE":"CNY","INSTR_SUB_MAX_DR_AMOUNT":"","INSTR_EXE_FREQ_OPTION":"1","INSTR_MASTER_ACC_NO":"1747002937","INSTR_DR_MARGIN":"","MASTER_ACCTNAME":"MAPLETREELOG INTEGRATED (SHANGHAI)","INSTR_TERMINATION_FLG":"NO","INSTR_SUB_ACC_NO":"1747001954","MASTER_AC_SRNO":"36","INCO_POSITION_AMT":"","DEBIT_MARGIN":"","INSTR_SUB_ACC_CCY":"CNY","INSTR_SUB_MIN_CR_AMOUNT":"","INSTR_HOLIDAY_OPTION":"C","STR_FLG_END":"N","SUB_ACCTBRANCH":"Shanghai China","INSTR_SUB_MAX_CR_AMOUNT":""}}]}],"LEGEND_LIST":[{"img":"repeated_account.gif","text":"Repeated Accounts"},{"img":"suspended.gif","text":"Suspended"},{"img":"sweep_ins.gif","text":"Instruction"}]}');
	
	if(JSONstring!= undefined && JSONstring!=null && JSONstring.LEGEND_LIST != undefined && JSONstring.LEGEND_LIST!= null)
	{
		var legendData=JSONstring.LEGEND_LIST;
		
		var rbLegendList = LEGENT_LIST_CONFIG.split(',');
		
		if(legendData != undefined ){
			
				tb = new Ext.Toolbar({
					id:'legend',
					cls :'legend',
					items: [{
						xtype: 'tbfill'
						}]
				});
				
				legendData=sortLegend(legendData);
					if(!Ext.isEmpty(legendData)){
					legendList=legendData;
				}
		
				
				
				var legendHTML= '';
				var legendVal='';
				
				var rbLegendVal='';
				var rbLegendValContent='';
				var legend_template=new Ext.Template(
						'<div class={class}>&nbsp</div><font color="black">{label}</font>'
				);
				var legendValObj={
									
									'ORANGE':{'class':'orgLegendOrange','label':labelRB['LBL_LEG_ME']},
									'GREEN':{'class':'orgLegendGreen','label':labelRB['LBL_LEG_MB']},
									'BLACK':{'class':'orgLegendBlack','label':labelRB['LBL_LEG_INVESTSWEEP']},
									'BLUE':{'class':'orgLegendBlue','label':labelRB['LBL_LEG_SE']},
									'LEG_REPEATED':{'class':'orgLegendClone','label':labelRB['LBL_LEG_REPEATED']},
									'LEG_SUSPEND':{'class':'orgLegendSuspend','label':labelRB['LBL_LEG_SUSPENDED']}
									};
					
					for(var index= 0;index<legendList.length;index++){
						legendVal=legendValObj[legendList[index]];
	
					//if(!Ext.isEmpty(legendVal)){
					//	legendHTML= legend_template.apply(legendVal);
					//		tb.add(new Ext.BoxComponent({width:200,html:legendHTML}));
					//	}
	
					}
					
					
					for(var index= 0;index<rbLegendList.length;index++){
						rbLegendVal = rbLegendFilter(legendList,rbLegendList[index]);
						rbLegendValContent=legendValObj[rbLegendVal];
						if(!Ext.isEmpty(rbLegendValContent)){
							legendHTML= legend_template.apply(rbLegendValContent);
							tb.add(new Ext.BoxComponent({width:200,html:legendHTML}));
						}
						else
						{
							legendHTML = '';
						}
					}
					
		}
	}	
	return tb;
}

		
/**
* This method creates the container for chart and draws the chart within the container
* @return panel ChartPanel
**/
function getComponent(JSONstring){
	var panId = "chartContainer"+divid;
	
	
	var panel =new Ext.Panel({
				id:panId,
				contentEl:divid,
				bodyCssClass:'chartContainer',
				drawChart:drawChart,
				getComponentId:getComponentId,
				getLegend:getLegend,
				layout: 'fit',
				//buttons:tb,
				autoWidth:true,
				//autoHeight:true,
				getInnercmp:getInnercmp,
				height:height,
				listeners:{beforerender:function() {
					//drawChart(JSONstring);
				}
				}
				});
	
	return panel;
}




}



Ext.reg('iportal-orgview', iportal.chartcomponent.wrapper);
