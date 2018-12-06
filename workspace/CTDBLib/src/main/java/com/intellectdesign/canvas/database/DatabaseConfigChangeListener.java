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
package com.intellectdesign.canvas.database;

import java.util.Map;

import javax.servlet.ServletContext;

import com.intellectdesign.canvas.config.ConfigurationException;
import com.intellectdesign.canvas.config.IConfigurationChangeListener;
import com.intellectdesign.canvas.database.IDatabaseAccess.InitializationStatus;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This is the change listener that is attached to the configuration framework to ensure that the database framework is
 * reinitialized based on the revised / published configuration
 */
public class DatabaseConfigChangeListener implements IConfigurationChangeListener
{
	private static final Logger LOGGER = Logger.getLogger(DatabaseConfigChangeListener.class);

	/**
	 * The constructor expected for the change listener.
	 * 
	 * @param context
	 */
	public DatabaseConfigChangeListener(ServletContext context)
	{
		// Nothing to do here
	}

	/**
	 * Invoked when the configuration is initialized for the first time
	 * 
	 * @see com.intellectdesign.canvas.config.IConfigurationChangeListener#configurationInitialized()
	 */
	@Override
	public void configurationInitialized()
	{
		prepareDataSources();
	}

	/**
	 * Invoked when the configuration has been changed subsequently
	 * 
	 * @see com.intellectdesign.canvas.config.IConfigurationChangeListener#configurationReinitialized()
	 */
	@Override
	public void configurationReinitialized()
	{
		prepareDataSources();
	}

	/**
	 * Here we create the data sources based on the configuration.
	 * @exception ConfigurationException Thrown if there are any errors faced while initializing the data sources
	 */
	private void prepareDataSources()
	{
		LOGGER.ctdebug("CTDBL00192");
		IDatabaseAccess dbAccess = DatabaseAccessFactory
				.getIDBAccessImplementation(DatabaseConstants.ACCESS_VIA_IBATIS);
		try
		{
			Map<String, Object> allDS = dbAccess.prepareDataSources();
			dbAccess.initializeWith(allDS);
		} catch (DatabaseException e)
		{
			// If the current status is not initialized, then set the status to Failure so that any subsequent calls to
			// DB access will throw exception
			if (dbAccess.getStatus() == InitializationStatus.NOT_INITIALIZED)
				dbAccess.setStatus(InitializationStatus.INITIALIZATION_FAILURE);
			// If the status is already initialized, then this can only mean that error is faced as part of
			// reinitialization. During this process, we need not touch the DB Access in any way. Just throw the
			// exception for the parent to handle it.
			LOGGER.cterror("CTDBL00065", e);
			throw new ConfigurationException("CTDBL00065", "Error while initializing the configured Data sources", e);
		}
		LOGGER.ctdebug("CTDBL00193");
	}

	/**
	 * This is invoked when the application is stopped or shutdown
	 * 
	 * @see com.intellectdesign.canvas.config.IConfigurationChangeListener#shutDown()
	 */
	@Override
	public void shutDown()
	{
		// Nothing to do here
	}

}
