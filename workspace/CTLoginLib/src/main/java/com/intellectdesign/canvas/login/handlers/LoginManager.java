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

package com.intellectdesign.canvas.login.handlers;

import static com.intellectdesign.canvas.proxycaller.ProxyCaller.on;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ImplClassDescriptor;
import com.intellectdesign.canvas.constants.login.LoginMasterConstants;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.logging.initalizer.Log4jMDCInitializer;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.pref.date.DateFormatterManager;
import com.intellectdesign.canvas.proxycaller.ProxyCallerException;
import com.intellectdesign.canvas.utils.ChannelUtils;
import com.intellectdesign.canvas.utils.StringUtils;
import com.intellectdesign.canvas.utils.httpheader.HttpHeaderInterpreter;
import com.intellectdesign.canvas.value.CanvasRequestVO;
import com.intellectdesign.canvas.value.IUserValue;

/**
 * This is the class that provides various API's to interact with Canvas framework as part of the Login / logout
 * sequence
 */
public class LoginManager
{
	/**
	 * This method is used to handle the request for login, session validation and user status.
	 * 
	 * @param userValue The userValue to be used for the processing
	 * @param request The servlet request
	 * @param sessInfo The current session info
	 * @return The UserValue with the response.
	 * @throws ProcessingErrorException Thrown if any error occurred while processing the request
	 */
	public IUserValue handleRequest(IUserValue userValue, HttpServletRequest request, SessionInfo sessInfo)
			throws ProcessingErrorException
	{
		CanvasRequestVO reqVO = constructRequest(userValue, request, sessInfo);
		PerformanceTimer timer = new PerformanceTimer();
		ExtReplyObject reply = null;
		timer.startTimer("LoginManager.handleRequest(" + userValue.getTransactionCode() + ")");
		try
		{
			reply = executeRequest(reqVO);
		} finally
		{
			timer.endTimer();
		}
		return reply.userValue;
	}

	/**
	 * Helper method that does the actual execution of the request by invoking the handler
	 * 
	 * @param request The request that needs to be executed
	 * @return ReplyObject The response received post the invocation
	 * @exception ProcessingErrorException If any error is received while invoking the handler or when the handler tries
	 *                to process the request
	 */
	private ExtReplyObject executeRequest(CanvasRequestVO request) throws ProcessingErrorException
	{
		ImplClassDescriptor descriptor = ConfigurationManager.getInstance().getImplClassDescriptor();

		ILoginHandlerInvoker invoker = null;
		String invokerClass = descriptor.getLoginHandlerInvokerClass();
		PerformanceTimer timer = new PerformanceTimer();
		try
		{
			timer.startTimer("Invoking Handler '" + invokerClass + "'");
			invoker = (ILoginHandlerInvoker) on(invokerClass).create().get();
			return invoker.invokeLoginHandler(request);
		} catch (ProxyCallerException invokeException)
		{
			// Means there is an error in the creation of the invoker.
			throw new ProcessingErrorException(invokeException);
		} finally
		{
			timer.endTimer();
		}
	}

