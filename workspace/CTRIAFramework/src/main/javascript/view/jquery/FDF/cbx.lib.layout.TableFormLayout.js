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
 
cbx.ns('cbx.lib.layout.TableFormLayout');
cbx.lib.layout.TableFormLayout = Class(cbx.core.Component,{
	monitorResize : true,
	tableFormObject: '',
	tableRowObject: '',
	initialize: function (){
		this.currentColumn = 0;
		var tableFormConfig = {
			"eleType": "table"
		};
		this.tableFormObject = new cbx.lib.layer(tableFormConfig);
	},
	renderItem : function (formComponentDOM){
		var tableColumnConfig;
		var tableColumnObject;
		var tableRowConfig;
		if (this.currentColumn % this.totalColumns === 0) {
			tableRowConfig = {
				"eleType": "tr"
			};
			this.tableRowObject = new cbx.lib.layer(tableRowConfig);
		}
		tableColumnConfig = {
			'eleType': 'td'
		};
		tableColumnObject = new cbx.lib.layer(tableColumnConfig);
		tableColumnObject.addLayer(formComponentDOM);
		this.tableRowObject.addLayer(tableColumnObject.getLayer());
		this.currentColumn++;
		this.tableFormObject.addLayer(this.tableRowObject.getLayer());
	},
	getTableFormDOM: function() {
		return this.tableFormObject.getLayer();
	}
});

