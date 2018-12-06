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

package com.intellectdesign.canvas.deviceband;

import java.util.HashMap;
import java.util.Map;

import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistry;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistryIndexer;

/**
 * This is the default indexer for matching a device band from the registry. This uses the Device Category as the means
 * to identify the device band to be picked from the registry. If the device category is not present, then uses
 * DeviceCategory.ALL and identifies the appropriate device band
 * 
 * @version 1.0
 */
public class DeviceBandIndexer implements ICanvasRegistryIndexer
{
	/**
	 * Handle to the parent registry
	 */
	@SuppressWarnings("unused")
	private ICanvasRegistry deviceBandRegistry = null;

	private Map<DeviceCategory, DeviceBand> categoryIndex = null;
	private Map<String, DeviceBand> nameIndex = null;

	/**
	 * Logger instance for this class
	 */
	private static final Logger LOGGER = Logger.getLogger(DeviceBandIndexer.class);

	/**
	 * The default indexer
	 */
	public DeviceBandIndexer()
	{
		categoryIndex = new HashMap<DeviceCategory, DeviceBand>();
		nameIndex = new HashMap<String, DeviceBand>();
	}

	/**
	 * ref to contentAddedICanvasRegistry
	 * 
	 * @param aContent
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistryListener#contentAdded(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	public void contentAdded(ICanvasRegistryContent aContent) throws BaseException
	{
		if (aContent instanceof DeviceBand)
		{
			DeviceBand aBand = (DeviceBand) aContent;
			DeviceCategory indexKey = aBand.getDeviceCategory();
			categoryIndex.put(indexKey, aBand);
			nameIndex.put(aBand.getName(), aBand);
		}
	}

	/**
	 * ref to contentRemoved ICanvasRegistry
	 * 
	 * @param aContent
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistryListener#contentRemoved(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	public void contentRemoved(ICanvasRegistryContent aContent) throws BaseException
	{
		if (aContent instanceof DeviceBand)
		{
			DeviceBand aBand = (DeviceBand) aContent;
			DeviceCategory indexKey = aBand.getDeviceCategory();
			// If the content in index is same object as that passed, then remove the same.
			if (categoryIndex.containsValue(aContent))
				categoryIndex.remove(indexKey);
			if (nameIndex.containsValue(aContent))
				nameIndex.remove(aBand.getName());
		}
	}

	/**
	 * ref to contentReplaceICanvasRegistry
	 * 
	 * @param oldContent
	 * @param newContent
	 * @return boolean
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
	 * ref to contentmatchICanvasRegistry
	 * 
	 * @param args
	 * @return ICanvasRegistryContent
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistryIndexer#match(java.lang.Object[])
	 */
	@Override
	public ICanvasRegistryContent match(Object... args)
	{
		DeviceBand aBand = null;
		DeviceCategory sourceCategory = null;
		String name = null;
		if (args.length > 0)
		{
			// The first argument is expected to be device category.
			if (args[0] != null)
			{
				if (args[0] instanceof DeviceCategory)
				{
					sourceCategory = (DeviceCategory) args[0];
				} else if (args[0] instanceof String)
				{
					name = (String) args[0];
					aBand = nameIndex.get(name);
				} else
				{
					LOGGER.cterror("CTCOM00128");
					sourceCategory = DeviceCategory.ALL;
				}
			} else
			{
				// No arguments provided. Then treat it as all.
				LOGGER.cterror("CTCOM00128");
				sourceCategory = DeviceCategory.ALL;
			}
		}

		// First check if we have already retrieved by name.
		if (aBand == null)
		{
			// Check that the registry has a device band for this category.
			if (!categoryIndex.containsKey(sourceCategory))
				sourceCategory = DeviceCategory.ALL;
			aBand = categoryIndex.get(sourceCategory);
		}
		return aBand;
	}

	/**
	 * ref to ICanvasRegistry
	 * 
	 * @param parentRegistry
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistryIndexer#setRegistry(com.intellectdesign.canvas.spec.registry.ICanvasRegistry)
	 */
	@Override
	public void setRegistry(ICanvasRegistry parentRegistry)
	{
		deviceBandRegistry = parentRegistry;
	}

}
