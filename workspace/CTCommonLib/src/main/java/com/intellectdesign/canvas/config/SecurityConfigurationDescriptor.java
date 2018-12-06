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

package com.intellectdesign.canvas.config;

import java.util.HashMap;
import java.util.Map;
import java.util.PropertyResourceBundle;

import com.intellectdesign.canvas.logger.CanvasConfigurationLogger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.utils.PropertyValidations;
import com.intellectdesign.canvas.utils.ResourceBundleUtils;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This is simple Configuration Holder class that enables a set of configurations related to security. All the
 * configurations are available only as getter methods. The security configuration can be loaded using the Canvas Main
 * Configuration Manager by providing a separate resource that has all the security configurations
 * 
 * To provide the security related configurations, as part of the Canvas Main Configuration Manager, configure the
 * following key -
 * <ul>
 * <li><b>CT_SECURITY_BUNDLE</b> : This is the bundle that should be loaded from where the security configuration as
 * detailed below will be identified</li>
 * </ul>
 * 
 * Following are the broad categories related to security configuration that are supported -
 * <ul>
 * <li><b>Standard URLs</b> : This category contains the URLs for common functionality like - Login, Logout, Session
 * Timeout, etc</li>
 * <li><b>CSRF Configuration</b> : Configuration specific to CSRF Validation for the application</li>
 * <li><b>Session Configuration</b> : Configuration specific to session handling of the application</li>
 * </ul>
 * 
 * The detailed listing of the keys expected in the security bundle are provided below.
 * <ul>
 * <li><b>LOGIN_PAGE_URL</b>: This key is used to identify the Login page URL. The URL should not include the context
 * root. For example, if the context root is "dummy" and the login page is within a folder called "jsp" in the WAR file,
 * then the value would be "/jsp/login.jsp"</li>
 * <li><b>LOGIN_PAGE_URL_ROUTING_MODE</b>: This key is used to identify the Login page URL routing mode. If not
 * provided, this is treated by default as "FORWARD". Possible values are "FORWARD" and "REDIRECT"</li>
 * <li><b>LOGOUT_PAGE_URL</b>: This key is used to identify the Logout page URL. The URL should not include the context
 * root. For example, if the context root is "dummy" and the logout page is within a folder called "jsp" in the WAR
 * file, then the value would be "/jsp/logout.jsp"</li>
 * <li><b>LOGOUT_PAGE_URL_ROUTING_MODE</b>: This key is used to identify the Logout page URL routing mode. If not
 * provided, this is treated by default as "FORWARD". Possible values are "FORWARD" and "REDIRECT"</li>
 * <li><b>INVALID_SESSION_PAGE_URL</b>: This key is used to identify the Invalid Session page URL. The URL should not
 * include the context root. For example, if the context root is "dummy" and the login page is within a folder called
 * "jsp" in the WAR file, then the value would be "/jsp/invalidsession.jsp"</li>
 * <li><b>INVALID_SESSION_PAGE_URL_ROUTING_MODE</b>: This key is used to identify the Invalid session page URL routing
 * mode. If not provided, this is treated by default as "FORWARD". Possible values are "FORWARD" and "REDIRECT"</li>
 * <li><b>SIMULATION_MODE_PAGE_URL</b>: This key is used to identify the Simulation Mode launch page URL. The URL should
 * not include the context root. For example, if the context root is "dummy" and the login page is within a folder
 * called "jsp" in the WAR file, then the value would be "/jsp/simulationlaunch.jsp"</li>
 * <li><b>SIMULATION_MODE_PAGE_USER_TOKEN_NAME</b>: This key is used to indicate the key under which the user token will
 * be shared as part of the Simulation mode launch page URL.</li>
 * <li><b>FORCE_CHANGE_PWD_PAGE_URL</b>: This key is used to identify the Force Change Password page URL. The URL should
 * not include the context root. For example, if the context root is "dummy" and the login page is within a folder
 * called "jsp" in the WAR file, then the value would be "/jsp/changepassword.jsp"</li>
 * <li><b>FORCE_CHANGE_PWD_PAGE_URL_ROUTING_MODE</b>: This key is used to identify the Force Change Password page URL
 * routing mode. If not provided, this is treated by default as "FORWARD". Possible values are "FORWARD" and "REDIRECT"</li>
 * <li><b>CSRF_TOKEN_FIELD_NAME</b>: This is the key under which the CSRF Token will be sent by the browser to the
 * server.</li>
 * <li><b>CSRF_VALIDATION_ENABLED</b>: This is a boolean configuration to indicate whether CSRF Validation is enabled or
 * not. A boolean configuration for Boolean.TRUE is one of "yes", "y", "true", "1" (ignore case). All other values will
 * be treated as equivalent of Boolean.FALSE</li>
 * <li><b>CSRF_IGNORE_URLS</b>: This is a comma separated list of URIs. This should not include the context root of the
 * application</li>
 * <li><b>IDLE_SESSION_TIMEOUT_SEC</b>: This indicates the idle session timeout interval that should be monitored at the
 * browser level. This has to be less than the value configured in web.xml(session-timeout). For example, if the
 * session-timeout(web.xml) is configured as 10 min (600), and IDLE_SESSION_TIMEOUT_SEC is configured as 2 min (120),
 * then the browser will wait for inactivity for 600 -120 = 480 sec before popping up a inactive session timout window
 * to the user with option for the user to extend the session.</li>
 * <li><b>ALLOW_MULTI_LOGIN</b>: This is a boolean configuration to indicate whether multiple cocurrent sessions for a
 * single login id of the user should be allowed or not. A boolean configuration for Boolean.TRUE is one of "yes", "y",
 * "true", "1" (ignore case). All other values will be treated as equivalent of Boolean.FALSE</li>
 * <li><b>AUTH_SERV_PROV_CLASS</b>: This is the default authentication provider that is to be used during Login / logout
 * / reauthentication purposes</li>
 * <li><b>LOGIN_MODE</b>: This indicates how the login into the system should happen. Possible values are -
 * <ul>
 * <li><i>AUTO</i> : This mode indicates that user login should happen automatically when the first time the user
 * accesses protected content. This mode should be used only if there is some kind of SSO solution and the
 * AuthenticationProvider has the necessary capability to login the user using the same.</li>
 * <li><i>FORM</i> : This mode indicates that the user should be routed to the login page if the user tries to access
 * protected content directly without login.</li>
 * <li><i>BLOCK</i> : This mode indicates that the user should be shown an Access denied page if the user tries to
 * access protected content direcly without login</li>
 * </ul>
 * The default value for LOGIN_MODE if not configured will be taken as BLOCK.</li>
 * <li><b>LOG_REQUESTID_AS_REFERENCE</b>: This is a boolean configuration to indicate whether the unique Request Id
 * generated by Canvas for each request should be displayed to the end user in case of any errors faced. A boolean
 * configuration for Boolean.TRUE is one of "yes", "y", "true", "1" (ignore case). All other values will be treated as
 * equivalent of Boolean.FALSE</li>
 * <li><b>CHECK_CLIENT_IP_FOR_SESSION_VALIDATION</b>: This is a boolean configuration to indicate whether for every
 * request the Client IP should be validated with that detected at the time of application launch. This could be error
 * prone as may systems tamper with the default request header that captures the client Ip. In case as part of the
 * deployment stack at the firewall, it is possible to detect the correct IP and see the same explicitly as a request
 * header or parameter, then the same can be configured separately. Otherwise, by default
 * HttpServletRequest.getRemoteAddr() will be used to identify the client IP. A boolean configuration for Boolean.TRUE
 * is one of "yes", "y", "true", "1" (ignore case). All other values will be treated as equivalent of Boolean.FALSE</li>
 * <li><b>CLIENT_IP_PARAM_NAME</b>: This key is used only if the CHECK_CLIENT_IP_FOR_SESSION_VALIDATION is enabled. This
 * key is optional and can be used to tell the Canvas platform as to how it can retrieve the Client IP from.</li>
 * <li><b>CLIENT_IP_PARAM_SCOPE</b>: This key is used only if the CHECK_CLIENT_IP_FOR_SESSION_VALIDATION is enabled.
 * This key is optional and used to indicate the exact location from where the custom Client Ip key should be read from.
 * The possible values are "HEADER" (indicating from Request Header) or "PARAM" (indicating from Request parameters). If
 * this is not provided, then the platform will first attempt to retrieve from header, if not present, then from Params.
 * </li>
 * <li><b>ALL_CONTEXT_ROOTS</b>: This provides a comma separated list of all context roots enabled for the application.
 * The context roots are the basis by which the ProtectionDomain as well as context root level validations get
 * configured.</li>
 * <li><b>[Context Root]_VALIDATE_REFERRER_ACTION_FLAG</b>: This key is used to indicate whether Referrer URL needs to
 * be validation for a particular context root. If this is not configured, by default it is treated as "false". For this
 * key to be detected, the context root should have been included in the ALL_CONTEXT_ROOTS list. This is a boolean
 * configuration. A boolean configuration for Boolean.TRUE is one of "yes", "y", "true", "1" (ignore case). All other
 * values will be treated as equivalent of Boolean.FALSE</li>
 * <li><b>[Context Root]_VALID_REFERERS</b>: This key is used to provide the list of valid referrer URLs applicable for
 * that particular Context root. For this key to be detected, the context root should have been included in the
 * ALL_CONTEXT_ROOTS list</li>
 * <li><b>[Context Root]_SKIP_REFERRER_SOURCE_URLS</b>: This key is used to provide the list of URL's for which the
 * referrer validation need not be done. For this key to be detected, the context root should have been included in the
 * ALL_CONTEXT_ROOTS list</li>
 * <li><b>XFRAMEOPTION_DEFAULT</b>: This is the default value for X-FRAME-OPTIONS that should be set in all responses.
 * The possible valid values for this option are "DENY" and "SAMEORIGIN" If this is not provided, the default value is
 * assumed to be "DENY"</li>
 * <li><b>XFRAMEOPTION_IGNOREURLS : </b> This contains the comma separated list of URL patterns for which the
 * X-FRAME-OPTIONS header should not be emitted. This is typically applicable for cases like File uploads where some
 * browsers are not happy with receiving this header for the actual upload event.</li>
 * </ul>
 * 
 * @version 1.0
 */
