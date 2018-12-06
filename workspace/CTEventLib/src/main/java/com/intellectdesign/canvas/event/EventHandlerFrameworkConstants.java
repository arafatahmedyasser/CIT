/*************************************************************************
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
 *************************************************************************/

package com.intellectdesign.canvas.event;

import java.util.HashMap;
import java.util.Map;

import com.intellectdesign.canvas.utils.StringUtils;
import com.intellectdesign.canvas.value.CanvasRequestVO;

/**
 * This class contains the constants for EventHandler Framework
 * 
 * @version 1.0
 */
public class EventHandlerFrameworkConstants
{
	/**
	 * Dummy private constructor to ensure that an object of this class can never be created,
	 */
	private EventHandlerFrameworkConstants()
	{

	}

	/**
	 * This is a utility method for retrieving the mandatory information from the request into a Map structure that is
	 * needed for the event to pass on to the handlers
	 * 
	 * @param request The request
	 * @param anEvent The event that is going to be raised
	 * @param referenceNo The reference number for this event
	 * @return The mandatory data needed for the event from the request
	 */
	public static Map getEventMandatoryDataFrom(CanvasRequestVO request, Event anEvent, String referenceNo)
	{
		HashMap mandatoryData = new HashMap();
		CanvasRequestVO.SessionContext sessContext = request.getSessionContext();
		CanvasRequestVO.UserContext userContext = request.getUserContext();
		Map requestData = request.getRequestData();

		mandatoryData.put(FLD_USER_NO, userContext.getUserNumber());
		mandatoryData.put(FLD_GCIF, userContext.getCurrentGCIF());
		mandatoryData.put(FLD_LOGIN_ID, userContext.getLoginId());
		mandatoryData.put(FLD_PARENT_GCIF, userContext.getCurrentGCIF());

		mandatoryData.put(FLD_TRAN_REF_NO, StringUtils.ensureExists(referenceNo, request.getReferenceNumber()));
		mandatoryData.put(FLD_REFERENCE_NO, StringUtils.ensureExists(referenceNo, request.getReferenceNumber()));
		mandatoryData.put(FLD_UNIQUE_REF_NO, StringUtils.ensureExists(referenceNo, request.getReferenceNumber()));
		mandatoryData.put(FLD_REFERENCE_KEY, StringUtils.ensureExists(referenceNo, request.getReferenceNumber()));
		mandatoryData.put(FLD_PROD_CODE, request.getProductCode());
		mandatoryData.put(FLD_SUB_PROD_CODE, request.getSubProductCode());
		mandatoryData.put(FLD_FUNC_CODE, request.getFunctionCode());
		mandatoryData.put(FLD_TRAN_TYPE, request.getFunctionCode());
		mandatoryData.put(FLD_APP_SERVER_IP, request.getAppServerIP());
		mandatoryData.put(FLD_WEB_SERVER_IP, request.getWebServerIP());
		mandatoryData.put(REQUEST_ID, request.getRequestId());
		mandatoryData.put(REQUEST_URI, request.getRequestURI());

		mandatoryData.put(EVENT_ID, anEvent.getEventId());

		mandatoryData.put(FLD_SESSION_ID, sessContext.getSessionId());
		mandatoryData.put(FLD_CHANNEL_ID, sessContext.getChannelId());
		mandatoryData.put(FLD_BROWSER, sessContext.getBrowserName());
		mandatoryData.put(FLD_OS_NAME, sessContext.getOsName());
		mandatoryData.put(FLD_CLIENT_IP, sessContext.getRequestingClientIP());
		mandatoryData.put(FLD_SIMULATION_MODE, sessContext.isSimulated());
		mandatoryData.put(FLD_SIMULATION_USERID, sessContext.getSimulatingUserLoginId());
		// TODO: Need to check if the Device type is the device band id.
		mandatoryData.put(DEVICE_BAND_ID, sessContext.getDeviceType());
		mandatoryData.put(USER_AGENT, sessContext.getUserAgent());

		String[] keysToCopy = new String[]
		{ OLD_REFERENCE_NUMBER, WORKSPACE_ID, LAYOUT_ID, WIDGET_ID, GEO_LOCATION, UDF1, UDF2, UDF3, UDF4, UDF5, UDF6, UDF7, UDF8, UDF9, UDF10 };
		for (String aKey : keysToCopy)
			mandatoryData.put(aKey, requestData.get(aKey));

		return mandatoryData;
	}

	// DB Related Constants
	public static final String EVENT_HANDLER_DAM_KEY = "EVENT_HANDLER_FRMWRK_MNT";
	public static final String EVENT_EXT_GET_HANDLER_DTLS = "EVENT_EXT_GET_HANDLER_DTLS";
	public static final String EVENT_EXT_GET_ALL_HANDLER_DTLS = "EVENT_EXT_GET_ALL_HANDLER_DTLS";
	// For DB cache
	public static final String EVENTS = "EVENTS";

	// EventHandler properties related constants
	public static final String HANDLER_ID = "HANDLER_ID";
	public static final String HANDLER_DESC = "HANDLER_DESC";
	public static final String HANDLER_CLASS = "HANDLER_CLASS";
	public static final String PRIORITY = "PRIORITY";
	public static final String SYNCHRONIZED = "SYNCHRONIZED";
	public static final String IGNORE_EXCEPTIONS = "IGNORE_EXCEPTION";
	public static final String OLD_VALUES_REQUIRED = "OLD_VALUES_REQUIRED";

