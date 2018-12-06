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
 * */

package com.intellectdesign.canvas.formdefinition.handler;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.constants.util.TIConstants;
import com.intellectdesign.canvas.constants.util.TRConstants;
import com.intellectdesign.canvas.data.conversion.util.JSONToHashMapConverter;
import com.intellectdesign.canvas.data.conversion.util.OnlineJSONToHashmapConverter;
import com.intellectdesign.canvas.exceptions.common.OnlineException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.exceptions.util.JSONConvertorException;
import com.intellectdesign.canvas.formdefinition.FormDefinitionConstants;
import com.intellectdesign.canvas.formdefinition.FormDefinitionException;
import com.intellectdesign.canvas.formdefinition.FormDefinitionInstruction;
import com.intellectdesign.canvas.formdefinition.FormManager;
import com.intellectdesign.canvas.formexport.framework.FormExportManager;
import com.intellectdesign.canvas.handler.SimpleRequestHandler;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.pref.date.DateFormatterManager;
import com.intellectdesign.canvas.properties.MessageManager;

/**
 * This class is responsible for handling requests from form definition request.
 * 
 * @version 1.0
 */
public class FormDefinitionRequestHandler extends SimpleRequestHandler
{
	private static final Logger LOGGER = Logger.getLogger(FormDefinitionRequestHandler.class);
	private static int VER_NO_POS = 16;
	private static int TXN_STATUS_POS = 15;
	private static String HASH_MAP_POSITION = "26";

	/**
	 * Default constructor
	 */
	public FormDefinitionRequestHandler()
	{
		LOGGER.ctdebug("CTFDF00016");
	}

	/**
	 * This method processes the user request.
	 * 
	 * @param obj - Class object containing the request for processing.
	 * @return reply - Class object containing the form meta data
	 * 
	 * @throws OnlineException
	 * 
	 * @see com.orbidirect.aps.handler.ODRequestHandler#onlineProcess(java.lang.Object)
	 * 
	 */
	@Override
	public ReplyObject processRequest(Vector inputVector) throws ProcessingErrorException
	{
		PerformanceTimer perfTimer = new PerformanceTimer();
		ReplyObject reply = null;
		// Get the action from the Vector and check whether it is one of the supported custom actions.
		String action = (String) inputVector.get(TIConstants.INPUT_ACTION_INDEX_IN_VECTOR);
		if (FormDefinitionConstants.ACTION_INIT_FORM_HEADER.equals(action))
		{
			perfTimer.startTimer("FormDefinitionRequestHandler.processInitializeFormHeaderRequest");
			reply = processInitializeFormHeaderRequest(inputVector);
		} else if (FormDefinitionConstants.ACTION_GET_ADDITIONAL_DATA.equals(action))
		{
			perfTimer.startTimer("FormDefinitionRequestHandler.processInitializeFormHeaderRequest");
			reply = processGetAdditionalDataForItem(inputVector);

		} else if (FormDefinitionConstants.ACTION_GET_FORM_EXPORT_HTML.equals(action))
		{
			perfTimer.startTimer("FormDefinitionRequestHandler.processGetFormHtml");
			reply = processGetFormHtml(inputVector);
		} else if (FormDefinitionConstants.ACTION_GET_FORM_EXPORT.equals(action))
		{
			perfTimer.startTimer("FormDefinitionRequestHandler.processGetFormMetaData");
			reply = processGetFormMetaData(inputVector);
		}
		perfTimer.endTimer();
		return reply;
	}

	/**
	 * This method gets the cached HashMap from InputVector. Same as getJSPHashMap method except that other transaction
	 * related data is also populated in the return HashMap.
	 * 
	 * @param inputVector - Vector object containing TI framework defined fields in positions ranging from 0 to 28+
	 * 
	 * @return Map - Cached HashMap with additional data from Vector
	 */
	protected static Map getAugmentedCachedHashMap(Vector inputVector)
	{
		HashMap map = getFieldsHashMapFromVector(inputVector);
		map.put(JSPIOConstants.INPUT_REFERENCE_NO, inputVector.get(TIConstants.REFERENCE_NO_POS));
		map.put(TRConstants.VER_NO, inputVector.get(VER_NO_POS));
		map.put(TIConstants.TXN_STATUS, inputVector.get(TXN_STATUS_POS));

		map.put(TIConstants.CHANNEL_ID, inputVector.get(10));

		return map;
	}

