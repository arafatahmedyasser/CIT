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
package com.intellectdesign.canvas.action;

import static com.intellectdesign.canvas.proxycaller.ProxyCaller.on;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONException;
import org.json.JSONObject;
import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ImplClassDescriptor;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.data.conversion.util.HashMapToJSONConverter;
import com.intellectdesign.canvas.data.conversion.util.JSONObjectBuilderForExtJs;
import com.intellectdesign.canvas.datahandler.RequestParamsHandler;
import com.intellectdesign.canvas.exceptions.action.OrbiActionException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.logging.initalizer.Log4jMDCInitializer;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.pref.date.DateFormatterManager;
import com.intellectdesign.canvas.preference.GlobalPreferencesUtil;
import com.intellectdesign.canvas.properties.MessageManager;
import com.intellectdesign.canvas.proxycaller.ProxyCallerException;
import com.intellectdesign.canvas.utils.StringUtils;
import com.intellectdesign.canvas.utils.httpheader.HttpHeaderInterpreter;
import com.intellectdesign.canvas.validator.ApplicationValidator;
import com.intellectdesign.canvas.validator.ValidationException;
import com.intellectdesign.canvas.value.CanvasRequestVO;
import com.intellectdesign.canvas.web.config.ActionMap;

/**
 * Base class for all the Action classes. This provides standard processing of a request with calls to validation as
 * well as utility API's to connect to a handler for processing request
 * 
 * @version 14.1
 */
public abstract class PortletAction
{

	/**
	 * Individual application action classes should provide implementaion for their actions by providing an implemention
	 * of this abstract method
	 * 
	 * @param action - The action string associated with this request
	 * @param sessionInfo - The SessionInfo object
	 * @param actionMap - The ActionMap object
	 * @param requestParams - This is a map which has the values passes from the request converted to a map using the
	 *            RequestParamsHandler class
	 * @param request - The request itself
	 * @return ReplyObject - the response for the action
	 * @throws OrbiActionException
	 */
	public abstract ReplyObject executePortletActionUsing(String action, SessionInfo sessionInfo, ActionMap actionMap,
			Map requestParams, HttpServletRequest request) throws OrbiActionException;

	/**
	 * This is a hook provided to the sub classes to update the parameters post the default identification done by the
	 * framework from the request.
	 * 
	 * @param request The HTTP request received
	 * @param params The parameters identified from the request
	 */
	protected void updateParams(HttpServletRequest request, Map params)
	{
		// Nothing to do here
	}

	/**
	 * This identifies the action from the request. This first checks from the parameters. If not present, then tries to
	 * look up from the request attributes
	 * 
	 * @param request The HTTP request received
	 * @return The action code
	 */
	public String getAction(HttpServletRequest request)
	{
		String action = request.getParameter(JSPIOConstants.INPUT_ACTION);
		if (action == null)
			action = (String) request.getAttribute(JSPIOConstants.INPUT_ACTION);
		return action;
	}

	/**
	 * Subclasses should Override this method to return the list of actions that are entitled to use for this action
	 * class. If not overridden, then the intent assumed is that all actions are entitled!
	 * 
	 * @return The list of actions that needs to be allowed as part of this action class.
	 */
	protected List<String> getEntitledActionList()
	{
		return null;
	}

	/**
	 * This method checks if the User is entitled for this particular request. Sub classes should ovverride the
	 * PortletAction.getEntitledActionList() method to return the list of entitled actions. Then this is used to check
	 * the action received (not the product, suproduct, etc) aginst the provided list to decide whether the user is
	 * entitled to this action. If the EntitledActionList returned is null, then it is assumed that entitlements should
	 * not be validated and this method just returns true.
	 * 
	 * @param action The action code for this request
	 * @param actionMap The action map identified for the current action
	 * @param request The Http request object
	 * @return true if the action is entitled false otherwise
	 */
	protected final boolean isActionEntitled(String action, ActionMap actionMap, HttpServletRequest request)
	{
		PerformanceTimer paisActionEntitled = new PerformanceTimer();
		paisActionEntitled.startTimer(this.getClass(), "isActionEntitled");
		List<String> entitledActions = getEntitledActionList();
		LOGGER.ctdebug("CTRND00001", entitledActions);
		boolean isEntitled = false;

		if (entitledActions == null || entitledActions.isEmpty())
		{
			LOGGER.ctinfo("CTRND00273");
			isEntitled = true;
		} else
		{
			// So we have a valid list. Check for existence.
			isEntitled = entitledActions.contains(action);
		}
		LOGGER.ctdebug(" CTRND00002", isEntitled, action);
		paisActionEntitled.endTimer();
		return isEntitled;
	}

