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
 * @class iportal.grid.checkboxSelectionModel
 * @extends Ext.ux.grid.RowSelectionModel
 * " Live grid's has defined a Row Selection Model extending Grid's selection with 
 * additional apis, however there is no equivalent for CheckBox Selection Model provided by 
 * extjs in livegrid.  Since the application uses the checkbox selection model in a livegrid view, 
 * we get javascript errors for the additional api replaceSelections in GridView.js. 
 * in order to solve this, a copy of grid's chech box selection model is taken and renamed as 
 * live grid checkbox selection model, and this class is then made to extend LiveGrid's RowSelectionModel."
 * @constructor
 * @param {Object} config The configuration options

 */

Ext.namespace('iportal.livegrid');
iportal.livegrid.checkboxSelectionModel = function(config) {
	iportal.livegrid.checkboxSelectionModel.superclass.constructor.call(this, config);
};
Ext.extend(iportal.livegrid.checkboxSelectionModel,Ext.ux.grid.livegrid.RowSelectionModel, {
    /**
     * @cfg {String} header Any valid text or HTML fragment to display in the header cell for the checkbox column
     * (defaults to '&lt;div class="x-grid3-hd-checker">&#160;&lt;/div>').  The default CSS class of 'x-grid3-hd-checker'
     * displays a checkbox in the header and provides support for automatic check all/none behavior on header click.
     * This string can be replaced by any valid HTML fragment, including a simple text string (e.g., 'Select Rows'), but
     * the automatic check all/none behavior will only work if the 'x-grid3-hd-checker' class is supplied.
     */
    header: '<div class="x-grid3-hd-checker">&#160;</div>',
    /**
     * @cfg {Number} width The default width in pixels of the checkbox column (defaults to 20).
     */
    width: 20,
    /**
     * @cfg {Boolean} sortable True if the checkbox column is sortable (defaults to false).
     */
    sortable: false,

    // private
    menuDisabled:true,
    fixed:true,
    dataIndex: '',
    id: 'checker',

    // private
    initEvents : function(){
        Ext.grid.CheckboxSelectionModel.superclass.initEvents.call(this);
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
            Ext.fly(view.innerHd).on('mousedown', this.onHdMouseDown, this);

        }, this);
    },

    // private
    onMouseDown:function(e,t){
		if(e.button===0&&(t.className=='x-grid3-row-checker'||(!this.singleSelect&&Ext.fly(t).hasClass('x-grid3-cell-inner')))){
			e.stopEvent();
			var row=e.getTarget('.x-grid3-row');
			if(row){
				var index=row.rowIndex;
				if(this.isSelected(index)){
					this.deselectRow(index);
					var hd=Ext.DomQuery.selectNode('.x-grid3-hd-checker',this.grid.view.innerHd);
					if(hd)
						Ext.fly(hd).removeClass('x-grid3-hd-checker-on');
				}
				else{
					this.selectRow(index,true);
					if(this.getCount()==this.grid.store.getCount()){
						var hd=Ext.DomQuery.selectNode('.x-grid3-hd-checker',this.grid.view.innerHd);
						if(hd)
							Ext.fly(hd).addClass('x-grid3-hd-checker-on');
					}
				}
			}
		}
	},

    // private
    onHdMouseDown : function(e, t){
    	
		//return;// To stop select all rows since problem for singleselectional model
    	if(this.selectAllRows){
    		if(t.className == 'x-grid3-hd-checker'){
                e.stopEvent();
                var hd = Ext.fly(t.parentNode);
                var isChecked = hd.hasClass('x-grid3-hd-checker-on');
                if(isChecked){
                    hd.removeClass('x-grid3-hd-checker-on');
                    this.clearSelections();
                }else{
                    hd.addClass('x-grid3-hd-checker-on');
                    this.selectAll();
                }
            }
    	}else{
    		return;
    	}
      
    },

    // private
    renderer : function(v, p, record){
        return '<div class="x-grid3-row-checker">&#160;</div>';
    },
    /*
     * Method overridden from RowSelectionModel 
     * in checkboxSelectionModel class
     * */
    replaceSelections : function(records)
    {
	    if (!records || records.length == 0) {
	    return;
	    }
	    
	    var ds = this.grid.store;
	    var rec = null;
	    
	    var assigned = [];
	    var ranges = this.getPendingSelections();
	    var rangesLength = ranges.length
	    
	    var selections = this.selections;
	    var index = 0;
	    
	    for (var i = 0; i < rangesLength; i++) {
		    index = ranges[i];
		    rec = ds.getAt(index);
		    if (rec) {
			    selections.add(rec);
			    assigned.push(rec.id);
			    delete this.pendingSelections[index];
		    }
	    }
	    
	    var id = null;
	    for (i = 0, len = records.length; i < len; i++) {
		    rec = records[i];
		    id = rec.id;
		    if (assigned.indexOf(id) == -1 && selections.containsKey(id)) {
		    	selections.add(rec);
		    }
		    /*
		     *  Found that after each load, the buffer reader was creating new rows 
		     * even when the user scroll back. Added check to compare the data with its value and update
		     * the selections.
		     * */
		    for(var inum=0; inum< selections.items.length; inum++){
		    	if(!Ext.isEmpty(selections.itemAt(inum))){
		    		if(Ext.encode(rec.json)== Ext.encode(selections.itemAt(inum).json)){
		    			this.selections.removeAt(inum);
		    			selections.add(rec);
		    		}
		    	}
		    }
		   
	    }
	    
	}
   
    ,refresh:function(){
	if(!Ext.isEmpty(this.allSelected))
    		this.allSelected=false;
    	this.selections.clear();
    }
 
});