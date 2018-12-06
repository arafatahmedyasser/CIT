cbx.ns("canvas.lib");
canvas.lib.saveAsRevert = Class({
	constructor : function (config)
	{
		this.scope = config.scope;
		this.defaultHandler();

	},
	defaultHandler : function ()
	{
		var that = this;
		

	},
	updateRemoveView : function (viewId, viewType)
	{
		var that = this;
		if (viewId != this.scope.md.getSystemViewId())
		{
			var obj = {}, jsonData, params = {};
			obj._sortInfo = this.scope.renderer.sortInfo;
			obj._colProperties = this.scope.renderer.headerArrayContent;
			obj._colFilters = this.scope.renderer.saveAsColFilters;
			jsonData = cbx.encode(obj);
			params.INPUT_FUNCTION_CODE = this.scope.md.md.VIEW_MD.FUNCTION_CODE;
			params.INPUT_PRODUCT = this.scope.md.md.VIEW_MD.PRODUCT_CODE;
			params.INPUT_SUB_PRODUCT = this.scope.md.md.VIEW_MD.SUB_PRODUCT_CODE;
			params.JSON_DATA = jsonData;
			params.PAGE_CODE_TYPE = "WIDGET_PREFERENCE";
			params.PRODUCT_NAME = "CUSER";
			params.SYSTEM_VIEW_ID = this.scope.md.md.VIEW_MD.SYSTEM_VIEW_ID;
			params.VIEW_ID = viewId;
			params.WIDGET_ID = this.getWidgetId();
			params[iportal.systempreferences.getCSRFKeyName()] = iportal.systempreferences.getCSRFUniqueId();
			if (viewType == "remove")
			{
				var bundle = CRB.getBundle(CRB.getFWBundleKey())
				var removeDialog = new canvas.Dialog({
					title : bundle['LBL_CHANGE_PICTURE'],
					message : "Do you want to remove the app ?",
					dialogType : "USERDEFINED",
					dialogStyle : "OK_CANCEL",
					okHandler : function ()
					{
						params.INPUT_ACTION = "PREF_DELETE_ACTION";
						that.removeViewFlag = true;
						that.switchDoAjax(params);
						this.close();
					}
				});
				removeDialog.show();
			} else if (viewType == "update")
			{
				params.INPUT_ACTION = "PREF_SAVE_ACTION";
				this.updateViewFlag = true;
				this.switchDoAjax(params);
			}

		} else
		{
			var removeDefaultViewError = new canvas.Dialog({
				dialogType : 'ERROR',
				message : 'WIDGET_PREFERENCE_REMOVE_ERROR_MSG',
				title : 'LBL_REMOVE_PREFS'
			});
			removeDefaultViewError.show();
		}

	},
	afterSaveAsRevertParams : function (obj)
	{
		var that = obj.thatScope;
		var params = {};
		that.afterSaveAsRevertFlag = true;
		params.INPUT_ACTION = 'INIT_VIEW';
		params.PAGE_CODE_TYPE = 'VDF_CODE';
		params.PRODUCT_NAME = this.scope.md.md.VIEW_MD.PRODUCT_CODE;
		params.INPUT_FUNCTION_CODE = this.scope.md.md.VIEW_MD.FUNCTION_CODE;
		params.INPUT_SUB_PRODUCT = this.scope.md.md.VIEW_MD.SUB_PRODUCT_CODE;
		params.__LISTVIEW_REQUEST = 'Y';
		params.INPUT_PRODUCT = this.scope.md.md.VIEW_MD.PRODUCT_CODE;
		params.INPUT_LANGUAGE_ID = 'en_US';
		params.__PIGGYBACKREQUEST = 'Y';
		params.WIDGET_ID = obj.widgetId;
		params.VIEW_ID = obj.VIEW_ID;
		that.switchDoAjax(params);

	},

	switchDoAjax : function (params)
	{
		var that = this;
		cbx.ajax({
			params : params,
			success : function (data)
			{

				var config = {
					md : data
				};
				if (that.removeViewFlag)
				{
					var removeSuccess = new canvas.Dialog({
						dialogType : 'MESSAGE',
						message : 'WIDGET_PREFERENCE_REMOVE_SUCCESS_MSG',
						title : 'LBL_NUM_ALERT'
					});
					removeSuccess.show();
					that.scope.portlet.viewId = "";
					that.removeViewFlag = false;
					var obj = {
						VIEW_ID : data.SYSTEM_VIEW_ID,
						removeViewId : data.VIEW_ID,
						widgetId : data.WIDGET_ID,
						thatScope : that
					};
					that.removeViewObj = {};
					that.removeViewObj = obj;

					that.afterSaveAsRevertParams(obj);
				} else if (that.updateViewFlag)
				{

					that.updateViewFlag = false;
					var obj = {
						VIEW_ID : data.VIEW_ID,
						widgetId : data.WIDGET_ID,
						thatScope : that
					};
					that.afterSaveAsRevertParams(obj);
				} else if (that.saveViewFlag)
				{
					var saveSuccess = new canvas.Dialog({
						dialogType : 'MESSAGE',
						message : 'PREFERENCE_SAVE_SUCCESS',
						title : 'LBL_NUM_ALERT'
					});
					if(data.success){
						saveSuccess.show();
					}
					that.saveViewFlag = false;
					that.saveMenu = true;
					var obj = {
						VIEW_ID : data.VIEW_ID,
						widgetId : data.WIDGET_ID,
						thatScope : that
					};
					that.afterSaveAsRevertParams(obj);

				} else if (that.afterSaveAsRevertFlag)
				{
					var data = config.md.response.value;
					that.afterSaveAsRevertFlag = false;
					that.data = data
					IMM.getAppMetadata(that.widID || that.getWidgetId(), 1, that.widgetMetaData, that, true);

				}

			}
		});
	},
	widgetMetaData : function (md)
	{
		var vmd = {};
		var that = this;
		if (that.saveMenu)
		{
			var obj = {};
			that.saveMenu = false;
			obj.VIEW_ID = that.data.VIEW_MD.VIEW_ID;
			obj.VIEW_DISPLAY_NM = that.data.VIEW_MD.VIEW_DISPLAY_NM;
			obj.OD_GCIF = that.data.VIEW_MD.FLD_OD_GCIF;
			obj.OD_USER_NO = that.data.VIEW_MD.FLD_OD_USER_NO;
			md.md.VIEWS_LIST.push(obj);
		}
		if (!cbx.isEmpty(that.removeViewObj))
		{

			md.md.VIEWS_LIST = md.md.VIEWS_LIST.filter(function (el)
			{
				return el.VIEW_ID !== that.removeViewObj.removeViewId;
			});
			that.removeViewObj = {};
		}
		vmd.VIEW_MD = that.data.VIEW_MD;
		vmd.CONTEXT_MENU_LIST = md.md.CONTEXT_MENU_LIST;
		vmd.VIEWS_LIST = md.md.VIEWS_LIST;
		vmd.VIEW_ADDL_MD = that.data.VIEW_ADDL_MD;
		vmd.WIDGET_ID = that.widID || that.getWidgetId();
		CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getConstant(md.getViewType() + "_VIEW"), function ()
		{

			that.scope.portlet.refreshView(vmd);

		});
	},
	getWidgetId : function ()
	{
		var widID = "";
		if (this.scope.viewConf.parentPortlet && this.scope.viewConf.parentPortlet.CONTAINER_FLAG == "Y")
		{
			var childWidgets = this.scope.parentPortlet.md.md.CHILD_WIDGETS;

			for (var i = 0; i < childWidgets.length; i++)
			{
				var viewsList = childWidgets[i].VIEWS_LIST;
				for (j = 0; j < viewsList.length; j++)
				{
					if (viewsList[j].VIEW_ID == (this.scope.listViewMD.SYSTEM_VIEW_ID || this.scope.listViewMD.viewMD.SYSTEM_VIEW_ID))
					{
						widID = childWidgets[i].WIDGET_ID;
						break;
					}
				}
			}
		} else
		{
			widID = this.scope.viewConf.WIDGET_ID;
		}
		return widID;
	},
	saveView : function ()
	{
		var me = this;
		this.saveParams={};
		var obj = {}, jsonData;
		obj._sortInfo = this.scope.renderer.sortInfo;
		obj._colProperties = this.scope.renderer.headerArrayContent;
		obj._colFilters = this.scope.renderer.saveAsColFilters;
		jsonData = cbx.encode(obj);
		
		this.saveParams["INPUT_ACTION"] = "PREF_SAVE_ACTION";
		this.saveParams["INPUT_FUNCTION_CODE"] = this.scope.md.md.VIEW_MD.FUNCTION_CODE;
		this.saveParams["INPUT_PRODUCT"] = this.scope.md.md.VIEW_MD.PRODUCT_CODE;
		this.saveParams["INPUT_SUB_PRODUCT"] = this.scope.md.md.VIEW_MD.SUB_PRODUCT_CODE;
		this.saveParams["JSON_DATA"] = jsonData;
		this.saveParams["PAGE_CODE_TYPE"] =  'WIDGET_PREFERENCE';
		this.saveParams["PRODUCT_NAME"] = this.scope.md.md.VIEW_MD.PRODUCT_CODE;
		this.saveParams["SYSTEM_VIEW_ID"] = this.scope.md.md.VIEW_MD.SYSTEM_VIEW_ID;
		this.saveParams["WIDGET_ID"] = this.scope.viewConf.WIDGET_ID;
		this.saveParams[iportal.systempreferences.getCSRFKeyName()] = iportal.systempreferences.getCSRFUniqueId();
		var templateUrl ="saveAsform.cttpl";
		var tpl = new ct.lib.tmplLayer(templateUrl,this);
		tpl.getTemplate(this.applyTemplate, this);
		
	},
	applyTemplate : function(template){
		var me=this;
		var modal = CLCR.getCmp({
			"COMP_TYPE" : "MODAL_WINDOW",
		});
		var modalConfig = {
					modalContent : template,
					modalClass : 'ct-modal__max',
					fullscreenInd : false,
					scope:this
				};
		this.modalObj = new modal(modalConfig,this.afterRender);
		
	},
	afterRender : function(config){
		var that=this;
		$('#FOOTER_DIV').find('[data-button-id=saveas]').on("click",function(){
			config.saveParams["VIEW_DISPLAY_NM"] = $(this).parents().find('[data-input-id=saveas]').val();
			config.saveViewFlag = true;
			config.switchDoAjax(config.saveParams);
			that.hideModal();
		});
		$('#FOOTER_DIV').find('[data-button-id=cancel]').on("click",function(){
			that.hideModal();
		});
	}
	

});
