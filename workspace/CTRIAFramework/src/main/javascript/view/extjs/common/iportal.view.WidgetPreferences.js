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
cbx.namespace("iportal.view");


/**
 * The Purpose of this class is to handle Preferences for all widgets (if applicable)
 * as per the View Definition
 *
 * To enable Preferences, 
 * A new object of iportal.view.WidgetPreferences has to be created with 
 * two mandatory config options set namely,  
 *	1. currWidget - The Widget for which the Preferences is enabled
 *	2. vMetaData - The View Definition Metadata provided by the View Definition Framework 
 *
 * @class iportal.view.WidgetPreferences
 * @extends Ext.util.Observable
 */
iportal.view.WidgetPreferences = Ext.extend(Ext.util.Observable,{
	
	/**
	 * Constructor 
	 * initializes both parent and 'this' object with the config options set and calls the init function
	 */
	constructor: function(config){
		iportal.view.WidgetPreferences.superclass.constructor.call(this, config);
		Ext.apply(this,config);
		this.init();
    },
    
    /**
	 * Config option 
	 * To capture the current widget under consideration 
	 * Should be mandatorly set while creating iportal.view.WidgetPreferences object
	 */
    currWidget:null,


    /**
     * Config option 
     * To load data into all the preferences field for the selected view
     * Should be mandatorly set while creating iportal.view.WidgetPreferences object
     */
    vMetaData:null,
    
    /**
     * Method
     * to initialize the bundle and the constants file and initiates the Preferences window creation.
     */
    init: function(){
    	this.preView = '';
    	this.accGrpList = [];
    	this.commbun = CRB.getFWBundle();
    	this.cuserRb = CRB.getFWBundle();
    	this.initAjaxReqforAccGrpList();
    	this.viewsList = IMM.getViewsList(this.currWidget);
		this.mv_const = iportal.view.MultiViewConstants; 
		this.lvc_const = iportal.listview.listviewconstants;
    },
    
    /**
	* Intended to Return Account Group List for an User
	*/
	getAccGrpList :  function(){
		return this.accGrpList;
	},
    /**
	* Intended to set The Account Group list for given USER.
	*/
	setAccGrpList : function(res){
		this.accGrpList = res.ACC_GRP_LIST;
	},
	/**
	 * 
	 */
	initAjaxReqforAccGrpList : function(){
		var prms = {  
			INPUT_ACTION:"INIT_HEADER_ACTION",
			PAGE_CODE_TYPE:'VDF_CODE',
			PRODUCT_NAME:"CUSER",
			INPUT_FUNCTION_CODE:"VSBLTY",
			INPUT_SUB_PRODUCT:"CUSER",
			WIDGET_ID:this.currWidget,
			__LISTVIEW_REQUEST:'Y'
		};
 		Ext.Ajax.request({
	       	params:prms,
	       	success:function(resp,options){
 				var respOb= Ext.decode(resp.responseText);
 				if(options.params.INPUT_ACTION === 'INIT_HEADER_ACTION'){
 					this.setAccGrpList(respOb.response.value);
 					this.actualAccGrpList = this.createUsableAccGrpList(this.getFilteredAccGrpIds());
					this.createWindowAndShow();	
 				}
 			}.createDelegate(this)
 		});
	},
    /**
     * 
     */
    getFilteredAccGrpIds: function(){
    	var AccGrpIds = [];
    	var filtersList = this.vMetaData.VIEW_MD.FILTERS;
    	for(var i = 0;i < filtersList.length ; i++)
    	{
    		var aFilter = filtersList[i];
    		if(aFilter.FLD_COLUMN_ID === "ACC_GR_ID")
    		{
    			return aFilter.FLD_FILTER_VALUES
    		}	
    	}
    	return AccGrpIds;
    },
    /**
     * 
     */
   createUsableAccGrpList: function(accGrpIdsArr){
    	var aGList = this.getAccGrpList();
    	for(var i = 0;i < aGList.length ; i++)
    	{
    		var aAccGrp = aGList[i];
    		if(accGrpIdsArr.length === 0){
    			if(aAccGrp.ACC_GR_ID === "-1")
    				aAccGrp.ACC_GRP_SEL_IND = "Y";
    			else
    				aAccGrp.ACC_GRP_SEL_IND = "N";
    		}else
    		{
	    		if(accGrpIdsArr.contains(aAccGrp.ACC_GR_ID))
	    			aAccGrp.ACC_GRP_SEL_IND = "Y";
	    		else
	    			aAccGrp.ACC_GRP_SEL_IND = "N";
    		}
    	}
	    return aGList;
    },
   	/**
     * Method
     * Handler for the 'select' event of the 'View Selector' Combo Component of the preferences Screen
     * Helps getting the View Meta data of the Selected View. and loads the remaining fields.
     *
     */
    viewSelectionHandler: function(field){
    	var vid = field.getValue();
    	if(this.preView !== vid){
    		this.preView = vid;
	    	var prms = {};
	    	prms.WIDGET_ID = this.currWidget;
	    	prms.VIEW_ID = field.getValue(); 
	    	prms.INPUT_ACTION = 'INIT_VIEW';
	    	prms.__LISTVIEW_REQUEST='';
	    	IMM.initAjaxReq({
	 			params :prms,
	 			scope:this,
	 			successhandler:function(resp,pms){
					var respOb= Ext.decode(resp.responseText);
					var md = respOb.response.value;
					this.widjPrefWin.close();
					this.vMetaData = md;
					this.createWindowAndShow(true);
				 }
 			});	
 		}
    },
    
    /**
     * Method
     * Creates the 'View Selector' Combo Component of the preferences Screen
     * 
     * @returns combo
     */
    createViewSelector: function(){
    	var keys = [],
		 	vals = [],
		 	individualViews;
		for(var index = 0; index < this.viewsList.length; index++){
			individualViews = this.viewsList[index];
			if(individualViews.CUSTOMIZE_IND === 'Y')
			{
				keys.push(individualViews.VIEW_ID);
				if (individualViews.OD_USER_NO ==='-1' &&  individualViews.OD_GCIF ==='-1' )
				{
					vals.push(this.cuserRb[individualViews.VIEW_DISPLAY_NM]);
				} else {
					vals.push(individualViews.VIEW_DISPLAY_NM);
				}
			}
		}
		var combo = new iportal.formelement.ComboBox({
			combundleKey:CRB.getFWBundleKey(),
			id:this.mv_const.SELECT_VIEW,
			includeSelect:false,
			defaultValue:this.vMetaData.VIEW_MD.VIEW_ID,
			fieldLabel:"LBL_SELECT_VIEW",
			listeners: {"select": this.viewSelectionHandler,scope:this},
			rawKeys:keys,
			rawValues:vals,
			mode: 'local'
		});
    	return combo;
    },
    
    /**
     * 
     */
    columnCheckBoxHandler: function(ob,checkStatus){
	    if(Ext.getCmp("SMRY_FILTER_FORM").getForm().findField(this.mv_const.COLUMNS_ORDER_COMBO).isVisible())
	    {
	    	var colsOrder=Ext.getCmp("SMRY_FILTER_FORM").getForm().findField(this.mv_const.COLUMNS_ORDER_COMBO);
			var Record = new Ext.data.Record.create([{name:this.mv_const.COMBO_VALUE_KEY},{name:this.mv_const.COMBO_MSG_KEY}]);
			var RecordPref = Ext.data.Record.create([
							{name: 'key', mapping: 'key'},
							{name: 'value', mapping: 'value'}
						]);
			var _record = null;
			var _recordPref = null;
			var store = colsOrder.view.store;
			/**
			* Getting store of both pref filter dropdowns
			*/
			var filterCombo1Obj = Ext.getCmp("FILTER1_COMBO_PREF_FILTER");
			var filterCombo2Obj = Ext.getCmp("FILTER2_COMBO_PREF_FILTER");
			var sortFldLstObj = Ext.getCmp("SORT_FLD_PREF");
			var filterCombo1Store = filterCombo1Obj.store;
			var filterCombo2Store = filterCombo2Obj.store;
			var sortFldLstStore = sortFldLstObj.store;
			if(checkStatus){
				_record = new Record({
							value:ob.id,
							text:ob.boxLabel
							});
			   /**
				* To be insert into filter1 pref combo box when user select multi checkbox
				*/
				_recordPref = new RecordPref({
										key: ob.id,
										value: ob.boxLabel
				});
				store.insert(store.getCount(),_record);
				
			   /**
				* To be inserted into filter1 and filter2 pref combo box as well
				*/
				filterCombo1Store.insert(filterCombo1Store.getCount(),_recordPref);
				filterCombo2Store.insert(filterCombo2Store.getCount(),_recordPref);
				sortFldLstStore.insert(sortFldLstStore.getCount(),_recordPref);
			}else{
				var index = store.find(this.mv_const.COMBO_VALUE_KEY,ob.id);
				var indexFilter1 = filterCombo1Store.find('key',ob.id);
				var indexFilter2 = filterCombo2Store.find('key',ob.id);
				var indexSortBy = sortFldLstStore.find('key',ob.id);
				if(index!=-1){
					store.remove(store.getAt(index));
				}
				/**
				* To be removed from filter1 and filter2 pref combo box as well
				*/
				if(indexFilter1 != -1){
					filterCombo1Store.remove(filterCombo1Store.getAt(indexFilter1));
					if(ob.boxLabel === this.cuserRb['LBL_'+filterCombo1Obj.getValue()]){
						filterCombo1Obj.setSelect();
						Ext.getCmp("CONSTRAINT1_COM_PREF_FILTER").setSelect();
						Ext.getCmp("FILTER_TEXT1_PREF_FILTER").setValue('');
						Ext.getCmp("FILTER_TEXT1_PREF_FILTER").hide();
						Ext.getCmp("FILTER_DATE1_PREF_FILTER").setValue('');
						Ext.getCmp("FILTER_DATE1_PREF_FILTER").hide();
						Ext.getCmp("FILTER_DATE2_PREF_FILTER").setValue('');
						Ext.getCmp("FILTER_DATE2_PREF_FILTER").hide();
					}
					filterCombo1Store.commitChanges();
				}
				if(indexFilter2 != -1){
					filterCombo2Store.remove(filterCombo2Store.getAt(indexFilter2));
					if(ob.boxLabel === this.cuserRb['LBL_'+filterCombo2Obj.getValue()]){
						filterCombo2Obj.setSelect();
						Ext.getCmp("CONSTRAINT2_COM_PREF_FILTER").setSelect();
						Ext.getCmp("FILTER2_TEXT1_PREF_FILTER").setValue('');
						Ext.getCmp("FILTER2_TEXT1_PREF_FILTER").hide();
						Ext.getCmp("FILTER2_DATE1_PREF_FILTER").setValue('');
						Ext.getCmp("FILTER2_DATE1_PREF_FILTER").hide();
						Ext.getCmp("FILTER2_DATE2_PREF_FILTER").setValue('');
						Ext.getCmp("FILTER2_DATE2_PREF_FILTER").hide();
					}
					filterCombo2Store.commitChanges();
				}
				if(indexSortBy != -1){
					sortFldLstStore.remove(sortFldLstStore.getAt(indexFilter2));
					if(ob.boxLabel === this.cuserRb['LBL_'+sortFldLstObj.getValue()]){
						sortFldLstObj.setSelect();
						Ext.getCmp("SORT_DIREC_PREF").setSelect();
					}
					sortFldLstStore.commitChanges();
				}
				
			}
			if(colsOrder.isVisible())colsOrder.view.refresh();
		}
    },
    /**
     * 
     */
    getcbArray: function(){
    	var cbArray = new Array();
    	var checkFlag = true;
		var cb ={};
		var columnsList = this.vMetaData.VIEW_MD.FLD_COLUMN_LIST;
		for(var index = 0;index<columnsList.length;index++){
			var colid = columnsList[index].FLD_COLUMN_DISPLAY_NAME_KEY;
			var colDataType = columnsList[index].FLD_DATA_TYPE;
			if(colid === 'PRIOR_DAY_EOD_DATE') {
				checkBoxLabel = this.cuserRb["LBL_"+colid];
				if(this.isAccNbrSelected())
				{
				cb = {
							id: colid,
							checked:true,
							boxLabel:checkBoxLabel
							,disabled :true
					};
					cbArray.push(cb);
				}else
				{
				cb = {
							id: colid,
							checked:false,
							boxLabel:checkBoxLabel,
							hidden:true
							,disabled :false
					};
					cbArray.push(cb);
				}
			}
			if(columnsList[index].FLD_HIDDEN_IND === 'N' && colid !== 'CONTEXT' && colid !== 'PRIOR_DAY_EOD_DATE'){
				if(columnsList[index].FLD_VISIBLE_IND === 'Y')
					checkFlag = true;
				else
					checkFlag = false;
				var checkBoxLabel = null;
				if(colDataType != 'eqccy')
				{
					var plusRegexp=/_PLUS$/g;
						if(colid.search(plusRegexp) != '-1')
						{
							colid = colid.substring(0, colid.search(plusRegexp));
						}
						checkBoxLabel = this.cuserRb["LBL_"+colid];
						
				}
				else
					checkBoxLabel = this.cuserRb['LBL_'+colid+'_CCY'];
				if (columnsList[index].FLD_MANDATORY_IND === 'Y'){
					cb = {
							id: colid,
							checked:true,
							boxLabel:checkBoxLabel
							,disabled :true
						};
				}else {
				cb = {
						id: colid,
						checked:checkFlag,
						boxLabel:checkBoxLabel,
						listeners:{'check':this.columnCheckBoxHandler,scope:this} 
					 };
				}
				 cbArray.push(cb);
			}
			
		}
		return cbArray;
    },
    /**
     * 
     */
    columnsIncluded: function(){
		var ccbFieldSet= {
			xtype: 'checkboxgroup',
			cls:'checkboxGroup',
			gradientEffect:false,
			itemCls:'checkLabel',
			labelStyle:'width:133px;padding-left:4px !important;padding-bottom:7px',
			labelSeparator:'',
			id:this.mv_const.COLUMNS_GROUP,
			fieldLabel:this.cuserRb["LBL_COLUMNS_INCLUDE"] ,
			columns:3,
			items: this.getcbArray()
		};	
		return ccbFieldSet;	
    },
    /**
     * 
     */
    getColumnOrderArr: function(){
    	var columnOrderArr = [];
		var columnsList = this.vMetaData.VIEW_MD.FLD_COLUMN_LIST;
		for(index = 0;index<columnsList.length;index++)
		{
			columnId = columnsList[index].FLD_COLUMN_DISPLAY_NAME_KEY;
			var colDataType = columnsList[index].FLD_DATA_TYPE;
			if(columnId !== 'CONTEXT' && columnsList[index].FLD_VISIBLE_IND === 'Y'){
				if(columnsList[index].FLD_POSITION_FIXED_IND !== 'Y'){
						if(colDataType != 'eqccy')
							columnOrderArr.push([columnId,this.cuserRb["LBL_"+columnId]]);
						else
							columnOrderArr.push([columnId,this.cuserRb['LBL_'+columnId+'_CCY']]);
				}
			}
		}
		return columnOrderArr;
    },
    
    /**
     * 
     */
    moveUpHandler: function() {
		var record = null;
		var objUp=Ext.getCmp("SMRY_FILTER_FORM").getForm().findField(this.mv_const.COLUMNS_ORDER_COMBO);
		var selectionsArray = objUp.view.getSelectedIndexes();
		selectionsArray.sort();
		var newSelectionsArray = [];
		if (selectionsArray.length > 0) {
			for (var i=0; i<selectionsArray.length; i++) {
				record = objUp.view.store.getAt(selectionsArray[i]);
				if ((selectionsArray[i] - 1) >= 0) {
					objUp.view.store.remove(record);
					objUp.view.store.insert(selectionsArray[i] - 1, record);
					newSelectionsArray.push(selectionsArray[i] - 1);
				}
			}
			objUp.view.refresh();
			objUp.view.select(newSelectionsArray);
		}
	},
	/**
	 * 
	 */
	moveDownHandler: function(){
		var record = null;
		var objDown=Ext.getCmp("SMRY_FILTER_FORM").getForm().findField(this.mv_const.COLUMNS_ORDER_COMBO);
		var selectionsArray = objDown.view.getSelectedIndexes();
		selectionsArray.sort();
		selectionsArray.reverse();
		var newSelectionsArray = [];
		if (selectionsArray.length > 0) {
			for (var i=0; i<selectionsArray.length; i++) {
				record = objDown.view.store.getAt(selectionsArray[i]);
				if ((selectionsArray[i] + 1) < objDown.view.store.getCount()) {
					objDown.view.store.remove(record);
					
					objDown.view.store.insert(selectionsArray[i] + 1, record);
					newSelectionsArray.push(selectionsArray[i] + 1);
				}
			}
			objDown.view.refresh();
			objDown.view.select(newSelectionsArray);
		}
	},
	/**
	 * 
	 */
    createColumnOrder: function(){
    	var multiSelect = {
			xtype:"multiselect",
			cls:"multi-select", 
			border:true,
			labelSeparator:'',
			hidden: (this.vMetaData.VIEW_MD.FLD_COL_ORDER_IND === "N")?true:false,
			name:this.mv_const.COLUMNS_ORDER_COMBO,
			id:this.mv_const.COLUMNS_ORDER_COMBO,
			dataFields:[this.mv_const.COMBO_VALUE_KEY,this.mv_const.COMBO_MSG_KEY ],
			valueField:this.mv_const.COMBO_VALUE_KEY,
			displayField:this.mv_const.COMBO_MSG_KEY,
			store:this.getColumnOrderArr(),		
			width:177,
			height:155
		};
		var columnsOrder = {
			border:false,
			//cls:'gradientImageCls',
			hidden: (this.vMetaData.VIEW_MD.FLD_COL_ORDER_IND === "N")?true:false,
			layout : 'column',
			items:[{  
					columnWidth:.445,
					layout:'table',
					//cls:'gradientImageCls',
					border:false,
					items:[{
						xtype:'label',
						ctCls:'multi-select-label',
						cls:'fontBold',
						text:this.cuserRb["LBL_COLUMNS_ORDER"]},
						    multiSelect
					    ]								
					},{  
						columnWidth:.2,
						layout:'form',
						bodyStyle:'padding-top:60px',
						border:false,
						items:[{
							xtype:'button',
							id: 'IMG_UPBUTTON',
							iconCls: 'imgMoveUp',
							handler:this.moveUpHandler,scope:this
						   },{
							xtype:'button',
							id: 'IMG_DOWNBUTTON',
							iconCls: 'imgMoveDown',
							handler:this.moveDownHandler,scope:this
						   }]																								
				}
				]
		};
	return columnsOrder;
    },
    createLastColHand: function(){
    	var lastColumnCombo = new iportal.formelement.ComboBox({
			combundleKey:CRB.getFWBundleKey(),
			id:this.mv_const.LAST_COL,
			hideLabel: (this.vMetaData.VIEW_MD.ADDN_PREFS[0].PREF_LST_COL_MTHD_IND === "N")?true:false,
			hidden: (this.vMetaData.VIEW_MD.ADDN_PREFS[0].PREF_LST_COL_MTHD_IND === "N")?true:false,
			includeSelect:false,
			defaultValue:this.vMetaData.VIEW_MD.ADDN_PREFS[0].PREF_LST_COL_MTHD,
			fieldLabel:"LBL_LAST_COL",
			rawKeys:["INCLUSIVE", "EXCLUSIVE"],
			rawValues:[this.cuserRb['LBL_INCLUSIVE'],this.cuserRb['LBL_EXCLUSIVE']],
			mode: 'local'
		});
		return lastColumnCombo;
    },
    getLeftMultiSelectArr: function(){
    	var leftMultiSelectArr = [];
		var columnsList = this.vMetaData.VIEW_MD.FLD_COLUMN_LIST;
		for(index = 0;index<columnsList.length;index++)
		{
			columnId = columnsList[index].FLD_COLUMN_DISPLAY_NAME_KEY;
			var colDataType = columnsList[index].FLD_DATA_TYPE;
			if(columnId !== 'CONTEXT'){
				if(columnsList[index].FLD_GROUPABLE_IND === "Y"){
					if(columnsList[index].FLD_GROUPED_IND === "N"){
						if(colDataType != 'eqccy')
						{
							leftMultiSelectArr.push([columnId,this.cuserRb["LBL_"+columnId], columnsList[index].FLD_POS_IN_GROUP]);
						} else {
							leftMultiSelectArr.push([columnId,this.cuserRb["LBL_"+columnId+"_CCY"], columnsList[index].FLD_POS_IN_GROUP]);
						}
					}
				}
			}
		}
		return leftMultiSelectArr;
    },
    getRightMultiSelectArr: function(){
 		var rightMultiSelectArr = [];
		var columnsList = this.vMetaData.VIEW_MD.FLD_COLUMN_LIST;
		for(index = 0;index<columnsList.length;index++)
		{
			columnId = columnsList[index].FLD_COLUMN_DISPLAY_NAME_KEY;
			var colDataType = columnsList[index].FLD_DATA_TYPE;
			if(columnId !== 'CONTEXT'){
				if(columnsList[index].FLD_GROUPABLE_IND === "Y"){
					if(columnsList[index].FLD_GROUPED_IND === "Y"){
						if(colDataType != 'eqccy')
						{
							rightMultiSelectArr.push([columnId,this.cuserRb["LBL_"+columnId], columnsList[index].FLD_POS_IN_GROUP]);
						}else {
							rightMultiSelectArr.push([columnId,this.cuserRb["LBL_"+columnId+"_CCY"], columnsList[index].FLD_POS_IN_GROUP]);
						}
					}
				}
			}
		}
		function sortByPosition(a,b)
		{
			var x = +a[2];
			var y = +b[2];
			return x - y;
		}
		rightMultiSelectArr.sort(sortByPosition);
		return rightMultiSelectArr;
    },
    /*
    	Helper Method returns the 
    */
    getRelativePosition : function(col){
    	var columnsList = this.vMetaData.VIEW_MD.FLD_COLUMN_LIST;
    	for(var index = 0;index<columnsList.length;index++){
			  var column = columnsList[index];
			   if(column.FLD_COLUMN_DISPLAY_NAME_KEY === col){
			   			return column.FLD_REL_POS_IN_GROUP;
			   			//return this.getExactPosition(column.FLD_REL_POS_IN_GROUP);
			   } 	
    	}
    	return "";
    },
    /*
    	Helper Method returns the 
    */
    getMandatoryIndicator: function(col){
    	var columnsList = this.vMetaData.VIEW_MD.FLD_COLUMN_LIST;
    	for(var index = 0;index<columnsList.length;index++){
			  var column = columnsList[index];
			   if(column.FLD_COLUMN_DISPLAY_NAME_KEY === col){
			   			return column.FLD_MAND_GROUP_IND;
			   } 	
    	}
    	return "";
    },
    getExactPosition :function(position){
    	var arr = position.split("_",2);
    	return arr[0];
    },
    getRelativeField: function(position){
    	var arr = position.split("_",2);
    	return arr[1];
    },
    /*
    	Interceptor Method for the Item selectors 'Up' Method triggers Up Method only if this returns true.
    	Helps handling the Relative Position handling of the Group By fields
    */
    beforeMoveUp: function(){
    	var itemSe = Ext.getCmp(this.mv_const.GROUP_BY);
    	var sArr = itemSe.toMultiselect.view.getSelectedIndexes();
    	var store = itemSe.toMultiselect.view.store;
    	if(sArr.length>0){
	    	var record = store.getAt(sArr[0]);
	    	var currCol = record.data.value;
	    	if (sArr[0] === 0)
	    		{
	    		return false;
	    		}
	    	var prevCol = store.getAt(sArr[0]-1).data.value
	    	var position = this.getRelativePosition(currCol);
	    	var prevPosition = this.getRelativePosition(prevCol);
	    	//if(!Ext.isEmpty(position)){
	    		if(prevPosition === "FIRST"){
	    			return false;
	    		}
	    		else if(position==="LAST"){
					itemSe.toBottom();
					return false;	
	    		}
	    		else if(position==='AFTER_'+prevCol){
	    			return false;
	    		}else
	    		{
	    		return true;
	    		}
	    	//}
    	}else
    	return true;
    },
    
    /*
    	Interceptor Method for the Item selectors 'Down' Method triggers Down Method only if this returns true.
    	Helps handling the Relative Position handling of the Group By fields
    */
    beforeMoveDown: function(){
        var itemSe = Ext.getCmp(this.mv_const.GROUP_BY);
    	var sArr = itemSe.toMultiselect.view.getSelectedIndexes();
    	var store = itemSe.toMultiselect.view.store;
    	if(sArr.length>0){
	    	var record = store.getAt(sArr[0]);
	    	var noOfRecs = store.getCount()
	    	var currCol = record.data.value;
	    	if (sArr[0] === noOfRecs-1)
	    		{
	    		return false;
	    		}
	    	var nextCol = store.getAt(sArr[0]+1).data.value
	    	var position = this.getRelativePosition(currCol);
	    	var nextPosition = this.getRelativePosition(nextCol);
	    	//if(!Ext.isEmpty(position)){
	    		if(nextPosition==="LAST"){
					return false;	
	    		}
	    		else if(position==="FIRST"){
					itemSe.toTop();
					return false;	
	    		}
	    		else if(position==='BEFORE_'+nextCol){
	    			return false;
	    		}else{
	    			return true;
	    		}
	    	//}
    	}else
    	return true;
    },
    tempfix: function(){
    	Ext.getCmp(this.mv_const.COLUMNS_GROUP).show();
    },
    
    beforeMoveLeft: function(){
    	var itemSe = Ext.getCmp(this.mv_const.GROUP_BY);
    	var sArr = itemSe.toMultiselect.view.getSelectedIndexes();
    	var store = itemSe.toMultiselect.view.store;
    	if(sArr.length>0){
    		var record = store.getAt(sArr[0]);
    		var currCol = record.data.value;
    		var mandatoryInd = this.getMandatoryIndicator(currCol);
    		if (mandatoryInd === "Y")
    		{
    			return false;
    		}
    	}
    	if(currCol === "ACC_GR_NAME"){
    		Ext.getCmp(this.mv_const.ACCOUNT_GRP).hide();    		
    		Ext.getCmp(this.mv_const.ACCOUNT_GRP).label.hide();
    		//this.tempfix.defer(50,this);
    	}
    	if(currCol === "ACCT_NBR"){
    		if(Ext.getCmp(this.mv_const.COLUMNS_GROUP).items.containsKey("PRIOR_DAY_EOD_DATE"))
    		{
    			Ext.getCmp("PRIOR_DAY_EOD_DATE").enable();
    			Ext.getCmp("PRIOR_DAY_EOD_DATE").setValue(false);
    			Ext.getCmp("PRIOR_DAY_EOD_DATE").hide();
    		}
    	}
    	
    	return true;
    },
    beforeMoveRight: function(){
    	var itemSe = Ext.getCmp(this.mv_const.GROUP_BY);
    	var sArr = itemSe.fromMultiselect.view.getSelectedIndexes();
    	var fromStore = itemSe.fromMultiselect.view.store;
    	var toStore = itemSe.toMultiselect.view.store;
    	if(sArr.length>0){
    		var fromRecord = fromStore.getAt(sArr[0]);
    		var currCol = fromRecord.data.value;
    		if(currCol === "ACC_GR_NAME")
    		{
    				Ext.getCmp(this.mv_const.ACCOUNT_GRP).show();
    				Ext.getCmp(this.mv_const.ACCOUNT_GRP).label.show();
    				//this.tempfix.defer(50,this);
    		}
    		if(currCol === "ACCT_NBR"){
    			if(Ext.getCmp(this.mv_const.COLUMNS_GROUP).items.containsKey("PRIOR_DAY_EOD_DATE"))
    			{
    				Ext.getCmp("PRIOR_DAY_EOD_DATE").setValue(true);
    				Ext.getCmp("PRIOR_DAY_EOD_DATE").show();
    				Ext.getCmp("PRIOR_DAY_EOD_DATE").disable();
    			}
    		}
    		var position = this.getRelativePosition(currCol);
    		var noOfRecs = toStore.getCount()
    		if(noOfRecs > 0){
    			if(position==="LAST"){
    				itemSe.fromTo();
    				itemSe.toBottom();
					return false;	
	    		}
	    		else if(position==="FIRST"){
	    			itemSe.fromTo();
	    			itemSe.toTop();
					return false;	
	    		}else{
    				for(var i = noOfRecs-1 ; i >= 0 ; i--){
    					toRecord = toStore.getAt(i);
    					ithCol = toRecord.data.value;
    					var ithPosition = this.getExactPosition(this.getRelativePosition(ithCol));
    					if(ithPosition === "LAST")
    					{
    						itemSe.fromTo();
    						itemSe.up();
    					}else {
	    					if(position === "AFTER_"+ithCol){
	    						fromStore.remove(fromRecord);
	    						toStore.insert(i+1, fromRecord);
	    					}else if(position === "BEFORE_"+ithCol){
	    						fromStore.remove(fromRecord);
	    						toStore.insert(i, fromRecord);
	    					}
    					}
    				}
    			}
    		}else
    		return true;
    		
    	}else    
    	return true;
    },
    groupByValChng:function(cmp, val, hidVal){
	    //alert("cmp : " + cmp);
	    //alert("val : " + val);
	    //alert("hidVal : " + hidVal);
    },
    groupByItemSelect: function(){
		
		var itemSelector = new Ext.ux.form.ItemSelector({
			id: this.mv_const.GROUP_BY,
			//cls:'gradientImageCls',
			//width:'auto',
			drawTopIcon:false,
    		drawBotIcon:false,
            name: this.mv_const.GROUP_BY,
            labelStyle:'padding-left:4px !important;padding-top:8px;',
            fieldLabel: this.cuserRb['LBL_GROUP_BY'],
            hidden: (this.vMetaData.VIEW_MD.FLD_GROUPED_IND === "N")?true:false,
            hideLabel : (this.vMetaData.VIEW_MD.FLD_GROUPED_IND === "N")?true:false,		
	        imagePath: '/iportalweb/iportal/images/iportal-images/itemselector/customer/',
	        labelSeparator: '',
	        listeners: {'change' : this.groupByValChng},
	        beforeUp: this.beforeMoveUp.createDelegate(this),
	        beforeDown: this.beforeMoveDown.createDelegate(this),
	        beforefromTo: this.beforeMoveRight.createDelegate(this),
	        beforetoFrom: this.beforeMoveLeft.createDelegate(this),
            multiselects: [{
                width: 177,
                height: 155,
                cls:"multi-select",                 
				border:true,
				multiSelect:false,
				singleSelect:true,
				minSelections:0,
				maxSelections:1,
                store: this.getLeftMultiSelectArr(),
                draggable: false,
                droppable: false,
                displayField: 'text',
                valueField: 'value'
            },{
                width: 177,
                height: 155,
                cls:"multi-select", 
                draggable: false,
                multiSelect:false,
                singleSelect:true,
                droppable: false,
				border:true,
				minSelections:0,
				maxSelections:1,
                store: this.getRightMultiSelectArr(),
                displayField: 'text',
                valueField: 'value'
            }]
		});
		return itemSelector;
    },
    getAGLeftMultiSelectArr: function(){
    	var leftMultiSelectArr = [];
		var accGroupList = this.actualAccGrpList;
		var accGroupId = "";
		var accGroupName = "";
		for(index = 0;index<accGroupList.length;index++)
		{
			accGroupId = accGroupList[index].ACC_GR_ID;
			accGroupName = accGroupList[index].ACC_GR_NAME;
			if(accGroupList[index].ACC_GRP_SEL_IND === "N")
			{ 
				leftMultiSelectArr.push([accGroupId, accGroupName, index]);
			}
		}
		return leftMultiSelectArr;
    },
    getAGRightMultiSelectArr: function(){
    	var rightMultiSelectArr = [];
		var accGroupList = this.actualAccGrpList;
		var accGroupId = "";
		var accGroupName = "";
		for(index = 0;index<accGroupList.length;index++)
		{
			accGroupId = accGroupList[index].ACC_GR_ID;
			accGroupName = accGroupList[index].ACC_GR_NAME;
			if(accGroupList[index].ACC_GRP_SEL_IND === "Y")
			{ 
				rightMultiSelectArr.push([accGroupId, accGroupName, index]);
			}
		}
		return rightMultiSelectArr;
    },
    isAccGrpNotSelected: function(){
    	var columnsList = this.vMetaData.VIEW_MD.FLD_COLUMN_LIST;
    	for(var index = 0;index<columnsList.length;index++){
			  var column = columnsList[index];
			   if(column.FLD_COLUMN_ID === "ACC_GR_NAME"){
			   		if(column.FLD_GROUPED_IND === "Y")
			   			return false;
			   		else
			   			return true;
			   }
    	}
    	return true;
    },
    isAccNbrSelected: function(){
    	var columnsList = this.vMetaData.VIEW_MD.FLD_COLUMN_LIST;
    	for(var index = 0;index<columnsList.length;index++){
			  var column = columnsList[index];
			   if(column.FLD_COLUMN_ID === "ACCT_NBR"){
			   		if(column.FLD_GROUPED_IND === "Y")
			   			return true;
			   		else
			   			return false;
			   }
    	}
    	return false;
    },
    AGbeforeMoveLeft: function(){
    	var itemSe = Ext.getCmp(this.mv_const.ACCOUNT_GRP);
    	var sArr = itemSe.toMultiselect.view.getSelectedIndexes();
    	var store = itemSe.toMultiselect.view.store;
    	if(sArr.length === store.getCount())
    		return false;
    	else
    		return true;
    },
    accGrpItemSelect: function(){
		
		var accItemSelector = new Ext.ux.form.ItemSelector({
			id: this.mv_const.ACCOUNT_GRP,
			//cls:'gradientImageCls',
			//width:'auto',
			drawUpIcon:false,
    		drawDownIcon:false,
    		drawTopIcon:false,
    		drawBotIcon:false,
            name: this.mv_const.ACCOUNT_GRP,
            labelStyle:'padding-left:4px !important;padding-top:8px;',
            fieldLabel: this.cuserRb['LBL_ACCOUNT_GRP'],
            hidden: this.isAccGrpNotSelected(),
            hideLabel : this.isAccGrpNotSelected(),	
            beforetoFrom: this.AGbeforeMoveLeft.createDelegate(this),	
	        imagePath: '/iportalweb/iportal/images/iportal-images/itemselector/customer/',
	        labelSeparator: '',
            multiselects: [{
                width: 177,
                height: 155,
                cls:"multi-select",                 
				border:true,
				multiSelect:true,
				singleSelect:false,
				//minSelections:0,
				//maxSelections:1,
                store: this.getAGLeftMultiSelectArr(),
                draggable: false,
                droppable: false,
                displayField: 'text',
                valueField: 'value'
            },{
                width: 177,
                height: 155,
                cls:"multi-select", 
                draggable: false,
                multiSelect:true,
                singleSelect:false,
                droppable: false,
				border:true,
				//minSelections:0,
				//maxSelections:1,
                //store: this.getRightMultiSelectArr(),
                store: this.getAGRightMultiSelectArr(),
                displayField: 'text',
                valueField: 'value'
            }]
		});
		return accItemSelector;
    },
    createPrefFilterForm: function(){
		var fieldDataType = [];
		var filterKey = [];
		var filterValue = [];
		var columnsList = this.vMetaData.VIEW_MD.FLD_COLUMN_LIST;
		for(index = 0;index<columnsList.length;index++)
		{
			columnId = columnsList[index].FLD_COLUMN_DISPLAY_NAME_KEY;
			var colDataType = columnsList[index].FLD_DATA_TYPE;
			if(columnId !== 'CONTEXT' && columnsList[index].FLD_VISIBLE_IND === 'Y'){
				filterKey.push(columnId);
				if(colDataType != 'eqccy')
					filterValue.push(this.cuserRb["LBL_"+columnId]);
				else
					filterValue.push(this.cuserRb['LBL_'+columnId+'_CCY']);
				fieldDataType.push(columnsList[index].FLD_DATA_TYPE);
			}
			
		}
		
		
		
		/*
		 * Constraints combo to display for filter1
		 */
		var filter1StrCombo = {
				xtype:'iportal-combobox',
				cls : 'x-form-combo',
				ctCls:'padRight',
				id:'CONSTRAINT1_COM_PREF_FILTER',
				combundleKey:CRB.getFWBundleKey(),
				rawKeys:[],
				rawValues:[],
				mode: 'local',
				listeners: {"select":constraint1ComboHandler }
			};
			
		/*
		 * Constraints combo to display for filter2
		 */
		var filter2StrCombo ={
			xtype:'iportal-combobox',
			cls : 'x-form-combo',
			ctCls:'padRight',
			id:'CONSTRAINT2_COM_PREF_FILTER',
			combundleKey:CRB.getFWBundleKey(),
			rawKeys:[],
			rawValues:[],
			mode: 'local',
			listeners: {"select":constraint2ComboHandler }
		};
		/*
		 * If range is selected in contraint filter combo to select date range one more date 
		 * selection box need to display
		 */
		function constraint2ComboHandler(obj){
			if(obj.value === 'range'){
				Ext.getCmp("FILTER2_DATE2_PREF_FILTER").setValue('');
				Ext.getCmp("FILTER2_DATE2_PREF_FILTER").show();
			}
			else{
				Ext.getCmp("FILTER2_DATE2_PREF_FILTER").setValue('');
				Ext.getCmp("FILTER2_DATE2_PREF_FILTER").hide();
			}
		}
		/*
		 * If range is selected in contraint filter combo to select date range one more date 
		 * selection box need to display
		 */
		function constraint1ComboHandler(obj){
			if(obj.value === 'range'){
				Ext.getCmp("FILTER_DATE2_PREF_FILTER").setValue('');
				Ext.getCmp("FILTER_DATE2_PREF_FILTER").show();
			}
			else{
				Ext.getCmp("FILTER_DATE2_PREF_FILTER").setValue('');
				Ext.getCmp("FILTER_DATE2_PREF_FILTER").hide();
			}
		}
		/*
		 * Method to invoke on change of Filter Combo one
		 */
		var prefFilter1ComboHandler = function(obj,record,index){
			if(Ext.util.Format.trim(obj.value) !== ''){
				var dataStringCode = ['strEquals','startsWith','endsWith','contains'];
				var dataStringValue = [this.cuserRb["LBL_strEquals"],this.cuserRb["LBL_startsWith"],this.cuserRb["LBL_endsWith"],this.cuserRb["LBL_contains"]];
				var dataNumCode = ['=','>','>=','<','<=','<>'];
				var dataNumValue = ['=','>','>=','<','<=','!='];
				var dataDateCode = ['dtEquals','range'];
				var dataDateValue = [this.cuserRb["LBL_SINGLE"],this.cuserRb["LBL_RANGE"]];
				
				var columnType = Ext.util.Format.uppercase(fieldDataType[index-1]);
				if(columnType === 'UNDEFINED'){
					columnType = record;
				}
				var colId = obj.value;
				if((colId+'').endsWith('_AMT')){
					columnType = this.lvc_const.FLOAT;
				}
				else if((colId+'').endsWith('_DT')){
					columnType = this.lvc_const.DATE;
				}
				else{
					columnType = this.lvc_const.STRING;
				}
				//var formob = Ext.getCmp("SMRY_FILTER_FORM").getForm();
				//var filterCon = formob.findField("CONSTRAINT1_COM_PREF_FILTER");	
				//var conCombstore = filterCon.store;											
				var dateType=false;
				if(columnType === this.lvc_const.STRING){
					Ext.getCmp("FILTER_TEXT1_PREF_FILTER").setValue('');
					Ext.getCmp("FILTER_TEXT1_PREF_FILTER").show();
					Ext.getCmp("FILTER_DATE1_PREF_FILTER").hide();
					Ext.getCmp("FILTER_DATE2_PREF_FILTER").hide();
					Ext.getCmp("CONSTRAINT1_COM_PREF_FILTER").updateComboNoWrapRawStore(dataStringCode,dataStringValue);
					
				}else if(columnType === this.lvc_const.DATE){
					Ext.getCmp("FILTER_TEXT1_PREF_FILTER").hide();
					Ext.getCmp("FILTER_DATE1_PREF_FILTER").setValue('');
					Ext.getCmp("FILTER_DATE2_PREF_FILTER").setValue('');
					Ext.getCmp("FILTER_DATE1_PREF_FILTER").show();
					Ext.getCmp("FILTER_DATE2_PREF_FILTER").hide();
					Ext.getCmp("CONSTRAINT1_COM_PREF_FILTER").updateComboNoWrapRawStore(dataDateCode,dataDateValue);
					dateType=true;
					//needs to show date field and hide text field												
				}else if(columnType === this.lvc_const.INT || columnType ===this.lvc_const.FLOAT){
					Ext.getCmp("FILTER_TEXT1_PREF_FILTER").setValue('');
					Ext.getCmp("FILTER_TEXT1_PREF_FILTER").show();
					Ext.getCmp("FILTER_DATE1_PREF_FILTER").hide();
					Ext.getCmp("FILTER_DATE2_PREF_FILTER").hide();
					Ext.getCmp("CONSTRAINT1_COM_PREF_FILTER").updateComboNoWrapRawStore(dataNumCode,dataNumValue);
				}else if(columnType === this.lvc_const.BOOLEAN){
					// DO NOTHING -  its just place holder for boolean type
				}
			}
			else{
				Ext.getCmp("CONSTRAINT1_COM_PREF_FILTER").updateComboNoWrapRawStore([''],['']);
				// To set Select as selected value
				Ext.getCmp("CONSTRAINT1_COM_PREF_FILTER").forceSelect();
				Ext.getCmp("FILTER_TEXT1_PREF_FILTER").hide();
				Ext.getCmp("FILTER_TEXT1_PREF_FILTER").setValue('');
				Ext.getCmp("FILTER_DATE1_PREF_FILTER").hide();
				Ext.getCmp("FILTER_DATE1_PREF_FILTER").setValue('');
				Ext.getCmp("FILTER_DATE2_PREF_FILTER").hide();
				Ext.getCmp("FILTER_DATE2_PREF_FILTER").setValue('');
			}
				
		};
		
		/*
		 * Method to invoke on change of Filter Combo two
		 */
		
		var prefFilter2ComboHandler = function(obj,record,index){
			if(Ext.util.Format.trim(obj.value) !== ''){
				var dataStringCode = ['strEquals','startsWith','endsWith','contains'];
				var dataStringValue = [this.cuserRb["LBL_strEquals"],this.cuserRb["LBL_startsWith"],this.cuserRb["LBL_endsWith"],this.cuserRb["LBL_contains"]];
				var dataNumCode = ['=','>','>=','<','<=','<>'];
				var dataNumValue = ['=','>','>=','<','<=','!='];
				var dataDateCode = ['dtEquals','range'];
				var dataDateValue = [this.cuserRb["LBL_SINGLE"],this.cuserRb["LBL_RANGE"]];
						
				
				var columnType = Ext.util.Format.uppercase(fieldDataType[index-1]);
				if(columnType === 'UNDEFINED'){
					columnType = record;
				}
				//var formob = Ext.getCmp("SMRY_FILTER_FORM").getForm();
				//var filterCon = formob.findField("CONSTRAINT2_COM_PREF_FILTER");	
				var dateType=false;		
				var colId = obj.value;
				if((colId+'').endsWith('_AMT')){
					columnType = this.lvc_const.FLOAT;
				}
				else if((colId+'').endsWith('_DT')){
					columnType = this.lvc_const.DATE;
				}
				else{
					columnType = this.lvc_const.STRING;
				}
				
				if(columnType === this.lvc_const.STRING){
					Ext.getCmp("FILTER2_TEXT1_PREF_FILTER").setValue('');
					Ext.getCmp("FILTER2_TEXT1_PREF_FILTER").show();
					Ext.getCmp("FILTER2_DATE1_PREF_FILTER").hide();
					Ext.getCmp("FILTER2_DATE2_PREF_FILTER").hide();
					Ext.getCmp("CONSTRAINT2_COM_PREF_FILTER").updateComboNoWrapRawStore(dataStringCode,dataStringValue);
				}else if(columnType === this.lvc_const.DATE){
					Ext.getCmp("FILTER2_TEXT1_PREF_FILTER").hide();
					Ext.getCmp("FILTER2_DATE1_PREF_FILTER").setValue('');
					Ext.getCmp("FILTER2_DATE2_PREF_FILTER").setValue('');
					Ext.getCmp("FILTER2_DATE1_PREF_FILTER").show();
					Ext.getCmp("FILTER2_DATE2_PREF_FILTER").hide();
					Ext.getCmp("CONSTRAINT2_COM_PREF_FILTER").updateComboNoWrapRawStore(dataDateCode,dataDateValue);
					dateType=true;											
				}else if(columnType ===this.lvc_const.INT || columnType ===this.lvc_const.FLOAT){
					Ext.getCmp("FILTER2_TEXT1_PREF_FILTER").setValue('');
					Ext.getCmp("FILTER2_TEXT1_PREF_FILTER").show();
					Ext.getCmp("FILTER2_DATE1_PREF_FILTER").hide();
					Ext.getCmp("FILTER2_DATE2_PREF_FILTER").hide();
					Ext.getCmp("CONSTRAINT2_COM_PREF_FILTER").updateComboNoWrapRawStore(dataNumCode,dataNumValue);
				}else if(columnType ===this.lvc_const.BOOLEAN){
					// DO NOTHING -  its just place holder for boolean type
				}
			}
			else{
				Ext.getCmp("CONSTRAINT2_COM_PREF_FILTER").updateComboNoWrapRawStore([''],['']);
				// To set Select as selected value
				Ext.getCmp("CONSTRAINT2_COM_PREF_FILTER").forceSelect();
				Ext.getCmp("FILTER2_TEXT1_PREF_FILTER").hide();
				Ext.getCmp("FILTER2_TEXT1_PREF_FILTER").setValue('');
				Ext.getCmp("FILTER2_DATE1_PREF_FILTER").hide();
				Ext.getCmp("FILTER2_DATE1_PREF_FILTER").setValue('');
				Ext.getCmp("FILTER2_DATE2_PREF_FILTER").hide();
				Ext.getCmp("FILTER2_DATE2_PREF_FILTER").setValue('');
			}
		
		};
		
		var filter1Combo = { 
			xtype:'iportal-combobox',
			cls : 'x-form-combo',
			ctCls:'padRight',
			combundleKey:CRB.getFWBundleKey(),
			rawKeys:filterKey,
			//replaceEntityReference:true,
			rawValues:filterValue,
			id:'FILTER1_COMBO_PREF_FILTER',
			mode: 'local',
			listeners: {"select":prefFilter1ComboHandler,scope:this}
		};
		var filter2Combo = {
			xtype:'iportal-combobox',
			cls : 'x-form-combo',
			ctCls:'padRight',
			//replaceEntityReference:true,
			combundleKey:CRB.getFWBundleKey(),
			rawKeys:filterKey,
			rawValues:filterValue,
			id:'FILTER2_COMBO_PREF_FILTER',
			mode: 'local',
			listeners: {"select":prefFilter2ComboHandler,scope:this }
		};
		var filter1text = {xtype:'textfield',/*emptyText:'Enter value',*/id:'FILTER_TEXT1_PREF_FILTER',width:100,hidden:true};		
		var filter1date1 = {xtype:'iportal-datefield',bundleKey : CRB.getFWBundleKey(),ctCls:'padRight',submitFormat:canvas.datePreferences.getDateFormat(),/*emptyText:'Select Date',*/id:'FILTER_DATE1_PREF_FILTER',width:90,hidden:true};
		var filter1date2 = {xtype:'iportal-datefield',bundleKey : CRB.getFWBundleKey(),submitFormat:canvas.datePreferences.getDateFormat(),/*emptyText:'Select Date',*/id:'FILTER_DATE2_PREF_FILTER',width:90,hidden:true};
	
		var filter2text = {xtype:'textfield',/*emptyText:'Enter value',*/id:'FILTER2_TEXT1_PREF_FILTER',width:100,hidden:true};
		var filter2date1 ={xtype:'iportal-datefield',bundleKey : CRB.getFWBundleKey(),ctCls:'padRight',submitFormat:canvas.datePreferences.getDateFormat(),/*emptyText:'Select Date',*/id:'FILTER2_DATE1_PREF_FILTER',width:90,hidden:true};
		var filter2date2 ={xtype:'iportal-datefield',bundleKey : CRB.getFWBundleKey(),submitFormat:canvas.datePreferences.getDateFormat(),/*emptyText:'Select Date',*/id:'FILTER2_DATE2_PREF_FILTER',width:90,hidden:true};
		var filterOneFldSet = new Ext.form.FieldSet({
				colspan:4,
				collapsed :false,
				gradientEffect:false,
				cls:'filterSpace',
				autoHeight :true,
				layout:'table',
				layoutConfig: {columns: 4},
				items:[
						{
							xtype:'label',
							ctCls:'filter-label',
							cls:'fontBold',
							text:this.cuserRb['LBL_FILTER_ONE']
						},filter1Combo,
						{xtype:'panel',border:false,layout:'table',layoutConfig:{columns:3},items:[filter1StrCombo]},
						{xtype:'panel',border:false,layout:'table',layoutConfig:{columns:3},items:[filter1text,filter1date1,filter1date2]}
					  ]
				});
		var filterTwoFldSet = new Ext.form.FieldSet({
			colspan:4,
			collapsed :false,
			gradientEffect:false,
			cls:'filterSpace',
			autoHeight :true,
			layout:'table',
			layoutConfig: {columns: 4},
			items:[
					{
						xtype:'label',
						ctCls:'filter-label',
						cls:'fontBold',
						text:this.cuserRb['LBL_FILTER_TWO']
					},filter2Combo,
					{xtype:'panel',border:false,layout:'table',layoutConfig:{columns:3},items:[filter2StrCombo]},	
					{xtype:'panel',border:false,layout:'table',layoutConfig:{columns:3},items:[filter2text,filter2date1,filter2date2]}
				  ]
			});    
    
    
    	var prefFilterForm = {
				layout:'form',
				border:false,
				hidden: (this.vMetaData.VIEW_MD.FLD_FILTER_IND === "N")?true:false,
				//width:'auto',
				cls:'filterPref',
				layoutConfig: {
					columns: 4
				},
				items: [
				        	filterOneFldSet,filterTwoFldSet
				]
		};
		return prefFilterForm;
    },
    
    defaultSortFld : function(){
    	var defColDispKey = " ";
    	var columnsList = this.vMetaData.VIEW_MD.FLD_COLUMN_LIST;
		for(index = 0;index<columnsList.length;index++)
		{
			var columnId = columnsList[index].FLD_COLUMN_DISPLAY_NAME_KEY;
			var colDataType = columnsList[index].FLD_DATA_TYPE;
			if(columnId !== 'CONTEXT'){
				if(columnsList[index].FLD_HIDDEN_IND === "N"){
					if(columnsList[index].FLD_SORTABLE_IND === "Y"){
						if(columnsList[index].FLD_SORT_ORDER !== "")
						{
							if(colDataType != 'eqccy')
							{
								defColDispKey = columnId;
							} else {
								defColDispKey = columnId+"_CCY";
							}
						}
					}
				}
			}
		}
    	return defColDispKey;
    },
    
    defaultSortDirec : function(){
    	var defSortDirec = " ";
    	var columnsList = this.vMetaData.VIEW_MD.FLD_COLUMN_LIST;
		for(index = 0;index<columnsList.length;index++)
		{
			var columnId = columnsList[index].FLD_COLUMN_DISPLAY_NAME_KEY;
			var colDataType = columnsList[index].FLD_DATA_TYPE;
			if(columnId !== 'CONTEXT'){
				if(columnsList[index].FLD_HIDDEN_IND === "N"){
					if(columnsList[index].FLD_SORTABLE_IND === "Y"){
						if(columnsList[index].FLD_SORT_ORDER !== "")
						{
							defSortDirec = columnsList[index].FLD_SORT_ORDER
						}
					}
				}
			}
		}
    	return defSortDirec;
    },
    createSortByField : function(){
    
    	var sortFlsKey = [];
		var sortFlsValue = [];
		var columnsList = this.vMetaData.VIEW_MD.FLD_COLUMN_LIST;
		for(index = 0;index<columnsList.length;index++)
		{
			columnId = columnsList[index].FLD_COLUMN_DISPLAY_NAME_KEY;
			var colDataType = columnsList[index].FLD_DATA_TYPE;
			if(columnId !== 'CONTEXT' && columnsList[index].FLD_VISIBLE_IND === 'Y'){
				sortFlsKey.push(columnId);
				if(colDataType != 'eqccy')
					sortFlsValue.push(this.cuserRb["LBL_"+columnId]);
				else
					sortFlsValue.push(this.cuserRb['LBL_'+columnId+'_CCY']);
			}
			
		}
    
    var sortChngHandler = function(combo, record, index){
    	if(index == 0){
    		Ext.getCmp("SORT_DIREC_PREF").setValue(" ");
    	}
    };
    var sortDirecHandler = function(combo, record, index){
    	if(Ext.getCmp("SORT_FLD_PREF").getValue() == " "){
    		Ext.getCmp("SORT_DIREC_PREF").setValue(" ");
    	}
    };
    var sortDirecCombo = {
				xtype:'iportal-combobox',
				cls : 'x-form-combo',
				ctCls:'padRight',
				id:'SORT_DIREC_PREF',
				combundleKey:CRB.getFWBundleKey(),
				rawKeys:['ASC', 'DESC'],
				rawValues:[this.cuserRb['LBL_ASC_DIREC'], this.cuserRb['LBL_DESC_DIREC']],
				mode: 'local',
				defaultValue : this.defaultSortDirec(),
				listeners: {"select":sortDirecHandler }
			};
    
    var sortFieldCombo = { 
			xtype:'iportal-combobox',
			cls : 'x-form-combo',
			ctCls:'padRight',
			combundleKey:CRB.getFWBundleKey(),
			rawKeys:sortFlsKey,
			//replaceEntityReference:true,
			rawValues:sortFlsValue,
			id:'SORT_FLD_PREF',
			mode: 'local',
			defaultValue : this.defaultSortFld(),
			listeners: {"select":sortChngHandler,scope:this}
		};
		
    var sortFldSet = new Ext.form.FieldSet({
				colspan:3,
				collapsed :false,
				gradientEffect:false,
				cls:'filterSpace',
				autoHeight :true,
				layout:'table',
				layoutConfig: {columns: 3},
				items:[
						{
							xtype:'label',
							ctCls:'filter-label',
							cls:'fontBold',
							text:this.cuserRb['LBL_SORT_BY']
						},sortFieldCombo,
						{xtype:'panel',border:false,layout:'table',layoutConfig:{columns:3},items:[sortDirecCombo]}
					  ]
				});
				
    var sortByForm = {
				layout:'form',
				border:false,
				hidden: (this.vMetaData.VIEW_MD.FLD_FILTER_IND === "N")?true:false,
				//width:'auto',
				cls:'filterPref',
				layoutConfig: {
					columns: 3
				},
				items: [
				        	sortFldSet
				]
		};
		return sortByForm;
    
    
    },
    
    defaultViewVal: function(){
	    for(var index = 0; index < this.viewsList.length; index++){
			var individualViews = this.viewsList[index];
			if(individualViews.VIEW_ID === this.vMetaData.VIEW_MD.VIEW_ID){
				return individualViews.DEFAULT_VIEW_IND;
				break;
			}
		}
    },
    
    /**
     * defaultViewSetCombo Method
     * Creates the "Default View Settings" Combo
     *
     * returns Default View Settings Combo
     */
    defaultViewSetCombo: function(){
		var combo = new iportal.formelement.ComboBox({
			cls : 'x-form-combo',
			ctCls:'padBottom',
			resourcePrefix : 'LBL_',
			combundleKey:CRB.getFWBundleKey(),
			includeSelect:false,
			id:this.mv_const.IS_DEFAULT_VIEW,
			fieldLabel:"LBL_DEFAULT_VIEW",
			rawKeys:['Y','N'],
			rawValues:[this.cuserRb['LBL_Y'],this.cuserRb['LBL_N']],
			mode: 'local',
			defaultValue : this.defaultViewVal()
		});
		return combo;
    },
    
    /**
     * getFormItems Method
     * Creates the components to be included in the Form Panel
     *
     * returns Array of items of Form panel components
     */
    getFormItems: function(){
	    var items = [];
		items.push(this.createViewSelector());
		//items.push('|');
		items.push(this.columnsIncluded());
		//items.push('|');
		items.push(this.createColumnOrder());
		//items.push('|');
		items.push(this.createLastColHand());
		//items.push('|');
		items.push(this.groupByItemSelect());
		//items.push('|');
		items.push(this.accGrpItemSelect());
		//items.push('|');
		items.push(this.createPrefFilterForm());
		//items.push('|');
		items.push(this.createSortByField());
		items.push(this.defaultViewSetCombo());
	    return items;
    },
    getColumnNameforColId: function(colId){
    	var columnsList = this.vMetaData.VIEW_MD.FLD_COLUMN_LIST;
		for(var index = 0;index<columnsList.length;index++){
			if(columnsList[index].FLD_COLUMN_ID === colId)
			{
				return columnsList[index].FLD_COLUMN_DISPLAY_NAME_KEY;
			}
		}
    },
    
    setPrefFilterComboData: function(){
    	var filterDataList = this.vMetaData.VIEW_MD.FILTERS;
    	var dataStringCode1 = ['strEquals','startsWith','endsWith','contains'];
		var dataStringValue1 = [this.cuserRb["LBL_strEquals"],this.cuserRb["LBL_startsWith"],this.cuserRb["LBL_endsWith"],this.cuserRb["LBL_contains"]];
		var dataNumCode1 = ['=','>','>=','<','<=','<>'];
		var dataNumValue1 = ['=','>','>=','<','<=','!='];
		var dataDateCode1 = ['dtEquals','range'];
		var dataDateValue1 = [this.cuserRb["LBL_dtEquals"],this.cuserRb["LBL_range"]];
		
		if(filterDataList.length > 0){
			// Set values for Filter1
			var filterOneDataMap = filterDataList[0];
			var fldOneFilterType = filterOneDataMap.FLD_FILTER_TYPE;
			var fldOneFilterValueList = filterOneDataMap.FLD_FILTER_VALUES;
			var fldOneColumnId = filterOneDataMap.FLD_COLUMN_ID;
			var fldOneFilterId = filterOneDataMap.FILTER_ID;
			var fldOneDataType = Ext.util.Format.uppercase(filterOneDataMap.FLD_DATA_TYPE);
			Ext.getCmp('FILTER1_COMBO_PREF_FILTER').setValue(this.getColumnNameforColId(fldOneColumnId));
				
			if(fldOneDataType === this.lvc_const.STRING){
				Ext.getCmp("FILTER_TEXT1_PREF_FILTER").show();
				Ext.getCmp("FILTER_TEXT1_PREF_FILTER").setValue(fldOneFilterValueList);
				Ext.getCmp("CONSTRAINT1_COM_PREF_FILTER").updateComboNoWrapRawStore(dataStringCode1,dataStringValue1);
				Ext.getCmp("CONSTRAINT1_COM_PREF_FILTER").setValue(fldOneFilterType);
				Ext.getCmp("FILTER_DATE1_PREF_FILTER").hide();
				Ext.getCmp("FILTER_DATE2_PREF_FILTER").hide();
			}else if(fldOneDataType === this.lvc_const.DATE){
				Ext.getCmp("FILTER_TEXT1_PREF_FILTER").hide();
				Ext.getCmp("FILTER_DATE1_PREF_FILTER").show();
				Ext.getCmp("CONSTRAINT1_COM_PREF_FILTER").updateComboNoWrapRawStore(dataDateCode1,dataDateValue1);
				Ext.getCmp("CONSTRAINT1_COM_PREF_FILTER").setValue(fldOneFilterType);
				if(fldOneFilterValueList.length > 1){
					Ext.getCmp("FILTER_DATE2_PREF_FILTER").show();
					Ext.getCmp("FILTER_DATE1_PREF_FILTER").setValue(iportal.jsutil.convertStringToDateObject(fldOneFilterValueList[0]));
					Ext.getCmp("FILTER_DATE2_PREF_FILTER").setValue(iportal.jsutil.convertStringToDateObject(fldOneFilterValueList[1]));
				}
				else if(fldOneFilterValueList.length === 1 && fldOneFilterType === 'gtEqualTo'){
					Ext.getCmp("FILTER_DATE1_PREF_FILTER").show();
					Ext.getCmp("FILTER_DATE2_PREF_FILTER").show();
					Ext.getCmp("CONSTRAINT1_COM_PREF_FILTER").setValue('range');
					Ext.getCmp("FILTER_DATE1_PREF_FILTER").setValue(iportal.jsutil.convertStringToDateObject(fldOneFilterValueList[0]));
				}
				else if(fldOneFilterValueList.length === 1 && fldOneFilterType === 'ltEqualTo'){
					Ext.getCmp("FILTER_DATE2_PREF_FILTER").show();
					Ext.getCmp("CONSTRAINT1_COM_PREF_FILTER").setValue('range');
					Ext.getCmp("FILTER_DATE2_PREF_FILTER").setValue(iportal.jsutil.convertStringToDateObject(fldOneFilterValueList[0]));
				}
				else if(fldOneFilterValueList.length === 1 && fldOneFilterType === 'dtEquals'){
					Ext.getCmp("FILTER_DATE1_PREF_FILTER").setValue(iportal.jsutil.convertStringToDateObject(fldOneFilterValueList[0]));
					Ext.getCmp("FILTER_DATE2_PREF_FILTER").hide();
				}
				dateType=true;											
			}else if(fldOneDataType ===this.lvc_const.INT || fldOneDataType ===this.lvc_const.FLOAT || fldOneDataType === 'EQCCY'){
				Ext.getCmp("FILTER_TEXT1_PREF_FILTER").show();
				Ext.getCmp("CONSTRAINT1_COM_PREF_FILTER").updateComboNoWrapRawStore(dataNumCode1,dataNumValue1);
				Ext.getCmp("CONSTRAINT1_COM_PREF_FILTER").setValue(fldOneFilterType);
				Ext.getCmp("FILTER_TEXT1_PREF_FILTER").setValue(fldOneFilterValueList);
				Ext.getCmp("FILTER_DATE1_PREF_FILTER").hide();
				Ext.getCmp("FILTER_DATE2_PREF_FILTER").hide();
			}
			
			// Set values for Filter 2
			if(filterDataList.length > 1){
				var filterTwoDataMap = filterDataList[1];
				var fldTwoFilterType = filterTwoDataMap.FLD_FILTER_TYPE;
				var fldTwoFilterValueList = filterTwoDataMap.FLD_FILTER_VALUES;
				var fldTwoColumnId = filterTwoDataMap.FLD_COLUMN_ID;
				var fldTwoFilterId = filterTwoDataMap.FILTER_ID;
				var fldTwoDataType = Ext.util.Format.uppercase(filterTwoDataMap.FLD_DATA_TYPE);
				Ext.getCmp('FILTER2_COMBO_PREF_FILTER').setValue(this.getColumnNameforColId(fldTwoColumnId));	
				
				if(fldTwoDataType === this.lvc_const.STRING){
					Ext.getCmp("FILTER2_TEXT1_PREF_FILTER").show();
					Ext.getCmp("FILTER2_TEXT1_PREF_FILTER").setValue(fldTwoFilterValueList);
					Ext.getCmp("CONSTRAINT2_COM_PREF_FILTER").updateComboNoWrapRawStore(dataStringCode1,dataStringValue1);
					Ext.getCmp("CONSTRAINT2_COM_PREF_FILTER").setValue(fldTwoFilterType);
					Ext.getCmp("FILTER2_DATE1_PREF_FILTER").hide();
					Ext.getCmp("FILTER2_DATE2_PREF_FILTER").hide();
				}else if(fldTwoDataType === this.lvc_const.DATE){
					Ext.getCmp("FILTER2_TEXT1_PREF_FILTER").hide();
					Ext.getCmp("FILTER2_DATE1_PREF_FILTER").show();
					Ext.getCmp("CONSTRAINT2_COM_PREF_FILTER").updateComboNoWrapRawStore(dataDateCode1,dataDateValue1);
					Ext.getCmp("CONSTRAINT2_COM_PREF_FILTER").setValue(fldTwoFilterType);
					
					if(fldTwoFilterValueList.length > 1 && fldTwoFilterType === 'range'){
						Ext.getCmp("FILTER2_DATE2_PREF_FILTER").show();
						Ext.getCmp("FILTER2_DATE1_PREF_FILTER").setValue(iportal.jsutil.convertStringToDateObject(fldTwoFilterValueList[0]));
						Ext.getCmp("FILTER2_DATE2_PREF_FILTER").setValue(iportal.jsutil.convertStringToDateObject(fldTwoFilterValueList[1]));
					}
					else if(fldTwoFilterValueList.length === 1 && fldTwoFilterType === 'gtEqualTo'){
						Ext.getCmp("FILTER2_DATE1_PREF_FILTER").show();
						Ext.getCmp("FILTER2_DATE2_PREF_FILTER").show();
						Ext.getCmp("CONSTRAINT2_COM_PREF_FILTER").setValue('range');
						Ext.getCmp("FILTER2_DATE1_PREF_FILTER").setValue(iportal.jsutil.convertStringToDateObject(fldTwoFilterValueList[0]));
					}
					else if(fldTwoFilterValueList.length === 1 && fldTwoFilterType === 'ltEqualTo'){
						Ext.getCmp("FILTER2_DATE2_PREF_FILTER").show();
						Ext.getCmp("CONSTRAINT2_COM_PREF_FILTER").setValue('range');
						Ext.getCmp("FILTER2_DATE2_PREF_FILTER").setValue(iportal.jsutil.convertStringToDateObject(fldTwoFilterValueList[0]));
					}
					else if(fldTwoFilterValueList.length === 1 && fldTwoFilterType === 'dtEquals'){
						Ext.getCmp("FILTER2_DATE1_PREF_FILTER").setValue(iportal.jsutil.convertStringToDateObject(fldTwoFilterValueList[0]));
						Ext.getCmp("FILTER2_DATE2_PREF_FILTER").hide();
					}
					dateType=true;											
				}else if(fldTwoDataType ===this.lvc_const.INT || fldTwoDataType ===this.lvc_const.FLOAT || fldTwoDataType === 'EQCCY'){
					Ext.getCmp("FILTER2_TEXT1_PREF_FILTER").show();
					Ext.getCmp("FILTER2_TEXT1_PREF_FILTER").setValue(fldTwoFilterValueList);
					Ext.getCmp("CONSTRAINT2_COM_PREF_FILTER").updateComboNoWrapRawStore(dataNumCode1,dataNumValue1);
					Ext.getCmp("CONSTRAINT2_COM_PREF_FILTER").setValue(fldTwoFilterType);
					Ext.getCmp("FILTER2_DATE1_PREF_FILTER").hide();
					Ext.getCmp("FILTER2_DATE2_PREF_FILTER").hide();
				}
			}
		}
		else{
			return;
		}
    },
    replaceEntity: function(_id){
    	var _combo = Ext.getCmp(_id);
		if(_combo){
			var _val = _combo.getValue();
			var _store = _combo.store || _combo.getStore();
			_store.each(function(aRec){
				if(aRec.data.key == _val){
					aRec.data.value = (aRec.data.value+'').replace('&lt;','<').replace('&gt;','>').replace('&quote;','"').replace('&nbsp;',' ');
					_combo.setValue(aRec.data.key);
					aRec.data.value = (aRec.data.value+'').replace('<','&lt;').replace('>','&gt;').replace('"','&quote;').replace(' ','&nbsp;');
				}
			});
		}
    },
    
    saveHandler: function(){
    	var showMessageWindow = this.validatePrefForm();
		if(!showMessageWindow){
			var bstring = '';
			if( Ext.getCmp(this.mv_const.COLUMNS_ORDER_COMBO).isVisible())
				{
		 			var mSelect = Ext.getCmp(this.mv_const.COLUMNS_ORDER_COMBO);
		  			var selectedIndex = [];
			  		for( i=0; i<mSelect.view.getStore().getCount(); ++i ){
			  			selectedIndex[i] = i;
			  		}
			  		mSelect.view.select(selectedIndex);
			  		var selectionsArray = mSelect.view.getSelectedIndexes();
			
			  		for( i=0; i<selectionsArray.length; ++i ){
			  			var rec = 	mSelect.view.getStore().getAt(selectionsArray[i]);
			  			bstring += rec.data.value;
			  			if(i !== selectionsArray.length-1)
			  			bstring += ',';
			  		}
	  			}
	 		var colgroupObjArr = Ext.getCmp(this.mv_const.COLUMNS_GROUP).getValue();
			var colGrpStr = '';
			for(var i=0; i<colgroupObjArr.length;i++){
				colGrpStr += colgroupObjArr[i].getId()
				if(i !== colgroupObjArr.length-1)
	 				colGrpStr += ',';
			}
			var commbun = CRB.getFWBundle();
			var filterFormSubmit = Ext.getCmp("SMRY_FILTER_FORM").getForm();
			formValues = filterFormSubmit.getValues(false);
			formValues.MULTI_SELECT = bstring;
			formValues.COLUMNS_GROUP = colGrpStr;
			formValues.VIEW_NAME = this.vMetaData.VIEW_MD.VIEW_DISPLAY_NM;
			var submitvalues = Ext.encode(formValues);
			var extraParams = { INPUT_ACTION:"PREF_SAVE_ACTION",
								PAGE_CODE_TYPE:'VDF_CODE',
								PRODUCT_NAME:"CUSER",
								INPUT_FUNCTION_CODE:"VSBLTY",
								INPUT_SUB_PRODUCT:"CUSER",
								WIDGET_ID: this.currWidget,
								JSON_DATA:submitvalues,
								JSON_TO_HASH_MAP_SUPPORT_FLAG:"JSON_DATA",
								VIEW_ID: this.vMetaData.VIEW_MD.VIEW_ID,
								PARENT_VIEW_ID: this.vMetaData.VIEW_MD.SYSTEM_VIEW_ID,
								__LISTVIEW_REQUEST:'Y'
			};
			
			Ext.Ajax.request({
			       params:extraParams,
				   success:  this.prefActionSuccessHandler.createDelegate(this)
			});
		}
    },
    
    /*
    	Perform all validation related to the Widget Preference form for both Save as New and Save actions
    	@returns showMessageWindow as true or false
    */
    
    validatePrefForm: function(){
    	var filter1ComboPrefFilter = Ext.util.Format.trim(Ext.getCmp("FILTER1_COMBO_PREF_FILTER").value);
		var constraint1ComboPrefFilter = Ext.util.Format.trim(Ext.getCmp("CONSTRAINT1_COM_PREF_FILTER").value);
		var filter1TextPrefFilterObj = Ext.getCmp("FILTER_TEXT1_PREF_FILTER");
		var filter1Date1PrefFilterObj = Ext.getCmp("FILTER_DATE1_PREF_FILTER");
		var filter1Date2PrefFilterObj = Ext.getCmp("FILTER_DATE2_PREF_FILTER");
		var actionConfirmationWindow = null;
		var visibleFilterDataVal;
		var visibleFilterDataDate2Val;
		var showMessageWindow = false;
		var selectedFilterDate1Date2 = false;
		var selectedFilterDate2Date2 = false;
		var messageKey = null;
		/*
		* Validation for setting filter begins
		*/
		if(filter1TextPrefFilterObj.isVisible()){
			visibleFilterDataVal = Ext.util.Format.trim(filter1TextPrefFilterObj.getValue());
		}
		else if(filter1Date1PrefFilterObj.isVisible() && (constraint1ComboPrefFilter === 'dtEquals' || constraint1ComboPrefFilter === 'range')){
			if(!Ext.isEmpty(filter1Date1PrefFilterObj.value)){
				visibleFilterDataVal = Ext.util.Format.trim(filter1Date1PrefFilterObj.value);
			}
			else{
				visibleFilterDataVal = '';
			}
		}
		if(constraint1ComboPrefFilter === 'range'){
			visibleFilterDataDate2Val = Ext.util.Format.trim(filter1Date2PrefFilterObj.value);
			selectedFilterDate1Date2 = true;
		}
		var filter2ComboPrefFilter = Ext.util.Format.trim(Ext.getCmp("FILTER2_COMBO_PREF_FILTER").value);
		var constraint2ComboPrefFilter = Ext.util.Format.trim(Ext.getCmp("CONSTRAINT2_COM_PREF_FILTER").value);
		var filter2TextPrefFilterObj = Ext.getCmp("FILTER2_TEXT1_PREF_FILTER");
		var filter2Date1PrefFilterObj = Ext.getCmp("FILTER2_DATE1_PREF_FILTER");
		var filter2Date2PrefFilterObj = Ext.getCmp("FILTER2_DATE2_PREF_FILTER");
		var visible2FilterDataVal;
		var visible2FilterDataDate2Val;
		if(filter2TextPrefFilterObj.isVisible()){
			visible2FilterDataVal = Ext.util.Format.trim(filter2TextPrefFilterObj.getValue());
		}
		else if(filter2Date1PrefFilterObj.isVisible() && (constraint2ComboPrefFilter === 'dtEquals' || constraint2ComboPrefFilter === 'range')){
			if(!Ext.isEmpty(filter2Date1PrefFilterObj.value)){
				visible2FilterDataVal = Ext.util.Format.trim(filter2Date1PrefFilterObj.value);
			}
			else{
				visible2FilterDataVal = '';
			}
		}
		if(constraint2ComboPrefFilter === 'range'){
			visible2FilterDataDate2Val = Ext.util.Format.trim(filter2Date2PrefFilterObj.value);
			selectedFilterDate2Date2 = true;
		}
		if(filter1ComboPrefFilter.indexOf('_AMT') !== -1 && visibleFilterDataVal !== ''){
			var validateData = visibleFilterDataVal.replace(',','');
			var checkFlag = isNaN(validateData);
			if(isNaN(validateData)){
				var bundleName = CRB.getFWBundleKey();
				var filter_prim = CRB.getBundle(bundleName);
				var message = filter_prim['LBL_'+filter1ComboPrefFilter]+" "+filter_prim['LBL_ONLY_NUMERAL'];
				var actionConfirmationWindow = new iportal.Dialog({
					   dialogType:'ERROR',
					   
					   cls:'portal_neg_btn',
					   
					   title: filter_prim["LBL_ERROR"],
					   message:message,
					   okHandler:function(){
							actionConfirmationWindow.close();
							return;
					   }
				});
				actionConfirmationWindow.show();
				return;
			}
			
		}
		if(filter2ComboPrefFilter.indexOf('_AMT') !== -1 && visible2FilterDataVal !== ''){
			var validateData = visible2FilterDataVal.replace(',','');
			var checkFlag = isNaN(validateData);
			if(isNaN(validateData)){
				var bundleName = CRB.getFWBundleKey();
				var filter_prim = CRB.getBundle(bundleName);
				var message = filter_prim['LBL_'+filter2ComboPrefFilter]+" "+filter_prim['LBL_ONLY_NUMERAL'];
				var actionConfirmationWindow = new iportal.Dialog({
					   dialogType:'ERROR',
					   
					   cls:'portal_neg_btn',
					   
					   title: filter_prim["LBL_ERROR"],
					   message:message,
					   okHandler:function(){
							actionConfirmationWindow.close();
							return;
					   }
				});
				actionConfirmationWindow.show();
				return;
			}
		}
		/*
		*	Doing all sorts of validations
		*/
    	if(!(Ext.getCmp(this.mv_const.COLUMNS_GROUP).getValue().length > this.getMandatoryCount())){
			showMessageWindow = true;
			if(this.getMandatoryCount() === 0)
				messageKey = 'SEL_ONE_COL';
			else
				messageKey = 'SEL_ONE_COL_OTHER_THAN_MAN';
		}
		else if(filter1ComboPrefFilter === filter2ComboPrefFilter && filter2ComboPrefFilter != '' ){
			showMessageWindow = true;
			messageKey = 'LBL_SELCT_FILTER_WRNG_MSG';
			
		}
		else if(filter1ComboPrefFilter !== '' && constraint1ComboPrefFilter === ''){
			showMessageWindow = true;
			messageKey = 'LBL_SELCT_CONSTRAINT1_MSG';
		}
		else if(filter1ComboPrefFilter === '' && filter2ComboPrefFilter !== ''){
			showMessageWindow = true;
			messageKey = 'LBL_SELCT_FILTER_MSG';
		}
		else if(filter1ComboPrefFilter !== '' && constraint1ComboPrefFilter !== ''  && visibleFilterDataVal === '' && selectedFilterDate1Date2 === false){
			showMessageWindow = true;
			messageKey = 'LBL_SELCT_DATA1_MSG';
		}
		else if(filter1ComboPrefFilter !== '' && constraint1ComboPrefFilter !== ''  && selectedFilterDate1Date2 === true){
			// Date 1 Date 2 validation
			if(visibleFilterDataVal === '' && (visibleFilterDataDate2Val === 'undefined' || visibleFilterDataDate2Val === '')){
				showMessageWindow = true;
				messageKey = 'LBL_SELCT_DATA1_MSG';
			}
			else{	
				var fromDate =  new Date.parseDate(visibleFilterDataVal, canvas.datePreferences.getDateFormat());
				var toDate =  new Date.parseDate(visibleFilterDataDate2Val, canvas.datePreferences.getDateFormat());
				if(fromDate > toDate){
					showMessageWindow = true;
					messageKey = 'LBL_DATE_SELECT';
				}
			}
		}
		else if(filter2ComboPrefFilter !== '' && constraint2ComboPrefFilter === ''){
			showMessageWindow = true;
			messageKey = 'LBL_SELCT_CONSTRAINT2_MSG';
		}
		else if(filter2ComboPrefFilter !== '' && constraint2ComboPrefFilter !== '' && visible2FilterDataVal === '' && selectedFilterDate2Date2 === false){
			showMessageWindow = true;
			messageKey = 'LBL_SELCT_DATA2_MSG';
		}
		else if(filter2ComboPrefFilter !== '' && constraint2ComboPrefFilter !== '' && selectedFilterDate2Date2 === true){
			// Date 1 Date 2 validation
			if(visible2FilterDataVal === '' && (visible2FilterDataDate2Val === 'undefined' || visible2FilterDataDate2Val === '')){
				showMessageWindow = true;
				messageKey = 'LBL_SELCT_DATA2_MSG';
			}
			else{
				var fromDate =  new Date.parseDate(visible2FilterDataVal, canvas.datePreferences.getDateFormat());
				var toDate =  new Date.parseDate(visible2FilterDataDate2Val, canvas.datePreferences.getDateFormat());
				if(fromDate > toDate){
					showMessageWindow = true;
					messageKey = 'LBL_DATE_SELECT';
				}
			}
		}
		else if(Ext.getCmp("SORT_FLD_PREF").getValue() !== " " && Ext.getCmp("SORT_DIREC_PREF").getValue() === " "){
			showMessageWindow = true;
			messageKey = 'LBL_SELECT_SORT_DIREC';
		}
		if(showMessageWindow){
			var filter_prim = CRB.getFWBundle();
			var confWin = new iportal.Dialog({
				   dialogType:'ERROR',
				   
				   cls:'portal_neg_btn',
				 
				   title: filter_prim["LBL_ERROR"],
				   message:filter_prim[messageKey],
				   okHandler:function(){
						confWin.close();
						return;
				   }
			});
			confWin.show();
		}
		return showMessageWindow;
    },
    
    isViewNameUnique: function(newViewName){
    	var isUnique = false;
    	var viewNamesList = this.createViewSelector().rawValues
    	for(var i = 0;i < viewNamesList.length;i++){
    		if(viewNamesList[i].toUpperCase() === newViewName.toUpperCase()){
    			isUnique = true;
    			break;
    		}
    	}
    	return isUnique;
    },
    
    getMandatoryCount: function(){
    	var columnsList = this.vMetaData.VIEW_MD.FLD_COLUMN_LIST;
    	var mandatoryCount = 0;
    	for(var index = 0;index<columnsList.length;index++){
			  var column = columnsList[index];
			   if(column.FLD_HIDDEN_IND === "N" && column.FLD_MANDATORY_IND === "Y" && column.FLD_COLUMN_ID != "CONTEXT"){
			   			mandatoryCount++;
			   } 	
    	}
    	return mandatoryCount;
    },
    
    viewNameWinOkHandler: function(){
    	var showMessageWindow = false;
    	var viewNameTextField = Ext.getCmp(this.mv_const.VIEW_NAME);
    	var message = "";
    	if(viewNameTextField.getValue().trim() === ''){
			showMessageWindow = true;
			message += this.cuserRb['LBL_VIEW_NAME_EMPTY'];
		}else if(!(/^([a-zA-Z0-9 #$%^*+,-./:?@\[\]\_`])*$/.test(viewNameTextField.getValue().trim()))){
			showMessageWindow = true;
			message = CRB.getFWBundle().ERR_INVALID_CHAR;
		}
		else if(viewNameTextField.getValue().length > 35){
			showMessageWindow = true;
			message = this.cuserRb['LBL_VIEW_NAME_MAXLENGTH'];
		}else if(this.isViewNameUnique(viewNameTextField.getValue().trim())){
			showMessageWindow = true;
			var text1=CRB.getFWBundle()['ERR_VIEW_NM_NT_UNIQUE'];
			message += String.format(text1,viewNameTextField.getValue());
		}else if(!(Ext.getCmp(this.mv_const.COLUMNS_GROUP).getValue().length > this.getMandatoryCount())){
			showMessageWindow = true;
			message += this.cuserRb['SEL_ONE_COL_OTHER_THAN_MAN'];
		}
    	if(showMessageWindow === true){
			var validationErrorWindow = new iportal.Dialog({
				   dialogType:'ERROR',
					title: this.cuserRb["LBL_ERROR"],
					
					cls:'portal_neg_btn',
					
					message:message,
				   okHandler:function(){
						validationErrorWindow.close();
						return;
				   }
			});
			validationErrorWindow.show();
		}
		else{
			var bstring = '';
  			if( Ext.getCmp(this.mv_const.COLUMNS_ORDER_COMBO).isVisible())
  			{
  				var mSelect = Ext.getCmp(this.mv_const.COLUMNS_ORDER_COMBO);
	  			var selectedIndex = [];
	  			for( i=0; i<mSelect.view.getStore().getCount(); ++i ){
	  				selectedIndex[i] = i;
	  			}
	  			mSelect.view.select(selectedIndex);
	  			var selectionsArray = mSelect.view.getSelectedIndexes();
		  		for( i=0; i<selectionsArray.length; ++i ){
	  				var rec = 	mSelect.view.getStore().getAt(selectionsArray[i]);
	  				bstring += rec.data.value;
	  				if(i !== selectionsArray.length-1)
	  					bstring += ',';
	  			}
	  		}
  			var colgroupObjArr = Ext.getCmp(this.mv_const.COLUMNS_GROUP).getValue();
			var colGrpStr = '';
			for(var i=0; i<colgroupObjArr.length;i++){
				colGrpStr += colgroupObjArr[i].getId()
				if(i !== colgroupObjArr.length-1)
  					colGrpStr += ',';
			}
			var commbun = CRB.getFWBundle();
			var filterFormSubmit = Ext.getCmp("SMRY_FILTER_FORM").getForm();
			formValues = filterFormSubmit.getValues(false);
			formValues.MULTI_SELECT = bstring;
			formValues.COLUMNS_GROUP = colGrpStr;
			formValues.VIEW_NAME = Ext.getCmp(this.mv_const.VIEW_NAME).getValue().trim();
			//formValues.FILTER1_COMBO_PREF_FILTER =Ext.getCmp("FILTER1_COMBO_PREF_FILTER").startValue; 
			//formValues.FILTER2_COMBO_PREF_FILTER =Ext.getCmp("FILTER2_COMBO_PREF_FILTER").startValue; 
			var submitvalues = Ext.encode(formValues);
			var extraParams = { INPUT_ACTION:"PREF_SAVE_NEW_ACTION",
								PAGE_CODE_TYPE:'VDF_CODE',
								PRODUCT_NAME:"CUSER",
								INPUT_FUNCTION_CODE:"VSBLTY",
								INPUT_PRODUCT: "CUSER",
								INPUT_SUB_PRODUCT:"CUSER",
								INPUT_LANGUAGE_ID: iportal.preferences.getPrimaryLang(),
								VDEF_PRODUCT: this.vMetaData.VIEW_MD.PRODUCT_CODE,
								VDEF_SUBPRODUCT: this.vMetaData.VIEW_MD.SUB_PRODUCT_CODE,
								WIDGET_ID: this.currWidget,
								JSON_DATA:submitvalues,
								JSON_TO_HASH_MAP_SUPPORT_FLAG:"JSON_DATA",
								VIEW_ID: this.vMetaData.VIEW_MD.VIEW_ID,
								PARENT_VIEW_ID: this.vMetaData.VIEW_MD.SYSTEM_VIEW_ID,
								__LISTVIEW_REQUEST:'Y'
			};
			
			Ext.Ajax.request({
			       params:extraParams,
				   success: this.prefActionSuccessHandler.createDelegate(this)
			});
		
		}
    },
    

    saveNewHandler: function(){
    	//alert("In saveNewHandler");
		var showMessageWindow = this.validatePrefForm();
		if(!showMessageWindow){
			this.viewNamePromptWin();
		}			
			
    },
    prefActionSuccessHandler:function(resp, opt){
    	if (resp.responseText !== null && resp.responseText !== '') {
		   	var respOb= Ext.decode(resp.responseText);
		   	var titleMsg="";
			var message="";
			if(!Ext.isEmpty(respOb.SUCCESS)){
				titleMsg+='LBL_CONFIRMATION';
				var text=CRB.getFWBundle()['LBL_'+respOb.PREF_ACTION];
				message += String.format(text,respOb.VIEW_DISPLAY_NM);
			}else if (!Ext.isEmpty(respOb.ERR_CODE)){
				titleMsg+='LBL_ERROR';
				message += respOb.ERR_MESS;
			}
			else if(!Ext.isEmpty(respOb.response.VALIDATION_ERROR)){
				titleMsg+='LBL_ERROR';
				message += respOb.response.VALIDATION_ERROR;
			}
		   	var dialog = new iportal.Dialog({
			   	dialogType:'MESSAGE',
				title: this.cuserRb[titleMsg],
			   	message:message,
			   	
			   	cls:'portal_neg_btn',
			   	
			   	closeHandler: function(){
			   		if(titleMsg==='LBL_CONFIRMATION'){
			   			if(this.viewNameWin)
			   				this.viewNameWin.close();
			   			this.updateModal(resp,opt);
			   		}
			   	}.createDelegate(this),
			  	okHandler:function(){
			  		if(titleMsg==='LBL_CONFIRMATION'){
			  			if(this.viewNameWin)
			  				this.viewNameWin.close();
			   			this.updateModal(resp,opt);
			   		}
			   		dialog.close();
			   	}.createDelegate(this)
			});
			dialog.show();
		}
	},
    closeViewNameWin: function(){
    	this.viewNameWin.close();
    },
    
    getViewName: function(){
    	var items = [];
    	items.push(
    		{
	    		xtype: 'iportal-textfield',
	    		id:this.mv_const.VIEW_NAME,
	    		bundleKey:CRB.getFWBundleKey(), 
	    		fieldLabel:"LBL_VIEW_NAME",
	    		validationType: 'portalSupported',
	    		maxLength: 35, 
	    		allowSpaces: true, 
	    		required: true
	    	});
    	return items;
    },
    
    getViewWinbbar: function(){
    	var viewWinbbaritems = [];
    	viewWinbbaritems.push({xtype:"tbbutton",cls:'marginButton',text:this.cuserRb["LBL_OK_BTN"],handler:this.viewNameWinOkHandler,scope:this})
    	viewWinbbaritems.push({xtype:"tbfill"});
    	viewWinbbaritems.push({xtype:"tbbutton",cls:'marginButton',text:this.cuserRb["LBL_CANCEL"],handler:this.closeViewNameWin,scope:this})
    	return viewWinbbaritems;
    },
    
    viewNamePromptWin: function(){
    	Ext.form.Field.prototype.msgTarget = 'side';
	    this.viewNameWin = new iportal.Window ({
	    	id: "PREF_VNAME_WINDOW",
	    	width: 360,
	    	modal:true,
	    	toolButtons:['close'],
	    	title:'LBL_VW_NM_TITLE',    
			height: 100,
			bundleKey : CRB.getFWBundleKey(),
			cls:'formBg',
			items:[{
							xtype:'iportal-fluidform',
							bundleKey : CRB.getFWBundleKey(),
							layout:'form',
							items: this.getViewName()
			}],
			bbar: this.getViewWinbbar()
	    });
	    this.viewNameWin.show();
    },
    isCustomisedView:function(){
    	if(this.vMetaData.VIEW_MD.FLD_OD_USER_NO === '-1'){
    		return true;
    	}
    	return false;
    },
    cancelWinhandler: function(){
    	if(this.changed){
	    	var cancelConfirmationWindow = new iportal.Dialog({
						   dialogType:'USERDEFINED',
							title: this.commbun["LBL_WARN"],
							message:this.cuserRb["LBL_CANCEL_MSG"],
						   //message:"You have made some changes to the preferences. You will lose them if you continue this operation. Do you like to continue?",
						   dialogStyle:'YES_NO',
						   yesHandler:function(){
						   		cancelConfirmationWindow.close();
								this.closeWin();
						   }.createDelegate(this),
						   noHandler:function(){
						   	cancelConfirmationWindow.close();
						   }
			});
			cancelConfirmationWindow.show();
		}else{
			this.closeWin();
		}
    },
    
    closeWin:function(){
    	this.widjPrefWin.close();
    },
    updateModal : function(resp,op){
    	this.closeWin();
    	var respOb= Ext.decode(resp.responseText);
    	IMM.widgetPrfChanged(respOb);
    },
    
    deleteViewHandler: function(){
    	if("Y" === this.defaultViewVal()){
	    	var defDeleteConfirmationWindow = new iportal.Dialog({
						   dialogType:'USERDEFINED',
							title: this.commbun["LBL_WARN"],
							message:this.cuserRb["LBL_DELETE_MSG_1"]+ " " + this.cuserRb['LBL_'+this.currWidget+'_DEF']+ " " +this.cuserRb["LBL_DELETE_MSG_2"],
							
							cls:'portal_neg_btn',
							
							//message:"You are about to delete a default view. If you proceed, the system will make the view " +'"'+this.cuserRb['LBL_'+this.currWidget+'_DEF']+'"' + " as the default view. You can change this later through Preferences",
						   dialogStyle:'OK_CANCEL',
						   okHandler:function(){
						   		defDeleteConfirmationWindow.close();
								this.handleDeleteView();
						   }.createDelegate(this),
						   cancelHandler:function(){
						   	defDeleteConfirmationWindow.close();
						   }
			});
			defDeleteConfirmationWindow.show();
		}else{
			this.handleDeleteView();
		}
    },
    
    handleDeleteView: function(){
    	var extraParams = { INPUT_ACTION:"PREF_DELETE_ACTION",
								PAGE_CODE_TYPE:'VDF_CODE',
								PRODUCT_NAME:"CUSER",
								INPUT_FUNCTION_CODE:"VSBLTY",
								INPUT_SUB_PRODUCT:"CUSER",
								WIDGET_ID: this.currWidget,
								VIEW_ID: this.vMetaData.VIEW_MD.VIEW_ID,
								__LISTVIEW_REQUEST:'Y'
			};
			Ext.Ajax.request({
			       params:extraParams,
				   success: this.prefActionSuccessHandler.createDelegate(this)
			});
    },
    getBbarItems: function(){
    	var bbarItems = [];
	    var saveNew = {xtype:"tbbutton",cls:'marginButton',text:this.cuserRb["LBL_SAVE_NEW"],handler:this.saveNewHandler,scope:this};
    	if(!this.isCustomisedView()){
    		bbarItems.push(saveNew);
    		bbarItems.push({xtype:"tbbutton",cls:'marginButton',text:this.cuserRb["LBL_SAVE"],handler:this.saveHandler,scope:this});
	    	bbarItems.push({xtype:"tbbutton",cls:'marginButton',text:this.cuserRb["LBL_DELETE"],handler:this.deleteViewHandler,scope:this});
    	}else{
    		bbarItems.push(saveNew);
    	}
    	bbarItems.push({xtype:"tbfill"});
    	bbarItems.push({xtype:"tbbutton",cls:'marginButton',text:this.cuserRb["LBL_CANCEL"],handler:this.cancelWinhandler,scope:this});
    	return bbarItems;
    },
    createWindowAndShow: function(fromCombo){
    
    	var windowTitle = "LBL_"+this.currWidget+"_PREF";
    	if (!this.cuserRb[windowTitle]){
    		windowTitle = "LBL_PREF";
    	}
    	this.widjPrefWin = new iportal.Window({
			id:"PREF_WINDOW_TITLE",
			title:"LBL_"+this.currWidget+"_PREF",
			layout:'fit',
			cls:'formBg',
			bundleKey : CRB.getFWBundleKey(),
			toolButtons:['help','close'],
			helpHandler: function(){
			iportal.jsutil.helpHandler('Preferences_'+this.vMetaData.VIEW_MD.SYSTEM_VIEW_ID+'_Help.htm');
			}.createDelegate(this),
			width:950,
			height:475,
			modal:true,
			items: [
					{
						xtype:'iportal-formpanel',
						bundleKey : CRB.getFWBundleKey(),
						layout:'form',
						border:false,
						autoScroll:true,
						width:936,
						//height:460,
						id:"SMRY_FILTER_FORM",
						items: this.getFormItems()
					}
					],
			bbar:this.getBbarItems()	
		});
		this.widjPrefWin.show();
		if(!fromCombo){
			this.changed = false;
		}
		var that = this;
		var form = this.widjPrefWin.items.get(0).getForm();
		form.items.each(function(){
			this.on('change',function(){
				var me = that;
				return function(){
					me.changed = true;
				}
			}(),this);
		});
		
		this.setPrefFilterComboData();
		this.replaceEntity('FILTER1_COMBO_PREF_FILTER');	
		this.replaceEntity('FILTER2_COMBO_PREF_FILTER');	
    }
});
iportal.view.widgetPreference = function(config){
	Ext.QuickTips.init();
	var mvh = config.mvh;
	var prefAction = config.prefAction;
	var cmrb = CRB.getFWBundle();
	var rb= CRB.getFWBundle();
	var vmd = mvh.getSelectedViewMd();
	var widgetId = mvh.removeIdSuffix();
	var systemViewId = mvh.findSystemViewId(vmd);
	if (config.viewId){
		selViewId = config.viewId;	
	}else{
		selViewId = vmd.VIEW_MD.VIEW_ID;
	}
	
	
	var Widget_Pref_Form = new Ext.form.FormPanel({
		items:[{
			xtype:'iportal-fieldset',
			bundleKey:CRB.getFWBundleKey(),
			items:[{
				items:[{
					xtype:'iportal-textfield',
					bundleKey : CRB.getFWBundleKey(),
					id:'windowWidgetPreferences',
					value:cmrb['PREFERENCE_SAVE_SUCCESS'],
					readOnly:true			
				}]
			}]
		}]
	});

	var panelItems = [];
	var windowTitle = 'LBL_PREFERENCES';
	var isValidateForm  = false;
	if (prefAction == 'PREF_SAVE_ACTION'){
		panelItems.push({   
			xtype : 'iportal-textfield',
			required: true,
			allowSpaces: true,
			validationType: 'alphaNumeric',
			maxLength: '40',
			id: 'VIEW_DISPLAY_NM',						
			fieldLabel:'LBL_PREFS_NAME'
		});	
		windowTitle = 'LBL_SAVE_PREFS';
		isValidateForm  = true;
	} else if (prefAction == 'PREF_UPDATE_ACTION'){
		panelItems.push({   
			xtype : 'label',
			html:rb["WIDGET_PREFERENCE_UPDATE_INFO_MSG"]
		});
		windowTitle = 'LBL_UPDATE_PREFS';					
	} else if (prefAction == 'PREF_DELETE_ACTION'){
		panelItems.push({   
			xtype : 'label',
			html:rb["WIDGET_PREFERENCE_REMOVE_WARNING_MSG"]
		});
		windowTitle = 'LBL_REMOVE_PREFS';
	}
	var widgetPreferenceForm = new iportal.formelement.FormPanel({		
		bundleKey:CRB.getFWBundleKey(),
		id:'widgetPreferencesFormPanelId',
		xtype : 'form',
		width:360,
		labelSeparator:' ',
		bodyBorder:false,
		border : false,
		frame : false,
		items:panelItems
	});
										
	getButtons = function(){
		var rArry = [];
		var grid = mvh.getGridCmp();
		var buttonText = rb.LBL_SAVE_PREFS;
		if (prefAction == 'PREF_UPDATE_ACTION'){
			buttonText = rb.LBL_UPDATE_PREFS;
		} else if (prefAction == 'PREF_DELETE_ACTION'){
			buttonText = rb.LBL_REMOVE_PREFS;
		} 
		rArry.push({
			xtype:'tbbutton',
			text: buttonText,
			cls:'portal_pos_btn',
			id:'submit',
			type: 'submit',
			handler: function(){	
				var paramObj = {};
				
				var gridState = {};
				if (grid){
					gridState = grid.getState();
					if (gridState){
						
						if(grid.colModel.grpColumns){
							var grpColumns = grid.colModel.grpColumns;
							var colProp = {};
							for(var i =0; i< grpColumns.length; i++){
								if(grpColumns[i].childs){
									colProp['_id'] = grpColumns[i].id;
									colProp['_hidden'] = (grpColumns[i].hidden == true) ? 'Y' : 'N';
									colProp['_dataindex'] = grpColumns[i].id;
									colProp['_position'] = i;
									gridState._colProperties.push(colProp);
								}
							}
						}
						
					//	gridState['_initCollapsed'] = vmd.VIEW_MD.FLD_INIT_COLLAPSED;					
						grid.fireEvent( 'statechange' , grid);
						paramObj['JSON_DATA'] = Ext.encode(gridState);
					}
					
					/*if (prefAction == 'PREF_SAVE_ACTION' || prefAction == 'PREF_DELETE_ACTION'){
						Ext.state.Manager.clear(grid.getStateId());
						
					}*/
					
				}
							if (prefAction == 'PREF_UPDATE_ACTION') {
					paramObj['VIEW_ID']= selViewId;
					prefAction = 'PREF_SAVE_ACTION';
					
					paramObj['JSON_DATA'] = Ext.encode(gridState);
				} else if (prefAction == 'PREF_SAVE_ACTION'){
					Ext.state.Manager.clear(grid.getStateId());
					delete paramObj['VIEW_ID'];
					paramObj['JSON_DATA'] = Ext.encode(gridState);
				} else if (prefAction == 'PREF_DELETE_ACTION'){
					paramObj['VIEW_ID']= selViewId;
					if (grid){
						Ext.state.Manager.clear(grid.getStateId());
					}
				} 
				
				
				paramObj['SYSTEM_VIEW_ID'] = systemViewId;
				paramObj['WIDGET_ID']=widgetId;
				paramObj['PAGE_CODE_TYPE']='WIDGET_PREFERENCE';
				paramObj['INPUT_PRODUCT']='CUSER';
				paramObj['INPUT_FUNCTION_CODE']='VSBLTY';
				paramObj['INPUT_SUB_PRODUCT']='CUSER';
				paramObj['PRODUCT_NAME']='CUSER';
				
				if(Ext.getCmp('VIEW_DISPLAY_NM') && !Ext.getCmp('VIEW_DISPLAY_NM').isValid()){
					return;
				}
						
				iportal.submitHandler({
					formid:'widgetPreferencesFormPanelId',
					action:prefAction, 
					params:paramObj,
					success:successHandler, 
					failure:failureHandler,
					clientValidation:isValidateForm
				});
			}
		});
		rArry.push({xtype:'tbfill'});
		rArry.push({
			xtype: 'tbbutton',
			type: 'submit',
			text: cmrb['LBL_CLOSE'],
			id: 'Close',
			cls:'portal_neg_btn',
			type: 'submit',
			handler: function(){
				var confDialog = new iportal.Dialog({
					dialogType:'USERDEFINED',
					dialogStyle:'YES_NO',
					title:cmrb['LBL_CONFIRMATION'],
					message:cmrb['CANCEL_CONFIRMATION'],
					yesHandler:function(){
						windowWidgetPreferences.close();
						confDialog.close();
					},
					noHandler:function(){
						confDialog.close();
					}
				});
				confDialog.show();
			}
		});
		return rArry;
	};
	
	
	var windowWidgetPreferences = new iportal.Window({
		title : windowTitle,
		width:360,
		//height:200,	
		id:'windowWidgetPreferences',
		tools:[{
			id:'help',
			qtip : CRB.getFWBundle().TOOL_TIPS_HELP,
			handler:function(){
				iportal.jsutil.helpHandler('Preferences_General_help.htm');
			}			
		},{
			id:'close',
			qtip : CRB.getFWBundle().TOOL_TIPS_CLOSE,
			handler:function(){
				try {
					win.remove(ac.ID);
				} catch(err) {/* Empty function*/}					
				windowWidgetPreferences.close();
			}
		}],
		//helpHandler: function(){iportal.jsutil.helpHandler('Preferences_General_help.htm');},
		hideOnClose : false,
		stateful: false,
		bundleKey : CRB.getFWBundleKey(),
		bbar: getButtons(),	
		items:[{layout:'form', items:[widgetPreferenceForm]}]
	});
	windowWidgetPreferences.show();
	
	successHandler = function(form,action) {
		var message= '';
		var result = action.result;
		var viewDisplayName = result.VIEW_DISPLAY_NM;
		var widgetId = result.WIDGET_ID;
		var viewId = result.VIEW_ID;
		var isDefaultView = result.DEFAULT_VIEW;
		var userNo = result.OD_USER_NO;
		var gcif = result.OD_GCIF;
		var customizedInd = 'Y';
		if (result.SAVE_VIEW_FLAG == 'SUCCESS') {
			IMM.handleDeleteViewAction(result);
			var newView = {
					'VIEW_DISPLAY_NM':viewDisplayName,
					'VIEW_ID':viewId,
					'DEFAULT_VIEW_IND' : isDefaultView,
					'USER_NO':userNo,
					'GCIF':gcif,
					'CUSTOMIZE_IND':customizedInd
				};
			IMM.getViewsList(widgetId).push(newView);
			message = rb["WIDGET_PREFERENCE_SAVE_SUCCESS_MSG"];
			mvh.switchPreference(viewId);						
		} else if (result.UPDATE_VIEW_FLAG == 'SUCCESS') {
			IMM.deleteViewMeta(viewId);
			//update the changes for Widget Preferences-update
			//IMM.handleDeleteViewAction(result);
			IMM.fireEvent('modalchange',result);
			mvh.switchPreference(viewId);	
		
			message = rb["WIDGET_PREFERENCE_UPDATE_SUCCESS_MSG"];											
		}else if (result.REMOVE_VIEW_FLAG == 'SUCCESS') {
			IMM.deleteView(widgetId,selViewId);
			if (vmd.VIEW_MD.VIEW_ID === selViewId) {
				var systemViewId = mvh.findSystemViewId(mvh.getSelectedViewMd());
				mvh.switchPreference(systemViewId);
			}
			message = rb["WIDGET_PREFERENCE_REMOVE_SUCCESS_MSG"];											
		} else {
			message = rb["WIDGET_PREFERENCE_SAVE_ERROR_MSG"];						
		}
		
		var preferenceSaveSuccess = new iportal.Dialog({
			dialogType : 'USERDEFINED',
			dialogStyle : 'OK',
			message : message,
			closeIconRequired : true,
			okHandler : function(){
				preferenceSaveSuccess.close();
				windowWidgetPreferences.close();							
			},
			title : rb["LBL_CONFIRMATION"]
		});
		preferenceSaveSuccess.show();
	};

	failureHandler = function(form,action) {
		var titleMsg = '';
		var message = '';
		if (!Ext.isEmpty(action.result.ERR_CODE)){
			titleMsg+=rb['LBL_ERROR'];
			message +=rb[action.result.ERR_CODE];
		}
		
		var dialog = new iportal.Dialog({
		   	dialogType:'MESSAGE',
			title: titleMsg,
		   	message: message,
		   	cls:'portal_neg_btn',
		   	closeHandler: function(){
		   		if(titleMsg==='LBL_CONFIRMATION'){
		   			if(this.viewNameWin)
		   				this.viewNameWin.close();
		   			this.updateModal(resp,opt);
		   		}
		   	}.createDelegate(this),
		  	okHandler:function(){
		  		
		   		dialog.close();
		   	}.createDelegate(this)
		});
		dialog.show();
	}
};
