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
cbx.ns("cbx.lib");
/**
 * 
 */
cbx.lib.getViewPort = function ()
{
	/**
	 * 
	 */
	Ext.QuickTips.init();

	/**
	 * 
	 */
	var value = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

	/**
	 * 
	 */
	try
	{
		var gHeader = new Ext.BoxComponent({
			html : value,
			renderTo : document.body,
			cls : 'x-grid3-hd-inner'
		});

		iportal.preferences.setGridHeaderHeight(gHeader.getHeight());

		gHeader.destroy();
	} catch (e)
	{
		LOGGER.error(e);
	}
	/**
	 * 
	 */
	try
	{
		var gCell = new Ext.BoxComponent({
			html : value,
			renderTo : document.body,
			cls : 'x-grid3-cell-inner'
		});

		iportal.preferences.setGridCellHeight(gCell.getHeight());

		gCell.destroy();
	} catch (e)
	{
		LOGGER.error(e);
	}

	try
	{
		var line = new Ext.form.TextArea({
			renderTo : document.body
		});

		var height = 60;
		if (line != null)
		{
			height = parseInt(line.el.dom.clientHeight) - 2;
		}
		iportal.preferences.setTextAreaRowHeight(Math.floor(height / 4));
		line.destroy();

	} catch (e)
	{
		LOGGER.error(e);
	}

	try
	{
		var rowInsideMultiselect = new Ext.BoxComponent({
			renderTo : document.body,
			cls : 'x-list-body-inner'
		});

		var height = 20;
		if (rowInsideMultiselect != null)
		{
			height = parseInt(rowInsideMultiselect.getHeight()) - 2;
		}
		iportal.preferences.setMultiSelectRowHeight(height);
		rowInsideMultiselect.destroy();
	} catch (e)
	{
		LOGGER.error(e);
	}

	try
	{
		var iconpanelWidth = new Ext.BoxComponent({
			renderTo : document.body,
			cls : 'cbxmultiselect-icons'
		});
		var widthOfIconPanel = 30;
		if (iconpanelWidth != null)
		{
			widthOfIconPanel = parseInt(iconpanelWidth.getWidth());
		}
		iportal.preferences.setIconPanelwidth(widthOfIconPanel);
		iconpanelWidth.destroy();
	} catch (e)
	{
		LOGGER.error(e);
	}

	try
	{
		var headtitle = new Ext.BoxComponent({
			renderTo : document.body,
			cls : '.x-panel-header'
		});

		var heightOfTitle = 20;
		if (headtitle != null)
		{
			heightOfTitle = parseInt(headtitle.getHeight());
		}
		iportal.preferences.setTitleHeight(heightOfTitle);
		headtitle.destroy();
	} catch (e)
	{
		LOGGER.error(e);
	}

	try
	{
		var labelMetrics = Ext.getBody().createChild({
			cls : 'x-form-item x-hide-offsets',
			cn : {
				tag : 'label',
				style : {
					width : 'auto'
				}
			}
		}, null, true);
		var label = labelMetrics.firstChild;
		var labelStr = "Testing Label1";
		label.innerHTML = labelStr;
		LOGGER.info(label.innerHTML, " width: ", labelMetrics.offsetWidth, labelMetrics);
		iportal.preferences.setLabelCharWidth(Math.ceil(labelMetrics.offsetWidth / labelStr.length));
	} catch (e)
	{
		LOGGER.error(e);
	}
	
	
	
	try {
		/**
		* TO-DO : In future, instead of hard coding the value as a 
		* character of the English language, it should be a character
		* of the primary language.
		*/		
		var alphabet='a';
		var alphaSizeFinder = new Ext.form.Label({
			html : alphabet,
			renderTo : document.body
		});
		
		iportal.preferences.setAverageFontWidth(parseInt(alphaSizeFinder.getWidth()));	
		alphaSizeFinder.destroy();	
	} catch (e) {
		LOGGER.error(e);
	}
	/**
	* footerHeight, headerHeight and footerCls will not be hard coded.
	* Instead it will be picked up from the configuration of the application layout
	*/
	var footerHeight, headerHeight, headerCls, footerCls;
	var applicationLayout = iportal.preferences.getLayout();
	var applicationLayoutConfig = canvas.metadata.applicationLayout;
	applicationLayoutConfig.initializeApplicationLayoutMetadata();
	headerHeight = applicationLayoutConfig.getHeaderHeightInPx(); 
	footerHeight = applicationLayoutConfig.getFooterHeightInPx();
	headerCls = applicationLayoutConfig.getHeaderCls();
	footerCls = applicationLayoutConfig.getFooterCls();
	//Removed unused code
	iportal.preferences.setWorkspaceHeaderHeight(headerHeight);
	iportal.preferences.setWorkspaceFooterHeight(footerHeight);
	layout = applicationLayout;
	return new Ext.Viewport({
		layout : 'border',
		id : 'vpContainer',
		/** the viewport is not setting the layout by itself, so doing a force layout after a delay */
		listeners : {
			'afterrender' : function (comp)
			{
				setTimeout(function ()
				{
					comp.doLayout();
				}, 100);
			}
		},
		items : [ {
			region : 'north',
			id:'APPLICATION_HEADER_AREA',
			cls : 'CONTAINER_north ' + headerCls + ' header' + layout,
			renderTo : 'HEADER_DIV', 
			height : headerHeight,
			border : false
		}, {
			xtype : 'panel',
			id : 'CONTENT_AREA',
			cls : 'center-warp wscon' + layout,
			region : 'center',
			renderTo : 'CONTENT_DIV',
			autoScroll : true,
			border : false
		}, {
			region : 'south',
			cls : 'CONTAINER_south ' + footerCls + ' footer' + layout,
			height : footerHeight,
			renderTo : 'FOOTER_DIV',
			layout : 'column',
			border : false
		/**
		 * The object of cbx.applicationlayout.container.Register class CALCR is used to get the class that will render
		 * the footer region based on the layout information. If the layout is TAB cbx.tablayout.footer will be
		 * returned. If the layout is CARD cbx.cardlayout.footer will be returned.
		 */
		} ]
	});
};

