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

import java.text.DateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import com.intellectdesign.canvas.logger.CanvasConfigurationLogger;
import com.intellectdesign.canvas.spec.CanvasListenerList;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This is the entry point class through which the configuration of the Canvas platform can be initialized. The
 * configuration for the canvas platform can be provided using property files or XML.
 * 
 * The entire configuration system revolves around various Configuration Descriptors. A descriptor is a logical grouping
 * of configuration entries present in the configuration xml. The descriptor is typically tied down to a corresponding
 * class that provides the definition for the XML structure corresponding to the descriptor. This design provides the
 * flexibility to the end applications to extend the configuration to any custom configuration requirement.
 * 
 * Every descriptor has to implement the IConfigurationDescriptor interface that provides the option for the descriptor
 * to load / reload its configuration.
 * 
 * There is a default configuration descriptor that is equivalent of a PropertyBag (or PropertiesResourceBundle). This
 * can be accessed through getDefault() method on the ConfigurationManager instance.
 * 
 * A typical usage pattern of the ConfigurationManager is provided below -
 * 
 * {@code ConfigurationManager configMgr = ConfigurationManager.getInstance();
 * configMgr.initializeFromBundle("myDefaultBundle");
 * 
 * //Now load the values from the default as below - String aConfigValue =
 * configMgr.getDefault().getString("myCustomKey"); String aConfigValue =
 * configMgr.getDefault().getString("myMissingKey", "DefaultValue"); }
 * 
 * @version 1.0
 */
public final class ConfigurationManager
{
	/**
	 * The singleton instance of this class.
	 */
	private static final ConfigurationManager singletonInstance = new ConfigurationManager();

	/**
	 * Logger instance for this class
	 */
	private static final CanvasConfigurationLogger LOGGER = new CanvasConfigurationLogger(ConfigurationManager.class);

	/**
	 * This represents the name that is associated with the default property bag descritor
	 */
	public static final String DEFAULT_DESCRIPTOR_NAME = "CT-DEFAULT";

	public static final String CONFIG_KEY_SECURITY_DESCRIPTOR = "CT_SECURITY_BUNDLE";
	public static final String CONFIG_KEY_CACHE_DESCRIPTOR = "CT_CACHE_BUNDLE";
	public static final String CONFIG_KEY_DB_DESCRIPTOR = "CT_DB_BUNDLE";
	public static final String CONFIG_KEY_EXPORT_DESCRIPTOR = "CT_EXPORT_BUNDLE";
	public static final String CONFIG_KEY_MULTILINGUAL_DESCRIPTOR = "CT_MULTILINGUAL_BUNDLE";
	public static final String CONFIG_KEY_WEBUTIL_DESCRIPTOR = "CT_WEBUTIL_BUNDLE";
	public static final String CONFIG_KEY_IMPL_CLASS_DESCRIPTOR = "CT_IMPL_CLASS";
	public static final String CONFIG_KEY_COMPONENT_PREFERENCE_DESCRIPTOR = "CT_COMP_PREF_BUNDLE";
	public static final String CONFIG_KEY_SYSTEM_PREFERENCE_DESCRIPTOR = "CT_SYSTEM_PREF_BUNDLE";
	public static final String CONFIG_KEY_LOGGING_DESCRIPTOR = "CT_LOGGING_CONFIG_BUNDLE";
	public static final String CONFIG_KEY_ASYNC_DESCRIPTOR = "CT_ASYNC_BUNDLE";
	public static final String CONFIG_KEY_CT_WORK_FOLDER_PATH = "CT_WORK_FOLDER_PATH";
	public static final String CONFIG_KEY_CT_WORK_CENTRALIZED_FOLDER_PATH = "CT_WORK_CENTRALIZED_FOLDER_PATH";
	public static final String CONFIG_KEY_CT_INFO_REPORT_BUNDLE = "CT_INFO_REPORT_BUNDLE";

	private boolean initialized = false;
	private boolean isInformationReportinitialized = false;
	private Date lastLoadTime = null;
	private String lastLoadSource = null;
	private ConfigurationException lastLoadinitializationError = null;
	private IPropertyBagConfigurationDescriptor defaultDescriptor = null;
	private Map<String, IConfigurationDescriptor> allConfigurationData = null;

