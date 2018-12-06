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
package com.intellectdesign.canvas.appln.startup;

import java.util.Locale;
import java.util.ResourceBundle;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.IConfigurationChangeListener;
import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.logger.CanvasConfigurationLogger;
import com.intellectdesign.canvas.pref.amount.AmountFormatRegistry;
import com.intellectdesign.canvas.pref.date.DateFormatRegistry;
import com.intellectdesign.canvas.utils.ResourceBundleUtils;
import com.intellectdesign.canvas.utils.ResourceLoaderUtils;
import com.intellectdesign.canvas.utils.StringUtils;
import com.intellectdesign.canvas.web.config.ActionMapRegistry;
import com.intellectdesign.canvas.web.themes.ThemesRegistry;

/**
 * This is an application startup listener for the Canvas system. This does all the default handling that Canvas system
 * looks to create.
 * 
 * This should be configured as a listener in the web.xml as below -
 * 
 * {@code
 * 	<web-app>
 * 		<listener>
 * 			<listener-class>com.intellectdesign.canvas.config.CanvasApplicationStartupListener</listener-class>
 * 		</listener>
 * 	</web-app>
 *}
 * 
 * @version 1.0
 */
public class CanvasApplicationStartupListener implements ServletContextListener
{
	private static final CanvasConfigurationLogger LOGGER = new CanvasConfigurationLogger(
			CanvasApplicationStartupListener.class);
	private static final String CONFIG_CANVAS_LISTENER_BUNDLE = "ctfwdefaultlistener";

	/**
	 * this is ref to ServletContextEventDestory
	 * 
	 * @param contextEvent
	 * @see javax.servlet.ServletContextListener#contextDestroyed(javax.servlet.ServletContextEvent)
	 */
	@Override
	public void contextDestroyed(ServletContextEvent contextEvent)
	{
		// Trigger the configuration manager of Canvas to shut down
		ConfigurationManager.getInstance().shutdown();
		CanvasApplicationContextRegistry.getInstance().unregisterContext(contextEvent.getServletContext());
	}

	/**
	 * this is ref to intial ServletContextEventy
	 * 
	 * @param contextEvent
	 * @see javax.servlet.ServletContextListener#contextInitialized(javax.servlet.ServletContextEvent)
	 */
	@Override
	public void contextInitialized(ServletContextEvent contextEvent)
	{
		ServletContext servletContext = contextEvent.getServletContext();
		CanvasApplicationContextRegistry.getInstance().registerContext(servletContext);
		// Here we loop through the default list of configuration listeners that should be added to the configuration
		// manager. The default listeners are identified from the framework bundle -
		// com.intellectdesign.canvas.config.ctfwdefaultlister.properties
		if (!ResourceBundleUtils.isPropertyBundlePresent(CONFIG_CANVAS_LISTENER_BUNDLE))
		{
			// Means that this bundle is missing. This is not a good sign. Could mean a packaging error,
			LOGGER.cterror("CTBAS00001", CONFIG_CANVAS_LISTENER_BUNDLE);
		}
		ResourceBundle defaultListenerBundle = ResourceBundle.getBundle(CONFIG_CANVAS_LISTENER_BUNDLE, Locale.ROOT);
		initializeSystemThemes(servletContext);
		initializeConfigManagerListeners(defaultListenerBundle, servletContext);
		initializeForwardMappings();
		initializeAmountFormats();// Initialization of FrameWork AmountFormats
		// Initialization of FrameWork DateFormats
		initializeDateFormats();
	}

	private void initializeDateFormats()
	{
		try
		{
			DateFormatRegistry dateFormatRegistry = DateFormatRegistry.getInstance();
			dateFormatRegistry.register("canvas-dateformats.xml");
		} catch (BaseException e)
		{
			LOGGER.cterror("CTBAS00079", e);
		}
	}

	/**
	 * This method initializes the system Amount Formats. These Formats are registered using AmountFormatRegistry
	 */
	private void initializeAmountFormats()
	{
		try
		{
			AmountFormatRegistry amountFormatRegistry = AmountFormatRegistry.getInstance();
			amountFormatRegistry.register("canvas-amountformats.xml");
		} catch (BaseException e)
		{
			LOGGER.cterror("CTBAS00079", e);
		}
	}

	/**
	 * This methods loads the default framework actionmapping
	 * 
	 */
	private void initializeForwardMappings()
	{
		try
		{
			ActionMapRegistry actionMapRegistry = ActionMapRegistry.getDefaultInstance();
			actionMapRegistry.register("canvas-forward.mapping");
		} catch (BaseException e)
		{
			LOGGER.cterror("CTBAS00002", e);
		}
	}

	/**
	 * This method initializes the system themes. The system theme is registered using ThemesRegistry
	 */
	private void initializeSystemThemes(ServletContext servContext)
	{
		try
		{
			ThemesRegistry themeRegistry = ThemesRegistry.getDefaultInstance();
			themeRegistry.register(servContext.getContextPath(),
					servContext.getRealPath("CTRIAFramework/UIArena/theme/system/cssconfig.xml"));
		} catch (BaseException e)
		{
			LOGGER.cterror("CTBAS00079", e);
		}
	}

	/**
	 * This method adds the default set of listeners to the configuration manager from the Canvas Platform perspective
	 * 
	 * @param defaultListenerBundle
	 */
	private void initializeConfigManagerListeners(ResourceBundle defaultListenerBundle, ServletContext servletContext)
	{
		// Get the default list for Canvas Config Manager.
		String[] allKeys = StringUtils.convertToArray(
				ResourceBundleUtils.getString(defaultListenerBundle, CONFIG_CANVAS_LISTENER_BUNDLE, ""), ",");
		String aClassName;
		Object listenerObject = null;
		IConfigurationChangeListener listener;
		if (allKeys != null)
		{
			ConfigurationManager manager = ConfigurationManager.getInstance();
			for (String aKey : allKeys)
			{
				aClassName = ResourceBundleUtils.getString(defaultListenerBundle, aKey + "_CLASS", "");
				if (StringUtils.isEmpty(aClassName))
				{
					// Missing or invalid configuration. Log the same
					LOGGER.cterror("CTBAS00006", aKey);
				}
				try
				{
					listenerObject = ResourceLoaderUtils.createInstance(aClassName, servletContext);
					if (listenerObject instanceof IConfigurationChangeListener)
					{
						listener = (IConfigurationChangeListener) listenerObject;
						if (!manager.isListenerPresent((Class<IConfigurationChangeListener>) listener.getClass()))
						{
							manager.addChangeListener(listener);
						} else
						{
							LOGGER.ctinfo("CTBAS00003", aClassName);
						}
					} else
					{
						LOGGER.cterror("CTBAS00004", aClassName);
					}
				} catch (BaseException e)
				{
					LOGGER.cterror("CTBAS00005", e);
				}
			}
		}
	}
}