/**
 * 
 */
CLCR.registerCmp({
	"APPLICATION_FW" : "EXT-JS",
	"LAYOUT_TYPE" : "APPLICATION_LAYOUT"
}, cbx.lib.getViewPort);

/**
 * 
 */

/**
 * 
 */
cbx.lib.getExtWorkspaceContainer = function (conf)
{
	return new Ext.Panel({
		collapsible : false,
		itemId : conf.itemId,
		autoDestroy : true
	});
};

/**
 * 
 */
CLCR.registerCmp({
	"COMPONENT" : "WORKSPACE_CONTAINER",
	"LAYOUT_TYPE" : "ANCHOR"
}, cbx.lib.getExtWorkspaceContainer);

/**
 * 
 */
cbx.lib.getExtStackLayoutContainer = function (config)
{

	return new Ext.Panel({
		wsLayout : 'STACK',
		autoWidth : true,
		autoDestroy : true,
		frame : false,
		removeWidgets : function ()
		{
			this.getComponent(0).removeWidgets();
			LOGGER.info("stack remove widgets portal width", this.findByType('portal')[0].getWidth());
		},
		renderWidgets : function ()
		{
			this.getComponent(0).renderWidgets();
			this.getComponent(0).doLayout();
			LOGGER.info("stack render widgets portal width", this.findByType('portal')[0].getWidth())
		},
		getWidgetContainer : function ()
		{
			return this.getComponent(0).getComponent(0);
		}
	});
};

/**
 * 
 */
cbx.lib.getExtTabLayoutContainer = function (config)
{

	var hideHeader = false;

	if (config && config.hideHeader == true)
	{
		hideHeader = true;
	}

	return new Ext.TabPanel({
		autoHeight : true,
		autoWidth : true,
		border : false,
		baseCls : 'layoutTab x-tab-panel',
		activeTab : 0,
		headerCfg : {
			cls : hideHeader == true ? 'hide-header' : ''
		},
		frame : false,
		autoDestroy : true,
		autoScroll : true,
		renderWidgets : function ()
		{
			if (this.getActiveTab().itemId == this.getComponent(0).itemId)
			{
				this.getActiveTab().renderWidgets();
			} else
			{
				this.activate(0);
			}
		},
		removeWidgets : function ()
		{
			this.getActiveTab().removeWidgets();
		},
		getWidgetContainer : function ()
		{
			return this.getActiveTab().getComponent(0);
		}
	});
};

