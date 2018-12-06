/***************************************************************
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 *****************************************************************/

package com.intellectdesign.canvas.datahandler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.utility.CTUtility;

/**
 * Utility Class to handle params representing a collection of data and converting them to a hashmap-list-hashmap...
 * data This builder works on some assumptions which are to be followed by the corresponding html/jsp file which seeks
 * collection support The first golden rule is that None of the application key string which are to be used by the
 * action/handler should contain the $ character. This builder extensively relies on the $ character to parse the
 * incoming param. The second golden rule is to set a flag COLL_SUPPORT_FLAG in the request param if you want this class
 * to handle the request parameters as collections
 * 
 * The fundamental principle behind the CollectionParamsToHashMapBuilder is that in a collection (table) of data, every
 * cell is mapped to a unique param. in html terms, each cell in a collection (table) data is given a unique field
 * (hidden,if reqd). The unique field should be formed with the help of the $ symbol.
 * 
 * This is then used to construct a java hashmap.
 * 
 * If an element (table) is identifed to be a collection then the element's name should end with and only with _$$ and
 * the value of this element should contain comma separated keys representing each row of the collection hence these
 * individual elements by themselves should be a) unique and b) should end with _$$ because they represent 1 row of data
 * which is a collection of key-value pairs uniqueness should be identified by following simple number sequence prefixed
 * with _$
 * 
 * Now each of the row elements will have another entry in the param name whose values would be list of columns for that
 * collection and these individual columns should be unique as they are unique for that row.
 * 
 * Then the value for the individual cell is stored in the above unique cell param.
 * 
 * In a null shell, _$$ represents collection data, _$n_$$ represents 1 row of data _$n represents 1 cell in the data
 * 
 * Additionally datatype support is also included with this support, this is achieved by appending $x to the cell param
 * where x represents a type. As of now, this class support date and amount type which are represented by characters 'A'
 * and 'D'
 * 
 * if a cell is associated with a type, then the value for that is cell is given to the corresponding type handler who
 * can do whatever he wants to do with the value. As of now, the date and amount type handlers format the date and
 * amount to a standard format.
 * 
 * Example: If there is a collection name Codes which has two columns Code, Description and let us say there are 2 rows
 * in the collection whose values are code1,value1 and code2,value2, then the request params should be in the following
 * pattern paramname paramvalue CODES_$$ CODE_ROW_$1_$$,CODE_ROW_$2_$$ CODE_ROW_$1_$$ CODE_$1,DESCRIPTION_$1
 * CODE_ROW_$2_$$ CODE_$2,DESCRIPTION_$2 CODE_$1 code1 DESCRIPTION_$1 value1 CODE_$2 code2 DESCRIPTION_$2 value2
 * 
 * To the above example if the Codes has another column by name Date and if the date requires some type handling then
 * the paramname-value would look like
 * 
 * paramname paramvalue CODES_$$ CODE_ROW_$1_$$,CODE_ROW_$2_$$ CODE_ROW_$1_$$ CODE_$1,DESCRIPTION_$1,DATE_$1$D
 * CODE_ROW_$2_$$ CODE_$2,DESCRIPTION_$2,DATE_$2$D CODE_$1 code1 DESCRIPTION_$1 value1 CODE_$2 code2 DESCRIPTION_$2
 * value2 DATE_$1$D somedatevalue1 DATE_$2$D somedatevalue2
 * 
 * The constructed hashmap object for the above param-value input would be HashMap-Key HashMap-Value CODES arraylist[0]:
 * hashmapkey hashmapvalue CODE code1 VALUE value1 DATE somedatevalue1 arraylist[1]: hashmapkey hashmapvalue CODE code1
 * VALUE value1 DATE somedatevalue1
 * 
 * Notice here that the row identier dont participate in the hashmap and they need not as well, as they are only used to
 * identify unique rows in the html collection data Also, Notice that the keys that are used in the hashmap are nothing
 * but the ones used in the paramnames but without the _$$ or _$n
 * 
 * This builder accepts a httpservletrequest object and uses it to retrieve the parameter names and values and builds a
 * hashmap out of it.
 * 
 * Note: This builder has the capability of supporting n-depth hierarchy, i.e hashmap-list-hashmap-list to any levels
 * 
 * AS LONG AS THE INPUT PARAMNAMES AND VALUES ARE IN THE FORMAT AS SPECIFIED ABOVE, WHEREBY I CAN UNIQUELY IDENTIFY
 * EVERY CELL IN THE DATA COLLECTION THIS BUILDER WOULD CREATE A HASHMAP DATA AS MENTIONED ABOVE.
 * 
 * @version 1.0
 */
public class CollectionParamsToHashMapBuilder
{
	/**
	 * The starting point for the builder. Given a request objects, it returns hashmap representing the
	 * paramnames/values of the request
	 * 
	 * @param request , a httprequestobject which contains the paramname/values in the collection format
	 * @return Map, the build data from the paramnames and values
	 */
	public static Map getParameterSet(HttpServletRequest request)
	{
		Map returnMap = new HashMap();
		Map parameterMap = request.getParameterMap();
		Iterator pkeys = parameterMap.keySet().iterator();
		// iterate through all param keys
		while (pkeys.hasNext())
		{
			String akey = (String) pkeys.next();
			logger.ctdebug("CTRND00017", akey);
			if (isCollectionTypeRelated(akey))// i.e if param_name is of the pattern _$n_$$ (or) _$n
			{
				logger.ctdebug("CTRND00018", akey);
				// dont do anything as it is either already done or it would be taken care of later
				continue;
			} else if (isRootCollectionType(akey))// i.e if the paramname is of the pattern _$$ only
			{
				logger.ctdebug("CTRND00019", akey);
				List alist = getList(akey, request);
				returnMap.put(getOnlyKeyFrom(akey), alist);// remove the _$$ from the key
			} else
			{
				logger.ctdebug("CTRND00020", akey);
				// this is the case where the paramname is a regular paramname without any $ or has _$x
				String value = ParamValueTypeHandler.performTypeHandlingFor(akey, request);
				akey = ParamValueTypeHandler.getOnlyKeyFrom(akey);
				CTUtility.checkAndAddParamKeyValueToMap(akey, value, returnMap);
			}
		}
		logger.ctdebug("CTRND00021", returnMap);
		return returnMap;
	}

