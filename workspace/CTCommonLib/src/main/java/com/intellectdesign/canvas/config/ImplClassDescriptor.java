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
import com.intellectdesign.canvas.utils.ResourceBundleUtils;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This is simple Configuration Holder class that enables a set of configurations related to implementation classes. All
 * the configurations are available only as getter methods. The Implementation class configuration can be loaded using
 * the Canvas Main Configuration Manager by providing a separate resource that has all the implementation class
 * configurations
 * 
 * To provide the implementation class related configurations, as part of the Canvas Main Configuration Manager,
 * configure the following key -
 * <ul>
 * <li><b>CT_IMPL_CLASS</b> : This is the bundle that should be loaded from where the implementation class configuration
 * as detailed below will be identified</li>
 * </ul>
 * 
 * The detailed listing of the keys expected in the security bundle are provided below.
 * <ul>
 * <li><b>VIEW_ENTITLEMENT_CLASS</b> : The Class which is responsible to say whether user is valid/entitled and to get
 * user related information</li>
 * <li><b>GLOBAL_CURRENCY_PROVIDER_CLASS</b> : The Class which is responsible to say where to get the list of currency
 * with their corresponding decimal digits</li>
 * <li><b>RATE_CARD_FACOTORY_CLASS</b> : The Class which is responsible for the Rate Card conversion rates</li>
 * <li><b>HANDLER_INVOKER_CLASS</b> : This is the class which bridges the call between the action layer and the handler
 * layer</li>
 * <li><b>HAL_HANDLER_INVOKER_CLASS</b> : This is the class which bridges the call between the Handler/Instruction Class
 * and external datasource -EJB</li>
 * <li><b>REQUEST_INTERCEPTOR_CLASS</b> : This is the class which is responsible of modifying the request params before
 * handling to the handler</li>
 * <li><b>PUBLIC_KEY_CLASS</b> : This class facilitates key exchanging process for the encryption</li>
 * <li><b>ENCRYPTION_KEY_CLASS</b> : This Class facilitates encryption/decryption and other util methods related to the
 * AES Algorithms</li>
 * <li><b>EVENT_INTERCEPTOR_CLASS</b> : This is the class that can be used to intercept when the event is raised</li>
 * <li><b>HTTP_HANDLER_INVOKER_URL</b>: This is required only if the Handler Invoker class provided is
 * HttpCanvasHandlerInvoker. In this case, this should be the full URL pointing till the servlet name to which the
 * request should be sent</li>
 * <li><b>RequestHandlerInvokerEJB.JNDIName</b>: This is required only if the HANDLER_INVOKER_CLASS is provided as
 * 'com.intellectdesign.canvas.action.RemoteCanvasHandlerInvoker'. This should be JNDI Name for the Remote EJB lookup.</li>
 * <li><b>RequestHandlerInvokerEJB.ContextFactory</b>: This is required only if the HANDLER_INVOKER_CLASS is provided as
 * 'com.intellectdesign.canvas.action.RemoteCanvasHandlerInvoker'. This is the Initial Context Factory class to be used
 * for the Remote EJB lookup.</li>
 * <li><b>RequestHandlerInvokerEJB.JNDIURL</b>: This is required only if the HANDLER_INVOKER_CLASS is provided as
 * 'com.intellectdesign.canvas.action.RemoteCanvasHandlerInvoker'. This is the JNDI URL to be used for the Remote EJB
 * lookup.</li>
 * <li><b>RequestHandlerInvokerEJB.security.principal</b>: This is required only if the HANDLER_INVOKER_CLASS is
 * provided as 'com.intellectdesign.canvas.action.RemoteCanvasHandlerInvoker'. This has the user name to be used for the
 * JNDI Lookup. This is optional. If not provided, then lookup is done without any security credentials.</li>
 * <li><b>RequestHandlerInvokerEJB.security.credentials</b>: This is required only if the HANDLER_INVOKER_CLASS is
 * provided as 'com.intellectdesign.canvas.action.RemoteCanvasHandlerInvoker'. This has the credentials / password to be
 * used for the JNDI Lookup. This is optional. This will be read only if the principal has been provided.</li>
 * <li><b>LOGIN_HANDLER_INVOKER_CLASS</b> : This is the class which bridges the call between the Login Manager and the
 * handler layer. The class provided should implement com.intellectdesign.canvas.login.handlers.ILoginHandlerInvoker</li>
 * <li><b>LoginEJB.JNDIName</b>: This is required only if the LOGIN_HANDLER_INVOKER_CLASS is provided as
 * 'com.intellectdesign.canvas.login.handlers.RemoteLoginHandlerInvoker'. This should be JNDI Name for the Remote EJB
 * lookup.</li>
 * <li><b>LoginEJB.ContextFactory</b>: This is required only if the LOGIN_HANDLER_INVOKER_CLASS is provided as
 * 'com.intellectdesign.canvas.login.handlers.RemoteLoginHandlerInvoker'. This is the Initial Context Factory class to
 * be used for the Remote EJB lookup.</li>
 * <li><b>LoginEJB.JNDIURL</b>: This is required only if the LOGIN_HANDLER_INVOKER_CLASS is provided as
 * 'com.intellectdesign.canvas.login.handlers.RemoteLoginHandlerInvoker'. This is the JNDI URL to be used for the Remote
 * EJB lookup.</li>
 * <li><b>LoginEJB.security.principal</b>: This is required only if the LOGIN_HANDLER_INVOKER_CLASS is provided as
 * 'com.intellectdesign.canvas.login.handlers.RemoteLoginHandlerInvoker'. This has the user name to be used for the JNDI
 * Lookup. This is optional. If not provided, then lookup is done without any security credentials.</li>
 * <li><b>LoginEJB.security.credentials</b>: This is required only if the LOGIN_HANDLER_INVOKER_CLASS is provided as
 * 'com.intellectdesign.canvas.login.handlers.RemoteLoginHandlerInvoker'. This has the credentials / password to be used
 * for the JNDI Lookup. This is optional. This will be read only if the principal has been provided.</li>
 * <li><b>HTTP_LOGIN_INVOKER_URL</b>: This is required only if the Login Invoker class provided is
 * 'com.intellectdesign.canvas.login.handlers.HttpLoginHandlerInvoker'. In this case, this should be the full URL
 * pointing till the servlet name to which the request should be sent. The servlet class is expected to be configured as
 * com.intellectdesign.canvas.action.CanvasHandlerServlet</li>
 * </ul>
 * 
 * @version 1.0
 **/

