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

Ext.ns('Ext.ux.menu');

/** 
 * @class Ext.ux.menu.RangeMenu
 * @extends Ext.menu.Menu
 * Custom implementation of Ext.menu.Menu that has preconfigured
 * items for gt, lt, eq.
 * <p><b><u>Example Usage:</u></b></p>
 * <pre><code>    

 * </code></pre> 
 */
Ext.ux.menu.RangeMenu = Ext.extend(Ext.menu.Menu, {

    constructor : function (config) {

        Ext.ux.menu.RangeMenu.superclass.constructor.call(this, config);

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
            if (item !== '-') {
                // defaults
                cfg = {
                    itemId: 'range-' + item,
                    enableKeyEvents: true,
                    iconCls: this.iconCls[item] || 'no-icon',
                    numericFilterField:true, 
                    listeners: {
                        scope: this,
                        keyup: this.onInputKeyUp
                    }
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
            this.add(item);
        }
    },

    /**
     * @private
     * called by this.updateTask
     */
    fireUpdate : function () {
        this.fireEvent('update', this);
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
            
            //the event only when enter is pressed   
            this.updateTask.delay(this.updateBuffer);
            
          //  return;
        }
        
        if (field == this.fields.eq) {
            if (this.fields.gt) {
                this.fields.gt.setValue(null);
            }
            if (this.fields.lt) {
                this.fields.lt.setValue(null);
            }
        }
        else {
            this.fields.eq.setValue(null);
        }
        
        // restart the timer
        //this.updateTask.delay(this.updateBuffer);
    }
});
