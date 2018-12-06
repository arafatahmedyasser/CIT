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
 * @class Ext.ux.form.ItemSelector
 * @extends Ext.form.Field A control that allows selection of between two
 *          Ext.ux.form.MultiSelect controls.
 * @history 2008-06-19 bpm Original code contributed by Toby Stuart (with
 *          contributions from Robert Williams)
 * @constructor Create a new ItemSelector
 * @param {Object}
 *            config Configuration options
 * @xtype itemselector
 */


Ext.ux.form.ItemSelector = Ext.extend(Ext.form.Field, {
	hideNavIcons : false,
	imagePath:'',
	iconUp : "s.gif",
	iconDown : "s.gif",
	iconLeft : "s.gif",
	iconRight : "s.gif",
	iconTop : "s.gif",
	iconBottom : "s.gif",
	drawUpIcon : true,
	drawDownIcon : true,
	drawLeftIcon : true,
	drawRightIcon : true,
	drawTopIcon : true,
	drawBotIcon : true,
	delimiter : ',',
	bodyStyle : null,
	border : false,
	cls:'itemselector-field',
	defaultAutoCreate : {
		tag : "div"
	},
	 /**
	 * @cfg {Object} required ,to specify the internal configuration of multiselects
	 */
	msConfig : [],

	fromMultiselect:null, 	
	/**
	 * @cfg {Array} multiselects An array of {@link Ext.ux.form.MultiSelect}
	 *      config objects, with at least all required parameters (e.g., store)
	 */
	multiselects : null,

	initComponent : function (){
		
		Ext.ux.form.ItemSelector.superclass.initComponent.call(this);
		this.addEvents({
			'rowdblclick' : true,
			'change' : true
		});
	},

	onRender : function (ct, position){
		Ext.ux.form.ItemSelector.superclass.onRender.call(this, ct, position);

	

		this.fromMultiselect = new Ext.ux.form.MultiSelect(Ext.applyIf(this.multiselects[0]));
		this.fromMultiselect.on('dblclick', this.onRowDblClick, this);

		this.toMultiselect = new Ext.ux.form.MultiSelect(Ext.applyIf(this.multiselects[1]));
		this.toMultiselect.on('dblclick', this.onRowDblClick, this);
		
		//panel configuration for icons
		var icons = new Ext.Panel({
			header : false
		});
		/*
		 * panel configuration for the itemselector.It is basically a table
		 * layout inside a panel which will render three items inside 1.avaiable
		 * List panel 2.Icons 3.selected list panel
		 * 
		 */
		var p = new Ext.Panel({
			layout : 'table',
			cls : 'cbx-itemselector',
			layoutConfig : {
				tableAttrs : {
					style : {
						width : '100%'
					}
				},
				columns : 3
			},
			border : true,
			closable : false,
			items : [ this.fromMultiselect, {
				cellCls : 'multiselect-icons',
				items : [ icons ]
			}, this.toMultiselect ]

		});

		p.render(this.el);
	

		icons.el.down('.' + icons.bwrapCls).remove();

		if (this.imagePath != "" && this.imagePath.charAt(this.imagePath.length - 1) != "/")
			this.imagePath += "/";
		this.iconUp = this.imagePath + (this.iconUp || 'up2.gif');
		this.iconDown = this.imagePath + (this.iconDown || 'down2.gif');
		this.iconLeft = this.imagePath + (this.iconLeft || 'left2.gif');
		this.iconRight = this.imagePath + (this.iconRight || 'right2.gif');
		this.iconTop = this.imagePath + (this.iconTop || 'top2.gif');
		this.iconBottom = this.imagePath + (this.iconBottom || 'bottom2.gif');
		var el = icons.getEl();
		this.toTopIcon = el.createChild({
			tag : 'img',
			src : this.iconTop,
			cls:'multiselecticon iconTop',
			style : {
				cursor : 'pointer',
				margin : '2px 2px 2px 1px;'
			}
		});
		el.createChild({
			tag : 'br'
		});
		this.upIcon = el.createChild({
			tag : 'img',
			src : this.iconUp,
			cls:'multiselecticon iconUp',
			style : {
				cursor : 'pointer',
				margin : '2px 2px 2px 1px;'
			}
		});
		el.createChild({
			tag : 'br'
		});
		this.addIcon = el.createChild({
			tag : 'img',
			cls:'multiselecticon iconRight',
			src : this.iconRight,
			style : {
				cursor : 'pointer',
				margin : '2px 2px 2px 1px;'
			}
		});
		el.createChild({
			tag : 'br'
		});
		this.removeIcon = el.createChild({
			tag : 'img',
			cls:'multiselecticon iconLeft',
			src : this.iconLeft,
			style : {
				cursor : 'pointer',
				margin : '2px 2px 2px 1px;'
			}
		});
		el.createChild({
			tag : 'br'
		});
		this.downIcon = el.createChild({
			tag : 'img',
			src : this.iconDown,
			cls:'multiselecticon iconDown',
			style : {
				cursor : 'pointer',
				margin : '2px 2px 2px 1px;'
			}
		});
		el.createChild({
			tag : 'br'
		});
		this.toBottomIcon = el.createChild({
			tag : 'img',
			src : this.iconBottom,
			cls:'multiselecticon iconBottom',
			style : {
				cursor : 'pointer',
				margin : '2px 2px 2px 1px;'
			}
		});
		this.toTopIcon.on('click', this.toTop, this);
		this.upIcon.on('click', this.up, this);
		this.downIcon.on('click', this.down, this);
		this.toBottomIcon.on('click', this.toBottom, this);
		this.addIcon.on('click', this.fromTo, this);
		this.removeIcon.on('click', this.toFrom, this);
		if (!this.drawUpIcon || this.hideNavIcons) {
			this.upIcon.dom.style.display = 'none';
		}
		if (!this.drawDownIcon || this.hideNavIcons) {
			this.downIcon.dom.style.display = 'none';
		}
		if (!this.drawLeftIcon || this.hideNavIcons) {
			this.addIcon.dom.style.display = 'none';
		}
		if (!this.drawRightIcon || this.hideNavIcons) {
			this.removeIcon.dom.style.display = 'none';
		}
		if (!this.drawTopIcon || this.hideNavIcons) {
			this.toTopIcon.dom.style.display = 'none';
		}
		if (!this.drawBotIcon || this.hideNavIcons) {
			this.toBottomIcon.dom.style.display = 'none';
		}

		var tb = p.body.first();
		//CT1.0_FFW Fixes Starts
		var that=this;
		setTimeout(function(){
			that.el.setWidth(p.body.first().getWidth());
					//CT1.0_FFW Fixes Ends
		},10);
		p.body.removeClass();

		this.hiddenName = this.name;
		var hiddenTag = {
			tag : "input",
			type : "hidden",
			value : "",
			name : this.name
		};
		this.hiddenField = this.el.createChild(hiddenTag);
	},

	doLayout : function (){		
		if (this.rendered) {
			this.fromMultiselect.fs.doLayout();
			this.toMultiselect.fs.doLayout();
		}
	},
	afterRender : function (){
		Ext.ux.form.ItemSelector.superclass.afterRender.call(this);		
		this.toStore = this.toMultiselect.store;
		this.fromStore=this.fromMultiselect.store;
		this.toStore.on('add', this.valueChanged, this);
		this.toStore.on('remove', this.valueChanged, this);
		this.toStore.on('load', this.valueChanged, this);
		this.valueChanged(this.toStore);
		
	},
	
	toTop : function (){
		var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
		var records = [];
		if (selectionsArray.length > 0) {
			selectionsArray.sort();
			for ( var i = 0; i < selectionsArray.length; i++) {
				record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
				records.push(record);
			}
			selectionsArray = [];
			for ( var i = records.length - 1; i > -1; i--) {
				record = records[i];
				this.toMultiselect.view.store.remove(record);
				this.toMultiselect.view.store.insert(0, record);
				selectionsArray.push(((records.length - 1) - i));
			}
		}
		this.toMultiselect.view.refresh();
		this.toMultiselect.view.select(selectionsArray);
	},

	toBottom : function (){
		var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
		var records = [];
		if (selectionsArray.length > 0) {
			selectionsArray.sort();
			for ( var i = 0; i < selectionsArray.length; i++) {
				record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
				records.push(record);
			}
			selectionsArray = [];
			for ( var i = 0; i < records.length; i++) {
				record = records[i];
				this.toMultiselect.view.store.remove(record);
				this.toMultiselect.view.store.add(record);
				selectionsArray.push((this.toMultiselect.view.store.getCount()) - (records.length - i));
			}
		}
		this.toMultiselect.view.refresh();
		this.toMultiselect.view.select(selectionsArray);
	},

	up : function (){
		var record = null;
		var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
		selectionsArray.sort();
		var newSelectionsArray = [];
		if (selectionsArray.length > 0) {
			for ( var i = 0; i < selectionsArray.length; i++) {
				record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
				if ((selectionsArray[i] - 1) >= 0) {
					this.toMultiselect.view.store.remove(record);
					this.toMultiselect.view.store.insert(selectionsArray[i] - 1, record);
					newSelectionsArray.push(selectionsArray[i] - 1);
				}
			}
			this.toMultiselect.view.refresh();
			this.toMultiselect.view.select(newSelectionsArray);
		}
	},

	down : function (){
		var record = null;
		var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
		selectionsArray.sort();
		selectionsArray.reverse();
		var newSelectionsArray = [];
		if (selectionsArray.length > 0) {
			for ( var i = 0; i < selectionsArray.length; i++) {
				record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
				if ((selectionsArray[i] + 1) < this.toMultiselect.view.store.getCount()) {
					this.toMultiselect.view.store.remove(record);
					this.toMultiselect.view.store.insert(selectionsArray[i] + 1, record);
					newSelectionsArray.push(selectionsArray[i] + 1);
				}
			}
			this.toMultiselect.view.refresh();
			this.toMultiselect.view.select(newSelectionsArray);
		}
	},

	fromTo : function (){
		var selectionsArray = this.fromMultiselect.view.getSelectedIndexes();
		var records = [];
		if (selectionsArray.length > 0) {
			for ( var i = 0; i < selectionsArray.length; i++) {
				record = this.fromMultiselect.view.store.getAt(selectionsArray[i]);
				records.push(record);
			}
			if (!this.allowDup)
				selectionsArray = [];
			for ( var i = 0; i < records.length; i++) {
				record = records[i];
				if (this.allowDup) {
					var x = new Ext.data.Record();
					record.id = x.id;
					delete x;
					this.toMultiselect.view.store.add(record);
				} else {
					this.fromMultiselect.view.store.remove(record);
					this.toMultiselect.view.store.add(record);
					selectionsArray.push((this.toMultiselect.view.store.getCount() - 1));
				}
			}
		}
		this.toMultiselect.view.refresh();
		this.fromMultiselect.view.refresh();
		var si = this.toMultiselect.store.sortInfo;
		if (si) {
			this.toMultiselect.store.sort(si.field, si.direction);
		}
		this.toMultiselect.view.select(selectionsArray);
	},

	toFrom : function (){
		var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
		var records = [];
		if (selectionsArray.length > 0) {
			for ( var i = 0; i < selectionsArray.length; i++) {
				record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
				records.push(record);
			}
			selectionsArray = [];
			for ( var i = 0; i < records.length; i++) {
				record = records[i];
				this.toMultiselect.view.store.remove(record);
				if (!this.allowDup) {
					this.fromMultiselect.view.store.add(record);
					selectionsArray.push((this.fromMultiselect.view.store.getCount() - 1));
				}
			}
		}
		this.fromMultiselect.view.refresh();
		this.toMultiselect.view.refresh();
		var si = this.fromMultiselect.store.sortInfo;
		if (si) {
			this.fromMultiselect.store.sort(si.field, si.direction);
		}
		this.fromMultiselect.view.select(selectionsArray);
	},	
	
	
	onRowDblClick : function (vw, index, node, e){
		if (vw == this.toMultiselect.view) {
			this.toFrom();
		} else if (vw == this.fromMultiselect.view) {
			this.fromTo();
		}
		return this.fireEvent('rowdblclick', vw, index, node, e);
	}

});

Ext.reg('itemselector', Ext.ux.form.ItemSelector);

// backwards compat
Ext.ux.ItemSelector = Ext.ux.form.ItemSelector;
