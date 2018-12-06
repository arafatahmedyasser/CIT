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
 * Multi view based on View Metadata. This class should be used only by
 * MultiView components.
 */
iportal.view.MultiViewHeader = Ext.extend( Ext.Panel, {
	id : null,
	mvConf : null,
	toolsMap : null,
	rb : {},
	bundle : CRB.getFWBundleKey(),
	selectedView : 'SELECT_VIEW',
	//if a bbar is used inside the panel, it is not necessary to set autoWidth : true. By default the bbar width is set to auto.
	//autoWidth : true,
	clickCount : 0,
	initComponent : function (){
		this.cmRb = CRB.getFWBundle();
		this.preView = '';
		this.dateFilters ={};
		this.vmd = {};
		this.viewsTitles = {};
		this.rb = CRB.getBundle(this.mvConf.bundle);
		this.addSuffixToId();
		this.setAllViews();
		this.IND = this.isToolsAvailable();
		var defaultConfig = {
			xtype : 'panel', 
			itemId : this.itemId,
			collapsible : false,
			cls:'btnbar',
			items : this.createItems(),
			tbar : [{  
			 		xtype : 'button',
					tooltip : this.cmRb.TOOL_TIPS_HELP,  
					iconCls : 'helpbtn',
					cls:'noborder-icon-text',
					hidden : !this.IND.HELP_IND,
					handler : function (toolObj, event){
						toolObj.ownerCt.ownerCt.handlehelp();
			        }
	        	}, {
					xtype : 'button',
					tooltip : this.cmRb.TOOL_TIPS_EXCEL,  
					cls:'noborder-icon-text',
					iconCls : 'ExporttoExcelbtn',
					hidden : !this.IND.EXCEL_IND,
					handler : function (toolObj, event){
						toolObj.ownerCt.ownerCt.excelExport();
			        }
				}, {
					xtype : 'button',
					tooltip : this.cmRb.TOOL_TIPS_PDF,  
					cls:'noborder-icon-text',
					iconCls : 'ExporttoPDFbtn',
					hidden : !this.IND.PDF_IND,
					handler : function (toolObj, event){
									toolObj.ownerCt.ownerCt.pdfExport();
					}
				}, {
					xtype : 'button',
					tooltip : this.cmRb.TOOLTIP_RTF,
					cls : 'noborder-icon-text',
					iconCls : 'ExporttoRTFbtn',
					hidden : !this.IND.RTF_IND,
					handler : function (toolObj, event){
						toolObj.ownerCt.ownerCt.rtfExport();
					}
				}, {
					xtype : 'button',
					tooltip : this.cmRb.TOOL_TIPS_CSV, 
					cls:'noborder-icon-text',
					iconCls : 'ExporttoCSVbtn',
					hidden : !this.IND.CSV_IND,
					handler : function (toolObj, event){
						toolObj.ownerCt.ownerCt.csvExport();
					}
		       }, {
					xtype : 'button',
					tooltip : this.cmRb.TOOL_TIPS_CLEAR_FILTER,   
					cls:'noborder-icon-text',
					iconCls : 'ClearFiltersbtn',
					hidden : !this.IND.FILTER_IND,
					handler : function (toolObj, event){
						toolObj.ownerCt.ownerCt.clearFilters();
					}
		       }, {
					xtype : 'button',
					tooltip : this.cmRb.TOOL_TIPS_REFRESH,  
					cls:'noborder-icon-text',
					iconCls : 'Refreshbtn',
					hidden : !this.IND.REFRESH_IND,
					handler : function (toolObj, event){
						toolObj.ownerCt.ownerCt.refresh();
					}
		       }, {
					xtype : 'button',
					tooltip : this.cmRb.TOOL_TIPS_PRINT,
					cls : 'noborder-icon-text',
					iconCls : 'Printbtn',
					hidden : !this.IND.PRINT_IND,
					handler : function (toolObj, event){
						toolObj.ownerCt.ownerCt.print();
					}
				}]
		};
		var switchToMorebtn={
			xtype : 'button',
			tooltip : this.cmRb.TOOL_TIPS_REVERT_IN_MORE,  
			cls : 'noborder-icon-text',
			iconCls : 'SwitchToMorebtn',
			handler : function (toolObj, event){
				toolObj.ownerCt.ownerCt.switchMore();
			}
		};
		if(!Ext.isEmpty(this.IND.CUSTOM_TOOLS_IND) && !Ext.isEmpty(this.IND.CUSTOM_TOOLS)) {
			if(this.IND.CUSTOM_TOOLS_IND) {
				var customToolsArray=new Array();
				for(var i=0;i<this.IND.CUSTOM_TOOLS.length;i++)	{
					if(this.IND.CUSTOM_TOOLS[i].TOOL_TYPE!="ROOT")
						this.getCustomToolsLinear(this.IND.CUSTOM_TOOLS[i],customToolsArray);
				}
				for(var i=0;i<customToolsArray.length;i++)	{
					customToolsArray[i].xtype='button';
					customToolsArray[i].cls='noborder-icon-text';
					customToolsArray[i].iconCls=customToolsArray[i].iconCls+'btn';
					customToolsArray[i].tooltip=customToolsArray[i].qtip; 
					defaultConfig.tbar.push(customToolsArray[i]);
				 }
				defaultConfig.tbar.push(switchToMorebtn);
			}
			else {
				defaultConfig.tbar.push(switchToMorebtn);
			}
		}
		/**
		 * This if-block is added for setting child
		 * widget buttons BBAR to the indexed multi
		 * widget button bbar, those indexes are for
		 * multi-widget
		 */
		if (this.mvConf.ownerCt != null) {
			var iMultiWidget = this.mvConf.ownerCt.findParentBy(function (ct){
				return ct.indexedWidget === true;
			});
			if (iMultiWidget != null) {
				iMultiWidget.showBottomBarButtons(this.createBBarButtons());
				this.ownerAcceptBBar = true;
			}
		}
		/**
		 * Applying the bbar if the owner doesn't accept
		 * the childs bbar items.
		 */
		if (!this.ownerAcceptBBar && !this.mvConf.ownerAcceptBBar) {
			Ext.apply(defaultConfig, {
				bbar : this.createBBarButtons()
			});
		}
		Ext.apply(this, defaultConfig);
		this.addEvents('statechange');
		IMM.addListener('modalchange', this.multiViewModalChanged, this);
		this.stateful = true;
		if (!this.stateEvents) {
			this.stateEvents = [];
		}
		this.stateEvents.push('statechange');
		this.stateId = this.removeIdSuffix() + '_MVH';
		if (Ext.isFunction(this.mvConf.extraParamsHandler)) {
			this.mvConf.extraParamsHandler = this.mvConf.extraParamsHandler.createSequence(
						this.alterReqParams, this);
		} else {
			this.mvConf.extraParamsHandler = this.alterReqParams.createDelegate(this);
		}

		iportal.view.MultiViewHeader.superclass.initComponent.call(this);
	},
	/**
	 * 
	 */
	updateHeight : function (height){
		if(this.mvConf.isLoadingToolsInside == true){
			height = height - 27; 
		}								
		if (!Ext.isEmpty(this.getSelectedPanel())
					&& !Ext.isEmpty(this.getPanelCmp())) {
				if (IMM.isChartView(this.getSelectedViewMd())
							|| IMM.isCalendarView(this.getSelectedViewMd())) {
					this.getPanelCmp().updateHeight(height - 27); 
				}
				else if(IMM.isFormView(this.getSelectedViewMd())){																
					if(!Ext.isEmpty(this.bbar)){
						height = parseInt(height-iportal.jsutil.getBBarHeight(this.bbar)+5);
					}
					this.getPanelCmp().setHeight(height);
				}
				else if(IMM.isAdsView(this.getSelectedViewMd())){
				}
				else if(IMM.isIFrameView(this.getSelectedViewMd())){
					this.getPanelCmp().updateHeight(height);
				}
				else if(!Ext.isEmpty(this.getSelectedPanel().getComponent(0))) {
					/**
					 * For setting child widget has to be
					 * resizable when its parent indexed
					 * multi widget has to be enabled
					 * resizable
					 */
					this.getSelectedPanel().getComponent(0).updateHeight(
								height - this.getFrameHeight()); 
				}
			}
		},
		/**
		 * 
		 */
		alterReqParams : function (pms){
			/**
			 * added code to update the viewId to be
			 * the current selected view as the
			 * appliedFilter method will always return the
			 * parems used by the store in its last data
			 * request and there could be scenario that the
			 * same store is used to fetch data for a new
			 * view
			 */
			Ext.apply(pms,this.dateFilters);
			return pms;
		},
		setAllViews : function (){
			this.allViews = IMM.getViewsList(this.removeIdSuffix());
		},
		/**
		 * Setter API of storing selected system view meta
		 * data.
		 */
		setSelectedViewMd : function (vd){
			this.vmd = vd;
		},
		/**
		 * Getter API for retrieving Selected System View
		 * meta data.
		 */
		getSelectedViewMd : function (){
			return this.vmd;
		},

		/**
		 * If preferences info object has value Y for
		 * RENDER_FLG, it means that user deleted view from
		 * widget. Then check is Deleted view is selected
		 * view for this widget then reRender widget. else
		 * update View slector combo
		 */
		doAfterPrefChange : function (pinfo){
			var reRenderFalg = pinfo.RENDER_FLG === "Y";
			if (reRenderFalg && (pinfo.VIEW_ID === this.getSelectedViewId())) {
				this.removeViewIdFromState();
				this.mvConf.reRenderWidget(pinfo.WIDGET_ID);
			} 
			else {
				pinfo.VIEW_RENDER = reRenderFalg ? 'N' : 'Y';
				this.updateViewSelector(this.getViewSelectorVals(), pinfo);
			}
			this.mvConf.fireEvent('preferencechange', pinfo);
		},
		/**
		 * This will be invoked my modal when ever
		 * preferences changes for widget
		 */
		multiViewModalChanged : function (pinfo){
			var wid = pinfo.WIDGET_ID;
			if (wid === this.removeIdSuffix()) {
				this.doAfterPrefChange.defer(100, this, [ pinfo ]);
			}
		},
		/**
		 * If preferences object value for VIEW_RENDER is Y
		 * then set that view as selected view for view
		 * selector.
		 */
		setDefaultViewIfReq : function (pob){
			if (pob.VIEW_RENDER === 'Y') {
				this.preView = "";
				this.setViewToViewSelector(pob.VIEW_ID);
			}
		},
		/**
		 * Set All Views and update view Selector comboi
		 */
		updateViewSelector : function (comvals, pob){
			this.setAllViews();
			this.setDefaultViewIfReq(pob);
		},
		/**
		 * Utility API to get suffix string for header, used
		 * while creating id for this component.
		 * 
		 * @return Header id Suffix String
		 */
		getIdSuffix : function (){
			return '_WIDGET_HEADER';
		},
		/**
		 * Utility API to append Header suffix string to
		 * widget id.
		 * 
		 * @return Header id after suffix string appended to
		 *         widget id.
		 */
		addSuffixToId : function (){
			this.itemId = this.itemId + this.getIdSuffix();
		},
		getHeaderId : function (widgetid){
			return widgetid + this.getIdSuffix();
		},
		/**
		 * Intended to remove header suffix string from
		 * header id.
		 * 
		 * @return Widget id.
		 */
		removeIdSuffix : function (){
			return this.itemId.substring(0, this.itemId.indexOf(this.getIdSuffix()));
		},
		/**
		 * Intended to create title label configuration.
		 * 
		 * @return config object of title label
		 */
		createTitle : function (){
			return {
				xtype : 'label',
				itemId : this.itemId + "TITLE",
				cls : 'margingrapleft',
				text : ''
			};
		},
		/**
		 * if multiview config property "isPullOutWidget"
		 * value true, then show pullout tool, else hide
		 * that tool irrespective of view meta data
		 */
		showHidePullOut : function (vmd){
			var pll = this.get('pullout');
			if (Ext.isDefined(this.mvConf.isPullOutWidget) && this.mvConf.isPullOutWidget) {
				pll.hide();
			}
		},
		/**
		 * Intended to display / hide collpase tool based on
		 * multi view configuration property "collapsible"
		 * value. if value is true show tool else hide
		 */
		showHideExpandCollapse : function (){
			var tool = this.get('collapsible');
			if (Ext.isDefined(this.mvConf.collapsible) && this.mvConf.collapsible) {
				tool.show();
			}
		},
		/**
		 * Return true if View config renderTo is not BODY
		 * else false.
		 */
		isRenderToWin : function (){
			return this.mvConf.renderTo !== 'BODY' ? true : false;
		},
		/**
		 * 
		 */
		getViewSelectorVals : function (){
			var keys = [ [], [] ], view, select;
			for (i = 0; i < this.allViews.length; i++) {
				if (i === 0) {
					keys[0].push(this.getSelectViewId());
					select = IMM.isSearchMode(this.removeIdSuffix()) ? 'LBL_SELECT'
								: 'LBL_SELECT_VIEW';
					keys[1].push(this.rb[select]);
				}
				view = this.allViews[i];
				if (IMM.isSystemView(view)) {
					disNm = cbx.isEmpty(this.rb[view.VIEW_DISPLAY_NM]) ? view.VIEW_DISPLAY_NM : this.rb[view.VIEW_DISPLAY_NM];
				} else {
					disNm = view.VIEW_DISPLAY_NM;
				}
				keys[0].push(view.VIEW_ID);
				keys[1].push(disNm);
				this.viewsTitles[view.VIEW_ID] = disNm;
			}
			return keys;
		},
		/**
		 * return the default view title as per metadata
		 */
		getSystemViewTitle : function (){
			for (i = 0; i < this.allViews.length; i++) {
				view = this.allViews[i];
				if (IMM.isSystemView(view)) {
					return this.viewsTitles[view.VIEW_ID];
				}
			}
		},
		/**
		 * As per the meta data, return if tools are needed
		 * for the for the default view
		 */
		isToolsAvailable : function (){
			var toolsFlag = false, collapseFlag = false, initCollapsed = false, prefsFlag = false; 
			var maximizeFlag=false; 
			var helpFlag = false;
			var excelFlag = false;
			var pdfFlag = false;
			var csvFlag = false;
			var rtfFlag = false;
			var filterFlag = false;
			var refreshFlag = false;
			var printFlag = false;
			var switchChartFlag = false;
			var showToolBarFlag = false;
			var customToolsFlag=false;  
			var showTBarFlag = false;
			var customTools={};
			/**
			 * new flag that will be
			 * made enabled only by MultiWidgetSwitch
			 */
			var switchWidgetFlag = this.mvConf.enableWidgetSwitch === true ? true : false;
			for (i = 0; i < this.allViews.length; i++) {
				view = this.allViews[i];
				if (IMM.isSystemView(view)) {
					var vmd = IMM.getView(view.VIEW_ID);
					toolsFlag = !(null == vmd.VIEW_MD.FLD_TOOLS_LIST || vmd.VIEW_MD.FLD_TOOLS_LIST == "");
					customToolsFlag=!(null == vmd.VIEW_MD.FLD_CUSTOM_TOOLS_LIST || vmd.VIEW_MD.FLD_CUSTOM_TOOLS_LIST == "");
					if(customToolsFlag) {
						customTools=eval('('+vmd.VIEW_MD.FLD_CUSTOM_TOOLS_LIST+')');
					}
					collapseFlag = (vmd.VIEW_MD.FLD_TOOLS_LIST != null && vmd.VIEW_MD.FLD_TOOLS_LIST
								.indexOf("collapse") > -1);
					maximizeFlag = (vmd.VIEW_MD.FLD_TOOLS_LIST != null && vmd.VIEW_MD.FLD_TOOLS_LIST
								.indexOf("maximize") > -1); 
					initCollapsed = (vmd.VIEW_MD.FLD_INIT_COLLAPSED != null && vmd.VIEW_MD.FLD_INIT_COLLAPSED === 'Y');
					prefsFlag = (vmd.VIEW_MD.FLD_TOOLS_LIST != null && vmd.VIEW_MD.FLD_TOOLS_LIST
								.indexOf("gear") > -1);
					switchChartFlag = (vmd.VIEW_MD.FLD_TOOLS_LIST != null && vmd.VIEW_MD.FLD_TOOLS_LIST
								.indexOf("switchChart") > -1);
					
					if(vmd.VIEW_MD.FLD_TBAR_BUTTONS && vmd.VIEW_MD.FLD_TBAR_BUTTONS.TBAR_CONFIG && vmd.VIEW_MD.FLD_TBAR_BUTTONS.TBAR_CONFIG[0]){
						showTBarFlag = true;
					}
					
					var tools = vmd.VIEW_MD.FLD_TOOLS_LIST;
					if(tools)
					{
						helpFlag = !(tools.toUpperCase().indexOf("HELP") == -1);
						excelFlag = !(tools.toUpperCase().indexOf("EXCEL") == -1);
						pdfFlag = !(tools.toUpperCase().indexOf("PDF") == -1);
						csvFlag = !(tools.toUpperCase().indexOf("CSV") == -1);
						rtfFlag = !(tools.toUpperCase().indexOf("RTF") == -1);
						filterFlag = !(tools.toUpperCase().indexOf("FILTER") == -1);
						refreshFlag = !(tools.toUpperCase().indexOf("REFRESH") == -1);
						printFlag = !(tools.toUpperCase().indexOf("PRINT") == -1);
						showToolBarFlag=!(tools.toUpperCase().indexOf("SHOWASTOOLBAR") == -1);
					}
					break;
				}
			}
			return {
				"TOOLS_IND" : toolsFlag,
				"HELP_IND" : helpFlag,
				"EXCEL_IND" : excelFlag,
				"PDF_IND" : pdfFlag,
				"CSV_IND" : csvFlag,
				"RTF_IND" : rtfFlag,
				"FILTER_IND" : filterFlag,
				"REFRESH_IND" : refreshFlag,
				"PRINT_IND" : printFlag,
				"PREFS_IND" : prefsFlag, 
				"TOOLS_IND" : toolsFlag,
				"COLLAPSE_IND" : collapseFlag,
				"INIT_COLLAPSED" : initCollapsed,
				"MAXIMIZE_IND" : maximizeFlag,
				"CHART_TOOL_IND" : switchChartFlag, 
				"SWITCH_WIDGET_IND" : switchWidgetFlag, 
				"CUSTOM_TOOLS_IND": customToolsFlag,
				"CUSTOM_TOOLS": customTools,
				"SHOW_AS_TOOLBAR_IND" : showToolBarFlag,
				"SHOW_TBAR_IND":showTBarFlag
			};
		},
		/**
		 * 
		 */
		destroyCCYSelector : function (){
			if (this.ccySelector) {
				Ext.destroy(this.ccySelector);
				delete this.ccySelector;
			}
		},
		/**
		 * Intended to create View Selector combo box, with
		 * all possible system views.
		 */
		createViewItems : function (){
			var combovals;
			var that = this;
			combovals = this.getViewSelectorVals();
			var viewSelector = new Array();
			var i=1;
			//for ( var i = 1; i < combovals[0].length; i++) {
				viewSelector[viewSelector.length] = new Ext.Panel({
					combundleKey : this.bundle,
					title : this.mvConf.isLoadingToolsInside == true ? combovals[1][i] : null,
					header:this.mvConf.isLoadingToolsInside == true ? true : false, 
					tempTitle : combovals[1][i],
					itemId : combovals[0][i],
					autoHeight : true,
					autoWidth : true,
					wrapperContainer : null,
					activateRequestQueue :[],
					getWrapperContainer : function(){
						 return this.wrapperContainer;
					},
					setWrapperContainer : function(obj){
						this.wrapperContainer = obj;
					},
					activateContainer : function(newItem,widget,options){
						if(this.rendered === true && this.renderer && this.renderer.rendered === true){ 
							/**
							 * Added to resize the portal and the portal columns once the user navigates to a different layout
							 * The current framework only destroys the widget objects and hence have to perform this operation
							 * to resize the portal columns back to their initial size.
							 */
							var appWidPIndex = iportal.jsutil.getParentPortletIndex(widget);
							/**
							 * F -> FormContainer
							 * C -> Context App Panel
							 * W -> Widget(Dynamic widget Manager)
							 */
							var portal = widget.findParentByType('portal').getComponent(appWidPIndex);
							switch(options.type){
							case "F":
								portal.containsAppWidget = true;
								break;
							case "W":
								portal.containsAppWidget = false;
								if(portal.resizeWidth){
									delete portal.resizeWidth;
								}
								break;
							case "C" : 
								portal.containsAppWidget = true;
								break;
							default : 
								portal.containsAppWidget = false;
								break;
							}
							var neighbourPortletIndex = appWidPIndex === 1?0:1;
							var sWid = iportal.jsutil.getSplitterWidth(widget.findParentByType('portal'));
							var conf = {
								scope : widget.findParentByType('portal'),
								rWid : !Ext.isEmpty(widget.findParentByType('portlet').initialWidth)?
										widget.findParentByType('portlet').initialWidth:widget.getWidth(),
								lWid : widget.findParentByType('portal').getComponent(neighbourPortletIndex).getWidth(),
								sWid : sWid,
								pWid : widget.findParentByType('portal').ownerCt.getWidth(),
								neighbourPortletIndex : neighbourPortletIndex,
								appWidPIndex : appWidPIndex 
							};
							widget.on("beforedestroy",function(){
								iportal.jsutil.adjustPortalWidth(this.scope,this.rWid,this.lWid,this.sWid,
										this.pWid,this.appWidPIndex,neighbourPortletIndex);
							},conf);
							var isCBXContainer = options.isCBXContainer?options.isCBXContainer:false
							var callback = cbx.isFunction(options.callback)?options.callback:cbx.emptyFn; 
							var scope = options.scope?options.scope:this
							var existingItem =this.getWrapperContainer();
							if(Ext.isEmpty(existingItem)){
								this.add(newItem);
								isCBXContainer?this.setWrapperContainer(newItem):this.setWrapperContainer(null);
								if(this.getLayout().activeItem){
									this.getLayout().activeItem.hide();
								}
								else {
									this.getComponent(0).initialHeight = this.getComponent(0).initialHeight?
													this.getComponent(0).initialHeight
															:this.getComponent(0).getHeight();
									this.getComponent(0).initialWidth = this.getComponent(0).initialWidth?
															this.getComponent(0).initialWidth
															:this.getComponent(0).getWidth(); 
									this.getComponent(0).hide();
									/**
									 * Checking if a dom reference has been created for the header or not...
									 * If yes,the element will be hidden
									 */
									if(this.findParentByType('portlet').header && this.findParentByType('portlet').header.dom){
										this.findParentByType('portlet').header.setVisibilityMode(Ext.Element.ASCLASS); 
										this.findParentByType('portlet').header.hide();
									}
									this.getComponent(0).on('show',function(){
										var negation = 4;
										if(this.findParentByType('portlet').header && this.findParentByType('portlet').header.dom){
											this.findParentByType('portlet').header.setVisible(true,false);
											negation = 30;
										}
										this.findParentByType('portlet').getEl().setHeight(this.initialHeight);
										if(this.findParentByType('portlet').getComponent(0).updateHeight){
											this.findParentByType('portlet').getComponent(0).updateHeight(this.initialHeight-negation);
										}
										iportal.jsutil.adjustPortalColumnsWidth(widget,this.initialWidth);
									});
								}
								this.getLayout().activeItem = newItem;
								newItem.show();
								this.doLayout();
								callback(newItem,widget,this,scope);
							}
							else {
								existingItem.getEl().scale([existingItem.getEl().getWidth()],[0],{
									easing: 'easeOut',
									scope : [existingItem,newItem,this,isCBXContainer,callback,widget,scope],
									callback : function(){
										var existingItem = this[0];
										var newItem = this[1];
										var that = this[2];
										var isCBXContainer = this[3];
										var callback = this[4];
										var widget = this[5];
										var scope = this[6];
										existingItem.destroy();
										that.add(newItem);
										isCBXContainer?that.setWrapperContainer(newItem):that.setWrapperContainer(null);
										if(that.getLayout().activeItem){
											that.getLayout().activeItem.hide();
										}
										that.getLayout().activeItem = newItem;
										that.getLayout().activeItem.show();
										that.doLayout();
										callback(newItem,widget,that,scope);
									}, 
									duration: .5
								});
							}
						}
						else{
							var requestObj = {
									newItem:newItem,
									widget :widget,
									options : options
							};
							this.activateRequestQueue.push(requestObj);
						}
					},
					mode : 'local',
					listeners : {
						"activate" : this.viewSelectionHandler,
						'beforedestroy' : this.destroyCCYSelector,
						scope : this
					},
					/**
					 * Currency Selector component
					 * rendered next to portlet's title
					 * 
					 * @param ct
					 * @param position
					 */
					afterRender : function (){
						if (that.mvConf.isLoadingToolsInside == true) {
							this.setTitle(this.tempTitle);
							this.ccySelector = new Ext.form.ComboBox({
								name : 'state',
								store : new Ext.data.ArrayStore({
									fields : [ 'rateCurrkey', 'rateCurrValue' ],
									data : iportal.jsutil.getCCYSelectorData()
								}),
								hidden : true,
								width : 180,
								height : 15,
								ctCls : 'x-panel-combo',
								valueField : 'rateCurrkey',
								displayField : 'rateCurrValue',
								hideLabel : true,
								mode : 'local',
								triggerAction : 'all',
								emptyText : CRB.getFWBundle()['SELECT_CURRENCY'],
								selectOnFocus : true,
								listeners : {
									"select" : function (cmp, rec){
										that.onCurrChange(rec.data.rateCurrkey);
									},
									scope : this
								}
							});
							that.showCurrencyInd();
						}
					}
				});
			//}
			return viewSelector;
		},
		/**
		 * Hander to fire the state change event of
		 * the widget in case the user chooses to move to
		 * another view of the widget so that appropriate
		 * view can be loaded and attached to its associated
		 * handlers
		 */
		viewSelectionHandler : function (panel){
			var vid, vmd;
			if (panel) {
				vid = panel.itemId;
			}
			if (vid) {
				this.selectedView = vid;
				if (vid !== this.getSelectViewId()) {
					vmd = IMM.getView(vid);
					/**
					 * If user select the same view more than once don't do any thing;
					 *  Note: If View changes using Preferences then meta data will be deleted from modal.
					 *  hence meta data will not be available, So needs to get metadata and render view
					 */
					if (this.preView !== vid || (panel.changeView!=undefined && panel.changeView)) {
						this.preView = vid;
						this.setDefaultValueToViewer();
						if (!IMM.isSearchMode(this.removeIdSuffix())) {
							this.fireEvent('statechange', this);
						}
						this.setSelectedViewMd(vmd);
						/**
						 * Check whether meta data is available for selected view. if not available
						 * then get from server,update model and then call renderer.
						 */
						if (cbx.isEmpty(vmd)) {
							this.fetchViewMetaData(vid);
						} 
						else {
							this.renderView();
						}
					} 
					else {
						this.setDefaultValueToViewer();
					}
				}
			}
		},
		/**
		 * Intended to fetch mete data information for
		 * selected view id.
		 */
		fetchViewMetaData : function (vid){
			var prms = {};
			prms.WIDGET_ID = this.removeIdSuffix();
			prms.VIEW_ID = vid;
			prms.INPUT_ACTION = 'INIT_VIEW';
			if (IMM.isSearchMode(prms.WIDGET_ID)) {
				prms.PAGE_CODE_TYPE = 'WGT_INQUIRY';
				for ( var i = 0; i < this.allViews.length; i++) {
					if (this.allViews[i].VIEW_ID === vid) {
						prms.INQUIRY_SUPPORT_CLASS = this.allViews[i].INQUIRY_SUPPORT_CLASS;
						break;
					}
				}
			}
			IMM.initAjaxReq({
				params : prms,
				scope : this,
				successhandler : function (resp, pms){
					this.setSelectedViewMd(IMM.getView(vid));
					var responseData = Ext.decode(pms.responseText);
					var tmpVmd = responseData.response.value;
					this.setSelectedViewMd(tmpVmd);
					this.renderView();
				}
			});
		},
		ccyViewMap : {},
		ccySelectHandler : function (widgetViewid, ccy){
			this.ccyViewMap[widgetViewid] = ccy;
		},
		/**
		 * Intended to return an array of bottom bar buttons
		 * configured for the widget. The buttons will be
		 * loaded as configured in
		 * vmd.VIEW_MD.FLD_BBAR_BUTTONS. The ordering of the
		 * buttons is assumed to be already done at the
		 * server side. And vmd.VIEW_MD.FLD_BBAR_BUTTONS has
		 * 2 child objects: 1) POSITIVE_BUTTONS, 2)
		 * NEGATIVE_BUTTONS The alignment of the widgets can
		 * also be customized here.
		 */
		createBBarButtons : function (){
			var viewid = IMM.getDefaultView(this.removeIdSuffix());
			vmd = IMM.getView(viewid);
			var posBtn= iportal.preferences.getPostiveBtnAlign();
			var negBtn= iportal.preferences.getNegativeBtnAlign();
			if (!Ext.isEmpty(vmd.VIEW_MD.FLD_BBAR_BUTTONS)) {
				var buttonArray = new Array();
				if(posBtn==='RIGHT' && negBtn === 'LEFT') {
					if (!Ext.isEmpty(vmd.VIEW_MD.FLD_BBAR_BUTTONS.NEGATIVE_BUTTONS)) {
						var posButtons = vmd.VIEW_MD.FLD_BBAR_BUTTONS.NEGATIVE_BUTTONS;
						for ( var i = 0; i < posButtons.length; i++) {
							var obj = posButtons[i];
							buttonArray.push({
								xtype : 'button',
								buttonId : obj.FLD_BBAR_BTN_ID,
								text : this.rb[obj.FLD_BTN_DISPLAY_NM],
								isSystemButton : obj.FLD_IS_SYS_BUTTON,
								cls : 'portal_neg_btn',
								scope : this,
								handler : this.raiseBBarClickEvent
							});
						}
					}
					if (!Ext.isEmpty(vmd.VIEW_MD.FLD_BBAR_BUTTONS.POSITIVE_BUTTONS)) {
						buttonArray.push('->');
						var posButtons = vmd.VIEW_MD.FLD_BBAR_BUTTONS.POSITIVE_BUTTONS;
						for ( var i = 0; i < posButtons.length; i++) {
							var obj = posButtons[i];
	
							buttonArray.push({
								xtype : 'button',
								buttonId : obj.FLD_BBAR_BTN_ID,
								text : this.rb[obj.FLD_BTN_DISPLAY_NM],
								isSystemButton : obj.FLD_IS_SYS_BUTTON,
								cls : 'portal_pos_btn',
								scope : this,
								handler : this.raiseBBarClickEvent
							});
						}
					}
				}
				else if (posBtn==='LEFT' && negBtn === 'RIGHT'){
					if (!Ext.isEmpty(vmd.VIEW_MD.FLD_BBAR_BUTTONS.POSITIVE_BUTTONS)) {
						var posButtons = vmd.VIEW_MD.FLD_BBAR_BUTTONS.POSITIVE_BUTTONS;
						for ( var i = 0; i < posButtons.length; i++) {
							var obj = posButtons[i];
							buttonArray.push({
								xtype : 'button',
								buttonId : obj.FLD_BBAR_BTN_ID,
								text : this.rb[obj.FLD_BTN_DISPLAY_NM],
								isSystemButton : obj.FLD_IS_SYS_BUTTON,
								cls : 'portal_pos_btn',
								scope : this,
								handler : this.raiseBBarClickEvent
							});
						}
					}
					if (!Ext.isEmpty(vmd.VIEW_MD.FLD_BBAR_BUTTONS.NEGATIVE_BUTTONS)) {
						buttonArray.push('->');
						var posButtons = vmd.VIEW_MD.FLD_BBAR_BUTTONS.NEGATIVE_BUTTONS;
						for ( var i = 0; i < posButtons.length; i++) {
							var obj = posButtons[i];
							buttonArray.push({
								xtype : 'button',
								buttonId : obj.FLD_BBAR_BTN_ID,
								text : this.rb[obj.FLD_BTN_DISPLAY_NM],
								isSystemButton : obj.FLD_IS_SYS_BUTTON,
								cls : 'portal_neg_btn',
								scope : this,
								handler : this.raiseBBarClickEvent
							});
						}
					}
				}
				else if (posBtn==='RIGHT' && negBtn === 'RIGHT'){
					if (!Ext.isEmpty(vmd.VIEW_MD.FLD_BBAR_BUTTONS.POSITIVE_BUTTONS)) {
						var posButtons = vmd.VIEW_MD.FLD_BBAR_BUTTONS.POSITIVE_BUTTONS;
						buttonArray.push('->');
						for ( var i = 0; i < posButtons.length; i++) {
							var obj = posButtons[i];
							buttonArray.push({
								xtype : 'button',
								buttonId : obj.FLD_BBAR_BTN_ID,
								text : this.rb[obj.FLD_BTN_DISPLAY_NM],
								isSystemButton : obj.FLD_IS_SYS_BUTTON,
								cls : 'portal_pos_btn',
								scope : this,
								handler : this.raiseBBarClickEvent
							});
						}
					}
					if (!Ext.isEmpty(vmd.VIEW_MD.FLD_BBAR_BUTTONS.NEGATIVE_BUTTONS)) {
						var posButtons = vmd.VIEW_MD.FLD_BBAR_BUTTONS.NEGATIVE_BUTTONS;
						for ( var i = 0; i < posButtons.length; i++) {
							var obj = posButtons[i];
							buttonArray.push({
								xtype : 'button',
								buttonId : obj.FLD_BBAR_BTN_ID,
								text : this.rb[obj.FLD_BTN_DISPLAY_NM],
								isSystemButton : obj.FLD_IS_SYS_BUTTON,
								cls : 'portal_neg_btn',
								scope : this,
								handler : this.raiseBBarClickEvent
							});
						}
					}	
				}
				else {
					if (!Ext.isEmpty(vmd.VIEW_MD.FLD_BBAR_BUTTONS.POSITIVE_BUTTONS)) {
						var posButtons = vmd.VIEW_MD.FLD_BBAR_BUTTONS.POSITIVE_BUTTONS;
						for ( var i = 0; i < posButtons.length; i++) {
							var obj = posButtons[i];
		
							buttonArray.push({
								xtype : 'button',
								buttonId : obj.FLD_BBAR_BTN_ID,
								text : this.rb[obj.FLD_BTN_DISPLAY_NM],
								cls : 'portal_pos_btn',
								scope : this,
								isSystemButton : obj.FLD_IS_SYS_BUTTON,
								handler : this.raiseBBarClickEvent
							});
						}
					}
					if (!Ext.isEmpty(vmd.VIEW_MD.FLD_BBAR_BUTTONS.NEGATIVE_BUTTONS)) {
						var posButtons = vmd.VIEW_MD.FLD_BBAR_BUTTONS.NEGATIVE_BUTTONS;
						for ( var i = 0; i < posButtons.length; i++) {
							var obj = posButtons[i];
							buttonArray.push({
								xtype : 'button',
								buttonId : obj.FLD_BBAR_BTN_ID,
								text : this.rb[obj.FLD_BTN_DISPLAY_NM],
								cls : 'portal_neg_btn',
								scope : this,
								isSystemButton : obj.FLD_IS_SYS_BUTTON,
								handler : this.raiseBBarClickEvent
							});
						}
					}
				}
				return buttonArray;
			}
			return null;
		},
		/**
		 * Common method for raising Multiview event in case
		 * any bbar buttons is clicked while firing the
		 * event, it will also pass the id of the Button
		 * that is clicked
		 */
		raiseBBarClickEvent:function(event, toolEl, panel){
	    	var mdata;
	    	mdata = this.getSelectedViewMd();
	    	var component=null;
	    	var selectedData=null;
	    	if(IMM.isGroupView(mdata)){
	    		component=selectedData=this.getGridCmp();
	    	}
	    	else if(IMM.isChartView(mdata)){
	    		component=selectedData= this.getPanelCmp();
	    	}
	    	else{
	    		component=selectedData= this.getGridCmp();
	    	}
			/**
			 * call the method only if the method is
			 * implemented by the component rendered
			 */
	    	if(component!=null && component.getSelectedData){
	    		selectedData=component.getSelectedData();
	    	}
			if ('Y' == event.isSystemButton) {
				var handler = CWSBHF.getHandler(event.buttonId);
				handler ? new handler(this, selectedData) : Ext.emptyFn();
			} 
			else {
				this.mvConf.fireEvent('bbuttonclick', event.buttonId, selectedData);
			}
		},
		/**
		 * Intended to 1. Call showHideTools api to make
		 * sure to display only available tools for selected
		 * view 2. Call Multi View Renderer, for rendering
		 * either group view/List view based on selected
		 * view type.
		 */
		renderView : function (){
			var sysvid, vmd, search;
			vmd = this.getSelectedViewMd();
			sysvid = this.findSystemViewId(vmd);
			if (this.mvConf.isLoadingToolsInside == true) {
				this.getSelectedPanel().tools = this.getTools(this);
				this.getSelectedPanel().tbar = this.tbar;
			}
			this.updateOwnerTitle();
			if (this.ownerAcceptBBar || this.mvConf.ownerAcceptBBar) {
				this.getSelectedPanel().tools = [];
			}
			/**
			 * To set the currency value and
			 * show/hide the currency indicator with all the
			 * as per the view definition
			 */
			this.setCurrency();
			this.showCurrencyInd();
			this.showHighlightInd(); 
			this.mvConf.fireEvent('highlight', sysvid, vmd); 
			this.mvConf.fireEvent('viewchange', sysvid, vmd);
			if (IMM.isSearchMode(this.removeIdSuffix())) {
				var cmp = Ext.getCmp(this.mvConf.id + "_SEARCHFORM");
				if (cmp) {
					cmp.destroy();
				}
				search = new iportal.view.SearchForm({
					mvConf : this.mvConf,
					vmd : this.getSelectedViewMd(),
					name : this.viewsTitles[sysvid]
				});
			} else {
				this.ccySelectHandler(this.removeIdSuffix() + "_" + vmd.VIEW_MD.VIEW_ID,
							iportal.preferences.getEquivalentCurrency());
				var viewType = this.getSelectedViewMd().VIEW_MD.FLD_VIEW_TYPE;
				var scope = this;
				CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getConstant(viewType+"_VIEW"),function(){
					var renderer = iportal.view.MultiViewRenderer({
						viewConf : vmd,
						ccySelectHandler : scope.ccySelectHandler,
						mvh : scope,
						mvConf : scope.mvConf,
						itemId : scope.removeIdSuffix()
					});
					renderer.mvh = scope;
					if (scope.mvConf.isLoadingToolsInside == true) {
						scope.getSelectedPanel().tools = scope.getTools(scope);
						scope.getSelectedPanel().tbar = scope.tbar;
					}
					/**
					 * Removing the bbar items and tools if
					 * owner object accepts bbar.
					 */
					if (scope.ownerAcceptBBar || scope.mvConf.ownerAcceptBBar) {
						if (scope.getSelectedPanel().getBottomToolbar()) {
							scope.getSelectedPanel().getBottomToolbar().removeAll();
						}
						scope.getSelectedPanel().tools = [];
					}
					var selPanel = scope.getSelectedPanel();
					if (selPanel) {
						try{
							if(!cbx.isEmpty(selPanel.getComponent(0))){
								selPanel.remove(selPanel.getComponent(0),true);
							}
						}
						catch(e){
							LOGGER.error(e);
						}
						var isWidgetEntitled = false;
						viewList = IMM.getViewsList(this.removeIdSuffix());
						for ( var i = 0; i < viewList.length; i++) {
							if (viewList[i].VIEW_ID == this.vmd.VIEW_MD.SYSTEM_VIEW_ID) {
								isWidgetEntitled = viewList[i].IS_ENTITLED == 'Y' ? true : false;
							}
						}
						if (!isWidgetEntitled) {
							this.isEntitled = false;
							var rb = CRB.getFWBundle();
							var emptyPanel = new Ext.Panel({
								html : rb['NOT_ENTITLED_WIDGET']
							});
							setTimeout(function (){
								selPanel.renderer = emptyPanel;
								selPanel.add(emptyPanel);
								selPanel.doLayout();
							}, 100);
						}
						else {
							this.isEntitled = true;
							setTimeout(function (){
								selPanel.renderer = renderer;
								selPanel.add(renderer);
								selPanel.doLayout();
								if(selPanel.activateRequestQueue.length>0){
									for(var i=0;i<selPanel.activateRequestQueue.length;i++){
										var widget = selPanel.activateRequestQueue[i].widget;
										var newItem = selPanel.activateRequestQueue[i].newItem;
										var options =  selPanel.activateRequestQueue[i].options;
										selPanel.activateContainer(newItem,widget,options);
										selPanel.activateRequestQueue.splice(i,1);
									}
								}
							}, 100);
						}
					}
				},'js',this);
			}
		},
		/**
		 * Intended to provide the tool icon with all the
		 * associated tools as per the view difinition
		 */
		getTools : function (header){
			var vmd = header.getSelectedViewMd();
			var customTools={};
			if (vmd != null && vmd.VIEW_MD != null && vmd.VIEW_MD.FLD_TOOLS_LIST != null) {
				var tools = vmd.VIEW_MD.FLD_TOOLS_LIST;
				if(vmd.VIEW_MD.FLD_CUSTOM_TOOLS_LIST!=null)
					customTools = eval('('+ vmd.VIEW_MD.FLD_CUSTOM_TOOLS_LIST+')');
				var toolsArray = new Array();
				if (null != vmd.VIEW_MD.FLD_TOOLS_LIST && vmd.VIEW_MD.FLD_TOOLS_LIST != "") {
					var showToolsAsLinearFlag = iportal.systempreferences.getToolsAsLinearFlag();
					if (showToolsAsLinearFlag) {
						var helpMenu = {
							id : 'help',
							qtip : this.cmRb.TOOL_TIPS_HELP,  
							iconCls : 'help',
							hidden : (tools.toUpperCase().indexOf("HELP") == -1),
							disabled : this.isEntitled ? false : true,
							handler : function (){
								header.handlehelp();
							}
						};
						toolsArray.push(helpMenu);
						var exportExcel = {
							id : 'excel',
							qtip : this.cmRb.TOOL_TIPS_EXCEL, 
							iconCls : 'excel',
							hidden : (tools.toUpperCase().indexOf("EXCEL") == -1),
							disabled : this.isEntitled ? false : true,
							handler : function (){
								header.excelExport();
							}
						};
						toolsArray.push(exportExcel);
						var exportPdfMenu = {
							id : 'pdf',
							qtip : this.cmRb.TOOL_TIPS_PDF,  
							iconCls : 'pdf',
							hidden : (tools.toUpperCase().indexOf("PDF") == -1),
							disabled : this.isEntitled ? false : true,
							handler : function (){
								header.pdfExport();
							}
						};
						toolsArray.push(exportPdfMenu);
						var exportCsvMenu = {
							id : 'csv',
							qtip : this.cmRb.TOOL_TIPS_CSV, 
							iconCls : 'csv', 
							hidden : (tools.toUpperCase().indexOf("CSV") == -1),
							disabled : this.isEntitled ? false : true,
							handler : function (){
								header.csvExport();
							}
						};
						toolsArray.push(exportCsvMenu);
						var clearFilterMenu = {
							id : 'clearFilter',
							qtip : this.cmRb.TOOL_TIPS_CLEAR_FILTER,
							iconCls : 'filter',
							hidden : (tools.toUpperCase().indexOf("FILTER") == -1),
							disabled : this.isEntitled ? false : true,
							handler : function (){
								header.clearFilters();
							}
						};
						toolsArray.push(clearFilterMenu);
						var refreshMenu = {
							id : 'refresh',
							qtip : this.cmRb.TOOL_TIPS_REFRESH,  
							iconCls : 'refresh',
							hidden : (tools.toUpperCase().indexOf("REFRESH") == -1),
							disabled : this.isEntitled ? false : true,
							handler : function (){
								header.refresh();
							}
						};
						toolsArray.push(refreshMenu);
						var printMenu = {
							id : 'print',
							qtip : this.cmRb.TOOL_TIPS_PRINT,   
							iconCls : 'print',
							hidden : (tools.toUpperCase().indexOf("PRINT") == -1),
							disabled : this.isEntitled ? false : true,
							handler : function (){
								header.print();
							}
						};
						toolsArray.push(printMenu);
						if( !Ext.isEmpty(customTools))
							 {
							for(var i=0;i<customTools.length;i++)
								{
								this.getCustomToolsLinear(customTools[i],toolsArray);
								}
							 }
						} 
						else {
							var pinMenu = {
								id : 'pin',
								qtip : this.cmRb.TOOL_TIPS_PIN,    
								hidden : (this.mvConf.isLoadingToolsInside == false),
								disabled : this.isEntitled ? false : true,
								handler : function (){
									header.getToolsMenuItems(header).show(this.id);
								}
							};
							toolsArray.push(pinMenu);
							/** Code to add custom tools in the root of the multi view header */
							 if( !Ext.isEmpty(customTools)) {
								 for(var i=0;i<customTools.length;i++) {
								 	if(customTools[i].TOOL_TYPE.toUpperCase()=="ROOT"){
							 			var that=this;
							 			var customRootMenu = {
						 					id : customTools[i].MENU_ID+"__CUSTOM",
						 					iconCls:customTools[i].MENU_ID,													 		
						 					qtip : customTools[i].DISPLAY_NAME?(this.rb[customTools[i].DISPLAY_NAME]?this.rb[customTools[i].DISPLAY_NAME]:customTools[i].DISPLAY_NAME):customTools[i].MENU_ID ,
						 					hidden:false,
						 					handler : function (event, toolEl, panel, tc){
												if (that.getCustomToolsMenuItems) {
													var menu = that.getCustomToolsMenuItems(that,tc.id.substr(0,tc.id.length-8));
													if (menu) {
														menu.show(this.id);
													}
												}
						 					}
							 			};
							 			if(!(customTools[i].child_nodes.length>0)) {
							 				customRootMenu.handler=function (event, toolEl, panel, tc){
							 					that.handleCustomToolAction(that,tc.id.substr(0,tc.id.length-8),toolEl);
										    };
										}
							 			toolsArray.push(customRootMenu);
							 		}
								 }
							 }
						}
						var prefMenu = {
							id : 'pref',
							qtip : this.cmRb.TOOL_TIPS_PREFERENCE,  
							hidden : (null == vmd.VIEW_MD.FLD_TOOLS_LIST || vmd.VIEW_MD.FLD_TOOLS_LIST == "")
										|| this.mvConf.isLoadingToolsInside == false
										|| (tools.toUpperCase().indexOf("GEAR") == -1),
							disabled : this.isEntitled ? false : true,
							handler : function (){
								header.getPreferenceMenuItems(header).show(this.id);
							}
						};
						toolsArray.push(prefMenu);
						var switchView = {
							id : 'switchView',
									qtip : this.cmRb.TOOL_TIPS_SWITCHVIEW,  
							hidden : (this.isToolsAvailable().CHART_TOOL_IND == false),
							disabled : this.isEntitled ? false : true,
							handler : function (){
								if (IMM.isChartView(vmd)) {
									header.getSwitchViewIcon(header).show(this.id);
								}
							}
						};
						toolsArray.push(switchView);
						var switchChart = {
							id : 'switchChart',
							qtip : this.cmRb.TOOL_TIPS_SWITCHCHART,   
							hidden : (this.isToolsAvailable().CHART_TOOL_IND == false),
							disabled : this.isEntitled ? false : true,
							handler : function(){
								if(IMM.isChartView(vmd)){
									header.getSwitchChartIcon(header).show(this.id);
								}
							}
						};
						toolsArray.push(switchChart);
					}
				}
				return toolsArray;
			},
			/**
			 * Method to handle custom tool action
			 * @ param 
			 * header- Multi view header
			 * customToolId
			 */
			handleCustomToolAction : function (header,customToolId,toolScope){
				var config = header.getSelectedViewMd();
				var component=IMM.isChartView(config)?this.getPanelCmp():this.getGridCmp();
				var isDataAvailable=header.validateExportRequest();
				config.isDataAvailable=isDataAvailable;
				if(!Ext.isEmpty(component) && !Ext.isEmpty(component.store)&& !Ext.isEmpty(component.store.baseParams)){
					config.baseParams = component.store.baseParams;
				} 
				config.toolScope=toolScope;
				CACTH.executeHandler(customToolId,config);
			},
			/**
			 * This method adds all the custom tools in an array.
			 * @param
			 * customToolItem- A custom tool
			 * toolsArray
			 * 
			 */
			getCustomToolsLinear: function(customToolItem,toolsArray){
				var that=this;
				var toolItem={
					id : customToolItem.MENU_ID+"__CUSTOM",
					qtip : customToolItem.DISPLAY_NAME?(this.rb[customToolItem.DISPLAY_NAME]?this.rb[customToolItem.DISPLAY_NAME]:customToolItem.DISPLAY_NAME):customToolItem.MENU_ID ,
					iconCls : customToolItem.MENU_ID,
					renderHidden : false,
					hidden:false,
					handler : function (event, toolEl,panel,tc){
						if(!Ext.isEmpty(tc))
							that.handleCustomToolAction(that,tc.id.substr(0,tc.id.length-8),toolEl);
						else
							that.handleCustomToolAction(that,this.id.substr(0,this.id.length-8),toolEl);
					}
				};
				if(!Ext.isEmpty(customToolItem.child_nodes)) {
					for(var i=0;i<customToolItem.child_nodes.length;i++) {
						this.getCustomToolsLinear(customToolItem.child_nodes[i],toolsArray);
					}
				}
				else {
					toolsArray.push(toolItem);
				}
			},
			/**
			 * This method adds the custom tools and its child tools in an hierarchical manner.
			 * @param
			 * customToolItem- A custom tool
			 * toolsArray
			 */
			getCustomTools: function(customToolItem,toolsArray){
				var toolItem={
					id: customToolItem.MENU_ID+"__CUSTOM",
					qtip : customToolItem.DISPLAY_NAME?(this.rb[customToolItem.DISPLAY_NAME]?this.rb[customToolItem.DISPLAY_NAME]:customToolItem.DISPLAY_NAME):customToolItem.MENU_ID ,
					iconCls :customToolItem.MENU_ID,
					text : customToolItem.DISPLAY_NAME?(this.rb[customToolItem.DISPLAY_NAME]?this.rb[customToolItem.DISPLAY_NAME]:customToolItem.DISPLAY_NAME):customToolItem.MENU_ID ,
					hidden : false,
					menu:  {
						items:[]
					}
				};
				if(!Ext.isEmpty(customToolItem.child_nodes)) {
					for(var i=0;i<customToolItem.child_nodes.length;i++) {
						this.getCustomTools(customToolItem.child_nodes[i],toolItem.menu.items);
					}
				}
				else {
					delete toolItem["menu"];
					var that=this;
					toolItem["handler"]= function (event, toolEl,panel,tc){
						if(!Ext.isEmpty(tc))
							that.handleCustomToolAction(that,tc.id.substr(0,tc.id.length-8),toolEl);
						else
							that.handleCustomToolAction(that,this.id.substr(0,this.id.length-8),toolEl);
					};
				}
				toolsArray.push(toolItem);
			},
			handleToolAction : function (header, menuItem){
				if ("HELP" == menuItem) {
					header.handlehelp();
				} else if ("EXCEL" == menuItem) {
					header.excelExport();
				} else if ("PDF" == menuItem) {
					header.pdfExport();
				} else if ("CSV" == menuItem) {
					header.csvExport();
				} else if ("RTF" == menuItem) {
					header.rtfExport();
				} else if ("FILTER" == menuItem) {
					header.clearFilters();
				} else if ("REFRESH" == menuItem) {
					header.refresh();
				} else if ("PRINT" == menuItem) {
					header.print();
				}
			},
			getCustomToolsMenuItems : function (header,menuId){
				var customTools={}; 
				var menuArray=new Array();
				var vmd = header.getSelectedViewMd();
				if(vmd.VIEW_MD.FLD_CUSTOM_TOOLS_LIST != null)
				{
				customTools = eval('('+ vmd.VIEW_MD.FLD_CUSTOM_TOOLS_LIST+')');
				}
				var menu = new Ext.menu.Menu({
					ignoreParentClicks : true
				});
				if(!Ext.isEmpty(customTools)){
					for(var i=0;i<customTools.length;i++){
						if(customTools[i].MENU_ID==menuId){
							for(var j=0;j<customTools[i].child_nodes.length;j++){
								menuArray=new Array(); 
								this.getCustomTools(customTools[i].child_nodes[j],menuArray);
								menu.add(menuArray);
							}
						}
					}
				}
				return menu;
			},
			getToolsMenuItems : function (header){
				var that = this;
				var customTools={}; 
				var vmd = header.getSelectedViewMd();
				if (vmd != null && vmd.VIEW_MD != null && vmd.VIEW_MD.FLD_TOOLS_LIST != null) {
					var tools = vmd.VIEW_MD.FLD_TOOLS_LIST;
					if(!Ext.isEmpty(vmd.VIEW_MD.FLD_CUSTOM_TOOLS_LIST)){
						customTools = eval('('+ vmd.VIEW_MD.FLD_CUSTOM_TOOLS_LIST+')');
					}
					var menu = new Ext.menu.Menu({
						ignoreParentClicks : true
					});
					menuArr = new Array();
					var help = {
						iconCls : 'help',
						text : this.cmRb.TOOL_TIPS_HELP,   
						disabled : this.isEntitled ? false : true,
						hidden : (tools.toUpperCase().indexOf("HELP") == -1),
						handler : function (){
							header.handlehelp();
						}
					};
					menu.add(help);
					var subMenu = {
						text : this.cmRb.TOOL_TIPS_EXPORT,
						iconCls : 'export',
						iconCls : 'export',
						ignoreParentClicks : true,
						menu : {
							items : [ {
								iconCls : 'excel',
								text : this.cmRb.TOOL_TIPS_EXCEL,  
								hidden : (tools.toUpperCase().indexOf("EXCEL") == -1),
								disabled : this.isEntitled ? false : true,
								handler : function (){
									header.excelExport();
								}
							}, {
								iconCls : 'pdf',
								text : this.cmRb.TOOL_TIPS_PDF,  
								hidden : (tools.toUpperCase().indexOf("PDF") == -1),
								disabled : this.isEntitled ? false : true,
								handler : function (){
									header.pdfExport();
								}
							}, {
								iconCls : 'csv',
								text : this.cmRb.TOOL_TIPS_CSV,   
								hidden : (tools.toUpperCase().indexOf("CSV") == -1),
								disabled : this.isEntitled ? false : true,
								handler : function (){
									header.csvExport();
								}													
							},{
								iconCls : 'rtf',
								text : this.cmRb.TOOL_TIPS_RTF,
								hidden : (tools.toUpperCase().indexOf("RTF") == -1),
								disabled : this.isEntitled ? false : true,
								handler : function (){
									header.rtfExport();
								}
							}]
						}
					};
					if(!Ext.isEmpty(customTools)) {
						for(var i=0;i<customTools.length;i++) {
							if(customTools[i].TOOL_TYPE.toUpperCase()=="EXPORT"){
								this.getCustomTools(customTools[i],subMenu.menu.items);
							}
						}
					}
					if (tools.toUpperCase().indexOf("EXCEL") > -1
								|| tools.toUpperCase().indexOf("PDF") > -1
								|| tools.toUpperCase().indexOf("CSV") > -1
								|| tools.toUpperCase().indexOf("RTF") > -1) {
						menu.add(subMenu);
					}
					else if(!Ext.isEmpty(customTools)&&customTools.length>0) {
						for(var i=0;i<subMenu.menu.items.length;i++){
							if(subMenu.menu.items[i].iconCls=="excel"
								||subMenu.menu.items[i].iconCls=="pdf"
									||subMenu.menu.items[i].iconCls=="csv"
										||subMenu.menu.items[i].iconCls=="rtf"){
								delete subMenu.menu.items[i];		
							}
						}
						menu.add(subMenu);
					}
					var filter = {
						iconCls : 'filter',
						text : this.cmRb.TOOL_TIPS_CLEAR_FILTER,
						iconCls : 'filter',
						hidden : (tools.toUpperCase().indexOf("FILTER") == -1),
						disabled : this.isEntitled ? false : true,
						handler : function (){
							header.clearFilters();
						}
					};
					menu.add(filter);
					var refresh = {
						iconCls : 'refresh',
						text : this.cmRb.TOOL_TIPS_REFRESH,  
						iconCls : 'refresh',
						hidden : (tools.toUpperCase().indexOf("REFRESH") == -1),
						disabled : this.isEntitled ? false : true,
						handler : function (){
							header.refresh();
						}
					};
					menu.add(refresh);
					var print = {
						iconCls : 'print',
						text : this.cmRb.TOOLTIP_PRINT,
						hidden : (tools.toUpperCase().indexOf("PRINT") == -1),
						disabled : this.isEntitled ? false : true,
						handler : function (){
							header.print();
						}
					};
					menu.add(print);
					/**
					 * This function is added for calling the function of show/hide of the 
					 * ToolBar0-"getToolbar" & the hide of the More tool icon.
					 * The tool is also configured from db and passed here.
					 *   
					 */
					var toolbarMenu = {
						iconCls : 'showastoolbar',		
						text : this.cmRb.TOOL_TIPS_TBAR,
						iconCls : 'showastoolbar',
						hidden : (tools.toUpperCase().indexOf("SHOWASTOOLBAR") == -1),
						disabled : this.isEntitled ? false : true,
						handler : function (){
							header.getToolbar();
							if(header.mvConf.isLoadingToolsInside) // only for muli wiget explorer it is TRUE
							{
								var children=header.getSelectedPanel().header.dom.children,i; //get hearder children as HTML Dom elements
								for(i=0;i<children.length;i++)
								if(children[i].className=="x-tool x-tool-pin") //check for tool bar menu dropdown in the children and hide it
								{Ext.get(children[i].id).setVisible(false);break;}
							}else if (header.findParentByType('portlet')) {
								header.findParentByType('portlet').tools.pin.setVisible(false);
							}
							else if (header.findParentByType('iportal-window')) {
								header.findParentByType('iportal-window').tools.pin.setVisible(false);
							}									
							else if (header.findParentByType('window')) {
								header.findParentByType('window').tools.pin.setVisible(false);
							}
							else if (header.findParentByType('iportal-window')) {
								header.findParentByType('iportal-window').tools.pin.setVisible(false);
							}
						}
					};
					menu.add(toolbarMenu);
					var customPinMenu=new Array();
					if(!Ext.isEmpty(customTools)) {
					for(var i=0;i<customTools.length;i++) {
						if(customTools[i].TOOL_TYPE.toUpperCase()=="PIN"){
							this.getCustomTools(customTools[i],customPinMenu);
							menu.add(customPinMenu);
						}
					}
				}
				return menu;
			}
		},
		getSwitchViewIcon : function(mvh){
			var vmd = mvh.getSelectedViewMd();
			this.clickCount++;
			if(IMM.isChartView(vmd)&&this.getSelectedPanel().getComponent(0).getHeight()==0){
				if(this.clickCount%2 == 1){
					this.getPanelCmp().disposeAvailable();
					this.getPanelCmp().loadGrid();
				}
				else if(this.clickCount%2 == 0){
					this.getPanelCmp().disposeAvailable();
					this.getPanelCmp().reloadData();
				}
			}
		},
		getSwitchChartIcon : function(mvh){
			var that = this;
			var menu = null;
			var vmd = mvh.getSelectedViewMd();
			if (vmd != null && vmd.VIEW_MD != null) {
					menu = new Ext.menu.Menu({
					ignoreParentClicks : true
					});
				if (IMM.isChartView(vmd)&&this.clickCount%2 == 0) {
					var chartTypesArray = [];
					this.convertables = this.getPanelCmp().getChartTypes();
						var rb = CRB.getBundle(this.resourceBundleKey != null ? this.resourceBundleKey: CRB.getFWBundleKey());
						if(this.convertables!=undefined){
							for ( var a = 0; a < this.convertables.length; a++) {
								if (Ext.getCmp(this.getPanelCmp().getChartcmpId()+"_"+this.convertables[a]+"_MENU")) {
									Ext.getCmp(this.getPanelCmp().getChartcmpId()+"_"+this.convertables[a]+"_MENU").destroy();
								}
							}
						}
					//if(this.convertables.contains(this.getPanelCmp().config.chartType)){ 05_11_2015
						for(var i=0;i<this.convertables.length;i++){
							//if(this.convertables[i]!=this.getPanelCmp().config.chartType){
							chartTypesArray.push({
								id: this.getPanelCmp().getChartcmpId()+"_"+this.convertables[i]+"_MENU",
								text : this.convertables[i], //CRB.getBundle(CRB.getFWBundleKey())[convertables[i] + '_CHART'],
								iconCls : this.convertables[i] + '_CHART',
								switchChartTo : this.convertables[i],
								count : i,
								handler : function() {
											//	that.getPanelCmp().config.viewConf.VIEW_MD.FLD_CHART_TYPE  = this.switchChartTo;
											that.getPanelCmp().config.isChartTypeBeingChanged = true;
											that.getPanelCmp().config.switchChartTo = this.switchChartTo;
											//that.getPanelCmp().constructor(that.getPanelCmp().config);
											that.getPanelCmp().switchChart(that.getPanelCmp().config);
											//that.getPanelCmp().updateChartData("chartAction",{"0":"nithish","1":"G"});
										}
							});
						//}
					}
				//}
				menu.add(chartTypesArray);
				return menu;
				}
			  }
			},
		/**
		 * <pre>
		 * This method is used to construct the preference
		 * menu for widget. It returns if the Customized
		 * Indicator of Widget as well and View definition
		 * should be enabled. 
		 * Default menus 1. Switch View -With all views 
		 * 2. Remove - With all customized views 
		 * 3. Customize
		 *</pre>
		 * 
		 *  Updated the method by bringing
		 * prefInd and switchWidgetInd checks for creating
		 * the preference menu. In case
		 * switchWidgetInd=true, the "Switch Menu" options
		 * would be generated by the MultiWidgetSwitch class
		 * itself and rest of the code would work as it is.
		 */
		getPreferenceMenuItems : function (mvh){
			var menu = null;
			var vmd = mvh.getSelectedViewMd();
			if (vmd != null && vmd.VIEW_MD != null) {
				var toolsObj = this.isToolsAvailable(); 
				var prefInd = toolsObj.PREFS_IND;
				var switchWidgetInd = toolsObj.SWITCH_WIDGET_IND;
				if (this.isCustomizedView(vmd) || switchWidgetInd === true) {
					menu = new Ext.menu.Menu({
						ignoreParentClicks : true
					});
					if (IMM.isListView(vmd) || IMM.isGroupView(vmd)) {
						if (prefInd === true) { 
							var saveAs = {
								iconCls : 'save-preference',
								text : this.cmRb.TOOL_TIPS_SAVE_AS,   
								hidden : false,
								disabled : this.isEntitled ? false : true,
								handler : function (){
									mvh.savePreference();
								}
							};
							menu.add(saveAs);
							var revert = {
								iconCls : 'revert-preference',
								text : this.cmRb.TOOL_TIPS_REVERT,  
								hidden : false,
								disabled : this.isEntitled ? false : true,
								handler : function (){
									mvh.revertPreferenceChanges();
								}
							};
							menu.add(revert);
						}
					} 
					var widgetViews = IMM.getViewsList(this.removeIdSuffix());
					if (widgetViews.length > 0) {
						var selViewName = vmd.VIEW_MD.VIEW_DISPLAY_NM;
						var selViewId = vmd.VIEW_MD.VIEW_ID;
						var sysViewId = this.findSystemViewId(vmd);
						var sysView = IMM.getView(sysViewId);
						var isSystemView = (selViewId === sysViewId);
						if (IMM.isListView(vmd) || IMM.isGroupView(vmd)) {
							if (prefInd === true) { 
								var save = {
									iconCls : 'update-preference',
									text : this.cmRb.TOOL_TIPS_UPDATE, 
									disabled : this.isEntitled ? false : true,
									hidden : isSystemView,
									selviewid : selViewId,
									handler : function (){
										mvh.updatePreference(this.selviewid, selViewName);
									}
								};
								menu.add(save);
							}
						} 
						var switchToSubMenu = [];
						var removeSubMenu = [];
						/**
						 * the flag value
						 * true means that the widget is
						 * loaded under a MultiWidgetSwitch
						 * container. So, call the owner to
						 * get the Switch Menu Options with
						 * handlers
						 */
						if (switchWidgetInd === true) {
							var switchMultiWidget = this.findParentBy(function (container){
								if (container.isContainerWidget == true) {
									return true;
								}
							});
							if (switchMultiWidget != null && switchMultiWidget.getSwitchMenu) {
								switchToSubMenu = switchMultiWidget.getSwitchMenu(this) || [];
							}
						}
						for ( var i = 0, len = widgetViews.length; i < len; i++) { 
							var tmpView = widgetViews[i];
							var displayName = this.rb[tmpView.VIEW_DISPLAY_NM]
										|| tmpView.VIEW_DISPLAY_NM; 
							var tmpViewId = tmpView.VIEW_ID;
							var menuStyle = 'user-defined-preference';
							var switchMenuHandler = function (){
								mvh.switchPreference(this.selviewid);
							};
							if (tmpViewId === selViewId) {
								menuStyle = 'selected-preference';
								switchMenuHandler = function (){
								};
							}
							if (tmpView.CUSTOMIZE_IND === 'Y') {
								if (tmpView.OD_USER_NO === '-1' && tmpView.OD_GCIF === '-1') {
									displayName = this.getSystemViewTitle();
									menuStyle = 'default-preference';
								} 
								else {
									removeSubMenu.push({
										iconCls : menuStyle,
										text : displayName,
										selviewid : tmpViewId,
										hidden : false,
										disabled : this.isEntitled ? false : true,
										handler : function (){
											mvh.removePreference(this.selviewid);
										}
									});
								}
								if (prefInd === true && switchWidgetInd === false) {
									switchToSubMenu.push({
										iconCls : menuStyle,
										text : displayName,
										hidden : false,
										selviewid : tmpViewId,
										handler : switchMenuHandler
									});
								}
							}
						} 
						if (switchToSubMenu.length > 0) {
							var restore = {
								iconCls : 'switch-preference',
								text : this.cmRb.TOOL_TIPS_SWITCHVIEW,   
								ignoreParentClicks : true,
								menu : {
									items : switchToSubMenu
								}
							};
							menu.add(restore);
						}
						if (removeSubMenu.length > 0) {
							var remove = {
								iconCls : 'delete-preference',
								ignoreParentClicks : true,
								text : this.cmRb.TOOL_TIPS_REMOVE, 
								menu : {
									items : removeSubMenu
								}
							};
							if (prefInd === true) { 
								menu.add(remove);
							}
						}
					} 
				}
			}
			return menu;
		},
		/**
		 * change of currency ,currency value
		 * received from parent is applied on grid component
		 * and loaded
		 * 
		 * @param currency
		 */
		onCurrChange : function (currency){
			var params = {};
			params["CURRENCY_CD"] = currency;
			params["RATECARD"] = iportal.preferences.getRateCard();
			if (this.getGridCmp()) {
				var grdstr = this.getGridCmp().getStore();
				Ext.apply(grdstr.baseParams, params);
				grdstr.load();
			}
		},
		clearFilters : function (){
			if(this.getGridCmp()!==undefined){
				this.getGridCmp().filters.deleteOldFilters(this.getGridCmp().getStore().baseParams);
				this.getGridCmp().filters.permanentState(undefined);
				var mdata = this.getSelectedViewMd();
				if (!IMM.isIFrameView(mdata)) {
					if (this.getGridCmp().filters) {
						this.getGridCmp().filters.clearFilters();
						this.getGridCmp().filters.clearFilterValues();
					}
				}
			}
		},
		clearFiltersFromTree : function (){
			this.getGridCmp().filters.deleteOldFilters(this.getGridCmp().getStore().baseParams);
			this.getGridCmp().filters.permanentState(undefined);
			this.getGridCmp().getStore().load();
		},
		applyFilterFromTree : function (id, field){
			var params = {};
			params["FILTER1_FIELD"] = field;
			params["FILTER1_CONSTRAINT"] = "contains";
			params["FILTER1_VALUE_TXT"] = id;
			params["FILTER1_VALUE_DATE"] = "";
			params["FILTER1_VALUE_DATE2"] = "";
			params["FILTER1_VALUE_TIME"] = " Select";
			params["FILTER1_VALUE_TIME2"] = " Select";
			params["COLUMN_COUNT"] = 1;
			params["IS_FILTER_FORM"] = true;
			this.getGridCmp().filters.permanentState(params);
			Ext.apply(this.getGridCmp().getStore().baseParams, params);
			this.getGridCmp().getStore().load();
		},
		excelExport : function (){
			/**
			 * Check whether cmp has data or not, if data
			 * allow user to print else show error message
			 */
			if (this.validateExportRequest('TOOL_TIPS_EXCEL')) {
				var mdata = this.getSelectedViewMd();
				if (IMM.isFormView(mdata)) {
						this.getPanelCmp().fm.exportForForms('PDF');
					
				} else{
					var export_format = 'XLS';
					this.exportTemplate(export_format);
				}
			}
		},
		pdfExport : function (){
			/**
			 * Check whether cmp has data or not, if data
			 * allow user to print else show error message
			 */
			if (this.validateExportRequest('TOOL_TIPS_PDF')) {
				
				var mdata = this.getSelectedViewMd();
				if (IMM.isFormView(mdata)) {
						this.getPanelCmp().fm.exportForForms('PDF');
					
				} else{
					var export_format = 'PDF';
					this.exportTemplate(export_format);
				}
			}
			},
		
		csvExport : function (){
			/**
			 * Check whether cmp has data or not, if data
			 * allow user to print else show error message
			 */
			if (this.validateExportRequest('TOOL_TIPS_CSV')) {
				var mdata = this.getSelectedViewMd();
				if (IMM.isFormView(mdata)) {
						this.getPanelCmp().fm.exportForForms('PDF');
					
				} else{
					var export_format = 'CSV';
					this.exportTemplate(export_format);
				}
			}
		},
		rtfExport : function (){
			/**
			 * Check whether cmp has data or not, if data
			 * allow user to print else show error message
			 */
			if (this.validateExportRequest('TOOLTIP_RTF')) {
				var mdata = this.getSelectedViewMd();
				if (IMM.isFormView(mdata)) {
						this.getPanelCmp().fm.exportForForms('PDF');
					
				} else{
					 var export_format = 'RTF';
					this.exportTemplate(export_format);
				}
			}
		},
		/**
		 * generic function for exporting in the specified format
		 */
		exportTemplate : function(export_format){
			/**
			 * Retrieving the product and sub
			 * product code from the widget's metadata
			 */
			var productCode = null, subProductCode = null,functionCode = null;
			var viewConf = this.getSelectedViewMd();
			var widBundleKey = this.mvConf.bundle;
			var groupHeaderReqd = 'N';
			var component=IMM.isChartView(viewConf)?this.getPanelCmp():this.getGridCmp();
			if(component !=null && component.store!=null && component.store.baseParams != null){
				productCode = component.store.baseParams.PRODUCT_NAME;
				subProductCode = component.store.baseParams.INPUT_SUB_PRODUCT;
				functionCode = component.store.baseParams.INPUT_FUNCTION_CODE;
			}
			else if (viewConf != null && viewConf.VIEW_MD != null) {
				productCode = viewConf.VIEW_MD.PRODUCT_CODE;
				subProductCode = viewConf.VIEW_MD.SUB_PRODUCT_CODE;
				functionCode = viewConf.VIEW_MD.FUNCTION_CODE;
				groupHeaderReqd = viewConf.VIEW_MD.FLD_GROUP_HEADER_REQD;
			} 
			else {
				productCode = "CUSER";
				subProductCode = "CUSER";
				functionCode = "VSBLTY";
			}
			var params;
			if(export_format != 'CSV'){
				if (IMM.isOrgView(this.getSelectedViewMd())
						|| IMM.isChartView(this.getSelectedViewMd())) {
					if((!(Ext.isEmpty(this.getPanelCmp().getExportContent))) &&
							IMM.isChartView(this.getSelectedViewMd()) && this.getPanelCmp().getExportContent()==='gridview'){
						params = this.export_grid(export_format, widBundleKey);						
					}
					else {
						var cid = this.getPanelCmp().getChartcmpId();
						var prtContent = document.getElementById(cid);
						var exportContent = prtContent.innerHTML;
						if (IMM.isChartView(this.getSelectedViewMd())) {
							exportContent = this.getPanelCmp().getExportContent();
						}
						if (IMM.isOrgView(this.getSelectedViewMd())) {											
							functionCode = "VSBLTY";
						}
						params ={};
						params['PAGE_CODE_TYPE']=IMM.isChartView(this.getSelectedViewMd()) ? "VECTOR_EXPORT": "CHART_EXPORT";
						params['PRODUCT_NAME']=productCode;
						params['INPUT_SUB_PRODUCT']=subProductCode;
						params['INPUT_FUNCTION_CODE']=functionCode;
						params['INPUT_ACTION']='EXPORT_ACTION';
						params['HTMLDATA']=exportContent;
						params['GROUP_HEADER_REQD']=groupHeaderReqd;
						params['EXPORT_FORMAT']=IMM.isChartView(this.getSelectedViewMd()) ? "VECTOR"+export_format
											: "CHARTPDF";
						params['WIDGET_ID']=this.removeIdSuffix();
						params['VIEW_ID']=this.selectedView;
						params['WID_BUNDLE_KEY'] = widBundleKey; 
					}
				}
			}
			if(Ext.isEmpty(params) && params == null){
				params = this.export_grid(export_format, widBundleKey); 
			}
			params[iportal.systempreferences.getCSRFKeyName()] = iportal.systempreferences.getCSRFUniqueId();
			var path = iportal.workspace.metadata.getContextRoot()+"/ExportServiceServlet";
			var method = "post";
			var form = document.createElement("form");
			form.setAttribute("method", method);
			form.setAttribute("action", path);
			form.setAttribute("target", "_blank");
			if(!Ext.isEmpty(params)){
				for(var i in params){
					var hiddenField = document.createElement("input");
					hiddenField.setAttribute("type", "hidden");
					hiddenField.setAttribute("name", i);
					hiddenField.setAttribute("value", params[i]);
					form.appendChild(hiddenField);
				}
			}
			document.body.appendChild(form);										
			try {
				form.submit();
				form.parentNode.removeChild(form);
			} catch (e) {

			}
		},
		/**
		 * for assigning the parameters for exporting for grid
		 */
		export_grid : function(export_format, widBundleKey){ 
			var productCode = null, subProductCode = null,functionCode = null;
			var viewConf = this.getSelectedViewMd();
			var groupHeaderReqd = 'N';
			var component=IMM.isChartView(viewConf)?this.getPanelCmp():this.getGridCmp();
			if(component !=null && component.store!=null && component.store.baseParams != null){
				productCode = component.store.baseParams.PRODUCT_NAME;
				subProductCode = component.store.baseParams.INPUT_SUB_PRODUCT;
				functionCode = component.store.baseParams.INPUT_FUNCTION_CODE;
			}
			else if (viewConf != null && viewConf.VIEW_MD != null) {
				productCode = viewConf.VIEW_MD.PRODUCT_CODE;
				subProductCode = viewConf.VIEW_MD.SUB_PRODUCT_CODE;
				functionCode = viewConf.VIEW_MD.FUNCTION_CODE;
				groupHeaderReqd = viewConf.VIEW_MD.FLD_GROUP_HEADER_REQD;
			} 
			else {
				productCode = "CUSER";
				subProductCode = "CUSER";
				functionCode = "VSBLTY";
			}
			var params = {};
			params['PAGE_CODE_TYPE']='VDF_CODE';
			params['PRODUCT_NAME']=productCode;
			params['INPUT_SUB_PRODUCT']=subProductCode;
			params['INPUT_FUNCTION_CODE']=functionCode;
			params['INPUT_ACTION']='EXPORT_ACTION';
			params['GROUP_HEADER_REQD']=groupHeaderReqd;
			params['EXPORT_FORMAT']=export_format;
			params['WIDGET_ID']=this.removeIdSuffix();
			params['VIEW_ID']=this.selectedView;
			params['CURRENCY_CD']=this.ccyViewMap[this.removeIdSuffix() + "_" + this.selectedView];
			params = this.appendFiltersParamsIfAny(params);
			params = this.appendSortByParamsIfAny(params);
			params = this.appendColumnPropertiesParamsIfAny(params);
			params['WID_BUNDLE_KEY'] = widBundleKey; 
			params['VIEW_DISPLAY_NM']=this.mvConf.mvh.getViewTitle();
			return params;
		},
		
		/**
		 * This method used to append the column properties to export url.
		 */
		appendColumnPropertiesParamsIfAny : function(params){	
			if(this.getGridState() != null && !Ext.isEmpty(this.getGridState())){
				var appliedColumnPropertiesJson = Ext.encode(this.getGridState()['_colProperties']);
				params['_colProperties'] = appliedColumnPropertiesJson;
			}
			return params;
		},
		
		/**
		 * Intended to append applied filters values to
		 * given url and return
		 */
		appendFiltersParamsIfAny : function (params){
			var appliedFilters = this.getAppliedFilters();
			if (Ext.isDefined(appliedFilters)) {
				Ext.applyIf(params,appliedFilters);
			}
			return params;
		},
		/**
		 * Intended to get sort by clause from store and
		 * append that params to parameter url.<b> and
		 * return the same
		 */
		appendSortByParamsIfAny : function (params){
			var component=IMM.isChartView(this.getSelectedViewMd())?this.getPanelCmp():this.getGridCmp();
			var sInfo = component.getStore().sortInfo;
			if (Ext.isObject(sInfo)) {
				params['sort']=sInfo.field;
				params['dir']=sInfo.direction;
			}
			return params;
		},
		/**
		 * This method used to append the column properties to export url.
		 */
		appendColumnPropertiesParamsIfAnyForFormExport : function(params){	
			if(this.getGridState() != null && !Ext.isEmpty(this.getGridState())){
				var appliedColumnPropertiesJson = this.getGridState()['_colProperties'];
				params['_colProperties'] = appliedColumnPropertiesJson;
			}
			return params;
		},
		/**
		 * Intended to append applied filters values to
		 * given url and return
		 */
		appendFiltersParamsIfAnyForFormExport : function (params){
			var appliedFilters = this.getAppliedFilters();
			if (Ext.isDefined(appliedFilters)) {
				Ext.applyIf(params,appliedFilters);
			}
			return params;
		},
		/**
		 * Intended to get sort by clause from store and
		 * append that params to parameter url.<b> and
		 * return the same
		 */
		appendSortByParamsIfAnyForFormExport : function (params){
			var component=IMM.isChartView(this.getSelectedViewMd())?this.getPanelCmp():this.getGridCmp();
			var sInfo = component.getStore().sortInfo;
			if (Ext.isObject(sInfo)) {
				params['sort']=sInfo.field;
				params['dir']=sInfo.direction;
			}
			return params;
		},
		getHtmlExportContentPathParamsForForms  : function (successHandler,handlerScope){
			var params;
			var params ={};
			var productCode = null, subProductCode = null;
			var groupHeaderReqd = 'N';
			var viewConf = this.getSelectedViewMd();
			var widBundleKey = this.mvConf.bundle; 
			if (viewConf != null && viewConf.VIEW_MD != null) {
				productCode = viewConf.VIEW_MD.PRODUCT_CODE;
				subProductCode = viewConf.VIEW_MD.SUB_PRODUCT_CODE;
				groupHeaderReqd = viewConf.VIEW_MD.FLD_GROUP_HEADER_REQD;
			} 
			else {
				productCode = "CUSER";
				subProductCode = "CUSER";
			}
			if (IMM.isOrgView(this.getSelectedViewMd())
						|| IMM.isChartView(this.getSelectedViewMd())) {
				if((!(Ext.isEmpty(this.getPanelCmp().getExportContent))) &&
						IMM.isChartView(this.getSelectedViewMd()) && this.getPanelCmp().getExportContent()==='gridview'){
					params['PAGE_CODE_TYPE']='VDF_CODE';
					params['PRODUCT_NAME']=productCode;
					params['INPUT_SUB_PRODUCT']=subProductCode;
					params['INPUT_FUNCTION_CODE']='VSBLTY';
					params['ONLY_CONTENT']='Y';
					params['INPUT_ACTION']='EXPORT_ACTION';
					params['GROUP_HEADER_REQD']=groupHeaderReqd;
					params['IS_STREAM_ENABLED']='N';
					params['EXPORT_FORMAT']='HTML';
					params['WIDGET_ID']=this.removeIdSuffix();
					params['VIEW_ID']=this.selectedView;
					params['CURRENCY_CD']=this.ccyViewMap[this.removeIdSuffix() + "_"
														+ this.selectedView];
				} 
				else {
					var cid = this.getPanelCmp().getChartcmpId();
					var prtContent = document.getElementById(cid);
					var exportContent = prtContent.innerHTML;
					if (IMM.isChartView(this.getSelectedViewMd())) {
						exportContent = this.getPanelCmp().getExportContent();
					}
					params['PAGE_CODE_TYPE']=IMM.isChartView(this.getSelectedViewMd())? "VECTOR_EXPORT" : "CHART_EXPORT";
					params['PRODUCT_NAME']=productCode;
					params['INPUT_SUB_PRODUCT']=subProductCode;
					params['INPUT_FUNCTION_CODE']="VSBLTY";
					params['INPUT_ACTION']="EXPORT_ACTION";
					params['IS_STREAM_ENABLED']='N';
					params['EXPORT_FORMAT']=IMM.isChartView(this.getSelectedViewMd()) ? "VECTORHTML": "CHARTHTML";
					params['HTMLDATA']=exportContent;
					params['ONLY_CONTENT']='Y';
					params['WIDGET_ID']=this.removeIdSuffix();
					params['VIEW_ID']=this.selectedView;
					params['GROUP_HEADER_REQD']=groupHeaderReqd;
				}
			} 
			else {
				params['PAGE_CODE_TYPE']='VDF_CODE';
				params['PRODUCT_NAME']=productCode;
				params['INPUT_SUB_PRODUCT']=subProductCode;
				params['INPUT_FUNCTION_CODE']='VSBLTY';
				params['INPUT_ACTION']='EXPORT_ACTION';
				params['GROUP_HEADER_REQD']=groupHeaderReqd;
				params['IS_STREAM_ENABLED']='N';
				params['EXPORT_FORMAT']='HTML';
				params['ONLY_CONTENT']='Y';
				params['WIDGET_ID']=this.removeIdSuffix();
				params['VIEW_ID']=this.selectedView;
				params['CURRENCY_CD']=this.ccyViewMap[this.removeIdSuffix() + "_"
													+ this.selectedView];
				params = this.appendFiltersParamsIfAnyForFormExport(params);
				params = this.appendSortByParamsIfAnyForFormExport(params);
				params = this.appendColumnPropertiesParamsIfAnyForFormExport(params);
			}
			params['WID_BUNDLE_KEY'] = widBundleKey; 
			successHandler.call(handlerScope, [params]);
		},
		getIframePanel : function (){
			var vid = this.getSelectedViewId();
			return this.getComponent(0).getComponent(0).getComponent(0);
		},
		getSelectedPanel : function (){
			var vid = this.getSelectedViewId();
			return this.getComponent(0);
		},
		/**
		 * Utility Api intended to set Select View value to
		 * view selector combo.
		 */
		setDefaultValueToViewer : function (){
			// this.get(1).setValue(this.getSelectViewId());
		},
		getSelectedViewId : function (){
			return this.selectedView;
		},
		/**
		 * Intended to return "Select View" value.
		 */
		getSelectViewId : function (){
			return ' ';
		},
		/**
		 * Intended to find System view id from view meta
		 * data. Returns if System View id presents, else
		 * returns view id from metadata.
		 */
		findSystemViewId : function (vdif){
			var svid = vdif.VIEW_MD.SYSTEM_VIEW_ID;
			if (Ext.isEmpty(svid)) {
				svid = vdif.VIEW_MD.VIEW_ID;
			}
			return svid;
		},
		/**
		 * Intended to generate filter form state id. Note:
		 * This logic of creating id is also available in
		 * iportal.listview.filterform.js, Keep this in mind
		 * before modify logic of creating id.<b>
		 */
		genFilterStateId : function (vid){
			return this.removeIdSuffix() + "_" + vid + "_FILTER_FORM";
		},
		/**
		 * Intended to clear filter values saved in state
		 * for previous view id
		 */
		clearFilterValuesFromState : function (vid){
			this.setAppliedFilters(null);
			Ext.state.Manager.set(this.genFilterStateId(vid), null);
		},

		isLastSateValid : function (_laststate){
			return Ext.isObject(_laststate) && Ext.isDefined(_laststate._mvhOpt)
						&& Ext.isDefined(_laststate._mvhOpt.sel_vw);
		},
		/**
		 * Intended to delete from this view from cookie
		 */
		removeViewIdFromState : function (){
			Ext.state.Manager.getProvider().clear(this.getStateId());
		},
		/**
		 * This API will be called when 'statechange' events
		 * fires. Intended to create state object with
		 * selected view id and return .
		 */
		getState : function (){
			var that = this, _state, selectedView;
			_state = iportal.view.MultiViewHeader.superclass.getState.apply(this, arguments);
			selectedView = this.selectedView;
			if (_state) {
				_state._mvhOpt = {
					'sel_vw' : selectedView
				};
			} else {
				_state = {
					'_mvhOpt' : {
						'sel_vw' : selectedView
					}
				};
			}
			return _state;
		},
		saveState : function (){
			if (Ext.state.Manager && this.stateful !== false) {
				var id = this.getStateId();
				if (id) {
					var state = this.getState();
					if (this.fireEvent('beforestatesave', this, state) !== false) {
						Ext.state.Manager.set(id, state);
						this.fireEvent('statesave', this, state);
					}
				}
			}
		},
		/**
		 * Intended to create all possible tools in header.
		 * P.S: All tools will be in hide mode. And their
		 * visibility will be dependent on the VDF
		 */
		createTools : function (){
			var tools = [], tool = null;
			for (tool in this.toolsMap) {
				tools.push(this.toolsMap[tool]);
			}
			return tools;
		},
		/**
		 * Intended to create items for Multiview Header.
		 * Returned Items are :1. Title,2. View Selector
		 * Combo, 3.Filler 4. All possible tools
		 */
		createItems : function (){
			return [ this.createViewItems() ];
		},
		/**
		 * Handler of Help tool button handler. Intended to
		 * open help file for this widget.
		 */
		handlehelp : function (){
			if (IMM.isSearchMode(this.removeIdSuffix())) {
				iportal.jsutil.helpHandler(this.getSelectedViewId() + '_Help.htm');
			} else {
				iportal.jsutil.helpHandler(this.removeIdSuffix() + '_Help.htm');
			}
		},
		/**
		 * Handler of Preferences tool button handler.
		 * Intended to launch preferences screen.
		 */
		preference : function (){
			this.pref = new iportal.view.WidgetPreferences({
				currWidget : this.removeIdSuffix(),
				vMetaData : this.getSelectedViewMd()
			});
		},
		/**
		 * Intended to close MultiViewWindow
		 */
		closeWin : function (){
			this.mvConf.parentWin.close();
		},
		/**
		 * Intended to get panel object and return
		 */
		getPanelCmp : function (){
			return this.getSelectedPanel().renderer;
		},
		/**
		 * Intended to get window object and return
		 */
		getWinCmp : function (){
			return this.mvConf.parentWin;
		},
		/**
		 * @param params
		 * @returns getPanelCmp().getFormManager()
		 * @returns null
		 */
		getFormPanel : function()
		{
			var that=this;
			if( that.getPanelCmp().isFormAvailable )
				return that.getPanelCmp().getFormManager();
			else
				return null;
		},
		/**
		 * Intended to get grid object and return
		 */
		getGridCmp : function (){
			if (this.getSelectedPanel() != null && this.getSelectedPanel().renderer != null)
				return (this.getSelectedPanel().renderer.getComponent(iportal.jsutil
							.getListViewGridId(this.removeIdSuffix())));
		},
		/**
		* Intended to get Tree object and return
		*/
		getTreeCmp : function(){
			if(this.getSelectedPanel()!=null && this.getSelectedPanel().renderer!=null) {    	
				return(this.getSelectedPanel().renderer.getComponent(0).getRootNode());
			}
		},
		getIframeCmp : function (){
			if (this.getSelectedPanel() != null && this.getSelectedPanel().renderer != null) {
				return (this.getIframePanel());
			}
		},
		/**
		 * The method will be called by the multiview
		 * of the widget, when its widget Expand event is
		 * called. This method is intended to take the
		 * responsibility of loading the widget's data only
		 * if required.
		 */
		widgetExpand : function (){
			var mdata;
			mdata = this.getSelectedViewMd();
			if (mdata.VIEW_MD && (IMM.isListView(mdata) || IMM.isPropertyListView(mdata) || IMM.isGroupView(mdata))) {
				var comp = this.getGridCmp();
				if (comp != null && !comp.isDataAvailable())
					comp.reloadData();
			} 
			else {
				var comp = this.getPanelCmp();
				if (comp != null && comp.isDataAvailable && !comp.isDataAvailable())
					comp.reloadData();
			}
		},
		/**
		 * Handler of Refresh tool button, intended to
		 * reload/Refresh the grid. P.S: If View type is
		 * GROUP then It will ask Group View to refresh
		 * View, else ListViewPanel to refresh view
		 */
		refresh : function (){
			var mdata;
			mdata = this.getSelectedViewMd();
			if (IMM.isGroupView(mdata) && this.getGridCmp()) {
				this.getGridCmp().reloadData();
			} else if (IMM.isChartView(mdata) && this.getPanelCmp()) {
				this.getPanelCmp().reloadData();
			}
			else if (IMM.isTreeView(mdata) && this.getTreeCmp()) { 
				this.getTreeCmp().reload();
			}
			else if (IMM.isIFrameView(mdata) && this.getIframeCmp()) { 
				this.getIframeCmp().setSrc();
			}
			else if (this.getGridCmp()) { 
				this.getGridCmp().reloadData();
			}
			else if(IMM.isCalendarView(this.getSelectedViewMd()))
				{
				this.getPanelCmp().reloadData();
				}
			else if(IMM.isOrgView(this.getSelectedViewMd()))
			{
			this.getPanelCmp().reloadOrgData();
			}
			 
		},
		/***************************************************
		 * Handler for the click on
		 * Show As ToolBar & SwitchMore,for the show/hide of the
		 * tbar.
		 **************************************************/
		switchMore : function (){
			var selPanel = this.getSelectedPanel();
			var renderedComp = selPanel.getComponent(0);
			if (renderedComp != null) {
				renderedComp.setHeight(renderedComp.getHeight() + 27); 
			}
			var tb = this.getPanelCmp();
			this.tbar.hide();
			var tabEle = Ext.fly(this.tbar);
			tabEle.applyStyles({
				'display' : 'none'
			});
			if(this.mvConf.isLoadingToolsInside) // only for muli wiget explorer it is TRUE
			{
				var children=this.getSelectedPanel().header.dom.children,i; //get hearder children as HTML Dom elements
				for(i=0;i<children.length;i++) {
					if(children[i].className=="x-tool x-tool-pin")  //check for tool bar menu dropdown in the children and show it
					{
						Ext.get(children[i].id).setVisible(true);
						break;
					}
				}
			}
			else if (this.findParentByType('portlet') && this.findParentByType('portlet').tools.pin) { 
				this.findParentByType('portlet').tools.pin.setVisible(true); 
			} 
			else if (this.findParentByType('iportal-window') && this.findParentByType('iportal-window').tools.pin) { 
				this.findParentByType('iportal-window').tools.pin.setVisible(true);
			}
			else if (this.findParentByType('window') && this.findParentByType('window').tools.pin) { 
				this.findParentByType('window').tools.pin.setVisible(true);
			}
		},
		getToolbar : function (){
			var selPanel = this.getSelectedPanel();
			var renderedComp = selPanel.getComponent(0);
			if (renderedComp != null) {
				renderedComp.setHeight(renderedComp.getHeight() - 27);
			}								
			var tb = this.getPanelCmp();							
			tb.mvh.tbar.show();
		},
		highlightChart:function(highlightConfig){
			var mdata = this.getSelectedViewMd();
			if (IMM.isChartView(mdata)) {
				this.getPanelCmp().loadHighlightedChart(highlightConfig);
			} 								
		},
		/**
		 * Intended to show error window
		 */
		showNoDataErrWin : function (action){
			var win = new iportal.Dialog({
				dialogType : 'ERROR',
				cls : 'portal_neg_btn',
				message : String.format(this.rb.ERR_NO_DATA_AVAILABLE, this.cmRb[action]),
				title : this.rb.LBL_MESSAGE_TITLE,
				okHandler : function (){
					win.close();
				}
			});
			win.show();
		},
		/**
		 * Intended to show message window alert when user
		 * is on simulation mode
		 */
		showSimulationAlertWin : function (){
			var win = new iportal.Dialog({
				dialogType : 'ERROR',
				cls : 'portal_neg_btn',
				message : this.cmRb.LBL_SIMULATION_MODE_FEATURE_NO_SUPPORT,
				title : this.cmRb.LBL_MESSAGE,
				okHandler : function (){
					win.close();
				}
			});
			win.show();
		},
		/**
		 * Intended to validate feature availability and
		 * check data/chart is available in widget, Return
		 * true if user is not on simulation mode and
		 * data/chart available, else false. No data/chart
		 * is not available it will also call error window
		 * to notify user.
		 */
		validateExportRequest : function (action){
			if (iportal.systempreferences.isSimulationModeOperation() === true) {
				this.showSimulationAlertWin();
				return false;
			}
			var mdata, returnFlg = false;
			mdata = this.getSelectedViewMd();
			if (IMM.isOrgView(mdata)) {
				returnFlg = this.getPanelCmp().isOrgAvailable();
			} 
			else if (IMM.isChartView(mdata)) {
				returnFlg = this.getPanelCmp().isChartAvailable();
			}
			else if (IMM.isFormView(mdata)) {
				returnFlg = this.getPanelCmp().isFormAvailable();
			} 
			else if(IMM.isMapView(mdata) || IMM.isIFrameView(mdata)){
				returnFlg = false;
			}
			else {
				returnFlg = this.getGridCmp().isDataAvailable();
			}
			if (!returnFlg && !(action=='VALIDATE')) {
				this.showNoDataErrWin(action);
			}
			return returnFlg;
		},
		/**
		 * This method used to get the state object of the Grid component.
		 */
		getGridState : function() {
			var mdata = this.getSelectedViewMd();
			var grid = null;
			if (IMM.isGroupView(mdata)) {
				grid = this.getGridCmp();
			} 
			else if (IMM.isChartView(mdata)) {
				this.getPanelCmp();
			} 
			else {
				grid = this.getGridCmp();
			}
			if (grid != null) {
				var gridState = grid.getState();									
				return gridState;
			}
			return null;
		},
		/**
		 * Intended to set applied filters
		 */
		setAppliedFilters : function (filterVals){
			// Ext.state.Manager.set(this.genFilterStateId(this.getSelectedViewId()),filterVals);
			// this.appliedFilters = filterVals;
		},
		/**
		 * Added code to fetch the filter inforamtoion from the grid filter
		 * rather than cookies
		 */
		getAppliedFilters : function (){
			var mdata = this.getSelectedViewMd();
			var grid = null;
			if (IMM.isGroupView(mdata)) {
				grid = this.getGridCmp();
			} 
			else if (IMM.isChartView(mdata)) {
				this.getPanelCmp();
			} 
			else {
				grid = this.getGridCmp();
			}
			if (grid != null) {
				if (grid.getStore) {
					return grid.getStore().baseParams;
				}
			}
			return null;
		}, 
		/**
		 * This method used to append the column properties to export url.
		 */
		appendColumnPropertiesIfAny : function(purl){	
			if(this.getGridState() != null && !Ext.isEmpty(this.getGridState())){
				var appliedColumnPropertiesJson = Ext.encode(this.getGridState()['_colProperties']);								
				purl = purl + "&" + "_colProperties=" + appliedColumnPropertiesJson;
			}
			return purl;
		},
		/**
		 * Intended to append applied filters values to
		 * given url and return
		 */
		appendFiltersIfAny : function (purl){
			var appliedFilters = this.getAppliedFilters();
			if (Ext.isDefined(appliedFilters)) {
				var filterURL ="";
				for (key in appliedFilters) {
					filterURL = filterURL + "&" + key + "=" + appliedFilters[key];
				}
				purl = purl+filterURL;
			}
			return purl;
		},
		/**
		 * Intended to get sort by clause from store and
		 * append that params to parameter url.<b> and
		 * return the same
		 */
		appendSortByIfAny : function (purl){
			var sInfo = this.getGridCmp().getStore().sortInfo;
			if (Ext.isObject(sInfo)) {
				purl = purl + "&sort=" + sInfo.field;
				purl = purl + "&dir=" + sInfo.direction;
			}
			return purl;
		},
		getFilterWinTitle : function (){
			return this.viewsTitles[this.getSelectedViewId()] + ' '
						+ this.rb.LBL_FILTER_WIN_TITLE_SUFIX;
		},
		/**
		 * Filter tool button handler
		 */
		filter : function (cmp){
			if (IMM.isChartView(this.getSelectedViewMd())) {
				this.graphFilter = new iportal.view.GraphicalViewFilter({
					currWidget : this.removeIdSuffix(),
					viewId : this.getSelectedViewId(),
					mvh : this
				});
			} 
			else if (IMM.isTreeView(this.getSelectedViewMd())
						|| IMM.isOrgView(this.getSelectedViewMd())) {
				createCashConSearchWindow(this.getPanelCmp());
			} 
			else {
				this.filterWin = new iportal.listview.FilterFormWin({
					viewId : this.getSelectedViewId(),
					rawTitle : this.getFilterWinTitle(),
					rb : this.rb,
					mvh : this,
					widgetId : this.removeIdSuffix()
				});
				this.filterWin.show();
			}
		},
		/**
		 * Pull out tool button handler
		 */
		pullout : function (){
			if (Ext.isDefined(this.mvConf.pullOutWidget)) {
				var pwid = new this.mvConf.pullOutWidget();
				var _state = {
					'_mvhOpt' : {
						'sel_vw' : this.getSelectedViewId()
					}
				};
				Ext.state.Manager.set(pwid.widgetId + "_MVH", _state);
			}
		},
		getPrintMap : function (){
			var data = {};
			data["VIEW_ID"] = this.selectedView;
			data["WIDGET_ID"] = this.removeIdSuffix();
			if (IMM.isChartView(this.getSelectedViewMd())) {
				data["USE_RENDER_MAP"] = 'Y';
			}
			return data;
		},
		orgPrint : function (){
			var cid = this.getPanelCmp().getChartcmpId();
			var prtContent = document.getElementById(cid);
			var WinPrint = window.open('', '',
						'left=0,top=0,width=500,height=500,toolbar=0,scrollbars=0,status=0');
			var finContent = '<html><link rel="stylesheet" media="print" type="text/css" href="iportal/css/ext-all.css" /><link rel="stylesheet" type="text/css" href="iportal/css/ext-all.css" /><link rel="stylesheet"  type="text/css" media="print" href="iportal/css/printchart.css" /><link rel="stylesheet"  type="text/css" media="screen" href="iportal/css/iportal-chartcomponent.css" /><body>'
						+ prtContent.innerHTML + '</body></html>';
			WinPrint.document.write(finContent);
			WinPrint.document.close();
			WinPrint.focus();
			WinPrint.print();
			WinPrint.close();
		},
		/**
		 * Print tool button handler.
		 */
		print : function (){
			if (this.validateExportRequest('TOOL_TIPS_PRINT')) {   
				if (!this.mvConf.printPage && !IMM.isChartView(this.getSelectedViewMd())
							&& !IMM.isOrgView(this.getSelectedViewMd())) {
					var suggestWin = new iportal.Dialog({
						dialogType : 'WARNING',
						title : this.rb['LBL_WARN'],
						cls : 'portal_pos_btn',
						message : this.cmRb["PRINT_SUGGEST_WARN_MSG"],
						okHandler : function (){
							suggestWin.close();
							this.processPrint();
						}.createDelegate(this),
						cancelHandler : function (){
							suggestWin.close();
						}
					});
					suggestWin.show();
				} 
				else if (IMM.isOrgView(this.getSelectedViewMd())) {
					this.orgPrint();
				} 
				else {
					this.processPrint();
				}
			}
		},
		processPrint : function (){
			var mdata = this.getSelectedViewMd();
			if (IMM.isChartView(mdata)) {
				FusionCharts.printManager.enabled(true);
				var winObj = window.open('', "Print", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,border=thin,top=60,left=100,width=740,height=360");  
				    winObj.document.write('<html><head><div><div class="printLogo"><br/> <br/></div></head><body>');
				    winObj.document.write('<div> <h1 align = "center"><b><font color="gray" size="5">'+this.viewsTitles[this.vmd.VIEW_MD.VIEW_ID]+'</font><b></h1> </div>');
				    var div = winObj.document.createElement("chartDiv");
				    div.align = "center";
				    div.style.margin = "0";
				    div.style.position = "fixed";
				    div.innerHTML = this.getPanelCmp().getGridData();
				    winObj.document.body.appendChild(div);
				    winObj.document.write('</body></html>');
				    winObj.document.close();
				    winObj.focus();
				    winObj.print();
				    winObj.close();
			}
			else if (IMM.isFormView(mdata)) {
					this.getPanelCmp().fm.exportForForms('HTML');
			}
			else {
				var groupView = this.getPanelCmp();
				//var ds = groupView.getPrintData();
				var viewPrntData = groupView.getPrintData(); 
				var ds={};
				Ext.apply(ds,viewPrntData);
				var columnState=this.getGridState();
				var colProperties=columnState._colProperties;
				var hiddenColArray=new Array();
				for(var indx=0;indx<colProperties.length;indx++)	{
					if(colProperties[indx]._hidden=="Y") {
						hiddenColArray.push(colProperties[indx]._id);
					}
				}
				if (!ds.collapseData) {
					var sInfo = this.getGridCmp().getStore().sortInfo;
					if (Ext.isObject(sInfo)) {
						ds["sort"] = sInfo.field;
						ds["dir"] = sInfo.direction;
					}
					var colList = this.getSelectedViewMd().VIEW_MD.FLD_COLUMN_LIST;
					var printDataForGrid = {};
					var columnHeadersGrid = [];
					var columnHeaderIDGrid = [];
					var columnDataTypeGrid = [];
					var linkedCurrCol =[]; 
					var widBundle=this.mvConf.bundle;
					var cuserBundle = CRB.getBundle(widBundle);
					Ext.each(colList, function (column){
						if('Y' == column.FLD_GROUPED_IND){
							columnHeadersGrid.push(cuserBundle["LBL_" + column.FLD_COLUMN_DISPLAY_NAME_KEY]);
							columnHeaderIDGrid.push(column.FLD_COLUMN_ID);
							columnDataTypeGrid.push(column.FLD_DATA_TYPE);
						}
					});
					Ext.each(colList, function (column){
						if (column.FLD_HIDDEN_IND != 'Y' &&  column.FLD_COLUMN_ID != "CONTEXT" && hiddenColArray.indexOf(column.FLD_COLUMN_ID)==-1 && (
									column.FLD_CHANNEL_ID == 'A' || column.FLD_CHANNEL_ID == 'D')) { 
							if(!columnHeaderIDGrid.contains(column.FLD_COLUMN_ID)){
								columnHeadersGrid.push(cuserBundle["LBL_"
											+ column.FLD_COLUMN_DISPLAY_NAME_KEY]);
								columnHeaderIDGrid.push(column.FLD_COLUMN_ID);
								columnDataTypeGrid.push(column.FLD_DATA_TYPE);
								if (!Ext.isEmpty(column.LINKED_SOURCE_CCY)) {
									var currColMap = {};
									currColMap[column.FLD_COLUMN_ID] = column.LINKED_SOURCE_CCY;
									linkedCurrCol.push(currColMap);
								}
							}	
						}
					});
					printDataForGrid.gridTitle = cuserBundle[this.getSelectedViewMd().VIEW_MD.VIEW_DISPLAY_NM];
					printDataForGrid.linkedCurrColums=linkedCurrCol; 
					printDataForGrid.columnHeadersGrid = columnHeadersGrid;
					printDataForGrid.columnHeaderIDGrid = columnHeaderIDGrid;
					printDataForGrid.columnDataTypeGrid = columnDataTypeGrid;
					printDataForGrid.storeParamGrid = ds;
					printDataForGrid.viewBundleKey = this.getSelectedViewMd().VIEW_MD.FLD_BUNDLE_KEY;
					printDataForGrid.getMode = function (){
						return 'grid';
					};
					IGPM[this.removeIdSuffix()] = printDataForGrid;
				} 
				else {
					IGPM[this.removeIdSuffix()] = ds;
				}
				iportal.openNewWindow(iportal.workspace.metadata.getContextRoot()+'/CTRIAFramework/jsp/PrintTemplate.jsp'
													+ '?elementIdForConfirmationMsg='
													+ this.removeIdSuffix() + '',
										'print',
										'toolbar=no,location=no,directories=no,status=no,menubar=no,'+
										'scrollbars=yes,resizable=no,border=thin,top=20,left=110,width=750,height=650');
			}
		},
		printImage : function (){
			var productCode = null, subProductCode = null;
			var viewConf = this.getSelectedViewMd();
			if (viewConf != null && viewConf.VIEW_MD != null) {
				productCode = viewConf.VIEW_MD.PRODUCT_CODE;
				subProductCode = viewConf.VIEW_MD.SUB_PRODUCT_CODE;
			} 
			else {
				productCode = "CUSER";
				subProductCode = "CUSER";
			}
			var currCode = this.mvConf.scope.CCY_VIEWS[this.selectedView];
			var url = "/CTModelHouse/ExportServiceServlet?PAGE_CODE_TYPE=GRAPHICAL_VIEW&PRODUCT_NAME="
						+ productCode
						+ "&INPUT_SUB_PRODUCT="
						+ subProductCode
						+ "&INPUT_FUNCTION_CODE=VSBLTY&INPUT_ACTION=EXPORT_ACTION";
			url = url + "&ISEXPORT_ONLY=true&EXPORT_FORMAT=IMAGE&WIDGET_ID="
						+ this.removeIdSuffix() + "&VIEW_ID=" + this.selectedView + "&CURRENCY_CD="
						+ currCode + "&TYPE=PRINT";
			url = this.appendFiltersIfAny(url);
			url = this.appendColumnPropertiesIfAny(url);
			iportal.openNewWindow(url, 'PRINT_IMAGE');
		},
		/**
		 * Intended to set view id to view selector combo
		 * and fire select event.
		 */
		setViewToViewSelector : function (viewid){
			if(!Ext.isEmpty(this.getComponent(viewid))){
				this.viewSelectionHandler(this.getComponent(viewid));
			}else{
				this.switchPreference(viewid);
			}
		},
		getLastState : function (){
			return Ext.state.Manager.get(this.getStateId(), 'NOT_FOUND');
		},
		/**
		 * In case the default view to be launched is not
		 * the system view, this method can be used to treat
		 * another child view as the default view for one
		 * launch. This functionality will work only after
		 * the widget has be loaded once on the screen.
		 * 
		 * @viewId the child view's id that needs to be set
		 *         as default
		 * @see iportal.widget.MultiWidgetSwitch
		 */
		setDefaultView : function (viewId){
			this.defaultLaunchViewId = viewId;
		},
		/**
		 * The following will be done while rendering
		 * component. Gets the last state of component,
		 * check any state was maintained, if maintained,
		 * fire select event of view selector combo with
		 * previous system view id. else fire select event
		 * of view selector combo with default view of given
		 * widget.
		 */
		afterRender : function (ct, position){
			var viewid, _laststate;
			_laststate = this.getLastState();
			viewid = IMM.getDefaultView(this.removeIdSuffix());
			/**
			 * overriding the default view in
			 * case its explicitly set by instance creator
			 * of the MultiView and so its MultiViewHeader
			 * 
			 * @see iportal.widget.MultiWidgetSwitch
			 */
			if (this.defaultLaunchViewId != null) {
				viewid = this.defaultLaunchViewId;
				this.defaultLaunchViewId = null;
			}
			if(this.isLastSateValid(_laststate)){
				 viewid = _laststate._mvhOpt.sel_vw; 
			}
			this.setViewToViewSelector(viewid);
			/**
			 *  Code for hiding the TBAR while rendering,
			 *  Layout fix also					  
			**/
			this.tbar.hide();
			var toolBar = Ext.fly(this.tbar);
			toolBar.applyStyles({
				'display' : 'none'
			});
			this.tools=this.getSelectedPanel().tools;
			iportal.view.MultiViewHeader.superclass.afterRender.apply(this, arguments);
			if(!Ext.isEmpty(this.bbar)){
				var bottomBar = Ext.fly(this.bbar);
							bottomBar.applyStyles({
					'width' : 'auto'
				});
							bottomBar.first().applyStyles({
				'width' : 'auto'
				}); 
			}
		},
		
		savePreference : function (){
			var grid = this.getGridCmp();
			var gridState;
			if (grid) {
				gridState = grid.getState();
				if (gridState) {
					var config = {
						mvh : this,
						prefAction : 'PREF_SAVE_ACTION'
					};
					new iportal.view.widgetPreference(config);
				}
			}
		},
		/**
		 * This method is used to update the current
		 * customized view. It is called when user clicks
		 * update option in Preference menu.
		 * 
		 * @param selected
		 *            View Id, View Name
		 */
		updatePreference : function (selViewId, viewDisplayName){
			var that = this;
			var vmd = this.getSelectedViewMd();
			var systemViewId = this.findSystemViewId(vmd);
			if (systemViewId == selViewId) {
				var errorMessageWindow = new iportal.Dialog({
					dialogType : 'ERROR',
					cls : 'portal_neg_btn',
					message : that.rb.WIDGET_PREFERENCE_SAVE_ERROR_MSG,
					title : that.rb.LBL_UPDATE_PREFS,
					okHandler : function (){
						errorMessageWindow.close();
					}
				});
				errorMessageWindow.show();
			} else {
				var config = {
					mvh : that,
					prefAction : 'PREF_UPDATE_ACTION',
					viewId : selViewId
				};
				new iportal.view.widgetPreference(config);
			}
		},

		/**
		 * This method is used to load the
		 * selected view in the panel. It is called when
		 * user selects a view in Switch option in
		 * Preference menu.
		 * 
		 * @param selected
		 *            View Id
		 */
		switchPreference : function (selViewId){
			var vmd = this.getSelectedViewMd();
			var grid = this.getGridCmp();
			if (grid) {
				Ext.state.Manager.clear(grid.getStateId());
			}
			this.isViewSwitching=true;
			this.getComponent(0).itemId = selViewId;
			this.viewSelectionHandler(this.getComponent(0));
		    this.switchMore(); 
		},

		/**
		 * This method is used to clear the grid's current state.
		 */
		clearGridState : function (){
			var grid = this.getGridCmp();
			if (grid) {
				Ext.state.Manager.clear(grid.getStateId());
			}
		},
		/**
		 * This method is used to revert the current changes
		 * in the view. It is called when user clicks a
		 * revert option in Preference menu.
		 */
		revertPreferenceChanges : function (){
			var grid = this.getGridCmp();
			Ext.state.Manager.clear(grid.getStateId());
			this.vmd.VIEW_MD.FLD_INIT_COLLAPSED = 'N';
			this.renderView();
		},

		/**
		 * This method is used to delete a customized view.
		 * It is called when user selects a view in Remove
		 * option in Preference menu.
		 * 
		 * @param selected
		 *            View Id
		 */
		removePreference : function (selViewId){
			var that = this;
			var config = {
				mvh : that,
				prefAction : 'PREF_DELETE_ACTION',
				viewId : selViewId
			};
			new iportal.view.widgetPreference(config);
		}, 
		
		showHighlightInd :  function(){
			var vmd = this.getSelectedViewMd();
			var highlightInd = false;
			if (vmd && vmd.VIEW_MD && vmd.VIEW_MD.FLD_HIGHLIGHT_IND === 'Y') {									
				highlightInd = true;
			}
		},
		getCurrencyInd: function(){
			var vmd = this.getSelectedViewMd();
			var currencyInd = false;
			if (vmd && vmd.VIEW_MD && vmd.VIEW_MD.FLD_EQCCY_EXIST_IND === 'Y') {
				currencyInd = true;
				return currencyInd;
			}
			else
				{
				return currencyInd;
				}
			
		},
		getToolsMap: function (){
			
			return this.mvConf.ownerCt.getToolsMap();
		},
		/**
		 * call the appropriate handler for
		 * showing/ hiding the currency selector.
		 */
		showCurrencyInd : function (){
			var vmd = this.getSelectedViewMd();
			var currencyInd = false;
			if (vmd && vmd.VIEW_MD && vmd.VIEW_MD.FLD_EQCCY_EXIST_IND === 'Y') {
				currencyInd = true;
			}
			/** Now setting the indicator value */
			if (this.mvConf && this.mvConf.ownerCt && this.mvConf.ownerCt.showCurrencyInd) {

				this.mvConf.ownerCt.showCurrencyInd(currencyInd);

			}
			/** setting value for singular widget*/
			else if (this.getComponent(0).ccySelector) {
				if (vmd.VIEW_MD && vmd.VIEW_MD && vmd.VIEW_MD.FLD_VIEW_TYPE) {
					if (vmd.VIEW_MD.FLD_VIEW_TYPE === 'LIST') {
						if (this.getComponent(0).ccySelector && this.getComponent(0).header) {
							/**
							 * to generate extra space after portlets header title
							 */
							this.getComponent(0).ccySelector.render(this.getComponent(0).header);
							this.getComponent(0).ccySelector.setVisible(currencyInd);
						}
						/**
						 * explicitly calling the
						 * setCurrency as the normal
						 * life-cycle method would have
						 * executed before the component is
						 * rendered
						 */
						this.setCurrency();
					}
				}
			}
		},
		/**
		 * Getting the currency value for the
		 * respective view
		 * 
		 * @returns
		 */
		getCurrencyValueForView : function (){
			var vmd = this.getSelectedViewMd();
			var currency = null;
			var currencyInd = false;
			if (vmd && vmd.VIEW_MD && vmd.VIEW_MD.FLD_EQCCY_EXIST_IND === 'Y') {
				currencyInd = true;
			}
			if (currencyInd) {
				if (vmd && vmd.VIEW_MD && vmd.VIEW_MD.ADDN_PREFS[0]
							&& vmd.VIEW_MD.ADDN_PREFS[0].PREF_REF_CCY != null) {
					currency = vmd.VIEW_MD.ADDN_PREFS[0].PREF_REF_CCY;

				}
				/**
				 * in case the currency is not available in
				 * view's metadata
				 */
				if (currency == null) {
					currency = "";
				}
			}
			return currency;
		},
		/**
		 * call the appropriate handler for
		 * setting the currency value.
		 */
		setCurrency : function (){
			var prefRateCard = iportal.preferences.getRateCard();

			if (prefRateCard == null || prefRateCard === "" || prefRateCard === " "
						|| prefRateCard.toUpperCase() === "NULL") {

				if (this.mvConf && this.mvConf.ownerCt && this.mvConf.ownerCt.setCurrency) {
					this.mvConf.ownerCt.setCurrency(null);
				}
				/**
				 * Validate the combo if the prefRateCard is
				 * not avilable
				 * 
				 */
				else if (this.getComponent(0).ccySelector) {
					var commonbundle = CRB.getFWBundle();
					//this.getComponent(0).ccySelector.markInvalid(commonbundle['CURRENCY_SELECT']);
				}
				return;
			}

			var vmd = this.getSelectedViewMd();
			var currency = this.getCurrencyValueForView();
			if (currency != null) {
				if (this.mvConf && this.mvConf.ownerCt && this.mvConf.ownerCt.setCurrency) {
					this.mvConf.ownerCt.setCurrency(currency);
				}
				else if (this.getComponent(0).ccySelector) {
					if (iportal.jsutil.isValidValueInStore(this.getComponent(0).ccySelector
								.getStore(), currency) === true) {
						this.getComponent(0).ccySelector.setValue(currency);
					} 
					else {
						this.getComponent(0).ccySelector.setValue('');
						var commonbundle = CRB.getFWBundle();
						//this.getComponent(0).ccySelector.markInvalid(commonbundle['CURRENCY_INVALID']);
					}
				}
			}
		},
		/**
		 * This method will update the owner component title
		 * according to the selected view.
		 * 
		 * @param none
		 * @returns none
		 */
		updateOwnerTitle : function (){
			var vmd = this.getSelectedViewMd();
			var rb = CRB.getBundle(vmd.VIEW_MD.FLD_BUNDLE_KEY);
			var selViewId = vmd.VIEW_MD.VIEW_ID;
			var sysvid = this.findSystemViewId(vmd);
			var title = rb[vmd.VIEW_MD.VIEW_DISPLAY_NM] || vmd.VIEW_MD.VIEW_DISPLAY_NM; 
			
			
			 
			if (title == null) {
				title = this.getSystemViewTitle();
			}
			if (title != null){
				if(this.mvConf.ownerCt && this.mvConf.ownerCt.setTitle){ 
					this.mvConf.ownerCt.setTitle(title);
				}			
				/**
				 * when the indexed multi widget has the
				 * child indexes are multi-widget, the
				 * ownerCt isn't getting called, so the
				 * ownerCt is updated as a mvh.
				 */
				
				if(!cbx.isEmpty(this.mvConf.mvh.getSelectedPanel)){
					this.mvConf.mvh.getSelectedPanel().setTitle(title);
				}
				
				this.mvConf.mvh.setTitle(title);
			}
		},

		/**
		 * This method returns true if the given view is
		 * customized, otherwise false
		 * 
		 * @param View
		 *            Meta Data
		 * @returns boolean - customized view
		 */
		isCustomizedView : function (vmd){
			var isCustomized = false;
			if (vmd != null && vmd.VIEW_MD != null && vmd.VIEW_MD.FLD_TOOLS_LIST != null) {
				var tools = vmd.VIEW_MD.FLD_TOOLS_LIST;
				isCustomized = tools.toUpperCase().indexOf("GEAR") != -1;
			}
			return isCustomized;
		},
		
		applyDateFilter : function(values,reload) {
	    	var fromDate, toDate;
	    	if("Y" === values.FILTER_RADIO1 && values.FILTER_COMBO){
	    		var dateDetails = values.FILTER_COMBO.split("|");
	    		fromDate = dateDetails[0];
	    		toDate =  dateDetails[1];
	    	}
	    	else if ("Y" === values.FILTER_RADIO2){
	    		fromDate = values.FILTER_FROMDATE;
	    		toDate = values.FILTER_TODATE;
	    	}
	    	var params = {};
	    	params["FILTER"+"_DATE"+"_FIELD"]=values.COLUMN_ID;
    		params["FILTER"+"_DATE"+"_CONSTRAINT"]="range";
           	params["FILTER"+"_DATE"+"_VALUE_TXT"]="";
        	params["FILTER"+"_DATE"+"_VALUE_DATE"]
        					=iportal.jsutil.convertDateValueToUserPreferedFmt(fromDate);
        	params["FILTER"+"_DATE"+"_VALUE_DATE2"]
        					=iportal.jsutil.convertDateValueToUserPreferedFmt(toDate);
        	params["FILTER"+"_DATE"+"_VALUE_TIME"]="";	
        	params["FILTER"+"_DATE"+"_VALUE_TIME2"]="Select";
        	params["COLUMN_VALUE"]="_DATE";
        	params["IS_DATE_FILTER_FORM"]=true;			                	
			if(reload){
				if(this.getGridCmp().xtype == 'paginggrid'){
					this.getGridCmp().filters.permanentState(params);
				}
				if(this.getGridCmp().xtype == 'livegrid'|| this.getGridCmp().xtype == 'groupgrid'){
					this.getGridCmp().gridFilter.permanentState(params);
				}
				this.clearDateFilter(false);
				Ext.apply(this.getGridCmp().getStore().baseParams, params);
				this.getGridCmp().getStore().load();
			}
			else {
				this.dateFilters= params;
			}
		},
		clearDateFilter : function(reload) {
			if(this.getGridCmp().getStore().baseParams){
				var params = this.getGridCmp().getStore().baseParams;
				delete params["FILTER"+"_DATE"+"_FIELD"];
				delete params["FILTER"+"_DATE"+"_CONSTRAINT"];
				delete params["FILTER"+"_DATE"+"_VALUE_TXT"];
				delete params["FILTER"+"_DATE"+"_VALUE_DATE"];
				delete params["FILTER"+"_DATE"+"_VALUE_DATE2"];
				delete params["FILTER"+"_DATE"+"_VALUE_TIME"];
				delete params["FILTER"+"_DATE"+"_VALUE_TIME2"];
				delete params["COLUMN_VALUE"];
				delete params["IS_DATE_FILTER_FORM"];
				if(this.getGridCmp().xtype == 'paginggrid') {
					this.getGridCmp().filters.permanentState(params);
				}
				if(this.getGridCmp().xtype == 'livegrid'|| this.getGridCmp().xtype == 'groupgrid'){
					this.getGridCmp().gridFilter.permanentState(params);
				}
				this.dateFilters ={};
				if(reload){
					this.getGridCmp().getStore().load();
				}
			}
		},
	getMaxWinTools : function()	{
		var that = this;
		var showToolsAsLinearFlag = iportal.systempreferences.getToolsAsLinearFlag();
		var toolsArray = new Array();
		if (showToolsAsLinearFlag) {
			var helpIcon = {
				id : 'help',
				qtip : CRB.getFWBundle().TOOL_TIPS_HELP, 
				iconCls : 'help',
				renderHidden : true,
				hidden : true,
				handler : function (event, toolEl, panel, tc){
					var widgetMv = panel.getComponent(0);
					if (widgetMv.handleToolAction) {
						widgetMv.handleToolAction("HELP");
					}
				}
			};
			toolsArray.push(helpIcon);
			var exportExcelIcon = {
				id : 'excel',
				qtip : CRB.getFWBundle().TOOL_TIPS_EXCEL,  
				iconCls : 'excel',
				renderHidden : true,
				hidden : true,
				handler : function (event, toolEl, panel, tc){
					var widgetMv = panel.getComponent(0);
					if (widgetMv.handleToolAction) {
						widgetMv.handleToolAction("EXCEL");
					}
				}
			};
			toolsArray.push(exportExcelIcon);
			var exportPdfIcon = {
				id : 'pdf',
				qtip : CRB.getFWBundle().TOOL_TIPS_PDF,    
				iconCls : 'pdf',
				renderHidden : true,
				hidden : true,
				handler : function (event, toolEl, panel, tc){
					var widgetMv = panel.getComponent(0);
					if (widgetMv.handleToolAction) {
						widgetMv.handleToolAction("PDF");
					}
				}
			};
			toolsArray.push(exportPdfIcon);
			var exportCsvIcon = {
				id : 'csv',
				qtip : CRB.getFWBundle().TOOL_TIPS_CSV,   
				iconCls : 'csv',
				renderHidden : true,
				hidden : true,
				handler : function (event, toolEl, panel, tc){
					var widgetMv = panel.getComponent(0);
					if (widgetMv.handleToolAction) {
						widgetMv.handleToolAction("CSV");
					}
				}
			};
			toolsArray.push(exportCsvIcon);
			var exportRtfIcon = {
						id : 'rtf',
						qtip : CRB.getFWBundle().TOOL_TIPS_RTF,  
						iconCls : 'pdf',
						renderHidden : true,
						hidden : true,
						handler : function (event, toolEl, panel, tc){
							var widgetMv = panel.getComponent(0);
							if (widgetMv.handleToolAction) {
								widgetMv.handleToolAction("RTF");
							}
						}
					};
			toolsArray.push(exportRtfIcon);
			var clearFilterIcon = {
				id : 'clearFilter',
				qtip : CRB.getFWBundle().TOOL_TIPS_CLEAR_FILTER,   
				iconCls : 'filter',
				renderHidden : true,
				hidden : true,
				handler : function (event, toolEl, panel, tc){
					var widgetMv = panel.getComponent(0);
					if (widgetMv.handleToolAction) {
						widgetMv.handleToolAction("FILTER");
					}
				}
			};
			toolsArray.push(clearFilterIcon);
			var refreshIcon = {
				id : 'refresh',
				qtip : CRB.getFWBundle().TOOL_TIPS_REFRESH,  
				iconCls : 'refresh',
				renderHidden : true,
				hidden : true,
				handler : function (event, toolEl, panel, tc){
					var widgetMv = panel.getComponent(0);
					if (widgetMv.handleToolAction) {
						widgetMv.handleToolAction("REFRESH");
					}
				}
			};
			toolsArray.push(refreshIcon);
			var printIcon = {
				id : 'print',
				qtip : CRB.getFWBundle().TOOL_TIPS_PRINT,   
				iconCls : 'print',
				renderHidden : true,
				hidden : true,
				handler : function (event, toolEl, panel, tc){
					var widgetMv = panel.getComponent(0);
					if (widgetMv.handleToolAction) {
						widgetMv.handleToolAction("PRINT");
					}
				}
			};
			toolsArray.push(printIcon);
		}
		else {
			var pin = {
				id : 'pin',
				qtip : CRB.getFWBundle().TOOL_TIPS_PIN,   
				hidden : true,
				renderHidden : true,
				handler : function (event, toolEl, panel, tc){
					var widgetMv = panel.getComponent(0);
					if (widgetMv.getToolsMenuItems) {
						var menu = widgetMv.getToolsMenuItems();
						if (menu) {
							menu.show(this.id);
						}
					}
				}
			};
			toolsArray.push(pin);
		}
		var switchChart = {
			id : 'switchChart',
			qtip : CRB.getFWBundle().TOOL_TIPS_SWITCHCHART,   
			hidden : true,
			renderHidden : true,
			handler : function (event, toolEl, panel, tc){
				var widgetMv = panel.getComponent(0);
				if (widgetMv.getSwitchChartIcon) {
					var menu = widgetMv.getSwitchChartIcon();
					if (menu) {
						menu.show(this.id);
					}
				}
			}
		};
		toolsArray.push(switchChart);
		var switchView = {
			id : 'switchView',
			qtip : CRB.getFWBundle().TOOL_TIPS_SWITCHVIEW,   
			hidden : true,
			renderHidden : true,
			handler : function (event, toolEl, panel, tc){
				var widgetMv = panel.getComponent(0);
				if (widgetMv.getSwitchViewIcon) {
					widgetMv.getSwitchViewIcon();
				}
			}
		};
		toolsArray.push(switchView);
		return toolsArray;
	},
	updateViewTitle : function (title){
		var panel=this.mvConf.mvh.getSelectedPanel();
	if (!cbx.isEmpty(panel))
	{
		panel.setTitle(title);
	}

	if (this.mvConf.ownerCt && this.mvConf.ownerCt.setTitle)
	{
		this.mvConf.ownerCt.setTitle(title);
	}
	this.mvConf.mvh.setTitle(title);
	},
	getViewTitle: function(){
		return this.mvConf.mvh.title;
	}
});
