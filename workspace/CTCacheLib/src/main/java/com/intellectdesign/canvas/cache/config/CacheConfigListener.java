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
package com.intellectdesign.canvas.cache.config;

import javax.servlet.ServletContext;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.config.IConfigurationChangeListener;

/**
 * Implements the IConfigurationChangeListener class
 * 
 * @version 1.0
 */
public class CacheConfigListener implements IConfigurationChangeListener
{

	ServletContext servletContext = null;

	/**
	 * This constructor sets the servlet context reference inside the listeners
	 * 
	 * @param servletContext
	 */

	public CacheConfigListener(ServletContext servletContext)
	{
		super();
		this.servletContext = servletContext;
	}

	/**
	 * This method initializes the CacheConfigListener
	 */
	public void configurationInitialized()
	{
		CacheManager.reinitializeAll();
	}

	/**
	 * This method Re-initializes the CacheConfigListener
	 */
	public void configurationReinitialized()
	{
		CacheManager.reinitializeAll();
	}

	/**
	 * This is triggered when the configuration system gets a shut down notification. here we trigger a shut down of the
	 * Cache system
	 * 
	 * @see com.intellectdesign.canvas.config.IConfigurationChangeListener#shutDown()
	 */
	@Override
	public void shutDown()
	{
		CacheManager.shutDownAll();
	}

}
