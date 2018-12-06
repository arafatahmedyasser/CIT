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
package com.intellectdesign.canvas.handler;

import java.util.HashMap;
import java.util.Vector;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.value.CanvasRequestVO;

/**
 * This base class extends the CanvasBaseRequestHandler and provides a backward compatibility hook for handling the
 * request as a Vector instead of using the POJO as it is.
 * 
 * @version 14.1
 */
public abstract class SimpleRequestHandler extends CanvasBaseRequestHandler
{

	private Logger LOGGER = Logger.getLogger(SimpleRequestHandler.class);

	/**
	 * This method is the base method invoked whenever a transaction is made.Depending on the action the internal
	 * private methods are called.
	 * 
	 * @param request The request received
	 * @return The ReplyObject that needs to be sent back to the invoker
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request
	 */
	public ReplyObject process(CanvasRequestVO request) throws ProcessingErrorException
	{
		return processRequest(getAsVector(request));
	}

	/**
	 * This method hook is provided as a backward compatibility to the scenario where the earlier release was receiving
	 * the request as a Vector instead of a VO.
	 * 
	 * @param request The request in the form of a Vector
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request
	 */
	protected ReplyObject processRequest(Vector request) throws ProcessingErrorException
	{
		return new ExtReplyObject();
	}

	/**
	 * this is ref to IsSimulationMode Returns true if user is in simulation mode else false based
	 * 
	 * @param HashMap inputParams
	 * 
	 * @return Returns true if user is in simulation mode else false based
	 */
	protected boolean isSimulationMode(HashMap inputParams)
	{
		// added below lines of code for Simulation user functionality starts
		LOGGER.ctdebug("CTBAS00056");
		boolean isSimulationMode = false;
		if (inputParams.containsKey(FrameworkConstants.SIMULATION_MODE))
		{
			isSimulationMode = ((Boolean) inputParams.get(FrameworkConstants.SIMULATION_MODE)).booleanValue();
		}

		LOGGER.ctdebug("CTBAS00057", isSimulationMode);
		return isSimulationMode;
	}

	/**
	 * Returns ExtReplyObject after setting for required parameter for simulation mode in the header map
	 * 
	 * @param void
	 * @return ExtReplyObject after setting required parameter for simulation mode in the header map
	 */
	protected ExtReplyObject getSimulationModeReplyObj(String action)
	{
		ExtReplyObject tmpExtReply = new ExtReplyObject();
		tmpExtReply.headerMap = new HashMap<String, String>();
		tmpExtReply.headerMap.put(FrameworkConstants.SIMULATION_SUCCESS_FLAG, FrameworkConstants.TRUE);
		tmpExtReply.headerMap.put(FrameworkConstants.SUCCESS, FrameworkConstants.TRUE);
		tmpExtReply.headerMap.put(FrameworkConstants.SUBMIT_SUCCESS, FrameworkConstants.YES_Y);
		tmpExtReply.headerMap.put(FrameworkConstants.RESPONSE_ACTION, action);
		return tmpExtReply;
	}