public class SecurityConfigurationDescriptor extends PropertyBagConfigurationDescriptor
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 5458935752134827007L;

	public static final String MAIN_CONFIG_CT_SECURITY = "CT_SECURITY_BUNDLE";

	private static final CanvasConfigurationLogger LOGGER = new CanvasConfigurationLogger(
			SecurityConfigurationDescriptor.class);

	/**
	 * The only constructor for this descriptor. This takes the name associated to this descriptor
	 * 
	 * @param name The name for this descriptor
	 */
	public SecurityConfigurationDescriptor(String name)
	{
		super(name);
	}

	private String loginPageURI;
	private String loginPageRoutingMode;
	private String logoutPageURI;
	private String logoutPageRoutingMode;
	private String invalidSessionPageURI;
	private String invalidSessionPageRoutingMode;
	private String simulationModePageURI;
	private String simulationModeUserTokenFieldName;
	private String forceChangePasswordURI;
	private String forceChangePasswordRoutingMode;
	private String csrfTokenFieldName;
	private boolean csrfEnabled;
	private String[] csrfIgnoreURLs;
	private int idleSessionTimeoutInSeconds;
	private boolean allowMultiLogin;
	private String authenticationProviderClass;
	private boolean useRequestIdAsReference;
	private boolean checkClientIpDuringSessionValidation;
	private String clientIPParamKey;
	private String clientIPParamScope;
	private String[] enabledContextRoots;
	private Map<String, Boolean> referrerValidationEnabledMap;
	private Map<String, String[]> validReferrerListByContextMap;
	private Map<String, String[]> ignoreReferrerForURIsByContextMap;
	private String xframeOptionDefaultValue;
	private String[] xframeOptionIgnoreURLList;
	private String loginMode;
	private String defaultContextPath;
	private String homePageURI;
	private String expiryPageURI;
	private String errorPageURI;
	private String homePageRoutingMode;
	private String expiryPageRoutingMode;
	private String errorPageRoutingMode;

	/**
	 * ref to LoginpageUri
	 * 
	 * @return the loginPageURI
	 */
	public String getLoginPageURI()
	{
		return loginPageURI;
	}

	/**
	 * ref to loginPageRoutingMode
	 * 
	 * @return the loginPageRoutingMode
	 */
	public String getLoginPageRoutingMode()
	{
		return loginPageRoutingMode;
	}

	/**
	 * ref to Logoutpageuri
	 * 
	 * @return the logoutPageURI
	 */
	public String getLogoutPageURI()
	{
		return logoutPageURI;
	}

	/**
	 * ref to logoutPageRoutingMode
	 * 
	 * @return the logoutPageRoutingMode
	 */
	public String getLogoutPageRoutingMode()
	{
		return logoutPageRoutingMode;
	}

	/**
	 * ref too SessionPageURI
	 * 
	 * @return the invalidSessionPageURI
	 */
	public String getInvalidSessionPageURI()
	{
		return invalidSessionPageURI;
	}

	/**
	 * ref to SessionPageRoutingMode
	 * 
	 * @return the invalidSessionPageRoutingMode
	 */
	public String getInvalidSessionPageRoutingMode()
	{
		return invalidSessionPageRoutingMode;
	}

	/**
	 * ref to simulationModePageURI
	 * 
	 * @return the simulationModePageURI
	 */
	public String getSimulationModePageURI()
	{
		return simulationModePageURI;
	}

	/**
	 * ref to simulationModeUserTokenFieldName
	 * 
	 * @return the simulationModeUserTokenFieldName
	 */
	public String getSimulationModeUserTokenFieldName()
	{
		return simulationModeUserTokenFieldName;
	}

	/**
	 * ref to forceChangePasswordURI
	 * 
	 * @return the forceChangePasswordURI
	 */
	public String getForceChangePasswordURI()
	{
		return forceChangePasswordURI;
	}

	/**
	 * ref to forceChangePasswordRoutingMode
	 * 
	 * @return the forceChangePasswordRoutingMode
	 */
	public String getForceChangePasswordRoutingMode()
	{
		return forceChangePasswordRoutingMode;
	}

	/**
	 * ref to csrfTokenFieldName
	 * 
	 * @return the csrfTokenFieldName
	 */
	public String getCsrfTokenFieldName()
	{
		return csrfTokenFieldName;
	}

	/**
	 * ref to csrfEnabled
	 * 
	 * @return the csrfEnabled
	 */
	public boolean isCsrfEnabled()
	{
		return csrfEnabled;
	}

	/**
	 * ref to csrfIgnoreURLs
	 * 
	 * @return the csrfIgnoreURLs
	 */
	public String[] getCsrfIgnoreURLs()
	{
		return csrfIgnoreURLs;
	}

	/**
	 * ref to idleSessionTimeoutInSeconds
	 * 
	 * @return the idleSessionTimeoutInSeconds
	 */
	public int getIdleSessionTimeoutInSeconds()
	{
		return idleSessionTimeoutInSeconds;
	}

	/**
	 * ref to allowMultiLogin
	 * 
	 * @return the allowMultiLogin
	 */
	public boolean isAllowMultiLogin()
	{
		return allowMultiLogin;
	}

	/**
	 * ref to authenticationProviderClass
	 * 
	 * @return the authenticationProviderClass
	 */
	public String getAuthenticationProviderClass()
	{
		return authenticationProviderClass;
	}

	/**
	 * ref to RequestIdAsReference
	 * 
	 * @return the useRequestIdAsReference
	 */
	public boolean canUseRequestIdAsReference()
	{
		return useRequestIdAsReference;
	}

	/**
	 * ref to checkClientIpDuringSessionValidation
	 * 
	 * @return the checkClientIpDuringSessionValidation
	 */
	public boolean isCheckClientIpDuringSessionValidation()
	{
		return checkClientIpDuringSessionValidation;
	}

	/**
	 * ref to clientIPParamKey
	 * 
	 * @return the clientIPParamKey
	 */
	public String getClientIPParamKey()
	{
		return clientIPParamKey;
	}

	/**
	 * ref to clientIPParamScope
	 * 
	 * @return the clientIPParamScope
	 */
	public String getClientIPParamScope()
	{
		return clientIPParamScope;
	}

	/**
	 * ref to ReferrerValidationEnabledForContext
	 * 
	 * @param context The context root for which referrer validation configuration flag needs to be checked
	 * @return false, if the configuration has not been provided, else the configured value against the context provided
	 */
	public boolean isReferrerValidationEnabledForContext(String context)
	{
		if (referrerValidationEnabledMap != null && referrerValidationEnabledMap.containsKey(context))
			return referrerValidationEnabledMap.get(context);
		return false;
	}

	/**
	 * ref to AllReferrerListForContext
	 * 
	 * @param context The context root for which referrer validation needs to be fetched
	 * @return null, if the configuration has not been provided, else the configured values against the context provided
	 */
	public String[] getAllReferrerListForContext(String context)
	{
		if (validReferrerListByContextMap != null && validReferrerListByContextMap.containsKey(context))
			return validReferrerListByContextMap.get(context);
		return null;
	}

	/**
	 * ref to ReferrerValidationIgnoreURLListForContext
	 * 
	 * @param context The context root for which referrer validation needs to be fetched
	 * @return null, if the configuration has not been provided, else the configured values against the context provided
	 */
	public String[] getReferrerValidationIgnoreURLListForContext(String context)
	{
		if (ignoreReferrerForURIsByContextMap != null && ignoreReferrerForURIsByContextMap.containsKey(context))
			return ignoreReferrerForURIsByContextMap.get(context);
		return null;
	}

	/**
	 * ref to xframeOptionDefaultValue
	 * 
	 * @return the xframeOptionDefaultValue
	 */
	public String getXframeOptionDefaultValue()
	{
		return xframeOptionDefaultValue;
	}

	/**
	 * ref to xframeOptionIgnoreURLList
	 * 
	 * @return the xframeOptionIgnoreURLList
	 */
	public String[] getXframeOptionIgnoreURLList()
	{
		return xframeOptionIgnoreURLList;
	}

	/**
	 * Returns the LoginMode
	 * 
	 * @return login Mode
	 */
	public String getLoginMode()
	{
		return loginMode;
	}

	/***
	 * Returns the context path
	 * 
	 * @return String context path
	 */
	public String getContextPath()
	{
		return defaultContextPath;
	}

	/***
	 * returns the URI of Homepage
	 * 
	 * @return String
	 */
	public String getHomePageURI()
	{
		return homePageURI;
	}

	/***
	 * Returns the Expiry page URI
	 * 
	 * @return expiry page URI
	 */
	public String getExpiryPageURI()
	{
		return expiryPageURI;
	}

	/***
	 * ref to ErrorPageUri
	 * 
	 * @return String
	 */
	public String getErrorPageURI()
	{
		return errorPageURI;
	}

	/**
	 * ref to HomePageRoutingMode
	 * 
	 * @return HomePageRoutingMode
	 */
	public String getHomePageRoutingMode()
	{
		return homePageRoutingMode;
	}

	/**
	 * ref to expiryPageRoutingMode
	 * 
	 * @return expiryPageRoutingMode
	 */
	public String getExpiryPageRoutingMode()
	{
		return expiryPageRoutingMode;
	}

	/**
	 * ref to ErrorPageRoutingMode
	 * 
	 * @return ErrorPageRoutingMode
	 */
	public String getErrorPageRoutingMode()
	{
		return errorPageRoutingMode;
	}

	/**
	 * ref to LoadConfig
	 * 
	 * @param configSource
	 * @param defaultDescriptor
	 * @throws ConfigurationException
	 * @see com.intellectdesign.canvas.config.IConfigurationDescriptor#loadConfiguration(java.lang.String)
	 */
	@Override
	public void loadConfiguration(String configSource, IConfigurationDescriptor defaultDescriptor)
			throws ConfigurationException
	{
		super.loadConfiguration(configSource, defaultDescriptor);

		if (!isValidConfiguration())
		{
			throw new ConfigurationException("CONFIG_ERR",
					"Issues were found as part of the Security configuration information (resource bundle : "
							+ configSource + "). Please refer to the Logs for more details");
		}
		PropertyResourceBundle bundle = getRawConfigData();
		defaultContextPath = ResourceBundleUtils.getString(bundle, "DEFAULT_CONTEXT_ROOT", "");
		homePageURI = ResourceBundleUtils.getString(bundle, "HOME_PAGE_URL", "");
		homePageRoutingMode = ResourceBundleUtils.getString(bundle, "HOME_PAGE_URL_ROUTING_MODE", "").toUpperCase();
		expiryPageURI = ResourceBundleUtils.getString(bundle, "EXPIRY_PAGE_URL", "");
		expiryPageRoutingMode = ResourceBundleUtils.getString(bundle, "EXPIRY_PAGE_URL_ROUTING_MODE", "").toUpperCase();
		errorPageURI = ResourceBundleUtils.getString(bundle, "ERROR_PAGE_URL", "");
		errorPageRoutingMode = ResourceBundleUtils.getString(bundle, "ERROR_PAGE_URL_ROUTING_MODE", "").toUpperCase();
		loginPageURI = ResourceBundleUtils.getString(bundle, "LOGIN_PAGE_URL", "");
		loginPageRoutingMode = ResourceBundleUtils.getString(bundle, "LOGIN_PAGE_URL_ROUTING_MODE", "").toUpperCase();
		logoutPageURI = ResourceBundleUtils.getString(bundle, "LOGOUT_PAGE_URL", "");
		logoutPageRoutingMode = ResourceBundleUtils.getString(bundle, "LOGOUT_PAGE_URL_ROUTING_MODE", "").toUpperCase();
		invalidSessionPageURI = ResourceBundleUtils.getString(bundle, "INVALID_SESSION_PAGE_URL", "");
		invalidSessionPageRoutingMode = ResourceBundleUtils.getString(bundle, "INVALID_SESSION_PAGE_URL_ROUTING_MODE",
				"").toUpperCase();
		simulationModePageURI = ResourceBundleUtils.getString(bundle, "SIMULATION_MODE_PAGE_URL", "");
		simulationModeUserTokenFieldName = ResourceBundleUtils.getString(bundle,
				"SIMULATION_MODE_PAGE_USER_TOKEN_NAME", "");
		forceChangePasswordURI = ResourceBundleUtils.getString(bundle, "FORCE_CHANGE_PWD_PAGE_URL", "");
		forceChangePasswordRoutingMode = ResourceBundleUtils.getString(bundle,
				"FORCE_CHANGE_PWD_PAGE_URL_ROUTING_MODE", "").toUpperCase();
		csrfEnabled = StringUtils.convertToBoolean(ResourceBundleUtils
				.getString(bundle, "CSRF_VALIDATION_ENABLED", "N"));
		if (csrfEnabled)
		{
			csrfTokenFieldName = ResourceBundleUtils.getString(bundle, "CSRF_TOKEN_FIELD_NAME", "");
			csrfIgnoreURLs = StringUtils.convertToArray(ResourceBundleUtils.getString(bundle, "CSRF_IGNORE_URLS", ""),
					",");
		}
		idleSessionTimeoutInSeconds = Integer.valueOf(ResourceBundleUtils.getString(bundle, "IDLE_SESSION_TIMEOUT_SEC",
				""));
		allowMultiLogin = StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle, "ALLOW_MULTI_LOGIN", "N"));
		authenticationProviderClass = ResourceBundleUtils.getString(bundle, "AUTH_SERV_PROV_CLASS", "");
		useRequestIdAsReference = StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle,
				"LOG_REQUESTID_AS_REFERENCE", "N"));
		checkClientIpDuringSessionValidation = StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle,
				"CHECK_CLIENT_IP_FOR_SESSION_VALIDATION", "N"));
		clientIPParamKey = ResourceBundleUtils.getString(bundle, "CLIENT_IP_PARAM_NAME", "");
		clientIPParamScope = ResourceBundleUtils.getString(bundle, "CLIENT_IP_PARAM_SCOPE", "");
		enabledContextRoots = StringUtils.convertToArray(
				ResourceBundleUtils.getString(bundle, "ALL_CONTEXT_ROOTS", ""), ",");

		referrerValidationEnabledMap = new HashMap<String, Boolean>();
		validReferrerListByContextMap = new HashMap<String, String[]>();
		ignoreReferrerForURIsByContextMap = new HashMap<String, String[]>();
		if (enabledContextRoots != null && enabledContextRoots.length > 0)
		{
			String contextRoot;
			String dataValue;
			for (int count = 0; count < enabledContextRoots.length; count++)
			{
				contextRoot = enabledContextRoots[count];
				dataValue = ResourceBundleUtils.getString(bundle, contextRoot + "_VALIDATE_REFERRER_ACTION_FLAG", "");
				referrerValidationEnabledMap.put(contextRoot, StringUtils.convertToBoolean(dataValue));
				dataValue = ResourceBundleUtils.getString(bundle, contextRoot + "_VALID_REFERERS", "");
				validReferrerListByContextMap.put(contextRoot, StringUtils.convertToArray(dataValue, ","));
				dataValue = ResourceBundleUtils.getString(bundle, contextRoot + "_SKIP_REFERRER_SOURCE_URLS", "");
				ignoreReferrerForURIsByContextMap.put(contextRoot, StringUtils.convertToArray(dataValue, ","));
			}
		}
		xframeOptionDefaultValue = ResourceBundleUtils.getString(bundle, "XFRAMEOPTION_DEFAULT", "DENY");
		xframeOptionIgnoreURLList = StringUtils.convertToArray(
				ResourceBundleUtils.getString(bundle, "XFRAMEOPTION_IGNOREURLS", ""), ",");

		loginMode = ResourceBundleUtils.getString(bundle, "LOGIN_MODE", "BLOCK");
	}

	/**
	 * ref to ReloadConfig
	 * 
	 * @param configSource
	 * @param defaultDescriptor
	 * @throws ConfigurationException
	 * @see com.intellectdesign.canvas.config.IConfigurationDescriptor#reloadConfiguration(java.lang.String)
	 */
	@Override
	public void reloadConfiguration(String configSource, IConfigurationDescriptor defaultDescriptor)
			throws ConfigurationException
	{
		loadConfiguration(configSource, defaultDescriptor);
	}

	/**
	 * Helper method that validates a configuration before loading the same.
	 * 
	 * @return validstatus
	 */
	private boolean isValidConfiguration()
	{
		PerformanceTimer timer = new PerformanceTimer();
		boolean validationStatus = true;
		StringBuilder errorBuilder = new StringBuilder();
		LOGGER.ctdebug("CTCOM00097");
		timer.startTimer(getClass(), "isValidConfiguration");
		PropertyResourceBundle bundle = getRawConfigData();
		PropertyValidations validator = new PropertyValidations();

		errorBuilder.append(validateURI("LOGIN_PAGE_URL", "LOGIN_PAGE_URL_ROUTING_MODE"));
		errorBuilder.append(validateURI("LOGOUT_PAGE_URL", "LOGOUT_PAGE_URL_ROUTING_MODE"));
		errorBuilder.append(validateURI("INVALID_SESSION_PAGE_URL", "INVALID_SESSION_PAGE_URL_ROUTING_MODE"));
		errorBuilder.append(validateURI("FORCE_CHANGE_PWD_PAGE_URL", "FORCE_CHANGE_PWD_PAGE_URL_ROUTING_MODE"));
		errorBuilder.append(validateURI("SIMULATION_MODE_PAGE_URL", null));
		errorBuilder.append(validateURI("DEFAULT_CONTEXT_ROOT", null));
		errorBuilder.append(validateURI("HOME_PAGE_URL", "HOME_PAGE_URL_ROUTING_MODE"));
		errorBuilder.append(validateURI("EXPIRY_PAGE_URL", "EXPIRY_PAGE_URL_ROUTING_MODE"));
		errorBuilder.append(validateURI("ERROR_PAGE_URL", "ERROR_PAGE_URL_ROUTING_MODE"));
		errorBuilder.append(validator.validateIndicators("CSRF_VALIDATION_ENABLED", bundle));
		errorBuilder.append(validateCSRFConfig());
		errorBuilder.append(validator.validateConfig("IDLE_SESSION_TIMEOUT_SEC", bundle));
		errorBuilder.append(validator.validateIndicators("ALLOW_MULTI_LOGIN", bundle));
		errorBuilder.append(validator.validateClass("AUTH_SERV_PROV_CLASS", bundle));
		errorBuilder.append(validator.validateIndicators("LOG_REQUESTID_AS_REFERENCE", bundle));
		errorBuilder.append(validator.validateIndicators("CHECK_CLIENT_IP_FOR_SESSION_VALIDATION", bundle));
		errorBuilder.append(validationSessionTimeoutConfig());
		errorBuilder.append(validateXFrameOptionConfig());
		errorBuilder.append(validateLoginMode());
		errorBuilder.append(validator.validateConfig("DEFAULT_CONTEXT_ROOT", bundle));
		errorBuilder.append(validator.validateConfig("ALL_CONTEXT_ROOTS", bundle));

		validationStatus = errorBuilder.length() == 0;

		if (validationStatus)
			LOGGER.ctdebug("CTCOM00098");
		else
		{
			LOGGER.cterror("CTCOM00099", errorBuilder.toString());
		}
		timer.endTimer();
		return validationStatus;
	}

	/**
	 * Method to validate the URI
	 * 
	 * @param uriKey
	 * @param modeKey
	 * @return Validationerror message
	 */
	private String validateURI(String uriKey, String modeKey)
	{
		String validationErrorMessage = "";
		PropertyResourceBundle bundle = getRawConfigData();
		if (!bundle.containsKey(uriKey))
			validationErrorMessage += uriKey + " is missing. ";
		else if (StringUtils.isEmpty(bundle.getString(uriKey)))
			validationErrorMessage += uriKey + " cannot have an empty configuration. ";
		if (modeKey != null)
		{
			if (bundle.containsKey(modeKey))
			{
				String mode = bundle.getString(modeKey);
				if (!"FORWARD".equals(mode) && !"REDIRECT".equals(mode))
					validationErrorMessage += modeKey
							+ " value is invalid. It can be either 'FORWARD' or 'REDIRECT' only. ";
			}
		}
		return validationErrorMessage;
	}

	/***
	 * Method to validate the CSRF configuration
	 * 
	 * @return Validation error message
	 */
	private String validateCSRFConfig()
	{
		String validationErrorMessage = "";
		PropertyResourceBundle bundle = getRawConfigData();
		boolean csrfValidationEnabled = StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle,
				"CSRF_VALIDATION_ENABLED", "N"));
		if (csrfValidationEnabled)
		{
			if (StringUtils.isEmpty(ResourceBundleUtils.getString(bundle, "CSRF_TOKEN_FIELD_NAME", "")))
				validationErrorMessage += "CSRF_TOKEN_FIELD_NAME is missing or empty in the Security Configuration even through CSRF Validation is enabled. ";
		}
		return validationErrorMessage;
	}

	/**
	 * Method to validate the Session Timeout
	 * 
	 * @return validation error message
	 */
	private String validationSessionTimeoutConfig()
	{
		String validationErrorMessage = "";
		PropertyResourceBundle bundle = getRawConfigData();
		String idleTimeOut = ResourceBundleUtils.getString(bundle, "IDLE_SESSION_TIMEOUT_SEC", "");
		if (!StringUtils.isNumber(idleTimeOut))
			validationErrorMessage += "IDLE_SESSION_TIMEOUT_SEC is missing or not a valid value in the Security Configuration.";

		return validationErrorMessage;
	}

	/**
	 * Method to validate the xframe option configuration
	 * 
	 * @return String
	 */
	private String validateXFrameOptionConfig()
	{
		String validationErrorMessage = "";
		PropertyResourceBundle bundle = getRawConfigData();
		String xframeOption = ResourceBundleUtils.getString(bundle, "XFRAMEOPTION_DEFAULT", "");
		if (!StringUtils.isEmpty(xframeOption))
		{
			if (!"DENY".equals(xframeOption) && !"SAMEORIGIN".equals(xframeOption))
				validationErrorMessage += "XFRAMEOPTION_DEFAULT has an invalid configured value of '"
						+ xframeOption
						+ "' in the Security Configuration. List of valid values are 'DENY', 'SAMEORIGIN'. Please check the configuration. ";
		}
		return validationErrorMessage;
	}

	/**
	 * Method to validate the login mode
	 * 
	 * @return validation error message
	 */
	private String validateLoginMode()
	{
		String validationErrorMessage = "";
		PropertyResourceBundle bundle = getRawConfigData();
		String mode = ResourceBundleUtils.getString(bundle, "LOGIN_MODE", "");
		if (!StringUtils.isEmpty(mode))
		{
			if (!"AUTO".equals(mode) && !"FORM".equals(mode) && !"BLOCK".equals(mode))
				validationErrorMessage += "LOGIN_MODE has an invalid configured value of '"
						+ mode
						+ "' in the Security Configuration. List of valid values are 'AUTO', 'FORM', 'BLOCK'. Please check the configuration. ";
		}
		return validationErrorMessage;
	}

}
