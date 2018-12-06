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
 */
package com.intellectdesign.canvas.jsmetadata.provider;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.constants.preferences.PreferenceConstants;
import com.intellectdesign.canvas.data.conversion.util.HashMapToJSONConverter;
import com.intellectdesign.canvas.deviceband.DeviceBand;
import com.intellectdesign.canvas.deviceband.DeviceBandRegistry;
import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.jsmetadata.ICanvasJsDataProvider;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.login.sessions.SessionManager;
import com.intellectdesign.canvas.pref.amount.AmountFormatterManager;
import com.intellectdesign.canvas.pref.date.DateFormatterManager;
import com.intellectdesign.canvas.preference.GlobalPreferencesUtil;
import com.intellectdesign.canvas.ratecard.IRateCard;
import com.intellectdesign.canvas.ratecard.IRateCardFactory;

/**
 * Class used to provide Canvas Js Preferences Data.
 * 
 * @version 1.0
 */
public class CanvasJsPreferencesDataProvider implements ICanvasJsDataProvider
{

	/**
	 * Method to return the JavaScriptData.
	 * 
	 * @param request
	 * @return String
	 * @throws ProcessingErrorException
	 * @exception instantiationException,classNotFoundException,illegalAccessException
	 */
	public String getJavaScriptData(HttpServletRequest request) throws ProcessingErrorException
	{
		logger.ctdebug("CTRND00092");
		String jsMetadataString = "";
		String sDefaultBankCurrency = null;
		String sAmountFormat = null;
		String sDateFormat = null;
		String jDateFormat = null;

		HashMap<String, String> timeFormatTable = new HashMap<String, String>();
		timeFormatTable.put("HH:mm:ss", "H:i:s");
		timeFormatTable.put(PreferenceConstants.DEFAULT_TIME_FORMAT, "h:i:s a");

		SessionInfo lSessionInfo = null;
		SessionManager lSessionManager = SessionManager.getInstance();
		lSessionInfo = lSessionManager.getUserSessionInfo(request);

		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		IRateCard rateCard = null;
		String rateFactoryClassName = null;

		try
		{
			rateFactoryClassName = configMgr.getImplClassDescriptor().getRateCardFactoryClass();
			if (!rateFactoryClassName.isEmpty())
			{
				IRateCardFactory rateCardFactory = (IRateCardFactory) Class.forName(rateFactoryClassName).newInstance();
				rateCard = rateCardFactory.getDefaultRateCard();
			}
		} catch (ClassNotFoundException classNotFoundException)
		{
			logger.cterror("CTRND00329", classNotFoundException, rateFactoryClassName);
			throw new ProcessingErrorException(classNotFoundException);
		} catch (InstantiationException instantiationException)
		{
			logger.cterror("CTRND00330", instantiationException, rateFactoryClassName);
			throw new ProcessingErrorException(instantiationException);
		} catch (IllegalAccessException illegalAccessException)
		{
			logger.cterror("CTRND00331", illegalAccessException, rateFactoryClassName);
			throw new ProcessingErrorException(illegalAccessException);
		}

		boolean isRTLDirection = ("RTL".equalsIgnoreCase(lSessionInfo.direction));
		jsMetadataString += "iportal.preferences.setLanguageDirectionIsRTL(" + isRTLDirection + ");";

		String enableSecondaryLanguage = (lSessionInfo.mEnaSecLang == null ? PreferenceConstants.DEFAULT_ENABLE_SECONDARY_LANGUAGE
				: lSessionInfo.mEnaSecLang);
		jsMetadataString += "iportal.preferences.setSecondaryLanguageEnabled('" + enableSecondaryLanguage.toLowerCase()
				+ "');";

		if (lSessionInfo.mAmtFormat != null && !lSessionInfo.mAmtFormat.trim().equals(""))
		{
			sAmountFormat = lSessionInfo.mAmtFormat;
		} else
		{
			sAmountFormat = PreferenceConstants.DEFAULT_AMOUNT_FORMAT;
		}
		jsMetadataString += "iportal.preferences.setAmountFormat('" + sAmountFormat + "');";

		String sPrimaryLanguage = (lSessionInfo.mLanguage == null ? PreferenceConstants.DEFAULT_PRIMARY_LANGUAGE
				: lSessionInfo.mLanguage);
		jsMetadataString += "iportal.preferences.setPrimaryLang('" + sPrimaryLanguage + "');";

		String sThemeId = lSessionInfo.themeId;
		jsMetadataString += "iportal.preferences.setCurrentTheme('" + sThemeId + "');";
		jsMetadataString += "iportal.preferences.setFontSize('" + lSessionInfo.fontsizeId + "');";
		String sSecondaryLanguage = (lSessionInfo.mSecLang == null ? PreferenceConstants.DEFAULT_SECONDARY_LANGUAGE
				: lSessionInfo.mSecLang);
		jsMetadataString += "iportal.preferences.setSecondaryLang('" + sSecondaryLanguage + "');";

		if (lSessionInfo.mDateFormat != null && !lSessionInfo.mDateFormat.trim().equals(""))
		{
			sDateFormat = lSessionInfo.mDateFormat;

		} else
		{
			sDateFormat = PreferenceConstants.DEFAULT_DATE_FORMAT;
		}
		// get the JavaDateformat from DateFormat Manager class
		jDateFormat = DateFormatterManager.getJavaDateFormat(sDateFormat);
		// get the dateformat json string from DateFormat Manager class
		String sDateFormatJson = DateFormatterManager.getDateFormatJson(jDateFormat);
		jsMetadataString += "iportal.preferences.setDateFormatJson(" + sDateFormatJson + ");";
		jsMetadataString += "iportal.preferences.setDateFormat('" + jDateFormat + "');";

		String sTimeFormat = timeFormatTable
				.get((lSessionInfo.timeFormat == null ? PreferenceConstants.DEFAULT_TIME_FORMAT
						: lSessionInfo.timeFormat));
		if (sTimeFormat == null)
		{
			sTimeFormat = PreferenceConstants.DEFAULT_PREF_TIME_FORMAT;
		}
		jsMetadataString += "iportal.preferences.setTimeFormat('" + sTimeFormat + "');";

		String loginMode = (lSessionInfo.loginMode == null ? PreferenceConstants.DEFAULT_LOG_IN_MODE
				: lSessionInfo.loginMode);

		jsMetadataString += "iportal.preferences.setLoginMode('" + loginMode + "');";

		String sApplicationLayout = configMgr.getSystemPrefDescriptor().getApplicationLayoutType();
		jsMetadataString += "iportal.preferences.setApplicaionLayout('" + sApplicationLayout + "');";

		// Change for HEADER_FOOTER Preferences
		boolean sEnableHeader = configMgr.getSystemPrefDescriptor().getEnableHeader();
		jsMetadataString += "iportal.preferences.setEnableHeader(" + sEnableHeader + ");";
		boolean sEnableFooter = configMgr.getSystemPrefDescriptor().getEnableFooter();
		jsMetadataString += "iportal.preferences.setEnableFooter(" + sEnableFooter + ");";
		//

		String sGoogleMapZoom = configMgr.getCompPrefDescriptor().getGoogleMapZoom();
		jsMetadataString += "iportal.preferences.setGoogleMapZoom('" + sGoogleMapZoom + "');";

		String sNotesMessage = lSessionInfo.notesMsg;
		jsMetadataString += "iportal.preferences.setNotesMessage('" + sNotesMessage + "');";

		boolean sEnableAppDrag = configMgr.getCompPrefDescriptor().getEnableAppDrag();
		jsMetadataString += "iportal.preferences.setAppDrag(" + sEnableAppDrag + ");";

		boolean sEnableLayoutResize = configMgr.getCompPrefDescriptor().getEnableLayoutResize();
		jsMetadataString += "iportal.preferences.setLayoutResize(" + sEnableLayoutResize + ");";

		String sTimeZone = (lSessionInfo.mTimeZoneId == null ? PreferenceConstants.DEFAULT_TIME_ZONE
				: lSessionInfo.mTimeZoneId);
		jsMetadataString += "iportal.preferences.setTimeZone('" + sTimeZone + "');";

		String sStartUpWorkspace = (lSessionInfo.mStartUpWorkSpaceId == null ? PreferenceConstants.DEFAULT_WORK_SPACE
				: lSessionInfo.mStartUpWorkSpaceId);
		jsMetadataString += "iportal.preferences.setStartupWorkspace('" + sStartUpWorkspace + "');";

		/**
		 * String sStandardNoteTxtReq = CTProperties.getProperty("STANDARDTEXTNOTE_REQ"); jsMetadataString +=
		 * "iportal.preferences.setStandardNoteReq('" + sStandardNoteTxtReq + "');";
		 */
		String sRateCard = rateCard != null ? rateCard.getRateCardId() : "";
		jsMetadataString += "iportal.preferences.setRateCard('" + sRateCard + "');";

		String sEquivalentCurrency = rateCard != null ? rateCard.getBaseCurrency() : "USD";
		jsMetadataString += "iportal.preferences.setEquivalentCurrency('" + sEquivalentCurrency + "');";

		GlobalPreferencesUtil globalPreferencesUtil = new GlobalPreferencesUtil();
		String sTimeZoneOffsetId = globalPreferencesUtil.loadGlobalPreferences(lSessionInfo.mTimeZoneId);
		jsMetadataString += "iportal.preferences.setTimeZoneOffset('" + sTimeZoneOffsetId + "');";

		String serverTimezonecode = configMgr.getSystemPrefDescriptor().getServerTimeZone();
		String sServerTimeZoneOffset = globalPreferencesUtil.loadGlobalPreferences(serverTimezonecode);
		jsMetadataString += "iportal.preferences.setServerTimeZoneOffset('" + sServerTimeZoneOffset + "');";

		/**
		 * setting default templates path from Implementation properties or else from CT properties file
		 * 
		 */
		String templatesPathCT = configMgr.getCompPrefDescriptor().getCTTemplatesRelativeURL();

		jsMetadataString += "iportal.preferences.setTemplatesPath('" + templatesPathCT + "');";

		HashMap ccysmap = new HashMap();
		ccysmap.put("CCYS", rateCard.getAllCurrencies());
		String sRateCardCurrencies = HashMapToJSONConverter.convertHashMapToJSONFormat(ccysmap);
		jsMetadataString += "iportal.preferences.setRateCardCurrencies('" + sRateCardCurrencies + "');";
		/**
		 * get the AmountFormat Json String from AmountFormatterManager class
		 * 
		 */
		String sAmountFormatJson = AmountFormatterManager.getAmountFormatJson(sAmountFormat);
		jsMetadataString += "iportal.preferences.setAmountFormatJson(" + sAmountFormatJson + ");";

		/**
		 * String sFormContainerRenderer = CTProperties.getProperty("FORM_CONTAINER_RENDERER"); jsMetadataString +=
		 * "iportal.preferences.setFormContainerRenderer('" + sFormContainerRenderer + "');";
		 * 
		 * String sMenuRenderer = CTProperties.getProperty("APPLICATION_MENU_RENDERER"); jsMetadataString +=
		 * "iportal.preferences.setMenuRenderer('" + sMenuRenderer + "');";
		 */
		String sPositiveBtnAlign = configMgr.getSystemPrefDescriptor().getPosBtnAlign();
		jsMetadataString += "iportal.preferences.setPostiveBtnAlign('" + sPositiveBtnAlign + "');";

		String sNegativeBtnAlign = configMgr.getSystemPrefDescriptor().getNegBtnAlign();
		jsMetadataString += "iportal.preferences.setNegativeBtnAlign('" + sNegativeBtnAlign + "');";

		String sDateColumnAlignment = configMgr.getCompPrefDescriptor().getDateColumnAlignent();
		jsMetadataString += "iportal.preferences.setDateColumnAlignment('" + sDateColumnAlignment + "');";

		String sAmountColumnAlignment = configMgr.getCompPrefDescriptor().getAmountColumnAlignent();
		jsMetadataString += "iportal.preferences.setAmountColumnAlignment('" + sAmountColumnAlignment + "');";

		String sDateTimeColumnAlignment = configMgr.getCompPrefDescriptor().getDateTimeColumnAlignent();
		jsMetadataString += "iportal.preferences.setDateTimeColumnAlignment('" + sDateTimeColumnAlignment + "');";

		String defaultRecsPerPage = configMgr.getCompPrefDescriptor().getDefaultRecordsPerPage();
		jsMetadataString += "iportal.preferences.setDefaultRecsPerPage('" + defaultRecsPerPage + "');";

		String defaultPagesDisplay = configMgr.getCompPrefDescriptor().getDefaultPagesDisplay();
		jsMetadataString += "iportal.preferences.setDefaultPagesDisplay('" + defaultPagesDisplay + "');";

		String maximumFileSize = configMgr.getCompPrefDescriptor().getMaximumFileSize();
		jsMetadataString += "iportal.preferences.setMaximumFileSize('" + maximumFileSize + "');";

		String sLastLoginDateTime = "";
		if (lSessionInfo.timeFormat == null)
		{
			lSessionInfo.timeFormat = PreferenceConstants.DEFAULT_PREF_TIME_FORMAT;
		}
		String dateFormat = jDateFormat + " " + lSessionInfo.timeFormat;
		// Performing a null check for the last Logged In user to avoid blank home screen.
		if (lSessionInfo.lastLogin != null && lSessionInfo.lastLogin.length() > 1)
		{
			try
			{
				if ((lSessionInfo.lastLogin != null) && (lSessionInfo.lastLogin != ""))
				{
					Date date = globalPreferencesUtil.convertStringtoDate(lSessionInfo.lastLogin);
					sLastLoginDateTime = globalPreferencesUtil.userPrefFormatDateAndTime(dateFormat,
							lSessionInfo.mTimeZoneId, date);
				} else
				{
					sLastLoginDateTime = "--";
				}

			} catch (Exception exception)
			{
				sLastLoginDateTime = " --";
				logger.cterror("CTRND00424", exception, rateFactoryClassName);
				throw new ProcessingErrorException(exception);
			}
		}
		jsMetadataString += "iportal.preferences.setLastLoginDateTime('" + sLastLoginDateTime + "');";

		String firstName = lSessionInfo.firstName == null ? "" : lSessionInfo.firstName;
		if (!firstName.isEmpty())
		{
			firstName = Character.toUpperCase(firstName.charAt(0)) + firstName.substring(1);
		}
		String lastName = lSessionInfo.lastName == null ? "" : lSessionInfo.lastName;
		String sLoggedInUserName = firstName.concat(" ").concat(lastName);
		jsMetadataString += "iportal.preferences.setLoggedInUserName('" + sLoggedInUserName + "');";

		CacheManager cacheManager = CacheManager.getInstance();
		List<Map> bankProfileList = cacheManager.getDataFromCache(request.getSession(), "DEFAULT_BANK_PROFILE");
		for (Object object : bankProfileList)
		{
			Map bankProfileMap = (HashMap) object;
			sDefaultBankCurrency = (String) bankProfileMap.get("OD_BANK_REF_CURR");
		}
		if (sDefaultBankCurrency == null)
		{
			sDefaultBankCurrency = rateCard.getCardCurrency();
		}
		if ((sDefaultBankCurrency == null))
			sDefaultBankCurrency = "";
		jsMetadataString += "iportal.systempreferences.setDefaultBankCCY('" + sDefaultBankCurrency + "');";

		/**
		 * String sDefaultBankRateCard = CTProperties.getProperty("DEFAULT_RATE_CARD"); jsMetadataString +=
		 * "iportal.systempreferences.setDefaultRateCard('" + sDefaultBankRateCard + "');";
		 */
		String sGoogleMapUrl = configMgr.getCompPrefDescriptor().getGoogleMapUri();
		jsMetadataString += "iportal.systempreferences.setGoogleLoaderUri('" + sGoogleMapUrl + "');";

		/**
		 * String sRateMaxPrecision = CTProperties.getProperty("RATE_MAX_PRECISION"); jsMetadataString +=
		 * "iportal.systempreferences.setRateMaxPrecision('" + sRateMaxPrecision + "');";
		 */
		// AlertViaPiggyBack flag enable or disable-Start
		String sAlertPiggyBackFlag = configMgr.getSystemPrefDescriptor().getPiggyBackRequired();
		jsMetadataString += "iportal.systempreferences.setAlertViaPiggyBack('" + sAlertPiggyBackFlag + "');";
		// AlertViaPiggyBack flag enable or disable-End

		String sSessionTimeOutUrl = request.getContextPath() + configMgr.getSecurityDescriptor().getExpiryPageURI();
		jsMetadataString += "iportal.systempreferences.setSessionTimeOutUrl('" + sSessionTimeOutUrl + "');";

		int sAjaxTimeOutPeriod = configMgr.getSystemPrefDescriptor().getMaxAjaxReqTime();
		jsMetadataString += "iportal.systempreferences.setAjaxRequestTimeOutPeriod('" + sAjaxTimeOutPeriod + "');";

		int sSessionTimeOutInterval = request.getSession().getMaxInactiveInterval();
		jsMetadataString += "iportal.systempreferences.setSessionTimeOutInterval('" + sSessionTimeOutInterval + "');";

		boolean isSimulationMode = Boolean.valueOf(lSessionInfo.isSimulationMode);
		jsMetadataString += "iportal.systempreferences.setSimulationMode('" + isSimulationMode + "');";

		/**
		 * String sLiveGridNearByLimit = CTProperties.getProperty("LIVEGRID_NEARLIMIT"); jsMetadataString +=
		 * "iportal.systempreferences.setLiveGridNearLimit('" + sLiveGridNearByLimit + "');";
		 */
		boolean sLogRequestIdAsRef = configMgr.getSecurityDescriptor().canUseRequestIdAsReference();
		jsMetadataString += "iportal.systempreferences.setRequestIdLogged(" + sLogRequestIdAsRef + ");";

		String homePageURI = configMgr.getSecurityDescriptor().getHomePageURI();// Fix for Header Logo
		jsMetadataString += "iportal.systempreferences.setHomePageURI('" + homePageURI + "');";

		/* Customizing Copyright message */
		String copyRightMsg = configMgr.getCompPrefDescriptor().getCopyRightMsg();
		jsMetadataString += "iportal.systempreferences.setCopyRightMsg('" + copyRightMsg + "');";

		String csrfUniqueID = lSessionInfo.csrfId;
		jsMetadataString += "iportal.systempreferences.setCSRFUniqueId('" + csrfUniqueID + "');";
		
		String csrfTokenName = configMgr.getSecurityDescriptor().getCsrfTokenFieldName();
		jsMetadataString += "iportal.systempreferences.setCSRFKeyName('" + csrfTokenName + "');";
		
		boolean sToolsAsLinear = configMgr.getSystemPrefDescriptor().getShowToolAsLinear();
		jsMetadataString += "iportal.systempreferences.setToolsAsLinearFlag(" + sToolsAsLinear + ");";

		boolean sWidgetDataShrink = configMgr.getSystemPrefDescriptor().getEnalbeWidgetShrink();
		jsMetadataString += "iportal.systempreferences.setEnableWidgetDataShrinkFlag(" + sWidgetDataShrink + ");";

		int sWidgetdefaultMaxHeight = configMgr.getCompPrefDescriptor().getMaxWgtHeight();
		jsMetadataString += "iportal.systempreferences.setDefaultWidgetMaxHeight('" + sWidgetdefaultMaxHeight + "');";

		int sWidgetdefaultMinHeight = configMgr.getCompPrefDescriptor().getMinWgtHeight();
		jsMetadataString += "iportal.systempreferences.setDefaultWidgetMinHeight('" + sWidgetdefaultMinHeight + "');";

		/**
		 * String strOnDemandCheck = CTProperties.getProperty("ENABLE_ON_DEMAND_JS");
		 * 
		 * boolean bOnDemandJSRequired = Boolean.valueOf(strOnDemandCheck.trim()).booleanValue(); jsMetadataString +=
		 * "iportal.systempreferences.setOnDemandJSRequired('" + bOnDemandJSRequired + "');";
		 * 
		 * String sOnDemandCompressPath = CTProperties.getProperty("ONDEMAND_COMPRESSION_PATH"); jsMetadataString +=
		 * "iportal.systempreferences.setOnDemandCompressPath('" + sOnDemandCompressPath + "');";
		 */
		boolean sJsCompressRequired = configMgr.getWebUtilDescriptor().getCompressJSFlag();
		jsMetadataString += "iportal.systempreferences.setJsCompressionFlag(" + sJsCompressRequired + ");";

		boolean sContextMsgEnabled = configMgr.getCompPrefDescriptor().getContextMsgEnable();
		jsMetadataString += "iportal.systempreferences.setContexMsgEnabled(" + sContextMsgEnabled + ");";

		String sListViewPageSize = configMgr.getCompPrefDescriptor().getListViewPageSize();
		jsMetadataString += "iportal.systempreferences.setPageSizeForPagination('" + sListViewPageSize + "');";

		String sBuildTimeStampValue = "332323";
		jsMetadataString += "iportal.systempreferences.setBuildTimeStamp('" + sBuildTimeStampValue + "');";

		boolean isDesignCanvasEnabled = configMgr.getSystemPrefDescriptor().getDesignCanvasEnableInd();
		jsMetadataString += "iportal.systempreferences.setDesignCanvasInd(" + isDesignCanvasEnabled + ");";

		DeviceBandRegistry deviceBandRegistry = DeviceBandRegistry.getInstance();
		String device = lSessionInfo.deviceType;
		int channel = lSessionInfo.channelId;
		String framework = null;
		Boolean isHybrid = lSessionInfo.isHybrid();

		try
		{
			DeviceBand selectedBand;
			selectedBand = (DeviceBand) deviceBandRegistry.lookup(device);
			framework = selectedBand.getTargetFramework().toString();

		} catch (BaseException e)
		{
			logger.cterror("CTRND00384", e);

		}

		jsMetadataString += "iportal.systempreferences.setDevice('" + device + "');";

		jsMetadataString += "iportal.systempreferences.setChannel('" + channel + "');";

		jsMetadataString += "iportal.systempreferences.setFramework('" + framework + "');";
		jsMetadataString += "iportal.systempreferences.setHybridInd('" + isHybrid + "');";

		String rawDateFormat = lSessionInfo.mDateFormat == null ? PreferenceConstants.DEFAULT_DATE_FORMAT
				: lSessionInfo.mDateFormat;
		if (rawDateFormat == "" || rawDateFormat == null || rawDateFormat.isEmpty())
		{
			// no dateformat mapping found, switching to default date format
			rawDateFormat = PreferenceConstants.DEFAULT_PREF_DATE_FORMAT;

		}
		jsMetadataString += "iportal.systempreferences.setRawDateFormat('" + rawDateFormat + "');";

		boolean respGridInd = configMgr.getCompPrefDescriptor().getResponsiveGridInd();
		jsMetadataString += "iportal.systempreferences.setResponsiveGridInd(" + respGridInd + ");";

		String respGridPercent = configMgr.getCompPrefDescriptor().getResponsiveWidth();
		jsMetadataString += "iportal.systempreferences.setResponsiveGridPercent('" + respGridPercent + "');";

		boolean ismNavEnabled = configMgr.getSystemPrefDescriptor().getmNaviagtionEnabled();
		jsMetadataString += "iportal.systempreferences.setNavigationEnabledInd(" + ismNavEnabled + ");";

		boolean isServerCallsEncrypted = configMgr.getSystemPrefDescriptor().getEncryptServerCallsInd();
		jsMetadataString += "iportal.systempreferences.setNeedEncryption(" + isServerCallsEncrypted + ");";

		String actionBtnOrder = configMgr.getCompPrefDescriptor().getActionButtonOrder().toString();
		jsMetadataString += "iportal.preferences.setActionButtonOrder('" + actionBtnOrder + "');";
		String ExcardFooterType = configMgr.getSystemPrefDescriptor().getStrExcardLayoutFooterType();
		jsMetadataString += "iportal.preferences.setExcardFooterType('" + ExcardFooterType + "');";

		// Retrieving the weekend list from system preferences
		String weekendList = configMgr.getSystemPrefDescriptor().getWeekendList();
		jsMetadataString += "iportal.preferences.setWeekEndList('" + weekendList + "');";

		int mPageSize = configMgr.getCompPrefDescriptor().getDefaultPageSizeForMobile();
		jsMetadataString += "iportal.systempreferences.setDefaultPagesizeForMobile('" + mPageSize + "');";

		boolean launchLookUpWithOneRecord = configMgr.getCompPrefDescriptor().getLaunchLookupWithOneRecord();
		jsMetadataString += "iportal.preferences.setLaunchLookupWithOneRecord(" + launchLookUpWithOneRecord + ");";

		boolean negativeSignInAmountColumn = configMgr.getCompPrefDescriptor().getNegativeSignInAmountColumn();
		jsMetadataString += "iportal.preferences.setNegativeSignInAmountColumn(" + negativeSignInAmountColumn + ");";

		int IdleSessionTimeoutInSeconds = configMgr.getSecurityDescriptor().getIdleSessionTimeoutInSeconds();
		IdleSessionTimeoutInSeconds = sSessionTimeOutInterval - IdleSessionTimeoutInSeconds;
		jsMetadataString += "iportal.systempreferences.setIdleSessionTimeoutInSeconds(" + IdleSessionTimeoutInSeconds
				+ ");";

		logger.ctdebug("CTRND00093", jsMetadataString);
		logger.ctdebug("CTRND00094");
		return jsMetadataString;
	}

	private static final Logger logger = Logger.getLogger(CanvasJsPreferencesDataProvider.class);

}