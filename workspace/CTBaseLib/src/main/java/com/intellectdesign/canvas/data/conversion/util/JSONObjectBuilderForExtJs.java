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
package com.intellectdesign.canvas.data.conversion.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.constants.listviews.ListViewConstants;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.initalizer.Log4jMDCInitializer;

/**
 * This class is for JSONObjectBuilder Containg ExtJs
 * 
 * @version 1.0
 */
public class JSONObjectBuilderForExtJs
{
	private static final Logger logger = Logger.getLogger(JSONObjectBuilderForExtJs.class);
	public static final String JSON_MAP = "JSON_MAP";

	/**
	 * Builds the HashMap which will then be converted as JSON String for Error messages.
	 * 
	 * @param message the Error message
	 * @return the Map object which represents the Error message JSON
	 */
	public static Map buildErrorMessageMap(String message)
	{
		HashMap jsonResponseMap = new HashMap();
		HashMap returnMap = new HashMap();

		if (message != null && !("".equals(message)))
		{
			HashMap errorMap = new HashMap();
			errorMap.put("FATAL_ERROR", message);
			errorMap.put("REQUEST_ID", new Log4jMDCInitializer().getCurrentRequestId());
			jsonResponseMap.put("response", errorMap);
			returnMap.put(JSON_MAP, jsonResponseMap);
		}
		return returnMap;
	}

	/**
	 * Builds the Validation Message map which will then be converted as JSON String for Validation error messages.
	 * 
	 * @param errorObjects the List of error messages
	 * @return the Map object which represents the Validation error message JSON
	 */
	public static Map buildValidationMessageMap(List errorObjects)
	{
		HashMap jsonResponseMap = new HashMap();
		HashMap returnMap = new HashMap();
		if (errorObjects != null)
		{
			HashMap errorMap = new HashMap();
			errorMap.put("VALIDATION_ERROR", errorObjects);
			jsonResponseMap.put("response", errorMap);
			returnMap.put(JSON_MAP, jsonResponseMap);
		}
		return returnMap;
	}

	/**
	 * Builds the HashMap object which will then be converted as JSON String for a Multi Widget Definition Header fetch
	 * request. These are converted as Map object by adding necessary attributes which is required for Ext-JS component
	 * to process.
	 * 
	 * This method expects two mandatory objects in the headerMap with the keys 1. "MULTI_WIDGET_MD" 2. "CHILD_WIDGETS"
	 * 
	 * @param reply ExtReplyObject
	 * @return the Map object which represents the List view Data.
	 * @throws ProcessingErrorException
	 */
	public void buildMultiWidgetDefinitionHeaderMap(ReplyObject reply) throws ProcessingErrorException
	{

		Map replyMap = retriveReplyMap(reply);
		HashMap jsonResponseMap = new HashMap();
		HashMap rowsMap = new HashMap();

		rowsMap.put(FrameworkConstants.HEADER_MULTI_WIDGET_METADATA,
				replyMap.get(FrameworkConstants.HEADER_MULTI_WIDGET_METADATA));
		rowsMap.put(FrameworkConstants.HEADER_MULTI_WIDGETS_CHILDREN,
				replyMap.get(FrameworkConstants.HEADER_MULTI_WIDGETS_CHILDREN));

		HashMap jsonValueMap = new HashMap();
		// Put the rowsMap in the map with the key "value" which is a mandatory attribute
		// for Ext-JS component to process.
		jsonValueMap.put("value", rowsMap);
		// Put the jsonValueMap in the map with the key "response" which is a mandatory
		// attribute for Ext-JS component to process.
		jsonResponseMap.put("response", jsonValueMap);
		// Put the jsonResponseMap in the headerMap of ReplyObject.
		// So that the data other than the required JSON conversion for
		// list view will be retained in the headerMap of reply object.
		replyMap.put(JSON_MAP, jsonResponseMap);
	}

	/**
	 * This API used to return headerMap from ReplyObject. First it will check given reply object and headerMap of that
	 * is null or not. if not returns headerMap object. else throws ProcessingErrorException
	 * 
	 * @param reply ReplyObject needs to check
	 * @throws ProcessingErrorException if given reply object or headerMap of reply object is null
	 */
	private static Map retriveReplyMap(ReplyObject reply) throws ProcessingErrorException
	{
		logger.ctinfo("CTBAS00044");
		Map returnHeaderMap = null;
		if (reply != null)
		{
			returnHeaderMap = ((ExtReplyObject) reply).headerMap;
			if (returnHeaderMap == null)
			{
				logger.ctdebug("CTBAS00010");
				throw new ProcessingErrorException("Error_ReplyMap_null", "HashMap in the reply object is null");
			}
		} else
		{
			logger.ctdebug("CTBAS00011");
			throw new ProcessingErrorException("Error_Reply_null", "Reply Object is null");
		}
		logger.ctinfo("CTBAS00045");
		return returnHeaderMap;
	}

