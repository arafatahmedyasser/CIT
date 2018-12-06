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

Ext.namespace('cbx.paginggrid');

/**
 
 * 
 * 
 * toolbar that is bound to a {@link Ext.ux.LockingGridView}
 * and provides information about the indexes of the requested data and the buffer
 * state.
 *
 * @class cbx.paginggrid.toolbar
 * @extends Ext.Toolbar
 * @constructor
 * @param {Object} config
 */

cbx.paginggrid.toolbar = Ext.extend(Ext.Toolbar, {

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
        	
        	/*When the second argument of the displayMsg exceeds the total count,the below condition is a 
        	 precautionary measure so that the second argument of the displayMsg doesn't exceed the totalCount */
        	var endDisplayValue = rowIndex+visibleRows;
        	if(endDisplayValue>totalCount)
        		{
        		endDisplayValue = totalCount;
        		}
        	
            var msg = totalCount == 0 ?
                this.resourceBundle[this.emptyMsg] :
                String.format(this.displayMsg, rowIndex+1,
                			endDisplayValue, totalCount);
           
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
        
       this.view.un('refresh',  this.handleReady,  this);

        this.grid.un("bodyscroll",    this.handleReady,    this);
        
        this.grid.un("afterlayout", this.view.syncScroll,    this.view);

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
        
        this.view.on('refresh',  this.handleReady,  this);
        
        this.grid.on("bodyscroll",    this.handleReady,    this);
        
        this.grid.on("afterlayout", this.view.syncScroll,    this.view);
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
    },
	handleReady: function(scrollLeft, scrollTop){
		
		if(!scrollTop){
			scrollTop = 0;
		}
		var row = this.view.getRow(0); 
		if(!row){
			this.updateInfo(0,0,0);
			return;
		}
		this.rowHeight = Ext.get(row).getHeight();
		
		var c = this.grid.getGridEl();
        var size  = c.getSize();
        var vh    = size.height;
		
		var height = vh- Ext.get(this.view.mainHd).getHeight();
		
		var visibleRows = Math.max(1, Math.floor(height/this.rowHeight));
		
		
		var rowIndex = Math.ceil((scrollTop/this.rowHeight));	
		
		
		var totalCount = this.view.ds.totalLength;
		
		// When the number of rows is greater than total count , then the total count changes.
		visibleRows>totalCount?visibleRows=totalCount:visibleRows;

		this.updateInfo(rowIndex,visibleRows,totalCount);	
	}

});