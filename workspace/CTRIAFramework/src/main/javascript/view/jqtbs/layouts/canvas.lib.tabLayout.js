/**
 * Copyright 2014. Intellect Design Arena Limited
 */

cbx.ns("canvas.lib");

/**
 * @class "canvas.lib.tabLayout"
 * @extends "cbx.core.Component"
 * @description Tab Layout Engine. Responsible for getting tab layout rendered within the parent DOM passed. Along with
 *              the tab strips, tab content container is created and passed to the activation handler passed by the
 *              caller.
 * @param 1. elem_data_ItemId - parent element data_item_id
 * @param 2. defaultActiveTab - index of the default tab to be made active initially
 * @param 3. activationHandler - method to be called to activate a tab to render the content of the tab in tab content
 *            container
 * @param 4. deactivationHandler - method to be called if the caller needs to do on deactivation of any tab
 * @param 5. implementationSubstring - the prefix to be used for the data_item_id of tab strip and the tab content
 *            container
 * @param 6. presentation - to change the appearance of tab layout with enhanced appearance (Bootstrap "WELL" class)
 * @param 7. activeClass - extra class for the tab strip
 * @param 8. itemList - list of items to be rendered as tabs
 * @param 9. additionalTab - to set an additional tab at the end
 * @example var tabLayoutClass= CLCR.getCmp({ "COMP_TYPE":"LAYOUT", "LAYOUT_TYPE":"TAB" }); var tabLayObj=
 *          tabLayoutClass(config);
 */