/** Added canvas.lib.WorkSpaceLayoutBuilder. This will be used to 
* create the work space layout component on the fly using the 
* configurations for the work space property provided as a part 
* of the application layout configuration.
* After introducing this, registering the "WORKSPACE_LAYOUT" with the
* layout is not necessary. Hence removed all those code.
*/
canvas.lib.WorkSpaceLayoutBuilder = function (elem, items)
{
	var addTabplugin='';
	
	if (iportal.systempreferences.getDesignCanvasInd())
	{
		addTabplugin = [Ext.ux.AddTabButton] 

	}
	var workSpaceLayoutConfig = canvas.metadata.applicationLayout.getWorkSpaceLayoutConfig();
		return new Ext.TabPanel({
			autoHeight : workSpaceLayoutConfig.autoHeight ? workSpaceLayoutConfig.autoHeight : false,
			autoWidth : workSpaceLayoutConfig.autoWidth ? workSpaceLayoutConfig.autoWidth : true,
			border : workSpaceLayoutConfig.border ? workSpaceLayoutConfig.border : true,
			frame : workSpaceLayoutConfig.frame ? workSpaceLayoutConfig.frame : true,
			plain : workSpaceLayoutConfig.plain ? workSpaceLayoutConfig.plain : true,
			cls : workSpaceLayoutConfig.cls ? 'workSpaceLayoutConfig.cls' : '',
			headerCfg : workSpaceLayoutConfig.headerCfg ? workSpaceLayoutConfig.headerCfg : {},
			plugins : addTabplugin,
			addTabText : '+',
			onAddTabClick : function ()
			{
				// DYC Issue starts
				if (iportal.systempreferences.getDesignCanvasInd())
				{
					CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getMergedArray([ "APPSTORE" ]), function ()
					{
						cbx.appstore.Jsutil.initAppstore();
					});

				}
				// DYC Issue ends
			},
			items : items,
			height :elem.getHeight(),
			activeTab : workSpaceLayoutConfig.activeTab ? workSpaceLayoutConfig.activeTab : 0,
			onDestroy : workSpaceLayoutConfig.onDestroy ? workSpaceLayoutConfig.onDestroy : function ()
			{
				this.destroy();
			}
		});
};
/**
 * 
 */
CLCR.registerCmp({
	"LAYOUT_TYPE" : "WORKSPACE_LAYOUT"
}, canvas.lib.WorkSpaceLayoutBuilder);


/**
 * 
 */
CLCR.registerCmp({
	"COMPONENT" : "LAYOUT_CONTAINER",
	"LAYOUT" : "STACK"
}, cbx.lib.getExtStackLayoutContainer);

/**
 * 
 */
CLCR.registerCmp({
	"COMPONENT" : "LAYOUT_CONTAINER",
	"LAYOUT" : "TAB"
}, cbx.lib.getExtTabLayoutContainer);

/**
 * 
 */
