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

package com.intellectdesign.canvas.constants.preferences;

/**
 * This class contains the Preference Constants
 * 
 * @version 1.0
 */

/**
 * constant file for user/corparate preference
 * 
 * 
 */
public final class PreferenceConstants
{
	/**
	 * Private cnstructor to avoid instantiation. ref to PreferenceConstants themes, lang,
	 */
	private PreferenceConstants()
	{
	}

	public static final String THEME_FORMAT = "THEME";
	public static final String FONTSIZE_FORMAT = "FONTSIZE";

	public static final String DATE_FORMAT = "DATEFORMAT";
	public static final String AMOUNT_FORMAT = "AMOUNT";
	public static final String URL_FORMAT = "URL";
	public static final String TIMEZONE_FORMAT = "TIMEZONE";
	public static final String CSTYLE = "CStyle";
	public static final String CORP_PREF = "CORP_PREF";

	public static final String TIME_FORMAT = "TIMEFORMAT";
	public static final String WORKSPACE = "WORKSPACE";

	/**
	 * Constants used in Language prefrences.
	 */
	public static final String LANGUAGE_FORMAT = "LANGUAGE";
	public static final String CACHE_KEY_LANGUAGE_MASTER_DATA = "LANGUAGE_MASTER_DATA";
	public static final String GET_LANGUAGE_DIRECTION = "GET_LANGUAGE_DIRECTION";
	public static final String LANGUAGE_ID = "LANG_ID";
	public static final String DIRECTION_FORMAT = "DIRECTION";

	public static final String SHOW_TOOLS_AS_LINEAR = "SHOW_TOOLS_AS_LINEAR";
	public static final String ENABLE_WIDGET_DATA_SHRINK = "ENABLE_WIDGET_DATA_SHRINK";

	public static final String INIT_ACTION = "INIT_ACTION";
	public static final String USER_PREF = "USER_PREF";
	public static final String SAVE_TXN = "SAVE_TXN";
	public static final String ENASECLANG = "ENASECLANG";
	public static final String SLANGUAGE = "SLANGUAGE";
	public static final String STARTWS = "STARTWS";

	public static final String SUBMIT_SUCCESS_KEY = "SUBMIT_SUCCESS";
	public static final String SUBMIT_SUCCESS_SUCCESS_VALUE = "Y";
	public static final String SUCCESS_MESSAGE = "SUCCESS_MESSAGE";
	public static final String JAVA_SCRIPT_SUCCESS_KEY = "success";

	public static final String DEFAULT_PRIMARY_LANGUAGE = "en_US";
	public static final String DEFAULT_SECONDARY_LANGUAGE = "en_US";
	public static final String DEFAULT_ENABLE_SECONDARY_LANGUAGE = "no";
	public static final String ENABLE_SEC_LANG_YES = "yes";
	public static final String DEFAULT_DATE_FORMAT = "dd/MM/yyyy";
	public static final String DEFAULT_PREF_DATE_FORMAT = "Y-m-d";
	public static final String DEFAULT_DATE_FORMATTERCLASS = "com.intellectdesign.canvas.pref.date.CanvasDateFormatter";
	public static final String DEFAULT_TIME_FORMAT = "hh:mm:ss a";
	public static final String DEFAULT_PREF_TIME_FORMAT = "h:i:s a";
	public static final String DEFAULT_TIME_ZONE = "16";
	public static final String DEFAULT_WORK_SPACE = "Dashboard";

	public static final String DEFAULT_AMOUNT_FORMAT = "USA";
	public static final char DEFAULT_AMOUNT_GROUPSEPARATOR = ',';
	public static final char DEFAULT_AMOUNT_DECIMALSEPARATOR = '.';
	public static final int DEFAULT_AMOUNT_GROUPSIZE = 3;
	public static final String DEFAULT_AMOUNT_FORMATTERCLASS = "com.intellectdesign.canvas.pref.amount.CanvasAmountFormatter";

	public static final String RESTORE_DEFAULTS = "RESTORE_DEFAULTS";

	public static final String GET_ALL_TIMEZONES = "GET_ALL_TIMEZONES";
	public static final String TIMEZONE_DTLS = "TIMEZONE_DTLS";
	public static final String GET_DATEFORMAT_DISPLAY = "GET_DATEFORMAT_DISPLAY";
	public static final String DATEID = "DATEID";
	public static final String DATE_FORMAT_KEY = "DATE_FORMAT";

	public static final String GET_GMTOFFSET = "GET_GMTOFFSET";
	public static final String GET_GMT_NICKNAME = "GET_GMT_NICKNAME";
	public static final String TIMEZONECODE = "TIMEZONECODE";

	public static final String DAM_KEY_TZ_GET_ALL_DATA = "GET_ALL_DATA";
	public static final String DAM_KEY_EXTN_GET_ALL_DATA = "TIMEZONECODE";
	public static final String TZ_KEY_DESCRIPTION = "DESCRIPTION";
	public static final String TZ_KEY_CODE = "CODE";
	public static final String TZ_KEY_GMTOFFSET = "GMTOFFSET";
	public static final String TZ_KEY_NICKNAME = "NICKNAME";
	public static final String TZ_KEY_REGIONCODE = "REGIONCODE";
	public static final String CACHE_KEY_TIMEZONE_FULL = "TZ_FULL_CACHE";

