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

package com.intellectdesign.canvas.properties;

import java.util.Enumeration;
import java.util.Iterator;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.ResourceBundle;
import java.util.Set;

/**
 * An implementation of the Resource bundle for the Canvas platform that is used for the default bundles used by the
 * platform
 * 
 * @version 1.0
 */
public class CanvasResourceBundle extends ResourceBundle
{
	private Map<String, Object> bundleData = null;

	/**
	 * The default constructor
	 * 
	 * @param data
	 */
	public CanvasResourceBundle(Map<String, Object> data)
	{
		bundleData = data;
	}

	/**
	 * This method returns the keys
	 * 
	 * @return Enumeration
	 * @see java.util.ResourceBundle#getKeys()
	 */
	@Override
	public Enumeration<String> getKeys()
	{
		ResourceBundle myparent = this.parent;
		return new CanvasBundleEnumeration(bundleData.keySet(), (myparent != null) ? myparent.getKeys() : null);
	}

	/**
	 * Gets the value for the given key
	 * 
	 * @param key The key for which value is to be fetched
	 * @return The value for the key provided
	 * @see java.util.ResourceBundle#handleGetObject(java.lang.String)
	 */
	@Override
	protected Object handleGetObject(String key)
	{
		if (key == null)
		{
			throw new NullPointerException();
		}
		return bundleData.get(key);
	}

	/**
	 * The enumeration to be used with this bundle. The code is kept similar to sun.util.ResourceBundleEnumeration
	 * 
	 * @Version 1.0
	 */
	class CanvasBundleEnumeration implements Enumeration
	{

		Set set;
		Iterator iterator;
		Enumeration enumeration;
		String next;

		/***
		 * This method performs the Enumeration of Canvas Bundles
		 * 
		 * @param set1
		 * @param enumeration1
		 */
		public CanvasBundleEnumeration(Set set1, Enumeration enumeration1)
		{
			next = null;
			set = set1;
			iterator = set1.iterator();
			enumeration = enumeration1;
		}

		public boolean hasMoreElements()
		{
			if (next == null)
			{
				if (iterator.hasNext())
				{
					next = (String) iterator.next();
				} else if (enumeration != null)
				{
					do
					{
						if (next != null || !enumeration.hasMoreElements())
						{
							break;
						}
						next = (String) enumeration.nextElement();
						if (set.contains(next))
						{
							next = null;
						}
					} while (true);
				}
			}
			return next != null;
		}

		/**
		 * This method returns String of value next if next element is available.
		 * 
		 * @return String next if next element is available.
		 */
		private String nextElementImpl()
		{
			if (hasMoreElements())
			{
				String s = next;
				next = null;
				return s;
			} else
			{
				throw new NoSuchElementException();
			}
		}

		/**
		 * This method calls the method nextElementImpl() to find if next element is available.
		 * 
		 * @return object
		 * @see java.util.Enumeration#nextElement()
		 */
		public Object nextElement()
		{
			return nextElementImpl();
		}
	}

}