	/**
	 * This method will be invoked by the Servlet. Applications are not required to override this method instead
	 * override executePortletActionUsing for providing their details This method also retrieves the headerMap from the
	 * returned ReplyObject. Then by invoking the convertHashMapToJSONFormat() method retrieves the JSON string.
	 * 
	 * @param sessionInfo The user Session information object
	 * @param actionMap Action mapping object
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @return the String in form of JSON
	 * @throws OrbiActionException, if the Error object is null, or if there is an exception in the handler while
	 *             handling this action
	 */
	public final String executePortletAction(SessionInfo sessionInfo, ActionMap actionMap, HttpServletRequest request)
			throws OrbiActionException
	{
		PerformanceTimer paexecutePortletAction = new PerformanceTimer();
		paexecutePortletAction.startTimer(this.getClass(), "executePortletAction");
		LOGGER.ctinfo("CTRND00276");
		String action = getAction(request);
		String jsonString = "";
		String fucntionCode = null;
		ExtReplyObject actionReplyObject = null;
		ExtReplyObject validationReplyObject = new ExtReplyObject();

		if (action == null || action.trim().equals(""))
		{
			LOGGER.cterror("CTRND00003");
			throw new OrbiActionException("NO_INPUT_ACTION", "No action parameter present in the request.");
		}
		// if the action is not entitled then throw an exception
		if (!isActionEntitled(action, actionMap, request))
		{
			LOGGER.cterror("CTRND00004", action);
			throw new OrbiActionException("ENLT_CHECK_FAILED_INPUT_ACTION",
					"The input action failed the entitlement check.");
		}

		Map reqParams = new RequestParamsHandler().getParameterSet(request);

		reqParams.put("deviceType", request.getAttribute("deviceType"));

		updateParams(request, reqParams); // CT_ENTITLEMENT

		if (doBasicValidationForInputValues(action, reqParams, sessionInfo.mLanguage, validationReplyObject))
		{
			try
			{
				actionReplyObject = (ExtReplyObject) executePortletActionUsing(action, sessionInfo, actionMap,
						reqParams, request);
			} catch (ClassCastException anException)
			{
				LOGGER.cterror("CTRND00005");
				throw new OrbiActionException("INVALID_REPLY_OBJECT_TYPE",
						"The reply object from the action should be of type ExtReplyObject.", anException);
			} finally
			{
				LOGGER.ctdebug("CTRND00006", actionReplyObject);
				if (actionReplyObject != null && actionReplyObject.sErrTxn != null)
				{
					LOGGER.ctdebug("CTRND00007", actionReplyObject.sErrTxn.length);
					if (actionReplyObject.sErrTxn.length > 0)
					{
						if (!(actionReplyObject.sErrTxn[0]).equals("ERR_SERVER_VALDN_FAILURE"))
						{
							ExtReplyObject transactionErrorReply = new ExtReplyObject();
							transactionErrorReply.headerMap = new HashMap();
							Map<String, Object> error_map = new HashMap<String, Object>();
							String langId = sessionInfo.mLanguage;
							if (StringUtils.isEmpty(langId))
								langId = FrameworkConstants.DEFAULT_LOCALE;
							String error_message = MessageManager
									.getMessage(null, actionReplyObject.sErrTxn[0], langId);
							error_map.put("TRANSACTION_ERROR", error_message);
							if (FrameworkConstants.ERROR_SYSTEM_ERROR.equals(actionReplyObject.sErrTxn[0]))
							{
								Log4jMDCInitializer initializer = new Log4jMDCInitializer();
								error_map.put("REQUEST_ID", initializer.getCurrentRequestId());
							}
							LOGGER.ctdebug("CTRND00008", error_map);
							transactionErrorReply.headerMap = (HashMap) error_map;
							fucntionCode = actionMap.getFunctionCode();
							jsonString = convertErrorReplyObjectToJsonString(action, transactionErrorReply,
									fucntionCode);
							return jsonString;
						}
					}
				}
			}
		} else
		{
			actionReplyObject = validationReplyObject;
		}

		fucntionCode = actionMap.getFunctionCode();
		jsonString = convertReplyObjectToJsonString(action, actionReplyObject, fucntionCode, sessionInfo);

		LOGGER.ctinfo("CTRND00277");
		paexecutePortletAction.endTimer();
		return jsonString;
	}

