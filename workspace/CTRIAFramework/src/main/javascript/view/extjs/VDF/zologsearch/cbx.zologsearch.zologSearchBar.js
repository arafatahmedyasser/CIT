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
Ext.namespace('cbx.zologsearch');
/**
 * This class is responsible to create and render Zolog Search Combo and to load
 * it's store.
 * 
 */


cbx.zologsearch.zologSearchBar = function (){

	this.zologSearchStore = canvas.metadata.zolog.getZologMetadata();
	this.getSearchComp = function (){
		var cons = cbx.zologsearch.constants;
		var rb = CRB.getBundle('common');
		
		var that=this;
		var zologSearchCombo = {
			xtype:'combo',
			editableField : true,
			readOnly : false,
			name : cons.ZOLOG_SEARCH+"_"+Ext.id(),
			border : false,
			includeSelectOnSingleValue : false,
			includeSelect : false,
			mode:'local',
			store: new Ext.data.SimpleStore({
				data: that.loadZologComboStore(),
				fields: ['key', 'value']
			}),
			valueField: 'key',
			displayField: 'value',
			selectOnFocus : false,
			triggerAction: 'all',
			fireEventOnSingleSelect : false,
			emptyText : rb['ZOLOG_EMPTY_TEXT'],
			labelSeparator : '',
			hideLabel : true,
			forceSelection : false,
			height : 22,
			width : 200, 
			listeners : {
				scope : this,
				
				/**
				* @param obj- Combo box object.
				*/
				'beforeselect': function(obj){
				/* To avoid concurrent opening of multiple forms combo box 
				   is set to read only and collapse */
				   
					obj.setReadOnly(true);
					obj.collapse();
					obj.el.blur();
				},
				'select' : function(obj){
					obj.el.blur();
					/*Combo box is reset to editable format after a delay.
					  This restricts the user to concurrently search */
					var resetReadOnly = function(el) {
			            		el.setReadOnly(false);
			        		};
					resetReadOnly.defer(15,this,[obj]);
					this.comboClickHandler(obj); 
					obj.reset();
					}  
				
			 
			}
		};

		//this.loadZologComboStore(currId);

		return zologSearchCombo;

	};
	this.loadZologComboStore = function (){

		var zologSearchKey = [];
		var zologSearchValue = [];
		var rowArray = [];
		var dataArray = [];
		var zologMetaStore = this.zologSearchStore;
		var cons = cbx.zologsearch.constants;
		var rb = CRB.getBundle('common');
		//Getting Current Workspace Id
		//var wsId= iportal.workspace.metadata.getCurrentWorkspaceId();
		for ( var z = 0, len = zologMetaStore.length; z < len; z++) {
			rowArray=[];
			rowArray.push(zologMetaStore[z]);
			if (zologMetaStore[z].ITEM_TYPE == cons.WIDGET) {
				var displayName=rb[zologMetaStore[z].DISPLAY_KEY_NM]?rb[zologMetaStore[z].DISPLAY_KEY_NM]:DISPLAY_KEY_NM;
				rowArray.push(displayName);
			} else if (zologMetaStore[z].ITEM_TYPE == cons.FORM) {
				rowArray.push(zologMetaStore[z].DISPLAY_KEY_NM);
			}						
			dataArray.push(rowArray);
		}
		
		return dataArray;

	};

	this.comboClickHandler = function (config){
		var cons = cbx.zologsearch.constants;
		//Getting Current Workspace Id
		//var wsId= iportal.workspace.metadata.getCurrentWorkspaceId();
		try {
			var zologHandler = new cbx.zologsearch.zologSearchHandler(config);
		}catch (err) {
			//handle error
			LOGGER.error('Widget file has not been loaded.');
		}
		 
		//Ext.getCmp(cons.ZOLOG_SEARCH_COMBO+wsId).setValue('');
		 
	 	//	Ext.getCmp(cons.ZOLOG_SEARCH_COMBO+wsId).reset();  
//		Ext.FocusManager.disable();
	};

};
