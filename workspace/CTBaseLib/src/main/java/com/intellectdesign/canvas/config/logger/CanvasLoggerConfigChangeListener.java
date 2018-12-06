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
package com.intellectdesign.canvas.config.logger;

import javax.servlet.ServletContext;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.IConfigurationChangeListener;
import com.intellectdesign.canvas.config.LoggingConfigurationDescriptor;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This class is for Canvas Logger Config Change Listener implementing IConfigurationChangeListener
 * 
 * @version 1.0
 */
public class CanvasLoggerConfigChangeListener implements IConfigurationChangeListener
{
	/**
	 * The default constructor Internal constant for serialization purposes
	 */
	public CanvasLoggerConfigChangeListener(ServletContext servletContext)
	{
		// Nothing to do here
	}

	/**
	 * ref to method configurationInitialized Listeners
	 * 
	 * @see com.intellectdesign.canvas.config.IConfigurationChangeListener#configurationInitialized()
	 */
	@Override
	public void configurationInitialized()
	{
		// Here we retrieve the Logging configuration from Configuration manager and then update the static variable in
		// Logger
		LoggingConfigurationDescriptor config = ConfigurationManager.getInstance().getLoggingDescriptor();

		Logger.initialize(config.isLoggingEnabled(), config.getLogConfigurationProperties(),
				config.getCtlogOverrideFile());
	}

	/**
	 * this method ref to ConfigurationReintialized
	 * 
	 * @see com.intellectdesign.canvas.config.IConfigurationChangeListener#configurationReinitialized()
	 */
	@Override
	public void configurationReinitialized()
	{
		configurationInitialized();
	}

	/**
	 * 
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