canvas.lib.tabLayout = Class(cbx.core.Component, { // Start tabLayout class

	/** tab strip required flag */
	tabStripReq : '',
	/** vertical tab flag */
	verticalTab : '',
	/** list of items to be displayed as tabs */
	itemList : null,

	/** class names for the tab to be activated */
	activeClassVal : '',

	/** activation handler on activating a tab */
	activationHandler : null,

	/** deactivation handler on deactivating a tab */
	deactivationHandler : null,

	/** tab layout content container data_item_id */
	tabCont_data_itemId : '',

	/** parent element to which tab layout to be appended */
	tabParent_elem : '',

	/** the prefix to be used for the data_item_id of tab strip and the tab content container */
	implementationString : '',

	/** index of the initial active tab */
	initActiveTabIndex : '',

	/** data_item_id of current active tab */
	currActiveTab : '',
	

	constructor : function (config)
	{ // Start constructor

		var that = this;
		this.itemList = config.itemList;
		this.activationHandler = config.activationHandler;
		this.tabParent_elem = config.parent_elem;
		this.parentScope = config.parentScope;
		this.tabStripReq = config.tabStrip_req == undefined ? true : config.tabStrip_req;
		var tabsLabel;

		/** Check if deactivation handler is passed */
		this.deactivationHandler = config.deactivationHandler == undefined || config.deactivationHandler == null ? null : config.deactivationHandler;
		
		this.implementationString = config.implementationSubstring == undefined ? "tabLayout_" : config.implementationSubstring;
		
		/** getting the tab index to be activated */
		if(!cbx.isEmpty(this.parentScope.customJSON)) {
			if(this.parentScope.customJSON.isLandingPageRequired() == true && !cbx.isEmpty(this.parentScope.customJSON.getLandingPageComponentName())) {
				this.initActiveTabIndex = null;
			}
			else {
				this.initActiveTabIndex = config.defaultActiveTab == undefined ? 0 : ((config.defaultActiveTab - 1 < 0 ? 0
							: (config.defaultActiveTab - 1 > config.itemList.length - 1 ? config.itemList.length - 1 : config.defaultActiveTab - 1)));
			}
		}
		else {
			this.initActiveTabIndex = config.defaultActiveTab == undefined ? 0 : ((config.defaultActiveTab - 1 < 0 ? 0
						: (config.defaultActiveTab - 1 > config.itemList.length - 1 ? config.itemList.length - 1 : config.defaultActiveTab - 1)));
		}


       if(this.tabStripReq){  /**Check if tab strip for the tab layout is required*/
		var index;
		for (index = 0; index < config.itemList.length; index++)
		{

			/** checking if the current tab item to be made active initially */
			if (index == this.initActiveTabIndex)
			{
				/** set all the necessary classes for the active tab along with its own ID as class name */
				this.activeClassVal = config.activeClass == undefined ? 'active ' : 'active ' + config.activeClass;
				config.itemList[index]['tabStripCls'] = config.activeClass == undefined ? 'active '
							+ config.itemList[index].ITEM_ID+'_tabItem' + ' ' : 'active ' + config.itemList[index].ITEM_ID+'_tabItem' + '  '
							+ '' + config.activeClass + '';
			}// End if
			else
			{
				config.itemList[index]['tabStripCls'] = config.itemList[index].ITEM_ID+'_tabItem';
			}// End else
			/** label for each tab strip */
				tabsLabel = config.itemList[index].ITEM_LABEL == undefined ? config.itemList[index].ITEM_ID : config.itemList[index].ITEM_LABEL;
			config.itemList[index]['tabStripLbl'] = tabsLabel;
			/** set the tab strip prefix passed to the tab id */
			var tabId = this.implementationString +'_'+config.itemList[index].ITEM_ID + '_TabStrip';
			config.itemList[index]['tabStripId'] = tabId;
			/** set the item-index for tab */
			config.itemList[index]['tabStripIndex'] = index;
			/** set the class for the anchor tag in the tab */
			config.itemList[index]['tabStripAnchorClass'] = this.implementationString + '_tabAnchorClass';
		}// End for
		if (config.additionalTab!= undefined && config.additionalTab === true)
		{
			/** check if additional tab is needed (eg: Design Canvas) */
			config.itemList.push({
				'tabStripIndex' : index,
				'tabStripId' : this.implementationString + '_additionalTab_TabStrip',
				'tabStripCls' : ' addtionalTab',
				'tabStripAnchorClass' : this.implementationString + '_tabAnchorClass',
				'tabStripLbl' : '+'
			});
		}
       }//End if (tabStrip_req)	
       
       if(cbx.isEmpty(this.parentScope.customJSON)) {
    	   this.currTabIndex= this.initActiveTabIndex; 	
    	   /** Get the tab id to be activated */
    	   this.currActiveTab = this.itemList[this.initActiveTabIndex].ITEM_ID;
       }
       else if(this.parentScope.customJSON.isLandingPageRequired() == false || cbx.isEmpty(this.parentScope.customJSON.getLandingPageComponentName())) {
    	   this.currTabIndex= this.initActiveTabIndex; 	
    	   /** Get the tab id to be activated */
    	   this.currActiveTab = this.itemList[this.initActiveTabIndex].ITEM_ID;    	   
       }
		/** set the tab layout content container data_item_id */
		var contId = this.implementationString + '_TabCont_'+cbx.id();

		this.verticalTab=config.verticalTab;
		var contAttributes = [ {
			contDivId : contId,
			contDivClass : config.verticalTab? "tab-content col-md-10 ct-tab__panel" : "tab-content ct-tab__panel"
		} ];
		/** form the JSON to be sent to the template */
		var tabLayoutTemplateJSON = {
			"presentation" : config.presentation,
			"tabStripClass" :  config.verticalTab ? "nav nav-pills nav-stacked col-md-2 ct-tab__holder " + this.implementationString+"tab__holder"  : "nav nav-tabs ct-tab__holder " + this.implementationString+"tab__holder",
			"tabStripReq" : this.tabStripReq,
			"tabStrip" : config.itemList,
			"tabContainerConf" : contAttributes
		};

		var tablayer = new ct.lib.tmplLayer('TabLayoutTemplate.cttpl', tabLayoutTemplateJSON);
		tablayer.getTemplate(this.applyTabTemplate, this);

	},// End of constructor
	applyTabTemplate : function (tabLayTemp, tabLayTempClass)
	{
		$(this.tabParent_elem).append(tabLayTemp);
		this.verticalTab ? "" : setTimeout(function(){$('.nav-tabs').tabdrop()}, 10); //JQTBS#TAB
		this.initTabHandler(this, this.implementationString);
	},// End of applyTabTemplate

	initTabHandler : function (currObj, implementationString)
	{
		/** selection handler to be fired on selection of any tab */
		
		$(currObj.tabParent_elem).find('.' + currObj.implementationString + '_tabAnchorClass').bind('click',function (e){
			e.preventDefault();

			if (currObj.deactivationHandler != null)
			{
				/** call the deactivation handler that is passed to the engine */
				currObj.deactivationHandler(currObj.currActiveTab);
			}
			/** Deactivate the current activate tab strip */
			var currTabOnClickParentDOM=$(currObj.tabParent_elem);
			currTabOnClickParentDOM.find('li[data-item-id=' + currObj.implementationString+'_'+currObj.currActiveTab + '_TabStrip]').removeClass(currObj.activeClassVal);
			/** Get the tab data_item_id to be activated */
			currObj.currActiveTab = $(e.currentTarget).parent().attr('data-item-id').replace(currObj.implementationString+'_', '').replace('_TabStrip', '').trim();
			/** Activate the tab strip */
			$(e.currentTarget).parent().addClass(currObj.activeClassVal);

			/** Highlight tabdrop based on the current active tab position */
			currTabOnClickParentDOM.find('li[data-item-id=' + currObj.implementationString+'_'+currObj.currActiveTab + '_TabStrip]').closest('li.dropdown').length === 0 ? 
								currTabOnClickParentDOM.find('li[data-item-id=' + currObj.implementationString+'_'+currObj.currActiveTab + '_TabStrip]').siblings('li.dropdown').removeClass(currObj.activeClassVal)
								: currTabOnClickParentDOM.find('li[data-item-id=' + currObj.implementationString+'_'+currObj.currActiveTab + '_TabStrip]').closest('li.dropdown').addClass(currObj.activeClassVal);
										
			currObj.currTabIndex= $(e.currentTarget).parent().attr('tabindex');
								
			/** call the activation handler passed to the engine */
			currObj.activationHandler(currObj.currActiveTab, currObj.tabCont_data_itemId,currObj.parentScope,currObj.currTabIndex);
		});// End of handler

		/** Get tab content container data_item_id */
		currObj.tabCont_data_itemId = $(currObj.tabParent_elem).find('.tab-content').attr('data-item-id');
	
		if(currObj.tabStripReq){
		/** Highlight tabdrop based on the current active tab position */
		$('li[data-item-id=' + currObj.implementationString+'_'+currObj.currActiveTab + '_TabStrip]').closest('li.dropdown').length === 0 ?
				$('li[data-item-id=' + currObj.implementationString+'_'+currObj.currActiveTab + '_TabStrip]').siblings('li.dropdown').removeClass(currObj.activeClassVal) 
				: $('li[data-item-id=' + currObj.implementationString+'_'+currObj.currActiveTab + '_TabStrip]').closest('li.dropdown').addClass(currObj.activeClassVal);
		}
		/**activate the initially active tab content*/
		
		if(!cbx.isEmpty(this.parentScope.customJSON)) {
			if(this.parentScope.customJSON.isLandingPageRequired() == true && !cbx.isEmpty(this.parentScope.customJSON.getLandingPageComponentName())) {
				LOGGER.log("LandingPageComponentName", this.parentScope.customJSON.getLandingPageComponentName());
			}
			else {
				currObj.activationHandler(currObj.currActiveTab, currObj.tabCont_data_itemId,currObj.parentScope,currObj.currTabIndex);
			}
		}
		else {
			currObj.activationHandler(currObj.currActiveTab, currObj.tabCont_data_itemId,currObj.parentScope,currObj.currTabIndex);
		}
	}

});//End of tab layout class
/**
 * 
 */
CLCR.registerCmp({
	"COMP_TYPE" : "LAYOUT",
	"LAYOUT_TYPE" : "TAB"
}, canvas.lib.tabLayout);
