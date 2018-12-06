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

package com.intellectdesign.canvas.ehcache.impl;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;

import net.sf.ehcache.Ehcache;
import net.sf.ehcache.search.Attribute;

/**
 * This is the factory class used to instantiate the attribute class for that column according to the data type of that
 * column.
 * 
 * @version 1.0
 */
public class CBXAttributeFactory
{
	private static CBXAttributeFactory attributeFactory = new CBXAttributeFactory();

	private static final String ehCacheString = "String";
	private static final String ehCacheFloat = "Float";
	private static final String ehCacheInteger = "Integer";
	private static final String ehCacheDate = "Date";
	private static final String ehCacheBoolean = "Boolean";
	private static final String ehCacheBigDecimal = "BigDecimal";

	// The Variable which has the mapping of
	// Left side With VDF Column data types and right side with Ehcache data
	// types
	/**
	 * this metod is ref to hashmap values
	 * 
	 * @param String
	 */
	private static final HashMap<String, String> colType = new HashMap<String, String>()
	{
		private static final long serialVersionUID = 1L;
		{
			put("string", "String");
			put("float", "BigDecimal");
			put("eqamt", "BigDecimal");
			put("numstr", "Integer");
			put("rate", "BigDecimal");
			put("number", "Integer");
			put("eqccy", "String");
			put("date", "Date");
			put("int", "Integer");
			put("time", "Date");
			put("boolcheck", "Boolean");
		}
	};

	/**
	 * Private constructor to disable the developer to intantiate the class directly
	 */
	private CBXAttributeFactory()
	{

	}

	/**
	 * Made the class as Singleton, So that it is intialized only once
	 * 
	 * @return this class refernce
	 */

	public static CBXAttributeFactory getInstance()
	{
		return attributeFactory;
	}

	/**
	 * This method is used create an attribute based on the datatype of the column. This attributes generics help the
	 * ehcache to understand what type of column and do sorting and filtering according to that.
	 * 
	 * @param Ehcache cache
	 * @param String columnId
	 * @param String dataType
	 * @return Attribute
	 */
	public Attribute<?> createAttribute(Ehcache cache, String columnId, String dataType)
	{
		if (ehCacheString.equals(colType.get(dataType))) // String
		{
			Attribute<String> attribute = cache.getSearchAttribute(columnId);
			return attribute;
		} else if (ehCacheFloat.equals(colType.get(dataType))) // Float
		{

			Attribute<Float> attribute = cache.getSearchAttribute(columnId);
			return attribute;
		} else if (ehCacheInteger.equals(colType.get(dataType))) // Integer
		{
			Attribute<Integer> attribute = cache.getSearchAttribute(columnId);
			return attribute;

		} else if (ehCacheDate.equals(colType.get(dataType))) // Date
		{
			Attribute<Date> attribute = cache.getSearchAttribute(columnId);
			return attribute;

		} else if (ehCacheBoolean.equals(colType.get(dataType))) // Boolean
		{
			Attribute<Boolean> attribute = cache.getSearchAttribute(columnId);
			return attribute;

		} else if (ehCacheBigDecimal.equals(colType.get(dataType))) // Big Decimal
		{
			Attribute<BigDecimal> attribute = cache.getSearchAttribute(columnId);
			return attribute;

		} else
		{
			Attribute<?> attribute = cache.getSearchAttribute(columnId);
			return attribute;
		}
	}
}