	/**
	 * This is the listener list that is used for keeping track of any change listeners.
	 */
	private CanvasListenerList<IConfigurationChangeListener> listenerList = new CanvasListenerList<IConfigurationChangeListener>();

	/**
	 * The method does not allow to create a new instance.
	 */
	private ConfigurationManager()
	{
		super();
	}

	/**
	 * This is the method to get the default configuration manager instance
	 * 
	 * @return ConfigurationManager
	 * @throws ConfigurationException
	 */
	public static ConfigurationManager getInstance() throws ConfigurationException
	{
		return singletonInstance;
	}

	/**
	 * Override the default implementation to provide a formatted representation
	 * 
	 * @return String A formatted representation of the Configuration Manager
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		if (!initialized)
			sb.append("ConfigurationManager has not been initialized.");
		else
			sb.append("ConfigurationManager intialized with source '" + lastLoadSource + "' at "
					+ DateFormat.getDateInstance(DateFormat.LONG).format(lastLoadTime));
		return sb.toString();
	}

	/**
	 * This API triggers the shutdown of the canvas framework system and triggers the unload of all loaded modules from
	 * the earlier configuration.
	 */
	public void shutdown()
	{
		if (initialized)
		{
			raiseShutDownEvent();
			initialized = false;
			allConfigurationData = null;
			defaultDescriptor = null;
			lastLoadinitializationError = null;
		}
	}

	/**
	 * This method checks whether there is alreayd a listener present in the listener list that is an instance of the
	 * class provided
	 * 
	 * @param listener The listener class to be validated
	 * @return true if there is an instance of this listener already present in the list; false otherwise
	 */
	public boolean isListenerPresent(Class<IConfigurationChangeListener> listener)
	{
		Iterator<IConfigurationChangeListener> listIterator = listenerList.iterator();
		while (listIterator.hasNext())
		{
			if (listIterator.next().getClass().equals(listener))
				return true;
		}
		return false;
	}

	/**
	 * This method adds a change listener for this Configuration Manager. If the ConfigurationManager is already
	 * initialized, then this will trigger the configurationInitialized event on the same
	 * 
	 * @param listener The listener to be added
	 */
	public void addChangeListener(IConfigurationChangeListener listener)
	{
		listenerList.addListener(listener);
		if (initialized)
			listener.configurationInitialized();
	}

	/**
	 * This method removes a change listener previously registered with the Configuration Manager
	 * 
	 * @param listener THe listener to be removed
	 */
	public void removeChangeListener(IConfigurationChangeListener listener)
	{
		listenerList.removeListener(listener);
	}

	/**
	 * This method is provided for applications to configure the Canvas Configuration system using a property bundle
	 * 
	 * @param bundleName The bundle using which the Configuration system is to be initialized
	 * @throws ConfigurationException Thrown if any error occurs while initializing from the bundle
	 */
	public void initializeFromBundle(String bundleName) throws ConfigurationException
	{
		try
		{
			Map<String, IConfigurationDescriptor> configMap = createDefaultFromBundle(bundleName);
			defaultDescriptor = (IPropertyBagConfigurationDescriptor) configMap.get(DEFAULT_DESCRIPTOR_NAME);
			allConfigurationData = configMap;
			initialized = true;
			lastLoadTime = new Date();
			lastLoadSource = bundleName;
			lastLoadinitializationError = null;
			raiseInitializedEvent();
		} catch (ConfigurationException e)
		{
			LOGGER.cterror("CTCOM00095", e, bundleName);
			initialized = false;
			defaultDescriptor = null;
			allConfigurationData = null;
			lastLoadTime = null;
			lastLoadinitializationError = e;
			throw e;
		}
	}

	/**
	 * This method does a reload of the configuration. In case of any error faced at the time of reload, it does not
	 * change the original configuration
	 * 
	 * @param bundleName The bundle from which the configuration should be reloaded
	 * @throws ConfigurationException Thrown if there are any errors at the time of reload
	 */
	public void reinitializeFromBundle(String bundleName) throws ConfigurationException
	{
		try
		{
			synchronized (this)
			{
				Map<String, IConfigurationDescriptor> configMap = createDefaultFromBundle(bundleName);
				defaultDescriptor = (IPropertyBagConfigurationDescriptor) configMap.get(DEFAULT_DESCRIPTOR_NAME);
				allConfigurationData = configMap;
				initialized = true;
				lastLoadTime = new Date();
				lastLoadSource = bundleName;
				lastLoadinitializationError = null;
				raiseReinitializedEvent();
			}
		} catch (ConfigurationException e)
		{
			LOGGER.cterror("CTCOM00096", e, bundleName);
			lastLoadinitializationError = e;
			throw e;
		}
	}