	// Login
	public static final String FLD_INVALID_ATPT = "INVALID_ATPT";
	public static final String FLD_LOGIN_DATE = "LOGIN_DATE";
	public static final String FLD_LAST_LOGIN_DATE = "LAST_LOGIN_DATE";
	public static final String FLD_OS_NAME = "OS_NAME";

	// Event related constants
	public static final String EVENT_ID = "EVENT_ID";
	public static final String HANDLER_LIST = "HANDLER_LIST";

	// Error Codes
	public static final String ERR_EVENT_DB_EX = "ERR_EVENT_DB_EX";
	public static final String ERR_EVENT_CLASS_EX = "ERR_EVENT_CLASS_EX";
	public static final String ERR_EVENT_INST_EX = "ERR_EVENT_INST_EX";
	public static final String ERR_EVENT_ILL_ACCESS_EX = "ERR_EVENT_ILL_ACCESS_EX";
	public static final String ERR_EVENT_HANDLERS_NULL = "ERR_EVENT_HANDLERS_NULL";

	// Flag Values
	public static final String FLG_YES = "Y";
	public static final String FLG_NO = "N";

	// Event Handler standard Fields list.
	public static final String FLD_LOGIN_ID = "LOGIN_ID";
	public static final String FLD_USER_NO = "USER_NO";
	public static final String FLD_GCIF = "GCIF";
	public static final String FLD_PARENT_GCIF = "PARENT_GCIF";
	public static final String FLD_APP_SERVER_IP = "APP_SERVER_IP";
	public static final String FLD_WEB_SERVER_IP = "WEB_SERVER_IP";
	public static final String FLD_CLIENT_IP = "CLIENT_IP";
	public static final String FLD_REFERENCE_NO = "REFERENCE_NO";
	public static final String FLD_SIMULATION_MODE = "SIMULATION_MODE";
	public static final String FLD_BROWSER = "CLIENT_BROWSER";
	public static final String FLD_SESSION_ID = "SESSION_ID";
	public static final String FLD_PROD_CODE = "PRODUCT_CODE";
	public static final String FLD_SUB_PROD_CODE = "SUB_PRODUCT_CODE";
	public static final String FLD_FUNC_CODE = "FUNCTION_CODE";
	public static final String FLD_TRAN_REF_NO = "TRAN_REF_NO";
	public static final String FLD_TRAN_TYPE = "TRAN_TYPE";
	public static final String FLD_RECIPIENTS_KEY = "RECIPIENTS";
	public static final String FLD_SENDER_KEY = "SENDER";
	public static final String FLD_LOCALE_KEY = "LOCALE";
	public static final String FLD_ALERT_DATA_MAP = "ALERT_DATA_MAP";
	public static final String FLD_BROWSER_NAME = "BROWSER_NAME";
	public static final String FLD_CHANNEL_ID = "INPUT_CHANNEL_ID";
	public static final String FLD_SIMULATION_USERID = "SIMULATION_USERID";
	public static final String FLD_NOT_AVAILABLE = "NA";
	public static final String FLD_REFERENCE_SIMULATION_MODE = "Reference";
	public static final String FLD_DSA_DATA = "FLD_DSA_DATA";
	public static final String FLD_UNIQUE_REF_NO = "FLD_UNIQUE_REF_NO";
	public static final String FLD_VER_NO = "FLD_VER_NO";
	public static final String FLD_REFERENCE_KEY = "FLD_REF_KEY";
	public static final String LOGIN = "LOGN";
	public static String INVLDSESSN = "INVLDSESSN";
	public static final String LOGOUT = "LOGOUT";
	public static final String EVENT_LIST_DAM_KEY = "EVENT_LIST_DAM_KEY";
	public static final String EVENT_EXT_GET_ALL_EVENT_LIST = "EVENT_EXT_GET_ALL_EVENT_LIST";
	public static final String EVENT_TITLE = "EVENT_TITLE";
	public static final String EVENT_DESC = "EVENT_DESC";
	public static final String PRODUCT_CODE = "PRODUCT_CODE";
	public static final String SUB_PRODUCT_CODE = "SUB_PRODUCT_CODE";
	public static final String FUNCTION = "FUNCTION";
	public static final String ACTION = "ACTION";
	public static final String EVENT_TYPE_ID = "EVENT_TYPE_ID";
	public static final String FILE_NAME = "FILE_NAME";
	public static final String OLD_REFERENCE_NUMBER = "OLD_REFERENCE_NUMBER";
	public static final String DEVICE_BAND_ID = "DEVICE_BAND_ID";
	public static final String USER_AGENT = "USER_AGENT";
	public static final String WORKSPACE_ID = "WORKSPACE_ID";
	public static final String LAYOUT_ID = "LAYOUT_ID";
	public static final String WIDGET_ID = "WIDGET_ID";
	public static final String GEO_LOCATION = "GEO_LOCATION";
	public static final String REQUEST_ID = "REQUEST_ID";
	public static final String REQUEST_URI = "REQUEST_URI";
	public static final String UDF1 = "UDF1";
	public static final String UDF2 = "UDF2";
	public static final String UDF3 = "UDF3";
	public static final String UDF4 = "UDF4";
	public static final String UDF5 = "UDF5";
	public static final String UDF6 = "UDF6";
	public static final String UDF7 = "UDF7";
	public static final String UDF8 = "UDF8";
	public static final String UDF9 = "UDF9";
	public static final String UDF10 = "UDF10";
	public static final String FLD_INPUT_REFERENCE_NO = "INPUT_REFERENCE_NO";
	public static final String CHANNEL_ID = "CHANNEL_ID";
}
