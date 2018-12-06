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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.cache.handler.CacheDataBuilder;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.viewdefinition.ToolsMenuNode;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionException;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionInstruction;

/**
 * This cache handler prepares the data for the custom view tools. This creates a cache having a map of custom tools id
 * as the key and the list of tools as the value. The list of tools is present as a string of Json data.
 * 
 * @version 1.0
 */
public class SystemCustomToolsCacheDataBuilder extends CacheDataBuilder
{
	private Logger logger = Logger.getLogger(SystemCustomToolsCacheDataBuilder.class);

	/**
	 * this is ref to InitCache ArrayList
	 * 
	 * @param params
	 * @return customtools
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#initializeCache(java.util.HashMap)
	 */
	@Override
	protected List initializeCache(HashMap params)
	{
		List<Map> customToolList = new ArrayList<Map>();
		customToolList = getCustomTools();
		return customToolList;
	}

	/**
	 * this is ref to VaildParams
	 * 
	 * @param params
	 * @return
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#validateParameters(java.util.HashMap)
	 */
	@Override
	protected String validateParameters(HashMap params)
	{

		return null;
	}

	/**
	 * This method fetches the custom tool definitions and return the list of custom tools.
	 * 
	 * @return custom tools
	 */
	protected List getCustomTools()
	{
		List customTools = null;
		try
		{
			ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
			customTools = viewDefinitionInstruction.getCustomToolsDefinition();
			customTools = processCustomTools(customTools);
		} catch (ViewDefinitionException e)
		{
			logger.ctinfo("CTVDF00224", e);
		}

		return customTools;
	}

	/**
	 * This method maps the tool id and the correspondng tools
	 * 
	 * @param toolsList
	 * @return customToolsList
	 */
	protected List processCustomTools(List toolsList)
	{
		List customTools = new ArrayList();
		List<ToolsMenuNode> toolNodeList;
		String customToolID = "-1";
		String toolsJson = "";
		HashMap toolId_toolsMap = new HashMap();

		toolNodeList = getHierarchialToolsList(toolsList);

		for (ToolsMenuNode tools : toolNodeList)
		{
			if (customToolID.equals(tools.getCustom_Tools_Id()))
			{
				toolsJson += "," + tools.toString();
			} else
			{
				if (customToolID.equals("-1"))
				{
					toolsJson += "[" + tools.toString();
				} else
				{
					toolsJson += "]";
					toolId_toolsMap.put(customToolID, toolsJson);
					toolsJson = "[" + tools.toString();

				}
				customToolID = tools.getCustom_Tools_Id();

			}
		}
		toolId_toolsMap.put(customToolID, toolsJson + "]");

		customTools.add(toolId_toolsMap);
		return customTools;

	}

	/**
	 * this is ref to getHierarchialToolsList Map
	 * 
	 * @param toolsList
	 * @return customToolsList
	 */
	protected List getHierarchialToolsList(List<Map<String, String>> toolsList)
	{
		List customToolsList = new ArrayList();
		ToolsMenuNode tNode;
		Map<String, ToolsMenuNode> toolsRefMap = new HashMap<String, ToolsMenuNode>();
		for (Map<String, String> toolItem : toolsList)
		{
			if (toolItem != null)
			{
				tNode = new ToolsMenuNode(toolItem);
				toolsRefMap.put(tNode.getMenu_id(), tNode);
				if (tNode.getParent_Menu_id() == null || tNode.getParent_Menu_id().length() == 0)
				{
					customToolsList.add(tNode);
				} else
				{
					toolsRefMap.get(tNode.getParent_Menu_id()).addChildNode(tNode);
				}
			}
		}
		return customToolsList;
	}

}
