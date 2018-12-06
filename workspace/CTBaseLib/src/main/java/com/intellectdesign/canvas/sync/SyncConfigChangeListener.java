/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
package com.intellectdesign.canvas.sync;

import java.util.Enumeration;
import java.util.ResourceBundle;

import javax.servlet.ServletContext;

import com.intellectdesign.canvas.config.IConfigurationChangeListener;
import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.proxycaller.ProxyCaller;
import com.intellectdesign.canvas.proxycaller.ProxyCallerException;
import com.intellectdesign.canvas.utils.ResourceBundleUtils;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * Implements the IConfigurationChangeListener class for SyncConfigChangeListener
 * 
 * @version 1.0
 */
public class SyncConfigChangeListener implements IConfigurationChangeListener
{

	/**
	 * This constructor which in turn invokes the super constructor
	 * 
	 * @param servletContext
	 */

	public SyncConfigChangeListener(ServletContext servletContext)
	{
		super();
	}

	/**
	 * This method initializes the SyncConfigChangeListener
	 * 
	 * @see com.intellectdesign.canvas.config.IConfigurationChangeListener#configurationInitialized()
	 */
	public void configurationInitialized()
	{
		initializeSyncMetadata();
	}

	/**
	 * This method Re-initializes the SyncConfigChangeListener
	 * 
	 * @see com.intellectdesign.canvas.config.IConfigurationChangeListener#configurationReInitialized()
	 */
	public void configurationReinitialized()
	{
		initializeSyncMetadata();
	}

	/**
	 * 
	 * This method initiliazes the metadata sync process and what it does is reads the implementation classes from
	 * canvas-sync-metadata properties file using resourceBundle class@seejava.util.ResourceBundle and registers the
	 * value as implementation class for the given key from the above properties file which will be used when metadata
	 * sync change is needed whic uses these appropriate classes.
	 * 
	 * @throws ProxyCallerException,Thrown if any error occurs when metadata implementation class is not found
	 * 
	 * @throws IllegalArgumentException, Thrown if any error occurs when the key is empty or when metadata
	 *             implementation class is not assigned from ICanvasSyncSupport
	 * 
	 * 
	 * @throws BaseException, Thrown if any error occurs when any exception occured during the registration process
	 */
	private void initializeSyncMetadata()
	{

		ResourceBundle defaultBundle = ResourceBundle.getBundle("canvas-sync-metadata");
		Enumeration<String> keysIterator = defaultBundle.getKeys();
		String aKeyName;
		Class canvassupport = null;
		String classStr = null;
		while (keysIterator.hasMoreElements())
		{
			aKeyName = keysIterator.nextElement();
			classStr = ResourceBundleUtils.getString(defaultBundle, aKeyName, "");
			try
			{
				if (!StringUtils.isEmpty(classStr))
				{
					canvassupport = ProxyCaller.on(classStr).type();
					CanvasSyncSupportRegistry.register(aKeyName, canvassupport);
				}
			} catch (ProxyCallerException invokeException)
			{
				LOGGER.cterror("CTBAS00125", invokeException, classStr);

			} catch (IllegalArgumentException illegalArgException)
			{
				LOGGER.cterror("CTBAS00126", illegalArgException, classStr);
			} catch (BaseException e)
			{
				LOGGER.cterror("CTBAS00127", e, aKeyName, classStr);
			}
		}
	}

	/**
	 * The Logger instance for this class
	 */
	private static final Logger LOGGER = Logger.getLogger(SyncConfigChangeListener.class);

	/**
	 * 
	 * @see com.intellectdesign.canvas.config.IConfigurationChangeListener#shutDown()
	 */
	@Override
	public void shutDown()
	{
		// TODO Auto-generated method stub

	}

}
