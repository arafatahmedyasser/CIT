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
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionException;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionInstruction;

/**
 * This class is for system menu cache builder extends cache handler.
 * 
 * @version 1.0
 */
public class SystemMenuCacheDataBuilder extends CacheDataBuilder
{
	private Logger logger = Logger.getLogger(SystemMenuCacheDataBuilder.class);

	/**
	 * this is ref to InitCacheHM SYSTEMMenuHandler
	 * 
	 * @param params
	 * @return menulist
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#initializeCache(java.util.HashMap)
	 */
	@Override
	protected List initializeCache(HashMap params)
	{
		List<Map> menuList = new ArrayList<Map>();
		menuList = getMenuItems();

		return menuList;
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
	 * this is ref to ListMenuItems
	 * 
	 * @return
	 */
	protected List getMenuItems()
	{
		List menuItems = null;
		try
		{
			ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
			menuItems = viewDefinitionInstruction.getSystemMenuDefinition();
		} catch (ViewDefinitionException e)
		{
			logger.cterror("CTVDF00225", e);
		}

		return menuItems;
	}

}
