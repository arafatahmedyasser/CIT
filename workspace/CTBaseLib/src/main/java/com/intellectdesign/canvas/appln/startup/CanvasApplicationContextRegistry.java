/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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

import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;

/**
 * This is the central registry that is updated by the CanvasApplicationStartupListener for all the application contexts
 * that have been started using Canvas as its underlying framework. This is used within the configuration manager
 * framework as well as within the various modules of Canvas that require a central (read application specific) place
 * for handling the application specific needs.
 */
public final class CanvasApplicationContextRegistry
{
	private Map<String, ServletContext> contextMap;
	private static final CanvasApplicationContextRegistry _instance = new CanvasApplicationContextRegistry();

	/**
	 * Default constructor.
	 */
	private CanvasApplicationContextRegistry()
	{
		contextMap = new HashMap<String, ServletContext>();
	}

	/**
	 * Returns the singleton instance of this class
	 * 
	 * @return
	 */
	public static CanvasApplicationContextRegistry getInstance()
	{
		return _instance;
	}

	/**
	 * This method should be invoked to register a context into this registry.
	 * 
	 * @param context The context to be registered.
	 * @exception IllegalArgumentException Thrown if the context provided is null.
	 */
	public void registerContext(ServletContext context)
	{
		if (context == null)
			throw new IllegalArgumentException("'context' cannot be empty");
		String contextRoot = context.getContextPath();
		contextMap.put(contextRoot, context);
	}

	/**
	 * This method should be invoked to unregister a context from this registry
	 * 
	 * @param context The context to be unregistered
	 * @exception IllegalArgumentException Thrown if the context provided is null.
	 */
	public void unregisterContext(ServletContext context)
	{
		if (context == null)
			throw new IllegalArgumentException("'context' cannot be empty");
		String contextRoot = context.getContextPath();
		contextMap.remove(contextRoot);
	}

	/**
	 * This method returns the context corresponding to the context root.
	 * 
	 * @param contextRoot The context root
	 * @return The ServletContext corresponding to the context root provided.
	 */
	public ServletContext getContext(String contextRoot)
	{
		return contextMap.get(contextRoot);
	}

}
