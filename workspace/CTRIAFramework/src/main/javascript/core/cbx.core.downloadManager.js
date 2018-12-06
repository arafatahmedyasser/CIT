/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns("cbx.core");
/**
 * Singleton class which will download content from the server with a standard set of specifications.
 */
cbx.core.downloadManager = Class(cbx.Observable, {
	/**
	 * 
	 */
	jsDownloadQueue : [],
	/**
	 * 
	 */
	downloadedNodes : [],
	/**
	 * 
	 */
	defaultType : "js",
	/**
	 * 
	 */
	compressMode : iportal.systempreferences.getJsCompressionFlag(),
	/**
	 * 
	 */
	compressPath : iportal.systempreferences.getOnDemandCompressPath(),
	/**
	 * 
	 */
	totalNodes : canvas.metadata.jsfilesLoader.getTotalCount(),
	/**
	 * 
	 */
	getDownloadManager : function ()
	{
		return this;
	},
	/**
	 * @tag : Array or Name - corresponding to the fileset tag in ondemand xml
	 * @callback : The callback function to be executed after loading the scripts
	 * @type : js/css - Optional - If not passed,the default type will be js
	 * @scope : optional - The optional scope to be applied to the callback
	 */
	requestScripts : function (node, callback, type, scope)
	{
		if (this.downloadedNodes.length == this.totalNodes)
		{
			callback(scope);
		} else
		{
			var nodeList;
			if (cbx.isArray(node))
			{
				nodeList = this.getNodeListFromArray(node);
			} else
			{
				nodeList = this.getNodeList(node);
			}
			type = cbx.isEmpty(type) ? this.defaultType : type;
			var that = this;
			if (cbx.isEmpty(nodeList))
			{
				callback.apply(scope);
			} else
			{
				switch (type)
				{
					case "js":

						/*
						 * if(window.preLoadEvent){ window.preLoadEvent.detail['text'] =
						 * iportal.jsutil.getTextFromBundle(IRB.COMMON,"LBL_SCRIPTS_WAIT");
						 * window.dispatchEvent(window.preLoadEvent); }
						 */
						var progressClass = CLCR.getCmp({
							"COMP_TYPE" : "PROGRESS_BAR",
							"LAYOUT" : "CIRCULAR"
						});
						var progressParams = {};
						progressParams.progressUpdateRequired = false;
						if (progressClass)
						{
							var tmpConf = {
								"urls" : nodeList
							};
							progressParams.progressBar = new progressClass(tmpConf);
							progressParams.progressBar.initializeProgressBar();
						}
						var loadMaskScope = {

						};
						CTLOADMASKMANAGER.initiateLoadMask(loadMaskScope, iportal.jsutil.getTextFromBundle("CANVAS",
									"LOADING_MSG"));

						cbx.apply(progressParams, loadMaskScope);

						CBXJsLoader.js(nodeList, function (params)
						{
							if (progressClass)
							{
								progressParams.progressBar.stopProgressBar();
								progressParams.progressUpdateRequired = true;
							}
							that.doUpdate(node);
							callback.apply(scope);
							CTLOADMASKMANAGER.hideLoadMask(params);

						}, null, progressParams);

						break;
					case "css":
						CBXJsLoader.css(nodeList, function ()
						{
							/**
							 * process css and callback after downloading
							 */
						});
						break;
				}
			}
		}
	},
	/**
	 * 
	 */
	doUpdate : function (node)
	{
		if (cbx.isArray(node))
		{
			for (var i = 0; i < node.length; i++)
			{
				this.updateDownloadedNodeArray(node[i]);
			}
		} else
		{
			this.updateDownloadedNodeArray(node);
		}
	},
	/**
	 * 
	 */
	updateDownloadedNodeArray : function (nodeName)
	{
		if (!cbx.isEmpty(this.downloadedNodes))
		{
			if (!this.downloadedNodes.contains(nodeName))
			{
				this.downloadedNodes.push(nodeName);
			}
		} else
		{
			this.downloadedNodes.push(nodeName);
		}
	},
	/**
	 * 
	 */
	getNodeList : function (nodeName)
	{
		return this.processNode(nodeName);
	},
	/**
	 * 
	 */
	processNode : function (nodeName)
	{
		if (this.validateLoadRequest(nodeName))
		{
			return this.getJsFileMetadata(nodeName);
		} else
		{
			LOGGER.info("Download Manager skipped download of " + nodeName + " as the module has "
						+ "been downloaded already");
		}
		return [];
	},
	/**
	 * 
	 */
	getNodeListFromArray : function (nodeArray)
	{
		var fileArray = [];
		for (var i = 0; i < nodeArray.length; i++)
		{
			var tag = nodeArray[i];
			var processedNode = this.processNode(tag);
			if (!cbx.isEmpty(processedNode))
			{
				fileArray = fileArray.concat(processedNode);
			}
		}
		return fileArray.join();
	},
	/**
	 * 
	 */
	validateLoadRequest : function (nodeName)
	{
		if (!cbx.isEmpty(this.downloadedNodes))
		{
			return !this.downloadedNodes.contains(nodeName);
		}
		return true;
	},
	/**
	 * 
	 */
	getJsFileMetadata : function (nodeName)
	{
		if (false || nodeName.startsWith("WSPACE_") || "CT_READY" == nodeName || nodeName.startsWith("IMPL_")
					|| nodeName.startsWith("USER_") || nodeName.startsWith("CT_WS_LYT_"))
		{
			return canvas.metadata.jsfilesLoader.getJsMetaData(nodeName);
		} else if (!this.compressMode)
		{
			return iportal.workspace.metadata.getContextRoot() + "/CTRIAFramework/javascript/combine/" + nodeName
						+ ".js?preserveOrder=Y";
		} else
		{
			return iportal.workspace.metadata.getContextRoot() + "/CTRIAFramework/javascript/compress/" + nodeName
						+ ".js?preserveOrder=Y";

		}
	}

});
/**
 * 
 */
