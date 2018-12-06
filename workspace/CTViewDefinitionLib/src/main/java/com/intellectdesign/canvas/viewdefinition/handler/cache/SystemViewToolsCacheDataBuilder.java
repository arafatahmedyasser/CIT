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

package com.intellectdesign.canvas.viewdefinition.handler.cache;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import com.intellectdesign.canvas.cache.handler.CacheDataBuilder;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionConstants;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionException;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionInstruction;

/**
 * This cache handler prepares the data for the view tools. This creates a cache having a map of the widget id + view id
 * as the key and the list of tools as the value. The list of tools is present as a comma separated value.
 * 
 * @version 1.0
 */
public class SystemViewToolsCacheDataBuilder extends CacheDataBuilder
{
	/**
	 * Initializes the cache with the tools that are applicable for the widget and view id.
	 * 
	 * @param hm
	 * @return list
	 * @see com.intellectdesign.canvas.constants.CacheDataBuilder.handler.CacheHandler#initializeCache(javax.servlet.http.HttpSession)
	 */
	@Override
	protected List initializeCache(HashMap aMap)
	{
		List returnList = null;

		LOGGER.ctdebug("CTVDF00236");
		ViewDefinitionInstruction instruction = new ViewDefinitionInstruction();
		try
		{
			returnList = instruction.getWidgetViewToolsMapping();
			LOGGER.ctdebug("CTVDF00237", returnList);
			returnList = processWidgetViewToolsMap(returnList);
			LOGGER.ctdebug("CTVDF00238", returnList);
		} catch (ViewDefinitionException vde)
		{
			LOGGER.cterror("CTVDF00239", vde);
		}
		return returnList;
	}

	/**
	 * This method prepares a map as below - key = widgetId + '-' + view Id Value = comma separated list of tools for
	 * which the configuration value is Y. This map is added to the first element of the list.
	 * 
	 * @param viewWidgetTools The list as fetched from database
	 * @return The list having the tools map for the given widget + view combination
	 */
	private List processWidgetViewToolsMap(List<HashMap> viewWidgetTools)
	{
		HashMap aMap;
		String widgetId;
		String viewId;
		StringBuffer toolsBuffer = new StringBuffer();
		HashMap<String, String> viewToolsMap = new HashMap<String, String>();
		Iterator<HashMap> iterator = viewWidgetTools.iterator();

		while (iterator.hasNext())
		{
			toolsBuffer.setLength(0);
			aMap = iterator.next();
			widgetId = (String) aMap.get(ViewDefinitionConstants.PARAM_WIDGET_ID);
			viewId = (String) aMap.get(ViewDefinitionConstants.VIEW_ID);
			// Check each of the tools
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_CUSTOMIZE, ViewDefinitionConstants.TOOLS_CUSTOMIZE, aMap,
					toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_EXPORT_TO_EXCEL,
					ViewDefinitionConstants.TOOLS_EXPORT_TO_EXCEL, aMap, toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_EXPORT_TO_PDF, ViewDefinitionConstants.TOOLS_EXPORT_TO_PDF,
					aMap, toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_EXPORT_TO_CSV, ViewDefinitionConstants.TOOLS_EXPORT_TO_CSV,
					aMap, toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_EXPORT_TO_JPG, ViewDefinitionConstants.TOOLS_EXPORT_TO_JPG,
					aMap, toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_FILTER, ViewDefinitionConstants.TOOLS_FILTER, aMap,
					toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_HELP, ViewDefinitionConstants.TOOLS_HELP, aMap, toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_HISTORY, ViewDefinitionConstants.TOOLS_HISTORY, aMap,
					toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_PRINT, ViewDefinitionConstants.TOOLS_PRINT, aMap, toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_PULL_OUT, ViewDefinitionConstants.TOOLS_PULLOUT, aMap,
					toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_REFRESH, ViewDefinitionConstants.TOOLS_REFRESH, aMap,
					toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_COLLAPSE, ViewDefinitionConstants.TOOLS_COLLAPSE, aMap,
					toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_SHOW_AS_TOOLBAR,
					ViewDefinitionConstants.TOOLS_SHOW_AS_TOOLBAR, aMap, toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_MAXIMIZE, ViewDefinitionConstants.TOOLS_MAXIMIZE, aMap,
					toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_CHART, ViewDefinitionConstants.TOOLS_CHART, aMap, toolsBuffer);

			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_EXPORT_TO_RTF, ViewDefinitionConstants.TOOLS_EXPORT_TO_RTF,
					aMap, toolsBuffer);

			if (aMap.get(ViewDefinitionConstants.CUSTOM_TOOLS_ID) != null
					&& aMap.get(ViewDefinitionConstants.CUSTOM_TOOLS_ID).toString() != "")
			{
				toolsBuffer.append(",").append(aMap.get(ViewDefinitionConstants.CUSTOM_TOOLS_ID).toString());
				viewToolsMap.put(widgetId + "-" + viewId + "-" + ViewDefinitionConstants.CUSTOM_TOOLS_ID,
						aMap.get(ViewDefinitionConstants.CUSTOM_TOOLS_ID).toString());
			}

			viewToolsMap.put(widgetId + "-" + viewId, toolsBuffer.toString());
		}

		viewWidgetTools.clear();
		viewWidgetTools.add(viewToolsMap);
		return viewWidgetTools;
	}

	/**
	 * Helper method that checks whether the value for the field name provided is Yes in the map. If yes, then it
	 * appends the toolKey to the Stringbuffer.
	 * 
	 * @param toolFieldName The field name to check
	 * @param toolKey The key to be added to the buffer
	 * @param aMap The map having the tools configuration
	 * @param toolsBuffer The buffer consolidating the tools
	 */
	private void checkAndAdd(String toolFieldName, String toolKey, HashMap aMap, StringBuffer toolsBuffer)
	{
		// If the tool configuration is yes, then proceed with adding the same to tools buffer
		if (ViewDefinitionConstants.VAL_BOOL_YES.equals(aMap.get(toolFieldName)))
		{
			if (toolsBuffer.length() > 0)
				toolsBuffer.append(",");
			toolsBuffer.append(toolKey);
		}
	}

	/**
	 * This is called to validate any parameters. Since this handler does not expect any parameters to be provided just
	 * return null.
	 * 
	 * @see com.intellectdesign.canvas.constants.CacheDataBuilder.handler.CacheHandler#validateParameters(java.util.HashMap)
	 */
	@Override
	protected String validateParameters(HashMap params)
	{
		// Nothing to validate here
		return null;
	}

	private static Logger LOGGER = Logger.getLogger(SystemViewToolsCacheDataBuilder.class);
}