	/**
	 * Intended to do basic valiations for input values of given action.
	 * 
	 * @param action - Action value, application validator to identify validation rules in xml
	 * @param inputvalues - Input data which should be validate
	 * @param langCode - Language code requires to get locaized error messages for validation errors if any
	 * @param Replyobject - this parameter acts as a out parameter, i.e if this method returns false, then this
	 *            parameter will contain the error messages
	 * @return Returns - true, if validation is successful, false otherwise
	 */
	protected boolean doBasicValidationForInputValues(String action, Map inputvalues, String langCode,
			ExtReplyObject validationReplyObject) throws OrbiActionException
	{
		PerformanceTimer padoBasicValidationForInputValues = new PerformanceTimer();
		padoBasicValidationForInputValues.startTimer(this.getClass(), "doBasicValidationForInputValues");
		LOGGER.ctinfo("CTRND00313");
		boolean validationFlag = false;
		List errorObjects;
		String vertical = "";

		String funCode = (String) inputvalues.get(JSPIOConstants.INPUT_FUNCTION_CODE);
		vertical = (String) inputvalues.get(JSPIOConstants.INPUT_PRODUCT);
		if (vertical == null)
		{
			vertical = (String) inputvalues.get(FrameworkConstants.PRODUCT_NAME);
		}

		String validationsToSkip = (String) inputvalues.get(JSPIOConstants.APPLICATION_VALIDATOR_VALIDATIONS_TO_SKIP);
		String validationStyle = (String) inputvalues.get(JSPIOConstants.APPLICATION_VALIDATOR_VALIDATION_STYLE);
		ApplicationValidator validator = new ApplicationValidator();

		LOGGER.ctdebug("CTRND00314", vertical);
		LOGGER.ctdebug("CTRND00315");
		// Performing validator that uses phrase variables for processing error
		// codes,provides skip validation and full validation
		try
		{
			errorObjects = validator.processEx((HashMap) inputvalues, funCode + "_" + action, vertical.toLowerCase(),
					langCode, validationsToSkip, validationStyle);
		} catch (ValidationException e)
		{
			LOGGER.cterror("CTRND00316", e);
			throw new OrbiActionException("EXCEPTION_BASIC_VALIDATION",
					"Exception occured while doing basic validations", e);
		}

		if (errorObjects != null && !errorObjects.isEmpty())
		{
			// Builds the validation error messages list based on the error
			// codes list.
			if (vertical.toLowerCase().equals("canvas"))
				vertical = vertical.toLowerCase() + "-default";
			List errorMessagesList = MessageManager.getMessages(vertical.toLowerCase(), errorObjects, langCode);// ServerSide
																												// Validation
																												// Fix
			// Retrieves validation errorMap object for JSON String conversion.
			validationReplyObject.headerMap = (HashMap) JSONObjectBuilderForExtJs
					.buildValidationMessageMap(errorMessagesList);
			validationFlag = false;
		} else
		{
			validationFlag = true;
		}
		LOGGER.ctinfo("CTRND00317", validationFlag);
		padoBasicValidationForInputValues.endTimer();
		return validationFlag;
	}

	/**
	 * 
	 * @param inputaction
	 * @param errorreplyob
	 * @return String the converted JSON string
	 * @throws OrbiActionException
	 */
	protected final String convertErrorReplyObjectToJsonString(String inputaction, ExtReplyObject replyob,
			String functionCode) throws OrbiActionException
	{
		PerformanceTimer paconvertReplyObjectToJsonString = new PerformanceTimer();
		paconvertReplyObjectToJsonString.startTimer(this.getClass(), "convertReplyObjectToJsonString");
		Map replyMap = replyob.headerMap;
		if (replyMap == null)
		{
			throw new OrbiActionException("Error_Reply_null", "Reply Object is null");
		}
		PerformanceTimer pagetDateFieldList = new PerformanceTimer();
		pagetDateFieldList.startTimer(this.getClass(), "getDateFieldList");
		List datefields = getDateFieldList(inputaction);
		if (datefields == null)
		{
			datefields = getDateFieldList(inputaction, functionCode);
		}
		pagetDateFieldList.endTimer();
		String jsonString = HashMapToJSONConverter.convertHashMapToJSONFormat(replyMap, datefields);
		paconvertReplyObjectToJsonString.endTimer();
		return jsonString;
	}

