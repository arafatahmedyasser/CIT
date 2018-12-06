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
cbx.namespace("iportal");
/**
 * 
 */
iportal.preferences = function ()
{
	// var BOOLEAN_YES = 'Y';
	
	/*excard footer */
	
	var EXCARDFOOTER=null;
	
	/*excard footer */
	var PRIMARY_LANG = null;
	var THEME_ID = null;
	var FONTSIZE_ID = null;
	var SECONDARY_LANG = null;
	var ENABLE_SECONDARY_LANG = null;
	var AMOUNT_FORMAT = 'USA';
	var DATE_FORMAT = 'dd/MM/yyyy';
	var TIME_FORMAT='h:i:s a';
	var LAYOUT = null;
	var HEADER = true;
	var FOOTER = true;
	var DEVICE = null;
	var GOOGLE_ZOOM = null;
	var NOTES_DTL = null;
	var ENABLE_APP_DRAG = false;
	var ENABLE_LAYOUT_RESIZE = false;
	var PARAMS = "";
	var TIME_ZONE = null;
	var TIME_ZONE_OFFSET = null;
	var SERVER_TIME_ZONE_OFFSET = null;
	var START_UP_WORKSPACE = null;
	var RATECARD = null;
	var EQUIVALENT_CURRENCY = null;
	var RATECARD_CURRENCIES = null;
	var isRTL = null;
	var DATE_COLUMN_ALIGNMENT = null;
	var MAXIMUM_FILE_SIZE = 10;
	var AMOUNT_COLUMN_ALIGNMENT = null;
	var DATE_TIME_COLUMN_ALIGNMENT = null;
	var GRID_HEADER_HEIGHT = 22;
	var GRID_CELL_HEIGHT = 21;
	var LINE_HEIGHT = 13;
	var MULTISELECT_ROWHEIGHT = 20;
	var ICONPANELWIDTH = 30;
	var TITLEHEIGHT = 20;
	var workspaceHeaderHeight = 60;
	var workspaceFooterHeight = 30;
	var formContainerRenderer = null;
	var menuRenderer = null;
	var averageFontWidth = 6.23;
	var CORP_LOGO_CHECK = null;
	var STANDARDTEXTNOTE_REQ = null;
	var posBtnAlign = null;
	var negBtnAlign = null;
	var USER_LAST_LOGIN_DATE = null;
	var LOGGED_IN_USER_NAME = null;
	var LABEL_CHAR_WIDTH = 6;
	var defaultRecordsPerPage = 10;
	var defaultPagesDisplay = 5;
	var wsMenuPanelHeightObj = {};
	var LAST_UPD_NOTES_DTL_TIME = '';
	var actionBtnOrder = null;
	var LOGGED_MODE = null;
	var WEEKENDS = null;
	var launchLookupWithOneRecord = false;
	var NEGATIVE_SIGN_IN_AMOUNT_COLUMN = true;
	var AMOUNT_FORMAT_JSON = {};
	var DATE_FORMAT_JSON = {};
	var TEMPLATES_PATH = null;
	return cbx.apply({
		
		/*excard footer */
		getStrExcardLayoutFooterType : function ()
		{
			return EXCARDFOOTER;
		},
		setExcardFooterType : function (ExcardFooterType)
		{
			EXCARDFOOTER = ExcardFooterType;
		},
		/*excard footer */
		getStandardNoteReq : function ()
		{
			return STANDARDTEXTNOTE_REQ;
		},
		setStandardNoteReq : function (value)
		{
			STANDARDTEXTNOTE_REQ = value;
		},
		getPrimaryLang : function ()
		{
			return PRIMARY_LANG;
		},
		setPrimaryLang : function (sPrimaryLanguage)
		{
			PRIMARY_LANG = sPrimaryLanguage;
		},
		getCurrentTheme : function ()
		{
			return THEME_ID;
		},
		setCurrentTheme : function (sThemeId)
		{
			THEME_ID = sThemeId;
		},
		getFontSize : function ()
		{
			return FONTSIZE_ID;
		},
		setFontSize : function (sFontSizeId)
		{
			FONTSIZE_ID = sFontSizeId;
		},
		getSecondaryLang : function ()
		{
			return SECONDARY_LANG;
		},
		setSecondaryLang : function (sSecondaryLanguage)
		{
			SECONDARY_LANG = sSecondaryLanguage;
		},
		isSecondayLangEnabled : function ()
		{
			return ENABLE_SECONDARY_LANG;
		},
		setSecondaryLanguageEnabled : function (sEnabledSecondaryLanguage)
		{
			ENABLE_SECONDARY_LANG = sEnabledSecondaryLanguage;
		},
		getAmountFormat : function ()
		{
			return AMOUNT_FORMAT;
		},
		setAmountFormat : function (sAmountFormat)
		{
			AMOUNT_FORMAT = sAmountFormat;
		},
		getDateFormat : function ()
		{
			return DATE_FORMAT;
		},
		setDateFormat : function (sDateFormat)
		{
			DATE_FORMAT = sDateFormat;
		},
		getTimeFormat:function()
		{
			return TIME_FORMAT;
		},
		setTimeFormat:function(sTimeFormat)
		{
			TIME_FORMAT= sTimeFormat;
		},
		getTimeZone : function ()
		{
			return TIME_ZONE;
		},
		setTimeZone : function (sTimeZone)
		{
			TIME_ZONE = sTimeZone;
		},
		getStartupWorkspace : function ()
		{
			return START_UP_WORKSPACE;
		},
		setStartupWorkspace : function (sStartUpWorkspace)
		{
			START_UP_WORKSPACE = sStartUpWorkspace;
		},
		getTimeZoneOffset : function ()
		{
			return TIME_ZONE_OFFSET;
		},
		setTimeZoneOffset : function (sTimeZoneOffsetId)
		{
			TIME_ZONE_OFFSET = sTimeZoneOffsetId;
		},
		
		getTemplatesPath : function ()
		{
			return TEMPLATES_PATH;
		},
		setTemplatesPath : function (templatesPath)
		{
			TEMPLATES_PATH = templatesPath;
		},
		
		
		getServerTimeZoneOffset : function ()
		{
			return SERVER_TIME_ZONE_OFFSET;
		},
		setServerTimeZoneOffset : function (sServerTimeZoneOffset)
		{
			SERVER_TIME_ZONE_OFFSET = sServerTimeZoneOffset;
		},
		getRateCard : function ()
		{
			return RATECARD;
		},
		setRateCard : function (sRateCard)
		{
			RATECARD = sRateCard;
		},
		getEquivalentCurrency : function ()
		{
			return EQUIVALENT_CURRENCY;
		},
		setEquivalentCurrency : function (sEquivalentCurrency)
		{
			EQUIVALENT_CURRENCY = sEquivalentCurrency;
		},
		getRatecardCurrencies : function ()
		{
			return RATECARD_CURRENCIES;
		},
		setRateCardCurrencies : function (sRateCardCurrencies)
		{
			RATECARD_CURRENCIES = cbx.decode(sRateCardCurrencies).CCYS;
		},
		isLangDirectionRTL : function ()
		{
			return isRTL;
		},
		setLanguageDirectionIsRTL : function (isRTLDirection)
		{
			isRTL = isRTLDirection;
		},
		getGridHeaderHeight : function ()
		{
			return GRID_HEADER_HEIGHT;
		},
		getGridCellHeight : function ()
		{
			return GRID_CELL_HEIGHT;
		},
		getTextAreaRowHeight : function ()
		{
			return LINE_HEIGHT;
		},
		setGridHeaderHeight : function (value)
		{
			if (value == parseInt(value))
			{
				GRID_HEADER_HEIGHT = parseInt(value);
			}
		},
		setGridCellHeight : function (value)
		{
			if (value == parseInt(value))
			{
				GRID_CELL_HEIGHT = value;
			}
		},
		setTextAreaRowHeight : function (value)
		{
			if (value == parseInt(value))
			{
				LINE_HEIGHT = value;
			}
		},
		setMultiSelectRowHeight : function (value)
		{
			if (value == parseInt(value))
			{
				MULTISELECT_ROWHEIGHT = value;
			}
		},
		/**
		 * return height of each list item in multiselect components in item selector
		 */
		getMultiSelectRowHeight : function ()
		{
			return MULTISELECT_ROWHEIGHT
		},
		setIconPanelwidth : function (value)
		{
			if (value == parseInt(value))
			{
				ICONPANELWIDTH = value;
			}
		},
		getIconPanelwidth : function ()
		{
			return ICONPANELWIDTH;
		},
		setTitleHeight : function (value)
		{
			if (value == parseInt(value))
			{
				TITLEHEIGHT = value;
			}
		},
		getTitleHeight : function (value)
		{
			return TITLEHEIGHT;
		},
		getGoogleMapZoom : function (value)
		{
			return GOOGLE_ZOOM;
		},
		setGoogleMapZoom : function (sGoogleMapZoom)
		{
			GOOGLE_ZOOM = sGoogleMapZoom;
		},
		getLayout : function ()
		{
			return LAYOUT;
		},
		setApplicaionLayout : function (sApplicationLayout)
		{
			LAYOUT = sApplicationLayout;
		},
		
		getHeader : function ()
		{
			return HEADER;
		},
		
		setEnableHeader : function (sEnableHeader)
		{
			HEADER = sEnableHeader;
		},
		getFooter : function ()
		{
			return FOOTER;
		},
		
		setEnableFooter : function (sEnableFooter)
		{
			FOOTER = sEnableFooter;
		},
		
		getNotesDtl : function (callback, handlerScope, config)
		{
			if (NOTES_DTL == 'null')
			{
				var params = {
					'PAGE_CODE_TYPE' : 'CANVAS_NOTES',
					'INPUT_PRODUCT' : 'CANVAS',
					'INPUT_ACTION' : 'LOAD_NOTE',
					'INPUT_FUNCTION_CODE' : 'NOTES',
					'INPUT_SUB_PRODUCT' : 'CANVAS',
					'PRODUCT_NAME' : 'CANVAS',
					'__LISTVIEW_REQUEST' : 'Y'
				};
				cbx.ajax({
					params : params,
					scope : this,
					success : function (responseP, optionsP)
					{
						var responseData = cbx.isObject(responseP) ? responseP : cbx.decode(responseP);
						NOTES_DTL = responseData.MESSAGE;
						var lastUpdateDate = responseData.NOTES_DATE;
						if (NOTES_DTL == "")
						{
							NOTES_DTL = '';
						}
						LAST_UPD_NOTES_DTL_TIME = lastUpdateDate;
						callback.apply(handlerScope, [ NOTES_DTL, config, LAST_UPD_NOTES_DTL_TIME ]);
					},
					failure : function (response)
					{
						var MessageWindow = new iportal.Dialog({
							dialogType : 'USERDEFINED',
							dialogStyle : 'YES_NO',
							message : response.MESSAGE,
							title : 'Error',
							yesHandler : function ()
							{
								MessageWindow.close();
							},
							noHandler : function ()
							{
								MessageWindow.close();
							}
						});
						MessageWindow.show();
					}
				});
			} else
			{
				callback.apply(handlerScope, [ NOTES_DTL, config, LAST_UPD_NOTES_DTL_TIME ]);
			}
		},
		setNotesDtl : function (value)
		{
			NOTES_DTL = value;
		},
		setNotesMessage : function (sNotesMessage)
		{
			NOTES_DTL = sNotesMessage;
		},
		getNotesParams : function ()
		{
			return PARAMS;
		},
		setParams : function (value)
		{
			PARAMS = value;
		},
		getOnlyNotesDtl : function ()
		{
			return NOTES_DTL;
		},
		getFormContainerRenderer : function ()
		{
			return formContainerRenderer;
		},
		setFormContainerRenderer : function (sFormContainerRenderer)
		{
			formContainerRenderer = sFormContainerRenderer;
		},
		getApplicationMenuRenderer : function ()
		{
			return menuRenderer;
		},
		setMenuRenderer : function (sMenuRenderer)
		{
			menuRenderer = sMenuRenderer;
		},
		setWorkspaceHeaderHeight : function (headerHeight)
		{
			workspaceHeaderHeight = headerHeight;
		},
		setWorkspaceFooterHeight : function (footerHeight)
		{
			workspaceFooterHeight = footerHeight;
		},
		getWorkspaceHeaderHeight : function ()
		{
			return workspaceHeaderHeight;
		},
		getWorkspaceFooterHeight : function ()
		{
			return workspaceFooterHeight;
		},
		getAppDrag : function ()
		{
			return ENABLE_APP_DRAG;
		},
		setAppDrag : function (sEnableAppDrag)
		{
			ENABLE_APP_DRAG = sEnableAppDrag;
		},
		getLayoutResize : function ()
		{
			return ENABLE_LAYOUT_RESIZE;
		},
		setLayoutResize : function (sEnableLayoutResize)
		{
			ENABLE_LAYOUT_RESIZE = sEnableLayoutResize;
		},
		getPostiveBtnAlign : function ()
		{
			return posBtnAlign;
		},
		setPostiveBtnAlign : function (sPositiveBtnAlign)
		{
			posBtnAlign = sPositiveBtnAlign;
		},
		getNegativeBtnAlign : function ()
		{
			return negBtnAlign;
		},
		setNegativeBtnAlign : function (sNegativeBtnAlign)
		{
			negBtnAlign = sNegativeBtnAlign;
		},
		/**
		 * methods that will be used to fetch the alignment for the column types date, amount and datetime
		 */
		getDateColumnAlignment : function ()
		{
			return DATE_COLUMN_ALIGNMENT;
		},
		setDateColumnAlignment : function (sDateColumnAlignment)
		{
			DATE_COLUMN_ALIGNMENT = sDateColumnAlignment;
		},
		getAmountColumnAlignment : function ()
		{
			return AMOUNT_COLUMN_ALIGNMENT;
		},
		setMaximumFileSize : function (maximumFileSize)
		{
			MAXIMUM_FILE_SIZE = maximumFileSize;
		},
		getMaximumFileSize : function ()
		{
			return MAXIMUM_FILE_SIZE;
		},
		setAmountColumnAlignment : function (sAmountColumnAlignment)
		{
			AMOUNT_COLUMN_ALIGNMENT = sAmountColumnAlignment;
		},
		getDateTimeColumnAlignment : function ()
		{
			return DATE_TIME_COLUMN_ALIGNMENT;
		},
		setDateTimeColumnAlignment : function (sDateTimeColumnAlignment)
		{
			DATE_TIME_COLUMN_ALIGNMENT = sDateTimeColumnAlignment;
		},
		getAverageFontWidth : function ()
		{
			return averageFontWidth;
		},
		setAverageFontWidth : function (width)
		{
			averageFontWidth = width;
		},
		isCorpLogoExists : function ()
		{
			return CORP_LOGO_CHECK;
		},
		setCorporateLogoExists : function (bCorporateLogoExists)
		{
			CORP_LOGO_CHECK = bCorporateLogoExists == "true" ? true : false;
		},
		setLastLoginDateTime : function (sLastLoginDateTime)
		{
			USER_LAST_LOGIN_DATE = sLastLoginDateTime;
		},
		getLastLoginDateTime : function ()
		{
			return USER_LAST_LOGIN_DATE;
		},
		setLoggedInUserName : function (sLoggedInUserName)
		{
			LOGGED_IN_USER_NAME = sLoggedInUserName;
		},
		getLoggedInUserName : function ()
		{
			return LOGGED_IN_USER_NAME;
		},
		getLabelCharWidth : function ()
		{
			return LABEL_CHAR_WIDTH;
		},
		setLabelCharWidth : function (value)
		{
			LABEL_CHAR_WIDTH = value;
		},
		getDefaultLabelWidth : function ()
		{
			var defaultLabelWidth = 120;
			return defaultLabelWidth;
		},
		setDefaultRecsPerPage : function (defaultRecsPerPage)
		{
			defaultRecordsPerPage = defaultRecsPerPage
		},
		getDefaultRecsPerPage : function ()
		{
			return defaultRecordsPerPage;
		},
		setDefaultPagesDisplay : function (defaultPageToDisplay)
		{
			defaultPagesDisplay = defaultPageToDisplay
		},
		getDefaultPagesPerPage : function ()
		{
			return defaultPagesDisplay;
		},
		setMenuPanelHeightByWorkspaceId : function (workspaceId, height)
		{
			wsMenuPanelHeightObj[workspaceId] = height;
		},
		getMenuPanelHeightByWorkspaceId : function (workspaceId)
		{
			return wsMenuPanelHeightObj[workspaceId];
		},
		setLastUpdateNotesDtlTime : function (notesDtlTime)
		{
			LAST_UPD_NOTES_DTL_TIME = notesDtlTime;
		},
		getLastUpdateNotesDtlTime : function ()
		{
			return LAST_UPD_NOTES_DTL_TIME;
		},
        setActionButtonOrder : function(actionBtnOrdr){
        	actionBtnOrder = actionBtnOrdr;
        },
        getActionButtonOrder : function(){
        	return actionBtnOrder;
       	},       	
    	setWeekEndList:function(weekendList) {
        	WEEKENDS = weekendList;
    	},
    	getWeekEndList : function(){
    		return WEEKENDS;
        },
        setLoginMode : function(loginMode){
        	LOGGED_MODE = loginMode;
        },
        getLoginMode : function(){
        	return LOGGED_MODE;
    	},
    	/** Set the Amount Format Json*/
    	setAmountFormatJson : function(sAmountFormatJson){
    		AMOUNT_FORMAT_JSON = sAmountFormatJson;
        },
        /** Returns Amount Format Json*/
        getAmountFormatJson : function(){
        	return AMOUNT_FORMAT_JSON;
    	},
    	/** Set the Date Format Json*/
    	setDateFormatJson : function(sDateFormatJson){
    		DATE_FORMAT_JSON = sDateFormatJson;
        },
        /** Returns Date Format Json*/
        getDateFormatJson : function(){
        	return DATE_FORMAT_JSON;
    	},
	setLaunchLookupWithOneRecord : function (showLookupWithOneRecord){
    		launchLookupWithOneRecord = showLookupWithOneRecord;
    	},
    	getLaunchLookupWithOneRecord : function (){
    		return launchLookupWithOneRecord;
    	},
    	setNegativeSignInAmountColumn : function(negativeSignInAmountColumn){
    		NEGATIVE_SIGN_IN_AMOUNT_COLUMN = negativeSignInAmountColumn;
    	},
    	getNegativeSignInAmountColumn : function(){
    		return NEGATIVE_SIGN_IN_AMOUNT_COLUMN;
    	}
	});
}();