	/**
	 * This refactored method gets the jspfields hashmap from vector either from the 26th index in the vector, if not
	 * get from the last but one the position from the vector
	 * 
	 * @param inputVector - Vector object containing TI framework defined fields in positions ranging from 0 to 28+
	 * @return hashpmap - Cached HashMap with additional data from Vector
	 */
	private static HashMap getFieldsHashMapFromVector(Vector inputVector)
	{
		HashMap map = new HashMap();
		Object cachedHashMapObj = inputVector.get(Integer.parseInt(HASH_MAP_POSITION) + 1);
		if (cachedHashMapObj instanceof HashMap)
			map = (HashMap) cachedHashMapObj;
		else
		{
			cachedHashMapObj = inputVector.get(inputVector.size() + TIConstants.REL_CACHEDMAP_INDEX_IN_VECTOR);
			if (cachedHashMapObj instanceof HashMap)
				map = (HashMap) cachedHashMapObj;
		}
		return map;
	}

	/**
	 * The method is intended to call the FormManager for retrieving the meta data for a formId requested by the client.
	 * 
	 * @param inputVector - Vector object containing TI framework defined fields in positions ranging from 0 to 28+
	 * @return ReplyObject - Cached HashMap with form data from Vector
	 * 
	 */
	private ReplyObject processInitializeFormHeaderRequest(Vector inputVector)
	{
		HashMap headerMap = new HashMap();
		ExtReplyObject reply = null;

		LOGGER.ctdebug("CTFDF00017");
		// First read the necessary set of attributes from the input Vector.
		HashMap params = (HashMap) getAugmentedCachedHashMap(inputVector);
		UserValue userValue = getUserValue(params);
		String formId = (String) params.get(FormDefinitionConstants.FORM_ID);
		List formDefns = null;
		// If form Id is not provided, then thrown an error as this is needed for this action processing.
		if ((formId == null) || (formId.length() == 0))
			return getErrorReply(inputVector);

		FormManager formMgr = new FormManager();
		try
		{
			formDefns = formMgr.getFormDefinition(formId, params, userValue, true);
			headerMap.put("HEADER_FORM_METADATA", formDefns);

			// Now construct the reply Object.
			reply = new ExtReplyObject();
			reply.headerMap = headerMap;
			// Populate the last updated date / time into the reply object.
			populateLastUpdatedDateTimeInto(reply);
		} catch (FormDefinitionException fde)
		{
			LOGGER.cterror("CTFDF00018", fde, formId);
		}
		return reply;
	}

	/**
	 * This method is responsible for retrieving the meta data of the formId and item id requested by the client.
	 * 
	 * @param inputVector - Vector object containing TI framework defined fields in positions ranging from 0 to 28+
	 * @return ReplyObject - Cached HashMap with additional data from Vector
	 */
	private ReplyObject processGetAdditionalDataForItem(Vector inputVector)
	{
		HashMap headerMap = new HashMap();
		ExtReplyObject reply = null;

		LOGGER.ctdebug("CTFDF00019");
		// First read the necessary set of attributes from the input Vector.
		HashMap params = (HashMap) getAugmentedCachedHashMap(inputVector);
		UserValue userValue = getUserValue(params);
		String formId = (String) params.get(FormDefinitionConstants.FORM_ID);
		int itemCount = Integer.parseInt((String) params.get("ADD_DATA_ITEM_COUNT"));
		ArrayList itemIds = new ArrayList<String>();
		HashMap additionalDataMap = new HashMap();
		for (int i = 0; i < itemCount; i++)
		{
			itemIds.add(params.get("FIELD_" + i));
		}
		// If form Id is not provided, then thrown an error as this is needed for this action processing.
		if ((formId == null) || (formId.length() == 0) || (itemIds.size() == 0))
			return getErrorReply(inputVector);

		FormManager formMgr = new FormManager();
		try
		{
			additionalDataMap.put("additionalData",
					formMgr.getAdditionalDataForItem(formId, itemIds, params, userValue));
			headerMap.put("HEADER_FORM_METADATA", additionalDataMap);

			// Now construct the reply Object.
			reply = new ExtReplyObject();
			reply.headerMap = headerMap;
			// Populate the last updated date / time into the reply object.
			populateLastUpdatedDateTimeInto(reply);
		} catch (FormDefinitionException fde)
		{
			LOGGER.cterror("CTFDF00020", fde, formId);
		}
		return reply;
	}