CBXDOWNLOADMGR = new cbx.core.downloadManager();

/**
 * The Static Constants being used for Download Manager
 */
cbx.downloadProvider = function ()
{
	var isRtl = null;
	var framework = null;
	var formFwArray = [];
	var classicGridArray = [];
	var listViewArray = [];
	var templateViewArray = [];
	var pagingViewArray = [];
	var groupViewArray = [];
	var advGroupViewArray = [];
	var calendarViewArray = [];
	var mapViewArray = [];
	var chartViewArray = [];
	var adsViewArray = [];
	var iFrameViewArray = [];
	var emptyViewArray = [];
	var appViewArray = [];
	var propertyView = [];
	var treeViewArray = [];
	var orgViewArray = [];
	var treegridArray = [];
	var multiAppTabArray = [];
	var multiAppStackArray = [];
	var multiAppIndexedArray = [];
	var multiAppTwoColumnArray = [];
	var multiAppSwitchArray = [];
	var multiAppExploreArray = [];
	var mutiAppCardArray = [];
	var formContainerArray = [];
	var formViewArr = [];
	var downloadConstantObj = {};
	var assignConstantObjByFramework = function ()
	{
		isRtl = iportal.preferences.isLangDirectionRTL();
		framework = iportal.systempreferences.getFramework();
		formFwArray = [ framework + "_FORM_COMPONENTS", "FORM_FRAMEWORK" ];
		classicGridArray = [ "MV_" + framework + "_CLASSIC_GRID" ]
		listViewArray = [ "MV_" + framework + "_LIST" ];
		templateViewArray = [ "MV_" + framework + "_TEMPLATE" ];
		pagingViewArray = [ "MV_" + framework + "_PAGING" ];
		groupViewArray = [ "MV_" + framework + "_GROUP" ];
		advGroupViewArray = [ "MV_" + framework + "_ADVGROUP" ];
		calendarViewArray = [ "MV_" + framework + "_CALENDAR" ];
		mapViewArray = [ "MV_" + framework + "_MAP" ];
		chartViewArray = [ "MV_CHART" ];
		adsViewArray = [ "MV_" + framework + "_ADS" ];
		iFrameViewArray = [ "MV_" + framework + "_IFRAME" ];
		emptyViewArray = [ "MV_" + framework + "_EMPTY" ];
		appViewArray = [ "MV_" + framework + "_APP" ];
		propertyView = [ "MV_" + framework + "_PROPERTY" ];
		treeViewArray = [ "MV_" + framework + "_TREE" ];
		orgViewArray = [ "MV_" + framework + "_ORG" ];
		treegridArray = [ "MV_" + framework + "_TREEGRID" ];
		multiAppTabArray = [ "MULTIAPP_" + framework + "_TAB_VIEW" ];
		multiAppStackArray = [ "MULTIAPP_" + framework + "_STACK_VIEW" ];
		multiAppIndexedArray = [ "MULTIAPP_" + framework + "_INDEXED_VIEW" ];
		multiAppTwoColumnArray = [ "MULTIAPP_" + framework + "_TWO-COLUMN_VIEW" ];
		multiAppSwitchArray = [ "MULTIAPP_" + framework + "_SWITCH_VIEW" ];
		multiAppExploreArray = [ "MULTIAPP_" + framework + "_EXPLORER_VIEW" ];
		mutiAppCardArray = [ "MULTIAPP_" + framework + "_CARD_VIEW" ];
		formContainerArray = new Array().concat(formFwArray);
	formContainerArray.push("FORM_CONTAINER_FRAMEWORK");
	formContainerArray.push(framework + "_FORM_CONTAINER_FRAMEWORK");
		formViewArr = new Array().concat(formFwArray);
	formViewArr.push("MV_" + framework + "_FORM");
	if (isRtl)
	{
		formFwArray.push(framework + "_RTL_FORM");
		formContainerArray.push("FORM_CONTAINER_FRAMEWORK_RTL");
		formViewArr.push(framework + "_RTL_FORM");
		formViewArr.push("MV_" + framework + "_FORM_RTL");
		classicGridArray.push(classicGridArray[0] + "_RTL");
		listViewArray.push(listViewArray[0] + "_RTL");
		templateViewArray.push(templateViewArray[0] + "_RTL");
		pagingViewArray.push(pagingViewArray[0] + "_RTL");
		groupViewArray.push(groupViewArray[0] + "_RTL");
		advGroupViewArray.push(advGroupViewArray[0] + "_RTL");
		calendarViewArray.push(calendarViewArray[0] + "_RTL");
		mapViewArray.push(mapViewArray[0] + "_RTL");
		chartViewArray.push(chartViewArray[0] + "_RTL");
		adsViewArray.push(adsViewArray[0] + "_RTL");
		iFrameViewArray.push(iFrameViewArray[0] + "_RTL");
		emptyViewArray.push(emptyViewArray[0] + "_RTL");
		appViewArray.push(appViewArray[0] + "_RTL");
		propertyView.push(propertyView[0] + "_RTL");
		treeViewArray.push(treeViewArray[0] + "_RTL");
		orgViewArray.push(orgViewArray[0] + "_RTL");
		treegridArray.push(treegridArray[0] + "_RTL");
		multiAppTabArray.push(multiAppTabArray[0] + "_RTL");
		multiAppStackArray.push(multiAppStackArray[0] + "_RTL");
		multiAppIndexedArray.push(multiAppIndexedArray[0] + "_RTL");
		multiAppTwoColumnArray.push(multiAppTwoColumnArray[0] + "_RTL");
		multiAppSwitchArray.push(multiAppSwitchArray[0] + "_RTL");
		multiAppExploreArray.push(multiAppExploreArray[0] + "_RTL");
		mutiAppCardArray.push(mutiAppCardArray[0] + "_RTL");
	}

		downloadConstantObj = {
		"FORM_FRAMEWORK" : formFwArray,
		"FORM_CONTAINER" : formContainerArray,
		"CLASSIC_GRID_VIEW" : classicGridArray,
		"LIST_VIEW" : listViewArray,
		"TEMPLATE_VIEW" : templateViewArray,
		"PAGING_VIEW" : pagingViewArray,
		"GROUP_VIEW" : groupViewArray,
		"ADVGROUP_VIEW" : advGroupViewArray,
		"CALENDAR_VIEW" : calendarViewArray,
		"MAP_VIEW" : mapViewArray,
		"CHART_VIEW" : chartViewArray,
		"ADS_VIEW" : adsViewArray,
		"IFRAME_VIEW" : iFrameViewArray,
		"EMPTY_VIEW" : emptyViewArray,
		"FORM_VIEW" : formViewArr,
		"APP_VIEW" : appViewArray,
		"PROPERTY_VIEW" : propertyView,
		"TREE_VIEW" : treeViewArray,
		"ORG_VIEW" : orgViewArray,
		"TREEGRID_VIEW" : treegridArray,
		"MULTIAPP_TAB_VIEW" : multiAppTabArray,
		"MULTIAPP_STACK_VIEW" : multiAppStackArray,
		"MULTIAPP_INDEXED_VIEW" : multiAppIndexedArray,
		"MULTIAPP_TWO-COLUMN_VIEW" : multiAppTwoColumnArray,
		"MULTIAPP_SWITCH_VIEW" : multiAppSwitchArray,
		"MULTIAPP_EXPLORER_VIEW" : multiAppExploreArray,
		"MULTIAPP_CARD_VIEW" : mutiAppCardArray,
		"FUSION_CHART_LIB" : "MV_FUSION_CHART"

	};
	}
	assignConstantObjByFramework();
	return {
		/**
		 * 
		 */
		getConstant : function (key)
		{
			var value = downloadConstantObj[key] ? downloadConstantObj[key] : null;
			if (!cbx.isEmpty(value))
			{
				return value;
			} else
			{
				return key;
			}
		},
		isCanvasDefaultConstant : function (key)
		{
			if (this.getConstant(key) == key)
				return false;
			else
				return true;
		},
		getMergedArray : function (keyArray)
		{
			var returnArray = [];
			if (cbx.isArray(keyArray))
			{
				for (var i = 0; i < keyArray.length; i++)
				{
					var key = keyArray[i];
					var value = this.getConstant(key);
					if (!cbx.isEmpty(value) && cbx.isArray(value))
					{
						for (var j = 0; j < value.length; j++)
						{
							returnArray.push(value[j]);
						}
					} else if (!cbx.isEmpty(value) && cbx.isString(value))
					{
						returnArray.push(value);
					}

				}
			} else
			{
				LOGGER.info("Unexpected object here..Array expected");
			}
			return returnArray;
		},
		reInitConstantobj : function ()
		{
			assignConstantObjByFramework();
		}
	}
}();
canvas.MessageBus.subscribe("canvas.hybrid.lazyChanges", 'canvas.hybrid' + cbx.id(), this, function (data)
{
	CBXDOWNLOADMGR = new cbx.core.downloadManager();
	cbx.downloadProvider.reInitConstantobj();
});