	/**
	 * Individual application action classes should override this api to return date field ids which values should
	 * return as ext date objects rather than java.lang.String
	 * 
	 * @param action
	 * @return List of date field ids
	 */
	protected List<String> getDateFieldList(String action)
	{
		return null;
	}

	/**
	 * Individual application action classes should override this api to return date field ids which values should
	 * return as ext date objects rather than java.lang.String Introduced for the investment redesign. Since the
	 * investment moduel is going to use only single InvstBaseAction class this will be used to identify which module in
	 * action and the dates required for them.
	 * 
	 * @param action
	 * @return List of date field ids
	 */
	protected List<String> getDateFieldList(String action, String functionCode)
	{
		return null;
	}

	/**
	 * 
	 * @param inputaction
	 * @param replyob
	 * @return String the converted JSON string
	 * @throws OrbiActionException
	 */
	protected final String convertReplyObjectToJsonString(String inputaction, ExtReplyObject replyob,
			String functionCode, SessionInfo sessionInfo) throws OrbiActionException
	{
		PerformanceTimer paconvertReplyObjectToJsonString = new PerformanceTimer();
		paconvertReplyObjectToJsonString.startTimer(this.getClass(), "convertReplyObjectToJsonString");
		List datefields = null;
		String jsonString = null;
		if (null == replyob)
		{
			throw new OrbiActionException("Error_Reply_null", "Reply Object is null -- >" + inputaction);
		}
		Map replyMap = replyob.headerMap;
		Map jsonMap = new HashMap();
		JSONObject jsonObj;
		if (replyMap == null)
		{
			throw new OrbiActionException("Error_Reply_null", "Reply Object header is null");
		}
		datefields = getDateFieldList(inputaction);
		if (datefields == null)
		{
			datefields = getDateFieldList(inputaction, functionCode);
		}

		HashMap<String, String> map = new HashMap<String, String>();
		try
		{
			GlobalPreferencesUtil globalPreferencesUtil = new GlobalPreferencesUtil();
			map.put(JSPIOConstants.TXN_PROCESS_DATE_TIME,
					globalPreferencesUtil.getConvertedTime(sessionInfo.mTimeZoneId));
		} catch (Exception e)
		{
			throw new OrbiActionException(e);
		}
		try
		{
			Object replyObject = replyMap.get(JSONObjectBuilderForExtJs.JSON_MAP);
			if (replyObject == null)
			{
				throw new OrbiActionException("Json_map_null", "The json is not present in the key JSON_MAP.");
			}
			if (replyObject instanceof JSONObject)
			{
				jsonObj = (JSONObject) replyObject;
				jsonObj.put("HEADER_VALUE", map);
				jsonString = jsonObj.toString();
			} else
			{
				jsonMap = (HashMap) replyObject;
				jsonMap.put("HEADER_VALUE", map);
				jsonString = HashMapToJSONConverter.convertHashMapToJSONFormat(jsonMap, datefields);
			}
		} catch (JSONException anException)
		{
			throw new OrbiActionException("Json_map_invalid_type", "The json map should be of type HashMap.");
		} catch (ClassCastException anException)
		{
			throw new OrbiActionException("Json_map_invalid_type", "The json map should be of type HashMap.");
		}
		paconvertReplyObjectToJsonString.endTimer();
		return jsonString;
	}

