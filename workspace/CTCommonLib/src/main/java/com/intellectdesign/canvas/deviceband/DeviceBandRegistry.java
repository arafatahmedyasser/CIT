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

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.spec.registry.CanvasRegistryBase;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistryIndexer;

/**
 * This registry contains all the device bands configured in the system. This uses the DeviceBandIndexer as the default
 * indexer.
 * 
 * To use this registry, first you have to create the various DeviceBand objects that are supported / modelled within
 * the application. It is advisable that the packages are identified and initialized at startup time and not runtime to
 * ensure that there are no unintended behaviors due to dynamic change in the registry. The Canvas platform uses this
 * registry to identify the appropriate device band and loads the application based on the selected device band.
 * 
 * @version 1.0
 */
public final class DeviceBandRegistry extends CanvasRegistryBase
{
	/**
	 * The registry's cache of the device bands
	 */
	private List<ICanvasRegistryContent> deviceBandCache = null;

	/**
	 * Logger instance for this class
	 */
	private static final Logger LOGGER = Logger.getLogger(DeviceBandRegistry.class);

	/**
	 * @param indexr The indexer to be used
	 */
	DeviceBandRegistry(ICanvasRegistryIndexer indexr)
	{
		super(indexr);
		deviceBandCache = new ArrayList<ICanvasRegistryContent>();
	}

	/**
	 * Using the approach provided by Bill Pugh for avoiding double checked locking for creation of singleton instance
	 */
	private static class DeviceBandRegistryInstanceHolder
	{
		static final DeviceBandRegistry INSTANCE = new DeviceBandRegistry(new DeviceBandIndexer());
	}

	/**
	 * This method returns the instance of the Registry.
	 * 
	 * @return The default instance of the DeviceBandRegistry
	 */
	public static DeviceBandRegistry getInstance()
	{
		return DeviceBandRegistryInstanceHolder.INSTANCE;
	}

	/**
	 * ref to Register ContentSourcePath
	 * 
	 * @param contentSourcePath
	 * @throws BaseException
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistry#register(java.lang.String)
	 */
	@Override
	public void register(String contentSourcePath) throws BaseException
	{
		// Loading from a content path (XML / props) is not supported in the current version.
		LOGGER.cterror("CTCOM00129");
	}

	/**
	 * ref to registerImpl
	 * 
	 * @param aContent
	 * @return boolean
	 * @throws BaseException
	 * @see com.intellectdesign.canvas.spec.registry.CanvasRegistryBase#registerImpl(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	protected boolean registerImpl(ICanvasRegistryContent aContent) throws BaseException
	{
		boolean regSuccess = false;
		if (aContent instanceof DeviceBand)
		{
			DeviceBand contentToAdd = (DeviceBand) aContent;
			deviceBandCache.add(contentToAdd);
			regSuccess = true;
		}
		return regSuccess;
	}

	/**
	 * ref to replaceContent
	 * 
	 * @param origContent
	 * @param newContent
	 * @throws BaseException
	 * @see com.intellectdesign.canvas.spec.registry.CanvasRegistryBase#replaceContent(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent,
	 *      com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	protected void replaceContent(ICanvasRegistryContent origContent, ICanvasRegistryContent newContent)
			throws BaseException
	{
		if (newContent instanceof DeviceBand && origContent instanceof DeviceBand)
		{
			DeviceBand contentToAdd = (DeviceBand) newContent;
			// Ideally the position does not matter as this has no bearing in Device BAnd identification. So delete the
			// origContent and add the new content
			deviceBandCache.remove(origContent);
			deviceBandCache.add(contentToAdd);
		}
	}

	/**
	 * ref to unregisterImpl
	 * 
	 * @param aContent
	 * @return boolean
	 * @throws BaseException
	 * @see com.intellectdesign.canvas.spec.registry.CanvasRegistryBase#unregisterImpl(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	protected boolean unregisterImpl(ICanvasRegistryContent aContent) throws BaseException
	{
		boolean unregSuccess = false;
		if (aContent instanceof DeviceBand)
		{
			DeviceBand contentToRemove = (DeviceBand) aContent;
			unregSuccess = deviceBandCache.remove(contentToRemove);
		}
		return unregSuccess;
	}

	/**
	 * ref to Iterator IcanvasRegistery
	 * 
	 * @return deviceBandCache
	 * @see com.intellectdesign.canvas.spec.registry.CanvasRegistryBase#registryIterator()
	 */
	@Override
	protected Iterator<ICanvasRegistryContent> registryIterator()
	{
		return deviceBandCache.iterator();
	}
}
