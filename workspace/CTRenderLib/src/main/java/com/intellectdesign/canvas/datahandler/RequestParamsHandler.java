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
package com.intellectdesign.canvas.datahandler;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.data.conversion.util.JSONToHashMapConverter;
import com.intellectdesign.canvas.data.conversion.util.OnlineJSONToHashmapConverter;
import com.intellectdesign.canvas.exceptions.util.JSONConvertorException;
import com.intellectdesign.canvas.logger.Logger;

/**
 * A utility class to convert the request params to a hashmap.
 * 
 * @version 1.0
 */
public class RequestParamsHandler
{
	private static Logger logger = Logger.getLogger(RequestParamsHandler.class);

	/**
	 * Gets All parameters & param values in the request as a Hashmap If the request has the COLL_SUPPORT_FLAG set to Y
	 * then this process is delegated to CollectionParamsToHashMapBuilder Refer the class
	 * CollectionParamsToHashMapBuilder for further details
	 * 
	 * @param req The request object of the JSP/servlet
	 * @return Hashmap of parameter-values
	 * @throws runTimeException
	 */
	public HashMap getParameterSet(HttpServletRequest req)
	{
		HashMap paramMap = new HashMap(11);
		try
		{
			String jsonFlag = req.getParameter(JSPIOConstants.JSON_TO_HASH_MAP_SUPPORT_FLAG);
			// if the request has to handle collection data then delegate it to the CollectionParamsToHashMapBuilder
			String collSuppFlg = req.getParameter(JSPIOConstants.COLL_SUPPORT_FLAG);
			if (collSuppFlg != null && collSuppFlg.equals("Y"))
			{
				paramMap = (HashMap) CollectionParamsToHashMapBuilder.getParameterSet(req);
			} else if (jsonFlag != null && !jsonFlag.trim().equals(""))
			{
				paramMap = jsonReqParamsHandler(req, jsonFlag);
			} else
			{
				defaultReqParametersHandler(req, paramMap);
			}
		} catch (Throwable athrowable)
		{
			// even though it is not advisable to catch a throwable
			// we are doing it here because conversion of parameters to datamap is a crucial step
			// for all further application processing.
			logger.cterror("CTRND00031");
			logger.cterror("CTRND00032", athrowable);
			throw new RuntimeException("Parameter Processing Failed.", athrowable);
		}
		return paramMap;
	}

	/**
	 * JSON Request Params handler
	 * 
	 * @param req
	 * 
	 * @param jsonField, the field in the request which has data in JSON format
	 * @return the converted Map
	 * @throws JSONConvertorException
	 */
	private HashMap jsonReqParamsHandler(HttpServletRequest req, String jsonField) throws JSONConvertorException
	{
		JSONToHashMapConverter converter = new OnlineJSONToHashmapConverter("dd/mm/yyyy");
		String jsonStr = req.getParameter(jsonField);
		HashMap map = converter.convert(jsonStr);
		defaultReqParametersHandler(req, map);
		// clean up since this field is already converted as a map
		map.remove(jsonField);
		return map;
	}

	/**
	 * Default request params to map conversion routine
	 * 
	 * @param req
	 * @param pmap
	 */
	private void defaultReqParametersHandler(HttpServletRequest req, Map pmap)
	{
		Enumeration paramSet = req.getParameterNames();
		while (paramSet.hasMoreElements())
		{
			String paramName = (String) paramSet.nextElement();
			performTypeHandlingFor(paramName, req, pmap);
		}
	}

	/**
	 * Performs the typebased handling on the paramname's value in the request object
	 * 
	 * @param paramname
	 * @param request
	 * @param dataMap, the datamap into which the paramname and value are placed
	 * @return String , typically the formatted value for the corresponding type.
	 * 
	 */
	private void performTypeHandlingFor(String paramname, HttpServletRequest request, Map dataMap)
	{
		String value = ParamValueTypeHandler.performTypeHandlingFor(paramname, request);
		String key = ParamValueTypeHandler.getOnlyKeyFrom(paramname);
		checkAndAddParamKeyValueToMap(key, value, dataMap);
	}

	/**
	 * A utility method which checks if the paramvalue is -1, if it is then it does not adds it to the map
	 * 
	 * @param paramName
	 * @param paramValue
	 * @param dataMap
	 */
	private void checkAndAddParamKeyValueToMap(String paramName, Object paramValue, Map dataMap)
	{
		if (paramValue instanceof List)// if value is a list type just add
			dataMap.put(paramName, paramValue);
		else
		// else assuming its a string
		{
			String pValue = (String) paramValue;
			if (pValue != null && !"-1".equals(pValue))
				dataMap.put(paramName, pValue);
		}
		logger.ctdebug("CTRND00033", paramName, (paramValue == null ? "null" : paramValue));
	}

}
