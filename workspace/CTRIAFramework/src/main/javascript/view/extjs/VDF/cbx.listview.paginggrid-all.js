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

Ext.namespace('cbx.grid');
cbx.grid.Store = Ext.extend(Ext.data.Store,{                      
					bufferSize: iportal.systempreferences.getPageSizeForPagination(),
					isLoading:false,
					remoteSort: true,
					singleSort : function(fieldName, dir) {
						var field = this.fields.get(fieldName);
						if (!field) {
							return false;
						}

						var name = field.name, sortInfo = this.sortInfo || null, sortToggle = this.sortToggle ? this.sortToggle[name]
								: null;

						if (!dir) {
							if (sortInfo && sortInfo.field == name) { // toggle
																		// sort
																		// dir
								dir = (this.sortToggle[name] || 'ASC').toggle(
										'ASC', 'DESC');
							} else {
								dir = field.sortDir;
							}
						}

						this.sortToggle[name] = dir;
						this.sortInfo = {
							field : name,
							direction : dir
						};
						this.hasMultiSort = false;

						if (this.remoteSort) {
							this.lastOptions= this.lastOptions || {};
							this.lastOptions.params = this.lastOptions.params || {};							
							this.lastOptions.params.start = 0;
							this.lastOptions.add = false;
							if (!this.load(this.lastOptions)) {
								if (sortToggle) {
									this.sortToggle[name] = sortToggle;
								}
								if (sortInfo) {
									this.sortInfo = sortInfo;
								}
							}
						} else {
							this.applySort();
							this.fireEvent('datachanged', this);
						}
						return true;
					}
				});


cbx.grid.GridView=Ext.extend(Ext.ux.grid.LockingGridView, {
	enableRowBody:true,
	showPreview:false,
	/**
	 * 
	 */
	getScrollOffset: function () {
		var boxAdjust = 1;
		var defaultWidth =  Ext.getScrollBarWidth();
		var colLength = this.cm.columns.length;
		defaultWidth = colLength>0?(defaultWidth+(colLength*boxAdjust)):defaultWidth;
		return Ext.num(this.scrollOffset,defaultWidth);
	},
	/**
	 * @private
	 * Called when a store is loaded, scrolls to the top row
	 */
	onLoad : function() {
		if (Ext.isGecko) {
			if (!this.scrollToTopTask) {
				this.scrollToTopTask = new Ext.util.DelayedTask(this.scrollToLastState, this);
			}
			this.scrollToTopTask.delay(1);
		} else {
			this.scrollToLastState();
		}
	},
	scrollToLastState: function(){
		if(this.grid && this.grid.store){
			var lastOpts= this.grid.store.lastOptions
			lastOpts.params = lastOpts.params || {};
			if(lastOpts.params.start!=null && lastOpts.params.start!=0){
				if(this.myScrollState!=null){
					this.restoreScroll(this.myScrollState);
					return;
				}
			}
		}
		this.scrollToTop();
	},

    // private
    onHeaderClick : function(g, index) {
        if (this.headersDisabled || !this.cm.isSortable(index)) {
            return;
        }
        g.stopEditing(true);
        g.store.sort(this.cm.getDataIndex(index));
        g.lmask.show();
    },
    /**
     * @private
     * Attached as the 'itemclick' handler to the header menu and the column show/hide submenu (if available).
     * Performs sorting if the sorter buttons were clicked, otherwise hides/shows the column that was clicked.
     */
    handleHdMenuClick_new : function(item) { 
        var store     = this.ds,
            dataIndex = this.cm.getDataIndex(this.hdCtxIndex);
var index = this.hdCtxIndex,
            cm = this.cm,
            id = item.getItemId(),
            llen = cm.getLockedCount();
        switch (item.getItemId()) {
            case 'asc':
                store.sort(dataIndex, 'ASC');
                this.grid.lmask.show();
                break;
            case 'desc':
                store.sort(dataIndex, 'DESC');
                this.grid.lmask.show();
                break;
				/*
				 *  * override to avail the lock and unlock options
                  
                 */
			case 'lock':
                if(cm.getColumnCount(true) <= llen + 1){
                    this.onDenyColumnLock();
                    return undefined;
                }
                cm.setLocked(index, true);
                if(llen != index){
                    cm.moveColumn(index, llen);
                    this.grid.fireEvent('columnmove', index, llen);
                }
				break;
            case 'unlock':
                if(llen - 1 != index && cm.xtype){
                    cm.setLocked(index, false, true);
                    cm.moveColumn(index, llen - 1);
                    this.grid.fireEvent('columnmove', index, llen - 1);
                }else{
                    cm.setLocked(index, false);
                }
				break;
				 
            default:
                this.handleHdMenuClickDefault(item);
        }
        return true;
    },
    /**
     * To apply the user preferred column data formats,
     * Calling the customized renderer (iportalrenderer) rather than the default renderer.
     **/
    doRender_new : function(cs, rs, ds, startRow, colCount, stripe){ 
        var ts = this.templates, ct = ts.cell, rt = ts.row, last = colCount-1,
            tstyle = 'width:'+this.getTotalWidth()+';',
            lstyle = 'width:'+this.getLockedWidth()+';',
            buf = [], lbuf = [], cb, lcb, c, p = {}, rp = {}, r;
        for(var j = 0, len = rs.length; j < len; j++){
            r = rs[j]; cb = []; lcb = [];
            var rowIndex = (j+startRow);
            for(var i = 0; i < colCount; i++){
                c = cs[i];
                p.id = c.id;
                p.css = (i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '')) +
                    (this.cm.config[i].cellCls ? ' ' + this.cm.config[i].cellCls : '');
                p.attr = p.cellAttr = '';
                
                // p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
                p.value = c.renderer.call(c.scope,r.data[c.name], p, r, rowIndex, i, ds); 
                
                p.style = c.style;
                if(Ext.isEmpty(p.value)){
                    p.value = '&#160;';
                }
                if(this.markDirty && r.dirty && Ext.isDefined(r.modified[c.name])){
                    p.css += ' x-grid3-dirty-cell';
                }
                if(c.locked){
                    lcb[lcb.length] = ct.apply(p);
                }else{
                    cb[cb.length] = ct.apply(p);
                }
            }
            var alt = [];
            if(stripe && ((rowIndex+1) % 2 === 0)){
                alt[0] = 'x-grid3-row-alt';
            }
            if(r.dirty){
                alt[1] = ' x-grid3-dirty-row';
            }
            rp.cols = colCount;
            if(this.getRowClass){
                alt[2] = this.getRowClass(r, rowIndex, rp, ds);
            }
            rp.alt = alt.join(' ');
            rp.cells = cb.join('');
            rp.tstyle = tstyle;
            buf[buf.length] = rt.apply(rp);
            rp.cells = lcb.join('');
            rp.tstyle = lstyle;
            lbuf[lbuf.length] = rt.apply(rp);
        }
        return [buf.join(''), lbuf.join('')];
    }
    
    
	/*initData: function(ds, cm){
		if(ds){
			//ds.on('beforeload', this.onBeforeLoad, this);
		}
		cbx.grid.GridView.superclass.initData.call(this, ds, cm);
	},*/
}); 


