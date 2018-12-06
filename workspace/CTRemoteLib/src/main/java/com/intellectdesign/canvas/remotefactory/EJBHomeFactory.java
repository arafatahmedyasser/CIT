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
package com.intellectdesign.canvas.remotefactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.ejb.EJBHome;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.rmi.PortableRemoteObject;

import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.CTProperties;


/**
 * This class is responsible for creating, finding and removing the hashmap cache of EJBHomes to simplify the client
 * implementation
 */
public class EJBHomeFactory
{

	@SuppressWarnings("rawtypes")
	private HashMap homeObjs;

	private static EJBHomeFactory instance = new EJBHomeFactory();
	private static final Logger logger = Logger.getLogger(EJBHomeFactory.class);
	private Map<String, Properties> homeRegistry = new HashMap<String, Properties>();
	private Map<String, String> homeJndiRegistry = new HashMap<String, String>();

	/**
	 * This constructor initializes the hashmap of the EJBHome objects
	 */
	@SuppressWarnings("rawtypes")
	private EJBHomeFactory()
	{
		homeObjs = new HashMap();
	}

	/**
	 * This method returns the EJBHomeFactory as an instance
	 * 
	 * @return instance a reference to the enterprise bean's home interface
	 */
	public static EJBHomeFactory getInstance()
	{
		return instance;
	}

	/**
	 * This API is to be invoked to register possible home class names with the corresponding JNDI Names and the context
	 * props to be used.
	 * 
	 * @param className The Home Bean class name
	 * @param contextProps The properties to be used for the context lookup
	 * @param jndiName The JNDI name to be used for the lookup.
	 */
	public void registerHomeDetails(String className, Properties contextProps, String jndiName)
	{
		homeRegistry.put(className, contextProps);
		homeJndiRegistry.put(className, jndiName);
	}

	/**
	 * This class returns the EJB's remote home object for the class object passed as argument. This home object defines
	 * the enterprise bean's create, finder, remove, and home business methods
	 * 
	 * @param homeClass class object to be returned as EJBHome object
	 * @throws ProcessingErrorException detailed description for the exception key and exception description
	 * 
	 */
	@SuppressWarnings(
	{ "rawtypes", "unchecked" })
	public EJBHome getHome(Class homeClass) throws ProcessingErrorException
	{
		EJBHome home;

		if ((home = (EJBHome) homeObjs.get(homeClass)) == null)
		{

			home = get(homeClass);
			homeObjs.put(homeClass, home);
		}

		return home;
	}

	/**
	 * Helper method that constructs the Initial context params based on the class name provided.
	 * 
	 * @param homeClass THe home class
	 * @return The Properties to be used for context lookup for the home class
	 */
	private Properties getContextLookupProps(Class homeClass)
	{
		String className = homeClass.getName();

		if (homeRegistry.containsKey(className))
			return homeRegistry.get(className);

		// If not present, then continue with current flow of reading from CT.properties
		String url = CTProperties.getProperty(className + ".JNDIURL");
		String provider = CTProperties.getProperty(className + ".Provider");
		String principal = CTProperties.getProperty(className + ".security.principal");
		String credentials = CTProperties.getProperty(className + ".security.credentials");
		Properties props = new Properties();
		if (!provider.trim().equals(""))
		{
			props.put(Context.INITIAL_CONTEXT_FACTORY, provider);
			logger.ctdebug("CTRMT00003", provider);
		}
		if (!url.trim().equals(""))
		{
			props.put(Context.PROVIDER_URL, url);
			logger.ctdebug("CTRMT00004", url);
		}
		if ((!principal.trim().equals("")) && (!credentials.trim().equals("")))
		{
			props.put(Context.SECURITY_PRINCIPAL, principal.trim());
			props.put(Context.SECURITY_CREDENTIALS, credentials.trim());
		}
		return props;
	}

	/**
	 * Retrieves the JNDI Name for the given Home Class
	 * 
	 * @param homeClass The Home class
	 * @return The JNDI Name for the Home Class
	 */
	private String getHomeJNDINameFor(Class homeClass)
	{
		String className = homeClass.getName();

		if (homeJndiRegistry.containsKey(className))
			return homeJndiRegistry.get(className);

		// If not present, then continue with current flow of reading from CT.properties
		return CTProperties.getProperty(className + ".JNDIName");
	}

	/**
	 * This method returns the EJB Home object when no EJB reference has been defined for the EJBHome object. The JNDI
	 * name is derived from the supplied homeClass.
	 * 
	 * @param homeClass name of the class contianing the JNDI name, URL
	 * @throws detailed description fof the exception key and exception description
	 */
	@SuppressWarnings("rawtypes")
	private EJBHome get(Class homeClass) throws ProcessingErrorException
	{
		logger.ctinfo("CTRMT00002");
		EJBHome home = null;
		Context ctx = null;
		String jndiName = getHomeJNDINameFor(homeClass);
		Properties props = getContextLookupProps(homeClass);
		try
		{
			if (props.isEmpty())
			{
				ctx = new InitialContext();
				logger.ctdebug("CTRMT00007");
			} else
			{
				ctx = new InitialContext(props);
			}
			logger.ctinfo("CTRMT00008", jndiName);
			Object obj = ctx.lookup(jndiName);

			home = (EJBHome) PortableRemoteObject.narrow(obj, homeClass);

		} catch (NamingException nex)
		{

			logger.cterror("CTRMT00009", nex);
			throw new ProcessingErrorException(nex.getMessage());
		} catch (Exception ex)
		{

			logger.cterror("CTRMT00009", ex);
			throw new ProcessingErrorException(ex.getMessage());
		} finally
		{

			try
			{
				if (ctx != null)
					ctx.close();
			} catch (NamingException nex)
			{
				logger.cterror("CTRMT00009", nex);
			}
		}

		return home;
	}

	/**
	 * This method removes the given class object from the EJB remote Home object.
	 * 
	 * @param homeClass class object that needs to be removed from the EJB Home object
	 * 
	 */
	@SuppressWarnings("rawtypes")
	public synchronized void removeHome(Class homeClass)
	{
		if (homeObjs.containsKey(homeClass))
		{
			homeObjs.remove(homeClass);
		}
	}
}