	/**
	 * This method returns the system level default configuration bundle
	 * 
	 * @return The default configuration provided to the system
	 * @throws ConfigurationException Thrown if this invoked prior to the initialization of the Configuration system
	 */
	public IPropertyBagConfigurationDescriptor getDefault() throws ConfigurationException
	{
		if (!initialized)
		{
			throw (lastLoadinitializationError != null) ? lastLoadinitializationError
					: new ConfigurationException(
							"NON_INIT_ERR",
							"Default configuration can be accessed only after the initializexxx() method of the ConfigurationManager has been invoked.");
		}
		return defaultDescriptor;
	}

	/**
	 * This method returns the Security descriptor part of the Canvas Configuration
	 * 
	 * @return The Security configuration descriptor
	 * @throws ConfigurationException Thrown if this method is invoked prior to the initialization of the configuration
	 *             system
	 */
	public SecurityConfigurationDescriptor getSecurityDescriptor() throws ConfigurationException
	{
		if (!initialized)
		{
			throw (lastLoadinitializationError != null) ? lastLoadinitializationError
					: new ConfigurationException(
							"NON_INIT_ERR",
							"Security configuration can be accessed only after the initializexxx() method of the ConfigurationManager has been invoked.");
		}
		return (SecurityConfigurationDescriptor) getDescriptor(CONFIG_KEY_SECURITY_DESCRIPTOR);
	}

	/**
	 * This method returns the Logging descriptor part of the Canvas Configuration
	 * 
	 * @return The Logging configuration descriptor
	 * @throws ConfigurationException Thrown if this method is invoked prior to the initialization of the configuration
	 *             system
	 */
	public LoggingConfigurationDescriptor getLoggingDescriptor() throws ConfigurationException
	{
		if (!initialized)
		{
			throw (lastLoadinitializationError != null) ? lastLoadinitializationError
					: new ConfigurationException(
							"NON_INIT_ERR",
							"Logging configuration can be accessed only after the initializexxx() method of the ConfigurationManager has been invoked.");
		}
		return (LoggingConfigurationDescriptor) getDescriptor(CONFIG_KEY_LOGGING_DESCRIPTOR);
	}

	/**
	 * This method returns the Async configuration descriptor part of the Canvas Configuration
	 * 
	 * @return The Async configuration descriptor
	 * @throws ConfigurationException Thrown if this method is invoked prior to the initialization of the configuration
	 *             system
	 */
	public AsyncConfigurationDescriptor getAsyncDescriptor() throws ConfigurationException
	{
		if (!initialized)
		{
			throw (lastLoadinitializationError != null) ? lastLoadinitializationError
					: new ConfigurationException(
							"NON_INIT_ERR",
							"AsyncConfiguration can be accessed only after the initializexxx() method of the ConfigurationManager has been invoked.");
		}
		return (AsyncConfigurationDescriptor) getDescriptor(CONFIG_KEY_ASYNC_DESCRIPTOR);
	}

	/**
	 * This method returns the DB descriptor part of the Canvas Configuration
	 * 
	 * @return The DB configuration descriptor
	 * @throws ConfigurationException Thrown if this method is invoked prior to the initialization of the configuration
	 *             system
	 */
	public DBConfigurationDescriptor getDBDescriptor() throws ConfigurationException
	{
		if (!initialized)
		{
			throw (lastLoadinitializationError != null) ? lastLoadinitializationError
					: new ConfigurationException(
							"NON_INIT_ERR",
							"Security configuration can be accessed only after the initializexxx() method of the ConfigurationManager has been invoked.");
		}
		return (DBConfigurationDescriptor) getDescriptor(CONFIG_KEY_DB_DESCRIPTOR);
	}

