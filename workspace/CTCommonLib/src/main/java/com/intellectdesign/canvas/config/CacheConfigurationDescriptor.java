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
package com.intellectdesign.canvas.config;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Properties;
import java.util.PropertyResourceBundle;

import javax.naming.Context;

import com.intellectdesign.canvas.logger.CanvasConfigurationLogger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.utils.PropertyValidations;
import com.intellectdesign.canvas.utils.ResourceBundleUtils;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This class contains the configuration for the cache framework of Canvas. To provide the Cache related configurations,
 * as part of the Canvas Main Configuration Manager, configure the following key -
 * <ul>
 * <li><b>CT_CACHE_BUNDLE</b> : This is the bundle that should be loaded from where the cache configuration as detailed
 * below will be identified</li>
 * </ul>
 * 
 * The detailed listing of the keys expected in the cache bundle are provided below.
 * <ul>
 * <li><b>CACHE_CONFIG_FILE</b> : This is the application specific cache configuration XML file that should be used for
 * the declarative initialization of the cache</li>
 * <li><b>EHCACHE_CONFIG_FILE</b> : This is the configuration file to be used for EhCache when in memory caching is
 * activated by the apps. Irrespective of whether the application uses this feature, it is expected that at least a
 * minimum configuration needed for initializing Eh Cache is provided</li>
 * <li><b>CACHE_PROXY_MODE</b> : This is used to indicate how the cache has to communicate with its handler for fetching
 * the data. It supports the following values -
 * <ul>
 * <li><b>local</b>: This is the default. This means that the deployment mode allows for direct invocation of the
 * handler</li>
 * <li><b>remote</b>: Use this if there is a split deployment and the cache data builders need to be executed in a
 * remote VM. This mode relies on the usage of EJB (RMI) communication as the basis to connect to remove VM</li>
 * <li><b>http</b>: Use this if there is a split deployment and the cache data builders need to be executed in a remove
 * VM. This is different from 'remote' in that this uses a HTTP connectivity to speak to the remote VM</li>
 * </ul>
 * </li>
 * <li><b>HTTP_CACHE_HANDLER_URL</b> : This is required only if the CACHE_PROXY_MODE mode is given as 'http'. In this
 * case, this should be the full URL pointing till the servlet name to which the request should be sent</li>
 * <li><b>CacheDelegateEJB.JNDIName</b>: This is required only if the CACHE_PROXY_MODE is given as 'remote'. This should
 * be JNDI Name for the Remote EJB lookup.</li>
 * <li><b>CacheDelegateEJB.ContextFactory</b>: This is required only if the CACHE_PROXY_MODE is given as 'remote'. This
 * is the Initial Context Factory class to be used for the Remote EJB lookup.</li>
 * <li><b>CacheDelegateEJB.JNDIURL</b>: This is required only if the CACHE_PROXY_MODE is given as 'remote'. This is the
 * JNDI URL to be used for the Remote EJB lookup.</li>
 * <li><b>CacheDelegateEJB.security.principal</b>: This is applicable only if the CACHE_PROXY_MODE is given as 'remote'.
 * This has the user name to be used for the JNDI Lookup. This is optional. If not provided, then lookup is done without
 * any security credentials.</li>
 * <li><b>CacheDelegateEJB.security.credentials</b>: This is required only if the CACHE_PROXY_MODE is given as 'remote'.
 * This has the credentials / password to be used for the JNDI Lookup. This is optional. This will be read only if the
 * principal has been provided.</li>
 * </ul>
 */