	/**
	 * Helper method to construct a request
	 * 
	 * @param userValue The user Value to be sent to the server
	 * @param request The servlet request
	 * @param sessionInfo The session info
	 * @return The request VO.
	 */
	private CanvasRequestVO constructRequest(IUserValue userValue, HttpServletRequest request, SessionInfo sessionInfo)
	{
		HttpHeaderInterpreter headerView = new HttpHeaderInterpreter();

		CanvasRequestVO.CanvasRequestBuilder builder = new CanvasRequestVO.CanvasRequestBuilder();
		builder.setProductCode("LOGIN");
		builder.setSubProductCode("LOGIN");
		builder.setActionCode(userValue.getTransactionCode());
		builder.setPageCodeType("LOGIN");
		builder.setReferenceNumber("NA");
		builder.setHostCode("LOGIN");
		builder.setRequestId(new Log4jMDCInitializer().getCurrentRequestId());
		String userAgent;
		if (sessionInfo != null)
		{
			builder.setChannelId(ChannelUtils.getDeviceType(sessionInfo.deviceType, sessionInfo.isHybrid));
			builder.setDeviceType(sessionInfo.deviceType).setHybridApp(sessionInfo.isHybrid());
			builder.setRequestingClientIP(sessionInfo.requestIp).setRequestURI(
					(request == null) ? sessionInfo.requestURI : request.getRequestURI());
			builder.setSessionId(sessionInfo.sessionId).setUserNumber(sessionInfo.userNo);
			builder.setCurrentGCIF(sessionInfo.sCustNo).setOwningGCIF(sessionInfo.primaryGcif);
			builder.setUserType(sessionInfo.customerType).setCurrentRoleId(sessionInfo.userRole);
			builder.setLoginId(sessionInfo.loginId).setAuthenticationType(sessionInfo.authenticationType);
			builder.setCustomerSegmentCode(sessionInfo.customerSegment);
			builder.setLanguageId(sessionInfo.mLanguage).setLanguageDirection(sessionInfo.direction);
			builder.setAmountFormat(sessionInfo.mAmtFormat).setDateFormat(
					DateFormatterManager.getJavaDateFormat(sessionInfo.mDateFormat));
			builder.setTimeDisplayFormat(sessionInfo.timeFormat).setTimeZoneId(sessionInfo.mTimeZoneId);
			builder.setThemeId(sessionInfo.themeId).setFontSizeId(sessionInfo.fontsizeId);
			builder.setSecondaryLanguageEnabled(StringUtils.convertToBoolean(sessionInfo.mEnaSecLang));
			builder.setSecondaryLanguageId(sessionInfo.mSecLang);
			builder.setStartupWorkspaceId(sessionInfo.mStartUpWorkSpaceId);
			builder.setReferenceCCY(sessionInfo.equivalentCurrency);

			builder.setSimulated(sessionInfo.isSimulationMode).setSimulatingUserLoginId(sessionInfo.simulatingUserId);
			builder.setFirstName(sessionInfo.firstName).setLastName(sessionInfo.lastName)
					.setMiddleName(sessionInfo.middleName);
			userAgent = sessionInfo.userAgent;
		} else
		{
			builder.setChannelId(StringUtils.ensureExists(userValue.getChannelId(), "3"));
			builder.setDeviceType((request != null) ? (String) request.getAttribute("deviceType") : "NA");
			builder.setHybridApp(StringUtils.convertToBoolean((request != null) ? request.getParameter("isHybrid") : ""));
			builder.setRequestingClientIP((request != null) ? request.getRemoteAddr() : "NA");
			builder.setRequestURI((request != null) ? request.getRequestURI() : "NA");
			builder.setSessionId((request != null) ? (request.getSession(false) != null ? request.getSession(false)
					.getId() : "NA") : "NA");
			builder.setUserNumber("NA").setCurrentGCIF("NA").setOwningGCIF("NA").setUserType("C");
			builder.setLoginId(StringUtils.ensureExists(userValue.getLoginId(), "NA"));
			builder.setLanguageId(StringUtils.ensureExists(userValue.getLangId(), "en_US"));
			builder.setLanguageDirection("LTR");

			builder.setSimulated(userValue.isSimulated()).setSimulatingUserLoginId(userValue.getSimulatingUserNo());
			builder.setFirstName(userValue.getFIRST_NAME()).setLastName(userValue.getLAST_NAME())
					.setMiddleName(userValue.getMIDDLE_NAME());
			userAgent = ((request != null) ? request.getHeader("user-agent") : "NA");
		}

		builder.setUserAgent(userAgent);
		builder.setWebServerIP(StringUtils.ensureExists(headerView.getCurrentServerIPAddress()));
		builder.setBrowserName(StringUtils.ensureExists(headerView.resolveBrowserInfo(userAgent)));
		builder.setOsName(StringUtils.ensureExists(headerView.resolveOSInfo(userAgent)));
		Map requestData = new HashMap();
		requestData.put(LoginMasterConstants.FLD_USER_VALUE, userValue);
		builder.setRequestData(requestData);

		return builder.build();
	}

}