	/**
	 * This method returns the Cache descriptor part of the Canvas Configuration
	 * 
	 * @return The Cache configuration descriptor
	 * @throws ConfigurationException Thrown if this method is invoked prior to the initialization of the configuration
	 *             system
	 */
	public CacheConfigurationDescriptor getCacheDescriptor() throws ConfigurationException
	{
		if (!initialized)
		{
			throw (lastLoadinitializationError != null) ? lastLoadinitializationError
					: new ConfigurationException(
							"NON_INIT_ERR",
							"Cache configuration can be accessed only after the initializexxx() method of the ConfigurationManager has been invoked.");
		}
		return (CacheConfigurationDescriptor) getDescriptor(CONFIG_KEY_CACHE_DESCRIPTOR);
	}

	/**
	 * This method returns the Export descriptor part of the Canvas Configuration
	 * 
	 * @return The Export configuration descriptor
	 * @throws ConfigurationException Thrown if this method is invoked prior to the initialization of the configuration
	 *             system
	 */
	public ExportConfigurationDescriptor getExportDescriptor() throws ConfigurationException
	{
		if (!initialized)
		{
			throw (lastLoadinitializationError != null) ? lastLoadinitializationError
					: new ConfigurationException(
							"NON_INIT_ERR",
							"Export configuration can be accessed only after the initializexxx() method of the ConfigurationManager has been invoked.");
		}
		return (ExportConfigurationDescriptor) getDescriptor(CONFIG_KEY_EXPORT_DESCRIPTOR);
	}

	/**
	 * This method returns the Multilingual support descriptor part of the Canvas Configuration
	 * 
	 * @return The Multilingual support configuration descriptor
	 * @throws ConfigurationException Thrown if this method is invoked prior to the initialization of the configuration
	 *             system
	 */
	public MultilingualLabelDescriptor getMultilingualLabelDescriptor() throws ConfigurationException
	{
		if (!initialized)
		{
			throw (lastLoadinitializationError != null) ? lastLoadinitializationError
					: new ConfigurationException(
							"NON_INIT_ERR",
							"Multilingual Label configuration can be accessed only after the initializexxx() method of the ConfigurationManager has been invoked.");
		}
		return (MultilingualLabelDescriptor) getDescriptor(CONFIG_KEY_MULTILINGUAL_DESCRIPTOR);
	}

	/*******************************************************************************************************************
	 * This method returns the Web util class descriptor part of the Canvas Configuration
	 * 
	 * @return WebUtilDescriptor
	 * @throws ConfigurationException
	 */
	public WebUtilDescriptor getWebUtilDescriptor() throws ConfigurationException
	{

		if (!initialized)
		{
			throw (lastLoadinitializationError != null) ? lastLoadinitializationError
					: new ConfigurationException(
							"NON_INIT_ERR",
							"WebUtil configuration can be accessed only after the initializexxx() method of the ConfigurationManager has been invoked.");
		}
		return (WebUtilDescriptor) getDescriptor(CONFIG_KEY_WEBUTIL_DESCRIPTOR);
	}

	/**
	 * This method returns the Implementation class descriptor part of the Canvas Configuration
	 * 
	 * @return The Implementation class configuration descriptor
	 * @throws ConfigurationException Thrown if this method is invoked prior to the initialization of the configuration
	 *             system
	 */
	public ImplClassDescriptor getImplClassDescriptor() throws ConfigurationException
	{
		if (!initialized)
		{
			throw (lastLoadinitializationError != null) ? lastLoadinitializationError
					: new ConfigurationException(
							"NON_INIT_ERR",
							"Multilingual Label configuration can be accessed only after the initializexxx() method of the ConfigurationManager has been invoked.");
		}
		return (ImplClassDescriptor) getDescriptor(CONFIG_KEY_IMPL_CLASS_DESCRIPTOR);
	}

	/**
	 * This method returns the component preference descriptor part of the Canvas Configuration
	 * 
	 * @return The Implementation class configuration descriptor
	 * @throws ConfigurationException Thrown if this method is invoked prior to the initialization of the configuration
	 *             system
	 */
	public ComponentPreferenceDescriptor getCompPrefDescriptor() throws ConfigurationException
	{
		if (!initialized)
		{
			throw (lastLoadinitializationError != null) ? lastLoadinitializationError
					: new ConfigurationException(
							"NON_INIT_ERR",
							"component preference configuration can be accessed only after the initializexxx() method of the ConfigurationManager has been invoked.");
		}
		return (ComponentPreferenceDescriptor) getDescriptor(CONFIG_KEY_COMPONENT_PREFERENCE_DESCRIPTOR);
	}

