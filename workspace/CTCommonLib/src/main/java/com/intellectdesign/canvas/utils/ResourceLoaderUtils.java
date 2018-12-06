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

package com.intellectdesign.canvas.utils;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.proxycaller.ProxyCaller;
import com.intellectdesign.canvas.proxycaller.ProxyCallerException;

/**
 * This is a utility class that provides API's to load resources from various locations
 */
public final class ResourceLoaderUtils
{
	/**
	 * Making constructor private to avoid creation of any objects of this class
	 */
	private ResourceLoaderUtils()
	{
	}

	/**
	 * This method creates an instance of the class using the default constructor. This will be successful only if the
	 * default constructor of the class is public.
	 * 
	 * @param className The class name to be created
	 * @return The object created for the class
	 * @throws BaseException Thrown if any error occurs while creating the object
	 */
	public static Object createInstance(String className) throws BaseException
	{
		try
		{
			return ProxyCaller.on(className).create().get();
		} catch (ProxyCallerException e)
		{
			throw new BaseException("ERR_OBJ_CREATE", "Unable to create object for class '" + className + "'", e);
		}
	}

	/**
	 * This method creates an instance of the class with the arguments provided, if any. This will be successful only if
	 * the constructor of the class is public.
	 * 
	 * @param className The class name to be created
	 * @param constructorArgs The arguments to be passed to the constructor
	 * @return The object created for the class
	 * @throws BaseException Thrown if any error occurs while creating the object
	 */
	public static Object createInstance(String className, Object... constructorArgs) throws BaseException
	{
		try
		{
			return ProxyCaller.on(className).create(constructorArgs).get();
		} catch (ProxyCallerException e)
		{
			throw new BaseException("ERR_OBJ_CREATE", "Unable to create object for class '" + className + "'", e);
		}
	}

	/**
	 * This method creates an instance of the class with the default constructor. This will be successful only if the
	 * constructor of the class is public.
	 * 
	 * @param aClass The class to be created
	 * @return The object created for the class
	 * @throws BaseException Thrown if any error occurs while creating the object
	 */
	public static Object createInstance(Class aClass) throws BaseException
	{
		try
		{
			return ProxyCaller.on(aClass).create().get();
		} catch (ProxyCallerException e)
		{
			throw new BaseException("ERR_OBJ_CREATE", "Unable to create class - '" + aClass.getName() + "'", e);
		}
	}

	/**
	 * This method creates an instance of the class with the arguments provided, if any. This will be successful only if
	 * the constructor of the class is public.
	 * 
	 * @param aClass The class to be created
	 * @param constructorArgs The arguments to be passed to the constructor
	 * @return The object created for the class
	 * @throws BaseException Thrown if any error occurs while creating the object
	 */
	public static Object createInstance(Class aClass, Object... constructorArgs) throws BaseException
	{
		try
		{
			return ProxyCaller.on(aClass).create(constructorArgs).get();
		} catch (ProxyCallerException e)
		{
			throw new BaseException("ERR_OBJ_CREATE", "Unable to create class - '" + aClass.getName() + "'", e);
		}
	}

	/**
	 * This method helps load a resource on a trial and error basis. It first tries to load the same from the classpath.
	 * In case that loading fails, then it tries to load the same from file system. If that also fails, then an
	 * exception is thrown
	 * 
	 * @param resourceName The resource name to load
	 * @return The InputSream having the resource content
	 * @throws BaseException Thrown if the resource is not found or if there is an error while loading the resource
	 */
	public static InputStream loadResource(String resourceName) throws BaseException
	{
		InputStream resourceStream = null;

		// Step 1: Try to load it from Classpath.
		try
		{
			resourceStream = loadResourceFromClassPath(resourceName);
		} catch (BaseException e)
		{
			// Okay, this means that the resource is not in class path. So check in file system
			try
			{
				resourceStream = loadResourceFromFilePath(resourceName);
			} catch (Exception e1)
			{
				// Okay. this means that even in file system, the resource is not present. So just thrown an exception
				throw new BaseException("ERR_INV_RES", "The resource provided '" + resourceName
						+ "' cannot be loaded from classpath as well as file system");
			}
		}

		return resourceStream;
	}

	/**
	 * This method loads a resource using the context class loader of the current thread.
	 * 
	 * @param resourceName The name of the resource to load. This has to follow the package naming conventions expected
	 *            by a ClassLoader when loading a resource
	 * @return The Resource as a stream
	 * @exception BaseException Thrown if any error occurs while loading the resource
	 */
	public static InputStream loadResourceFromClassPath(String resourceName) throws BaseException
	{
		ClassLoader currentLoader = Thread.currentThread().getContextClassLoader();
		return loadResourceFromClassPath(resourceName, currentLoader);
	}

	/**
	 * This method loads a resource using the given class loader.
	 * 
	 * @param resourceName The name of the resource to load. This has to follow the package naming conventions expected
	 *            by a ClassLoader when loading a resource
	 * @param aLoader The ClassLoader to be used for loading the resource
	 * @return The Resource as a stream
	 * @exception BaseException Thrown if any error occurs while loading the resource
	 */
	public static InputStream loadResourceFromClassPath(String resourceName, ClassLoader aLoader) throws BaseException
	{
		InputStream resourceStream = null;
		if (StringUtils.isEmpty(resourceName))
			throw new BaseException("ERR_ARG_EMPTY", "Resource Name to load cannot be null or empty");
		resourceStream = aLoader.getResourceAsStream(resourceName);

		if (resourceStream == null)
			throw new BaseException("ERR_INV_RES", "Resource provided '" + resourceName
					+ "' could not be loaded from class path. Is the classpath set correctly?");

		return resourceStream;
	}

	/**
	 * This method loads a resource from the file path and returns the same as a Stream
	 * 
	 * @param resourceName The name of the resource to load. The resource name is expected to be with full file path
	 * @return The Resource as a stream
	 * @exception BaseException Thrown if any error occurs while loading the resource
	 */
	public static InputStream loadResourceFromFilePath(String resourceName) throws BaseException
	{
		InputStream resourceStream = null;

		try
		{
			resourceStream = new FileInputStream(resourceName);
		} catch (FileNotFoundException e)
		{
			// This means that the resource cannot be found. So wrap into our exception
			throw new BaseException("ERR_INV_RES", "Resource provided '" + resourceName
					+ "' could not be loaded from file system. Is it a valid file?", e);
		}

		return resourceStream;
	}

	/**
	 * A no exception throwing option for closing the Stream provided. This is needed for cases
	 * <ul>
	 * <li>where we know that the stream used cannot throw errors while closing, but due to method signature we need to
	 * handle exception</li>
	 * <li>b) where we are not interested in handling exception</li>
	 * </ul>
	 * 
	 * In such cases, this method will be helpful as it eats any exceptions faced while closing the stream.
	 * 
	 * @param resourceStream The stream to be closed.
	 */
	public static void closeStream(InputStream resourceStream)
	{
		if (resourceStream != null)
		{
			try
			{
				resourceStream.close();
			} catch (IOException e)
			{
				// Nothing to do here. We are not interested in this exception. so ignore it
			}
		}
	}

}