	/**
	 * This API is provided for backward comaptibility to support a quick conversion of this request into a Vector
	 * state.
	 * 
	 * Note: This API should not be called multiple times as it will end up creating a Vector every time that this is
	 * invoked. This can lead to unnecessary duplicates of the data being created for no obvious benefit
	 * 
	 * @return The request data in a Vector form
	 */
	private Vector getAsVector(CanvasRequestVO request)
	{
		Vector requestState = new Vector();
		CanvasRequestVO.SessionContext sessionContext = request.getSessionContext();
		CanvasRequestVO.UserContext userContext = request.getUserContext();
		CanvasRequestVO.UserPreferenceContext prefContext = request.getUserPreferenceContext();

		requestState.add(sessionContext.getSessionId());
		requestState.add(request.getHostCode()); // Corresponds to TxnCode (also referred as host code)
		requestState.add(userContext.getCurrentGCIF()); // GCIF on behalf of which the user is operating
		requestState.add(userContext.getUserNumber()); // User Number of the current user
		requestState.add(request.getFunctionCode());
		requestState.add(request.getProductCode());
		requestState.add(request.getSubProductCode());
		requestState.add(""); // Placeholder for debit account number
		requestState.add("0.0"); // Placeholder for debit amount
		requestState.add(""); // Place holder for debit CCY
		requestState.add(sessionContext.getChannelId()); // The channel Id
		requestState.add(request.getReferenceNumber()); // The reference Number
		requestState.add(prefContext.getLanguageId()); // User's Language preferfence
		requestState.add(""); // Place holder for debit branch
		requestState.add(""); // Place holder for value date
		requestState.add(""); // Place holder for transaction status
		requestState.add("1"); // Place holder for transaction version
		requestState.add(userContext.getUserType()); // Type of user
		requestState.add(request.getActionCode()); // Action being triggered
		requestState.add(""); // Place holder for Input confirmation
		requestState.add(""); // no idea

		HashMap reqData = new HashMap();
		reqData.put(JSPIOConstants.CLIENT_IP, sessionContext.getRequestingClientIP());
		reqData.put(JSPIOConstants.FLD_SIMULATION_USERID, sessionContext.getSimulatingUserLoginId());
		reqData.put(JSPIOConstants.APP_SERVER_IP, request.getAppServerIP());
		reqData.put(JSPIOConstants.WEB_SERVER_IP, request.getWebServerIP());
		reqData.put(JSPIOConstants.SIMULATION_MODE, sessionContext.isSimulated());
		reqData.put(JSPIOConstants.BROWSER_NAME, sessionContext.getBrowserName());
		reqData.put(JSPIOConstants.USER_AGENT, sessionContext.getUserAgent());
		reqData.put(JSPIOConstants.OS_NAME, sessionContext.getOsName());
		reqData.put(JSPIOConstants.AUDIT_TXN_MODE, ""); // No idea
		reqData.put(JSPIOConstants.INPUT_CHANNEL_ID, sessionContext.getChannelId());
		reqData.put(JSPIOConstants.FIELD_FIRST_NAME, userContext.getFirstName());
		reqData.put(JSPIOConstants.FIELD_MIDDLE_NAME, userContext.getMiddleName());
		reqData.put(JSPIOConstants.FIELD_LAST_NAME, userContext.getLastName());
		reqData.put(JSPIOConstants.FLD_LOGIN_ID, userContext.getLoginId());
		reqData.put(JSPIOConstants.REQUEST_ID, request.getRequestId());
		reqData.put(JSPIOConstants.REQUEST_URI, request.getRequestURI());
		reqData.put(JSPIOConstants.DEVICE_BAND_ID, sessionContext.getDeviceType());

		requestState.add(reqData); // Audit data map
		requestState.add(""); // no idea
		requestState.add(""); // no idea
		requestState.add(""); // no idea
		requestState.add(""); // no idea
		requestState.add(""); // Input Mode
		requestState.add(request.getPageCodeType()); // Page code

		HashMap newReqData = new HashMap();
		newReqData.putAll(request.getRequestData());
		newReqData.put(JSPIOConstants.INPUT_LANGUAGE_ID, prefContext.getLanguageId());
		newReqData.put(JSPIOConstants.INPUT_USER_NO, userContext.getUserNumber());
		newReqData.put(JSPIOConstants.INPUT_GCIF, userContext.getCurrentGCIF());
		newReqData.put(JSPIOConstants.USER_PREFEERENCE_DATE_FORMAT, prefContext.getDateFormat());
		newReqData.put(JSPIOConstants.TIMEZONE_FORMAT, prefContext.getTimeZoneId());
		newReqData.put(JSPIOConstants.USER_PREFEERENCE_TIME_FORMAT, prefContext.getTimeDisplayFormat());
		newReqData.put(JSPIOConstants.USER_PREFEERENCE_AMT_FORMAT, prefContext.getAmountFormat());
		newReqData.put(FrameworkConstants.SIMULATION_MODE, sessionContext.isSimulated());
		newReqData.put(JSPIOConstants.INPUT_THEME_ID, prefContext.getThemeId());
		newReqData.put(JSPIOConstants.INPUT_FONTSIZE_ID, prefContext.getFontSizeId());
		newReqData.put(JSPIOConstants.INPUT_USER_ROLE, userContext.getCurrentRoleId());
		newReqData.put(JSPIOConstants.INPUT_USER_NAME, userContext.getUserName());
		newReqData.put("deviceType", sessionContext.getDeviceType());
		newReqData.put(JSPIOConstants.INPUT_CHANNEL_ID, sessionContext.getChannelId());

		requestState.add(newReqData); // Updated Request Data

		return requestState;
	}
}