	/**
	 * Builds the HashMap object which will then be converted as JSON String for a View Definition Header fetch request.
	 * These are converted as Map object by adding necessary attributes which is required for Ext-JS component to
	 * process.
	 * 
	 * This method expects two mandatory objects in the headerMap with the keys 1. "VIEW_MD"
	 * 
	 * The method searches for the following optional attribute to include from the header map 1. "VIEWS_LIST" 2.
	 * "CCY_LIST"
	 * 
	 * @param reply ExtReplyObject
	 * @return the Map object which represents the List view Data.
	 * @throws ProcessingErrorException
	 */
	public void buildViewDefinitionHeaderMap(ReplyObject reply) throws ProcessingErrorException
	{

		Map replyMap = retriveReplyMap(reply);
		HashMap jsonResponseMap = new HashMap();
		HashMap rowsMap = new HashMap();
		HashMap addMap = new HashMap();
		rowsMap.put(FrameworkConstants.HEADER_KEY_VIEW_METADATA,
				replyMap.get(FrameworkConstants.HEADER_KEY_VIEW_METADATA));
		if (replyMap.containsKey(FrameworkConstants.HEADER_KEY_VIEWS_LIST))
			rowsMap.put(FrameworkConstants.HEADER_KEY_VIEWS_LIST,
					replyMap.get(FrameworkConstants.HEADER_KEY_VIEWS_LIST));

		// Added for Context Menus
		if (replyMap.containsKey(FrameworkConstants.VIEW_CONTEXT_LIST))
			rowsMap.put(FrameworkConstants.VIEW_CONTEXT_LIST, replyMap.get(FrameworkConstants.VIEW_CONTEXT_LIST));

		if (replyMap.containsKey(FrameworkConstants.HEADER_KEY_REF_CCY_LIST))
			addMap.put(FrameworkConstants.HEADER_KEY_REF_CCY_LIST,
					replyMap.get(FrameworkConstants.HEADER_KEY_REF_CCY_LIST));
		if (replyMap.containsKey(FrameworkConstants.HEADER_KEY_REFERENCE_CCY))
			addMap.put(FrameworkConstants.HEADER_KEY_REFERENCE_CCY,
					replyMap.get(FrameworkConstants.HEADER_KEY_REFERENCE_CCY));

		rowsMap.put(FrameworkConstants.HEADER_KEY_VIEW_ADDITIONAL_META_DATA, addMap);

		HashMap jsonValueMap = new HashMap();
		// Put the rowsMap in the map with the key "value" which is a mandatory attribute
		// for Ext-JS component to process.
		jsonValueMap.put("value", rowsMap);
		// Put the jsonValueMap in the map with the key "response" which is a mandatory
		// attribute for Ext-JS component to process.
		jsonResponseMap.put("response", jsonValueMap);
		// Put the jsonResponseMap in the headerMap of ReplyObject.
		// So that the data other than the required JSON conversion for
		// list view will be retained in the headerMap of reply object.
		replyMap.put(JSON_MAP, jsonResponseMap);
	}