	/**
	 * This method returns the component preference descriptor part of the Canvas Configuration
	 * 
	 * @return The Implementation class configuration descriptor
	 * @throws ConfigurationException Thrown if this method is invoked prior to the initialization of the configuration
	 *             system
	 */
	public SystemPreferenceDescriptor getSystemPrefDescriptor() throws ConfigurationException
	{
		if (!initialized)
		{
			throw (lastLoadinitializationError != null) ? lastLoadinitializationError
					: new ConfigurationException(
							"NON_INIT_ERR",
							"system preference configuration can be accessed only after the initializexxx() method of the ConfigurationManager has been invoked.");
		}
		return (SystemPreferenceDescriptor) getDescriptor(CONFIG_KEY_SYSTEM_PREFERENCE_DESCRIPTOR);
	}

	/**
	 * This method returns the Async configuration descriptor part of the Canvas Configuration
	 * 
	 * @return The Async configuration descriptor
	 * @throws ConfigurationException Thrown if this method is invoked prior to the initialization of the configuration
	 *             system
	 */
	public InformationReportingDescriptor getInformationReportingDescriptor() throws ConfigurationException
	{
		if (!isInformationReportinitialized)
		{
			throw (lastLoadinitializationError != null) ? lastLoadinitializationError
					: new ConfigurationException(
							"NON_INIT_ERR",
							"InformationReporting Configuration can be accessed only after the initializexxx() method of the ConfigurationManager has been invoked.");
		}
		return (InformationReportingDescriptor) getDescriptor(CONFIG_KEY_CT_INFO_REPORT_BUNDLE);
	}

	/**
	 * This method retrieves a particular descriptor from the Configuration Manager
	 * 
	 * @param name The name of the descritor
	 * @return The configuration descriptor
	 */
	protected IConfigurationDescriptor getDescriptor(String name)
	{
		return allConfigurationData.get(name);
	}

