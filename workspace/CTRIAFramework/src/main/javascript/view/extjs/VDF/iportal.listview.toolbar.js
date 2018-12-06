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

Ext.namespace('iportal.listview');

/**
 
 * 
 * toolbar that is bound to a {@link Ext.ux.grid.livegrid.GridView}
 * and provides information about the indexes of the requested data and the buffer
 * state.
 *
 * @class iportal.listview.Toolbar
 * @extends Ext.Toolbar
 * @constructor
 * @param {Object} config
 */
iportal.listview.toolbar = Ext.extend(Ext.Toolbar, {

    /**
     * @cfg {Ext.grid.GridPanel} grid
     * The grid the toolbar is bound to. If ommited, use the cfg property "view"
     */

    /**
     * @cfg {Ext.grid.GridView} view The view the toolbar is bound to
     * The grid the toolbar is bound to. If ommited, use the cfg property "grid"
     */

    /**
     * @cfg {Boolean} displayInfo
     * True to display the displayMsg (defaults to false)
     */
	
	/**
     * @cfg {Boolean} refreshButton
     * True to display the refreshButton (defaults to false)
     */
	

    /**
     * private
     * @cfg {String} displayMsg
     * The paging status message to display (defaults to "Displaying {start} - {end} of {total}")
     * iniatied in the initcomponent
     */
   

    /**
     * @cfg {String} emptyMsg
     * The message to display when no records are found (defaults to "No data to display")
     */
    emptyMsg : 'NO_DATA_TO_DISP',

    /**
     * Value to display as the tooltip text for the refresh button. Defaults to
     * "Refresh"
     * @param {String}
     */
    refreshText : 'REFRESH',
    
    /**
     * Value to display at starting of total count message
     * 
     */
    
    loadingMessage : 'LOADING',
    
    /**
     * The ResourceBundle used for displaying the text in the toolbar 
     * @param {String}
     */
    resourceBundle : CRB.getFWBundle(),
  

    initComponent : function()
    {
        iportal.listview.toolbar.superclass.initComponent.call(this);
        
        this.displayMsg = this.resourceBundle['DISPLAYING']+' {0} - {1} '+this.resourceBundle['OF']+' {2}';

        if (this.grid) {
            this.view = this.grid.getView();
        }

        var me = this;
        this.view.init = this.view.init.createSequence(function(){
            me.bind(this);
        }, this.view);
    },

    // private
    updateInfo : function(rowIndex, visibleRows, totalCount)
    {
        if(this.displayEl){
            var msg = totalCount == 0 ?
                this.resourceBundle[this.emptyMsg] :
                String.format(this.displayMsg, rowIndex+1,
                              rowIndex+visibleRows, totalCount);
           
            this.displayEl.setText(msg);
        }
    },

    /**
     * Unbinds the toolbar.
     *
     * @param {Ext.grid.GridView|Ext.gid.GridPanel} view Either The view to unbind
     * or the grid
     */
    unbind : function(view)
    {
        var st;
        var vw;

        if (view instanceof Ext.grid.GridView) {
            vw = view;
        } else {
            // assuming parameter is of type Ext.grid.GridPanel
            vw = view.getView();
        }

        st = view.ds;

        st.un('loadexception', this.enableLoading,  this);
        st.un('beforeload',    this.disableLoading, this);
        st.un('load',          this.enableLoading,  this);
        vw.un('rowremoved',    this.onRowRemoved,   this);
        vw.un('rowsinserted',  this.onRowsInserted, this);
        vw.un('beforebuffer',  this.beforeBuffer,   this);
        vw.un('cursormove',    this.onCursorMove,   this);
        vw.un('buffer',        this.onBuffer,       this);
        vw.un('bufferfailure', this.enableLoading,  this);

        this.view = undefined;
    },

    /**
     * Binds the toolbar to the specified {@link Ext.ux.grid.Livegrid}
     *
     * @param {Ext.grird.GridView} view The view to bind
     */
    bind : function(view)
    {
        this.view = view;
        var st = view.ds;

        st.on('loadexception',   this.enableLoading,  this);
        st.on('beforeload',      this.disableLoading, this);
        st.on('load',            this.enableLoading,  this);
        view.on('rowremoved',    this.onRowRemoved,   this);
        view.on('rowsinserted',  this.onRowsInserted, this);
        view.on('beforebuffer',  this.beforeBuffer,   this);
        view.on('cursormove',    this.onCursorMove,   this);
        view.on('buffer',        this.onBuffer,       this);
        view.on('bufferfailure', this.enableLoading,  this);
    },

// ----------------------------------- Listeners -------------------------------
    enableLoading : function()
    {
        this.loading.setDisabled(false);
    },

    disableLoading : function()
    {
        this.loading.setDisabled(true);
    },

    onCursorMove : function(view, rowIndex, visibleRows, totalCount)
    {
        this.updateInfo(rowIndex, visibleRows, totalCount);
    },

    // private
    onRowsInserted : function(view, start, end)
    {
        this.updateInfo(view.rowIndex, Math.min(view.ds.totalLength, view.visibleRows-view.rowClipped),
                        view.ds.totalLength);
    },

    // private
    onRowRemoved : function(view, index, record)
    {
        this.updateInfo(view.rowIndex, Math.min(view.ds.totalLength, view.visibleRows-view.rowClipped),
                        view.ds.totalLength);
    },

    // private
    beforeBuffer : function(view, store, rowIndex, visibleRows, totalCount, options)
    {
        this.loading.disable();
        this.updateInfo(rowIndex, visibleRows, totalCount);
    },

    // private
    onBuffer : function(view, store, rowIndex, visibleRows, totalCount)
    {
        this.loading.enable();
        this.updateInfo(rowIndex, visibleRows, totalCount);
    },

    // private
    onClick : function(type)
    {
        switch (type) {
            case 'refresh':
                if (this.view.reset(true)) {
                    this.loading.disable();
                } else {
                    this.loading.enable();
                }
            break;

        }
    },

    // private
    onRender : function(ct, position)
    {
    	Ext.PagingToolbar.superclass.onRender.call(this, ct, position);


    	this.loading = new Ext.Toolbar.Button({
    		tooltip : this.resourceBundle[this.refreshText],
    		iconCls : "x-tbar-loading",
    		handler : this.onClick.createDelegate(this, ["refresh"])
    	});
    	
    	if(this.refreshButton){	        
    		this.addButton(this.loading);
    		this.addSeparator();
    	}

    	this.addFill();

    	
    	this.displayEl = new Ext.form.Label({
			text :this.resourceBundle[this.loadingMessage]
		});

    	if(this.displayInfo){
    		this.addSeparator();
    		this.addButton(this.displayEl);
    	}
    }
});