cbx.grid.GridPanel= Ext.extend(Ext.grid.GridPanel, {
	initComponent:function(){
		//this.stateful = false;
		this.stateful = true; 
		this.on("bodyscroll", this.handleDataLoad, this);
		this.on("filterupdate", this.handleFilterUpdate, this);
		cbx.grid.GridPanel.superclass.initComponent.call(this);
	},
	loadStore: function(){
		var store= this.getStore();
		if(store.isLoading==true){
			return;
		}
		
		store.load();// calling load instead of reload so that the grid doesn't uses last param information
		store.isLoading=true;
		this.lmask.show();
		
	},
	reload: function(){
		var store= this.getStore();
		if(store.isLoading==true){
			return;
		}
		
		store.load();
		store.isLoading=true;
		this.lmask.show();
		
	},
	handleFilterUpdate: function(){
		//alert("dasdas");
	},
	handleDataLoad: function(scrollLeft, scrollTop){
		var store=this.getStore();
		var threshhold=this.view.scroller.dom.scrollHeight -this.view.scroller.dom.offsetHeight-10; 	
		var oldState=this.view.myScrollState;
		var oldTop=0;
		if(store.isLoading==true){
			return;
		}
		if(oldState!=null){
			oldTop=oldState.top; 
		}
	    if (oldTop!=scrollTop && scrollTop > threshhold)
	    {

			var state = this.view.getScrollState();
			this.view.myScrollState=state;



			var top=this.view.scroller.dom.scrollTop;

			this.view.scroller.dom.scrollTop = 
			this.view.scroller.dom.scrollTop + (this.view.scroller.dom.scrollTop == 0 ? 0 : 
			this.view.scroller.dom.scrollHeight - this.view.scroller.dom.scrollHeight);

			if(store.getTotalCount()<store.bufferSize){
				return;
			}
			var opt= this.getStore().lastOptions;
			opt.params = opt.params || {};

			if(opt.params.start!=null && opt.params.start==store.getTotalCount()){
				return;
			}
			opt.params.limit=store.bufferSize;
			opt.params.start=store.getCount();
			opt.add=true;
			opt.suspendLoadEvent = true
			store.load(opt);
			store.isLoading=true;
			this.lmask.show();
	    } 
		
	}
});