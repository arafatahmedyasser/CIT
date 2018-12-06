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
Ext.namespace('iportal.grid');
iportal.grid.RadioSelectionModel = function(config) {
	iportal.grid.RadioSelectionModel.superclass.constructor.call(this, config);
	this.renderer = function(v, p, record){
		var checked = record === this.selections.get(0);       
		var retval =  '<div class="x-grid3-row-radio"><input type="radio" name="' + 
				this.id + '"' + 
				(checked ? 'checked="checked"' : '')  + '></div>';
				return retval;    
			}.createDelegate(this);
	};
Ext.extend(iportal.grid.RadioSelectionModel, Ext.grid.RowSelectionModel, {     
	header:'<div> </div>'    
	,width:30    
	,sortable:false
	,fixed:true    
	,dataIndex:''    
	,id:'radio'    
	,singleSelect:true    
	,selectRow:function(index) {
		iportal.grid.RadioSelectionModel.superclass.selectRow.apply(this, arguments);
		var row = Ext.fly(this.grid.view.getRow(index));
		if(row) {
			row.child('input[type=radio]').dom.checked = true;
			}
	}
	});