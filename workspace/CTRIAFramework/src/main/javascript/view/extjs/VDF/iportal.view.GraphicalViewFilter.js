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
Ext.namespace("iportal.view");

iportal.view.GraphicalViewFilter = Ext.extend(Ext.util.Observable,{
/**
	 * Constructor 
	 * initializes both parent and 'this' object with the config options set and calls the init function
	 */
	constructor: function(config){
		iportal.view.GraphicalViewFilter.superclass.constructor.call(this, config);
		Ext.apply(this,config);
		this.init();
    },
    genFormStateId : function(){
    	return this.currWidget+"_"+this.viewId+"_RAW_FILTER_FORM";
    },
    /**
     * Method
     * to initialize the bundle and the constants file and initiates the Preferences window creation.
     */
    init: function(){
    	this.pState = Ext.state.Manager.get(this.genFormStateId(),"NOT_FOUND");
    	this.preView = '';
    	this.rb = CRB.getFWBundle();
    	this.commbun =CRB.getFWBundle();
    	this.cuserRb = CRB.getFWBundle();
    	this.con = iportal.listview.listviewconstants;
    	this.initAjaxReqforEntityCCYList();
    	
    },
     /**
	* Intended to Return Legal Entity Name Group List for an User
	*/
	getEntityGrpList :  function(){
		return this.entityGrpList;
	},
    /**
	* Intended to set The Legal Entity Name Group list for given USER.
	*/
	setEntityGrpList : function(res){
		this.entityGrpList = res.ENTITY_GRP_LIST;
	},
	 /**
	* Intended to Return Currency Group List for an User
	*/
	getCCYGrpList :  function(){
		return this.ccyGrpList;
	},
    /**
	* Intended to set The Currency Group list for given USER.
	*/
	setCCYGrpList : function(res){
		this.ccyGrpList = res.CCY_GRP_LIST;
	},
    	initAjaxReqforEntityCCYList : function(){
				var prms=
					{  
					INPUT_ACTION:"FILTER_ACTION",
					PAGE_CODE_TYPE:'GRAPHICAL_VIEW',
					PRODUCT_NAME:"CUSER",
					INPUT_FUNCTION_CODE:"VSBLTY",
					INPUT_SUB_PRODUCT:"CUSER",
					WIDGET_ID:this.currWidget,
					VIEW_ID:this.viewId,
					__LISTVIEW_REQUEST:'Y'
					};
				
			 		Ext.Ajax.request({
				       	params:prms,
				       	success:function(resp,options){
			 				var respOb= Ext.decode(resp.responseText);
				 				if(options.params.INPUT_ACTION === 'FILTER_ACTION'){
				 				this.entity_list = respOb.ENTITY_LIST;
				 				this.ccy_list = respOb.CCY_LIST;
				 				this.entity_col_id = respOb.ENTITY_COL_ID;
				 				this.ccy_col_id = respOb.CCY_COL_ID;
					
				 				//	this.setEntityGrpList(respOb['ENTITY_LIST']);
				 				//	this.setCCYGrpList(respOb['CCY_LIST']);
				 				//	this.actualEntityGrpList = this.createUsableEntityGrpList(this.getFilteredEntityGrpIds());
				 					//this.actualCCYGrpList = this.createUsableCCYGrpList(this.getFilteredCCYGrpIds());
									this.createWindowAndShow();	
				 				}
			 				}.createDelegate(this)
			 			});
			},
			
	createUsableEntityGrpList : function() {
	
	},		
    
	getFilteredEntityGrpIds : function() {
	
	},
	createUsableCCYGrpList : function() {
	
	},		
    
	getFilteredCCYGrpIds : function() {
	
	},

		    /**
     * getFormItems Method
     * Creates the components to be included in the Form Panel
     *
     * returns Array of items of Form panel components
     */
    getFormItems:function(){
	    var items = [];
		items.push(this.legalEntityItemSelect());
		items.push('|');
		items.push(this.ccyItemSelect());
	    return items;
    },
    legalEntityItemSelect: function(){
		var legalEntityItemSelector = new Ext.ux.form.ItemSelector({
			id	: this.entity_col_id,
			drawTopIcon:false,
    		drawBotIcon:false,
    		drawUpIcon:false,
    		drawDownIcon:false,
    		autoScroll:true,
			name: this.entity_col_id,
			ctCls : 'gradientImageCls',
            fieldLabel: this.cuserRb['LBL_ENTITY_NAME_SELECT'],
    /*        hidden: (this.vMetaData.VIEW_MD.FLD_GROUPED_IND === "N")?true:false,
            hideLabel : (this.vMetaData.VIEW_MD.FLD_GROUPED_IND === "N")?true:false,*/		
	        imagePath: '/iportalweb/iportal/images/iportal-images/itemselector/customer/',
	        labelSeparator: '',

            multiselects: [{
                width: 177,
                height: 150,
                cls:"multi-select",                 
				border:true,
				multiSelect:true,
				singleSelect:true,
                store: this.getLeftLegalEntityMultiSelectArr(),
                draggable: false,
                droppable: false,
                displayField: 'text',
                valueField: 'value'
            },{
                width: 177,
                height: 150,
                cls:"multi-select", 
                draggable: false,
                multiSelect:true,
                singleSelect:true,
                droppable: false,
				border:true,
                store: this.getRightLegalEntityMultiSelectArr()
            }]
		});
		return legalEntityItemSelector;
    },
    ccyItemSelect: function(){
    var ccyItemSelector = new Ext.ux.form.ItemSelector({
			id	: this.ccy_col_id,
			name : this.ccy_col_id,
			drawTopIcon:false,
    		drawBotIcon:false,
    		drawUpIcon:false,
    		drawDownIcon:false,
    		autoScroll:true,
			ctCls : 'gradientImageCls',
            fieldLabel: this.cuserRb['LBL_CCY_SELECT'],
            /*hidden: (this.vMetaData.VIEW_MD.FLD_GROUPED_IND === "N")?true:false,
            hideLabel : (this.vMetaData.VIEW_MD.FLD_GROUPED_IND === "N")?true:false,*/		
	        imagePath: '/iportalweb/iportal/images/iportal-images/itemselector/customer/',
	        labelSeparator: '',

            multiselects: [{
                width: 177,
                height: 150,
                cls:"multi-select",                 
				border:true,
				multiSelect:true,
				singleSelect:true,
                store: this.getLeftCCYMultiSelectArr(),
                draggable: false,
                droppable: false,
                displayField: 'text',
                valueField: 'value'
            },{
                width: 177,
                height: 150,
                cls:"multi-select", 
                draggable: false,
                multiSelect:true,
                singleSelect:true,
                droppable: false,
				border:true,
                store: this.getRightCCYMultiSelectArr()
            }]
		});
		return ccyItemSelector;
    },
    
    getLeftLegalEntityMultiSelectArr : function() {
       	var leftMultiSelectArr = [];
		var entityGroupList = this.entity_list;
		var ecid = "";
		var entityName = "";
		var stVal = "";
		if(Ext.isObject(this.pState)) {
		stVal = this.pState[this.entity_col_id];
		}
    	//var arrVal = stVal.split(",");
		for(index = 0;index<entityGroupList.length;index++)
		{
			ecid = entityGroupList[index].ECID;
			entityName = entityGroupList[index].ENTITY_NAME;
			if(stVal.indexOf(entityName) < 0 )
				leftMultiSelectArr.push([entityName, entityName, index]);
		}
		
		return leftMultiSelectArr;
    },
    getRightLegalEntityMultiSelectArr: function(){
    	var rightMultiSelectArr = [];
    	if(Ext.isObject(this.pState)){
    		var stVal = this.pState[this.entity_col_id];
    		var arrVal = stVal.split(",");
    		for(var i=0;i<arrVal.length;i++){
    			rightMultiSelectArr.push([arrVal[i],arrVal[i],i]);
    		}
    	}
    	return 	rightMultiSelectArr;
 		
    },
    getLeftCCYMultiSelectArr: function(){
 		var leftCCYMultiSelectArr = [];
		var ccyGroupList = this.ccy_list;
		var ccy_code = "";
		var ccy_name = "";
		var stVal = "";
			if(Ext.isObject(this.pState)){
    		stVal = this.pState[this.ccy_col_id];
    		}
		for(index = 0;index<ccyGroupList.length;index++)
		{
			ccy_code = ccyGroupList[index].CCY_CODE;
			ccy_name = ccyGroupList[index].CCY_NAME;
			if(stVal.indexOf(ccy_name) < 0 )
				leftCCYMultiSelectArr.push([ccy_code, ccy_name, index]);
		}
		return leftCCYMultiSelectArr;
    },
    getRightCCYMultiSelectArr: function(){
		var rightccyMultiSelectArr = [];
		if(Ext.isObject(this.pState)){
    		var stVal = this.pState[this.ccy_col_id];
    		var arrVal = stVal.split(",");
    		for(var i=0;i<arrVal.length;i++){
    			rightccyMultiSelectArr.push([arrVal[i],arrVal[i],i]);
    			}
    		}
    	return 	rightccyMultiSelectArr;
    },
      getBbarItems: function(){
    var bbar =[];
			bbar.push(this.createUpdate());
			bbar.push(' ');
			bbar.push(this.createClearFilter());
			bbar.push('->');
			bbar.push(this.createCancel());
		return bbar;
	},
	isEmpty : function(val){
		return (Ext.isEmpty(val)|| val === this.crb.LBL_FILTER_VAL);
    },
    getParentWidget : function(){
	    return Ext.getCmp(this.currWidget+"_PANEL");
    },
    /**
	* Should validate for the filter values and if there are no errors, 
	* closes the window and updates the associated with the filtered results
	*/
	updateHandler : function(){
		var valsob = {};
		var basicF = Ext.getCmp('GRAPH_FILTER_FORM').getForm();
			var formob = basicF.getValues(false);
			Ext.state.Manager.set(this.genFormStateId(),formob);
			valsob[this.con.IS_FILTER_FORM]=true;
			valsob.COLUMN_COUNT = 2;
			
			valsob.FILTER1_FIELD= this.entity_col_id;
			valsob.FILTER1_CONSTRAINT="in";
			valsob.FILTER1_VALUE_TXT=formob[this.entity_col_id];
			if(valsob.FILTER1_VALUE_TXT == "") {
			valsob.FILTER1_FIELD= "";
			valsob.FILTER1_CONSTRAINT="";
			}
			valsob.FILTER2_FIELD= this.ccy_col_id;
			valsob.FILTER2_CONSTRAINT="in";
			valsob.FILTER2_VALUE_TXT=formob[this.ccy_col_id];
			if(valsob.FILTER2_VALUE_TXT == "" ) {
			valsob.FILTER2_FIELD= "";
			valsob.FILTER2_CONSTRAINT="";
			}
			this.mvh.setAppliedFilters(valsob);
			this.getParentWidget().loadData(valsob);
			this.widjGraphFilterWin.close();
			
	},
	/**
	* Clears any values entered by user in the Filter field, 
	* Closes the window, and refreshes the associated view without applying any filter
	*/
	clearFilterHandler : function(){
	var basicF = Ext.getCmp('GRAPH_FILTER_FORM').getForm();
	basicF.reset();
		var formVals = basicF.getValues(false);
		//values are submitting as undefined Hence Reseting to empty value.
		formVals.FILTER1_CONSTRAINT="";
		formVals.FILTER2_CONSTRAINT="";
		formVals.FILTER1_FIELD="";
		formVals.FILTER2_FIELD="";
		this.getParentWidget().loadData(formVals);
		this.mvh.setAppliedFilters(null);
		Ext.state.Manager.set(this.genFormStateId(),null);
		this.widjGraphFilterWin.close();
	},
/**
	* Intended create Update button and return
	*/
	createUpdate:function(){
		return {
			text: this.rb.LBL_UPDATE,
			handler:this.updateHandler,
			scope:this
		};
	},
	
	/**
	* Intended to create Clear Filter Button and return 
	*/
	createClearFilter : function(){
		return {
			text: this.rb.LBL_CLEAR_FILTER,
			handler:this.clearFilterHandler,
			scope:this
		};
	},
	/**
	* Intended to create Cancel button
	*/
	createCancel : function(){
		return {
            text: this.rb.LBL_CANCEL,
            handler:function(){this.widjGraphFilterWin.close();},
            scope:this
        };
	},
	isValidUpdate :  function() {
	
	},
  createWindowAndShow: function(){
    	this.widjGraphFilterWin = new iportal.Window({
			id:"GRAPH_VIEW_FILTER",
			title:"LBL_"+this.viewId,
			bundleKey : CRB.getFWBundleKey(),
			toolButtons:['help','close'],
			helpHandler:function(){
				iportal.jsutil.helpHandler("Liquidity_Position_Graphical_View_Filter_Help.htm");
			},
			width:950,
			height:610,
			modal:true,
			items: [{
						xtype:'iportal-fluidform',
						bundleKey : CRB.getFWBundleKey(),
						layout:'form',
						border:false,
						autoScroll:true,
						width:936,
						height:550,
						id:"GRAPH_FILTER_FORM",
						items: this.getFormItems()
					}],
			bbar:this.getBbarItems()	
		});
		this.widjGraphFilterWin.show();
    }
});