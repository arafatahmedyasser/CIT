/**
 * 
 */

CGH.registerHandler('REPORT_DEF_EMPTY_VW', function (config)
{

	var panel = new Ext.Panel({

		html : '<b>Please select a report to edit or save</b>',
		renderTo : config.CONTAINER_ID,
		labelAlign : 'center'
	});

});

CWEH.registerHandler('WGT_AVL_REPORT', CWEC.CTAPPBEFOREINITIALIZE, function (){
	var obj=new canvas.informationRpt.InfoRptBtnListener()
	this.rootText= 'Reports';
	canvas.MessageBus.subscribe('refreshAvailableReports','canvas.inforeporting',this,obj.myfun);
});
CWEH.registerHandler('WGT_GEN_REPORT', CWEC.CTAPPBEFOREINITIALIZE, function (){
	var obj=new canvas.informationRpt.InfoRptBtnListener()
	canvas.MessageBus.subscribe('refreshGeneratedReports','canvas.inforeporting',this,obj.myfun);
});

CWEH.registerHandler('REPORT_DEF_EMPTY_APP', CWEC.CTAPPBEFOREINITIALIZE, function (){
	var obj=new canvas.informationRpt.InfoRptBtnListener()
	canvas.MessageBus.subscribe('loadReportFormApp','canvas.inforeporting',this,obj.loadReportFormApp);
	canvas.MessageBus.subscribe('loadReportEmptyApp','canvas.inforeporting',this,obj.loadReportEmptyApp);
});
CWEH.registerHandler('REPORT_DEF_FORM_APP', CWEC.FORM_BEFORE_INITIALIZE, function (fm){
	var reportData=CGH.getHandler('REPORTDATA');
	fm.extraParams=fm.extraParams?fm.extraParams:{};
	cbx.apply(fm.extraParams,reportData);
});
CWEH.registerHandler('WGT_AVL_REPORT', CWEC.TREE_CLICK, function (strid, strgpid, detail)
{

	var mvhObj = this.mvh;
	if (detail.id == "root")
	{
		// LOAD EMPTY WIDGET or do nothing

	} else
	{
		var reportData={
				'REPORT_ID':detail.REPORT_ID,
				'PARENT_REPORT_ID':detail.parentReportId,
				'REPORT_FUNC_CODE':detail.REPORT_FUNC_CODE,
				'REPORT_PRODUCT_CODE':detail.REPORT_PROD_CODE,
				'REPORT_SUB_PRODUCT_CODE':detail.REPORT_SUB_PROD_CODE
		};
		CGH.registerHandler('REPORTDATA',reportData);
		canvas.MessageBus.publish('loadReportFormApp');
	}

});