public class ImplClassDescriptor extends PropertyBagConfigurationDescriptor
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 1L;

	public static final String MAIN_CONFIG_CT_IMPL_CLASS = "CT_IMPL_CLASS";

	private static final CanvasConfigurationLogger LOGGER = new CanvasConfigurationLogger(ImplClassDescriptor.class);

	/**
	 * The only constructor for this descriptor. This takes the name associated to this descriptor
	 * 
	 * @param name The name for this descriptor
	 */

	public ImplClassDescriptor(String name)
	{
		super(name);
	}

	private String viewEntlClass = null;
	private String globalCurrencyProviderClass = null;
	private String rateCardFactoryClass = null;
	private String handlerInvokerClass = null;
	private String HALhandlerInvokerClass = null;
	private String requestInterceptorClass = null;
	private String publicKeyClass = null;
	private String encryptionKeyClass = null;
	private String eventInterceptorClass = null;
	private String loginHandlerInvokerClass = null;
	private URL httpHandlerInvokerUrl = null;
	private String handlerJndiName;
	private String handlerJndiUrl;
	private String handlerJndiContextFactoryClass;
	private String handlerJndiPrincipal;
	private String handlerJndiCredential;
	private Properties handlerInitialContextMap;
	private URL httpLoginInvokerUrl = null;
	private String loginJndiName;
	private String loginJndiUrl;
	private String loginJndiContextFactoryClass;
	private String loginJndiPrincipal;
	private String loginJndiCredential;
	private Properties loginInitialContextMap;

	/**
	 * ref to ViewEntl
	 * 
	 * @return the viewEntlClass
	 */
	public String getViewEntlClass()
	{
		return viewEntlClass;
	}

	/**
	 * vref to publickey
	 * 
	 * @return the publicKeyClass
	 */
	public String getPublicKeyClass()
	{
		return publicKeyClass;
	}

	/**
	 * ref to Encryptionkey
	 * 
	 * @return the encryptionKeyClass
	 */
	public String getEncryptionKeyClass()
	{
		return encryptionKeyClass;
	}

	/**
	 * ref to globalcurrencyProvider
	 * 
	 * @return the viewEntlClass
	 */
	public String getGlobalCurrencyProviderClass()
	{
		return globalCurrencyProviderClass;
	}

	/**
	 * This corresponds to the key
	 * 
	 * @return the viewEntlClass
	 */
	public String getRateCardFactoryClass()
	{
		return rateCardFactoryClass;
	}

	/**
	 * 
	 * ref to handlerInvoker
	 * 
	 * @return The handler invoker class
	 */
	public String getHandlerInvokerClass()
	{
		return handlerInvokerClass;
	}

	/**
	 * ref to HALhandlerInvokerClass
	 * 
	 * @return The HALhandler invoker class
	 */

	public String getHALHandlerInvokerClass()
	{
		return HALhandlerInvokerClass;
	}

	/**
	 * ref to requestInterceptorClass
	 * 
	 * @return The HALhandler invoker class
	 */
	public String getRequestInterceptorClass()
	{
		return requestInterceptorClass;
	}

	/**
	 * @return the eventInterceptorClass
	 */
	public String getEventInterceptorClass()
	{
		return eventInterceptorClass;
	}

	/**
	 * ref to handlerInvoker
	 * 
	 * @return The handler invoker class
	 */
	public String getLoginHandlerInvokerClass()
	{
		return loginHandlerInvokerClass;
	}

	/**
	 * @return the httpLoginInvokerUrl
	 */
	public URL getHttpLoginInvokerUrl()
	{
		return httpLoginInvokerUrl;
	}

	/**
	 * @return the loginJndiName
	 */
	public String getLoginJndiName()
	{
		return loginJndiName;
	}

	/**
	 * @return the loginJndiUrl
	 */
	public String getLoginJndiUrl()
	{
		return loginJndiUrl;
	}

	/**
	 * @return the loginJndiContextFactoryClass
	 */
	public String getLoginJndiContextFactoryClass()
	{
		return loginJndiContextFactoryClass;
	}

	/**
	 * @return the loginJndiPrincipal
	 */
	public String getLoginJndiPrincipal()
	{
		return loginJndiPrincipal;
	}

	/**
	 * @return the loginJndiCredential
	 */
	public String getLoginJndiCredential()
	{
		return loginJndiCredential;
	}

	/**
	 * @return the loginInitialContextMap
	 */
	public Properties getLoginInitialContextMap()
	{
		return loginInitialContextMap;
	}

	/**
	 * @return the httpHandlerInvokerUrl
	 */
	public URL getHttpHandlerInvokerUrl()
	{
		return httpHandlerInvokerUrl;
	}

	/**
	 * @return the handlerJndiName
	 */
	public String getHandlerJndiName()
	{
		return handlerJndiName;
	}

	/**
	 * @return the handlerJndiUrl
	 */
	public String getHandlerJndiUrl()
	{
		return handlerJndiUrl;
	}

	/**
	 * @return the handlerJndiContextFactoryClass
	 */
	public String getHandlerJndiContextFactoryClass()
	{
		return handlerJndiContextFactoryClass;
	}

	/**
	 * @return the handlerJndiPrincipal
	 */
	public String getHandlerJndiPrincipal()
	{
		return handlerJndiPrincipal;
	}

	/**
	 * @return the handlerJndiCredential
	 */
	public String getHandlerJndiCredential()
	{
		return handlerJndiCredential;
	}

	/**
	 * @return the handlerInitialContextMap
	 */
	public Properties getHandlerInitialContextMap()
	{
		return handlerInitialContextMap;
	}

	/**
	 * ref to Load Config
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
					"Issues were found as part of the Implementation Descriptor configuration information (resource bundle : "
							+ configSource + "). Please refer to the Logs for more details");
		}

		PropertyResourceBundle bundle = getRawConfigData();

		viewEntlClass = ResourceBundleUtils.getString(bundle, "VIEW_ENTITLEMENT_CLASS", "");
		publicKeyClass = ResourceBundleUtils.getString(bundle, "PUBLIC_KEY_CLASS", "");
		encryptionKeyClass = ResourceBundleUtils.getString(bundle, "ENCRYPTION_KEY_CLASS", "");
		globalCurrencyProviderClass = ResourceBundleUtils.getString(bundle, "GLOBAL_CURRENCY_PROVIDER_CLASS", "");
		rateCardFactoryClass = ResourceBundleUtils.getString(bundle, "RATE_CARD_FACOTORY_CLASS", "");
		handlerInvokerClass = ResourceBundleUtils.getString(bundle, "HANDLER_INVOKER_CLASS",
				"com.intellectdesign.canvas.action.SimpleCanvasHandlerInvoker");
		HALhandlerInvokerClass = ResourceBundleUtils.getString(bundle, "HAL_HANDLER_INVOKER_CLASS",
				"com.intellectdesign.canvas.hal.HALInvoker");
		requestInterceptorClass = ResourceBundleUtils.getString(bundle, "REQUEST_INTERCEPTOR_CLASS",
				"com.intellectdesign.canvas.action.SimpleCanvasRequestInterceptor");
		// Loading implementation specific Event preprocessor configuration. If it is not configured then invoking the
		// SimpleCanvasEventInterceptor class as default.
		eventInterceptorClass = ResourceBundleUtils.getString(bundle, "EVENT_INTERCEPTOR_CLASS",
				"com.intellectdesign.canvas.event.helper.SimpleCanvasEventInterceptor");
		loginHandlerInvokerClass = ResourceBundleUtils.getString(bundle, "LOGIN_HANDLER_INVOKER_CLASS",
				"com.intellectdesign.canvas.login.handlers.LocalLoginHandlerInvoker");
		String httpInvokerUrl = ResourceBundleUtils.getString(bundle, "HTTP_HANDLER_INVOKER_URL", "");
		try
		{
			if (!StringUtils.isEmpty(httpInvokerUrl))
				httpHandlerInvokerUrl = new URL(httpInvokerUrl);
		} catch (MalformedURLException e)
		{
			throw new ConfigurationException("CONFIG_ERR", e);
		}
		handlerJndiName = ResourceBundleUtils.getString(bundle, "RequestHandlerInvokerEJB.JNDIName", "");
		handlerJndiContextFactoryClass = ResourceBundleUtils.getString(bundle,
				"RequestHandlerInvokerEJB.ContextFactory", "");
		handlerJndiUrl = ResourceBundleUtils.getString(bundle, "RequestHandlerInvokerEJB.JNDIURL", "");
		handlerJndiPrincipal = ResourceBundleUtils.getString(bundle, "RequestHandlerInvokerEJB.security.principal", "");
		handlerJndiCredential = ResourceBundleUtils.getString(bundle, "RequestHandlerInvokerEJB.security.credentials",
				"");

		// Construct the initialContext properties object.
		handlerInitialContextMap = new Properties();
		if (!StringUtils.isEmpty(handlerJndiContextFactoryClass))
			handlerInitialContextMap.put(Context.INITIAL_CONTEXT_FACTORY, handlerJndiContextFactoryClass);
		if (!StringUtils.isEmpty(handlerJndiUrl))
			handlerInitialContextMap.put(Context.PROVIDER_URL, handlerJndiUrl);
		if (!StringUtils.isEmpty(handlerJndiPrincipal) && !StringUtils.isEmpty(handlerJndiCredential))
		{
			handlerInitialContextMap.put(Context.SECURITY_PRINCIPAL, handlerJndiPrincipal);
			handlerInitialContextMap.put(Context.SECURITY_CREDENTIALS, handlerJndiCredential);
		}

		String httpLoginUrl = ResourceBundleUtils.getString(bundle, "HTTP_LOGIN_INVOKER_URL", "");
		try
		{
			if (!StringUtils.isEmpty(httpLoginUrl))
				httpLoginInvokerUrl = new URL(httpLoginUrl);
		} catch (MalformedURLException e)
		{
			throw new ConfigurationException("CONFIG_ERR", e);
		}
		loginJndiName = ResourceBundleUtils.getString(bundle, "LoginEJB.JNDIName", "");
		loginJndiContextFactoryClass = ResourceBundleUtils.getString(bundle, "LoginEJB.ContextFactory", "");
		loginJndiUrl = ResourceBundleUtils.getString(bundle, "LoginEJB.JNDIURL", "");
		loginJndiPrincipal = ResourceBundleUtils.getString(bundle, "LoginEJB.security.principal", "");
		loginJndiCredential = ResourceBundleUtils.getString(bundle, "LoginEJB.security.credentials", "");

		// Construct the initialContext properties object.
		loginInitialContextMap = new Properties();
		if (!StringUtils.isEmpty(loginJndiContextFactoryClass))
			loginInitialContextMap.put(Context.INITIAL_CONTEXT_FACTORY, loginJndiContextFactoryClass);
		if (!StringUtils.isEmpty(loginJndiUrl))
			loginInitialContextMap.put(Context.PROVIDER_URL, loginJndiUrl);
		if (!StringUtils.isEmpty(loginJndiPrincipal) && !StringUtils.isEmpty(loginJndiCredential))
		{
			loginInitialContextMap.put(Context.SECURITY_PRINCIPAL, loginJndiPrincipal);
			loginInitialContextMap.put(Context.SECURITY_CREDENTIALS, loginJndiCredential);
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
		StringBuilder errorBuilder = new StringBuilder();
		LOGGER.ctdebug("CTCOM00013");
		timer.startTimer(getClass(), "isValidConfiguration");

		PropertyResourceBundle bundle = getRawConfigData();
		String className;

		className = ResourceBundleUtils.getString(bundle, "PUBLIC_KEY_CLASS", "");
		errorBuilder.append(validateImplementationClass(className,
				"com.intellectdesign.canvas.servercomm.encryption.PublicKeyInterface", "PUBLIC_KEY_CLASS", true));
		className = ResourceBundleUtils.getString(bundle, "ENCRYPTION_KEY_CLASS", "");
		errorBuilder.append(validateImplementationClass(className,
				"com.intellectdesign.canvas.servercomm.encryption.EncryptionEngine", "ENCRYPTION_KEY_CLASS", true));
		className = ResourceBundleUtils.getString(bundle, "VIEW_ENTITLEMENT_CLASS", "");
		errorBuilder.append(validateImplementationClass(className,
				"com.intellectdesign.canvas.entitlement.IEntitlementSource", "VIEW_ENTITLEMENT_CLASS", true));
		className = ResourceBundleUtils.getString(bundle, "GLOBAL_CURRENCY_PROVIDER_CLASS", "");
		errorBuilder.append(validateImplementationClass(className,
				"com.intellectdesign.canvas.utils.currency.ICurrencyDataProvider", "GLOBAL_CURRENCY_PROVIDER_CLASS",
				true));
		className = ResourceBundleUtils.getString(bundle, "RATE_CARD_FACOTORY_CLASS", "");
		errorBuilder.append(validateImplementationClass(className,
				"com.intellectdesign.canvas.ratecard.IRateCardFactory", "RATE_CARD_FACOTORY_CLASS", true));

		className = ResourceBundleUtils.getString(bundle, "HAL_HANDLER_INVOKER_CLASS", "");
		errorBuilder.append(validateImplementationClass(className, "com.intellectdesign.canvas.hal.HALInvoker",
				"HAL_HANDLER_INVOKER_CLASS", false));
		className = ResourceBundleUtils.getString(bundle, "REQUEST_INTERCEPTOR_CLASS", "");
		errorBuilder.append(validateImplementationClass(className,
				"com.intellectdesign.canvas.action.ICanvasRequestInterceptor", "REQUEST_INTERCEPTOR_CLASS", false));
		className = ResourceBundleUtils.getString(bundle, "EVENT_INTERCEPTOR_CLASS", "");
		errorBuilder.append(validateImplementationClass(className,
				"com.intellectdesign.canvas.event.helper.ICanvasEventInterceptor", "EVENT_INTERCEPTOR_CLASS", false));

		className = ResourceBundleUtils.getString(bundle, "HANDLER_INVOKER_CLASS", "");
		errorBuilder.append(validateImplementationClass(className,
				"com.intellectdesign.canvas.action.ICanvasHandlerInvoker", "HANDLER_INVOKER_CLASS", false));

		className = ResourceBundleUtils.getString(bundle, "LOGIN_HANDLER_INVOKER_CLASS", "");
		errorBuilder.append(validateImplementationClass(className,
				"com.intellectdesign.canvas.login.handlers.ILoginHandlerInvoker", "LOGIN_HANDLER_INVOKER_CLASS", false));

		String httpInvokerUrl = ResourceBundleUtils.getString(bundle, "HTTP_HANDLER_INVOKER_URL", "");
		boolean mandatory = "com.intellectdesign.canvas.action.HttpCanvasHandlerInvoker".equals(className);
		if (mandatory)
		{
			if (StringUtils.isEmpty(httpInvokerUrl))
				errorBuilder
						.append("When the Handler invoker is com.intellectdesign.canvas.action.HttpCanvasInvokerServlet, HTTP_HANDLER_INVOKER_URL is a mandatory configuration");
			else
			{
				try
				{
					new URL(httpInvokerUrl);
				} catch (MalformedURLException e)
				{
					errorBuilder
							.append("the HTTP_HANDLER_INVOKER_URL provided seems to be a malformed URL. Please check the configuration. Value received is '"
									+ httpInvokerUrl + "'");
				}
			}
		}
		// Check for the remote handler invoker configuration. Only thing mandatory is the JNDI Name. All other aspects
		// are related to lookup. If not provided, expect that the InitialContext is aware of what to do
		mandatory = "com.intellectdesign.canvas.action.RemoteCanvasHandlerInvoker".equals(className);
		if (mandatory)
		{
			if (StringUtils.isEmpty(ResourceBundleUtils.getString(bundle, "RequestHandlerInvokerEJB.JNDIName", "")))
				errorBuilder
						.append("When the cache proxy is set to 'remote', RequestHandlerInvokerEJB.JNDIName is a mandatory configuration");
		}
		String httpLoginUrl = ResourceBundleUtils.getString(bundle, "HTTP_LOGIN_INVOKER_URL", "");
		mandatory = "com.intellectdesign.canvas.login.handlers.HttpLoginHandlerInvoker".equals(className);
		if (mandatory)
		{
			if (StringUtils.isEmpty(httpLoginUrl))
				errorBuilder
						.append("When the Login invoker is com.intellectdesign.canvas.login.handlers.HttpLoginHandlerInvoker, HTTP_LOGIN_INVOKER_URL is a mandatory configuration");
			else
			{
				try
				{
					new URL(httpLoginUrl);
				} catch (MalformedURLException e)
				{
					errorBuilder
							.append("the HTTP_LOGIN_INVOKER_URL provided seems to be a malformed URL. Please check the configuration. Value received is '"
									+ httpLoginUrl + "'");
				}
			}
		}
		// Check for the remote handler invoker configuration. Only thing mandatory is the JNDI Name. All other aspects
		// are related to lookup. If not provided, expect that the InitialContext is aware of what to do
		mandatory = "com.intellectdesign.canvas.login.handlers.RemoteLoginHandlerInvoker".equals(className);
		if (mandatory)
		{
			if (StringUtils.isEmpty(ResourceBundleUtils.getString(bundle, "LoginEJB.JNDIName", "")))
				errorBuilder
						.append("When the login handler invoker is set to 'com.intellectdesign.canvas.login.handlers.RemoteLoginHandlerInvoker', LoginEJB.JNDIName is a mandatory configuration");
		}

		validationStatus = errorBuilder.length() == 0;

		if (validationStatus)
			LOGGER.ctdebug("CTCOM00014");
		else
		{
			LOGGER.cterror("CTCOM00015", errorBuilder.toString());
		}
		timer.endTimer();
		return validationStatus;
	}

	/**
	 * Validates that the provided class name is presnet and extends / implements the base class provided.
	 * 
	 * @param className
	 * @param baseOrInterfaceClassName
	 * @param configKey
	 * @param isMandatory
	 * @return String
	 */
	private String validateImplementationClass(String className, String baseOrInterfaceClassName, String configKey,
			boolean isMandatory)
	{
		String errorMsg = "";
		if (StringUtils.isEmpty(className))
		{
			if (isMandatory)
				errorMsg = configKey
						+ " is a mandatory configuration. Please provide a valid class which implements / extends from "
						+ baseOrInterfaceClassName;
		} else
		{
			try
			{
				Class subClass = Class.forName(className);
				Class baseClass = Class.forName(baseOrInterfaceClassName);
				if (!baseClass.isAssignableFrom(subClass))
				{
					errorMsg = "The class '" + className + "' configured for '" + configKey
							+ "' does not extend / implement '" + baseOrInterfaceClassName + "'";
				}
			} catch (Exception ex)
			{
				LOGGER.cterror("CTCOM00015", ex);

				errorMsg = "The class '" + className + "' configured for '" + configKey
						+ "' cannot be loaded properly from class path. Is your classpath set correctly?";
			}
		}
		return errorMsg;
	}

}
