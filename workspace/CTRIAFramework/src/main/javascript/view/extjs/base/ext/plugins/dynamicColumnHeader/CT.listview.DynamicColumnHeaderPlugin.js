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

Ext.namespace("CT.listview");

/*
 * The purpose of this class is to provide plugin for Dynamic Header Label  
 */

CT.listview.DynamicColumnHeaderPlugin = Ext.extend(Object, {

	init : function (component)
	{

		if (component.view)
		{
			this.grid = component;

			component.store.on("load", this.afterLoad, this);
		}

	},
	afterLoad : function (store, records)
	{
		
		var addData;

		
		if(store.reader && store.reader.jsonData &&
					store.reader.jsonData.response && 
					store.reader.jsonData.response.value &&
					store.reader.jsonData.response.value.ADDITIONAL_DATA &&
					store.reader.jsonData.response.value.ADDITIONAL_DATA.MODIFIED_COLUMN_NAMES){
		
			addData = store.reader.jsonData.response.value.ADDITIONAL_DATA.MODIFIED_COLUMN_NAMES;
		}
		

		var columns = this.grid.getColumnModel().columns;

		if (columns && addData)
		{
			for ( var j in addData)
			{
				for (i = 0, len = columns.length; i < len; i++)
				{
					if (columns[i].id == j)
					{
						this.grid.getColumnModel().setColumnHeader(i, addData[j]);
						this.grid.getColumnModel().setColumnTooltip(i, addData[j]);
						continue;
					}
				}
			}
		}

	}

});

Ext.preg('dynamicColumnHeaderPlugin', CT.listview.DynamicColumnHeaderPlugin);