	/**
	 * executes a Host Transaction given the transaction code. Automatically fills first 25 elements in Vector. Sends
	 * the request to the Handler
	 * 
	 * @param sessionInfo The current SessionInfo,
	 * @param txnCode The transaction code whose Host call is to be made.
	 * @param Map requestParams: This has the requestparams details, this parameter is a inout parameter, whereby
	 *            application can add contents to this map before sending it executeHostRequest
	 * @param request The current HttpServletRequest
	 * @return ReplyObject: reply from the Host
	 */
	protected final ExtReplyObject executeHostRequest(SessionInfo sessionInfo, String txnCode, Map requestParams,
			HttpServletRequest request) throws ProcessingErrorException
	{
		CanvasRequestVO requestPacket = null;
		LOGGER.ctinfo("CTRND00278");
		ConfigurationManager manager = ConfigurationManager.getInstance();
		ImplClassDescriptor descriptor = manager.getImplClassDescriptor();

		ICanvasRequestInterceptor interceptor = null;
		String interceptorClass = descriptor.getRequestInterceptorClass();
		try
		{
			interceptor = (ICanvasRequestInterceptor) on(interceptorClass).create().get();
		} catch (ProxyCallerException invokeException)
		{
			// Means there is an error in the creation of the interceptor.
			LOGGER.cterror("CTRND00381", invokeException, interceptorClass);
			throw new ProcessingErrorException(invokeException);
		}
		Map modifiedParams = interceptor.interceptRequest(request, sessionInfo, txnCode, requestParams);
		if (modifiedParams == null)
			modifiedParams = requestParams;

		// Create the request builder and then build the request
		requestPacket = createCanvasRequestBuilder(sessionInfo, requestParams, txnCode, request).build();
		return executeRequest(requestPacket);
	}

	/**
	 * This method creates the request builder that returns the predefined manner in which the request is built based pn
	 * the session info and the request data. Sub classes that override this method are expected to call the
	 * super.createCanvasRequestBuilder() to get the default populated builder and then override / enrich any additional
	 * information on the builder.
	 * 
	 * @param sessionInfo the session info object
	 * @param requestParams the request params value
	 * @param txnCode the code to be used for invoking the handler
	 * @return The request onject
	 */
	protected CanvasRequestVO.CanvasRequestBuilder createCanvasRequestBuilder(SessionInfo sessionInfo,
			Map requestParams, String txnCode, HttpServletRequest request)
	{
		HttpHeaderInterpreter headerView = new HttpHeaderInterpreter();

		CanvasRequestVO.CanvasRequestBuilder builder = new CanvasRequestVO.CanvasRequestBuilder();
		// Set the information into the builder.
		// Little nasty stuff. Product code gets sent using 2 different keys. This needs to be corrected at source
		// later. For now check for one of the keys to be present
		String productCode = (String) requestParams.get(JSPIOConstants.INPUT_PRODUCT);
		if (StringUtils.isEmpty(productCode))
			productCode = (String) requestParams.get(JSPIOConstants.PRODUCT_NAME);
		builder.setProductCode(StringUtils.ensureExists(productCode));
		builder.setSubProductCode(StringUtils.ensureExists((String) requestParams.get(JSPIOConstants.INPUT_SUB_PRODUCT)));
		builder.setFunctionCode(StringUtils.ensureExists((String) requestParams.get(JSPIOConstants.INPUT_FUNCTION_CODE)));
		builder.setActionCode(StringUtils.ensureExists((String) requestParams.get(JSPIOConstants.INPUT_ACTION)));
		builder.setPageCodeType(StringUtils.ensureExists((String) requestParams.get(FrameworkConstants.PAGE_CODE_TYPE)));
		builder.setReferenceNumber(StringUtils.ensureExists((String) requestParams
				.get(JSPIOConstants.INPUT_REFERENCE_NO)));
		builder.setHostCode(txnCode);

		builder.setChannelId(String.valueOf(sessionInfo.channelId));
		builder.setDeviceType(sessionInfo.deviceType).setHybridApp(sessionInfo.isHybrid());
		builder.setRequestingClientIP(sessionInfo.requestIp).setRequestURI(request.getRequestURI());
		builder.setRequestId(new Log4jMDCInitializer().getCurrentRequestId());
		builder.setSessionId(sessionInfo.sessionId).setUserNumber(sessionInfo.userNo);
		builder.setCurrentGCIF(sessionInfo.sCustNo).setOwningGCIF(sessionInfo.primaryGcif);
		builder.setUserType(sessionInfo.customerType).setCurrentRoleId(sessionInfo.userRole);
		builder.setLoginId(sessionInfo.loginId).setAuthenticationType(sessionInfo.authenticationType);
		builder.setCustomerSegmentCode(sessionInfo.customerSegment);
		// Mobile and email not available in session info! So cannot be passed yet.
		// Custom session info is not a directly retrievable object from session info. Hence cannot be passed yet.

		builder.setUserAgent(sessionInfo.userAgent);
		builder.setWebServerIP(StringUtils.ensureExists(headerView.getCurrentServerIPAddress()));
		builder.setBrowserName(StringUtils.ensureExists(headerView.resolveBrowserInfo(sessionInfo.userAgent)));
		builder.setOsName(StringUtils.ensureExists(headerView.resolveOSInfo(sessionInfo.userAgent)));

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

		// Seed in some of the data into the request params directly. More of a backward compatibility support.
		requestParams.put(JSPIOConstants.INPUT_LANGUAGE_ID, sessionInfo.mLanguage);
		requestParams.put(JSPIOConstants.INPUT_USER_NO, sessionInfo.userNo);
		requestParams.put(JSPIOConstants.INPUT_GCIF, sessionInfo.sCustNo);
		requestParams.put(JSPIOConstants.USER_PREFEERENCE_DATE_FORMAT,
				DateFormatterManager.getJavaDateFormat(sessionInfo.mDateFormat));
		requestParams.put(JSPIOConstants.USER_PREFEERENCE_TIME_FORMAT, sessionInfo.timeFormat);
		requestParams.put(JSPIOConstants.USER_PREFEERENCE_AMT_FORMAT, sessionInfo.mAmtFormat);
		requestParams.put(FrameworkConstants.SIMULATION_MODE, Boolean.valueOf(sessionInfo.isSimulationMode));
		requestParams.put(JSPIOConstants.TIMEZONE_FORMAT, sessionInfo.mTimeZoneId);
		requestParams.put("CodeValidation", sessionInfo.rsaId); // Is this really needed?
		requestParams.put(JSPIOConstants.INPUT_THEME_ID, sessionInfo.themeId);
		requestParams.put(JSPIOConstants.INPUT_FONTSIZE_ID, sessionInfo.fontsizeId);
		requestParams.put(JSPIOConstants.INPUT_USER_ROLE, sessionInfo.userRole);
		requestParams.put(JSPIOConstants.INPUT_USER_NAME, getInputUserName(sessionInfo));
		requestParams.put("deviceType", sessionInfo.deviceType);

		// Set the data for this request.
		builder.setRequestData(requestParams);
		return builder;
	}