CWEH.registerHandler('REPORT_DEF_FORM_APP',CWEC.BBUT_CLICK, function (buttonId, e){
	var fm=this.mvh.getFormPanel();
	if(buttonId=='BTN_SAVE_EDIT'){
		fm.infoRptBtnHandler.saveReportDefinition(fm);
	}else if(buttonId=='BTN_RUN'){
		fm.infoRptBtnHandler.runReportDefinition(fm);
	}else if(buttonId=='BTN_SAVE_AND_RUN_EDIT'){
		fm.infoRptBtnHandler.saveRunreportDefinition(fm);	
	}else if(buttonId=='BTN_DELETE'){
		fm.infoRptBtnHandler.deleteReportDefinition(fm);
	}else if(buttonId=='BTN_RESET'){
		fm.infoRptBtnHandler.resetReportDefinitionForm(fm);
	}else if(buttonId=='BTN_SCHEDULE_REPORT'){
		fm.infoRptBtnHandler.saveReportDefinitionBeforeSchedule(fm);
	}
	if(buttonId=='BTN_RESET' || buttonId=='BTN_SCHEDULE_REPORT' ){
		// do nothing	
		}
	else{
		canvas.MessageBus.publish('loadReportEmptyApp');
	}
	
});
CWEH.registerHandler('WGT_AVL_REPORT', CWEC.TREE_CONTEXT_CLICK, function (groupField, groupValue, domid, e){

	if (groupValue.attributes.PARENT_REPORT_ID != '-1' && groupValue.attributes.id != 'root')
	{
		// e.stopEvent();
		// new cbx.contextMenu.contextMenuRenderer.getContextMenu(this,groupValue,e);
		var menu = new Ext.menu.Menu();
		var record = groupValue;
		var widObj = this;
		var rb =  CRB.getFWBundle();
		var rbCommon =  CRB.getFWBundle();
		menu.addItem({
			text : rbCommon['LBL_DELETE'],
			handler : function ()
			{
				if (record.attributes)
				{
					var mvhObj = widObj.mvh;
					var listener = new canvas.informationRpt.InfoRptBtnListener();
					var reportId = record.attributes.REPORT_ID;
					var is_scheduled = record.attributes.IS_SCHEDULED;
					var reportProdCode = record.attributes.REPORT_PROD_CODE;
					var reportSubProdCode = record.attributes.REPORT_SUB_PROD_CODE;
					var reportFuncCode = record.attributes.REPORT_FUNC_CODE;
					var child = record.hasChildNodes();
					var rb =  CRB.getFWBundle();
					if (child == true)
					{
						alert(rb['MSG_CANNOT_DEL_SYSTEM_RPT']);
					} else
					{
						listener.deleteReportDefinition(reportId, reportProdCode, reportSubProdCode, reportFuncCode,
									is_scheduled, mvhObj);
					}
				}
			}
		});
		x = e.browserEvent.clientX;
		y = e.browserEvent.clientY;
		menu.showAt([ x, y ]);
		Ext.getBody().on("contextmenu", Ext.emptyFn, null, {
			preventDefault : true
		});
	}

});
CWEH.registerHandler('WGT_GEN_REPORT', CWEC.CELL_CLICK, function (colId, colVal, record)
{
	var rb =  CRB.getFWBundle();
	var statusMsg = '';
	if (record.json.ERROR_MSG && record.json.ERROR_MSG != null)
	{
		statusMsg = "<BR/><BR/><b>" + rb['LBL_STATUS_MSG'] + " : </b>" + record.json.ERROR_MSG;
	}
	var successwin = new iportal.Dialog({
		dialogType : 'MESSAGE',
		title : rb['LBL_RPT_STATUS'],
		message : "<b>" + rb['LBL_RPT_NAME'] + " : </b>" + record.get('REPORT_NAME') + "<BR/><BR/><b>"
					+ rb['LBL_REF_NO'] + " : </b>" + record.json.REPORT_INSTANCE_ID + "<BR/><BR/><b>"
					+ rb['LBL_STATUS'] + " : </b>" +  record.json.STATUS // Added for IR_ENHANCEMENTS_001
					+ statusMsg,
		okHandler : function ()
		{
			successwin.close();
		}
	});
	successwin.show();

	this.svcch ? this.svcch.processCellClick(colId, colVal, record) : Ext.emptyFn;
});
CWEH.registerHandler('WGT_GEN_REPORT', CWEC.CONTEXT_CLICK, function (domid, colId, colVal, record, evt)
{
	var menu = new Ext.menu.Menu();
	var widObj = this;
	menu.addItem({
			hidden : !(record.json.RD_STATUS !== "DELETED"),
			text : 'RunNow',
			handler : function ()
			{
				var reportinstId = record.json.REPORT_INSTANCE_ID;
				var reportProdCode = record.json.OD_PRODUCT;
				var reportSubProdCode = record.json.OD_SUB_PRODUCT;
				var reportFuncCode = record.json.OD_FUNC_CODE;
				var mvhObj = widObj.mvh;
				var listener = new canvas.informationRpt.InfoRptBtnListener();
				listener.startRunNow(reportinstId, reportProdCode, reportSubProdCode, reportFuncCode, mvhObj);
			}
	});

	menu.addItem({
			hidden : !(record.json.STATUS == "PUBLISHED" || record.json.STATUS == "NOTIFIED" || record.json.STATUS == "NOTIFICATION_FAILED"),
			text : 'Download Report',
			handler : function ()
			{
				var reportinstId = record.json.REPORT_INSTANCE_ID;
				var mvhObj = widObj.mvh;
				var listener = new canvas.informationRpt.InfoRptBtnListener();
				var config = {
					record : record
				};
				listener.getDownloadReport(reportinstId, config); // updated by balesh for download report option.
			}
	});

	x = evt.browserEvent.clientX;
	y = evt.browserEvent.clientY;
	menu.showAt([ x, y ]);
	Ext.getBody().on("contextmenu", Ext.emptyFn, null, {
		preventDefault : true
	});
});
