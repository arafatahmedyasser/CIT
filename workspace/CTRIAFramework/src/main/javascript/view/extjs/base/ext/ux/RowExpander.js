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

Ext.ns('Ext.ux.grid');

/**
 * 
 
 * 
 * @class Ext.ux.grid.RowExpander
 * @extends Ext.util.Observable
 * Plugin (ptype = 'rowexpander') that adds the ability to have a Column in a grid which enables
 * a second row body which expands/contracts.  The expand/contract behavior is configurable to react
 * on clicking of the column, double click of the row, and/or hitting enter while a row is selected.
 *
 * @ptype rowexpander
 * 
 * 
 */
Ext.ux.grid.RowExpander = Ext.extend(Ext.util.Observable, {

	/**
	 * @cfg {Boolean} expandOnEnter
	 * <tt>true</tt> to toggle selected row(s) between expanded/collapsed when the enter
	 * key is pressed (defaults to <tt>true</tt>).
	 */
	expandOnEnter : true,

	/**
	 * @cfg {Boolean} expandOnDblClick
	 * <tt>true</tt> to toggle a row between expanded/collapsed when double clicked
	 * (defaults to <tt>true</tt>).
	 */
	expandOnDblClick : true,

	/**
	 * @cfg {Boolean} triggerExpand
	 * <tt>false</tt> to expand a row automatically as soon as the rowexpander is rendered.
	 * (defaults to <tt>false</tt>).
	 */

	triggerExpand : false,

	header : '',
	width : 20,
	sortable : false,
	fixed : true,
	menuDisabled : true,
	dataIndex : '',
	lazyRender : true,
	enableCaching : true,
	actAsTree : false,
	treeLeafProperty : 'is_leaf',
	appendRowClass : true,

	constructor : function (config){
		
		this.width = 21;
		if(Ext.isChrome){
			this.width = 20;
		}
		if (!config.id) {
			config.id = Ext.id();
		}

		Ext.apply(this, config);

		var css = '.x-' + this.id + '-grid3-row-collapsed .x-grid3-row-expander { background-position:0 0; }' + '.x-'
					+ this.id + '-grid3-row-expanded .x-grid3-row-expander { background-position:-25px 0; }' + '.x-'
					+ this.id + '-grid3-row-collapsed .x-grid3-row-body { display:none !important; }' + '.x-' + this.id
					+ '-grid3-row-expanded .x-grid3-row-body { display:block !important; }'
					+ '.x-grid-expander-leaf .x-grid3-row-expander { background: none; }';

		Ext.util.CSS.createStyleSheet(css, Ext.id());

		this.expanderClass = 'x-grid3-row-expander';
		this.rowExpandedClass = 'x-' + this.id + '-grid3-row-expanded';
		this.rowCollapsedClass = 'x-' + this.id + '-grid3-row-collapsed';
		this.leafClass = 'x-grid-expander-leaf';

		this.addEvents({
			/**
			 * @event beforeexpand
			 * Fires before the row expands. Have the listener return false to prevent the row from expanding.
			 * @param {Object} this RowExpander object.
			 * @param {Object} Ext.data.Record Record for the selected row.
			 * @param {Object} body body element for the secondary row.
			 * @param {Number} rowIndex The current row index.
			 */
			beforeexpand : true,
			/**
			 * @event expand
			 * Fires after the row expands.
			 * @param {Object} this RowExpander object.
			 * @param {Object} Ext.data.Record Record for the selected row.
			 * @param {Object} body body element for the secondary row.
			 * @param {Number} rowIndex The current row index.
			 */
			expand : true,
			/**
			 * @event beforecollapse
			 * Fires before the row collapses. Have the listener return false to prevent the row from collapsing.
			 * @param {Object} this RowExpander object.
			 * @param {Object} Ext.data.Record Record for the selected row.
			 * @param {Object} body body element for the secondary row.
			 * @param {Number} rowIndex The current row index.
			 */
			beforecollapse : true,
			/**
			 * @event collapse
			 * Fires after the row collapses.
			 * @param {Object} this RowExpander object.
			 * @param {Object} Ext.data.Record Record for the selected row.
			 * @param {Object} body body element for the secondary row.
			 * @param {Number} rowIndex The current row index.
			 */
			collapse : true
		});

		Ext.ux.grid.RowExpander.superclass.constructor.call(this);

		if (this.tpl) {
			if (typeof this.tpl == 'string') {
				this.tpl = new Ext.Template(this.tpl);
			}
			this.tpl.compile();
		}

		this.state = {};
		this.bodyContent = {};
	},

	getRowClass : function (record, rowIndex, p, ds){
		p.cols = p.cols - 1;
		var content = this.bodyContent[record.id];
		if (!content && !this.lazyRender) {
			content = this.getBodyContent(record, rowIndex);
		}
		if (content) {
			p.body = content;
		}
		var cssClass = this.state[record.id] ? this.rowExpandedClass : this.rowCollapsedClass;
		if (this.actAsTree && record.get(this.treeLeafProperty)) {
			cssClass = this.leafClass;
		}
		return cssClass;
	},

	init : function (grid){
		this.grid = grid;

		var view = grid.getView();
		view.getRowClass = this.getRowClass.createDelegate(this);

		view.enableRowBody = true;

		grid.on('render', this.onRender, this);
		grid.on('destroy', this.onDestroy, this);
		grid.on('viewReady', this.onViewReady, this);
		view.on('beforerefresh', this.onBeforeRefresh, this);
		view.on('refresh', this.onRefresh, this);
	},

	onViewReady : function (){

		if (this.triggerExpand) {
			this.expandAll();
		}
	},

	// @private
	onRender : function (){
		var grid = this.grid;
		var mainBody = grid.getView().mainBody;
		mainBody && mainBody.on('mousedown', this.onMouseDown, this, {
			delegate : '.' + this.expanderClass
		});
		if (this.expandOnEnter) {
			this.keyNav = new Ext.KeyNav(this.grid.getGridEl(), {
				'enter' : this.onEnter,
				scope : this
			});
		}
		if (this.expandOnDblClick) {
			grid.on('rowdblclick', this.onRowDblClick, this);
		}
		if (this.actAsTree) {
			/**
			 * Stop bubbling parent events 
			 */
			grid.getEl().swallowEvent([ 'mouseover', 'mouseout', 'mousedown', 'click', 'dblclick' ]);
		}
	},

	// @private
	onBeforeRefresh : function (){
		var rows = this.grid.getEl().select('.' + this.rowExpandedClass);
		rows.each(function (row){
			this.collapseRow(row.dom);
		}, this);
	},

	// @private
	onRefresh : function (){
		var rows = this.grid.getEl().select('.' + this.rowExpandedClass);
		rows.each(function (row){
			Ext.fly(row).replaceClass(this.rowExpandedClass, this.rowCollapsedClass);
		}, this);

		this.onViewReady();
	},

	// @private    
	onDestroy : function (){
		this.keyNav.disable();
		delete this.keyNav;
		var mainBody = this.grid.getView().mainBody;
		mainBody && mainBody.un('mousedown', this.onMouseDown, this);
	},

	// @private
	onRowDblClick : function (grid, rowIdx, e){
		this.toggleRow(rowIdx);
	},

	onEnter : function (e){
		var g = this.grid;
		var sm = g.getSelectionModel();
		var sels = sm.getSelections();
		for ( var i = 0, len = sels.length; i < len; i++) {
			var rowIdx = g.getStore().indexOf(sels[i]);
			this.toggleRow(rowIdx);
		}
	},

	getBodyContent : function (record, index){
		if (!this.enableCaching) {
			return this.tpl.apply(record.data);
		}
		var content = this.bodyContent[record.id];
		if (!content) {
			content = this.tpl.apply(record.data);
			this.bodyContent[record.id] = content;
		}
		return content;
	},

	onMouseDown : function (e, t){
		e.stopEvent();
		var row = e.getTarget('.x-grid3-row');
		this.toggleRow(row);
	},

	renderer : function (v, p, record){
		p.cellAttr = 'rowspan="2"';
		return '<div class="' + this.expanderClass + '">&#160;</div>';
	},

	beforeExpand : function (record, body, rowIndex){
		if (this.fireEvent('beforeexpand', this, record, body, rowIndex) !== false) {
			if (this.tpl && this.lazyRender) {
				body.innerHTML = this.getBodyContent(record, rowIndex);
			}
			return true;
		} else {
			return false;
		}
	},

	toggleRow : function (row){
		if (typeof row == 'number') {
			row = this.grid.view.getRow(row);
		}
		if (Ext.fly(row).hasClass(this.leafClass)) {
			return;
		}
		this[Ext.fly(row).hasClass(this.rowCollapsedClass) ? 'expandRow' : 'collapseRow'](row);
	},

	expandRow : function (row){
		if (typeof row == 'number') {
			row = this.grid.view.getRow(row);
		}

		if (Ext.fly(row).hasClass(this.leafClass)) {
			return;
		}
		var record = this.grid.store.getAt(row.rowIndex);
		var body = Ext.DomQuery.selectNode('tr:nth(2) div.x-grid3-row-body', row);
		if (this.beforeExpand(record, body, row.rowIndex)) {
			this.state[record.id] = true;
			Ext.fly(row).replaceClass(this.rowCollapsedClass, this.rowExpandedClass);
			this.fireEvent('expand', this, record, body, row.rowIndex);
		}
	},

	expandAll : function (){
		this.triggerExpand = true;
		for ( var i = 0; i < this.grid.getStore().getCount(); i++) {
			this.expandRow(i);
		}

	},

	collapseAll : function (){
		for ( var i = 0; i < this.grid.getStore().getCount(); i++) {
			this.collapseRow(i);
		}
	},

	/**
	 * Avoid memory leaks by destroying all nested grids recursively
	 * 
	 * @param {Ext.Element} - grid element to destroy
	 */
	destroyNestedGrids : function (gridEl){
		if (gridEl) {
			if (childGridEl = gridEl.child('.x-grid-panel')) {
				this.destroyNestedGrids(childGridEl);
			}
			var grid = Ext.getCmp(gridEl.id);
			if (grid && (grid != this.grid)) {
				if (grid instanceof Ext.grid.EditorGridPanel) {
					var cm = grid.getColumnModel();
					for ( var i = 0, s = cm.getColumnCount(); i < s; i++) {
						for ( var ii = 0, ss = grid.getStore().getCount(); ii < ss; ii++) {
							if (editor = cm.getCellEditor(i, ii)) {
								editor.destroy();
							}
						}
					}
					cm.destroy();
				}
				grid.destroy();
			}
		}
	},

	collapseRow : function (row){
		if (typeof row == 'number') {
			row = this.grid.view.getRow(row);
		}
		this.triggerExpand = false;
		if (Ext.fly(row).hasClass(this.leafClass)) {
			return;
		}

		var record = this.grid.store.getAt(row.rowIndex);
		var body = Ext.fly(row).child('tr:nth(1) div.x-grid3-row-body', true);
		if (this.fireEvent('beforecollapse', this, record, body, row.rowIndex) !== false) {
			this.destroyNestedGrids(Ext.get(row).child('.x-grid-panel'));
			if (record)
				this.state[record.id] = false;
			Ext.fly(row).replaceClass(this.rowExpandedClass, this.rowCollapsedClass);
			this.fireEvent('collapse', this, record, body, row.rowIndex);
		}
	}
});

Ext.preg('rowexpander', Ext.ux.grid.RowExpander);

//backwards compatibility
Ext.grid.RowExpander = Ext.ux.grid.RowExpander;
