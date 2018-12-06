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
Ext.namespace("Ext.ux.menu");
var gridWindow=null;
Ext.ux.menu.RangeMenuString = function(config){
	this.widgetId=config.widgetId?config.widgetId:'';
	this.columnVal=config.columnVal?config.columnVal:'';
	this.extraParams=config.extraParams?config.extraParams:'';
	this.enableMenu=false;
	this.lookupFilterWindow=null;
    Ext.ux.menu.RangeMenuString.superclass.constructor.call(this, config);

    this.addEvents(
        /**
         * @event update
         * Fires when a filter configuration has changed
         * @param {Ext.ux.grid.filter.Filter} this The filter object.
         */
        'update'
    );
  
    this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);

    var i, len, item, cfg, Cls;

    for (i = 0, len = this.menuItems.length; i < len; i++) {
        item = this.menuItems[i];
        if (item == 'def') {
            // defaults
            cfg = {
                itemId: 'range-' + item,
                enableKeyEvents: true,
                iconCls: this.iconCls[item] || 'no-icon',
                listeners: {
                    scope: this,
                    keyup: this.onInputKeyUp
                },                
                rr:this
            };
            Ext.apply(
                cfg,
                // custom configs
                Ext.applyIf(this.fields[item] || {}, this.fieldCfg[item]),
                // configurable defaults
                this.menuItemCfgs
            );
            Cls = cfg.fieldCls || this.fieldCls;
            item = this.fields[item] = new Cls(cfg);
            
        }
        if (item == 'lkp') {
            // defaults
        
        var hiddenFlag=true;
        if(this.widgetId!='' && this.columnVal!='' && this.extraParams){
        	hiddenFlag=false;
        }
            cfg = {
            			rangeMenu:this,
            			iconCls: 'ux-rangemenu-eq',
            			ctCls:hiddenFlag?'hide-sf':'c-form-lookup',
            			hidden:hiddenFlag
                };
            Ext.apply(
                        cfg,
                        // custom configs
                        Ext.applyIf(this.fields[item] || {}, this.fieldCfg[item]),
                        // configurable defaults
                        this.menuItemCfgs
                    );
            Cls = cfg.fieldCls || this.fieldCls;
            item = this.fields[item] = new canvas.formComponent.editableLookUpFilter(cfg);//cbx.formElement.EditableLookUpFilter(cfg);
            
        }
        this.add(item);
    }
};
Ext.extend(Ext.ux.menu.RangeMenuString, Ext.menu.Menu, {
	fieldCls:     Ext.form.TextField, 
	fieldCfg:     '',
	updateBuffer: 1000,
	icons: {
		def: 'ux-gridfilter-text-icon', 
		lkp: 'ux-rangemenu-eq'},
		
		 fireUpdate : function () {
	        this.fireEvent('update', this);
	        //this.hide(true);
	    },
	    
	    setDefaultValue : function (scope) {
	    	var  key, field;
	    	 var key;
		        for (key in scope.fields) {
		        	if(scope.fields['lkp'].getValue()!='' && scope.fields['lkp'].getValue()!=null){
		        	scope.fields['def'].setValue(null);
		        	scope.enableMenu=false;
		        	scope.hide(true);
			    	scope.updateTask.delay(scope.updateBuffer);
		        	}
		          	
		        }
	  
			
	    },
	    /**
	     * Get and return the value of the filter.
	     * @return {String} The value of this filter
	     */
	    getValue : function () {
	        var result = {}, key, field;
	        for (key in this.fields) {
	            field = this.fields[key];
	            if (field.isValid() && String(field.getValue()).length > 0) {
	                result[key] = field.getValue();
	            }
	        }
	        return result;
	    },
	  
	    /**
	     * Set the value of this menu and fires the 'update' event.
	     * @param {Object} data The data to assign to this menu
	     */	
	    setValue : function (data) {
	        var key;
	        for (key in this.fields) {
	            this.fields[key].setValue(data[key] !== undefined ? data[key] : '');
	        }
	        //this.fields['def'].setValue(data);
	        this.fireEvent('update', this);
	    },

	    /**  
	     * @private
	     * Handler method called when there is a keyup event on an input
	     * item of this menu.
	     */
	    onInputKeyUp : function (field, e) {
	        var k = e.getKey();
	        if (k == e.RETURN && field.isValid()) {
	            e.stopEvent();
	            this.hide(true);
	            this.updateTask.delay(this.updateBuffer);
	           // return;
	        }
	        

	        if (field == this.fields.def) {
	      	 this.fields.lkp.setValue(null);
	      	 }
	        
	        // restart the timer
	        //this.updateTask.delay(this.updateBuffer);
	    }
});