	/**
	 * Builds the HashMap object which will then be converted as JSON String for a View Definition Data fetch request.
	 * Retrieves the list of records and the TOTAL records from the headerMap as well as additional data that may be
	 * sent across from the handler. These are converted as Map object by adding necessary attributes which is required
	 * for Ext-JS component to process.
	 * 
	 * This method expects two mandatory objects in the headerMap with the keys 1. "VIEW_DATA" 2. "TOTAL_COUNT"
	 * 
	 * The method searches for the following optional attribute to include from the header map 1. ADDITIONAL_DATA
	 * 
	 * @param reply ExtReplyObject
	 * @return the Map object which represents the List view Data.
	 * @throws ProcessingErrorException
	 */
	public void buildViewDefinitionDataMap(ReplyObject reply) throws ProcessingErrorException
	{

		Map replyMap = retriveReplyMap(reply);
		HashMap jsonResponseMap = new HashMap();
		HashMap rowsMap = new HashMap();

		rowsMap.put(ListViewConstants.ALL_RECORDS, replyMap.get(FrameworkConstants.HEADER_KEY_VIEW_DATA));
		rowsMap.put(ListViewConstants.TOTAL_COUNT, replyMap.get(FrameworkConstants.HEADER_KEY_TOTAL_COUNT));
		if (replyMap.containsKey(FrameworkConstants.HEADER_KEY_ADDITIONAL_DATA))
		{
			if (replyMap.containsKey(FrameworkConstants.HEADER_KEY_LAST_UPDATED_DATE_TIME))
			{
				Map addMap = (HashMap) replyMap.get(FrameworkConstants.HEADER_KEY_ADDITIONAL_DATA);
				addMap.put(FrameworkConstants.HEADER_KEY_LAST_UPDATED_DATE_TIME,
						replyMap.get(FrameworkConstants.HEADER_KEY_LAST_UPDATED_DATE_TIME));
				rowsMap.put(ListViewConstants.ADDITIONAL_DATA, addMap);
			} else
			{
				rowsMap.put(ListViewConstants.ADDITIONAL_DATA,
						replyMap.get(FrameworkConstants.HEADER_KEY_ADDITIONAL_DATA));
			}
		}

		HashMap jsonValueMap = new HashMap();
		// Put the rowsMap in the map with the key "value" which is a mandatory attribute
		// for Ext-JS component to process.
		jsonValueMap.put("value", rowsMap);
		// Put the jsonValueMap in the map with the key "response" which is a mandatory
		// attribute for Ext-JS component to process.
		jsonResponseMap.put("response", jsonValueMap);
		// Put the jsonResponseMap in the headerMap of ReplyObject.
		// So that the data other than the required JSON conversion for
		// list view will be retained in the headerMap of reply object.
		replyMap.put(JSON_MAP, jsonResponseMap);
	}

	/**
	 * Gets the headerMap object from reply object, converts that map to JSON format and put converted JSON string value
	 * into replyMap with JSON_MAP key
	 * 
	 * @param reply ReplyObject instance from where headerMap could get.
	 * @throws ProcessingErrorException if given reply object or headerMap object of reply object found as null
	 */
	public static void buildFormResultMap(ReplyObject reply) throws ProcessingErrorException
	{
		logger.ctinfo("CTBAS00046");
		Map replyMap = new HashMap();
		replyMap.putAll(((ExtReplyObject) reply).headerMap);

		((ExtReplyObject) reply).headerMap.put(JSON_MAP, replyMap);
		logger.ctinfo("CTBAS00047", ((ExtReplyObject) reply).headerMap);
	}

	/**
	 * Builds the HashMap object which will then be converted as JSON String for meta data of form views.
	 */

	public void buildFormDefinitionHeaderMap(ReplyObject reply) throws ProcessingErrorException
	{
		/**
		 * This method for buildFormDefinitionHeaderMap Builds the HashMap object which will then be converted as JSON
		 * String for meta data of form views. * @param reply ReplyObject
		 * 
		 * @return the Map object which represents the jsonValueMap
		 * @throws ProcessingErrorException
		 */
		Map replyMap = retriveReplyMap(reply);
		HashMap jsonResponseMap = new HashMap();
		HashMap rowsMap = new HashMap();

		rowsMap.put("HEADER_FORM_METADATA", replyMap.get("HEADER_FORM_METADATA"));

		HashMap jsonValueMap = new HashMap();
		// Put the rowsMap in the map with the key "value" which is a mandatory attribute
		// for Ext-JS component to process.
		jsonValueMap.put("value", rowsMap);
		// Put the jsonValueMap in the map with the key "response" which is a mandatory
		// attribute for Ext-JS component to process.
		jsonResponseMap.put("response", jsonValueMap);
		// Put the jsonResponseMap in the headerMap of ReplyObject.
		// So that the data other than the required JSON conversion for
		// list view will be retained in the headerMap of reply object.
		replyMap.put(JSON_MAP, jsonResponseMap);
	}