	public static final String CODE = "CODE";
	public static final String GMTOFFSET = "GMTOFFSET";
	public static final String NICKNAME = "NICKNAME";
	public static final String GET_DATEID_DISPLAY = "GET_DATEID_DISPLAY";
	public static final String DATE_ID = "DATE_ID";

	public static final String ENT_USER_TASK_CODE = "06";

	public static final String RATECARD_PREF = "RATECARD";
	public static final String EQUIVALENT_CUR_PREF = "EQUICURR";
	public static final String GET_TIMEZONEID = "GET_TIMEZONEID";

	public static final String RES_DEFAULTS_SIMULAT_MODE = "Restore Defaults was Successful.";
	public static final String USER_ROLE = "USER_ROLE";
	public static final String DEFAULT_LOG_IN_MODE = "USER";

	// copied from duplicated prefernce constant file
	// The cache key in which all the configured preference data is loaded and kept ready for usage
	public static final String CACHE_KEY_ALL_PREF_DATA = "ALL_PREF_DATA";

	// The various data source types for Preference
	// Source type - DB Query
	public static final String PREF_SOURCE_QUERY = "Q";
	// Source type - Application API
	public static final String PREF_SOURCE_API = "A";

	// Default operation extension used for all DB operations within the framework
	public static final String DB_OPERATION_EXTENSION = "PREF_FRMK";

	// The DAM key used for fetching the list of all registered Preference criteria definitions
	public static final String DAM_KEY_GET_ALL_SYSTEM_PREFERENCE_DEFINITIONS = "GET_ALL_SYSTEM_PREFERENCE_DEFINITIONS";

	// The fields used for the User Preferences fetch.
	public static final String SYS_PREF_FLD_ATTRIBUTE_TYPE = "ATTRIBUTE_TYPE";
	public static final String SYS_PREF_FLD_ATTRIBUTE_DESC = "ATTRIBUTE_DESC";
	public static final String SYS_PREF_FLD_SOURCE_VALUE = "SOURCE_VALUE";
	public static final String SYS_PREF_FLD_SOURCE_TYPE = "SOURCE_TYPE";
	public static final String SYS_PREF_FLD_VISIBLE_IND = "VISIBLE_IND";

	// The DAM Key used for fetching the list of user's preference criteria definitions
	public static final String DAM_KEY_GET_ALL_USER_PREFERENCES = "GET_ALL_USER_PREFERENCES";

	// The fields used for the User Preferences fetch.
	public static final String USER_PREF_FLD_ATTRIBUTE_TYPE = "ATTRIBUTE_TYPE";
	public static final String USER_PREF_FLD_ATTRIBUTE_VALUE = "ATTRIBUTE_VALUE";
	public static final String USER_PREF_FLD_USER_NUMBER = "USER_NO";
	public static final String USER_PREF_FLD_GCIF = "GCIF";
	public static final String USER_PREF_FLD_PREF_TYPE = "PREF_TYPE";

	public static final String USER_PREF_USER_ROLE = "USER_ROLE";
	public static final String USER_PREF_WORKSPACE = "WORKSPACE";

	// The DAM Key used for fetching the list of all Corporate Preferences
	public static final String DAM_KEY_GET_ALL_CORP_PREFERENCES = "GET_ALL_CORP_PREFERENCES";

	// The fields used for the Corporate preferences fetch
	public static final String CORP_PREF_FLD_ATTRIBUTE_TYPE = "ATTRIBUTE_TYPE";
	public static final String CORP_PREF_FLD_ATTRIBUTE_VALUE = "ATTRIBUTE_VALUE";
	public static final String CORP_PREF_FLD_USER_NUMBER = "USER_NO";
	public static final String CORP_PREF_FLD_GCIF = "GCIF";
	public static final String CORP_PREF_FLD_PREF_TYPE = "PREF_TYPE";

	// The DAM key used for fetching the data for a particular preference criteria if it were configured as a query
	public static final String DAM_KEY_GET_A_PREFERENCE_DATA = "GET_A_PREFERENCE_DATA";

	// The fields used for the Preference data fetch.
	public static final String PREF_DATA_FLD_QUERY = "PREF_QUERY";
	public static final String PREF_DATA_FLD_ATTRIBUTE_TYPE = "ATTRIBUTE_TYPE";
	public static final String PREF_DATA_FLD_ATTRIBUTE_VALUE = "ATTRIBUTE_VALUE";

	public static final String PREF_DATA_FLD_USER_NO = "USER_NO";
	public static final String DB_OPERATION_EXTENSION_ROLES_BY_USER = "ROLES_BY_USER";
	public static final String DELETE_USER_PREFERENCES = "DELETE_USER_PREFERENCES";
	public static final String INSERT_USER_PREFERENCES = "INSERT_USER_PREFERENCES";

}