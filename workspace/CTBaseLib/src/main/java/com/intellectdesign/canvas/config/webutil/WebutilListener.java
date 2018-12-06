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
package com.intellectdesign.canvas.config.webutil;

import javax.servlet.ServletContext;

import com.intellectdesign.canvas.config.IConfigurationChangeListener;

/**
 * This class is for WebutilListene containing IConfigurationChangeListener
 * 
 * @version 1.0
 */
public class WebutilListener implements IConfigurationChangeListener
{

	ServletContext servletContext = null;

	/**
	 * This constructor sets the servlet context reference inside the listeners
	 * 
	 * @param servletContext
	 */
	public WebutilListener(ServletContext servletContext)
	{
		super();
		this.servletContext = servletContext;
	}

	/**
	 * ref to configurationInitialized FWJsFiles
	 * 
	 * @see com.intellectdesign.canvas.config.IConfigurationChangeListener#configurationInitialized()
	 */
	@Override
	public void configurationInitialized()
	{
		compressFWJsFiles();

	}

	/**
	 * ref to configurationReinitialized
	 * 
	 * @see com.intellectdesign.canvas.config.IConfigurationChangeListener#configurationReinitialized()
	 */
	@Override
	public void configurationReinitialized()
	{

	}

	/**
	 * this is ref to CompressFWJSFiles
	 */
	private void compressFWJsFiles()
	{

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