cbx.lib.getExtMenuLayoutContainer = function (config)
{
	var tabConfig = {
		'hideHeader' : true
	};
	var isRtlMode = iportal.preferences.isLangDirectionRTL();
	var region = null;
	if (isRtlMode == true)
	{
		region = (config.containerLayout == "R-MENU") ? 'west' : (config.containerLayout == "L-MENU") ? 'east' : 'west';
	} else
	{
		region = (config.containerLayout == "R-MENU") ? 'east' : (config.containerLayout == "L-MENU") ? 'west' : 'east';
	}
	var menuPanel = new Ext.Panel({
		layout : 'border',
		autoWidth : true,
		itemId : 'MENU-LAYOUT-CNTNR',
		height : iportal.jsutil.getContainerResizeHeight(),
		items : [ {
			region : 'center',
			border : true,
			items : [ new cbx.lib.getExtTabLayoutContainer(tabConfig) ]
		// CT_LMENU
		}, {
			region : region,
			border : true,
			width : 200,
			title : "MENU PANE"
		} ],

		/**
		 * Reponsible for removing the widgets in a layout
		 */
		removeWidgets : function ()
		{
			this.getLayoutPane().layout.activeItem.removeWidgets();
		},
		/**
		 * Gets called when the User navigates to the master Screen from any workspace and then re-enters the workspace.
		 * Activates a layout and does highlight operations accordingly.
		 */
		renderWidgets : function ()
		{
			var activeItem = this.getLayoutPane().getComponent(0);
			var node = this.getMenuPane().renderer.findTreeNode(this.getLayoutId(activeItem.itemId));
			var layoutId = null;
			var activeNode = null;
			if (!Ext.isEmpty(this.getLayoutPane().getLayout().activeItem))
			{
				this.getLayoutPane().getLayout().activeItem.hide();
				this.getLayoutPane().getLayout().activeItem.setVisible(false);
				layoutId = this.getLayoutId(this.getLayoutPane().getLayout().activeItem.itemId);
				activeNode = this.getComponent(1).renderer.getHighlightedNode();
			}
			this.getLayoutPane().getLayout().activeItem = activeItem;
			this.getLayoutPane().getLayout().activeItem.show();
			this.getLayoutPane().getLayout().activeItem.setVisible(true);
			// activeItem.fireEvent('activate', activeItem);
			node.ownerTree.getSelectionModel().selNode = node;
			layoutId = this.getLayoutId(activeItem.itemId);
			this.getMenuPane().renderer.doHighlight(activeNode, node);
			/**
			 * Collapsing all child nodes on re-render
			 */
			for (var i = 0; i < this.getMenuPane().items.length; i++)
			{
				this.getMenuPane().getComponent(i).collapseAll();
				this.getMenuPane().getComponent(i).getRootNode().expand();
			}
		},
		/**
		 * returns the layout definition panel
		 */
		getLayoutPane : function ()
		{
			return this.getComponent(0);
		},
		/**
		 * returns the menu pane
		 */
		getMenuPane : function ()
		{
			return this.getComponent(1);
		},
		/**
		 * substrings the layout id for the passed string and returns the result
		 */
		getLayoutId : function (str)
		{
			var index = str.indexOf("_LAYOUT_CONTAINER");
			return str.substring(0, index);
		},
		/**
		 * returns the Layout Pane i.e the first
		 */
		getWidgetContainer : function ()
		{
			return this.getLayoutPane().getComponent(0).activeTab.getComponent(0);// CT_LMENU
		}
	});
	var menuType = null;
	menuType = Ext.isEmpty(menuType) ? 'TREE' : menuType;
	var config = {
		menuType : menuType,
		menuPanel : menuPanel
	};
	var renderer = new cbx.layout.MenuTreePanel({
		menuPanel : config.menuPanel
	});
	menuPanel.getComponent(1).renderer = renderer;
	return menuPanel;
};
/**
 * 
 */
CLCR.registerCmp({
	"COMPONENT" : "LAYOUT_CONTAINER",
	"LAYOUT" : "L-MENU"
}, cbx.lib.getExtMenuLayoutContainer);
/**
 * 
 */
CLCR.registerCmp({
	"COMPONENT" : "LAYOUT_CONTAINER",
	"LAYOUT" : "R-MENU"
}, cbx.lib.getExtMenuLayoutContainer);
/**
 * 
 */
cbx.lib.getExtLayoutContainerComponent = function (layoutArr)
{

	var rb = CRB.getBundle(layoutArr.LD_BUNDLE_KEY);

	return new Ext.Panel(
				{
					tabCls : 'tab-icon',
					header : false,
					frame : false,
					bodyStyle : 'overflow-x:hidden',
					autoScroll : true,
					iconCls : 'icon-' + layoutArr.LAYOUT_ID,
					title : rb[layoutArr.LAYOUT_DISPLAY_NM] == null ? layoutArr.LAYOUT_DISPLAY_NM
								: rb[layoutArr.LAYOUT_DISPLAY_NM],
					itemId : layoutArr.LAYOUT_ID + "_LAYOUT_CONTAINER"
					//removed unused code
				});
},
/**
 * 
 */
CLCR.registerCmp({
	"COMPONENT" : "LAYOUT_CONTAINER_COMPONENT"
}, cbx.lib.getExtLayoutContainerComponent);

