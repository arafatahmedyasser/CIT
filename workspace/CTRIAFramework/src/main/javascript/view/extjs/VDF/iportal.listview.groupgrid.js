/** * Copyright 2014. Intellect Design Arena Limited. All rights reserved.  *  * These materials are confidential and proprietary to Intellect Design Arena  * Limited and no part of these materials should be reproduced, published, transmitted * or distributed in any form or by any means, electronic, mechanical, photocopying,  * recording or otherwise, or stored in any information storage or retrieval system  * of any nature nor should the materials be disclosed to third parties or used in any  * other manner for which this is not authorized, without the prior express written  * authorization of Intellect Design Arena Limited. *  *//** * iportal.listview.groupgrid * * @copyright (c) 2011, by Intellect Design Arena Limited. * @date      2. April 2011 * @version   0.1 */
Ext.namespace('iportal.listview');
iportal.listview.groupgrid = Ext.extend(Ext.grid.GridPanel, {
	//Either an Array of field definition objects as passed to Ext.data.Record.create, or a Record constructor created using Ext.data.Record.create.
	recordType : [],
	//The bottom tool bar of the panel. This can be a Ext.Toolbar object, a toolbar config, or an array of buttons/button configs to be added to the toolbar
	buttonBar :null,
	//extraParamsHandler needs to invoke to submit Extra parameters as part of request params while grid component retrieving data from server
	extraParamsHandler :null,
	//
	scrollNotRequired: false,
	productCode:"",
	subProductCode:"",
	functionCode:"",
	checkboxselection:false,
	
	//An function needs to executes when a row is selected.
	rowSelectEvent:"",
	cellActions :null, 
	filterparams : null,
	groupingColumns : null,
					sortConfig : null, 
					groupingField:null,// Grouping Grid Upgrade 
	loadHandler: Ext.emptyFn,
	highlightHandler : Ext.emptyFn,
	initComponent : function(){    		
		
		var rb = CRB.getFWBundle(); 
		var cuser = CRB.getFWBundle(); 
		this.on("viewready", this.handleViewReady, this);// attaching the 'viewready' event to the groupgrid
		
		var selectionModel = new canvas.grid.RowSelectionModel({						singleSelect : true					});							if('CELLSINGLE' === this.selectionType){			selectionModel = new canvas.grid.CellSelectionModel({singleSelect:true});		}else if('CELLMULTI' === this.selectionType){			selectionModel = new canvas.grid.CellSelectionModel({singleSelect:false});		}			if (this.checkboxselection == true) {			selectionModel = new canvas.grid.CheckboxSelectionModel(					{						singleSelect : false					});		}		if (!Ext.isEmpty(this.rowSelectEvent)) {			selectionModel.addListener("rowselect",					this.rowSelectEvent, this);		}							if('CELLSINGLE' === this.selectionType){						selectionModel = new canvas.grid.CellSelectionModel({singleSelect:true});				}		var extraParams = {
			"__LISTVIEW_REQUEST":"Y",
			"PAGE_CODE_TYPE" :'VDF_CODE', 
			"INPUT_ACTION" :  "INIT_DATA_ACTION",
			"PRODUCT_NAME" :  this.productCode,
			"INPUT_FUNCTION_CODE" :  this.functionCode,
			"INPUT_SUB_PRODUCT" :  this.subProductCode,
			"WIDGET_ID":this.itemId.substring(0,this.itemId.indexOf("__GRID")),
			"VIEW_ID":this.view_id,
						"LAYOUT_ID" :iportal.workspace.metadata.getCurrentLayoutId(),			"WORKSPACE_ID" :iportal.workspace.metadata.getCurrentWorkspaceId(),						"forceCallbacks":true
		};
		
		if (!Ext.isEmpty(this.filterparams)) {
			for (each in this.filterparams){
				extraParams[each] = this.filterparams[each];
			}
			
		}
		
		var that=this;
		
		this.eqccyCfg = {'EQUIV_AMT':this.eqlCcyhandler.createDelegate(this)},
		this.selectedCcy = iportal.preferences.getEquivalentCurrency(); 
		
		this.setScrollNotRequired = function(autoHeight)
		{
			
			this.scrollNotRequired = autoHeight;
		}
		
		
		//if application specific extraParamsHandler is given , frmaemwork invokes the handler to append above extraParams with the application specific required params entries.
		function getExtParams(param){			if(!Ext.isEmpty(param)){			    var extParams =param.apply(that, [ extraParams ]);//param(extraParams);				if (!Ext.isEmpty(that.filterparams)) {				    for (each in that.filterparams){				    	extParams[each] = that.filterparams[each];			    	}			    }			    return extParams;			}else{				return extraParams;			}			}		
		/*
		* To display emptyText in List View if a customised message
		* to be passed
		*/
		var emptyTextMsg = rb.LOADING;
		if(Ext.util.Format.trim(this.emptyText) !== '') 
				emptyTextMsg = this.emptyText;
		// groupgrid
		this.jsonReader = new Ext.data.JsonReader({
	  		root            : 'response.value.ALL_RECORDS',
	  		totalProperty   : 'response.value.TOTAL_COUNT',
	  		id              : 'id'
		}, this.recordType);
		
	
		function doBeforeLoad (store, options){
			var params = getExtParams(that.extraParamsHandler);
			Ext.apply(options.params, params);
		}
		
		
		/**
		 * This intended to hide and remove REFRESh_DATE property from request params if available
		 */
		function doAfterLoad(store, records){
		var rb= CRB.getBundle(store.bundle);
		/*	
			if(records.length>0){
				var keys=[];
				var obj=records[0].json;
				var str="";
				if(obj!=null){
					for(key in obj){
						var value=obj[key];
						var label= rb["LBL_"+value];
						if(null!=label){
							keys.push(key);
							str+="record.data['"+key+"']= null!=rb['LBL_'+obj['"+key+"']]?rb['LBL_'+obj['"+key+"']]:obj['"+key+"'];";
						}
					}
				}
				if(keys.length>0){
					for(i=0; i<records.length; i++){
						try{
							var record=records[i];
							var obj=record.json;
							eval(str);
							record.commit();
						}catch(e){}
					}
				}
			}
			*/
			// To Display Disclaimer Text above the footer layer starts
		
			var rb = CRB.getFWBundle(); 
			if (records.reader
					&& records.reader.jsonData
					&& records.reader.jsonData.response
					&& records.reader.jsonData.response.value
					&& records.reader.jsonData.response.value.ADDITIONAL_DATA
					&& records.reader.jsonData.response.value.ADDITIONAL_DATA.ENTL_ERROR) {
				if (rb[records.params['WIDGET_ID']
						+ "_ENTL_ERROR"]) {
					that.view.emptyText = rb[records.params['WIDGET_ID']
							+ "_ENTL_ERROR"];
				} else {
					that.view.emptyText = rb[records.reader.jsonData.response.value.ADDITIONAL_DATA.ENTL_ERROR];
				}
				that.view.applyEmptyText();
			}
	
							else if(this.baseParams.IS_FILTER_FORM && !that.isDataAvailable()){								var widgetResBundle = CRB.getBundle(that.bundle);								if(widgetResBundle[that.systemViewId+"_FILTER_NO_DATA_MSG"]){ 									that.view.emptyText = widgetResBundle[that.systemViewId+"_FILTER_NO_DATA_MSG"];								}else{									that.view.emptyText = rb.FILTER_NO_DATA_MSG;								}
							}
							/** Can give widget oriented empty text in the grid, if the widget do have any records to show.*/
							else if(records.length == 0|| Ext.isEmpty(that.jsonReader.jsonData.response.value.ALL_RECORDS)){
								var widgetResBundle = CRB.getBundle(CRB[that.productCode]);
								if(widgetResBundle[that.systemViewId+"_NO_DATA_MSG"]){
									that.view.emptyText = widgetResBundle[that.systemViewId+"_NO_DATA_MSG"];
								}
								else{
									that.view.emptyText = Ext.util.Format.trim(that.emptyText) !== ''?that.emptyText:rb.NO_DATA_MSG;
								}
								that.view.applyEmptyText();
							}
							else if(!Ext.isEmpty(that.jsonReader.jsonData.response.value.ADDITIONAL_DATA.LBL_EMPTY_TEXT))
							{	var emptyTextLabel=that.jsonReader.jsonData.response.value.ADDITIONAL_DATA.LBL_EMPTY_TEXT;
								emptyTextMsg=null==rb[emptyTextLabel]?rb['NO_DATA_MSG']:rb[emptyTextLabel];
								that.view.emptyText =emptyTextMsg;
							}
							
			var panelId = that.id.replace('__GRID','_PANEL');
			
			if(this.baseParams.REFRESH_DATA) 
				delete this.baseParams.REFRESH_DATA;
						that.view.applyEmptyText(); 

			}
		doAfterLoad= doAfterLoad.createSequence(this.loadHandler);

						/* Grouping Grid Upgrade */
						/* The groupfield value should be maintained as part of the component itself 
														to set it back to the state when it is rendered back*/

						if (this.groupingColumns != null
								&& this.groupingColumns.length > 0) {
							this.groupingField = this.groupingColumns[this.groupingColumns.length - 1];
						}
				
		this.store = new Ext.data.GroupingStore({
			//CTCBXQ215F01 Starts			  autoLoad   : false,			  _autoLoad : true,
			//CTCBXQ215F01 ends            baseParams : getExtParams(this.extraParamsHandler),
            reader     : this.jsonReader,
            bundle	   : this.bundle,
            url        : iportal.listview.listviewconstants.AJAX_URL,
							groupField : this.groupingField,// Grouping Grid Upgrade 
							sortInfo : this.sortConfig,														remoteGroup:true,														remoteSort:true,
														remoteGroup:true,														remoteSort:true,            listeners : {"load":doAfterLoad,'loadexception':doAfterLoad, "beforeload" : doBeforeLoad
            	}
        });
		this.selModel = selectionModel;
		var colListLength = this.columnList.length;
		if(Ext.isEmpty(colListLength)){
			colListLength=0;
		}
		if(!Ext.isEmpty(this.columnList.length) && this.columnList.length > 0){
			if(colListLength > 10){
				this.autoExpandColumn = this.columnList[colListLength-1];
				this.autoExpandMin = 150;
			}
		}
		
		/* To add min and max expand column value, restricting the last column resize range*/
			this.autoExpandMax=500 
		 	this.autoExpandMin=150
		
						/* Grouping Grid Upgrade */
						/* 
						*	The IntialBehavior is the starting behavior of the 
						*	grouping grid . EA - Expand All , CA - Collapse All
						*   EFR - Expand First Row.
						*   startCollapsed should be true for both CA and EFR
						*	expandFirstRow should be true for EFR 	 
						*/
						var startCollapsed = true;
						var expandFirstRow = false;
						
						if ('EA' === this.initialBehavior) {
							startCollapsed = false;
						}else if ('EFR' === this.initialBehavior){
							expandFirstRow = true;
						}
						
						
						var viewConfig = {
							groupingIndex :{},//groupingIndex is to maintain the start row of all the groups with groupids
						    enableGroupingMenu : false,
							startCollapsed :  startCollapsed,
							enableGrouping:true,
							expandFirstRow:expandFirstRow,
							enableNoGroups:false,
							autoFill : false,// visibleColumnCount>10?false:true,
							forceFit : false, // visibleColumnCount>10?false:true,
							emptyText : emptyTextMsg,
							loadMask : {
								msg : rb.LOADING_MSG
							},
							/** If the expandFirstRow is true and the buffer length ( the Grids' html)
							 * 	is 0 , then the Cls is set as empty and the state is set as true
							 *	to indicate the first row is alone expanded.
							 *  The groupingIndex is updated with the start row index here
							 **/
							doGroupStart : function(buf, g, cs, ds, colCount){
								if(true == expandFirstRow & buf.length ==0){
									g.cls = '';
									this.state[g.groupId] = true;
								}
								buf[buf.length] = this.startGroup.apply(g);
						        this.groupingIndex[g.groupId] =g.startRow;
						    },
							/**
							*	The process event is overriden to select all the grouped records when the checkbox in its 
							*   header is clicked using the field groupingIndex
							**/
							processEvent: function(name, e){
						        Ext.grid.GroupingView.superclass.processEvent.call(this, name, e);
						        
						        
						        var hd = e.getTarget('.x-grid-group-hd', this.mainBody);
						        
						        if(hd){
						        	var
						        	field = this.getGroupField(),
						        	prefix = this.getPrefix(field),
						        	groupValue = hd.id.substring(prefix.length),
					                emptyRe = new RegExp('gp-' + Ext.escapeRe(field) + '--hd'),
						        	groupValue = groupValue.substr(0, groupValue.length - 3);
						            
						        	if(name == 'mousedown' && e.button == 0){
								        	var selLink = e.getTarget('a.glink');
								        	if(selLink){
								        		var selEle = Ext.get(selLink);
								        		var checked = true;
								        		
								        		if(selEle.hasClass('deselected')){
								        			selEle.removeClass('deselected');
								        			selEle.addClass('selected');
								        			checked = true;
								        		}else{
								        			selEle.removeClass('selected');
								        			selEle.addClass('deselected');
								        			checked = false;
								        		}
								        		var grid = this.grid;
								        		var groupingStartRow = this.groupingIndex[prefix+groupValue];
								        	    var rec;
								        	    for(i=groupingStartRow;;i++){
								        	    	rec = this.grid.getStore().getAt(i);
								        	    	if(prefix+groupValue == rec._groupId){
								        	    		if(checked){
								        	    			grid.getSelectionModel().selectRow(i,true);	
								        	    		}else{
								        	    			grid.getSelectionModel().deselectRow(i);
								        	    		}
								        	    		
								        	    	}else{
								        	    		break;
								        	    	}
								        		};	
								        	    
								        		return;
								        	}
						        	}
						            if(groupValue || emptyRe.test(hd.id)){
						                this.grid.fireEvent('group' + name, this.grid, field, groupValue, e);
						            }
						            if(name == 'mousedown' && e.button == 0){
						                this.toggleGroup(hd.parentNode);
						            }
						        }

						    },
						    toggleNthGroup : function(gpindex,expanded){
						        var groups = this.getGroups();
					            this.toggleGroup(groups[gpindex], expanded);
						    },
							// scrollOffset : 18,
							// custom grouping text template to display the
							// number of items per group
						    groupTextTpl : cbx.isEmpty(this.groupgridTextTpl) ? '{[values.rs[0].data["'+this.groupingField+'"]]}({[values.rs.length]})' : this.groupgridTextTpl,


							autoExpand : function(preventUpdate) {
								try {
									var g = this.grid, cm = this.cm;

									if (!this.userResized && g.autoExpandColumn) {
										var tw = g.tw || cm.getTotalWidth(false);
										if (g.tw == null) {
											g.tw = tw;
										}
										var aw = this.grid.getGridEl().getWidth(true) - this.getScrollOffset();
										/*
										 *  Resetting the width of
										 * all the columns to average width to have equal size columns
										 */
										var totalWidth = tw > aw ? tw : aw;
										totalWidth = totalWidth - 10;
										var totalColumns = this.cm.getColumnCount(true);
										/**
										 * Code for excludig all the columns with fixed width aout of
										 * the auto expand logic.
										 */
										var fixedColumn = this.getFixedColumnStats();
										totalColumns = totalColumns - fixedColumn.totalColumns;
										totalWidth = totalWidth - fixedColumn.totalWidth;
										var avgWidth = totalWidth / totalColumns;
										g.autoExpandMax = avgWidth - 1
										if (!Ext.isEmpty(this.cm.columns)) {
											for ( var index = 0; index < this.cm.columns.length; index++) {
												if (!Ext.isEmpty(this.cm.columns[index])) {
													if (this.cm.columns[index].hidden === false) {
			            										cm.setColumnWidth(index, Math.floor(avgWidth), false);	
													}
												}
											}
										}

										if (tw < aw) {
											var ci = cm.getIndexById(g.autoExpandColumn);
											var currentWidth = cm.getColumnWidth(ci);
											var cw = Math.min(Math.max(((aw - tw) + currentWidth), g.autoExpandMin), g.autoExpandMax);
											if (cw != currentWidth) {
												cm.setColumnWidth(ci, cw, true);
												if (preventUpdate !== true) {
													this.updateColumnWidth(ci, cw);
												}
											}
										}
									}
									else{
										this.updateHeaders(); 
										this.updateHeaderSortState();
									}
									
								} catch (e) {
								}
							},
							/**
							 * Method is indended to return the total columns and width used for all the
							 * columns marked as fixed within the view.
							 */
							getFixedColumnStats : function (){
								var totalWidth = 0;
								var totalColumns = 0;
								for ( var index = 0; index < this.cm.columns.length; index++) {
									if (!Ext.isEmpty(this.cm.columns[index]) && this.cm.columns[index].fixed) {
										totalWidth += this.cm.columns[index].width;
										totalColumns++;
									}
								}
								return {
									totalWidth : totalWidth,
									totalColumns : totalColumns
								};
							}
						};

					
						this.fireEvent('highlight', this.store, viewConfig);
						this.view = new Ext.grid.GroupingView(viewConfig);
						
						
						/* Grouping Grid Upgrade */
		this.ctCls='list-view cbx-groupgrid-panel';
		this.stripeRows=true;
		this.width='auto';
		//this.height = 210; //Removed for the resize height problem
		this.autoHeight = this.scrollNotRequired;
						/* Grouping Grid Upgrade */
						if (this.enableHdMenu == null || this.enableHdMenu == 'undefined') {
							this.enableHdMenu = true;
						}
						
		//this.enableColumnMove =true; 
        this.enableDragDrop	= false;
        this.columnLines=true;
        this.plugins = this.cellActions;
        
        this.addEvents('statechange','currencychange');
        this.stateful = true;
        if(!this.stateEvents){
        	this.stateEvents = [];
        }
        this.stateEvents.push('statechange');
	    this.stateId = this.itemId + '_'+this.view_id+'_GV';
        iportal.listview.groupgrid.superclass.initComponent.call(this);
    },
   updateCcyInHeader :function(ccycode){
   		var spanHeaderIcon = Ext.get(this.id+'_SPAN_$$$');
		if(spanHeaderIcon && !(~spanHeaderIcon.dom.innerHTML.indexOf(ccycode))){
			spanHeaderIcon.dom.innerHTML = '&nbsp;'+ccycode;
			return true;
		}
		return false;
   },       /**	 * The Method Responsible for getting the params from the component which holds the source of list view data	 */   
   getPrintData : function(){
   		var store = this.store || this.getStore();
   		return store.baseParams;
   },
   eqvtHeaderClicked : function(item,evt){
   		this.fireEvent('currencychange',this.id.substring(0,this.id.indexOf("__GRID"))+"_"+this.view_id,item.text);
		this.getStore().baseParams['CURRENCY_CD'] = item.text;	
		this.selectedCcy = item.text;
		var spanHeaderIcon = Ext.get(this.id+'_SPAN_$$$');
		if(this.updateCcyInHeader(item.text)){
			this.reloadData();
		}
		this.fireEvent( 'statechange' , this );
   },
					/* Grouping Grid Upgrade */
					getState : function() {
						var that = this;
						var colProperties = [];
						var columns = this.getColumnModel().columns;
						var col;
						var sortInfo = this.getStore().sortInfo;
						sortInfo['position'] = 1;
						// Getting the column changes (visibility and
						// position changes)
						for (i = 0; i < columns.length; i++) {
							col = columns[i];
							var colProp = {};
							colProp['_id'] = col.id;
							colProp['_hidden'] = (col.hidden == true) ? 'Y' : 'N';
							colProp['_dataindex'] = col.dataIndex;
							colProp['_position'] = i + 1;
							colProperties.push(colProp);
						}

						// Getting the Filter details
						var filterBaseParams = this.store.baseParams;
						var totalFilters = filterBaseParams.COLUMN_COUNT;
						var colFilters = [];
						for (i = 1; i <= totalFilters; i++) {
							var colFilter = {};
							colFilter['_constraint'] = filterBaseParams['FILTER' + i + '_CONSTRAINT'];
							colFilter['_field'] = filterBaseParams['FILTER' + i + '_FIELD'];
							colFilter['_value_date'] = filterBaseParams['FILTER' + i + '_VALUE_DATE'];
							colFilter['_value_date2'] = filterBaseParams['FILTER' + i + '_VALUE_DATE2'];
							colFilter['_value_time'] = filterBaseParams['FILTER' + i + '_VALUE_TIME'];
							colFilter['_value_time2'] = filterBaseParams['FILTER' + i + '_VALUE_TIME2'];
							colFilter['_value_txt'] = filterBaseParams['FILTER' + i + '_VALUE_TXT'];
							
							/**
							 * In case the filter applied is on Last N
							 * Period then override the default value to
							 * be saved
							 */
							if (filterBaseParams['FILTER' + i + '_VALUE_PERIOD']) {
								colFilter['_value_txt'] = filterBaseParams['FILTER' + i + '_VALUE_PERIOD'];
							}
						
							colFilters.push(colFilter);
						}

						// Creating the state object
						var _state = {};
						if (_state) {
							// Code added append the currency
							// value on live grid's filter baseparams
							if(filterBaseParams.CURRENCY_CD){
								_state['_gvOpt'] = {
									'eqvt_ccy' : filterBaseParams.CURRENCY_CD
								};
							}
							_state['_sortInfo'] = sortInfo;
							_state['_colProperties'] = colProperties;
							_state['_colFilters'] = colFilters;
						} else {
							// Code added append the currency
							// value on live grid's filter baseparams
							_state = {
								'_gvOpt' : {
									'eqvt_ccy' : (filterBaseParams.CURRENCY_CD ? filterBaseParams.CURRENCY_CD
												: null)
								},
								'_sortInfo' : that.getStore().sortInfo,
								'_colProperties' : colProperties,
								'_colFilters' : colFilters
							};
						}
						return _state;
					},
					/* Grouping Grid Upgrade */
   eqlCcyhandler : function(){
   		var headerIcon =Ext.get(this.id+'_IMG_$$$')
		if(headerIcon){  
			var currencyList = iportal.preferences.getRatecardCurrencies();
			if((currencyList!=null && currencyList.length > 0)){
				var ccyMenu = new Ext.menu.Menu({minWidth:50});			
				for(index=0; index<currencyList.length; index++){
					ccyMenu.addMenuItem({
						text:currencyList[index],
						handler:this.eqvtHeaderClicked, 
						scope : this
					});
				}
				ccyMenu.show(headerIcon,'br'); 
			}
		}
	},
    /**
     * Intended to add REFRESH_DATA = Y to base params and reload Store.
     * P.S REFRESH_DATA this will be deleted after data load success/failure.
     */
    reloadData:function(){
    	var store = this.getStore();
    	store.baseParams['REFRESH_DATA']='Y';
    	store.removeAll();    	store.load();
    },
     
	/**
	 * Intended to provide the selected record in the
	 * grid to the caller. This would only work when a
	 * selection model is implemented on the live grid.
	 */
	getSelectedData : function (){
		var selectedRecordList = new Array();
		var selModel = this.getSelectionModel();
		if (selModel != null) {
		
			var nSelectRowCount = selModel.getCount();
			/*
			 * if records are selected in the grid,
			 * their values are retrieved and returned
			 */
			if (nSelectRowCount > 0) {
				selectedRecordList = selModel.getSelections();
			}
		}
		return selectedRecordList;
	
	},
    /**
    * Intended to check whether store has data or not.
    * Return true if available else false;
    */
    isDataAvailable :function(){
    	if(this.getStore().getCount()>0){
    		return true;
    	}
    	return false;	
    },
					
					onRender : function(ct, position) {
						var _laststate = Ext.state.Manager.get(this.getStateId(), 'NOT FOUND');
						if (Ext.type(_laststate) === 'object') {
							var item = {};
							item['text'] = _laststate._gvOpt ? _laststate._gvOpt.eqvt_ccy : null;
							this.getStore().baseParams['CURRENCY_CD'] = item.text;
							this.selectedCcy = item.text;
							this.updateGridFiltersFromState();							if(_laststate.viewTitle){								  this.ownerCt.mvh.updateViewTitle(_laststate.viewTitle);  							  }
 							this.getStore().sortInfo = this._sortInfo;					           Ext.state.Manager.clear(this.getStateId());						}

							else {						if (this.sortConfig) {
							this.getStore().sortInfo = this.sortConfig;
						}
						
							}						if (this.groupingField) {
							this.getStore().groupField = this.groupingField;
						}

							this.setFilters();
							this.updateColumnHeaders();
							//this.updateColumnsState();							iportal.listview.groupgrid.superclass.onRender.apply(this, arguments);
							var ds = this.getStore();
                       if (ds._autoLoad === true) {                           delete ds._autoLoad;                           ds.load();                        }						this.view.layout();

			},
			updateColumnsState: function()			{				var colModel=this.getColumnModel();				var currentColState=this._colProperties;				if(colModel && currentColState)				{					var i=0;					for(i=0;i<this._colProperties.length;i++)					{						if(this._colProperties[i]._hidden =="Y")						{			                colModel.config[i].hidden=true;						}						else{							colModel.config[i].hidden=false;						}					}				}			},               					updateGridFiltersFromState : function (){
						if (this._colFilters) {
							var gridFilters = [];
							this.gridFilter.deleteOldFilters(this.store.baseParams);
							if (this._colFilters) {
								for (i = 0; i < this._colFilters.length; i++) {
									var tmpFilter = {};
									var filterValues = [];
									filterValues[0] = this._colFilters[i]['_value_txt'];
									filterValues[1] = this._colFilters[i]['_value_date'] || '';
									filterValues[2] = this._colFilters[i]['_value_date2'] || '';
									tmpFilter['FLD_COLUMN_ID'] = this._colFilters[i]['_field'];
									tmpFilter['FLD_FILTER_TYPE'] = this._colFilters[i]['_constraint'];
									tmpFilter['FLD_FILTER_VALUES'] = filterValues;
									gridFilters.push(tmpFilter);
								}
								this.gridFilter.gridViewFilters = gridFilters;
							}
						}
					},
					setFilters : function (){
							if (this.gridFilter) {
							var gridFilters = this.gridFilter.gridViewFilters;
							// this code added for set filter value
							if(this.store.baseParams["LOOKUP_FLAG"]=="true")
							{
								var lookup_Filter_Field="";
								var lookup_Filter_Value="";
								var lookup_Filter_Type="";
								
								if(this.store.baseParams["ResetStoreValues"])
								{
								// second time onwards assign the params
								// in to separeate params to the store
								// and delete the base params initially
								// available in store,
								// and get the params from the store and
								// assign it to the filters.
									
									lookup_Filter_Field=this.store.baseParams["LOOKUP_TEXT"];
									lookup_Filter_Value=this.store.baseParams["LOOKUP_VALUE_TXT"];
									lookup_Filter_Type=this.store.baseParams["LOOKUP_TYPE"];										
								}
								else
								{
									
									// First time params are available
									// in the store,so get the params
									// from the store and assign it to
									// the filters.
									var count=this.store.baseParams["COLUMN_COUNT"];
									lookup_Filter_Field=this.store.baseParams["FILTER"+(count)+"_FIELD"];
									lookup_Filter_Value=this.store.baseParams["FILTER"+(count)+"_VALUE_TXT"];
									lookup_Filter_Type=this.store.baseParams["FILTER"+(count)+"_TYPE"];
									
								}								
								var filterArr=new Array();
								filterArr.push(lookup_Filter_Value);
								this.gridViewFilters_lookup  =[ new Ext.data.JsonStore({
				                   	FLD_FILTER_VALUES: filterArr,
				                   	FLD_COLUMN_ID :lookup_Filter_Field,
				                   	FLD_FILTER_TYPE :lookup_Filter_Type
								})];
							
							}
							this.gridFilter.deleteOldFilters(this.store.baseParams);

							if (gridFilters.length > 0) {
								this.store.baseParams["IS_FILTER_FORM"] = "true";
								this.store.baseParams["COLUMN_COUNT"] = gridFilters.length;
								for (i = 0; i < gridFilters.length; i++) {
									var tmpFilter = this.gridFilter.getFilter(gridFilters[i].FLD_COLUMN_ID);
									if (tmpFilter) {
										if (tmpFilter.type == "string" || tmpFilter.type == "numeric"
													|| tmpFilter.type == "float") {
											this.store.baseParams['FILTER' + (i + 1) + '_FIELD'] = gridFilters[i].FLD_COLUMN_ID;
											this.store.baseParams['FILTER' + (i + 1) + '_CONSTRAINT'] = gridFilters[i].FLD_FILTER_TYPE;
											this.store.baseParams['FILTER' + (i + 1) + '_VALUE_TXT'] = gridFilters[i].FLD_FILTER_VALUES[0];
										} else {
											this.store.baseParams['FILTER' + (i + 1) + '_FIELD'] = gridFilters[i].FLD_COLUMN_ID;
											this.store.baseParams['FILTER' + (i + 1) + '_CONSTRAINT'] = gridFilters[i].FLD_FILTER_TYPE;
											this.store.baseParams['FILTER' + (i + 1) + '_VALUE_TXT'] = gridFilters[i].FLD_FILTER_VALUES[0];
											this.store.baseParams['FILTER' + (i + 1) + '_VALUE_DATE'] = gridFilters[i].FLD_FILTER_VALUES[1];
											this.store.baseParams['FILTER' + (i + 1) + '_VALUE_DATE2'] = gridFilters[i].FLD_FILTER_VALUES[2];
										}
									} else {
										this.store.baseParams['FILTER' + (i + 1) + '_FIELD'] = gridFilters[i].FLD_COLUMN_ID;
										this.store.baseParams['FILTER' + (i + 1) + '_CONSTRAINT'] = gridFilters[i].FLD_FILTER_TYPE;
										this.store.baseParams['FILTER' + (i + 1) + '_VALUE_TXT'] = gridFilters[i].FLD_FILTER_VALUES[0];
										this.store.baseParams['FILTER' + (i + 1) + '_VALUE_DATE'] = gridFilters[i].FLD_FILTER_VALUES[1];
										this.store.baseParams['FILTER' + (i + 1) + '_VALUE_DATE2'] = gridFilters[i].FLD_FILTER_VALUES[2];
									}
								}
							} else {
								delete this.store.baseParams["IS_FILTER_FORM"];
								delete this.store.baseParams["COLUMN_COUNT"];
							}
						}
					},
					updateColumnHeaders : function (){
						// this code added for set filter values in the
						// menus
						if(this.store.baseParams["LOOKUP_FLAG"]==="true")
						{	
							this.gridFilter.gridViewFilters=this.gridViewFilters_lookup;
							this.gridViewFilters_lookup=[];
							
						}
						if (this.gridFilter) {
							var gridFilters = this.gridFilter.gridViewFilters;
							if (gridFilters.length > 0) {
								for (i = 0; i < gridFilters.length; i++) {
									var tmpFilter = this.gridFilter.getFilter(gridFilters[i].FLD_COLUMN_ID);
									if (tmpFilter) {
										var value = gridFilters[i].FLD_FILTER_VALUES[0];
										var value1 = gridFilters[i].FLD_FILTER_VALUES[1];
										LOGGER.info("gridfilters", gridFilters[i]);
										LOGGER.info("value from between:" + value);
										var gridFilterType = gridFilters[i].FLD_FILTER_TYPE;
										if (tmpFilter.type == "string") {
											tmpFilter.menu.fields['def'].setValue(value);
										} else if (tmpFilter.type == "list") {
											tmpFilter.menu.setSelected(value);
										} else if (tmpFilter.type == "numeric" || tmpFilter.type == "float") {
											
											var cons = null;
											if (gridFilters[i].FLD_FILTER_TYPE) {
												cons = (gridFilters[i].FLD_FILTER_TYPE == "<"
															? "lt"
															: (gridFilters[i].FLD_FILTER_TYPE == ">"
																		? "gt"
																		: (gridFilters[i].FLD_FILTER_TYPE == "M"
																					? "most"
																					: (gridFilters[i].FLD_FILTER_TYPE == "L"
																								? "least"
																								: "eq"))));
											}
											if (cons != null) {
												var key, field;
												for (key in tmpFilter.menu.fields) {
													field = tmpFilter.menu.fields[key];
													if (field.itemId === "range-" + cons) {
														tmpFilter.menu.fields[cons].setValue(value);
													}
												}

											} else {
												tmpFilter.menu.setValue(value);
											}
										} else if (tmpFilter.type == "date") {
											var key;
											try {
												for (key in tmpFilter.fields) {
													if (gridFilterType === "PREVIOUS_MONTH"
																&& key === "range-lastmonth") {
														tmpFilter.fields[key].setChecked(true);

													} else if (gridFilterType === "LAST_N_DAY"
																&& key === "range-last_n_daysperiods") {

														tmpFilter.fields[key].setValue(value);
														tmpFilter.fields['last_n_days'].setChecked(true);
													} else if (gridFilterType === "LAST_N_MONTH"
																&& key === "range-last_n_monthsperiods") {

														tmpFilter.fields[key].setValue(value);
														tmpFilter.fields['last_n_months'].setChecked(true);
													} else if (gridFilterType === "range" && key === "between") {
														tmpFilter.fields['range-betweenfrom'].setValue(value);
														tmpFilter.fields['range-betweento'].setValue(value1);
														tmpFilter.fields[key].setChecked(true);
													} else if (gridFilterType === "lt" && key === "before") {
														var date = this.convertStringtoDate(value);
														tmpFilter.fields['before'].menu.picker.setValue(date);
														tmpFilter.fields['before'].setChecked(true);
													} else if (gridFilterType === "gt" && key === "after") {
														var date = this.convertStringtoDate(value);
														tmpFilter.fields[key].menu.picker.setValue(date);
														tmpFilter.fields[key].setChecked(true);
													} else if (gridFilterType === "dtEquals" && key === "on") {
														var date = this.convertStringtoDate(value);
														tmpFilter.fields[key].menu.picker.setValue(date);
														tmpFilter.fields[key].setChecked(true);
													}
												}
											} catch (e) {
												LOGGER.error(e);
											}
										
										}
										tmpFilter.active = true;
									}
								}
								this.gridFilter.updateColumnHeadings();
							} else {
								this.gridFilter.clearFilters();
							}
						}
					},
					convertStringtoDate : function (sdate){
						if (!Ext.isEmpty(sdate) && typeof (sdate) == 'string') {
							var vals = sdate.split("-");
							var xdate = null;
							var monthfield = vals[0];
							var dayfield = vals[1];
							var yearfield = vals[2];
							xdate = new Date(yearfield, monthfield - 1, dayfield);
							if ((xdate.getMonth() + 1 != monthfield) || (xdate.getDate() != dayfield)
										|| (xdate.getFullYear() != yearfield)) {
								LOGGER.error("Invalid Date", sdate);
								return sdate;
							} else {
								xdate = new Date();
								var intvals = [ Number(vals[1]), Number(vals[0]), Number(vals[2]) ];
								xdate.setFullYear(intvals[2], intvals[1] - 1, intvals[0]);
								return xdate;
							}
						} else
							return sdate;
					},
					/* Grouping Grid Upgrade */
					/**
					 * The function that expands all the row in the grouping
					 */
					expandAll : function (){
						this.view.expandAllGroups();
					},
					/**
					 * The function that collapse all the row in the grouping
					 */
					collapseAll : function (){
						this.view.collapseAllGroups();
					},
					
					expandFirstGroup : function (){
						this.view.toggleNthGroup(1,true);
					},
					collapseFirstGroup : function (){
						this.view.toggleNthGroup(1,false);
					},
    afterRender:function(){
    	iportal.listview.groupgrid.superclass.afterRender.apply(this, arguments);
    	
    },	
    handleViewReady :function(){
    	
    	var rb = CRB.getFWBundle(); 
    	
		this.view.emptyText = rb.LOADING;

		this.view.applyEmptyText();
		
    }
  
	
			
	
});

// register xtype to allow for lazy initialization
Ext.reg('groupgrid', iportal.listview.groupgrid);