	/**
	 * Helper method that creates a new Default descriptor
	 * 
	 * @param bundleName
	 * @throws ConfigurationException
	 */
	private Map<String, IConfigurationDescriptor> createDefaultFromBundle(String bundleName)
			throws ConfigurationException
	{
		Map<String, IConfigurationDescriptor> configMap = new HashMap<String, IConfigurationDescriptor>();
		IPropertyBagConfigurationDescriptor aDescriptor = null;
		IPropertyBagConfigurationDescriptor theDefaultDescriptor = new PropertyBagConfigurationDescriptor(
				DEFAULT_DESCRIPTOR_NAME);
		theDefaultDescriptor.loadConfiguration(bundleName, theDefaultDescriptor);
		configMap.put(theDefaultDescriptor.getName(), theDefaultDescriptor);

		if (StringUtils.isEmpty(theDefaultDescriptor.getString(CONFIG_KEY_CT_WORK_FOLDER_PATH))
				|| StringUtils.isEmpty(theDefaultDescriptor.getString(CONFIG_KEY_CT_WORK_CENTRALIZED_FOLDER_PATH)))
		{
			throw new ConfigurationException("CONFIG_ERR",
					"Missing or empty CT Working Folder and Working Centralized folder configuration under key '"
							+ bundleName + "'. Please point to the right configuration and reload.");
		}

		String loggingBundle = theDefaultDescriptor.getString(CONFIG_KEY_LOGGING_DESCRIPTOR);
		if (StringUtils.isEmpty(loggingBundle))
		{
			throw new ConfigurationException("CONFIG_ERR",
					"Missing or empty CT Logging descriptor configuration under key '" + CONFIG_KEY_LOGGING_DESCRIPTOR
							+ "'. Please point to the right configuration and reload.");
		}
		aDescriptor = new LoggingConfigurationDescriptor(CONFIG_KEY_LOGGING_DESCRIPTOR);
		aDescriptor.loadConfiguration(loggingBundle, theDefaultDescriptor);
		configMap.put(aDescriptor.getName(), aDescriptor);

		String securityBundle = theDefaultDescriptor.getString(CONFIG_KEY_SECURITY_DESCRIPTOR);
		if (StringUtils.isEmpty(securityBundle))
		{
			throw new ConfigurationException("CONFIG_ERR",
					"Missing or empty CT Security descriptor configuration under key '"
							+ CONFIG_KEY_SECURITY_DESCRIPTOR + "'. Please point to the right configuration and reload.");
		}
		aDescriptor = new SecurityConfigurationDescriptor(CONFIG_KEY_SECURITY_DESCRIPTOR);
		aDescriptor.loadConfiguration(securityBundle, theDefaultDescriptor);
		configMap.put(aDescriptor.getName(), aDescriptor);

		String cacheBundle = theDefaultDescriptor.getString(CONFIG_KEY_CACHE_DESCRIPTOR);
		if (StringUtils.isEmpty(cacheBundle))
		{
			throw new ConfigurationException("CONFIG_ERR",
					"Missing or empty CT Cache descriptor configuration under key '" + CONFIG_KEY_CACHE_DESCRIPTOR
							+ "'. Please point to the right configuration and reload.");
		}
		aDescriptor = new CacheConfigurationDescriptor(CONFIG_KEY_CACHE_DESCRIPTOR);
		aDescriptor.loadConfiguration(cacheBundle, theDefaultDescriptor);
		configMap.put(aDescriptor.getName(), aDescriptor);

		String dbBundle = theDefaultDescriptor.getString(CONFIG_KEY_DB_DESCRIPTOR);
		if (StringUtils.isEmpty(dbBundle))
		{
			throw new ConfigurationException("CONFIG_ERR",
					"Missing or empty CT DB descriptor configuration under key '" + CONFIG_KEY_DB_DESCRIPTOR
							+ "'. Please point to the right configuration and reload.");
		}
		aDescriptor = new DBConfigurationDescriptor(CONFIG_KEY_DB_DESCRIPTOR);
		aDescriptor.loadConfiguration(dbBundle, theDefaultDescriptor);
		configMap.put(aDescriptor.getName(), aDescriptor);

		String exportBundle = theDefaultDescriptor.getString(CONFIG_KEY_EXPORT_DESCRIPTOR);
		if (StringUtils.isEmpty(exportBundle))
		{
			throw new ConfigurationException("CONFIG_ERR",
					"Missing or empty CT EXPORT descriptor configuration under key '" + CONFIG_KEY_EXPORT_DESCRIPTOR
							+ "'. Please point to the right configuration and reload.");
		}
		aDescriptor = new ExportConfigurationDescriptor(CONFIG_KEY_EXPORT_DESCRIPTOR);
		aDescriptor.loadConfiguration(exportBundle, theDefaultDescriptor);
		configMap.put(aDescriptor.getName(), aDescriptor);

		String multilingualBundle = theDefaultDescriptor.getString(CONFIG_KEY_MULTILINGUAL_DESCRIPTOR);
		if (StringUtils.isEmpty(multilingualBundle))
		{
			throw new ConfigurationException("CONFIG_ERR",
					"Missing or empty CT MultiLingual descriptor configuration under key '"
							+ CONFIG_KEY_MULTILINGUAL_DESCRIPTOR
							+ "'. Please point to the right configuration and reload.");
		}
		aDescriptor = new MultilingualLabelDescriptor(CONFIG_KEY_MULTILINGUAL_DESCRIPTOR);
		aDescriptor.loadConfiguration(multilingualBundle, theDefaultDescriptor);
		configMap.put(aDescriptor.getName(), aDescriptor);

		String webUtilBundle = theDefaultDescriptor.getString(CONFIG_KEY_WEBUTIL_DESCRIPTOR);
		if (StringUtils.isEmpty(webUtilBundle))
		{
			throw new ConfigurationException("CONFIG_ERR",
					"Missing or empty CT WebUtil descriptor configuration under key '" + CONFIG_KEY_WEBUTIL_DESCRIPTOR
							+ "'. Please point to the right configuration and reload.");
		}
		aDescriptor = new WebUtilDescriptor(CONFIG_KEY_WEBUTIL_DESCRIPTOR);
		aDescriptor.loadConfiguration(webUtilBundle, theDefaultDescriptor);
		configMap.put(aDescriptor.getName(), aDescriptor);

		String implBundle = theDefaultDescriptor.getString(CONFIG_KEY_IMPL_CLASS_DESCRIPTOR);
		if (StringUtils.isEmpty(implBundle))
		{
			throw new ConfigurationException("CONFIG_ERR", "Missing or empty Impl descriptor configuration under key '"
					+ CONFIG_KEY_IMPL_CLASS_DESCRIPTOR + "'. Please point to the right configuration and reload.");
		}
		aDescriptor = new ImplClassDescriptor(CONFIG_KEY_IMPL_CLASS_DESCRIPTOR);
		aDescriptor.loadConfiguration(implBundle, theDefaultDescriptor);
		configMap.put(aDescriptor.getName(), aDescriptor);

		String componentPreferencesBundle = theDefaultDescriptor.getString(CONFIG_KEY_COMPONENT_PREFERENCE_DESCRIPTOR);
		if (StringUtils.isEmpty(componentPreferencesBundle))
		{
			throw new ConfigurationException("CONFIG_ERR", "Missing or empty Impl descriptor configuration under key '"
					+ CONFIG_KEY_COMPONENT_PREFERENCE_DESCRIPTOR
					+ "'. Please point to the right configuration and reload.");
		}
		aDescriptor = new ComponentPreferenceDescriptor(CONFIG_KEY_COMPONENT_PREFERENCE_DESCRIPTOR);
		aDescriptor.loadConfiguration(componentPreferencesBundle, theDefaultDescriptor);
		configMap.put(aDescriptor.getName(), aDescriptor);

		String systemPreferencesBundle = theDefaultDescriptor.getString(CONFIG_KEY_SYSTEM_PREFERENCE_DESCRIPTOR);
		if (StringUtils.isEmpty(systemPreferencesBundle))
		{
			throw new ConfigurationException("CONFIG_ERR", "Missing or empty Impl descriptor configuration under key '"
					+ CONFIG_KEY_SYSTEM_PREFERENCE_DESCRIPTOR
					+ "'. Please point to the right configuration and reload.");
		}
		aDescriptor = new SystemPreferenceDescriptor(CONFIG_KEY_SYSTEM_PREFERENCE_DESCRIPTOR);
		aDescriptor.loadConfiguration(systemPreferencesBundle, theDefaultDescriptor);
		configMap.put(aDescriptor.getName(), aDescriptor);

		String asyncBundle = theDefaultDescriptor.getString(CONFIG_KEY_ASYNC_DESCRIPTOR);
		if (StringUtils.isEmpty(asyncBundle))
		{
			// Okay, there is no async configuration provided. In that case, use the default from the framework.
			asyncBundle = "canvas-default-async";
		}
		aDescriptor = new AsyncConfigurationDescriptor(CONFIG_KEY_ASYNC_DESCRIPTOR);
		aDescriptor.loadConfiguration(asyncBundle, theDefaultDescriptor);
		configMap.put(aDescriptor.getName(), aDescriptor);

		String informationReportingBundle = theDefaultDescriptor.getString(CONFIG_KEY_CT_INFO_REPORT_BUNDLE);
		if (StringUtils.isEmpty(informationReportingBundle))
		{
			LOGGER.ctwarn("CTREP00638");
		} else
		{
			aDescriptor = new InformationReportingDescriptor(CONFIG_KEY_CT_INFO_REPORT_BUNDLE);
			aDescriptor.loadConfiguration(informationReportingBundle, theDefaultDescriptor);
			configMap.put(aDescriptor.getName(), aDescriptor);
			isInformationReportinitialized = true;
		}

		return configMap;
	}

	/**
	 * This method triggers the configurationInitialized event on all the registered listeners
	 */
	private void raiseInitializedEvent()
	{
		IConfigurationChangeListener listener;
		Iterator<IConfigurationChangeListener> listenerIterator = listenerList.iterator();
		while (listenerIterator.hasNext())
		{
			listener = listenerIterator.next();
			listener.configurationInitialized();
		}
	}

	/**
	 * This method triggers the configuration reinitialized event on all the registered listeners
	 */
	private void raiseReinitializedEvent()
	{
		IConfigurationChangeListener listener;
		Iterator<IConfigurationChangeListener> listenerIterator = listenerList.iterator();
		while (listenerIterator.hasNext())
		{
			listener = listenerIterator.next();
			listener.configurationReinitialized();
		}
	}

	/**
	 * This method triggers the configuration shutdown event on all the registered listeners
	 */
	private void raiseShutDownEvent()
	{
		IConfigurationChangeListener listener;
		Iterator<IConfigurationChangeListener> listenerIterator = listenerList.iterator();
		while (listenerIterator.hasNext())
		{
			listener = listenerIterator.next();
			listener.shutDown();
		}
	}
}