iportal.systempreferences = function ()
{
	var RATE_MAX_PRECISION = null;
	var ALERT_VIA_PIGGY_BACKFLAG = null;
	var SESSION_TIMEOUT_URL = null;
	var AJAX_TIMEOUT = null;
	var SESSION_TIMEOUT_INTERVAL = null;
	var IS_SIMULATION_MODE = null;
	var LIVEGRID_NEARLIMIT_VAL = null;
	// var ENABLE_MULTI_TRANS_AUTH_FLAG = "<%=OrbiProperties.getProperty("ENABLE_MULTI_TRANS_AUTH")%>";
	var LOG_REQUEST_ID = false;
	var CSRF_ID = null;
	var CSRF_KEY_NAME = "_dinsess";
	var PRELOAD_RESOURCES = null;
	var DEFAULT_BANKCCCY = null;
	var DEFAULT_BANKRATECARD = null;
	var PUBLISHED_REP_ARCHIEVED_PATH = null;
	var WDK_ENABLED = null;
	var GOOGLE_LOADER_URL = null;
	var SHOW_TOOLS_AS_LINEAR = false;
	var ENABLE_WIDGET_DATA_SHRINK = false;
	var WIDGETDEFAULTMAXHEIGHT = null;
	var WIDGETDEFAULTMINHEIGHT = null;
	var onDemandJSRequired = null;
	var onDemandCompressPath = null;
	var jsCompressReq = false;
	var contexMsgEnabled = false;
	var pageSize = null;
	var BUILD_TIME_STAMP = null;
	var framework = null;
	var DEVICE = null;
	var CHANNEL = null;

	var RESPONSIVE_GRID_IND = false;
	var RESPONSIVE_GRID_PERCENT = null;

	var enableDesignCanvasInd = null;

	var IS_HYBRID = false;
	var mNavigationEnabled = true;

	var needEncryption = true;
	var pagaSizeForMobile = 5;
	
	var copyRightMsg = null;
	
	var homePageURI = null;//fix for header logo
	
	var appContextPath = null;//fix for header logo
	var IdleSessionTimeoutInSec;
	
	var hybridAppInitiliazingData = [];
	
	
	return cbx.apply({
		isAlertViaPiggyBack : function ()
		{
			if (ALERT_VIA_PIGGY_BACKFLAG === 'Y')
				return true;
			else
				return false;
		},
		setAlertViaPiggyBack : function (sAlertPiggyBackFlag)
		{
			ALERT_VIA_PIGGY_BACKFLAG = sAlertPiggyBackFlag;
		},
		getSessionTimeOutURL : function ()
		{
			return SESSION_TIMEOUT_URL;
		},
		setSessionTimeOutUrl : function (sSessionTimeOutUrl)
		{
			SESSION_TIMEOUT_URL = sSessionTimeOutUrl;
		},
		getWdkEnabled : function ()
		{
			return WDK_ENABLED;
		},
		setWdkEnabled : function (sWDKEnabled)
		{
			WDK_ENABLED = sWDKEnabled;
		},
		getPageSizeForPagination : function ()
		{
			return pageSize;
		},
		setPageSizeForPagination : function (sListViewPageSize)
		{
			pageSize = sListViewPageSize;
		},
		getLiveGridNearLimit : function ()
		{
			return LIVEGRID_NEARLIMIT_VAL;
		},
		setLiveGridNearLimit : function (sLiveGridNearByLimit)
		{
			LIVEGRID_NEARLIMIT_VAL = sLiveGridNearByLimit;
		},
		getMaxInactiveInterval : function ()
		{
			return ((Number(SESSION_TIMEOUT_INTERVAL) * 1000));
		},
		setSessionTimeOutInterval : function (sSessionTimeOutInterval)
		{
			SESSION_TIMEOUT_INTERVAL = sSessionTimeOutInterval;
		},
		isSimulationModeOperation : function ()
		{
			return IS_SIMULATION_MODE;
		},
		setSimulationMode : function (isSimulationMode)
		{
			IS_SIMULATION_MODE = isSimulationMode == "true" ? true : false;
		},
		getDefaultBankCCY : function ()
		{
			return DEFAULT_BANKCCCY;
		},
		setDefaultBankCCY : function (sDefaultBankCurrency)
		{
			DEFAULT_BANKCCCY = sDefaultBankCurrency;
		},
		getCSRFUniqueId : function ()
		{
			return CSRF_ID;
		},
		setCSRFUniqueId : function (csrfUniqueID)
		{
			CSRF_ID = csrfUniqueID;
		},
		getCSRFKeyName : function ()
		{
			return CSRF_KEY_NAME;
		},
		setCSRFKeyName : function (keyName)
		{
			CSRF_KEY_NAME = keyName;
		},
		isRequestIdLogged : function ()
		{
			return LOG_REQUEST_ID;
		},
		setRequestIdLogged : function (sLogRequestIdAsRef)
		{
			LOG_REQUEST_ID = sLogRequestIdAsRef;
		},
		getPreloadResources : function ()
		{
			return PRELOAD_RESOURCES;
		},
		setPreloadResources : function (preloadJSON)
		{
			PRELOAD_RESOURCES = preloadJSON;
		},
		getMultiAuthEnableFlag : function ()
		{
			return ENABLE_MULTI_TRANS_AUTH_FLAG;
		},
		getDefaultRateCard : function ()
		{
			return DEFAULT_BANKRATECARD;
		},
		setDefaultRateCard : function (sDefaultBankRateCard)
		{
			DEFAULT_BANKRATECARD = sDefaultBankRateCard;
		},
		/**
		 * Intended to return the timeout in milliseconds to be used for ajax requests.
		 */
		getAjaxRequestTimeOutPeriod : function ()
		{
			return AJAX_TIMEOUT;
		},
		setAjaxRequestTimeOutPeriod : function (sAjaxTimeOutPeriod)
		{
			AJAX_TIMEOUT = sAjaxTimeOutPeriod;
		},
		/** Returns ToolsAsLinear Flag preference */
		getToolsAsLinearFlag : function ()
		{
			return SHOW_TOOLS_AS_LINEAR;
		},
		setToolsAsLinearFlag : function (sToolsAsLinear)
		{
			SHOW_TOOLS_AS_LINEAR = sToolsAsLinear;
		},
		getEnableWidgetDataShrinkFlag : function ()
		{
			return ENABLE_WIDGET_DATA_SHRINK;
		},
		setEnableWidgetDataShrinkFlag : function (sWidgetDataShrink)
		{
			ENABLE_WIDGET_DATA_SHRINK = sWidgetDataShrink;
		},
		getDefaultWidgetMaxHeight : function ()
		{
			return WIDGETDEFAULTMAXHEIGHT;
		},
		setDefaultWidgetMaxHeight : function (sWidgetdefaultMaxHeight)
		{
			WIDGETDEFAULTMAXHEIGHT = sWidgetdefaultMaxHeight;
		},
		getDefaultWidgetMinHeight : function ()
		{
			return WIDGETDEFAULTMINHEIGHT;
		},
		setDefaultWidgetMinHeight : function (sWidgetdefaultMinHeight)
		{
			WIDGETDEFAULTMINHEIGHT = sWidgetdefaultMinHeight;
		},
		getInfoRepFWArchivedPath : function ()
		{
			return PUBLISHED_REP_ARCHIEVED_PATH;
		},
		setInfoRepFWArchivedPath : function (sPubllishedReportArchPath)
		{
			PUBLISHED_REP_ARCHIEVED_PATH = sPubllishedReportArchPath;
		},
		isOnDemandJSRequired : function ()
		{
			return onDemandJSRequired;
		},
		setOnDemandJSRequired : function (bOnDemandJSRequired)
		{
			onDemandJSRequired = bOnDemandJSRequired == "true" ? true : false;
		},
		getOnDemandCompressPath : function ()
		{
			return onDemandCompressPath;
		},
		setOnDemandCompressPath : function (sOnDemandCompressPath)
		{
			onDemandCompressPath = sOnDemandCompressPath;
		},
		getJsCompressionFlag : function ()
		{
			return jsCompressReq;
		},
		setJsCompressionFlag : function (sJsCompressRequired)
		{
			jsCompressReq = sJsCompressRequired;
		},
		getGoogleLoaderUri : function ()
		{
			return GOOGLE_LOADER_URL;
		},
		setGoogleLoaderUri : function (sGoogleMapUrl)
		{
			GOOGLE_LOADER_URL = sGoogleMapUrl;
		},
		setFramework : function (sFramework)
		{
			framework = sFramework;
		},
		getFramework : function ()
		{
			return framework;
		},
		getRateMaxPrecision : function ()
		{
			return RATE_MAX_PRECISION;
		},
		setRateMaxPrecision : function (sRateMaxPrecision)
		{
			RATE_MAX_PRECISION = sRateMaxPrecision;
		},
		isContexMsgEnabled : function ()
		{
			return contexMsgEnabled;
		},
		setContexMsgEnabled : function (sContextMsgEnabled)
		{
			contexMsgEnabled = sContextMsgEnabled;
		},
		getBuildTimeStamp : function ()
		{
			return BUILD_TIME_STAMP;
		},
		setBuildTimeStamp : function (sBuildTimeStampValue)
		{
			BUILD_TIME_STAMP = sBuildTimeStampValue;
		},
		
		setDevice : function (device)
		{
			DEVICE = device;
			iportal.workspace.metadata.setDevice(device);
		},
		getDevice : function ()
		{
			return DEVICE;
		},
		
		setChannel : function(channel){
			CHANNEL = channel;
		},
		
		getChannel : function ()
		{
			return CHANNEL;
		},
		
		getRawDateFormat : function ()
		{
			return RAWDATE_FORMAT;
		},
		setRawDateFormat : function (rawDateFormat)
		{
			RAWDATE_FORMAT = rawDateFormat;
		},
		setResponsiveGridInd : function (responsiveGridInd)
		{
			RESPONSIVE_GRID_IND = responsiveGridInd;
		},
		getResponsiveGridInd : function ()
		{
			return RESPONSIVE_GRID_IND;
		},
		setResponsiveGridPercent : function (responsiveGridPercent)
		{
			RESPONSIVE_GRID_PERCENT = responsiveGridPercent;
		},
		getResponsiveGridPercent : function ()
		{
			return RESPONSIVE_GRID_PERCENT;
		},
		setDesignCanvasInd : function (designCanvasInd)
		{
			enableDesignCanvasInd = designCanvasInd;
		},
		getDesignCanvasInd : function ()
		{
			return enableDesignCanvasInd;
		},
		setHybridInd : function (hybridInd)
		{
			IS_HYBRID = hybridInd;
		},
		isHybrid : function ()
		{
			return IS_HYBRID;
		},
		setHybridInitiliazerData : function (initiliazingData)
		{
			if(cbx.isArray(initiliazingData)) 
			hybridAppInitiliazingData = initiliazingData;
		},
		getHybridInitiliazerData : function ()
		{
			return hybridAppInitiliazingData;
		},
		setNavigationEnabledInd : function (navigationInd)
		{
			mNavigationEnabled = navigationInd;
		},
		isNavigationEnabled : function ()
		{
			return mNavigationEnabled;
		},
		setNeedEncryption : function (needEncryptionInd)
		{
			needEncryption = needEncryptionInd;
		},
		isNeedEncryption : function ()
		{
			return needEncryption;
		},
		setDefaultPagesizeForMobile : function (mobilePageSize){
			pagaSizeForMobile = mobilePageSize;
		},
		getDefaultPagesizeForMobile : function (){
			return pagaSizeForMobile;
		},
		setHomePageURI : function(homePagePath){//fix for header logo click
			homePageURI = homePagePath;
		},
		getHomePageURI : function(){
			return homePageURI;
		},
	//Customizing Copyright message
		setCopyRightMsg : function(copyRightContent){
			copyRightMsg = copyRightContent;
		},
		getCopyRightMsg : function(){
			return copyRightMsg;
		},
		setIdleSessionTimeoutInSeconds : function (IdleSessionTimeoutInSeconds){
			IdleSessionTimeoutInSec = IdleSessionTimeoutInSeconds;
		},
		getIdleSessionTimeoutInSeconds : function (){
			return (Number(IdleSessionTimeoutInSec) * 1000);
		}

	});
}();