	/**
	 * This is a helper method that creates a default error reply with predefined error codes
	 * 
	 * @param inputVector - Vector object containing TI framework defined fields in positions ranging from 0 to 28+
	 * @return reply - Cached Hashmap containing the Error Code and Message
	 */
	private ReplyObject getErrorReply(Vector inputVector)
	{
		String errorCode = FrameworkConstants.ERROR_SYSTEM_ERROR;
		ExtReplyObject reply = new ExtReplyObject();
		String prodCode = (String) inputVector.get(TIConstants.PROD_CODE_INDEX_IN_VECTOR);
		String strLocale = (String) inputVector.get(TIConstants.LANGID_INDEX_IN_VECTOR);
		// Construct the error message as per the local language preference of the user.
		String errorMessage = MessageManager.getMessage(prodCode.toLowerCase(), errorCode, strLocale);
		// Put the error code and message into the header map
		reply.headerMap = new HashMap();
		reply.headerMap.put(FrameworkConstants.KEY_ERROR_CODE, errorCode);
		reply.headerMap.put(FrameworkConstants.KEY_ERROR_MESSAGE, errorMessage);
		return reply;
	}

	/**
	 * This helper method populates the last updated date time into the header.
	 * 
	 * @param reply - ExtReplyObject that needs to update the date time
	 */

	private void populateLastUpdatedDateTimeInto(ExtReplyObject reply)
	{
		Date currentDate = new Date();
		String dateAsString = DateFormatterManager.getDateAndTimeString(
				FormDefinitionConstants.DEFAULT_DATE_TIME_FORMAT, currentDate);
		if (reply.headerMap == null)
			reply.headerMap = new HashMap();
		reply.headerMap.put(FormDefinitionConstants.HEADER_KEY_LAST_UPDATED_DATE_TIME, dateAsString);
	}

	/**
	 * This method populates the basic user information (including preferences) into the User value.
	 * 
	 * @param params - Hashmap of cached client data
	 * @return userValue - UserValue object with the updated user information
	 */
	private UserValue getUserValue(HashMap params)
	{
		UserValue userValue = new UserValue();
		userValue.setPrimaryGcif((String) params.get(TIConstants.GCIF));
		userValue.setUserNo((String) params.get(TIConstants.USER_NO));
		userValue.setLangId((String) params.get(TIConstants.LANGUAGE_ID));
		userValue.setDirection((String) params.get("LANG_DIRECTION"));
		return userValue;
	}