	/**
	 * This method returns a list of rows for the paramName it uses the sister method getMap to construct the individual
	 * rows.
	 * 
	 * @param paramName
	 * @param request
	 * @return a list of rows for the paramName
	 */
	private static List getList(String paramName, HttpServletRequest request)
	{
		logger.ctdebug("CTRND00022", paramName);
		List alist = new ArrayList();
		String paramValues = request.getParameter(paramName);
		String[] paramNames = CTUtility.getCommaSeparatedList(paramValues);
		if (paramNames != null && paramNames.length > 0)
		{
			Map aMap;
			for (int index = 0; index < paramNames.length; index++)
			{
				aMap = getMap(paramNames[index], request);
				alist.add(aMap);
			}
		}
		return alist;
	}

	/**
	 * this method constructs a map of key value pairs it uses the request object to retrieve the param names and values
	 * if the param by itself is a collection it calls its sister method getList() to get the collection by this way,
	 * this supports for n-depth of the hashmaps-list-hashmap
	 * 
	 * @param paramName
	 * @param request
	 * @return a constructed hashmap for the paramName
	 */
	private static Map getMap(String paramName, HttpServletRequest request)
	{
		logger.ctdebug("CTRND00023", paramName);
		Map returnMap = new HashMap();
		String paramValues = request.getParameter(paramName);
		String[] paramNames = CTUtility.getCommaSeparatedList(paramValues);
		Object value;
		if (paramNames != null && paramNames.length > 0)
		{
			for (int index = 0; index < paramNames.length; index++)
			{
				if (isCollectionWithinCollectionType(paramNames[index]))
					value = getList(paramNames[index], request);
				else
				{
					value = ParamValueTypeHandler.performTypeHandlingFor(paramNames[index], request);
				}

				String pkey = getOnlyKeyFrom(paramNames[index]);
				CTUtility.checkAndAddParamKeyValueToMap(pkey, value, returnMap);
			}
		}
		return returnMap;
	}

	/**
	 * A root collection type is one which ends with one and only _$$ this api returns true if the paramName matches
	 * this pattern, false otherwise
	 * 
	 * @param paramName
	 * @return returns true if the paramName matches this pattern, false otherwise
	 */
	private static boolean isRootCollectionType(String paramName)
	{
		int collIdentIndex = paramName.indexOf(COLLECTION_IDENTIFIER);
		// if the key doesnt have a $ then return false
		if (collIdentIndex == -1)
			return false;
		else
			return (ROOT_COLLECTION_IDENTIFIER.equals(paramName.substring(paramName.indexOf(COLLECTION_IDENTIFIER))));
	}

	/**
	 * Check if the paramName is of the form CODE_$n_$$
	 * 
	 * @param paramName
	 * @return true, if the paramName is of the form CODE_$n_$$, false otherwise
	 */
	private static boolean isCollectionWithinCollectionType(String paramName)
	{
		return (!isRootCollectionType(paramName) && paramName.endsWith(ROOT_COLLECTION_IDENTIFIER));
	}

	/**
	 * Retrieves only the key portion from the param, ex: if param is CODE_$1, then this method returns CODE if param is
	 * CODES_$1_$$, then this method returns CODES if paramName does not have a _$ then it returns the paramkey as is.
	 * 
	 * @param aparamkey
	 * @return returns only the key portion of param name
	 */
	private static String getOnlyKeyFrom(String aparamkey)
	{
		int childCollectionIndex = aparamkey.indexOf(COLLECTION_IDENTIFIER);
		if (childCollectionIndex == -1)
			return aparamkey;
		else
			return aparamkey.substring(0, childCollectionIndex);
	}

	/**
	 * This method returns true if the paramname is in either _$n_$$ or _$n pattern else it returns false, i.e if there
	 * is no $, or it has only _$$
	 * 
	 * @param paramName the paramName to be parsed
	 * @return true if the paramname is in either _$n_$$ or _$n pattern, false otherwise
	 */
	private static boolean isCollectionTypeRelated(String paramName)
	{
		int rootCollectionindex = -1;
		int childCollectionindex = -1;
		childCollectionindex = paramName.indexOf(COLLECTION_IDENTIFIER);
		// if the key doesnt have a $ then return false
		if (childCollectionindex == -1)
			return false;
		else
		{
			// if the key does not have _$$ then return true
			rootCollectionindex = paramName.indexOf(ROOT_COLLECTION_IDENTIFIER);
			if (rootCollectionindex == -1) // means it has only $ but no $$
				return true;
			else if (isRootCollectionType(paramName))// means it has only $$
				return false;
			else
				// means it has both $1 and $$
				return true;
		}
	}

	// Constants definition
	// Root collection identifier
	public static final String ROOT_COLLECTION_IDENTIFIER = "_$$";
	// Child collection identifier
	public static final String COLLECTION_IDENTIFIER = "_$";

	// Logger object
	private static final Logger logger = Logger.getLogger(CollectionParamsToHashMapBuilder.class);

}
