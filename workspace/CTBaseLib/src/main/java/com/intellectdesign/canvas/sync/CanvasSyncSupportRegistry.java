/**
 * Copyright 2015. Polaris Financial Technology Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Polaris Financial Technology 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Polaris Financial Technology Limited.
 * 
 */
package com.intellectdesign.canvas.sync;

import java.util.Map;
import java.util.TreeMap;

import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.proxycaller.ProxyCaller;
import com.intellectdesign.canvas.proxycaller.ProxyCallerException;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This is the registry of all modules that wish to participate as part of the offline sync process. To register a
 * module, use the following construct -
 * 
 * <pre>
 * CanvasSyncSupportRegistry.register("module id", "implemetation class".class);
 * </pre>
 * 
 * The implementation class is expected to implement the interface com.intellectdesign.canvas.sync.ICanvasSyncSupport
 * 
 * Once this is done, as part of the offline sync sequencing, first the ICanvasSyncSupport.validateSyncList() is invoked
 * with the list of keys as identified by the client for validating the version. Based on the "validated" list returned,
 * the same is used for subsequently pulling out the updated data and sending back to the client. For this purpose the
 * ICanvasSyncSupport.getSyncData() is invoked
 * 
 * Note: For every offline invocation an object of the implementation class will be created. So it is expected that this
 * class is lightweight and can be a use and throw without any state maintenance.
 */
public class CanvasSyncSupportRegistry
{
	private static final Logger logger = Logger.getLogger(CanvasSyncSupportRegistry.class);
	private static Map<String, Class<ICanvasSyncSupport>> syncRegistry = new TreeMap<String, Class<ICanvasSyncSupport>>();

	/**
	 * This method should be invoked for registering the implementation class for a moduleId
	 * 
	 * @param moduleId The module Id. If it is already present, then the same is replaced with the new implementation
	 * @param implClass The class that should be created for processing sync requests related to this module
	 * @throws IllegalArgumentException Thrown if the parameters are not provided or the class does not implement the
	 *             ICanvasSyncSupport interface
	 */
	public static void register(String moduleId, Class implClass) throws BaseException
	{
		try
		{
			if (StringUtils.isEmpty(moduleId))
			{
				throw new IllegalArgumentException("moduleId provided cannot be null or empty");
			}

			if (!ICanvasSyncSupport.class.isAssignableFrom(implClass))
			{
				throw new IllegalArgumentException("implClass provided '" + implClass.getClass().getName()
						+ "' does not implement ICanvasSyncSupport");
			} else
			{
				syncRegistry.put(moduleId, implClass);
			}
		} catch (Exception e)
		{
			throw new BaseException(e);
		}
	}

	/**
	 * This method returns the implementation class for the provided module Id
	 * 
	 * @param moduleId The module Id.
	 * @return Object of the processing sync requests related to this module
	 * @throws BaseException Thrown if any error occurs while creating this class or if there is no mapping present for
	 *             the given module
	 */
	public static ICanvasSyncSupport getImplementationFor(String moduleId) throws BaseException
	{
		Class<ICanvasSyncSupport> targetClass = syncRegistry.get(moduleId);
		if (targetClass == null)
			throw new BaseException(FrameworkConstants.SyncMetadataConstants.MISSING_TARGET_CLASS.getName(), "Module Id provided '" + moduleId + "' is not a valid sync module");
		try
		{
			return (ICanvasSyncSupport) ProxyCaller.on(targetClass).create().get();
		} catch (ProxyCallerException invokeException)
		{
			logger.cterror("CTBAS00124", invokeException, targetClass.getClass().getName());
			throw new BaseException("SYNC_ERROR", "Unable to create the implementation class for module '" + moduleId
					+ "'");
		}
	}

}