	/**
	 * Helper method that gets the Input user name as a combination of first and last name
	 * 
	 * @param sessionInfo
	 * @return
	 */
	private Object getInputUserName(SessionInfo sessionInfo)
	{
		String firstName = sessionInfo.firstName;
		firstName = Character.toUpperCase(firstName.charAt(0)) + firstName.substring(1);
		String lastName = sessionInfo.lastName;
		String inputUserName = firstName.concat(" ").concat(lastName);
		return inputUserName;
	}

	/**
	 * Helper method that does the actual execution of the request by invoking the handler
	 * 
	 * @param request The request that needs to be executed
	 * @return ReplyObject The response received post the invocation
	 * @exception ProcessingErrorException If any error is received while invoking the handler or when the handler tries
	 *                to process the request
	 */
	protected final ExtReplyObject executeRequest(CanvasRequestVO request) throws ProcessingErrorException
	{
		ConfigurationManager manager = ConfigurationManager.getInstance();
		ImplClassDescriptor descriptor = manager.getImplClassDescriptor();
		String hostTxnCode = request.getHostCode();

		ICanvasHandlerInvoker invoker = null;
		String invokerClass = descriptor.getHandlerInvokerClass();
		PerformanceTimer timer = new PerformanceTimer();
		try
		{
			timer.startTimer("Invoking Handler '" + hostTxnCode + "'");
			invoker = (ICanvasHandlerInvoker) on(invokerClass).create().get();
			return invoker.invokeRequestHandler(request, hostTxnCode);
		} catch (ProxyCallerException invokeException)
		{
			// Means there is an error in the creation of the invoker.
			LOGGER.cterror("CTRND00318", invokerClass, invokeException);
			throw new ProcessingErrorException(invokeException);
		} finally
		{
			timer.endTimer();
		}
	}

	private static Logger LOGGER = Logger.getLogger(PortletAction.class);
}
