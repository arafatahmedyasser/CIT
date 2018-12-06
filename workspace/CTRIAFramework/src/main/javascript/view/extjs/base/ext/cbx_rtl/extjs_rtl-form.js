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



Ext.override(Ext.layout.FormLayout, {
    setContainer : function(ct){
        Ext.layout.FormLayout.superclass.setContainer.call(this, ct);
        if(ct.labelAlign){
            ct.addClass('x-form-label-'+ct.labelAlign);
        }

        if(ct.hideLabels){
            this.labelStyle = "display:none";
            this.elementStyle = "padding-right:0;"; // changed for RTL
            this.labelAdjust = 0;
        }else{
            this.labelSeparator = ct.labelSeparator || this.labelSeparator;
            ct.labelWidth = ct.labelWidth || 100;
            if(typeof ct.labelWidth == 'number'){
                var pad = (typeof ct.labelPad == 'number' ? ct.labelPad : 5);
                this.labelAdjust = ct.labelWidth+pad;
                this.labelStyle = "width:"+ct.labelWidth+"px;";
                this.elementStyle = "padding-right:"+(ct.labelWidth+pad)+'px';  // changed for RTL
            }
            if(ct.labelAlign == 'top'){
                this.labelStyle = "width:auto;";
                this.labelAdjust = 0;
                this.elementStyle = "padding-right:0;";  // changed for RTL
            }
        }
    }
});

Ext.override(Ext.form.Field, {
    alignErrorIcon: function(){ this.errorIcon.alignTo(this.el, 'tr-tl', [-2, 0]); }
});

Ext.override(Ext.form.TriggerField, {
    alignErrorIcon: function() {
        if(this.wrap){
            this.errorIcon.alignTo(this.wrap, 'tr-tl', [-2, 0]);
        }
    }
});
/*
// CheckbxGroup
Ext.override(Ext.form.CheckboxGroup ,{
    onRender : function(ct, position){
        if(!this.el){
            var panelCfg = {
                cls: this.groupCls,
                layout: 'column',
                border: false,
                renderTo: ct
            };
            var colCfg = {
                defaultType: this.defaultType,
                layout: 'form',
                hideLabels: true,   // added for correct display of rtl
                border: false,
                defaults: {
                    hideLabel: true,
                    anchor: '100%'
                }
            };
            if(this.items[0].items){

                // The container has standard ColumnLayout configs, so pass them in directly

                Ext.apply(panelCfg, {
                    layoutConfig: {columns: this.items.length},
                    defaults: this.defaults,
                    items: this.items
                });
                for(var i=0, len=this.items.length; i<len; i++){
                    Ext.applyIf(this.items[i], colCfg);
                };

            }else{

                // The container has field item configs, so we have to generate the column
                // panels first then move the items into the columns as needed.

                var numCols, cols = [];

                if(typeof this.columns == 'string'){ // 'auto' so create a col per item
                    this.columns = this.items.length;
                }
                if(!Ext.isArray(this.columns)){
                    var cs = [];
                    for(var i=0; i<this.columns; i++){
                        cs.push((100/this.columns)*.01); // distribute by even %
                    }
                    this.columns = cs;
                }

                numCols = this.columns.length;

                // Generate the column configs with the correct width setting
                for(var i=0; i<numCols; i++){
                    var cc = Ext.apply({items:[]}, colCfg);
                    cc[this.columns[i] <= 1 ? 'columnWidth' : 'width'] = this.columns[i];
                    if(this.defaults){
                        cc.defaults = Ext.apply(cc.defaults || {}, this.defaults);
                    }
                    cols.push(cc);
                };

                // Distribute the original items into the columns
                if(this.vertical){
                    var rows = Math.ceil(this.items.length / numCols), ri = 0;
                    for(var i=0, len=this.items.length; i<len; i++){
                        if(i>0 && i%rows==0){
                            ri++;
                        }
                        if(this.items[i].fieldLabel){
                            this.items[i].hideLabel = false;
                        }
                        cols[ri].items.push(this.items[i]);
                    };
                }else{
                    for(var i=0, len=this.items.length; i<len; i++){
                        var ci = i % numCols;
                        if(this.items[i].fieldLabel){
                            this.items[i].hideLabel = false;
                        }
                        cols[ci].items.push(this.items[i]);
                    };
                }

                Ext.apply(panelCfg, {
                    layoutConfig: {columns: numCols},
                    items: cols
                });
            }

            this.panel = new Ext.Panel(panelCfg);
            this.el = this.panel.getEl();

            if(this.forId && this.itemCls){
                var l = this.el.up(this.itemCls).child('label', true);
                if(l){
                    l.setAttribute('htmlFor', this.forId);
                }
            }

            var fields = this.panel.findBy(function(c){
                return c.isFormField;
            }, this);

            this.items = new Ext.util.MixedCollection();
            this.items.addAll(fields);
        }
        Ext.form.CheckboxGroup.superclass.onRender.call(this, ct, position);
    }
});
*/
Ext.override(Ext.form.ComboBox, { listAlign:'tr-br?' });
Ext.override(Ext.ux.layout.TableFormLayout, {
	getElementStyle : function(field) {
		/*
		 * if (this.labelAlign === 'top' || !field.labelWidth) {
		 * return this.elementStyle; } else { var pad =
		 * Ext.isNumber(this.labelPad) ? this.labelPad : 5;
		 * return 'padding-left:' + (field.labelWidth + pad) +
		 * 'px; margin-bottom : 40px'; }
		 */
		if (Ext.isIE6) {
			return '';
		}
		return 'padding-right:0px';
	}
    
});
// Global Date Filter 
Ext.override(cbx.formElement.cbxCompositeField, {
	
	createItems : function() {

		var config = {
			formId : this.formId,
			model : this.model,
			mode : this.mode,
			manager : this.manager,
			screenView : this.screenView,
			preInitConfig : this.preInitConfig
		};
		if (this.children != null) {
			config.metadata = {

			};
			config.metadata.children = this.children;
		}else{
			LOGGER.error('No Children configured for ', this.itemId);
			config.metadata={children:[]};
		}
		// Retrieving formfield items
		var formCreator = new cbx.form.FormCreator(config);
		var fields = formCreator.getFormFields();
		var flex=0;	
		var rtlFiedls = new Array();
			var len = fields.length;
			for(var i=len-1, j=0; i>=0 , j<len; i--, j++){
				rtlFiedls[j] = fields[i];
			}
			fields = rtlFiedls;		
		for ( var i = 0, len = fields.length; i < len; i++) {
			flex=parseInt(fields[i].anchor);			
			fields[i].flex = parseInt(fields[i].anchor) / 100;
		}
		return fields;
	}
});



