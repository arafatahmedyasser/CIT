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
 * This provides the row rendered at the end of the records to display the total.
 * 
 * The File is completely modified to read the response of the gridview and render the total which is 
 * recieved from the server.
 * 
 * @class Ext.ux.GridTotals
 * @extends Ext.util.Observable
 * @param {Object} config
 */

Ext.ux.GridTotals = Ext.extend(Ext.util.Observable, {
	/**
	 * @cfg default function to say how to retrieve the data from the root of
	 *      the response given to the grid
	 */
	totalRoot : function (data){
		return data;
	},
	/**
	 * The constructor to apply the totalRoot configuration to this component
	 */
	constructor : function (config){
		config = config || {};
		this.totalRoot = config.totalRoot;
		Ext.ux.GridTotals.superclass.constructor.call(this, config);
	},
	/**
	 * The method called during the init of this plugin.
	 */
	init : function (g){
		var v = g.getView();
		this.grid = g;
		this.store = g.getStore();
		/**
		 *  Need to override GridView's findRow to not consider total's row as normal grid row.
		 */
		v.findRow = function (el){
			if (!el) {
				return false;
			}
			if (this.fly(el).findParent('.x-grid-total-row', this.rowSelectorDepth)) {
				return (false);
			} else {
				return this.fly(el).findParent(this.rowSelector, this.rowSelectorDepth);
			}
		};
		g.cls = (g.cls || '') + ' x-grid3-simple-totals';
		g.gridTotals = this;
		
		/**
		 * The total is updated whenever the store of the grid is updated.
		 */
		this.store.on({
			reconfigure : {
				fn : this.onGridReconfigure,
				scope : this
			},
			add : {
				fn : this.updateTotals,
				scope : this
			},
			remove : {
				fn : this.updateTotals,
				scope : this
			},
			update : {
				fn : this.updateTotals,
				scope : this
			},
			datachanged : {
				fn : this.updateTotals,
				scope : this
			}
		});
		v.initElements = v.initElements.createSequence(this.initElements, this);
	},
	/**
	 * The Method is overriden to make the the total row scroll as the grid view is scrolled.
	 */
	initElements : function (){
		var v = this.grid.getView();
		v.scroller.on('scroll', function (){
			v.totalsRow.setStyle({
				left : -v.scroller.dom.scrollLeft + 'px'
			});
		});
	},
	/**
	 * The method that calls the totalRoot function and returns the data
	 * @param {Ext.grid.GridView} view the gridpanel is binded with.
	 */
	getTotals : function (v){
		var store = v.grid.store;
		var totalData = this.totalRoot(store.reader.jsonData.response.value.ADDITIONAL_DATA);
		return totalData;
	},
	/**
	 * The method that calls the getTotals function and get the render function to get the actual content.
	 */
	getRenderedTotals : function (){
		var v = this.grid.getView();
		var store = v.grid.store;
		var totals = this.getTotals(v);
		var cs = v.getColumnData();
		var totVal = [];
		for ( var c = 0, nc = cs.length; c < nc; c++) {
			totVal.push(totals[cs[c].name]);
		}
		var columns = v.cm.config;
		var cells = '', p = {};
		for ( var c = 0, nc = cs.length, last = nc - 1; c < nc; c++) {
			var v = Ext.isDefined(totVal[c]) ? totVal[c] : '';
			if (columns[c].renderer) {
				var renderer = columns[c].renderer;
				if (Ext.isString(renderer)) {
					renderer = Ext.util.Format[renderer];
				}
				totVal[c] = renderer.call(columns[c].scope,v, p, {
					data : totals,
					json : totals
				}, undefined, c, store);
			}
		}
		return (totVal);
	},
	/**
	 *  The method that calls getRenderedTotals function and renders the the total in the total rows.
	 */
	updateTotals : function (){
		if (!this.grid.rendered || this.grid.getStore().totalLength == 0) {
			return;
		}
		var v = this.grid.getView();
		if (!v.totalsRow) {
			v.mainWrap.setStyle('position', 'relative');
			v.bordertotalsRow = v.templates.row.append(v.mainWrap, {
				tstyle : 'width:' + (v.grid.el.getWidth() - 17) + 'px' + ';height:17px',
				cells : ''
			}, true);
			v.totalsRow = v.templates.row.append(v.mainWrap, {
				tstyle : 'width:' + v.mainBody.getWidth() + 'px',
				cells : ''
			}, true);
			v.bordertotalsRow.addClass('x-gridborder-total-row');
			v.totalsRow.addClass('x-grid-total-row');
			v.totalsTr = v.totalsRow.child('tr').dom;
		}
		var totals = this.getRenderedTotals();
		var cs = v.getColumnData();
		var cells = '', p = {};
		for ( var c = 0, nc = cs.length, last = nc - 1; c < nc; c++) {
			p.id = cs[c].id;
			p.style = cs[c].style;
			p.css = c == 0 ? 'x-grid3-cell-first ' : (c == last ? 'x-grid3-cell-last ' : '');
			cells += v.templates.cell.apply(Ext.apply({
				value : totals[c]
			}, cs[c]));
		}
		while (v.totalsTr.hasChildNodes()) {
			v.totalsTr.removeChild(v.totalsTr.lastChild);
		}
		Ext.DomHelper.insertHtml('afterBegin', v.totalsTr, cells);
	},
	onGridReconfigure : Ext.emptyFn
});