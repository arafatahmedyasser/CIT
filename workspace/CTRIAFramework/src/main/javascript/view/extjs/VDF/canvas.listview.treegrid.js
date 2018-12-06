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
 * @class canvas.listview.treegrid
 * @extends Ext.ux.tree.TreeGrid
 * 
 * @xtype treegrid
 */


Ext.ns("canvas.listview");


canvas.listview.treegrid = Ext.extend(Ext.ux.tree.TreeGrid, {
        initComponent : function (){
        	
        	this.columns = this.cm.columns;
        	
			var extraParams = {
						"__LISTVIEW_REQUEST" : "Y",
						"PAGE_CODE_TYPE" : 'VDF_CODE',
						"INPUT_ACTION" : "INIT_DATA_ACTION",
						"PRODUCT_NAME" : this.productCode,
						"INPUT_FUNCTION_CODE" : this.functionCode,
						"INPUT_SUB_PRODUCT" : this.subProductCode,
						"WIDGET_ID" : this.itemId.substring(0, this.itemId.indexOf("__GRID")),
						"VIEW_ID" : this.view_id,
						
						"LAYOUT_ID" :iportal.workspace.metadata.getCurrentLayoutId(),
						"WORKSPACE_ID" :iportal.workspace.metadata.getCurrentWorkspaceId(),
						
						"forceCallbacks" : true
					};
			
					if (!Ext.isEmpty(this.filterparams)) {
						for (each in this.filterparams) {
							extraParams[each] = this.filterparams[each];
						}

					}
        	
        	function getExtParams (param){
				if (!Ext.isEmpty(param)) {
					var extParams = param.apply(that, [ extraParams ]);
					if (!Ext.isEmpty(that.filterparams)) {
						for (each in that.filterparams) {
							extParams[each] = that.filterparams[each];
						}
					}
					return extParams;

				} else {
					return extraParams;
				}

			};
		        	this.loader = new Ext.ux.tree.TreeGridLoader({
			dataUrl : iportal.listview.listviewconstants.AJAX_URL,
			baseParams : getExtParams(this.extraParamsHandler),
			processResponse : function (response, node, callback, scope)
			{
				var json = response.responseText;
				try
				{
					var o = response.responseData || Ext.decode(json);
					var o = o.response.value.ALL_RECORDS||{};
					node.beginUpdate();
					for (var i = 0, len = o.length; i < len; i++)
					{
						var n = this.createNode(o[i]);
						if (n)
						{
							node.appendChild(n);
						}
					}
					node.endUpdate();
					this.runCallback(callback, scope || node, [ node ]);
				} catch (e)
				{
					this.handleFailure(response);
				}
			}
		});
        	canvas.listview.treegrid.superclass.initComponent.call(this);
        }
    });


Ext.reg('canvastreegrid', canvas.listview.treegrid);