//HtmlEditor
Ext.override(Ext.form.HtmlEditor, {
    getDocMarkup : function(){
        return '<html><head><style type="text/css">body{border:0;margin:0;padding:3px;height:98%;cursor:text;direction:rtl;}</style></head><body></body></html>';
    }
});


//DateField
Ext.override(Ext.form.DateField, {
    onTriggerClick : function(){
        if(this.disabled){
            return;
        }
        if(this.menu == null){
            this.menu = new Ext.menu.DateMenu({
                hideOnClick: false
            });
        }
        Ext.apply(this.menu.picker,  {
            minDate : this.minValue,
            maxDate : this.maxValue,
            disabledDatesRE : this.disabledDatesRE,
            disabledDatesText : this.disabledDatesText,
            disabledDays : this.disabledDays,
            disabledDaysText : this.disabledDaysText,
            format : this.format,
            showToday : this.showToday,
            minText : String.format(this.minText, this.formatDate(this.minValue)),
            maxText : String.format(this.maxText, this.formatDate(this.maxValue))
        });
        this.menu.picker.setValue(this.getValue() || new Date());
        this.menu.show(this.el, "tr-br?");
        this.menuEvents('on');
    }
});


Ext.override(Ext.ux.form.ItemSelector,{
	
	iconRight : "left2.gif",
	iconLeft : "right2.gif"
});

Ext.override(Ext.form.HtmlEditor, {
	
	/* Private Method:alignErrorIcon--to allign the error icon properly */
  alignErrorIcon: function()
  {
      try{
          this.errorIcon.alignTo(this.wrap, 'tr-tl', [2, 0]);
      }
      catch(err){}
  }
});
