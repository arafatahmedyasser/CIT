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
package com.intellectdesign.canvas.web.themes;

import java.util.HashMap;
import java.util.Map;

import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistry;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistryIndexer;

/**
 * This class is for ThemesIndexe containing ICanvasRegistryIndexer
 * 
 * @version 1.0
 */
public class ThemesIndexer implements ICanvasRegistryIndexer
{
	private Map<String, ThemesMap> localIndex = null;
	@SuppressWarnings("unused")
	private ICanvasRegistry themeRegistry = null;

	/**
	 * ref to hashmap themesIndexer
	 */
	public ThemesIndexer()
	{
		localIndex = new HashMap<String, ThemesMap>();
	}

	/**
	 * this method ref to ContentAdded ThemesIndexer RelativePathTheme
	 * 
	 * @param aContent
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistryListener#contentAdded(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	public void contentAdded(ICanvasRegistryContent aContent) throws BaseException
	{
		if (aContent instanceof ThemesMap)
		{
			ThemesMap themeMap = (ThemesMap) aContent;
			String indexKey = themeMap.getMode() + "-" + themeMap.getThemeId() + "-" + themeMap.getContextRoot();
			localIndex.put(indexKey, themeMap);
		}

	}

	/**
	 * this method ref to ContentRemoved
	 * 
	 * @param aContent
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistryListener#contentRemoved(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	public void contentRemoved(ICanvasRegistryContent aContent) throws BaseException
	{
		if (aContent instanceof ThemesMap)
		{
			ThemesMap themeMap = (ThemesMap) aContent;
			String indexKey = themeMap.getMode() + "-" + themeMap.getThemeId() + "" + themeMap.getContextRoot();
			// If the content in index is same object as that passed, then remove the same.
			if (localIndex.containsValue(aContent))
				localIndex.remove(indexKey);
		}
	}

	/**
	 * this method ref to ContentReplacing
	 * 
	 * @param oldContent
	 * @param newContent
	 * @return
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistryListener#contentReplacing(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent,
	 *      com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	public boolean contentReplacing(ICanvasRegistryContent oldContent, ICanvasRegistryContent newContent)
			throws BaseException
	{
		contentRemoved(oldContent);
		contentAdded(newContent);
		return true;
	}

	/**
	 * this method ref to IcanvasRegistryContentMatch
	 * 
	 * @param args
	 * @return
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistryIndexer#match(java.lang.Object[])
	 */
	@Override
	public ICanvasRegistryContent match(Object... args)
	{
		ICanvasRegistryContent matchItem = null;
		String indexKey = "";
		if (args.length > 0)
		{
			// Read only the first argument and that too is expected to be a String. Else convert the same to a String
			// and then search
			indexKey = args[0] != null ? args[0].toString() : "";
		}
		if (localIndex.containsKey(indexKey))
			matchItem = localIndex.get(indexKey);

		return matchItem;

	}

	/**
	 * This method ref to Registry to ParentRegistry
	 * 
	 * @param parentRegistry
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistryIndexer#setRegistry(com.intellectdesign.canvas.spec.registry.ICanvasRegistry)
	 */
	@Override
	public void setRegistry(ICanvasRegistry parentRegistry)
	{
		themeRegistry = parentRegistry;

	}

}