cbx.lib.extprogressBar = Class(cbx.core.Component, {
	urlListLength : 0,
	totalFilePercentage : null,
	constructor : function (config)
	{
		var urlListLength = 0;
		if (config.urls.indexOf(",") != -1)
		{
			urlListLength = config.urls.split(',').length;
			this.urlListLength = Number(urlListLength);
			this.totalFilePercentage = Number(100 / this.urlListLength);
		}
	},
	initializeProgressBar : function ()
	{
		iportal.jsutil.showLoadingMsgOnBody();
	},
	stopProgressBar : function ()
	{
		iportal.jsutil.hideLoadingMsgOnBody();
	},
	updateProgress : function (fileCounter)
	{
	},
	calcPercent : function (x, y)
	{
		if (!cbx.isEmpty(this.totalFilePercentage))
		{
			return Math.round(this.totalFilePercentage * x);
		} else
		{
			return "";
		}
		// return 100 * ( x / y );
	}
})
CLCR.registerCmp({
	"COMP_TYPE" : "PROGRESS_BAR",
	"LAYOUT" : "CIRCULAR"
}, cbx.lib.extprogressBar);
cbx.lib.beforeAjax = function(httpReq){
	//changes to override ajax request time out value based on config value
		var request = httpReq.config;
		if(!cbx.isEmpty(request.data) || !cbx.isEmpty(request.params) ){
			/* CT_MOBILITY_CHGv1.2 MISC_07_10_003 Ends */
			var configTime = Number(iportal.systempreferences.getAjaxRequestTimeOutPeriod());
			request.timeout = Ext.isNumber(configTime)? configTime:request.timeout;
			if(!request.url)
				request.url=iportal.jsutil.getController();
			request.method= 'POST'; 
			/* Adding CSRF Prevention Token to the request*/
			request.data[iportal.systempreferences.getCSRFKeyName()]=iportal.systempreferences.getCSRFUniqueId();
			/* Reset Client Side Timers for Session*/
			iportal.sessionTimeout.cancel(); 
			iportal.sessionTimeout.delay(iportal.systempreferences.getIdleSessionTimeoutInSeconds()); 
			iportal.timedoutWindowClose.cancel();
			/* CT_MOBILITY_CHGv1.2 MISC_07_10_003 Starts */
		}
		else{
			request.params={}
		}
		/* CT_MOBILITY_CHGv1.2 MISC_07_10_003 Ends */
		if(!iportal.util.ajaxPiggyback.isPiggybackRequest(request) && !request.params.__LISTVIEW_REQUEST){
			iportal.jsutil.showLoadingMsgOnBody();
		}
}
CLCR.registerCmp({"COMP_TYPE":"GLOBAL_AJAX_LISTENERS","SEQUENCE":"INIT"},cbx.lib.beforeAjax); //CHG_001_59873
cbx.lib.postAjax = function(request){
	iportal.jsutil.hideLoadingMsgOnBody();
	Ext.getBody().unmask();
	Ext.WindowMgr.each(function(extComp){
		if(extComp.el.isMasked()){
			extComp.el.unmask();
		}
	})
	if (iportal.systempreferences.isAlertViaPiggyBack()) {
		if(!iportal.util.ajaxPiggyback.isPiggybackRequest(request) && !iportal.util.ajaxPiggyback.isPiggyBackInprocess){
			iportal.util.ajaxPiggyback.isPiggyBackInprocess=true;
			iportal.apps.alertPiggybackListner.getUrgentNormalAlertsCounts();
		}
		else if(iportal.util.ajaxPiggyback.isPiggybackRequest(request)){
			iportal.util.ajaxPiggyback.isPiggyBackInprocess = false;
		}
	}	
	/*if(!iportal.util.ajaxPiggyback.isPiggybackRequest(request) && !request.params.__LISTVIEW_REQUEST){
		iportal.jsutil.hideLoadingMsgOnBody();
	}
	//CHG_RET01_120213_Starts
	if(!iportal.util.ajaxPiggyback.isPiggybackRequest(request) && !iportal.util.ajaxPiggyback.isPiggyBackInprocess){
		iportal.util.ajaxPiggyback.isPiggyBackInprocess=true;
		iportal.apps.alertPiggybackListner.getUrgentNormalAlertsCounts();
	}*/
	//CHG_RET01_120213_Ends
	iportal.sessionTimeout.cancel(); 
	iportal.sessionTimeout.delay(iportal.systempreferences.getIdleSessionTimeoutInSeconds()); 
	iportal.timedoutWindowClose.cancel();  
}
CLCR.registerCmp({"COMP_TYPE":"GLOBAL_AJAX_LISTENERS","SEQUENCE":"COMPLETE"},cbx.lib.postAjax); //CHG_001_59873