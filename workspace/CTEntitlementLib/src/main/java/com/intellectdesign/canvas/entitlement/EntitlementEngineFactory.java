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

package com.intellectdesign.canvas.entitlement;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.logger.Logger;

/**
 * It is a Entitlement Engine Factory class
 * 
 * @version 1.0
 */
public class EntitlementEngineFactory
{

	/**
	 * Returns an instance of the singleton class EntitlementFactory. Every class that uses the EntitlementFactory is
	 * expected to access the methods of EntitlementFactory class only through this method.
	 * 
	 * @return entitlementFactory instance of the type EntitlementFactory.
	 */
	public static EntitlementEngineFactory getInstance()
	{
		if (entitlementFactory == null)
		{
			entitlementFactory = new EntitlementEngineFactory();
		}
		return entitlementFactory;
	}

	/**
	 * This method returns an instance of the type IEntitlementEngine.
	 * 
	 * @param entlType the entitlemen type.
	 * @return IEntitlementEngine object of the type IEntitlementEngine.
	 * @throws EntitlementEngineException
	 */
	public IEntitlementEngine getEntitlementEngine(String entlType) throws EntitlementEngineException
	{
		logger.ctinfo("CTENT00012", entlType);
		IEntitlementEngine entlEngine = null;
		CacheManager cacheManager = CacheManager.getInstance();
		HashMap entlDataMap = null;
		String entEngineClass = null;
		try
		{
			List cacheData = cacheManager.getDataFromCache(null, EntitlementEngineConstants.ENTL_ENGINE_DATA_CACHE_KEY);
			for (Iterator itr = cacheData.iterator(); itr.hasNext();)
			{
				entlDataMap = (HashMap) itr.next();
				if (entlType.equals(entlDataMap.get(EntitlementEngineConstants.ENTL_TYPE_KEY)))
				{
					entEngineClass = (String) entlDataMap.get(EntitlementEngineConstants.ENTL_ENGINE_CLASS_KEY);
					break;
				}
				logger.ctdebug("CTENT00013", entEngineClass);
			}

			if (entEngineClass != null)
			{
				entlEngine = (IEntitlementEngine) Class.forName(entEngineClass).newInstance();
			}

		} catch (InstantiationException instantiationException)
		{
			logger.cterror("CTENT00014", instantiationException, entEngineClass);

			throw new EntitlementEngineException(instantiationException);
		} catch (IllegalAccessException illegalAccessException)
		{
			logger.cterror("CTENT00015", illegalAccessException, entEngineClass);
			throw new EntitlementEngineException(illegalAccessException);
		} catch (ClassNotFoundException classNotFoundException)
		{
			logger.cterror("CTENT00016", classNotFoundException, entEngineClass);
			throw new EntitlementEngineException(classNotFoundException);
		} catch (Exception exception)
		{
			logger.cterror("CTENT00017", exception, entEngineClass);
			throw new EntitlementEngineException(exception);
		}
		logger.ctinfo("CTENT00018");
		return entlEngine;
	}

	/**
	 * private contructor to make the class singleton.
	 */
	private EntitlementEngineFactory()
	{
	}

	private static Logger logger = Logger.getLogger(EntitlementEngineFactory.class);
	private static EntitlementEngineFactory entitlementFactory = new EntitlementEngineFactory();
}
