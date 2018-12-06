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
 
cbx.ns('canvas.lib.view');
/**
 * <pre>
 * This class follow the CT Component life cycle and is responsible for
 * rendering a 'n' level Grouping Grid that also supports the following: 
 * - Selection Model
 * - Grouping Content as per configured meta data 
 * - Template based Column Rendering 
 * - Expand/ Collapse Grouped
 * content The class uses JQuery Tree Table component for rendering the grouping
 * UI. The entire logic of Grouping the List[HashMap] JSON as per the meta data
 * is covered under the class.
 * </pre>
 * 
 * @class canvas.lib.view.groupview
 */
canvas.lib.view.groupview = Class(cbx.core.Component,{
	/**
	 * 
	 */
	initialize : function ()
	{
		var me = this;
		/**
		 *  ALTERNATE_ROW_COLOR: For maintaining row counter of each level
		 */
		this.grpRowCounter = {}; 
		me.loaded = false;
		var elem = me.elem;
		var appId = 'cbx-app-' + me.WIDGET_ID + "_" + me.md.getViewId();
		this.pageSize = me.md.FLD_RECORDS_PER_PAGE;
		elem.append('<span class="' + appId + '" ITEM_ID="WGT_' + me.WIDGET_ID + '"></span>');
		elem = $(elem.find('span.' + appId));
		me.setCmp(elem);
		elem.on("remove", function ()
		{
			me.destroy();
		});
		this.contextMenu = me.md.getContextMenu();
		/**
		 * respClassMap map contains a one on one mapping COLUMN_ID: <PRIMARY|SECONDARY_1|SECONDARY_2>
		 */
		//this.respClassMap = me.md.getResponsiveClassMap();
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
		/**
		 * Binding uData with Params
		 */
		if (me.uData)
		{
			cbx.core.extend(params, me.uData);
		}
		/**
		 * Raising Extra Param Handler event for the app developer to provide custom params for the data
		 * call
		 */
		var extraParams = {};
		me.viewConf.raiseEvent(CWEC.EXTRA_PARAMS_HDLR, extraParams);
		if (extraParams)
		{
			cbx.core.extend(params, extraParams);
		}
		this.store = new cbx.core.Store({
			params : params,
			listeners : {
				'load' : me.loadData,
				'beforeload' : me.preLoad
			},
			scope : me,
			accumulate : false,
			autoLoad : true,
			reader : {
				root : 'response.value.ALL_RECORDS',
				totalProperty : 'response.value.TOTAL_COUNT',
				idProperty : 'response.value.ADDITIONAL_DATA.UNIQUE_COLUMN'
			},
			bufferSize : this.pageSize != null ? this.pageSize : 3
		});
		var displayKey = me.WGT_TITLE || me.md.getViewTitle();
		var title = me.rb[displayKey] || displayKey;
		var cMenu = me.contextMenu;
		var visibleClm = me.md.getVisibleColumns();
		me.groupedCols = me.md.getGroupingColumns();
		/**
		 * Array that hold Column MD for all the columns marked for grouping as per their order
		 */
		me.groupedColsMD = {};
		/**
		 *  hard coded constant. value to be coming from the meta data
		 */
		me.selectionType = 'MULTIPLE';
		me.selectionModel = 'MULTIPLE';// me.md.getSelectionType();
		/**
		 * Array That hold Column MD for columns that will be visible on the screen
		 */
		var visibleHeader = [];
		var col, groupedColAdded = false;
		for (var i = 0, len = visibleClm.length; i < len; i++)
		{
			col = visibleClm[i];
			if (this.groupedCols.indexOf(col.FLD_COLUMN_ID) != -1)
			{
				me.groupedColsMD[col.FLD_COLUMN_ID] = col;
				if (groupedColAdded === false)
				{
					visibleHeader.push(col);
					groupedColAdded = true;
				}
			} else if (cbx.core.isEmpty(me.md.getDisplayMappedCol(col)))
			{
				visibleHeader.push(col);
			}
		}

		elem.append('<div class="widget-block ' + (me.loadingInContainer !== true ? 'widgetcontainer' : '')
					+ '"></div>');
		/**
		 * Preparing and appending the Widget title HTML DOM to the Widget Container HTML
		 */
		if (!cbx.core.isEmpty(title) && me.loadingInContainer !== true)
		{
			$(elem.find('div.widget-block'))
						.append(
									'<div id="page-title" role="heading" '
												+ 'class="displayinline container page-title accessible-area accessibility-contrast-normal col19 '
												+ me.WIDGET_ID + '-title">' + '<H1>' + title + '</H1>'
												+ '</div');
		}
		/**
		 * creating the base table structure
		 */
		var myTable = '';
		me.tableId = me.WIDGET_ID + "_" + me.md.getViewId() + "_TABLE";
		/**
		 * @me.rowDom covers the HTML that is prepared as per the visible columns. This HTML will only have
		 *            empty TR and TD without the content. This will be used in draw method for appending to
		 *            the main table tbody and attach necessary attributes to all its elements
		 */
		me.rowDom = '<tr>';
		myTable += '<table id="' + me.tableId + '" class="treetable">';
		myTable += '<thead>';
		myTable += '<tr>';
		var cellTooltip = '';
		var cellTitle = '';
		for (var i = 0; i < visibleHeader.length; i++)
		{
			cellTitle = me.rb[visibleHeader[i].FLD_COLUMN_DISPLAY_NAME_KEY] != null
						? me.rb[visibleHeader[i].FLD_COLUMN_DISPLAY_NAME_KEY]
						: visibleHeader[i].FLD_COLUMN_DISPLAY_NAME_KEY;
			cellTooltip = me.rb[visibleHeader[i].FLD_COLUMN_DISPLAY_NAME_KEY + '_TOOLTIP'] || cellTitle;
			myTable += '<th class="'/* + this.respClassMap[visibleHeader[i].FLD_COLUMN_ID]*/
						+ '" scope="col" title="' + cellTooltip + '">' + cellTitle + '</th>';
			me.rowDom += '<td class="' /*+ this.respClassMap[visibleHeader[i].FLD_COLUMN_ID]*/
						+ '" COLUMN_ID="' + visibleHeader[i].FLD_COLUMN_ID
						+ '" style="background:none !important;"'
						+ '></td>';
		}
		if (cMenu.length > 0)
		{
			myTable += '<th>Actions</th>';
			me.rowDom += '<td data-role="ACTION" style="background:none !important;"></td>';
		}
		if (!cbx.core.isEmpty(me.selectionType))
		{
			myTable += '<th><input type="checkbox"/></th>';
			me.rowDom += '<td align="center" style="background:none !important;"><input type="checkbox"/></td>';
		}
		me.rowDom += '</tr>';

		myTable += '</tr>';
		myTable += '</thead>';
		myTable += '<tbody>';
		myTable += '</tbody>';
		myTable += '</table>';

		$(elem.find('div.widget-block')).append(myTable);
		me.grid = $(me.elem).find('#' + me.tableId);

	},
	/**
	 * Preload handler for the store, called before the server response is processed
	 */
	preLoad : function (result)
	{
		// LOGGER.info('result==', result);
	},
	reloadData : function ()
	{
		this.loaded = false;
		this.store.reload();
	},
	/**
	 * Handler to be called post the store has loaded data and shares all the records from the data
	 * 
	 * @records List of records
	 */
	loadData : function (records)
	{
		var me = this;
		me.colTypeMap = canvas.lib.view.datatype.getColumnTypeMap();
		me.tbody = $(me.grid).find('tbody');
		me.thead = $(me.grid).find('thead');
		/**
		 * Grouping all the received records with the first level as configured in the meta data and calling
		 * the draw method.
		 */
		me.draw({
			result : records.groupBy(this.groupedCols[0]),
			level : 0
		});
		/**
		 * Post drawing the Table content calling the treetable API to convert the content in to a
		 * Expandable grouping grid.
		 */
		setTimeout(function ()
		{
			me.grid = $(me.grid).treetable({
				expandable : true,
				onNodeExpand : function ()
				{
					if (cbx.isIE())
					{
						var meR = this;
						setTimeout(function ()
						{
							var obj = meR.row.parents('[role="app-wrap"]');
							obj.append('&nbsp;')
						}, 100);
					}
				},
				onNodeCollapse : function ()
				{
					if (cbx.isIE())
					{
						var meR = this;
						setTimeout(function ()
						{
							var obj = meR.row.parents('[role="app-wrap"]');
							obj.append('&nbsp;')
						}, 100);
					}
				},
				onInitialized : function ()
				{
					if (cbx.isIE())
					{
						var grid = this;
						setTimeout(function ()
						{
							var obj = $(grid.table).parents('[role="app-wrap"]');
							obj.append('&nbsp;')
						}, 100);
					}
				}
			});
		}, 100);

		if (!cbx.core.isEmpty(me.selectionModel))
		{
			me.updateNodeCheckboxStateAll();
		}
		/**
		 * attaching local handlers to all the action-able elements.
		 */
		$($(this.elem).find('*[data-action="true"]')).off('click');
		$($(this.elem).find('*[data-input="true"]')).off('click');

		$($(this.elem).find('*[data-action="true"]')).on("click", {
			scope : me
		}, me.handleClick);
		$($(this.elem).find('*[data-input="true"]')).on("change", {
			scope : me
		}, me.handleInputChange);

		/**
		 * Attaching handler on check boxes in case the selection model is enabled
		 */
		if (!cbx.core.isEmpty(me.selectionModel))
		{
			me.thead.find(':checkbox').change({
				scope : me
			}, function (evtObj)
			{
				var me = evtObj.data.scope;
				var checked = $(this).is(':checked');
				me.toggleAll(checked);
			});
			/**
			 * Handler when the checkbox data gets changed by user's interaction.
			 */
			me.tbody.find(':checkbox').change({
				scope : me
			}, function (evtObj)
			{
				var me = evtObj.data.scope;
				var tr = $(this).parents('tr');
				var checked = $(this).is(':checked');
				var parentId = tr.attr('data-tt-id');

				me.performCheck(parentId, checked);
				me.updateNodeCheckboxState(tr, checked);
			});
		}
	},
	/**
	 * This method is intended to update the check box status of all the branches of the tree as per the
	 * status of the leaf check box. This is a recursive method that will be call till all the top level
	 * parent check boxes are updated
	 * 
	 * @tr the TR reference whose child check box is update (checked/unchecked) by the user
	 * @flag true/ false for checked/ unchecked
	 */
	updateNodeCheckboxState : function (tr, flag)
	{
		var me = this, unchecked;
		var parentId = tr.attr('data-tt-parent-id');
		var parentTr = me.tbody.find('[data-tt-id="' + parentId + '"]');
		if (flag === false)
		{
			parentTr.find(':checkbox').prop('checked', flag);
			if (parentTr.attr('data-tt-parent-id'))
			{
				me.updateNodeCheckboxState(parentTr, flag);
			}
		} else
		{
			unchecked = me.tbody.find('[data-tt-parent-id="' + parentId + '"]').find(
						':checkbox:not(:checked)');
			if (unchecked.length <= 0)
			{
				parentTr.find(':checkbox').prop('checked', flag);
				if (parentTr.attr('data-tt-parent-id'))
				{
					me.updateNodeCheckboxState(parentTr, flag);
				}
			}
		}
		LOGGER.info(me.store.getSelectedData());
	},
	/**
	 * This method take bottom to top approach for fixing all the branch check boxes for the first time when
	 * the tree gets loaded
	 */
	updateNodeCheckboxStateAll : function ()
	{
		var me = this, nodes, unchecked, nodeChkbx;
		for (var i = me.groupedCols.length - 1; i >= 0; i--)
		{
			nodes = me.tbody.find('[tree-level="' + i + '"]');
			if (nodes.length > 0)
			{
				nodes.each(function (index, node)
				{
					node = $(node);
					nodeChkbx = node.find(':checkbox');
					unchecked = me.tbody.find('[data-tt-parent-id="' + node.attr('data-tt-id') + '"]')
								.find(':checkbox:not(:checked)');
					if (unchecked.length > 0)
					{
						nodeChkbx.prop('checked', false);
					} else
					{
						nodeChkbx.prop('checked', true);
					}

				});
			}
		}
	},
	/**
	 * This method will apply the flag value to all the check boxes available on the grid.
	 * 
	 * @flag true/ false for checked/ unchecked
	 */
	toggleAll : function (flag)
	{
		var me = this;
		var rootNodes = me.tbody.find('tr:not([data-tt-parent-id])');
		rootNodes.find(':checkbox').prop('checked', flag);
		var rowId;
		rootNodes.each(function (index, row)
		{
			rowId = $(row).attr('data-tt-id');
			if (rowId != null)
			{
				me.performCheck(rowId, flag);
			}
		});
	},
	/**
	 * Method is responsible for applying the flag value to the check boxes whose parentId is provided as
	 * well as the check boxes of all the TR that are child of the provided parentId till the leaf level.
	 * This method performs a recursive call in order to cover any level of hierarchy of the tree.
	 * 
	 * @parentId The TR whose either check box needs to be checked/unchecked
	 * @flag true/ false for checked/ unchecked
	 */
	performCheck : function (parentId, flag)
	{
		var me = this;
		var nodes = me.tbody.find('[data-tt-parent-id="' + parentId + '"].branch');
		var leaves = me.tbody.find('[data-tt-parent-id="' + parentId + '"].leaf').find(':checkbox');
		if (leaves.length > 0)
		{
			leaves.prop('checked', flag);
			if (flag == true)
			{
				leaves.each(function (index, checkbox)
				{
					if (flag == true)
					{
						me.store.addSelectedData($(checkbox).attr('RECORD_CURR'));
					}
				});
			} else
			{
				leaves.each(function (index, checkbox)
				{
					if ($(checkbox).attr('data-checked') == "true")
					{
						me.store.removeSelectedData($(checkbox).attr('RECORD_CURR'), true);
					} else
					{
						me.store.removeSelectedData($(checkbox).attr('RECORD_CURR'));
					}
				});

			}
		} else
		{
			// leaf check box values got changed
			var checkbox = me.tbody.find('[data-tt-id="' + parentId + '"].leaf').find(':checkbox');
			if (checkbox.length > 0)
			{
				if (flag == true)
				{
					me.store.addSelectedData($(checkbox).attr('RECORD_CURR'));
				} else
				{
					if ($(checkbox).attr('data-checked') == "true")
					{
						me.store.removeSelectedData($(checkbox).attr('RECORD_CURR'), true);
					} else
					{
						me.store.removeSelectedData($(checkbox).attr('RECORD_CURR'));
					}

				}
			}
		}
		nodes.find(':checkbox').prop('checked', flag);
		var rowId;
		nodes.each(function (index, row)
		{
			rowId = $(row).attr('data-tt-id');
			if (rowId != null)
			{
				me.performCheck(rowId, flag);
			}
		});
	},
	/**
	 * 
	 */
	handleClick : function (evtObj)
	{
		var me = evtObj.data.scope, cell = this;
		var record = me.store.getAt($(cell).attr('RECORD_CURR'));
		var subRecord = $(cell).attr('SUB_RECORD_CURR');
		var colId = $(cell).attr('COLUMN_ID');
		LOGGER.info({
			record : record,
			columnId : colId,
			subRecord : subRecord
		});
		me.viewConf.raiseEvent(CWEC.CELL_CLICK, {
			record : record,
			columnId : colId,
			subRecord : subRecord
		});
	},
	
	/**
	 * 
	 */
	handleInputChange : function (evtObj)
	{
		var me = evtObj.data.scope, cell = this;
		var record = me.store.getAt($(cell).attr('RECORD_CURR'));
		var subRecord = $(cell).attr('SUB_RECORD_CURR');
		var colId = $(cell).attr('COLUMN_ID');
		record[colId] = $(this).val();
		me.viewConf.raiseEvent(CWEC.CELL_DATA_CHANGE, {
			record : record,
			columnId : colId,
			subRecord : subRecord
		});
	},
	/**
	 * This is the primary method that takes the responsibility of preparing the HTML dom as per the JQuery
	 * Tree Table standards. In order to achieve the N level hierarchy, this method does a recursive call
	 * prepare all the branches and leaves of the the tree grid.
	 * 
	 * @data is a JSON object that has the grouped content, the level no. of the current group and the
	 *       parentInd for preparing the Parent Child hierarchy
	 */
	draw : function (data)
	{
		var me = this;
		var visibleClm = me.md.getVisibleColumns();
		var values = data.result;
		var level = data.level;
		var newData;
		var parentInd = (data.parentInd == null ? '-' : data.parentInd);
		var childInd = '';
		var $row, firstRecord, colVal, refCol, template, cellToolTip;
		/**
		 * Hierarchy will break in case a record doesn't have the key coverd in a group by. In that case the
		 * record will be attached to it one level up parent
		 */
		var hierarchyBrokenFlag = false;
		this.grpRowCounter[level] = 0; 
		for (var i = 0, len = values.length; i < len; i++)
		{
			if (parentInd !== '-')
			{
				childInd = parentInd + '.' + i;
			} else
			{
				childInd = i;
			}
			colVal = values[i].key;
			if (colVal == null)
			{
				hierarchyBrokenFlag = true;
			} else
			{
				hierarchyBrokenFlag = false;
			}

			if (hierarchyBrokenFlag === false)
			{
				firstRecord = values[i].values[0];
				me.tbody.append(me.rowDom);
				$row = me.tbody.find('tr:last-child');

				var levelRowCounter = this.grpRowCounter[level];
				var prevLevelRowCnter = this.grpRowCounter[level - 1];
				/**
				 * Check if prev level is there, check its row count,if last level row is even 
				 */
				if (prevLevelRowCnter != 'undefined' && prevLevelRowCnter != null && i == 0
							&& (prevLevelRowCnter - 1) % 2 == 0)
				{
					/**
					 * If prev row is even row, then increase by 1 to make the current row as odd
					 */
					levelRowCounter += 1;
				}
				if (levelRowCounter % 2 == 0)
				{
					$row.addClass('r-even');
				} else
				{
					$row.addClass('r-odd');
				}
				this.grpRowCounter[level] = levelRowCounter + 1;

				$row.attr('data-tt-id', childInd);
				$row.attr('tree-level', level);
				if (parentInd !== '-')
				{
					$row.attr('data-tt-parent-id', parentInd);
				}
				col = me.groupedColsMD[me.groupedCols[level]];
				if (col.FLD_DD_REQ_IND === 'Y')
				{
					cellToolTip = me.rb[col.FLD_COLUMN_ID + '_DATA_TOOLTIP'] || '&nbsp;';
					colVal = '<a href="javascript:void(0)" class="drilldown" data-action="true" COLUMN_ID="'
								+ col.FLD_COLUMN_ID
								+ '" RECORD_CURR="'
								+ firstRecord['REC_CURR']
								+ '" title="' + cellToolTip + '">' + colVal + '</a>';
				}
				$row.find('td:first-child').html(colVal);
				for (var colInd = 0, colLen = visibleClm.length; colInd < colLen; colInd++)
				{
					col = visibleClm[colInd];
					if (me.groupedCols.indexOf(col.FLD_COLUMN_ID) == -1)
					{
						/**
						 * render info only if parent column is defined
						 */
						if (me.md.getParentCol(col) == me.groupedCols[level])
						{
							template = me.md.getColTemplate(col);
							if (!cbx.core.isEmpty(template))
							{
								template = $.template(null, template);
								colVal = $.tmpl(template, firstRecord).html();
							} else
							{
								colVal = firstRecord[col.FLD_COLUMN_ID];
							}

							refCol = me.md.getDisplayMappedCol(col);
							if (col.FLD_DD_REQ_IND === 'Y')
							{
								cellToolTip = me.rb[col.FLD_COLUMN_ID + '_DATA_TOOLTIP'] || '&nbsp;';
								colVal = '<a href="javascript:void(0)" class="drilldown" data-action="true" COLUMN_ID="'
											+ col.FLD_COLUMN_ID
											+ '" RECORD_CURR="'
											+ firstRecord['REC_CURR']
											+ '" title="'
											+ cellToolTip
											+ '">'
											+ colVal + '</a>';
							}
							if (!cbx.core.isEmpty(refCol))
							{
								$row.find('td[COLUMN_ID="' + refCol + '"]').html(colVal);// .attr('type',
							} else
							{
								$row.find('td[COLUMN_ID="' + col.FLD_COLUMN_ID + '"]').html(colVal);// .attr('type',
							}
						}
					}
				}
			}
			/**
			 * make recursive loop if all the levels of groups are not
			 * yet covered
			 */
			if ((level + 1) < this.groupedCols.length)
			{
				newData = values[i].values.groupBy(this.groupedCols[(level + 1)]);
				if (hierarchyBrokenFlag === false)
				{
					this.draw({
						result : newData,
						level : level + 1,
						parentInd : childInd
					});
				} else
				{
					this.draw({
						result : newData,
						level : level + 1,
						parentInd : parentInd,
						hierarchyBrokenFlag : hierarchyBrokenFlag
					});
				}
			} else
			{
				var leafValues = values[i].values;
				var record, checkStatus, $checkbox;
				var rowInd = 0;
				var leafChildInd = childInd;
				if (hierarchyBrokenFlag == true)
				{
					/**
					 * preparing to attach the leaf records with one
					 * level up parent.
					 */
					leafChildInd = parentInd;
					rowInd = me.tbody.find('tr[data-tt-parent-id="' + parentInd + '"]').length;
				} else
				{
					/*
					 * me.tbody.append(me.rowDom); $row = me.tbody.find('tr:last-child');
					 * $row.attr('data-tt-id', leafChildInd + '.' + (rowInd++));
					 * $row.attr('data-tt-parent-id', leafChildInd); $row.attr('dummy-lg'); return;
					 */
				}
				var rowCounter = 0;
				for (var j = 0, jLen = leafValues.length; j < jLen; j++)
				{
					record = leafValues[j];

					me.tbody.append(me.rowDom);
					$row = me.tbody.find('tr:last-child');
					/**
					 * attaching even/ odd class
					 * - Get current level row counter value
					 */
					var levelRowCnter = this.grpRowCounter[level];
					/**
					 * For the first row, check if group row is even, if so make
					 *  -current row as odd by increasing value by 1
					 */
					if (levelRowCnter != null && j == 0 && (levelRowCnter - 1) % 2 == 0)
					{
						rowCounter += 1;
					}
					if (rowCounter % 2 == 0)
					{
						$row.addClass('r-even');
					} else
					{
						$row.addClass('r-odd');
					}
					rowCounter++; 

					$row.attr('data-tt-id', leafChildInd + '.' + (rowInd++));
					$row.attr('data-tt-parent-id', leafChildInd);
					if (!cbx.core.isEmpty(me.selectionModel))
					{
						checkStatus = (record["STATUS"] === 'Y' || record["STATUS"] === 'true' || record["STATUS"] === true)
									? true : false;
						$checkbox = $row.find(':checkbox');
						$checkbox.attr('RECORD_CURR', record['REC_CURR']);
						if (checkStatus === true
									&& me.store.addSelectedDataOnFly(record['REC_CURR']) == true)
						{
							$checkbox.attr('checked', 'true').attr('data-checked', 'true');
						} else
						{
							$checkbox.removeAttr('checked').attr('data-checked', 'false');
						}
					}
					for (var colInd = 0, colLen = visibleClm.length; colInd < colLen; colInd++)
					{
						col = visibleClm[colInd];
						if (me.groupedCols.indexOf(col.FLD_COLUMN_ID) == -1)
						{

							if (cbx.core.isEmpty(me.md.getParentCol(col)))
							{
								refCol = me.md.getDisplayMappedCol(col);
								template = me.md.getColTemplate(col);
								if (!cbx.core.isEmpty(template))
								{
									template = $.template(null, template);
									colVal = $.tmpl(template, record).html();
								} else
								{
									colVal = record[col.FLD_COLUMN_ID];
								}
								if (col.FLD_DD_REQ_IND === 'Y')
								{
									cellToolTip = me.rb[col.FLD_COLUMN_ID + '_DATA_TOOLTIP'] || '&nbsp;';
									colVal = '<a href="javascript:void(0)" class="drilldown" data-action="true" COLUMN_ID="'
												+ col.FLD_COLUMN_ID
												+ '" RECORD_CURR="'
												+ record['REC_CURR']
												+ '" title="'
												+ cellToolTip
												+ '">'
												+ colVal + '</a>';
								}

								if (!cbx.core.isEmpty(refCol))
								{
									$row.find('td[COLUMN_ID="' + refCol + '"]').html(colVal);// .attr('type',
								} else
								{
									$row.find('td[COLUMN_ID="' + col.FLD_COLUMN_ID + '"]').html(colVal);// .attr('type',
								}
							}
						}
					}

				}
			}
		}
		// return domStr;
	},
	
	/**
	 * 
	 */
	handleCellClick : function (evtObj)
	{
		var me = evtObj.data.scope, cell = this;
		var record = me.store.getAt($(cell).attr('RECORD_CURR'));
		var subRecord = me.store.getAt($(cell).attr('SUB_RECORD_CURR'));
		me.viewConf.raiseEvent(CWEC.CELL_CLICK, {
			record : record,
			subRecord : subRecord
		});
	},
	
	/**
	 * 
	 */
	handleContextClick : function (evtObj)
	{
		evtObj.preventDefault();
		var me = evtObj.data.scope, cell = this;
		var record = me.store.getAt($(cell).attr('RECORD_CURR'));
		var subRecord = me.store.getAt($(cell).attr('SUB_RECORD_CURR'));
		S
		me.viewConf.raiseEvent(CWEC.CONTEXT_CLICK, {
			record : record,
			MENU_ID : $(cell).attr('menu-id'),
			subRecord : subRecord
		});
	}
});

/**
 * 
 */
CLCR.registerCmp({'COMP_TYPE' : 'APP','VIEW_TYPE' : 'GROUP'}, canvas.lib.view.groupview);
