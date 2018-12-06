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

package com.intellectdesign.canvas.security;

import java.util.MissingResourceException;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.logger.Logger;

/**
 * Use the factory to identify the authentication service provider. This always creates a new object of the service
 * provider configured. So the implementation of the service provider should be light weight. To use the factory with
 * service provider - IAuthenticationServiceProvider provider; try { provider =
 * AuthenticationProviderFactory.getAuthenticationServiceProvider(); }catch(AuthenticationException exception) {...}
 * provider.authenticateUser( userValue );
 * 
 * @version 1.0
 */
public final class AuthenticationProviderFactory
{
	/**
	 * Internal holder of the Authentication Provider class like a singleton. Using the Solution of Bill Pugh to avoid
	 * double checked locking issue.
	 * 
	 * @Version 1.0
	 */
	private static class AuthenticationProviderInstanceHolder
	{
		static final Class AUTHENTICATION_PROVIDER_CLASS = AuthenticationProviderFactory.locateServiceProvider();
	}

	/**
	 * The actual factory method. This creates an object of the service provider and returns the same.
	 * 
	 * @return An object of the authentication service provider configured.
	 * @throws CIBException Exception thrown when the authentication service provider adapter class cannot be located /
	 *             loaded.
	 */
	public static IAuthenticationServiceProvider getAuthenticationServiceProvider() throws AuthenticationException
	{
		LOGGER.ctinfo("CTBAS00033");

		IAuthenticationServiceProvider provider = null;
		Class serviceProviderClass = AuthenticationProviderInstanceHolder.AUTHENTICATION_PROVIDER_CLASS;
		if (serviceProviderClass != null)
		{
			try
			{
				LOGGER.ctdebug("CTBAS00035", serviceProviderClass);
				provider = (IAuthenticationServiceProvider) serviceProviderClass.newInstance();
				LOGGER.ctdebug("CTBAS00036", provider);
				provider.initialize();
				LOGGER.ctdebug("CTBAS00037", provider);
			} catch (AuthenticationException authEx)
			{
				// Just propagate the exception. This is thrown when the initialization of the provider is throwing
				// errors
				throw authEx;
			} catch (Exception ex)
			{
				// This scenario should typically never happen as the locateServiceProvider ensures that the class
				// has implemented this interface. A possible scenario is when the constructor or class initialization
				// throws exceptions

				LOGGER.cterror("CTBAS00039", ex, serviceProviderClass);
				throw new AuthenticationException(
						"Could not create authentication service provider adapter. Please check whether valid adapter class has been configured.");
			}
		} else
		{
			throw new AuthenticationException(
					"Could not locate any authentication service provider. Please check the configuration entries.");
		}

		return provider;
	}

	/**
	 * Helper method to load the class from resource bundle. This searches for a specific key in
	 * Orbionedirect.properties.
	 * 
	 * @return The authentication service provider class configured.
	 */
	static Class locateServiceProvider()
	{
		LOGGER.ctdebug("CTBAS00034");
		Class serviceProvider = null;
		String className = "";
		try
		{
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			className = configMgr.getSecurityDescriptor().getAuthenticationProviderClass();
			LOGGER.ctdebug("CTBAS00042", className);
		} catch (MissingResourceException mre)
		{
			LOGGER.cterror("CTBAS00040", mre);
			return null;
		}
		if ((className != null) && (className.trim().length() > 0))
		{
			try
			{
				serviceProvider = Class.forName(className);
				if (!IAuthenticationServiceProvider.class.isAssignableFrom(serviceProvider))
				{
					LOGGER.cterror("CTBAS00038", className);
					return null;
				}
			} catch (ClassNotFoundException cnfe)
			{
				LOGGER.cterror("CTBAS00041", cnfe, className);
				return null;
			}
		}
		return serviceProvider;
	}

	private static final Logger LOGGER = Logger.getLogger(AuthenticationProviderFactory.class);
}