	/**
	 * This method for buildFormDefinitionHeaderMap Builds the HashMap object which will then be converted as JSON
	 * String for meta data of form views. * @param reply ReplyObject
	 * 
	 * @return the Map object which represents the jsonValueMap
	 * @throws ProcessingErrorException
	 */
	public void buildFormContainerDefinitionHeaderMap(ReplyObject reply) throws ProcessingErrorException
	{

		Map replyMap = retriveReplyMap(reply);
		HashMap jsonResponseMap = new HashMap();
		HashMap rowsMap = new HashMap();

		rowsMap.put("HEADER_FORM_CONTAINER_METADATA", replyMap.get("HEADER_FORM_CONTAINER_METADATA"));

		HashMap jsonValueMap = new HashMap();
		// Put the rowsMap in the map with the key "value" which is a mandatory attribute
		// for Ext-JS component to process.
		jsonValueMap.put("value", rowsMap);
		// Put the jsonValueMap in the map with the key "response" which is a mandatory
		// attribute for Ext-JS component to process.
		jsonResponseMap.put("response", jsonValueMap);
		// Put the jsonResponseMap in the headerMap of ReplyObject.
		// So that the data other than the required JSON conversion for
		// list view will be retained in the headerMap of reply object.
		replyMap.put(JSON_MAP, jsonResponseMap);
	}

	/**
	 * This method for buildFormDefinitionHeaderMap Builds the HashMap object which will then be converted as JSON
	 * String for meta data of form views. * @param reply ReplyObject
	 * 
	 * @return the Map object which represents the jsonValueMap
	 * @throws ProcessingErrorException
	 */
	public void buildFileUploadHeaderMap(ReplyObject reply) throws ProcessingErrorException
	{

		Map replyMap = retriveReplyMap(reply);
		HashMap jsonResponseMap = new HashMap();
		jsonResponseMap.put("response", replyMap.get("FileData"));
		// Put the jsonResponseMap in the headerMap of ReplyObject.
		replyMap.put(JSON_MAP, jsonResponseMap);
	}

	/**
	 * This method for buildFormDefinitionHeaderMap Builds the HashMap object which will then be converted as JSON
	 * String for meta data of form views. * @param reply ReplyObject
	 * 
	 * @return the Map object which represents the jsonValueMap
	 * @throws ProcessingErrorException
	 */
	public void buildPictureProcessHeaderMap(ReplyObject reply) throws ProcessingErrorException
	{

		Map replyMap = retriveReplyMap(reply);
		HashMap jsonResponseMap = new HashMap();
		jsonResponseMap.put("response", replyMap.get("RESULT"));
		// Put the jsonResponseMap in the headerMap of ReplyObject.
		replyMap.put(JSON_MAP, jsonResponseMap);
	}

	/**
	 * Builds the HashMap object which will then be converted as JSON String for Alert Summary list view. Retrieves the
	 * list of records and the TOTAL records from the headerMap which will then be converted as Map object by adding
	 * necessary attributes which is required for Ext-JS component to process.
	 * 
	 * This method expects two mandatory objects in the headerMap with the keys 1. "ROWS" 2. "TOTAL_RECORDS"
	 * 
	 * @param reply ExtReplyObject
	 * @return the Map object which represents the List view Data.
	 * @throws ProcessingErrorException
	 */
	public static void buildAlertSummaryListViewMap(ReplyObject reply) throws ProcessingErrorException
	{

		Map replyMap = retriveReplyMap(reply);
		HashMap jsonResponseMap = new HashMap();
		HashMap rowsMap = new HashMap();
		// Retrieves the List of Records and put it in the Map with the key ListViewConstants.ALL_RECORDS
		/*
		 * if(replyMap.containsKey(ListViewConstants.UNREAD_COUNT)) rowsMap.put(ListViewConstants.UNREAD_COUNT,
		 * replyMap.get(ListViewConstants.UNREAD_COUNT));
		 */
		// rowsMap.put(ListViewConstants.ALL_RECORDS, replyMap.get(ListViewConstants.ALL_RECORDS));
		int totalCount = (Integer) ((HashMap) ((List) replyMap.get(ListViewConstants.TOTAL_COUNT)).get(0))
				.get("NUM_ALERTS");
		rowsMap.put(ListViewConstants.TOTAL_COUNT, totalCount);
		rowsMap.put(ListViewConstants.NOTIFICATION_COUNT, totalCount);
		rowsMap.put(ListViewConstants.MESSAGE_COUNT, totalCount);

		HashMap jsonValueMap = new HashMap();
		// Put the rowsMap in the map with the key "value" which is a mandatory attribute
		// for Ext-JS component to process.
		jsonValueMap.put("value", rowsMap);
		// Put the jsonValueMap in the map with the key "response" which is a mandatory
		// attribute for Ext-JS component to process.
		jsonResponseMap.put("response", jsonValueMap);
		// Put the jsonResponseMap in the headerMap of ReplyObject.
		// So that the data other than the required JSON conversion for
		// list view will be retained in the headerMap of reply object.
		replyMap.put(JSON_MAP, jsonResponseMap);
	}

}
