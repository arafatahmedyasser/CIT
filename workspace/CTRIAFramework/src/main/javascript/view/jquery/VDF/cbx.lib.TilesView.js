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
 

/**
 * <pre>
 * This class follow the CT Component life cycle and is responsible for
 *  rendering the template configured in a tiled manner.
 * - Arranges the tile items in a row/line based on the space available 
 * - Provides Pagination using Jquery based CBX plugin cbxPagination
 * - Supports sort  
 * </pre>
 * 
 * @class cbx.lib.TilesView
 */


cbx.lib.TilesView = Class(
		cbx.core.Component,
		{
			initialize : function() {
				var me = this;
				me.bbar = '';
				/**
				 * Get the number of records to be displayed in each page
				 * from metadata or from default preference
				 */
				me.perPage = !cbx.isEmpty(me.md.getRecordsPerPage()) ? parseInt(me.md
						.getRecordsPerPage())
						: parseInt(iportal.preferences.getDefaultRecsPerPage());
				me.paginationTriggered = '';

				var elem = me.elem;
				this.paginationId = me.WIDGET_ID + "_" + me.md.getViewId()
						+ "_pagination"
				this.bbarId = me.WIDGET_ID + "_" + me.md.getViewId() + "_bbar";
				this.pageSize = me.md.FLD_RECORDS_PER_PAGE;
				var appId = 'cbx-app-' + me.WIDGET_ID + "_" + me.md.getViewId();
				elem.append('<span class="' + appId + '" ITEM_ID="WGT_'
						+ me.WIDGET_ID + '"></span>');// Added a span wrapper for the whole widget
				elem = $(elem.find('span.' + appId));
				me.setCmp(elem);

				this.divId = me.WIDGET_ID + "_" + me.md.getViewId()
						+ "_TILE";
				/**
				 * Registering the destroy method with JQuery remove event.
				 */
				elem.on("remove", function() {
					me.destroy();
				});
			
				this.contextMenu = me.md.getContextMenu();
				//Get the title of the widget
				var displayKey = me.WGT_TITLE || me.md.getViewTitle();
				var title = me.rb[displayKey] || displayKey;
				//Create widget title division
				var domStr = '<div id="page-title" role="heading" '
						+ 'class="displayinline container page-title accessible-area accessibility-contrast-normal col19 '
						+ me.WIDGET_ID + '-title">' + '<H1>' + title + '</H1>'
						+ '</div>';

				domStr += '<div class="' + this.divId
						+ ' context-wrapper"></div>';

				$(elem).append(domStr);
				// Include empty bBar for adding pagination links later
				var bBar = '<div class=bbar id="' + this.bbarId
						+ '" ></div>';
				$(elem).append(bBar);
				//Get the template configured 
				this.templateConfig = this.md.md.VIEW_MD.TEMPLATE_CONFIG;
				// Default params to make the data call
				var params = {
					"__LISTVIEW_REQUEST" : "Y",
					"PAGE_CODE_TYPE" : 'VDF_CODE',
					"INPUT_ACTION" : "INIT_DATA_ACTION",
					"PRODUCT_NAME" : 'CUSER',
					"INPUT_FUNCTION_CODE" : 'VSBLTY',
					"INPUT_SUB_PRODUCT" : 'CUSER',
					"WIDGET_ID" : me.WIDGET_ID,
					"VIEW_ID" : me.md.getViewId(),
					
					"LAYOUT_ID" :iportal.workspace.metadata.getCurrentLayoutId(),
					"WORKSPACE_ID" :iportal.workspace.metadata.getCurrentWorkspaceId(),
					
					"forceCallbacks" : true
				};
				/*
				 * Raising Extra Param Handler event for the app developer to
				 * provide custom params for the data call
				 */
				var extraParams = {};
				extraParams = me.viewConf.raiseEvent(CWEC.EXTRA_PARAMS_HDLR,
						extraParams);
				if (extraParams) {
					cbx.core.extend(params, extraParams);
				}
				// Binding uData with Params
				if (me.uData && !cbx.core.isEmpty(me.uData)) {
					cbx.core.extend(params, me.uData);
				}
				
				this.store = new cbx.core.Store({
					params : params,
					listeners : {
						"load" : this.loadData
					},
					scope : this,
					accumulate : false,
					autoLoad : true,
					reader : {
						root : 'response.value.ALL_RECORDS',
						totalProperty : 'response.value.TOTAL_COUNT'
					},
					bufferSize : this.pageSize != null ? this.pageSize : 10
				});

			},
			/**
			 * Handler to be called post the store has loaded data and shares
			 * all the records from the data
			 * 
			 * @records List of records
			 */
			loadData : function(records) {
				var me = this;
				
				if(records!=null){
					 var count = records.length;
					 if(records.length > 0){
						 count = records[0].TOTAL_ROWS;
					 }
				     me.viewConf.raiseEvent(CWEC.DATA_LOADED, {
				      totalRows : count
				     });
				}
				
				var elem = me.getCmp();
				//Get the bBar division reference 
				var bBar = $(elem.find('#' + this.bBarId));
				//If pagination is trigged, that is pagination link clicked 
				if (!cbx.isEmpty(this.paginationSelector)) {
					if (this.count !== this.paginationSelector
							.cbxPagination('getItemsCount')) {
						me.paginationTriggered = "";
						this.paginationSelector.cbxPagination('destroy');
						this.paginationSelector = "";
						var pagingParams = {};
						pagingParams.start = 0;
						cbx.core.extend(this.store.getParams(), pagingParams);
						this.reloadData(records);
						return;
					}
				}
				/**
				 * If records are there, call createCatalogItems(records) to create the tile items
				 * then create paginatin links by calling updateBBar();
				 * else, append no data message 
				 */
				if (records.length > 0) {
					this.createCatalogItems(records);
					this.updateBBar();// New bBar
				} else {
					bBar.empty();
					var $elem = $($(this.elem).find('div.' + this.divId));
					var emptyMsg = me.rb['NO_DATA_MSG_'+me.WIDGET_ID] || me.rb['NO_DATA_MSG'];
					var emptyDiv = '<div>' + emptyMsg + '</div>';
					$($elem).html(emptyDiv);1
				}
			},
			reloadData : function() {
				this.store.reload();
			},
			/**
			 * This method creates the pagination links based on the total records and number of records per page
			 * - using plugin cbxPagination
			 */
			updateBBar : function() {
				var me = this;
				var md = me.md;
				var bBarId = this.bbarId;
				var domStr = '';
				var elem = me.getCmp();
				var bBarButtons = null;
				//this.count = this.store.totalAvailableRecords || 0;
				//Get the total records count 
				this.count = this.store.getAt(0).TOTAL_ROWS || 0;
				//Get the bbar division reference using bBarId
				var bBar = $(elem.find('#' + bBarId));
				/**
				 * If total number of records is greater than number of records per page, then create the links 
				 */
				if (this.count > this.perPage) {
					//If pagination link is not yet clicked
					if (cbx.isEmpty(this.paginationTriggered)) {
						//LOGGER.info('Insaide paginationTriggered:');
						bBar.empty();//Clear bbar division elements
						domStr = '';
						/**
						 * If pagination link clicked or pagination triggered,
						 * 	Call the destroy event of cbxPagination
						 */
						if (!cbx.isEmpty(this.paginationSelector)) {
							this.paginationSelector.cbxPagination('destroy');
						}
						//Span wrapper with class name:'pagination-centered' as per the cbxPaginatin plugin for pagination links 
						domStr = '<span class=pagination-centered id="'
								+ this.paginationId + '" ></span>';
						bBar.append(domStr);
						this.totalDisplayInd = md.getTotalDisplayInd();
						this.paginateTable();//Call this method to create the pagination links using cbxPagination plugin
					}
				}
			},
			
			/**
			 * Method that will create the tile items using records it receives
			 * 
			 * @records List of records
			 */
			createCatalogItems : function(records) {
				var me = this;
				//Get the division or container for the tile items
				var $elem = $($(this.elem).find('div.' + this.divId));
				$elem.empty();//Clear the division
				var domList = "", paginationDiv = "";
				var template = $.template(null, this.templateConfig);
				/**
				 * Create tile items based on number of records per page
				 */
				for ( var ind = 0; ind < records.length; ind++) {
					records[ind]['RECORD_CURR'] = ind;
					temp = $.tmpl(template, records[ind]).html();
					//Create division to wrap each tile item
					var itemNo = ind + 1;
					/**
					 * Append class name : 'alternative-bg' to divison for even tile items   
					 */
					temp = '<div class="catalog-item-wrapper catalog-item-wrapper_'+me.WIDGET_ID 
							+ ((itemNo % 2) == 0 ? ' alternative-bg' : '')
							+ '">' + temp + '</div>';
					if (ind == records.length - 1) {
						domList += '<span class="last-row">' + temp + '</span>';
					} else {
						domList += temp;
					}
				}
				/**
				 * If there are tile items append else append 'no records' message
				 */
				if (!cbx.core.isEmpty(domList)) {
					$elem.append(domList);
				} else {
					$elem.append(me.rb['LBL_EMPTY']);
				}
				/**
				 * before attaching handlers to native event, detach all existing handlers
				 */

				$($(this.elem).find('*[data-action="true"]')).off('click');
				$($(this.elem).find('*[data-input="true"]')).off('click');
				
				$($(this.elem).find('*[data-action="true"]')).on("click", {
					scope : me
				}, me.handleClick);
				/**
				 * Register handlers for change event for the elemnts who
				 * are all having the attribute data-input="true"
				 */
				$($(this.elem).find('*[data-input="true"]')).on("change", {
					scope : me
				}, me.handleInputChange);
			},
			/**
			 * This method is responsible for calling CBX plugin API cbxPagination to create the pagination links
			 * based on the total items,number of records per page
			 * - Calls the  cbxPagination() with the pagination dvision id
			 * 
			 */
			paginateTable : function() {
				var me = this;
				this.paginationSelector = $('#' + this.paginationId)
						.cbxPagination({
							items : me.count,
							itemsOnPage : me.perPage,
							scope : me,
							handlePaginationClick : me.handlePaginationClick
						});
			},
			/**
			 * Handler to be called when a pagination link clicked
			 *
			 * @currentPage is number of the current page
			 * @evtObj	is the event object that has the event details
			 * @totalRecs is the total records to be displayed in current page
			 * @items   is the total records 
			 */
			handlePaginationClick : function(currentPage, evtObj, totalRecs,
					items) {
				this.paginationTriggered = true;
				/*LOGGER.info('Pagination ', [ currentPage, evtObj, totalRecs,
						items ]);*/
				var pagingParams = {};
				var startRes = Math.abs((currentPage - 1) * this.perPage);
				pagingParams.start = startRes
				pagingParams.limit = this.perPage;
				cbx.core.extend(this.store.getParams(), pagingParams);
				this.reloadData();
			},
			handleClick : function(evtObj) {
				var me = evtObj.data.scope, cell = this;
				var record = me.store.getAt($(cell).attr('RECORD_CURR'));
				var subRecord = $(cell).attr('SUB_RECORD_CURR');
				var colId = $(cell).attr('COLUMN_ID');
				me.viewConf.raiseEvent(CWEC.CELL_CLICK, {
					record : record,
					columnId : colId,
					subRecord : subRecord
				});
			},
			
			/**
			 * Method is responsible for updating the sort parameters to sort the tile items in it.
			 * - Called by canvas.lib.app class 
			 * - This calls the updateParams() of store to update the sort parameters
			 *
			 * @sortParams is the object of sort parameters as key,value pairs 
			 */
			sortUpdate : function(sortParams) {
				this.store.updateParams(sortParams);
				this.paginationTriggered = "";
			},
			handleInputChange : function(evtObj) {
				var me = evtObj.data.scope, cell = this;
				var record = me.store.getAt($(cell).attr('RECORD_CURR'));
				var colId = $(cell).attr('COLUMN_ID');
				record[colId] = $(this).val();
				me.viewConf.raiseEvent(CWEC.CELL_DATA_CHANGE, {
					record : record,
					columnId : colId
				});
			}
		});
CLCR.registerCmp({
	'COMP_TYPE' : 'APP',
	'VIEW_TYPE' : 'TILE'
}, cbx.lib.TilesView);