	/**
	 * This private method intended to return form metadata and form definition info
	 * 
	 * @param inputVector - Vector object containing TI framework defined fields in positions ranging from 0 to 28+
	 * @return config - Mapping of Form and Form item configuration detail
	 * 
	 * @throws JSONConvertorException
	 * @throws FormDefinitionException
	 */
	private Map getFormExportConfig(Vector inputVector) throws JSONConvertorException, FormDefinitionException
	{

		List formIds = null;
		List widgetIds = null;

		HashMap params = (HashMap) getAugmentedCachedHashMap(inputVector);
		UserValue userValue = getUserValue(params);
		userValue.setFIRST_NAME((String) ((Map) inputVector.get(TIConstants.VALUE_VECTOR_21)).get("FIELD_FIRST_NAME"));
		String sExportData = "";
		try
		{
			sExportData = new String(params.get("EXPORT_DATA").toString().getBytes("ISO-8859-1"), "UTF-8");
		} catch (Throwable e)
		{

		}
		Map widgetMapUrl = (Map) params.get("FORM_WIDGET_PATH");
		String exportFormat = (String) params.get("EXPORT_FORMAT");
		Map formData = null;
		Map formDefn = null;
		JSONToHashMapConverter converter = new OnlineJSONToHashmapConverter("dd/mm/yyyy");

		formData = converter.convert(sExportData);
		formIds = (List) formData.get("formIds");
		FormDefinitionInstruction formInstr = new FormDefinitionInstruction();
		formDefn = formInstr.getFormMetaDataForExport(formIds);
		widgetIds = (List) formData.get("widgetIds");

		Map config = new HashMap();
		config.put("FORM_WIDGET_PATH", widgetMapUrl);
		config.put("FORMIDS", formIds); // Form IDs
		config.put("WIDGETIDS", widgetIds); // Widget IDs
		config.put("FORMSCREENVIEW", formData); // Screen Metadata
		config.put("FORMDBVIEW", formDefn); // Form Definition -DB
		config.put("USERVALUE", userValue);
		config.put("EXPORT_FORMAT", exportFormat);

		return config;
	}

	/**
	 * The Method is used to get the FormMetaData
	 * 
	 * @param inputVector - Vector object containing TI framework defined fields in positions ranging from 0 to 28+
	 * @return ReplyObject - Cached HashMap with updated header date and time
	 */

	private ReplyObject processGetFormMetaData(Vector inputVector)
	{

		HashMap headerMap = new HashMap();
		ExtReplyObject reply = null;
		Map config;
		try
		{

			config = getFormExportConfig(inputVector);

			headerMap.put("FORM_METADATA", config);

			// Now construct the reply Object.
			reply = new ExtReplyObject();
			reply.headerMap = headerMap;
			// Populate the last updated date / time into the reply object.
			populateLastUpdatedDateTimeInto(reply);

		} catch (JSONConvertorException e)
		{
			reply = new ExtReplyObject();
			reply.headerMap = headerMap;
			LOGGER.cterror("CTFDF00021", e);

		} catch (FormDefinitionException fde)
		{
			reply = new ExtReplyObject();
			reply.headerMap = headerMap;
			LOGGER.cterror("CTFDF00021", fde);
		}
		return reply;
	}

	/**
	 * This method returns the HTML export content for the required Form
	 * 
	 * @param inputVector - Vector object containing TI framework defined fields in positions ranging from 0 to 28+
	 * @return ReplyObject - Cached HashMap of exported form content in HTML format
	 */
	private ReplyObject processGetFormHtml(Vector inputVector)
	{

		HashMap headerMap = new HashMap();
		ExtReplyObject reply = null;
		Map config;

		try
		{
			config = getFormExportConfig(inputVector);
			headerMap.put("CONFIG", config);

			FormExportManager fem = new FormExportManager();

			fem.initialize(config);

			String exportHtml = fem.getHtmlForTheForm();

			headerMap.put("FORM_HTML", exportHtml);

			headerMap.put("FORM_WIDGET_CLEANUP", fem.getExportUniqueIdList());

			headerMap.put("FORM_HEADER_TITLE", fem.getFormHeader());

			// Now construct the reply Object.
			reply = new ExtReplyObject();
			reply.headerMap = headerMap;
			// Populate the last updated date / time into the reply object.
			populateLastUpdatedDateTimeInto(reply);

		} catch (JSONConvertorException e)
		{
			reply = new ExtReplyObject();
			reply.headerMap = headerMap;
			LOGGER.cterror("CTFDF00021", e);

		} catch (FormDefinitionException fde)
		{
			reply = new ExtReplyObject();
			reply.headerMap = headerMap;
			LOGGER.cterror("CTFDF00021", fde);
		}
		return reply;
	}
}
