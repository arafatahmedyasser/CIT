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
Ext.ns('cbx.appstore');

/**
 * @class cbx.appstore.AjaxRepo
 * @returns set of Functions This class is the static class whose methods can be called without creating object of it.
 *          This class is the utility class for interacting with the server through an ajax call. This class methods are
 *          called from appstore manager (cbx.appstore.Manager). This class contains three methods : 1)
 *          getAppstoreMetadata - This method is to initialize the appstore for both Creation and Updation the
 *          Workspace. 2) save - This method is to save the appstore for both Creation and Updation the Workspace. 3)
 *          remove - This method is to delete the existing workspace. (The workspaces that has been created by
 *          Appstore).
 */

cbx.appstore.AjaxRepo = function ()
{

	return {

		/**
		 * @param config - contains Worspaceid while updating the workspace
		 * @param successHandler - Called after a successfull ajax call
		 * @param handlerScope - The Scope in which handler has to be called
		 * @returns data(through successHandler) - recieved from the ajax Call conatins prerequired data for creating
		 *          the workspace
		 */

		getAppstoreMetadata : function (config, successHandler, handlerScope)
		{

			var initparams = {
				'INPUT_PRODUCT' : 'CANVAS',
				'PRODUCT_NAME' : 'CANVAS',
				'INPUT_SUB_PRODUCT' : 'CANVAS',
				'INPUT_FUNCTION_CODE' : 'VSBLTY',
				'PAGE_CODE_TYPE' : 'WSDF_CODE',
				'INPUT_ACTION' : 'ACTION_APPSTORE_INIT_ACTION'
			};

			if (config && config.dataModel && config.dataModel.getWorkspaceId())
			{
				initparams['WORKSPACE_ID'] = config.dataModel.getWorkspaceId();
			}

			Ext.Ajax.request({
				params : initparams,
				success : function (result, request)
				{
					data = Ext.decode(result.responseText);
					successHandler.apply(handlerScope, [ data ]);
				},
				failure : function (result, request)
				{
					LOGGER.info("getAppstoreMetadata AJAX Failure", Ext.encode(result));
				}
			});

		},

		/**
		 * @param config - contains data that has to be sent to the server for saving/updating the workspace
		 * @param successHandler - Called after a successfull ajax call
		 * @param handlerScope - The Scope in which handler has to be called
		 * @returns data(through successHandler) - recieved from the ajax Call - Contains - Success message,Error
		 *          message or warning message
		 */

		save : function (config, successHandler, handlerScope)
		{

			var initparams = {
				'INPUT_PRODUCT' : 'CANVAS',
				'PRODUCT_NAME' : 'CANVAS',
				'INPUT_SUB_PRODUCT' : 'CANVAS',
				'INPUT_FUNCTION_CODE' : 'VSBLTY',
				'PAGE_CODE_TYPE' : 'WSDF_CODE',
				'INPUT_ACTION' : 'ACTION_APPSTORE_SAVE',
				'JSON_TO_HASH_MAP_SUPPORT_FLAG' : 'JSON_DATA'
			};

			if (!Ext.isEmpty(config))
			{
				initparams.JSON_DATA = Ext.encode(config);
			}

			Ext.Ajax.request({
				params : initparams,
				success : function (result, request)
				{
					data = Ext.decode(result.responseText);
					successHandler.apply(handlerScope, [ data ]);
				},
				failure : function (result, request)
				{
					LOGGER.info("save AJAX Failure", Ext.encode(result));

				}
			});

		},

		/**
		 * @param config - contains Worspaceid that has to be deleted
		 * @param successHandler - Called after a successfull ajax call
		 * @param handlerScope - The Scope in which handler has to be called
		 * @returns data(through successHandler) - recieved from the ajax Call - Contains - Success message,Error
		 *          message or warning message
		 */

		remove : function (config, successHandler, handlerScope)
		{

			var initparams = {
				'INPUT_PRODUCT' : 'CANVAS',
				'PRODUCT_NAME' : 'CANVAS',
				'INPUT_SUB_PRODUCT' : 'CANVAS',
				'INPUT_FUNCTION_CODE' : 'VSBLTY',
				'PAGE_CODE_TYPE' : 'WSDF_CODE',
				'INPUT_ACTION' : 'ACTION_APPSTORE_DELETE'
			};

			if (config && config.dataModel && config.dataModel.getWorkspaceId())
			{
				initparams['WORKSPACE_ID'] = config.dataModel.getWorkspaceId();
			}

			Ext.Ajax.request({
				params : initparams,
				success : function (result, request)
				{
					data = Ext.decode(result.responseText);
					successHandler.apply(handlerScope, [ data ]);
				},
				failure : function (result, request)
				{

					LOGGER.info("remove AJAX Failure", Ext.encode(result));

				}
			});

		}
	};
}();
