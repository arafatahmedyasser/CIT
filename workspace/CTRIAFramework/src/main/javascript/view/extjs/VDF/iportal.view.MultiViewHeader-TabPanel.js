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
Ext.namespace('iportal.view'); 
/**
 * MultiViewHeader subclass of Ext.Toolbar. Intended to render Header part for 
 * Multi view based on View Metadata.
 * This class should be used only by MultiView components.
 */
iportal.view.MultiViewHeader = Ext.extend(Ext.TabPanel, {
	id:null,
	mvConf : null,//Multi View Config object
	toolsMap:null,
	rb:{},
	bundle : CRB.getFWBundleKey(), 
	selectedView : 'SELECT_VIEW',
	height:200,
    initComponent : function()
    {
		if(Ext.isEmpty(this.mvConf.bundle)){
			this.mvConf.bundle = this.bundle;
		}
		this.cmRb = CRB.getFWBundle();
		this.preView = '';
		this.vmd ={};
		this.viewsTitles={};
    	this.rb = CRB.getBundle(this.mvConf.bundle);
    	this.addSuffixToId();
    	//this.initToolsMap();
    	this.setAllViews();
    	var defaultConfig = {
				xtype:'tabpanel',
				//title:'toolbar',
				id:this.id,
				collapsible:false,
				//renderTo :"mainContainer",
				items:this.createItems()			
			};
    	Ext.apply(this, defaultConfig);
    	this.addEvents('statechange');
    	IMM.addListener('modalchange',this.multiViewModalChanged,this);
        this.stateful = true;
        if(!this.stateEvents){
        	this.stateEvents = [];
        }
        this.stateEvents.push('statechange');
	    this.stateId = this.removeIdSuffix() + '_MVH';
	    if(Ext.isFunction(this.mvConf.extraParamsHandler)){
	    	this.mvConf.extraParamsHandler = this.mvConf.extraParamsHandler.createSequence(this.alterReqParams,this);
	    }else{
	    	this.mvConf.extraParamsHandler = this.alterReqParams.createDelegate(this);
	    }
	    
	    
		iportal.view.MultiViewHeader.superclass.initComponent.call(this);
    },
    alterReqParams : function(pms){
    	//var stateVals = Ext.state.Manager.get(this.genFilterStateId(this.selectedView));
    	//alert(Ext.encode(stateVals));
    	Ext.apply(pms,this.getAppliedFilters());
    	return pms;
    },
    setAllViews :function(){
    	this.allViews = IMM.getViewsList(this.removeIdSuffix());
    },
    /**
     * Setter API of storing selected system view meta data. 
     */
    setSelectedViewMd : function(vd){
    	this.vmd = vd;
    },
    /**
     * Getter API for retrieving Selected System View meta data.
     */
    getSelectedViewMd : function(){
    	return this.vmd;
    },
    /**
     * Intended to initialize all possible tools map at the time of Header initialize.
     */
   /* initToolsMap : function(){
    	if(Ext.isEmpty(this.toolsMap)){
    		//The tools map has all possible tools in right order.
    		//P.S : Don't change the order of these tools until UI-Spec changes.  
    		this.toolsMap= {
    				'collapsible':{id:'collapsible',hidden :true,tooltip:this.cmRb.TOOLTIP_COLLAPSE,iconCls:'collapseIcon',handler:this.collapsible,scope:this},
    				'history':{id:'history',hidden :true,tooltip:this.cmRb.TOOLTIP_HISTORY,iconCls:'historyIcon',handler:this.history,scope:this},
    				'filter':{id:'filter',	hidden :true,tooltip:this.cmRb.TOOLTIP_FILTER,iconCls:'filterIcon',handler:this.filter,scope:this},
		    		'pullout':{id:'pullout',	hidden :true,tooltip:this.cmRb.TOOLTIP_PULLOUT,iconCls:'pulloutIcon',handler:this.pullout,scope:this},
				    'print':{id:'print',	hidden :true,tooltip:this.cmRb.TOOLTIP_PRINT,iconCls:'printIcon',handler:this.print,scope:this},
				    'excel':{id:'excel',	hidden :true,tooltip:this.cmRb.TOOLTIP_EXCEL,iconCls:'xlsIcon',handler:this.excelExport,scope:this},
				    'jpgexport':{id:'jpgexport',	hidden :true,tooltip:this.cmRb.TOOLTIP_JPGEXPORT,iconCls:'jpgexportIcon',handler:this.jpegexport,scope:this},
				    'gear': {id:'gear',	hidden :true,tooltip:this.cmRb.TOOLTIP_PREFERENCE,iconCls:'toolsIcon',handler:this.preference,scope:this},
					'help':{id:'help',	hidden :true,tooltip:this.cmRb.TOOLTIP_HELP,iconCls:'helpIcon',handler:this.handlehelp,scope:this},
				    'refresh':{id:'refresh',	hidden :true,tooltip:this.cmRb.TOOLTIP_REFRESH,iconCls:'refreshIcon',handler:this.refresh,scope:this},
				    'close':{id:'close',hidden :true,iconCls:'closeIcon',tooltip:this.cmRb.TOOLTIP_CLOSE,handler:this.closeWin,scope:this}
					};
			
    	}
    },*/
    /**
    * If preferences info object has value Y for RENDER_FLG, it means that user deleted view from widget.
    * Then check is Deleted view is selected view for this widget then reRender widget. else update View slector combo
    */
   	doAfterPrefChange : function(pinfo){
   		var reRenderFalg = pinfo.RENDER_FLG==="Y";
   		if(reRenderFalg && (pinfo.VIEW_ID === this.getSelectedViewId())){
    		//DELETE state object from cache
    		this.removeViewIdFromState();
    		//Asking multiview to reRender himself
    		this.mvConf.reRenderWidget(pinfo.WIDGET_ID);
   		}else{
   			//Here Render flg Y means view has been deleted and its not selected view.
   			pinfo.VIEW_RENDER = reRenderFalg ? 'N':'Y';
   			this.updateViewSelector(this.getViewSelectorVals(),pinfo);
   		}
   		this.mvConf.fireEvent('preferencechange',pinfo);
   	},
    /**
    * This will be invoked my modal when ever preferences changes for widget
    */
    multiViewModalChanged:function(pinfo){
    	var wid = pinfo.WIDGET_ID;
    	if(wid === this.removeIdSuffix()){
    	    //alert(this.removeIdSuffix()+' MOdal Change event for for :'+pinfo.WIDGET_ID);
    		this.doAfterPrefChange.defer(100,this,[pinfo]);
    	}
    },
    /**
    * If preferences object value for VIEW_RENDER is Y then set that view as selected view for view selector.
    */
    setDefaultViewIfReq : function(pob){
    	if(pob.VIEW_RENDER === 'Y'){
    		this.preView = "";//Removing preView value 
    		this.setViewToViewSelector(pob.VIEW_ID);
    	}
    },
    /**
    * Set All Views and update view Selector comboi
    */
    updateViewSelector : function(comvals,pob){
    	this.setAllViews();
    	this.get(1).updateComboRawStore(comvals[0],comvals[1]);
    	this.setDefaultViewIfReq(pob);
    },
    /**
     * Utility API to get suffix string for header, used while creating id for this component.
     * @return Header id Suffix String
     */
    getIdSuffix : function(){
    	return '_WIDGET_HEADER';
    },
    /**
     * Utility API to append Header suffix string to widget id.
     * @return Header id after suffix string appended to widget id.
     */
    addSuffixToId : function(){
    	this.id = this.id+this.getIdSuffix();
    },
    getHeaderId : function(widgetid){
    	return widgetid+this.getIdSuffix();
    },
    /**
     * Intended to remove header suffix string from header id.
     * @return Widget id.
     */
    removeIdSuffix : function(){
    	return this.id.substring(0,this.id.indexOf(this.getIdSuffix()));
    },
    /**
     * Intended to create title label configuration.
     * @return config object of title label
     */
    createTitle :function(){
    	return {
			xtype:'label',id:this.id+"TITLE",cls:'margingrapleft',text:''
		};
    },
    /**
    * if multiview config property "isPullOutWidget" value true, then show pullout tool,
    * else hide that tool irrespective of view meta data 
    */
    showHidePullOut : function(vmd){
    	var pll= this.get('pullout');
    	if(Ext.isDefined(this.mvConf.isPullOutWidget) && this.mvConf.isPullOutWidget){
    		pll.hide();
    	}
    },
    /**
     * Intended to Show tools for selected system view.
     */
    showHideTools : function(vmd){
    	if(vmd&&!this.mvConf.printPage){
    		var stool,atools,tool,cmp;
    		 stool = vmd.VIEW_MD.FLD_TOOLS_LIST;
    		 atools = stool ? stool.split(','):[];
    		for( tool in this.toolsMap){
				 cmp = this.get(tool);
				if(atools.getIndexOf(tool)!==-1){
					cmp.show();
				}else{
					cmp.hide();
				}
			}
			if(this.isRenderToWin()){
				this.get('close').show();
			}else if(IMM.isSearchMode(this.removeIdSuffix())){
				this.get('help').show();
				this.get('close').show();
			}

			this.showHidePullOut(vmd);
			this.showHideExpandCollapse();
    	}else{//If request came from print JSP then print only will display.
    		this.get('print').show();
    	}
    },
  /**
   * Intended to display / hide collpase tool based on multi view configuration property "collapsible" value.
   * if value is true show tool else hide
   */ 
    showHideExpandCollapse : function(){
    	var tool= this.get('collapsible');
    	if(Ext.isDefined(this.mvConf.collapsible) && this.mvConf.collapsible){
    		tool.show();
    	}
    },
    /**
    * Return true if View config renderTo is not BODY else false. 
    */
    isRenderToWin :function(){
    	return this.mvConf.renderTo!=='BODY'?true:false;
    },
    
    getViewSelectorVals:function(){
    	var keys=[[],[]],view,select;
    	for(i=0;i<this.allViews.length;i++){
    		if(i===0){
    			keys[0].push(this.getSelectViewId());
    			select = IMM.isSearchMode(this.removeIdSuffix())?'LBL_SELECT':'LBL_SELECT_VIEW';
    			keys[1].push(this.rb[select]);
    		}
    		view = this.allViews[i];
    		//For User Created views Not required to read localised data	
    		if(IMM.isSystemView(view)){
    			disNm = this.rb[view.VIEW_DISPLAY_NM];
    		}else{
    			disNm = view.VIEW_DISPLAY_NM;
    		}
			keys[0].push(view.VIEW_ID)
			keys[1].push(disNm);
			this.viewsTitles[view.VIEW_ID] =  disNm;
    	}
    	return keys;
    },
    /**
     * Intended to create View Selector combo box, with all possible system views.
     */
    createViewSelector :function(){
    	var combovals;
    	combovals = this.getViewSelectorVals();
		/*var viewSelector = new iportal.formelement.ComboBox({
			combundleKey:this.bundle,
			id:this.id+"_VIEW_SELECTOR",
			includeSelect:false,
			hideLabel :true,
			hidden:!this.mvConf.selector,
			listeners: {"select": this.viewSelectionHandler,scope:this},
			rawKeys:combovals[0],
			rawValues:combovals[1],
			mode: 'local'
		});*/

		var viewSelector= new Array();
		for(var i=1; i<combovals[0].length; i++){
			viewSelector[viewSelector.length]= new Ext.Panel({
									combundleKey:this.bundle,
									title:combovals[1][i],
									itemId:combovals[0][i], 
									height:200,autoWidth:true,
									mode: 'local', 
									listeners: {"activate": this.tabSelectionHandler,scope:this},
									html:'<b>'+combovals[0][i]+'</b>'})
		}
		    			
    	return viewSelector;
    },
    tabSelectionHandler: function (tabPanel){
    	//alert(tabPanel.title)
    	var vid,vmd;
    	vid = tabPanel.itemId;//cmb.getValue();
    	this.selectedView = vid;
    	if(vid !== this.getSelectViewId()){
    		vmd = IMM.getView(vid);
    	   	//If user select the same view more than once don't do any thing;
	    	//Note: If View changes using Preferences then meta data will be deleted from modal.
    		//hence meta data will not be available, So needs to get metadata and render view
	    	if(this.preView!==vid){
				//this.clearFilterValuesFromState(this.preView);	    		
	    		this.preView = vid;
	        	this.setTitle(vid);
	        	this.setDefaultValueToViewer();
	        	if(!IMM.isSearchMode(this.removeIdSuffix())){
	        		this.fireEvent('statechange',this);
	        	}
	        	this.setSelectedViewMd(vmd);
	        	//Check whether meta data is available for selected view. if not available 
		    	//then get from server,update model and then call renderer.
	        	if(!vmd){
	        		this.fetchViewMetaData(vid);
	        	}else{
		    		this.renderView();
		    	}
	    	}	
		    else{
	    		this.setDefaultValueToViewer();
	    	}
    	}



    	
    	
    },
    /**
     * Intended to fetch mete data information for selected view id.
     */
    fetchViewMetaData : function(vid){
    	var prms = {};
    	prms.WIDGET_ID = this.removeIdSuffix();
    	prms.VIEW_ID = vid; 
    	prms.INPUT_ACTION = 'INIT_VIEW';
    	if(IMM.isSearchMode(prms.WIDGET_ID)){
    		prms.PAGE_CODE_TYPE = 'WGT_INQUIRY';
    		for(var i=0;i<this.allViews.length;i++){
    			if(this.allViews[i].VIEW_ID === vid){
    				prms.INQUIRY_SUPPORT_CLASS = this.allViews[i].INQUIRY_SUPPORT_CLASS;
    				break;	
    			} 
    		}
    		
    	}
    	IMM.initAjaxReq({
 			params :prms,
 			scope:this,
 			successhandler:function(resp,pms){
							this.setSelectedViewMd(IMM.getView(vid));
							this.renderView();
						 }
 			});	
    },
    ccyViewMap : {},
    ccySelectHandler : function(widgetViewid,ccy){
    	this.ccyViewMap[widgetViewid]=ccy;    
    },
    /**
     * Intended to
     * 1. Call showHideTools api to make sure to display only available tools for selected view
     * 2. Call Multi View Renderer, for rendering either group view/List view based on selected view type.
     */
    renderView :function(){
    	var sysvid,vmd,search;
    		vmd = this.getSelectedViewMd();
    		this.showHideTools(vmd);
    		sysvid = this.findSystemViewId(vmd);
		    this.mvConf.fireEvent('viewchange',sysvid,vmd);
    	if(IMM.isSearchMode(this.removeIdSuffix())){
    		var cmp = Ext.getCmp(this.mvConf.id+"_SEARCHFORM");
			if(cmp){
				cmp.destroy();
			}
    		search = new iportal.view.SearchForm({mvConf:this.mvConf,vmd:this.getSelectedViewMd(),name:this.viewsTitles[sysvid]});
	    }else{	
    		this.ccySelectHandler(this.removeIdSuffix()+"_"+vmd.VIEW_MD.VIEW_ID,iportal.preferences.getEquivalentCurrency());
    	var renderer= iportal.view.MultiViewRenderer({
			viewConf:vmd,
			ccySelectHandler : this.ccySelectHandler,
			header : this,
			mvConf:this.mvConf,
			itemId:this.removeIdSuffix()
    	});
    	//this.getSelectedPanel()
    	this.getSelectedPanel().add(renderer)
    	this.getSelectedPanel().doLayout();
    	}
    },
    getSelectedPanel:function(){
    	var vid= this.getSelectedViewId()
    	//alert("getSelectedViewId "+ vid)
    	return this.getComponent(vid)
    },
    /**
     * Utility Api intended to set Select View value to view selector combo.
     */
    setDefaultValueToViewer : function(){
    	//this.get(1).setValue(this.getSelectViewId());
    },
    getSelectedViewId : function(){
    	return this.selectedView;
    },
    /**
     * Intended to return "Select View" value.
     */
    getSelectViewId : function(){
    	return ' ';
    },
    /**
     * Intended to set Title text to Title label, based on selected view display name.
     * P.S: If HEADER_TITLE_PRE_FIX config value provided to widget,
     * then It will prefix "HEADER_TITLE_PRE_FIX" value to Selected view name.
     */
    setTitle : function(vid){
    	return;
	    var title = "",vd,titlePrefix,sn,neededWidth,width,writestring;  
	    	title = this.mvConf.title;
	        width = this.getSize().width*0.20; // 20% of width of tool bar width
    	if(Ext.isEmpty(title)){
	    	vd = this.getSelectedViewMd();
	    	titlePrefix =this.mvConf.HEADER_TITLE_PRE_FIX; 
			if(titlePrefix){
				title = this.rb[titlePrefix]+" : ";
			}
			title = title+this.viewsTitles[vid];
		}
		sn = iportal.util.stringnumber.getInstance();
		neededWidth = sn.getNeededWidthNoEl(title,null);
		if(neededWidth>width){
			writestring = sn.getStringForWidth(title,width,{css:''});
			writestring = writestring.substring(0,writestring.length-3).concat('...');
			this.get(0).setText('<div ext:qtip="' + title + '">' + writestring + '</div>',false);
			return;
		}
		this.get(0).setText(title);
    },
    /**
     * Intended to find System view id from view meta data.
     * Returns if System View id presents, else returns view id from metadata.
     */
    findSystemViewId : function(vdif){
    	var svid = vdif.VIEW_MD.SYSTEM_VIEW_ID;
    	if(Ext.isEmpty(svid)){
    		svid=vdif.VIEW_MD.VIEW_ID;
    	}
    	return svid;
    },
    /**
    * Intended to generate filter form state id.
    * Note: This logic of creating id is also available in iportal.listview.filterform.js,
    * Keep this in mind before modify logic of creating id.<b> 
    */
    genFilterStateId : function(vid){
		return this.removeIdSuffix()+"_"+vid+"_FILTER_FORM"
	}, 
    /**
    * Intended to clear filter values saved in state for previous view id
    */
    clearFilterValuesFromState : function(vid){
    	this.setAppliedFilters(null);
    	Ext.state.Manager.set(this.genFilterStateId(vid),null);
    },
    
    /**
     * Hander for View selector combo.Fires when selects any value from view selector combo.
     * It will do the following
     * 1. checks if user is selected already displayed View, then calls 
     * 		 setDefaultValueToViewer for reset value to default value("Select View")
     * 2. Checks if user selected Default view("Select View"), then don't do anything,
     * else 
     *     2.1. Calls setTitle for setting title,
     *     2.2. Calls setDefaultValueToViewer for reset value to default value("Select View")
     *     2.3  Fire statechange event to remember selected view id.
     *     2.4  Checks whether meta data is available for selected view. 
     *     		if available call renderView API to render component, else calls fetchViewMetaData API to fetch metadata 
     *     for selected view and render component.
     */
    viewSelectionHandler : function(cmb,renderflag){
    	if(cmb.isSelectSelected()) return;
    	var vid,vmd;
    	vid = cmb.getValue();
    	this.selectedView = vid;
    	if(vid !== this.getSelectViewId()){
    		vmd = IMM.getView(vid);
    	   	//If user select the same view more than once don't do any thing;
	    	//Note: If View changes using Preferences then meta data will be deleted from modal.
    		//hence meta data will not be available, So needs to get metadata and render view
	    	if(this.preView!==vid){
				//this.clearFilterValuesFromState(this.preView);	    		
	    		this.preView = vid;
	        	this.setTitle(vid);
	        	this.setDefaultValueToViewer();
	        	if(!IMM.isSearchMode(this.removeIdSuffix())){
	        		this.fireEvent('statechange',this);
	        	}
	        	this.setSelectedViewMd(vmd);
	        	//Check whether meta data is available for selected view. if not available 
		    	//then get from server,update model and then call renderer.
	        	if(!vmd){
	        		this.fetchViewMetaData(vid);
	        	}else{
		    		this.renderView();
		    	}
	    	}	
		    else{
	    		this.setDefaultValueToViewer();
	    	}
    	}
    },
    isLastSateValid :function(_laststate){
    	return Ext.isObject(_laststate) && Ext.isDefined(_laststate._mvhOpt) && Ext.isDefined(_laststate._mvhOpt.sel_vw);
    },
    /**
    * Intended to delete from this view from cookie
    */
    removeViewIdFromState : function(){
		Ext.state.Manager.getProvider().clear(this.getStateId());
    },
    /**
     * This API will be called when 'statechange' events fires.
     * Intended to create state object with selected view id and return .
     */
    getState : function(){
    	var that = this,_state,selectedView;
    	 _state = iportal.view.MultiViewHeader.superclass.getState.apply(this, arguments); 
    	 selectedView = this.selectedView;
    	if(_state){
    		_state._mvhOpt = { 'sel_vw' : selectedView };
    	}else{
    		_state = { '_mvhOpt' : { 'sel_vw' : selectedView } };
    	}
    	return _state;
    },
    saveState : function(){
        if(Ext.state.Manager && this.stateful !== false){
            var id = this.getStateId();
            if(id){
                var state = this.getState();
                if(this.fireEvent('beforestatesave', this, state) !== false){
                    Ext.state.Manager.set(id, state);
                    this.fireEvent('statesave', this, state);
                }
            }
        }
    },
    /**
     * Intended to create all possible tools in header.
     * P.S: All tools will be in hide mode. showHideTools API will be take care of showing 
     * VIEW based tools.
     */
    createTools : function(){
    	var tools = [],tool=null;
    	for(tool in this.toolsMap){
			tools.push(this.toolsMap[tool]);
		}
    	return tools;
    },
    /**
     * Intended to create items for Multiview Header.
     * Returned Items are :1. Title,2. View Selector Combo, 3.Filler 4. All possible tools
     */
    createItems : function(){
    	/*return [this.createTitle(),
    			this.createViewSelector(),'->',this.createTools()];*/
    	return [this.createViewSelector()]
    },
    /**
     * Handler of Help tool button handler.
     * Intended to open help file for this widget.
     */
    handlehelp : function(){
    	if(IMM.isSearchMode(this.removeIdSuffix())){
    		iportal.jsutil.helpHandler(this.getSelectedViewId()+'_Help.htm');
    	}else{
    		iportal.jsutil.helpHandler(this.removeIdSuffix()+'_Help.htm');
    	}
    },
    /**
     * Handler of Preferences tool button handler.
     * Intended to launch preferences screen.
     */
    preference : function(){
    this.pref = new iportal.view.WidgetPreferences({
    	currWidget : this.removeIdSuffix(),
    	vMetaData : this.getSelectedViewMd()
    	});
    },
    /**
    * Intended to close MultiViewWindow
    */
    closeWin : function(){
    	this.mvConf.parentWin.close();
    },
    /**
    * Intended to get panel object and return
    */ 
    getPanelCmp : function(){
    	return Ext.getCmp(this.removeIdSuffix()+"_PANEL");
    },
    /**
    * Intended to get window object and return
    */
    getWinCmp : function(){
    	return this.mvConf.parentWin;
    },
    /**
    * Intended to get grid object and return
    */
    getGridCmp : function(){
	    return Ext.getCmp(iportal.jsutil.getListViewGridId(this.removeIdSuffix()));
    },
    /**
     * Handler of Refresh tool button, intended to reload/Refresh the grid.
     * P.S: If View type is GROUP then It will ask Group View to refresh View, else ListViewPanel to refresh view
     */
    refresh : function(){
    	var mdata;
    	mdata = this.getSelectedViewMd();
    	if(IMM.isGroupView(mdata)){
    		this.getPanelCmp().refreshView();
    	}else if(IMM.isChartView(mdata)){
    		this.getPanelCmp().refresh();
    	}else{
	    	this.getGridCmp().reloadData();
    	}
    },
    /**
    * Intended to show error window 
    */
    showNoDataErrWin : function(action){
    	var win = new iportal.Dialog({
			dialogType : 'ERROR',
			
			cls:'portal_neg_btn',
		
			message: String.format(this.rb.ERR_NO_DATA_AVAILABLE, this.cmRb[action]),
			title : this.rb.LBL_MESSAGE_TITLE,
			okHandler : function(){
				win.close();
			}
		});
		win.show();
    },
    /**
    * Intended to check data/chart is available in widget,
    * Return true if data/chart available, else false.
    * No data/chart is not available it will also call error window to notify user.
    */
    checkDataAvailable : function(action){
    	var mdata,returnFlg=false;
    	mdata = this.getSelectedViewMd();
    	if(IMM.isGroupView(mdata)){
    		returnFlg = this.getPanelCmp().isDataAvailable();
    	}else if(IMM.isChartView(mdata)){
    		returnFlg = this.getPanelCmp().isChartAvailable();
    	}else{
	    	returnFlg = this.getGridCmp().isDataAvailable();
    	}
    	if(!returnFlg){
    		this.showNoDataErrWin(action);
    	}
    	return returnFlg;
    },
    /**
    * Intended to set applied filters 
    */
    setAppliedFilters : function(filterVals){
    	Ext.state.Manager.set(this.genFilterStateId(this.getSelectedViewId()),filterVals);
    	//this.appliedFilters = filterVals;
    },
    getAppliedFilters : function(){
    	return Ext.state.Manager.get(this.genFilterStateId(this.getSelectedViewId()));
    },
    /**
    * Intended to append applied filters values to given url and return
    */
    appendFiltersIfAny : function(purl){
    	var appliedFilters = this.getAppliedFilters();
    	 if(Ext.isDefined(appliedFilters)){
    	 	for(key in appliedFilters){
    	 		purl = purl+"&"+key+"="+appliedFilters[key];
    	 	}
    	 }
    	return purl;
    },
    /**
    * Intended to get sort by clause from store and append that params to parameter url.<b>
    * and return the same 
    */
    appendSortByIfAny : function(purl){
    	var sInfo = this.getGridCmp().getStore().sortInfo;
    	if(Ext.isObject(sInfo)){
    		purl = purl+"&sort="+sInfo.field;
			purl = purl+"&dir="+sInfo.direction;
		}
    	return purl;
    },
    /**
     * Export into excel format handler
     */
    excelExport : function(){
    	 // Check whether cmp has data or not, if data allow user to print else show error message
    	  if(this.checkDataAvailable('TOOLTIP_EXCEL')){
		      var url = "/CTModelHouse/ExportServiceServlet?PAGE_CODE_TYPE=VDF_CODE&PRODUCT_NAME=CUSER&INPUT_SUB_PRODUCT=CUSER&INPUT_FUNCTION_CODE=VSBLTY&INPUT_ACTION=EXPORT_ACTION";
			  url = url+"&EXPORT_FORMAT=XLS&WIDGET_ID="+this.removeIdSuffix()+"&VIEW_ID="+this.selectedView+"&CURRENCY_CD="+this.ccyViewMap[this.removeIdSuffix()+"_"+this.selectedView];
			  //Applying Filter params needs to add if req.
			  url = this.appendFiltersIfAny(url);
			  url = this.appendSortByIfAny(url);
			  iportal.openNewWindow(url);	
		  }
    },
    /**
     * JPEG Export tool button handler
     */
    jpegexport :function(){
    	// Check whether cmp has data or not, if data allow user to print else show error message
    	 if(this.checkDataAvailable('TOOLTIP_JPGEXPORT')){
			var currCode = this.mvConf.scope.CCY_VIEWS[this.selectedView];
			var url = "/CTModelHouse/ExportServiceServlet?PAGE_CODE_TYPE=GRAPHICAL_VIEW&PRODUCT_NAME=CUSER&INPUT_SUB_PRODUCT=CUSER&INPUT_FUNCTION_CODE=VSBLTY&INPUT_ACTION=EXPORT_ACTION";
			url = url+"&ISEXPORT_ONLY=true&EXPORT_FORMAT=IMAGE&WIDGET_ID="+this.removeIdSuffix()+"&VIEW_ID="+this.selectedView+"&CURRENCY_CD="+currCode;
			 //Applying Filter params needs to add if req.
			 url = this.appendFiltersIfAny(url);
			iportal.openNewWindow(url);
		}
    },
    /**
     * History tool button handler
     */
    history : function(){
    	
    },
    /**
    * Intended to collapse or expand based on state
    */
    collapsible : function(tool){
    	if(Ext.isDefined(this.mvConf.collapsible)&& this.mvConf.collapsible){
    		var cmp ;
    		if(this.isRenderToWin()){//If render to win then collapse/expand window else collapse/expand panel
    			cmp = this.getWinCmp();
    		}else{
    			cmp = this.getPanelCmp();
    		}
    		if(cmp){
	  			if(cmp.collapsed){
	  				tool.setIconClass('collapseIcon');
	  				cmp.expand();
	  			}else{
	  				tool.setIconClass('expandIcon');
	  				cmp.collapse();
	  			}
  			}
    	}
    },
    getFilterWinTitle : function(){
    	return this.viewsTitles[this.getSelectedViewId()]+' '+ this.rb.LBL_FILTER_WIN_TITLE_SUFIX;
    },
    /**
     * Filter tool button handler
     */
    filter : function(cmp){
    if(IMM.isChartView(this.getSelectedViewMd())) {
  		this.graphFilter = new iportal.view.GraphicalViewFilter({
						  	currWidget : this.removeIdSuffix(),
					    	viewId : this.getSelectedViewId(),
					    	mvh:this
    						});
    }else if(IMM.isTreeView(this.getSelectedViewMd()) || IMM.isOrgView(this.getSelectedViewMd())) {
  		createCashConSearchWindow(this.getPanelCmp());
    }else{
    	this.filterWin = new iportal.listview.FilterFormWin({
    		viewId : this.getSelectedViewId(),
    		rawTitle : this.getFilterWinTitle(),
    		rb:this.rb,
    		mvh:this,
    		widgetId: this.removeIdSuffix()
    	});
	   	this.filterWin.show();
	   	}
    },
    /**
     * Pull out tool button handler
     */
    pullout : function(){
    	if(Ext.isDefined(this.mvConf.pullOutWidget)){
    		var pwid = new this.mvConf.pullOutWidget();
    		var _state = { '_mvhOpt' : { 'sel_vw' : this.getSelectedViewId()} };
    		Ext.state.Manager.set(pwid.widgetId+"_MVH",_state);
    	}
    },
    getPrintMap : function (){
    	var data = {};
		data["VIEW_ID"]=this.selectedView ;
		data["WIDGET_ID"]=this.removeIdSuffix();
		if(IMM.isChartView(this.getSelectedViewMd())){
			data["USE_RENDER_MAP"]='Y';
		}
		return data;
	},
    /**
     * Print tool button handler.
     */
    print : function(){
    		//Check whether cmp has data or not, if data allow user to print else show error message
    		if(this.checkDataAvailable('TOOLTIP_PRINT')){
 			if(!this.mvConf.printPage && !IMM.isChartView(this.getSelectedViewMd())){   	
    	    var suggestWin = new iportal.Dialog({
		 			dialogType : 'WARNING',
		 			
		 			cls:'portal_neg_btn',	
		 			
		 			title : this.rb['LBL_WARN'],
			 			message : this.cmRb["PRINT_SUGGEST_WARN_MSG"],
		 			okHandler : function(){
			 			suggestWin.close();
			 			this.processPrint();
		 			}.createDelegate(this),
	 			    cancelHandler: function(){
		 			suggestWin.close();
	 				}
		 		});
	 		suggestWin.show();
 		}else{
 			this.processPrint();
 		}
		 	}	
    },
    processPrint : function(){
		if(!this.mvConf.printPage && IMM.isChartView(this.getSelectedViewMd())){ 
			this.printImage();
			 //var strIE="height="+(screen.availHeight-45)+",width="+(screen.availWidth-10)+"toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,border=thin,top=0,left=0";
			//iportal.openNewWindow("/iportalweb/iportal/jsps/ListViewPrintPreview.jsp?PRINT_MAP="+Ext.encode(this.getPrintMap())+"",'',strIE);
		}else{
			var groupView = this.getPanelCmp();
			var ds = groupView.getPrintData(); 
			
			if(!ds.collapseData){
				var sInfo = this.getGridCmp().getStore().sortInfo;
	    		if(Ext.isObject(sInfo)){
					ds["sort"]= sInfo.field;
					ds["dir"]=  sInfo.direction;
				}   	
				var colList = this.getSelectedViewMd().VIEW_MD.FLD_COLUMN_LIST;
				var printDataForGrid = {};
				var columnHeadersGrid = [];
				var columnHeaderIDGrid = [];
				var columnDataTypeGrid = [];
				var widBundle=this.mvConf.bundle;
				var cuserBundle = CRB.getBundle(widBundle);
				Ext.each(colList,function(column){
					if(column.FLD_HIDDEN_IND != 'Y' && column.FLD_VISIBLE_IND != 'N' && column.FLD_COLUMN_ID != "CONTEXT"){
						columnHeadersGrid.push(cuserBundle["LBL_"+column.FLD_COLUMN_DISPLAY_NAME_KEY]);
						columnHeaderIDGrid.push(column.FLD_COLUMN_ID);
						columnDataTypeGrid.push(column.FLD_DATA_TYPE);
					}
				});
				printDataForGrid.columnHeadersGrid = columnHeadersGrid;
				printDataForGrid.columnHeaderIDGrid = columnHeaderIDGrid;
				printDataForGrid.columnDataTypeGrid = columnDataTypeGrid;
				printDataForGrid.storeParamGrid = ds;
				printDataForGrid.getMode = function(){
					return 'grid';
				}	    
				IGPM[this.removeIdSuffix()] = printDataForGrid;	
			}else{
				IGPM[this.removeIdSuffix()] = ds;
			}
			iportal.openNewWindow(iportal.workspace.metadata.getContextRoot()+'/CTRIAFramework/jsp/PrintTemplate.jsp'+
		'?elementIdForConfirmationMsg='+this.removeIdSuffix()+'','print','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,border=thin,top=20,left=110,width=750,height=650');
		}
    },
     printImage : function() {
    	var currCode = this.mvConf.scope.CCY_VIEWS[this.selectedView];
			var url = "/CTModelHouse/ExportServiceServlet?PAGE_CODE_TYPE=GRAPHICAL_VIEW&PRODUCT_NAME=CUSER&INPUT_SUB_PRODUCT=CUSER&INPUT_FUNCTION_CODE=VSBLTY&INPUT_ACTION=EXPORT_ACTION";
			url = url+"&ISEXPORT_ONLY=true&EXPORT_FORMAT=IMAGE&WIDGET_ID="+this.removeIdSuffix()+"&VIEW_ID="+this.selectedView+"&CURRENCY_CD="+currCode+"&TYPE=PRINT";
			 url = this.appendFiltersIfAny(url);
			iportal.openNewWindow(url,'PRINT_IMAGE');
    },
    /**
    * Intended to set view id to view selector combo and fire select event.
    */
    setViewToViewSelector : function(viewid){
    this.activate(this.get(0))
    //this.fireEvent('activate', this.get(0))
    	//this.get(0).setValue(viewid);
    	//this.get(0).fireEvent('select',this.get(0));
    },
    getLastState : function(){
    	return Ext.state.Manager.get(this.getStateId(),'NOT_FOUND');
    },
    /**
     * The following will be done while rendering component.
     * Gets the last state of component, check any state was maintained, 
     * if maintained, fire select event of view selector combo with previous system view id.
     * else fire select event of view selector combo with default view of given widget.
     */
    afterRender : function(ct, position){
    	//Get default view id from model and select that value in combo.
    	var viewid,_laststate;
    	 _laststate = this.getLastState();
    	 viewid = IMM.getDefaultView(this.removeIdSuffix());
		if(this.isLastSateValid(_laststate)){
			viewid = _laststate._mvhOpt.sel_vw;
		}
		this.setViewToViewSelector(viewid);
    	iportal.view.MultiViewHeader.superclass.afterRender.apply(this, arguments);
    }/*,
    afterRender : function(){
    	iportal.view.MultiViewHeader.superclass.afterRender.apply(this, arguments);
    }*/
});