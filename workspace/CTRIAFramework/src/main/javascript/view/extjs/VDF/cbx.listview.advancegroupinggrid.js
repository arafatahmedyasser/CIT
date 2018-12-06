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

Ext.ns('cbx.listview');

/**
 * <pre>
 * @class cbx.listview.advancegroupinggrid
 * @extends cbx.listview.simplepaginggrid 
 * 
 * This Class Creates advance grouping
 * grid with the support of aggregation function on all columns and
 * Pagination both on grouping columns values and the grouped data. The
 * class uses the plugin RowExpander and GridTotals for acheiving it.
 * </pre>
 */

cbx.listview.advancegroupinggrid = Ext.extend(cbx.listview.simplepaginggrid, {

	/**
	 * The method handleViewReady is attached to the listener "viewready" to
	 * update the empty message if no data has been recieved from the server.
	 */
	initComponent : function (){
		//Added  For Getting the most child record on context click and rowclick
		this.addEvents("onRowExpand","onRowCollapse","advGrpGridChildContextClick","advGrpGridChildRowClick");

		this.cls ='ADV_GROUP_GRID';
		this.on("viewready", this.handleViewReady, this);

		cbx.listview.advancegroupinggrid.superclass.initComponent.call(this);
	},
	/**
	 * This method updates the Empty data message in the grid.
	 */
	handleViewReady : function (){
		var rb = CRB.getFWBundle();
		var initialMsg = rb.LOADING;
		/**
		 * If there is no data as a result of applying a filter on the grid then
		 * the FILTER_NO_DATA_MSG will be displayed. Other wise NO_DATA_MSG will
		 * be displayed.
		 */
		if (this.getStore().baseParams.IS_FILTER_FORM && !this.isDataAvailable()) {
			this.view.emptyText = rb.FILTER_NO_DATA_MSG;

		}else {
			//this.view.emptyText = Ext.util.Format.trim(this.emptyText) !== '' ? this.emptyText : rb.NO_DATA_MSG;
			this.view.emptyText = initialMsg;
		}
		
		this.view.applyEmptyText();
	},
	/**
	 * This method is called after the grid is rendered in the screen. This
	 * attaches the listener for the grid store event "beforeload" This attaches
	 * the listener for the grid Expander plugin event "expand" It also renders
	 * the combos in the portlet if the view groups are modifible and also attch
	 * a listener to destroy the combo before the portlet is destroyed.
	 */
	afterRender : function (){

		var store = this.getStore();
		store.on('beforeload', this.onBeforeStoreLoad, this);
		this.expander.on('expand', this.onExpand, this);
		this.expander.on('collapse', this.onCollapse, this);
		this.getSelectionModel().lock();

		cbx.listview.advancegroupinggrid.superclass.afterRender.call(this);

		if ("Y" == this.isGroupModifiable && IMM.isAdvGroupView(vmd)) {
			var portlerRef = this.findParentByType('portlet');
			var windowRef = this.findParentByType('window');
			if(portlerRef)
				{
			portlerRef.on("beforedestroy", this.destroyGrpSelectorComp, this);
			
			if(portlerRef.getComponent(0).mwc){
				
				//To Destroy combo's on Tab-Change in Multi-Widget
				if(portlerRef.getComponent(0).mwc.activeTab){
					portlerRef.getComponent(0).mwc.activeTab.on("deactivate", this.destroyGrpSelectorComp, this);
				}
				//To Destroy combo's on Index-Change in Multi-Widget
				else if (portlerRef.getComponent(0).mwc.getComponent(1)){
					portlerRef.getComponent(0).mwc.getComponent(1).widgetInPanel.mv.on("destroy", this.destroyGrpSelectorComp, this);
				}
			}

			this.grpSelectorComp = this.getGrpSelectorComp();
			for ( var index = 0; index < this.grpSelectorComp.length; index++) {
				this.grpSelectorComp[index].render(portlerRef.header);
			}
				}
			else if(windowRef.el.hasClass('maxwindow'))
				{
				this.grpSelectorComp = this.getGrpSelectorComp();
				for ( var index = 0; index < this.grpSelectorComp.length; index++) {
					this.grpSelectorComp[index].render(windowRef.header);
				}
				
				}
		}

	},
	/**
	 * This returns the combo components which has the list of groupable columns
	 * with the grouped column selected. The user can change the grouped
	 * columns.
	 */
	getGrpSelectorComp : function (){
		var cmpArr = [];
		var groupCol = [];

		for ( var gpci = 0; gpci < this.groupableColumns.length; gpci++) {
			var columnId = this.groupableColumns[gpci].COLUMN_ID;
			var columnName = this.groupableColumns[gpci].FLD_COLUMN_DISPLAY_NAME_KEY;
			groupCol[gpci] = {};
			groupCol[gpci].COLUMN_ID = columnId;
			if (Ext.isEmpty(columnName)) {
				groupCol[gpci].FLD_COLUMN_DISPLAY_NAME_KEY = CRB.getBundle(this.bundle)["LBL_" + columnId];
			} else {
				groupCol[gpci].FLD_COLUMN_DISPLAY_NAME_KEY = CRB.getBundle(this.bundle)["LBL_" + columnName];
			}
		}

		for ( var index = 0; this.groupingColumns != null && index < this.groupingColumns.length; index++) {

			var groupStore = new Ext.data.JsonStore({
				fields : [ 'COLUMN_ID', 'FLD_COLUMN_DISPLAY_NAME_KEY' ],
				data : groupCol,
				autoLoad : true
			});

			cmpArr.push(new Ext.form.ComboBox({
				name : 'grouping' + index,
				store : groupStore,
				width : 100,
				valueField : 'COLUMN_ID',
				displayField : 'FLD_COLUMN_DISPLAY_NAME_KEY',
				typeAhead : true,
				mode : 'local',
				value : this.groupingColumns[index],
				lastValue : this.groupingColumns[index],
				triggerAction : 'all',
				emptyText : 'Group ' + index,
				selectOnFocus : true,
				listeners : {
					"select" : this.changeGrouping,
					scope : this
				}

			}));

		}
		return cmpArr;

	},
	/**
	 * The listener method to destroy the comboxes rendered in the portlet.
	 */
	destroyGrpSelectorComp : function (){
		for ( var index = 0; index < this.grpSelectorComp.length; index++) {
			Ext.destroy(this.grpSelectorComp[index]);
			delete this.grpSelectorComp[index];
		}
	},

	/**
	 * @params : store,params The Request for the grouped values and the grouped
	 *         data are differentiated using the PARAM "DATA_REQ_TYPE"
	 */
	onBeforeStoreLoad : function (store, options){
		Ext.apply(options.params, {
			DATA_REQ_TYPE : 'GRPDATA',
			REFRESH_DATA : 'Y'
		});
	},
	/**
	 * The function that expands all the row in the grouping
	 */
	expandAll : function (){
		this.expander.expandAll();
	},
	/**
	 * The function that collapse all the row in the grouping
	 */
	collapseAll : function (){
		this.expander.collapseAll();
	},

	/**
	 * The function that expand the first level grouoing.
	 */
	onExpand : function (expander, record, body, rowIndex){
		var values = record.data.GRP_HEADER.split("::::");
		record.groupHeaders = {};
		record.groupHeaders[values[0]] = values[1];
		this.getGrid(this, record.json.CHILD, Ext.get(this.getView().getRow(rowIndex)).child('.ux-row-expander-box'),
					cbx.clone(record.groupHeaders));
		this.fireEvent('onRowExpand',this,record.json,cbx.clone(record.groupHeaders));
	},
	
	onCollapse : function (expander, record, body, rowIndex){
		var values = record.data.GRP_HEADER.split("::::");
		this.fireEvent('onRowCollapse',this,cbx.clone(record.groupHeaders),values[0]);
	},
	/**
	 * The function that updates the columnmodel for the inner grid to get
	 * rendered. The property like id , xtype , width are updated.
	 */

	updateColModel : function (cols, groupHeaders, expander){

		var isRTL= iportal.preferences.isLangDirectionRTL();
		var key, level = 0;
		for (key in groupHeaders) {
			level++;
		}
		var newColModel = [];
		var index = 0;
		for ( var i in cols) {
			if (i == 0) {
				if (expander) {
					newColModel[index] = expander;
					index++;
					continue;
				}
			} else {
				var newObj = {};
				for ( var key in cols[i]) {
					if (key != 'scope' && key != 'isColumn' && typeof cols[i][key] != 'function') {
						if(!expander && key=="width"&& cols[i]["dataIndex"] != "GRP_HEADER" ){
							newObj[key]=cols[i][key]-2;
							}
							else{
							newObj[key] = cols[i][key];
							}
					}
				}
				if (Object.keys(newObj).length == 0) {
					continue;
				}
				newColModel[index] = newObj;
				if ("GRP_HEADER" == newColModel[index].dataIndex && !expander) {
					newColModel[index].dataIndex = newColModel[index].actualId
					newColModel[index].id = newColModel[index].actualId
				}
				if (!expander) {
					newColModel[index].xtype = newColModel[index].actualXtype
				}
				index++;
			}
		}
		if (expander) {
			newColModel[1].width = newColModel[1].width-(20*level);// - (newColModel[0].width * level);
		} else {
			newColModel[0].width = isRTL==true ? newColModel[0].width-(20*(level-1))-13 : newColModel[0].width-(20*(level-1))-1;// - (15 * level);
		}
		return newColModel;
	},
	/**
	 * Renders the Grouping value as new grid using row expander. This method is
	 * called iteratively till the child is reached that is the grouped data.
	 */
	getGrid : function (config, data, element, groupHeaders){

		var store = new Ext.data.JsonStore({
			fields : config.recordType,
			data : data
		});

		var expander = new Ext.ux.grid.RowExpander({
			tpl : '<div class="ux-row-expander-box"></div>',
			actAsTree : true,
			prevGroupHeader : cbx.clone(groupHeaders),
			triggerExpand : config.expander.triggerExpand,
			listeners : {
				expand : function (expander, record, body, rowIndex){
					if (!record.json.CHILD && "true" == record.json.IS_LEAF) {
						var values = record.data.GRP_HEADER.split("::::");
						record.groupHeaders = cbx.clone(expander.prevGroupHeader);
						record.groupHeaders[values[0]] = values[1];
						
						this.getChildGrid(expander.grid, record.json, Ext.get(expander.grid.getView().getRow(rowIndex))
									.child('.ux-row-expander-box'), cbx.clone(record.groupHeaders),this);
				        

					} else {

						var values = record.data.GRP_HEADER.split("::::");
						record.groupHeaders = cbx.clone(expander.prevGroupHeader);
						record.groupHeaders[values[0]] = values[1]; 
						this.getGrid(this, record.json.CHILD, Ext
									.get(expander.grid.getView().getRow(rowIndex)).child('.ux-row-expander-box'),
									cbx.clone(record.groupHeaders));
					}
					this.fireEvent('onRowExpand',this,record.json,cbx.clone(record.groupHeaders));
				},
				collapse : function (expander, record, body, rowIndex){
					var values = record.data.GRP_HEADER.split("::::");
					this.fireEvent('onRowCollapse',this,cbx.clone(record.groupHeaders),values[0]);
				},
				scope : this
			}
		});
		var newColModel = new canvas.listview.columnModel({
			columns : this.updateColModel(config.cols, groupHeaders, expander)
		});

		var that = this;
		
		var grid = new Ext.grid.GridPanel({
			store : store,
			colModel : newColModel,
			columns : newColModel,
			autoScroll : false,
			trackMouseOver : false,
			cols : config.cols,
			ctCls : 'ag-inner-grid',
			cls : 'ag-inner-grid-wrap',
			enableHdMenu : false,
			enableColumnMove : false,
			stripeRows : true,
			columnLines : true,
			border : false,
			expander : expander,
			width : '100%',
			autoHeight : true,
			hideHeaders : true,
			plugins : expander,
			listeners : {
				rowclick : function (grid, rowIndex, e){
					that.fireEvent('rowclick',grid, rowIndex, e);
				}
			}
		});

		grid.getSelectionModel().lock();

		element && grid.render(element);

		return grid;
	},
	/**
	 * Renders the Grouped data as new grid using row expander with pagination.
	 * The Pagination is acheived using the slider as the scroll for the grid
	 * panel.
	 */

	getChildGrid : function (config, data, element, groupHeaders,expanderScope){

		var newColModel = new canvas.listview.columnModel({
			columns : this.updateColModel(config.cols, groupHeaders, null)
		});
		var that=this;
		var jsonReader = new Ext.data.JsonReader({
			root : 'response.value.ALL_RECORDS',
			totalProperty : 'response.value.TOTAL_COUNT',
			id : 'id'
		}, this.recordType);

		var params = {
			"__LISTVIEW_REQUEST" : "Y",
			"PAGE_CODE_TYPE" : 'VDF_CODE',
			"INPUT_ACTION" : "INIT_DATA_ACTION",
			"PRODUCT_NAME" : this.productCode,
			"INPUT_FUNCTION_CODE" : this.functionCode,
			"INPUT_SUB_PRODUCT" : this.subProductCode,
			"WIDGET_ID" : this.itemId.substring(0, this.itemId.indexOf("__GRID")),
			"VIEW_ID" : this.view_id,
			"forceCallbacks" : true,
			"DATA_REQ_TYPE" : 'CHILDDATA',
			"GROUP_FILTERS" : Ext.encode(groupHeaders),
			
			"LAYOUT_ID" :iportal.workspace.metadata.getCurrentLayoutId(),
			"WORKSPACE_ID" :iportal.workspace.metadata.getCurrentWorkspaceId()
			
		};

		var store = new cbx.grid.Store({
			autoLoad : false,
			bufferSize : 45,
			baseParams : params,
			url : iportal.listview.listviewconstants.AJAX_URL,
			reader : this.jsonReader
		});

		var grid = new cbx.grid.GridPanel({
			store : store,
			flex : 1,
			colModel : newColModel,
			columns : newColModel,
			autoScroll : false,
			ctCls : 'ag-inner-grid-final',
			cls : 'ag-inner-grid-wrap-final',
			enableHdMenu : false,
			enableColumnMove : false,
			stripeRows : true,
			columnLines : true,
			border : false,
			width : '100%',
			autoHeight : true,
			hideHeaders : true,
			initComponent : function (){
				cbx.grid.GridPanel.superclass.initComponent.call(this);
				var viewConfig = {
					forceFit : false,
					nearLimit : iportal.systempreferences.getLiveGridNearLimit(),
					loadMask : false,
					autoFill : false
				};
				this.view = new cbx.simplegrid.gridview(viewConfig);
			}
		});
		
		grid.on('contextmenu', function (event, target, options)
							{
							event.stopEvent();
							that.childGridRowContext(grid,event,expanderScope);
							}, grid);
					
		grid.on('rowclick', function (grid, rowIndex, event)
					{
					event.stopEvent();
					that.childGridRowClick(grid, rowIndex, event,expanderScope);
					}, grid);					
		
		

		var slider = new Ext.Slider({
			width : 20,
			height : 100,
			style : {
				bottom : '0px',
				right : '0px',
				left : 'auto',
				position : 'relative'
			},
			flex : 1,
			hidden : true,
			vertical : true,
			cls : 'ag-grid-slider',
			minValue : 0,
			maxValue : 0,
			value : 0,
			listeners : {
				'drag' : function (){
					grid.setPosition(0, slider.getValue());
				},
				'changecomplete' : function (){
					grid.setPosition(0, slider.getValue());
				}
			}
		});
		grid.getStore().on('load', function (){
			if (grid.el.getHeight() > slider.height) {
				slider.setMinValue(0 - (grid.el.getHeight() - slider.height));
				slider.setValue(0);
				grid.ownerCt.doLayout();

				var task = new Ext.util.DelayedTask(function (){
					if (slider.needToBeShown) {
						slider.show();
						grid.ownerCt.doLayout();
					}
				}, this, [ true ]);
				task.delay(100);
			}else{
				grid.ownerCt.setHeight(grid.el.getHeight());
				if(grid && grid.expander){
				grid.expander.setHeight(grid.el.getHeight());
				}
			}
			grid.ownerCt.doLayout();
		});
		element.on('mouseenter', function (){
			if (slider.rendered && grid.el.getHeight() > slider.height) {
				slider.show();
				//grid.ownerCt.doLayout();
			} else {
				slider.needToBeShown = true;
			}
		});
		element.on('mouseleave', function (){
			if (slider.rendered && grid.el.getHeight() > slider.height) {
				slider.hide();
				//grid.ownerCt.doLayout();
			} else {
				slider.needToBeShown = false;
			}
		});
		element.on('mousewheel', function (event){
			slider.setValue(slider.getValue() + (event.getWheelDelta() * 10))
			slider.fireEvent('changecomplete');
			event.stopEvent();
		});
		Ext.apply(slider, {
			onDrag : function (e){
				var pos = this.innerEl.translatePoints(this.tracker.getXY());
				var bottom = this.innerEl.getHeight() - pos.top;
				this.setValue(this.minValue + Math.round(bottom / this.getRatio()), false);
				this.fireEvent('drag', this, e);
			},
			onClickChange : function (local){
				if (local.left > this.clickRange[0] && local.left < this.clickRange[1]) {
					var bottom = this.innerEl.getHeight() - local.top;
					this.setValue(this.minValue + Math.round(bottom / this.getRatio()), undefined, true);
				}
			}
		});
		var panel = new Ext.Container({
			height : 100,
			hideHeaders : true,
			layout : 'hbox',
			items : [ grid ],
			applyTo : element

		});
		panel.add(slider);
		store.load();
		return grid;
	},
	
	childGridRowContext:function(grid,e,expander){
		var target = e.getTarget(),
		view=grid.getView(),
		row, cell, col;
		row = view.findRowIndex(target);
		if (row !== false) {
		cell = view.findCellIndex(target);
		if (cell !== false) {
		col = grid.colModel.getColumnAt(cell);			
		expander.fireEvent('advGrpGridChildContextClick', grid, row, e);			
		}
		}		
	},	
	childGridRowClick:function(grid,row,e,expander){		
		expander.fireEvent('advGrpGridChildRowClick', grid, row, e);
	},
	
	/**
	 * This method validates the position according to the relative position
	 * configured,if the groups are modified.
	 */
	validateSelection : function (group){

		var relPosOfCol = this.relPosOfCol;

		var rb = CRB.getFWBundle();
		// No two Values are same

		var removedDuplicatedGroup = group.unique();

		if (removedDuplicatedGroup.length != group.length) {
			this.showMessage(rb.WAR_CANT_SAME);
			return false;
		}

		for (key in relPosOfCol) {

			var value = relPosOfCol[key];

			// First should be this column
			if ("FIRST" == value) {

				if (group.indexOf(key) > 0) {
					this.showMessage(rb.WAR_COLMN + " " + key + " " + rb.WAR_SHLD_FIRST);
					return false;
				}

			}
			// Second should be this column
			else if ("LAST" == value) {
				if (group.indexOf(key) > -1 && group.indexOf(key) != group.length - 1) {
					this.showMessage(rb.WAR_COLMN + " " + key + " " + rb.WAR_SHLD_LAST);
					return false;
				}
			}
			// This Column should be after this column
			else if (value.startsWith("BEFORE_")) {

				var col = value.substring(6, value.length);

				if (group.indexOf(key) > -1 && group.indexOf(col) > -1 && group.indexOf(key) < group.indexOf(col)) {
					this.showMessage(rb.WAR_COLMN + " " + key + " " + rb.WAR_SHLD_BEFORE + " " + col);
					return false;
				}

			}
			// This Column Should be before this column
			else if (value.startsWith("AFTER_")) {

				var col = value.substring(6, value.length);

				if (group.indexOf(key) > -1 && group.indexOf(col) > -1 && group.indexOf(key) > group.indexOf(col)) {
					this.showMessage(rb.WAR_COLMN + " " + key + " " + rb.WAR_SHLD_AFTER + " " + col);
					return false;
				}

			}
		}

		return true;

	},
	/**
	 * To show the the Warning message that selected groups are not valid.
	 */
	showMessage : function (msg){
		Ext.Msg.alert('Warning', msg);
	},
	/**
	 * This updates the grouping found in the grid panel.
	 */
	changeGrouping : function (cmp, selec){

		if (cmp.lastValue == cmp.getValue()) {
			return;
		}

		var groups = [];

		for ( var index = 0; index < this.grpSelectorComp.length; index++) {
			groups[groups.length] = this.grpSelectorComp[index].getValue();
		}

		if (false == this.validateSelection(groups)) {
			cmp.suspendEvents(false);
			cmp.setValue(cmp.lastValue);
			cmp.resumeEvents();
			return;
		}

		var params = {};

		params["GROUPS"] = Ext.encode({
			"COLUMN_IDS" : groups
		});

		if (this.rendered) {
			var grdstr = this.getStore();
			Ext.apply(grdstr.baseParams, params);
			grdstr.load();
		}

	}

});

Ext.reg('advgroupinggrid', cbx.listview.advancegroupinggrid);