public class CacheConfigurationDescriptor extends PropertyBagConfigurationDescriptor
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -8326438731539094300L;

	public static final String MAIN_CONFIG_CT_CACHE = "CT_CACHE_BUNDLE";

	private static final CanvasConfigurationLogger LOGGER = new CanvasConfigurationLogger(
			CacheConfigurationDescriptor.class);

	/**
	 * ref to CacheConfigurationDescriptor
	 * 
	 * @param name
	 */
	public CacheConfigurationDescriptor(String name)
	{
		super(name);
	}

	private String cacheFileURI;
	private String ehcacheFileURI;
	private URL httpCacheProxyUrl = null;
	private String cacheMode;
	private String jndiName;
	private String jndiUrl;
	private String jndiInitialContextFactoryClass;
	private String jndiPrincipal;
	private String jndiCredential;
	private Properties initialContextMap;

	/**
	 * ref to cacheFileURI
	 * 
	 * @return the cacheFileURI
	 */
	public String getCacheFileURI()
	{
		return cacheFileURI;
	}

	/**
	 * ref to ehcacheFileURI
	 * 
	 * @return the ehcacheFileURI
	 */
	public String getEhcacheFileURI()
	{
		return ehcacheFileURI;
	}

	/**
	 * 
	 * @return The cacheMode
	 */
	public String getCacheMode()
	{
		return cacheMode;
	}

	/**
	 * 
	 * @return the httpCacheProxyUrl
	 */
	public URL getHttpCacheProxyURL()
	{
		return httpCacheProxyUrl;
	}

	/**
	 * @return the jndiName
	 */
	public String getJndiName()
	{
		return jndiName;
	}

	/**
	 * @return the jndiUrl
	 */
	public String getJndiUrl()
	{
		return jndiUrl;
	}

	/**
	 * @return the jndiInitialContextFactoryClass
	 */
	public String getJndiContextFactoryClass()
	{
		return jndiInitialContextFactoryClass;
	}

	/**
	 * @return the jndiPrincipal
	 */
	public String getJndiPrincipal()
	{
		return jndiPrincipal;
	}

	/**
	 * @return the jndiCredential
	 */
	public String getJndiCredential()
	{
		return jndiCredential;
	}

	/**
	 * @return the initialContextMap
	 */
	public Properties getInitialContextMap()
	{
		return initialContextMap;
	}

	/**
	 * ref to LoadConfig
	 * 
	 * @param configSource
	 * @param defaultDescriptor
	 * @throws ConfigurationException
	 * @see com.intellectdesign.canvas.config.IConfigurationDescriptor#loadConfiguration(java.lang.String)
	 */
	@Override
	public void loadConfiguration(String configSource, IConfigurationDescriptor defaultDescriptor)
			throws ConfigurationException
	{
		super.loadConfiguration(configSource, defaultDescriptor);

		if (!isValidConfiguration())
		{
			throw new ConfigurationException("CONFIG_ERR",
					"Issues were found as part of the Cache configuration information (resource bundle : "
							+ configSource + "). Please refer to the Logs for more details");
		}

		PropertyResourceBundle bundle = getRawConfigData();
		cacheFileURI = ResourceBundleUtils.getString(bundle, "CACHE_CONFIG_FILE", "cacheconfig.xml");
		ehcacheFileURI = ResourceBundleUtils.getString(bundle, "EHCACHE_CONFIG_FILE", "CTEhcache.xml");
		cacheMode = ResourceBundleUtils.getString(bundle, "CACHE_PROXY_MODE", "local");
		String httpCacheUrl = ResourceBundleUtils.getString(bundle, "HTTP_CACHE_HANDLER_URL", "");
		try
		{
			if (!StringUtils.isEmpty(httpCacheUrl))
				httpCacheProxyUrl = new URL(httpCacheUrl);
		} catch (MalformedURLException e)
		{
			throw new ConfigurationException("CONFIG_ERR", e);
		}
		jndiName = ResourceBundleUtils.getString(bundle, "CacheDelegateEJB.JNDIName", "");
		jndiInitialContextFactoryClass = ResourceBundleUtils.getString(bundle, "CacheDelegateEJB.ContextFactory", "");
		jndiUrl = ResourceBundleUtils.getString(bundle, "CacheDelegateEJB.JNDIURL", "");
		jndiPrincipal = ResourceBundleUtils.getString(bundle, "CacheDelegateEJB.security.principal", "");
		jndiCredential = ResourceBundleUtils.getString(bundle, "CacheDelegateEJB.security.credentials", "");

		// Construct the initialContext properties object.
		initialContextMap = new Properties();
		if (!StringUtils.isEmpty(jndiInitialContextFactoryClass))
			initialContextMap.put(Context.INITIAL_CONTEXT_FACTORY, jndiInitialContextFactoryClass);
		if (!StringUtils.isEmpty(jndiUrl))
			initialContextMap.put(Context.PROVIDER_URL, jndiUrl);
		if (!StringUtils.isEmpty(jndiPrincipal) && !StringUtils.isEmpty(jndiCredential))
		{
			initialContextMap.put(Context.SECURITY_PRINCIPAL, jndiPrincipal);
			initialContextMap.put(Context.SECURITY_CREDENTIALS, jndiCredential);
		}
	}

	/**
	 * Helper method that validates a configuration before loading the same.
	 * 
	 * @return boolean
	 */
	@SuppressWarnings("unused")
	private boolean isValidConfiguration()
	{
		PerformanceTimer timer = new PerformanceTimer();
		boolean validationStatus = true;
		PropertyResourceBundle bundle = getRawConfigData();
		PropertyValidations validator = new PropertyValidations();
		StringBuilder errorBuilder = new StringBuilder();
		LOGGER.ctdebug("CTCOM00001");
		timer.startTimer(getClass(), "CacheConfigurationDescriptor.isValideConfiguration");

		errorBuilder.append(validateCacheFileURI("CACHE_CONFIG_FILE"));
		errorBuilder.append(validateCacheFileURI("EHCACHE_CONFIG_FILE"));

		errorBuilder.append(validator.validateListConfiguration("CACHE_PROXY_MODE", bundle, false, new String[]
		{ "remote", "local", "http" }, true, "Cache Proxy Mode(CACHE_PROXY_MODE)"));
		String httpCacheUrl = ResourceBundleUtils.getString(bundle, "HTTP_CACHE_HANDLER_URL", "");
		
		boolean mandatory = "http".equals(ResourceBundleUtils.getString(bundle, "CACHE_PROXY_MODE", ""));
		if (mandatory)
		{
			if (StringUtils.isEmpty(httpCacheUrl))
				errorBuilder
						.append("When the Cache Proxy is set to 'http', HTTP_CACHE_HANDLER_URL is a mandatory configuration");
			else
			{
				try
				{
					new URL(httpCacheUrl);
				} catch (MalformedURLException e)
				{
					errorBuilder
							.append("the HTTP_HANDLER_INVOKER_URL provided seems to be a malformed URL. Please check the configuration. Value received is '"
									+ httpCacheUrl + "'");
				}
			}
		}

		// Check for the remote cache proxy mode configuration. Only thing mandatory is the JNDI Name. All other aspects
		// are related to lookup. If not provided, expect that the InitialContext is aware of what to do
		mandatory = "remote".equals(ResourceBundleUtils.getString(bundle, "CACHE_PROXY_MODE", ""));
		if (mandatory)
		{
			if (StringUtils.isEmpty(ResourceBundleUtils.getString(bundle, "CacheDelegateEJB.JNDIName", "")))
				errorBuilder
						.append("When the cache proxy is set to 'remote', CacheDelegateEJB.JNDIName is a mandatory configuration");
		}

		validationStatus = errorBuilder.length() == 0;

		if (validationStatus)
			LOGGER.ctdebug("CTCOM00002");
		else
		{
			LOGGER.cterror("CTCOM00003", errorBuilder.toString());
		}
		timer.endTimer();
		return validationStatus;
	}

	/*******************************************************************************************************************
	 * Method to validate the CacheFile URI
	 * 
	 * @param cacheURI
	 * @return Validaton Error message
	 */
	private String validateCacheFileURI(String cacheURI)
	{
		String validationErrorMessage = "";
		PropertyResourceBundle bundle = getRawConfigData();
		if (!bundle.containsKey(cacheURI))
			validationErrorMessage += cacheURI + " is missing. ";
		else if (StringUtils.isEmpty(bundle.getString(cacheURI)))
			validationErrorMessage += cacheURI + " cannot have an empty configuration. ";
		else if (!StringUtils.contains(bundle.getString(cacheURI), "xml"))
			validationErrorMessage += cacheURI + " is not an XML file. ";

		return validationErrorMessage;
	}

}
