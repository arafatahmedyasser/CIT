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

import java.util.PropertyResourceBundle;

import com.intellectdesign.canvas.logger.CanvasConfigurationLogger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.utils.PropertyValidations;
import com.intellectdesign.canvas.utils.ResourceBundleUtils;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This is simple Configuration Holder class that enables a set of configurations related to system level preferences.
 * All the configurations are available only as getter methods. The System Preference configuration can be loaded using
 * the Canvas Main Configuration Manager by providing a separate resource that has all the implementation class
 * configurations
 * 
 * To provide the implementation class related configurations, as part of the Canvas Main Configuration Manager,
 * configure the following key -
 * <ul>
 * <li><b>CT_SYSTEM_PREF_BUNDLE</b> : This is the bundle that should be loaded from where the implementation class
 * configuration as detailed below will be identified</li>
 * </ul>
 * 
 * The detailed listing of the keys expected in the security bundle are provided below.
 * <ul>
 * <li><b>Encryption Enable Indicator</b> : This Indicator indicates whether to enable/disable the request and
 * response</li>
 * 
 * @version 1.0
 */
public class SystemPreferenceDescriptor extends PropertyBagConfigurationDescriptor
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 5942368370769666566L;
	private static final CanvasConfigurationLogger LOGGER = new CanvasConfigurationLogger(SystemPreferenceDescriptor.class);

	private String strApplicationLayoutType = null;
	// Change for HEADER_FOOTER Preferences
	private boolean strEnableHeader = true;
	private boolean strEnableFooter = true;
	//
	private String strLanguageCountryCode = null;
	private String strDefaultCurrency = null;
	private String strDefaultTheme = null;
	private String strDefaultFontSize = null;
	private String strServerTimeZone = null;
	private boolean strShowToolAsLinear = false;
	private boolean strEnalbeWidgetShrink = false;
	private String strHandlerPropertiesFile = null;
	private String strValidLayoutCategoriesAppstore = null;
	private int strAllowedWidgetsLimitAppstore = 0;
	private boolean strIncludeAllCategoriesAppstore = false;
	private String strCustomWrkspceMenuItems = null;
	private String strDefaultWrkspce = null;
	private boolean enableDesignCanvasInd = true;
	private String alertTemplateFile = null;
	private String posBtnAlign = null;
	private String negBtnAlign = null;

	private String piggyBackRequest = null;

	private boolean mNavigationEnabled = true;
	private boolean encryptServerCallsInd = true;
	private String invalidChars = null;
	private int maxAjaxReqTime = 0;
	private String emailTemplateFileName = null;
	private String strExcardLayoutFooterType = null;
	private String numberOfYearsForHolidays = null;
	private String weekendList = null;
	private String strDefaultColorPalette = null;

	/**
	 * 
	 * @return
	 */
	public String getStrDefaultColorPalette()
	{
		return strDefaultColorPalette;
	}
	
	/**
	 * 
	 * @param strDefaultColorPalette
	 */
	public void setStrDefaultColorPalette(String strDefaultColorPalette)
	{
		this.strDefaultColorPalette = strDefaultColorPalette;
	}
	
	/**
	 * @return the strExcardLayoutFooterType
	 */
	public String getStrExcardLayoutFooterType()
	{
		return strExcardLayoutFooterType;
	}

	/**
	 * @param strExcardLayoutFooterType the strExcardLayoutFooterType to set
	 */

	/* excard footer */
	/**
	 * @param name
	 */
	public SystemPreferenceDescriptor(String name)
	{
		super(name);
	}

	/**
	 * ref to strApplicationLayoutType
	 * 
	 * @return the strApplicationLayoutType
	 */
	public String getApplicationLayoutType()
	{
		return strApplicationLayoutType;
	}

	// Change for HEADER_FOOTER Preferences starts
	public boolean getEnableHeader()
	{
		return strEnableHeader;
	}

	public boolean getEnableFooter()
	{
		return strEnableFooter;
	}

	// Change for HEADER_FOOTER Preferences ends
	/**
	 * ref to strLanguageCountryCode
	 * 
	 * @return the strLanguageCountryCode
	 */
	public String getLanguageCountryCode()
	{
		return strLanguageCountryCode;
	}

	/**
	 * ref to strDefaultCurrency
	 * 
	 * @return the strDefaultCurrency
	 */
	public String getDefaultCurrency()
	{
		return strDefaultCurrency;
	}

	/**
	 * ref to strDefaultTheme
	 * 
	 * @return the strDefaultTheme
	 */
	public String getDefaultTheme()
	{
		return strDefaultTheme;
	}

	/**
	 * ref to enableAppDrag
	 * 
	 * @return the enableAppDrag
	 */
	public String getDefaultFontSize()
	{
		return strDefaultFontSize;
	}

	/**
	 * ref to responsiveGridInd
	 * 
	 * @return the responsiveGridInd
	 */
	public String getServerTimeZone()
	{
		return strServerTimeZone;
	}

	/**
	 * ref to ShowToolAsLinear
	 * 
	 * @return ShowToolAsLinear
	 */
	public boolean getShowToolAsLinear()
	{

		return strShowToolAsLinear;
	}

	/**
	 * ref to getEnalbeWidgetShrink
	 * 
	 * @return EnalbeWidgetShrink
	 */
	public boolean getEnalbeWidgetShrink()
	{

		return strEnalbeWidgetShrink;
	}

	/**
	 * ref to responsiveGridInd
	 * 
	 * @return the responsiveGridInd
	 */
	public String getHandlerPropertiesFile()
	{
		return strHandlerPropertiesFile;
	}

	/**
	 * ref to strValidLayoutCategoriesAppstore
	 * 
	 * @return the strValidLayoutCategoriesAppstore
	 */
	public String getStrValidLayoutCategoriesAppstore()
	{
		return strValidLayoutCategoriesAppstore;
	}

	/**
	 * ref to strAllowedWidgetsLimitAppstore
	 * 
	 * @return the strAllowedWidgetsLimitAppstore
	 */
	public int getStrAllowedWidgetsLimitAppstore()
	{
		return strAllowedWidgetsLimitAppstore;
	}

	/**
	 * ref to StrIncludeAllCategoriesAppstore
	 * 
	 * @return the strIncludeAllCategoriesAppstore
	 */
	public boolean getStrIncludeAllCategoriesAppstore()
	{
		return strIncludeAllCategoriesAppstore;
	}

	/**
	 * ref to strCustomWrkspceMenuItems
	 * 
	 * @return the strCustomWrkspceMenuItems
	 */
	public String getStrCustomWrkspceMenuItems()
	{
		return strCustomWrkspceMenuItems;
	}

	/**
	 * ref to strDefaultWrkspce
	 * 
	 * @return the strDefaultWrkspce
	 */
	public String getStrDefaultWrkspce()
	{
		return strDefaultWrkspce;
	}

	/**
	 * ref to enableDesignCanvasInd
	 * 
	 * @return the enableDesignCanvasInd
	 */
	public boolean getDesignCanvasEnableInd()
	{
		return enableDesignCanvasInd;
	}

	/**
	 * ref to alertTemplateFile
	 * 
	 * @return the alertTemplateFile
	 */
	public String getAlertTemplateFile()
	{
		return alertTemplateFile;
	}

	/**
	 * ref to posBtnAlign
	 * 
	 * @return posBtnAlign
	 */
	public String getPosBtnAlign()
	{
		return posBtnAlign;
	}

	/**
	 * ref to negBtnAlign
	 * 
	 * @return negBtnAlign
	 */
	public String getNegBtnAlign()
	{
		return negBtnAlign;
	}

	/**
	 * ref to PiggyBackRequired
	 * 
	 * @return PiggyBackRequest
	 */
	public String getPiggyBackRequired()
	{
		return piggyBackRequest;
	}

	/**
	 * ref to NaviagtionEnabled
	 * 
	 * @return the mNavigationEnabled property
	 */
	public boolean getmNaviagtionEnabled()
	{
		return mNavigationEnabled;
	}

	/**
	 * ref to encryptServerCalls
	 * 
	 * @return the encryptServerCalls
	 */
	public boolean getEncryptServerCallsInd()
	{
		return encryptServerCallsInd;
	}

	/**
	 * Method used to get the invalid characters
	 * 
	 * @return invalidChars
	 */

	public String getInvalidChars()
	{
		return invalidChars;
	}

	/**
	 * Method used to get ajax request time out period
	 * 
	 * @return maxAjaxReqTime
	 */
	public int getMaxAjaxReqTime()
	{
		return maxAjaxReqTime;
	}

	/**
	 * Method used to get number of years for fetching holidays
	 * 
	 * @return numberOfYearsForHolidays
	 */
	public String getNumberOfYearsForHolidays()
	{
		return numberOfYearsForHolidays;
	}
	
	/**
	 * Method used to get weekend list
	 * 
	 * @return weekendList
	 */
	public String getWeekendList()
	{
		return weekendList;
	}
	
	/**
	 * ref to emailTemplateFile
	 * 
	 * @return the emailTemplateFile
	 */
	public String getEmailTemplateFile()
	{
		return emailTemplateFileName;
	}
	
	/**
	 * The following method loads the configuration file.
	 * 
	 * @param configSource
	 * @param defaultDescriptor
	 * @throws ConfigurationException
	 */
	public void loadConfiguration(String configSource, IConfigurationDescriptor defaultDescriptor)
			throws ConfigurationException
	{

		super.loadConfiguration(configSource, defaultDescriptor);

		if (!isValidConfiguration())
		{
			throw new ConfigurationException("CONFIG_ERR",
					"Issues were found as part of the system preference configuration information (resource bundle : "
							+ configSource + "). Please refer to the Logs for more details");
		}

		PropertyResourceBundle bundle = getRawConfigData();
		strApplicationLayoutType = ResourceBundleUtils.getString(bundle, "APPLICATION_LAYOUTTYPE", "TAB");
		// Change for HEADER_FOOTER Preferences
		strEnableHeader = StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle, "ENABLE_HEADER", "Y"));
		strEnableFooter = StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle, "ENABLE_FOOTER", "Y"));
		//
		strLanguageCountryCode = ResourceBundleUtils.getString(bundle, "LANG_COUNTRY_CODE", "en_US");
		strDefaultCurrency = ResourceBundleUtils.getString(bundle, "DEFAULT_CURR", "USD");
		strDefaultTheme = ResourceBundleUtils.getString(bundle, "DEFAULT_THEME", "blue blue");
		strDefaultFontSize = ResourceBundleUtils.getString(bundle, "DEFAULT_FONT_SIZE", "Small Small");
		strServerTimeZone = ResourceBundleUtils.getString(bundle, "SERVER_TIMEZONE", "23");
		strShowToolAsLinear = StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle,
				"SHOW_TOOLS_AS_LINEAR", "N"));
		strEnalbeWidgetShrink = StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle,
				"ENABLE_WIDGET_DATA_SHRINK", "N"));

		strHandlerPropertiesFile = ResourceBundleUtils.getString(bundle, "HANDLER_PROPERTIES_FILE", "handler");
		strValidLayoutCategoriesAppstore = ResourceBundleUtils.getString(bundle,
				"DYC_VALID_LAYOUT_CATAGORIES_FOR_APPSTORE", "Stack");
		strAllowedWidgetsLimitAppstore = Integer.parseInt(ResourceBundleUtils.getString(bundle,
				"DYC_ALLOWED_WIDGETS_LIMIT_FOR_APPSTORE", "9"));
		strIncludeAllCategoriesAppstore = StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle,
				"DYC_INCLUDE_ALL_CATAGORY_IN_APPSTORE", "Y"));
		strCustomWrkspceMenuItems = ResourceBundleUtils.getString(bundle, "DYC_CUSTOM_WORKSPACE_MENU_ITEMS", "");
		strDefaultWrkspce = ResourceBundleUtils.getString(bundle, "DYC_DEFAULT_WORKSPACE", "");
		enableDesignCanvasInd = StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle, "DYC_ENABLE_IND",
				"Y"));
		alertTemplateFile = ResourceBundleUtils.getString(bundle, "ALERT_TEMPLATE_PROP_FILE", "message_templates");

		posBtnAlign = ResourceBundleUtils.getString(bundle, "POS_BTN_ALIGN", "LEFT");
		negBtnAlign = ResourceBundleUtils.getString(bundle, "NEG_BTN_ALIGN", "RIGHT");

		mNavigationEnabled = StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle, "M_NAVIGATION_ENABLED",
				"Y"));

		encryptServerCallsInd = StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle,
				"ENCRYPT_SERVER_CALLS", "Y"));

		piggyBackRequest = ResourceBundleUtils.getString(bundle, "ALERT_VIA_PIGGY_BACKFLAG", "N");

		invalidChars = ResourceBundleUtils.getString(bundle, "INVALID_CHARS", "");
		maxAjaxReqTime = Integer.parseInt(ResourceBundleUtils.getString(bundle, "AJAX_REQ_TIMEOUT_PERIOD", "0"));

		/* excard footer */
		strExcardLayoutFooterType = ResourceBundleUtils.getString(bundle, "EXCARD_LAYOUT_FOOTER", "APP");
		/* excard footer */
		/* default color palette for charts */
		strDefaultColorPalette = ResourceBundleUtils.getString(bundle, "DEFAULT_COLOR_PALETTE", "008ED6, F6BD0F, 006600, F26D7D, ABA000, 588526, 008ED6, 9D080D, CC6600, 6DCFF6, AA4643,89A54E, 80699B, 3D96AE, DB843D, 92A8CD, A47D7C, B5CA92, 008ED6, 9D080D, A186BE,CC6600, FDC689, ABA000, F26D7D, FFF200, 0054A6, F7941C, CC3300, 006600, 663300,6DCFF6, 008ED6, F6BD0F, 006600, F26D7D, ABA000, 588526, 008ED6, 9D080D, CC6600,6DCFF6, AA4643, 89A54E, 80699B, 3D96AE, DB843D, 92A8CD, A47D7C, B5CA92, 008ED6,9D080D, A186BE, CC6600, FDC689, ABA000, F26D7D, FFF200, 0054A6, F7941C, CC3300,006600, 663300, 6DCFF6");
		/* default color palette for charts */
		
		weekendList  = ResourceBundleUtils.getString(bundle, "WEEKENDS_TO_HIGHLIGHT", "");		
		emailTemplateFileName = ResourceBundleUtils.getString(bundle, "EMAIL_TEMPLATE_FILE_NAME", "mail_templates");
		
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
		LOGGER.ctdebug("CTCOM00023");
		timer.startTimer(getClass(), "isValidConfiguration");
		PropertyResourceBundle bundle = getRawConfigData();
		PropertyValidations validator = new PropertyValidations();

		errorBuilder.append(validator.validateAppLayout("APPLICATION_LAYOUTTYPE", bundle));
		// Change for HEADER_FOOTER Preferences
		errorBuilder.append(validator.validateIndicators("ENABLE_HEADER", bundle));
		errorBuilder.append(validator.validateIndicators("ENABLE_FOOTER", bundle));
		//
		errorBuilder.append(validator.validateLangCode("LANG_COUNTRY_CODE", bundle));
		errorBuilder.append(validator.validateCurrency("DEFAULT_CURR", bundle));
		errorBuilder.append(validator.validateTheme("DEFAULT_THEME", bundle));
		errorBuilder.append(validator.validateSize("DEFAULT_FONT_SIZE", bundle));
		errorBuilder.append(validator.validateNumbers("SERVER_TIMEZONE", bundle));
		errorBuilder.append(validator.validateConfig("HANDLER_PROPERTIES_FILE", bundle));
		errorBuilder.append(validator.validateIndicators("SHOW_TOOLS_AS_LINEAR", bundle));
		errorBuilder.append(validator.validateIndicators("ENABLE_WIDGET_DATA_SHRINK", bundle));
		errorBuilder.append(validator.validateIndicators("M_NAVIGATION_ENABLED", bundle));
		errorBuilder.append(validator.validateIndicators("ENCRYPT_SERVER_CALLS", bundle));
		errorBuilder.append(validator.validateIndicators("DYC_ENABLE_IND", bundle));
		errorBuilder.append(validator.validateAppLayout("EXCARD_LAYOUT_FOOTER", bundle));
		errorBuilder.append(validator.validateColorPalette("DEFAULT_COLOR_PALETTE", bundle));		
		errorBuilder.append(validator.validateWeekEnds("WEEKENDS_TO_HIGHLIGHT", bundle, false));		
		errorBuilder.append(validator.validateConfig("EMAIL_TEMPLATE_FILE_NAME", bundle));
		if (errorBuilder.length() == 0	&& StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle, "DYC_ENABLE_IND", "Y")))
		{
			errorBuilder.append(validator.validateIndicators("DYC_INCLUDE_ALL_CATAGORY_IN_APPSTORE", bundle));
			errorBuilder.append(validator.validateNumbers("DYC_ALLOWED_WIDGETS_LIMIT_FOR_APPSTORE", bundle));
			errorBuilder.append(validator.validateColumnLayout("DYC_VALID_LAYOUT_CATAGORIES_FOR_APPSTORE", bundle));
			errorBuilder.append(validator.validateConfig("DYC_CUSTOM_WORKSPACE_MENU_ITEMS", bundle));
			errorBuilder.append(validator.validateConfig("DYC_DEFAULT_WORKSPACE", bundle));
		}
		validationStatus = errorBuilder.length() == 0;

		if (validationStatus)
			LOGGER.ctdebug("CTCOM00024");
		else
		{
			LOGGER.cterror("CTCOM00025", errorBuilder.toString());
		}
		timer.endTimer();
		return validationStatus;
	}
}
