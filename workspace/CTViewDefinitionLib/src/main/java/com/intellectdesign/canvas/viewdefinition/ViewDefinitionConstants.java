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

package com.intellectdesign.canvas.viewdefinition;

import com.intellectdesign.canvas.constants.common.FrameworkConstants;

/**
 * This is the constants class used for defining the commonly used constants required by the view definition framework
 * 
 * @version 1.0
 */
public final class ViewDefinitionConstants
{

	public static final String GRAND_TOTAL_DATA = "GrandTotalData";

	/**
	 * Making the default constructor as private to avoid unnecessary object creation
	 */
	private ViewDefinitionConstants()
	{
		/**
		 * Private cnstructor to avoid instantiation
		 */
	}

	public static final String VIEW_SPECIFIC_FILTERS = "VIEW_SPECIFIC_FILTERS";
	public static final String VIEW_PAGINATION_MODEL = "VIEW_PAGINATION_MODEL";
	public static final String VIEW_DATA = "VIEW_DATA";

	public static final String PARAM_SUCCESS = "SUCCESS";
	public static final String INPUT_GCIF = "INPUT_GCIF";// Is the GCIF
															// currently logged
															// in.
	public static final String INPUT_USER_NO = "INPUT_USER_NO";
	public static final String INPUT_LOGIN_ID = "INPUT_LOGIN_ID";
	public static final String PRODUCT_NAME = "PRODUCT_NAME";
	public static final String INPUT_SUB_PRODUCT = "INPUT_SUB_PRODUCT";
	public static final String INPUT_FUNCTION_CODE = "INPUT_FUNCTION_CODE";
	public static final String INPUT_LANGUAGE_ID = "INPUT_LANGUAGE_ID";// Addded
																		// to
																		// implement
																		// sorting
																		// model
																		// in
																		// VDF
	public static final String SORT_FIELD = "sort";//
	public static final String VIEW_ID = "VIEW_ID";
	public static final int NO_POSITION = Integer.MAX_VALUE;
	public static final int MAX_VALUE = Integer.MAX_VALUE;
	public static final String SQL_SORT_ORDER_ASCENDING = "ASC";
	public static final String SQL_SORT_ORDER_DESCENDING = "DESC";
	public static final String KEY_IS_FILTER_FORM = "IS_FILTER_FORM";
	public static final String VIEW_DEFINITION_CANCEL_ACTION = "VIEW_DEFINITION_CANCEL_ACTION";

	public static final String FLD_PAGE_SIZE = "FLD_PAGE_SIZE";
	public static final String FLD_DETAIL_ACTION_IND = "FLD_DETAIL_ACTION_IND";
	// Added to implement context action column in VDF.
	public static final String FLD_CONTEXT_COLUMN = "FLD_CONTEXT_COLUMN";
	public static final String FLD_EQCCY_EXIST_IND = "FLD_EQCCY_EXIST_IND";
	public static final String FLD_SELECTION_TYPE = "FLD_SELECTION_TYPE";

	public static final String FLD_HIGHLIGHT_IND = "FLD_HIGHLIGHT_IND";

	// Constants defining the list of the field names as used in the database layer
	public static final String FLD_VIEW_ID = "VIEW_ID";
	public static final String FLD_PARENT_VIEW_ID = "PARENT_VIEW_ID";
	public static final String FLD_VIEW_NAME = "VIEW_DISPLAY_NM";
	public static final String FLD_CUSTOMIZE_IND = "CUSTOMIZE_IND";
	public static final String FLD_USER_NO = "USER_NO";
	public static final String FLD_GCIF = "GCIF";
	public static final String FLD_PRODUCT_CODE = "PRODUCT_CODE";
	public static final String FLD_SUB_PRODUCT_CODE = "SUB_PRODUCT_CODE";

	public static final String FLD_FUNCTION = "FUNCTION_CODE";

	public static final String FLD_DEFAULT = "DEFAULT_VIEW_IND";
	public static final String FLD_ATTRIBUTES = "ATTRIBUTES";
	public static final String FLD_ATTRIB_NAME = "ATTRIB_NAME";
	public static final String FLD_ATTRIB_VALUE = "ATTRIB_VALUE";
	public static final String FLD_FILTERS = "FILTERS";
	public static final String FLD_SORTFIELDS = "SORTFIELDS";
	public static final String FLD_PREFERENCES = "ADDN_PREFS";
	public static final String FLD_VIEW_DEFINITION = "VIEW_DEFINITION";
	public static final String FLD_SYSTEM_VIEW_ID = "SYSTEM_VIEW_ID";
	public static final String FLD_FILTER_NAME = "FILTER_NAME";
	public static final String FLD_DAT_TYP = "DATA_TYPE";
	public static final String FLD_FILTER_ID = "FILTER_ID";
	public static final String COLUMN_COUNT = "COLUMN_COUNT";
	public static final String FLD_TOTAL_RESULT_IND = "FLD_TOTAL_RESULT_IND";

	public static final String DATA_ALL_USERS = "-1";
	public static final String DATA_ALL_CORPORATES = "-1";
	public static final String DATA_ALL_FUNCTIONS = "ALL";

	// Various attributes supported by default.
	public static final String ATTRIB_VISIBLE_COLUMNS = "VISBL_COLS";
	public static final String ATTRIB_DEFAULT_SORT = "DEFLT_SORT";
	public static final String ATTRIB_DEFAULT_SEARCH = "DEFLT_SEARCH";
	public static final String ATTRIB_CUSTOM_TITLE = "CUSTOM_TITLE";
	public static final String ATTRIB_MAND_VISIBLE_COLUMNS = "MAND_VISBL_COLS";

	// List of separators used within the attribute definitions.
	public static final String SEPARATOR_COLUMN_VALUE = "=";
	public static final String SEPARATOR_GROUP = ";";

	// Handling of boolean value columns
	public static final String VAL_BOOL_YES = "Y";
	public static final String VAL_BOOL_NO = "N";
	public static final String VAL_BOOL_TRUE = "true";
	public static final String VAL_BOOL_FALSE = "false";

	// Constants used within the View manager framework for database activities
	public static final String DB_DAM_KEY_VIEW_MANAGER = "VIEW_MGR_FRMWK_MNT";
	public static final String DB_EXT_KEY_UPDATE_DEFAULT_VIEW = "SET_DFLT_VIEW";
	public static final String DB_EXT_KEY_INSERT_VIEW_METADATA = "CREATE_VIEW";
	public static final String DB_EXT_KEY_DELETE_VIEW_ATTRIB = "DELETE_ATTRIB";
	public static final String DB_EXT_KEY_INSERT_VIEW_ATTRIB = "INSERT_ATTRIB";
	public static final String DB_EXT_KEY_GET_VIEW_ID = "GET_VIEW_ID";
	public static final String DB_EXT_KEY_DELETE_VIEW_META_DATA = "DELETE_VIEW";
	public static final String DB_EXT_KEY_ALL_VIEWS_QRY = "GET_ALL_VIEWS_QRY";
	public static final String DB_EXT_KEY_GET_VIEW_FOR_ID_QRY = "GET_VIEW_FOR_ID_QRY";
	public static final String DB_EXT_KEY_GET_DEFAULT_VIEW_QRY = "GET_DEFAULT_VIEW_QRY";
	public static final String DB_EXT_KEY_GET_VIEW_DETAILS_QRY = "GET_VIEW_DETAILS_QRY";
	public static final String DB_EXT_KEY_GET_DATA_QRY = "GET_DATA_QRY";
	public static final String DB_EXT_KEY_GET_INSTRUCTION_CLASS = "GET_INSTRUCTION_CLASS";
	public static final String DB_EXT_KEY_GET_ALL_INSTRUCTION_CLASS_DTLS = "GET_ALL_INSTRUCTION_CLASS_DTLS";
	public static final String DB_EXT_KEY_GET_DEFAULT_VIEW_ID_QRY = "GET_DEFAULT_VIEW_ID_QRY";
	public static final String DB_EXT_KEY_GET_CUST_DEFAULT_VIEW_ID_QRY = "GET_CUST_DEFAULT_VIEW_ID_QRY";
	public static final String DB_EXT_KEY_GET_USER_SPECIFIC_VIEWS_QRY = "GET_USER_SPECIFIC_VIEWS_QRY";
	public static final String DB_EXT_KEY_GET_SYSTEM_VIEWS_QRY = "GET_SYSTEM_VIEWS_QRY";
	public static final String DB_EXT_KEY_GET_OVERRIDDEN_VIEWS_QRY = "DB_EXT_KEY_GET_OVERRIDDEN_VIEWS_QRY";
	public static final String DB_EXT_KEY_UPDATE_VIEW_DEFINITION_QRY = "UPDATE_VIEW_DEFINITION_QRY";
	public static final String DB_EXT_KEY_INSERT_COLUMN_DEFINITION_QRY = "COLUMN_DEFINITION_QRY";
	public static final String DB_EXT_KEY_DELETE_COLUMN_DEFINITIONS_QRY = "COLUMN_DEFINITIONS_QRY";
	public static final String DB_EXT_KEY_DELETE_VIEW_DEFINITIONS_QRY = "VIEW_DEFINITIONS_QRY";
	public static final String DB_EXT_KEY_INSERT_VIEW_DEFINITION_QRY = "VIEW_DEFINITION_QRY";
	public static final String DB_EXT_KEY_INSERT_WIDGET_DEFINITION_QRY = "WIDGET_DEFINITION_QRY";
	public static final String DB_EXT_KEY_INSERT_VIEW_DEFN_ADDL_PREFERENCES_QRY = "VIEW_DEFN_ADDL_PREFERENCES_QRY";
	public static final String DB_EXT_KEY_GET_SYSTEM_VIEW_ID_QRY = "GET_SYSTEM_VIEW_ID_QRY";
	public static final String DB_EXT_KEY_GET_VIEW_DISP_NM_COUNT_QRY = "GET_VIEW_DISP_NM_COUNT_QRY";
	public static final String DB_EXT_KEY_GET_FILTER_ID_QRY = "GET_FILTER_ID_QRY";
	public static final String DB_EXT_KEY_INSERT_COLUMN_FILTER_QRY = "COLUMN_FILTER_QRY";
	public static final String DB_EXT_KEY_DELETE_COLUMN_FILTER_DEFN_QRY = "COLUMN_FILTER_DEFN_QRY";
	public static final String DB_EXT_KEY_DELETE_WIDGET_DEFINITIONS_QRY = "WIDGET_DEFINITIONS_QRY";
	public static final String DB_EXT_KEY_DELETE_VIEWDEF_ADDL_PREF_DEL_QRY = "VIEWDEF_ADDL_PREF_DEL_QRY";
	public static final String DB_EXT_KEY_GET_USER_DETAILS_QRY = "GET_USER_DETAILS_QRY";
	public static final String DB_EXT_KEY_RESET_DEFAULT_VIEW = "RESET_DEFAULT_VIEW";
	public static final String DB_EXT_KEY_GET_ALL_VIEWS_FOR_USER_QRY = "GET_ALL_VIEWS_FOR_USER_QRY";
	public static final String DB_EXT_KEY_INSERT_BULK_COLUMN_DEFINITION_QRY = "BULK_COLUMN_DEFINITION_QRY";
	public static final String DB_EXT_KEY_INSERT_BULK_COLUMN_FILTER_QRY = "BULK_COLUMN_FILTER_QRY";
	public static final String DB_EXT_KEY_DELETE_ACC_LIST_EXTN_QRY = "ACC_LIST_EXTN_QRY";

	public static final String DB_EXT_KEY_LIST_ALL_USER_VIEWS_FOR_WIDGET = "LIST_ALL_USER_VIEWS_FOR_WIDGET";
	public static final String DB_EXT_KEY_WIDGET_USER_PREFERENCE = "WIDGET_USER_PREFERENCE";
	public static final String DB_EXT_KEY_VIEW_WIDGET_TOOLS = "VIEW_WIDGET_TOOLS";

	public static final String DB_EXT_KEY_USER_CONFIG_FOR_WIDGET = "USER_CONFIG_FOR_WIDGET";
	public static final String DB_EXT_KEY_LIST_ALL_USER_CHILD_WIDGETS_FOR_WIDGET = "LIST_ALL_USER_CHILD_WIDGETS_VIEWS_FOR_WIDGET";
	public static final String DB_EXT_KEY_BBAR_BUTTONS_FOR_WIDGET = "BBAR_BUTTONS_FOR_WIDGET";

	public static final String DB_EXT_KEY_TBAR_BUTTONS_FOR_WIDGET = "TBAR_BUTTONS_FOR_WIDGET";

	public static final String DB_EXT_KEY_GET_APP_STRUCTURE_QRY = "GET_APP_STRUCTURE_QRY";

	// For Cache
	public static final String VDF_INSTRUCTIONS = "VDF_INSTRUCTIONS";
	public static final String INSTRUCTION_CLASS = "INSTRUCTION_CLASS";

	// List of operators for String
	public static final String OP_STR_EQUALS = "strEquals";
	public static final String OP_STR_STARTS_WITH = "startsWith";
	public static final String OP_STR_ENDS_WITH = "endsWith";
	public static final String OP_STR_CONTAINS = "contains";
	public static final String OP_STR_IN = "in";
	// List of operators for Date
	public static final String OP_DT_RANGE = "range";
	public static final String OP_DT_EQUALS_SYSDATE = "equalsSysdate";
	public static final String OP_DT_LESSTHAN_SYSDATE = "ltSysdate";
	public static final String OP_DT_GREATERTHAN_SYSDATE = "gtSysdate";
	public static final String OP_DT_LESSTHAN_EQUAL_SYSDATE = "ltEqualToSysdate";
	public static final String OP_DT_GREATERTHAN_EQUAL_SYSDATE = "gtEqualToSysdate";
	public static final String OP_DT_NOT_EQUAL_SYSDATE = "notEqualToSysdate";
	public static final String OP_DT_EQUALS_DATE = "dtEquals";
	public static final String OP_DT_LESSTHAN_DATE = "lt";
	public static final String OP_DT_GREATERTHAN_DATE = "gt";
	public static final String OP_DT_LESSTHAN_EQUAL_DATE = "ltEqualTo";
	public static final String OP_DT_GREATERTHAN_EQUAL_DATE = "gtEqualTo";
	public static final String OP_DT_NOT_EQUAL_DATE = "notEqualTo";
	public static final String OP_DT_CURR_MONTH = "CURRENT_MONTH";
	public static final String OP_DT_CURR_DAY = "CURRENT_DAY";
	public static final String OP_DT_PRE_MONTH = "PREVIOUS_MONTH";
	public static final String OP_DT_LAST_N_MONTH = "LAST_N_MONTH";
	public static final String OP_DT_PRE_DAY = "PREVIOUS_DAY";
	public static final String OP_DT_LAST_N_DAY = "LAST_N_DAY";

	// List of operators for Number
	public static final String OP_NUM_EQUALTO = "=";
	public static final String OP_NUM_LESSTHAN = "<";
	public static final String OP_NUM_GREATERTHAN = ">";
	public static final String OP_NUM_LESSTHAN_EQUAL = "<=";
	public static final String OP_NUM_GREATERTHAN_EQUAL = ">=";
	public static final String OP_NUM_NOT_EQUAL = "<>";

	public static final String FLD_RECORDS_PER_PAGE = "FLD_RECORDS_PER_PAGE";
	public static final String FLD_OD_USER_NO = "FLD_OD_USER_NO";
	public static final String FLD_OD_GCIF = "FLD_OD_GCIF";
	public static final String FLD_TOOLS_LIST = "FLD_TOOLS_LIST";
	public static final String FLD_COLUMN_LIST = "FLD_COLUMN_LIST";
	public static final String FLD_COLUMN_ID = "FLD_COLUMN_ID";

	public static final String FLD_CHANNEL_ID = "FLD_CHANNEL_ID";

	public static final String FLD_COLUMN_DISPLAY_NAME_KEY = "FLD_COLUMN_DISPLAY_NAME_KEY";
	public static final String FLD_POSITION = "FLD_POSITION";
	public static final String FLD_POSITION_FIXED_IND = "FLD_POSITION_FIXED_IND";
	public static final String FLD_MANDATORY_IND = "FLD_MANDATORY_IND";
	public static final String FLD_VISIBLE_IND = "FLD_VISIBLE_IND";
	public static final String FLD_SORT_POSITION = "FLD_SORT_POSITION";
	public static final String FLD_SORT_ORDER = "FLD_SORT_ORDER";
	public static final String FLD_SORTABLE_IND = "FLD_SORTABLE_IND";
	public static final String FLD_DATA_TYPE = "FLD_DATA_TYPE";
	public static final String FLD_FILTER_TYPE = "FLD_FILTER_TYPE";
	public static final String FLD_FILTER_VALUES = "FLD_FILTER_VALUES";
	public static final String NO_FILTER = "NO_FILTER";
	public static final String FLD_OVERRIDDEN_VIEW_IND = "OVERRIDDEN_VIEW_IND";
	public static final String FLD_FILTER_ENABLED = "FLD_FILTER_IND";
	public static final String FLD_COLUMN_ORDERING_ENABLED = "FLD_COL_ORDER_IND";
	public static final String FLD_WIDGET_ID = "FLD_WDG_ID";
	public static final String FLD_HIDDEN_IND = "FLD_HIDDEN_IND";
	public static final String FLD_GROUPABLE_IND = "FLD_GROUPABLE_IND";
	public static final String FLD_MANDATORY_IN_GROUP_IND = "FLD_MAND_GROUP_IND";
	public static final String FLD_RELATIVE_POS_IN_GROUP = "FLD_REL_POS_IN_GROUP";
	public static final String FLD_POSITION_IN_GROUP = "FLD_POS_IN_GROUP";
	public static final String FLD_GROUPED_IND = "FLD_GROUPED_IND";
	public static final String FLD_START_UP_MODE = "FLD_START_UP_MODE";
	public static final String FLD_VIEW_TYPE = "FLD_VIEW_TYPE";
	public static final String FLD_CHART_TYPE = "FLD_CHART_TYPE";
	public static final String FLD_INIT_COLLAPSED = "FLD_INIT_COLLAPSED";
	public static final String FLD_DRILLDOWN_REQD_IND = "FLD_DD_REQ_IND";
	public static final String VIEW_NAME_NOT_UNIQUE = "VIEW_NM_NT_UNIQUE";
	public static final String FLD_SEARCH_INDICATOR = "FLD_SEARCH_INDICATOR";
	public static final String FLD_SEARCH_ORDER = "FLD_SEARCH_ORDER";
	public static final String FLD_SEARCH_DATA_TYPE = "FLD_SEARCH_DATA_TYPE";
	public static final String FLD_CODE_VAL_VIEW_ID = "FLD_CODE_VAL_VIEW_ID";
	public static final String FLD_CODE_VAL_CODE_COL = "FLD_CODE_VAL_CODE_COL";
	public static final String FLD_CODE_VAL_DISP_COL = "FLD_CODE_VAL_DISP_COL";
	public static final String FLD_X_SERIES_IND = "FLD_X_SERIES_IND";
	public static final String FLD_Y_SERIES_IND = "FLD_Y_SERIES_IND";
	public static final String FLD_DATA_SERIES_IND = "FLD_DATA_SERIES_IND";
	public static final String FLD_X_SERIES_COLUMNS = "FLD_X_SERIES_COLUMNS";
	public static final String FLD_Y_SERIES_COLUMN = "FLD_Y_SERIES_COLUMN";
	public static final String FLD_X_SERIES_COLUMNS_DNAME = "FLD_X_SERIES_COLUMNS_DNAME";
	public static final String FLD_Y_SERIES_COLUMNS_DNAME = "FLD_Y_SERIES_COLUMNS_DNAME";
	public static final String FLD_DATA_SERIES_COLUMN = "FLD_DATA_SERIES_COLUMN";
	public static final String FLD_FILTER_HANDLER_ID = "FLD_FILTER_HANDLER_ID";
	public static final String FLD_FILTER_DATA_TYPE = "FLD_FILTER_DATA_TYPE";

	public static final String FLD_FILTER_ENABLE_IND = "FLD_FILTER_ENABLE_IND";

	public static final String FLD_PREF_RATECARD_IND = "PREF_RATECARD_IND";
	public static final String FLD_PREF_RATECARD_ID = "PREF_RATECARD_ID";
	public static final String FLD_PREF_REF_CCY_AVBL_IND = "PREF_REFCCY_IND";
	public static final String FLD_PREF_REF_CCY = "PREF_REF_CCY";
	public static final String FLD_PREF_LAST_COL_HANDLING_IND = "PREF_LST_COL_MTHD_IND";
	public static final String FLD_PREF_LAST_COL_HANDLING = "PREF_LST_COL_MTHD";
	public static final String FLD_PREF_ACCT_GROUP_HANDLING_IND = "PREF_ACCT_GRP_MTHD_IND";
	public static final String FLD_PREF_ACCT_GROUP_HANDLING = "PREF_ACCT_GRP_MTHD";
	public static final String NO_CUST_DEF_VIEW_ID = "NO_CUST_DEF_VIEW_ID";

	public static final String DATA_TYPE_STRING = "string";
	public static final String DATA_TYPE_NUMBER = "float";
	public static final String DATA_TYPE_INTEGER = "int";
	public static final String DATA_TYPE_DATE = "date";
	public static final String DATA_TYPE_TIMESTAMP = "time";
	public static final String DATA_TYPE_NUMBER_EQ_CCY = "eqccy";
	public static final String DATA_TYPE_NUMBER_EQ_AMT = "eqamt";

	public static final String DATA_TYPE_RATE = "rate";

	public static final String DATE_FORMAT = "dd/MM/yyyy";
	public static final String DEFAULT_DATE_TIME_FORMAT = "dd/MM/yyyy HH:mm:ss";

	public static final String GROUP_POS_FIRST = "FIRST";
	public static final String GROUP_POS_LAST = "LAST";
	public static final String GROUP_POS_PRFX_BEFORE = "BEFORE_";
	public static final String GROUP_POS_PRFX_AFTER = "AFTER_";

	public static final String ACTION_INIT_ACTION = "INIT_DATA_ACTION";
	public static final String ACTION_INIT_HEADER_ACTION = "INIT_HEADER_ACTION";
	public static final String ACTION_INIT_MULTI_HEADER_ACTION = "INIT_MULTI_HEADER_ACTION";
	public static final String ACTION_INIT_VIEW = "INIT_VIEW";
	public static final String ACTION_PRINT = "PRINT_ACTION";
	public static final String ACTION_RESET_DEFAULT = "RESET_DEFAULT";
	public static final String ACTION_SAVE = "SAVE_ACTION";
	public static final String ACTION_PREF_SAVE_NEW = "PREF_SAVE_NEW_ACTION";
	public static final String ACTION_PREF_SAVE = "PREF_SAVE_ACTION";
	public static final String ACTION_PREF_DELETE = "PREF_DELETE_ACTION";
	public static final String ACTION_PREF_ACTION = "PREF_ACTION";

	public static final String PARAM_FILTER1_COMBO_PREF_FILTER = "FILTER1_COMBO_PREF_FILTER";
	public static final String PARAM_FILTER2_COMBO_PREF_FILTER = "FILTER2_COMBO_PREF_FILTER";
	public static final String PARAM_CONSTRAINT1_COM_PREF_FILTER = "CONSTRAINT1_COM_PREF_FILTER";
	public static final String PARAM_CONSTRAINT2_COM_PREF_FILTER = "CONSTRAINT2_COM_PREF_FILTER";
	public static final String PARAM_FILTER_TEXT1_PREF_FILTER = "FILTER_TEXT1_PREF_FILTER";
	public static final String PARAM_FILTER_DATE1_PREF_FILTER = "FILTER_DATE1_PREF_FILTER";
	public static final String PARAM_FILTER_DATE2_PREF_FILTER = "FILTER_DATE2_PREF_FILTER";
	public static final String PARAM_FILTER2_TEXT1_PREF_FILTER = "FILTER2_TEXT1_PREF_FILTER";
	public static final String PARAM_FILTER2_DATE1_PREF_FILTER = "FILTER2_DATE1_PREF_FILTER";
	public static final String PARAM_FILTER2_DATE2_PREF_FILTER = "FILTER2_DATE2_PREF_FILTER";

	public static final String PARAM_COLUMNS_GROUP = "COLUMNS_GROUP";
	public static final String PARAM_MULTI_SELECT = "MULTI_SELECT";
	public static final String PARAM_GROUP_BY = "GROUP_BY";
	public static final String PARAM_ACCOUNT_GRP = "ACCOUNT_GRP";
	public static final String PARAM_IS_DEFAULT_VIEW = "IS_DEFAULT_VIEW";
	public static final String PARAM_VIEW_NAME = "VIEW_NAME";
	public static final String VIEW_NAME_COUNT = "VIEW_NAME_COUNT";
	public static final String PARAM_WIDGET_ID = "WIDGET_ID";
	public static final String PARAM_WIDGET_USER_NO = "WIDGET_USER_NO";
	public static final String PARAM_WIDGET_GCIF = "WIDGET_GCIF";
	public static final String PARAM_DEFAULT_VIEW_ID = "DEFAULT_VIEW_ID";
	public static final String PARAM_PRODUCT_CODE = "OD_PRODUCT";
	public static final String PARAM_SUB_PRODUCT_CODE = "OD_SUB_PRODUCT";
	public static final String PARAM_SOURCE = "SOURCE";
	public static final String PARAM_RENDER_FLG = "RENDER_FLG";
	public static final String PARAM_VDEF_PRODUCT = "VDEF_PRODUCT";
	public static final String PARAM_VDEF_SUBPRODUCT = "VDEF_SUBPRODUCT";
	public static final String PREFERENCES = "PREFERENCES";
	public static final String HEADER_KEY_VIEWS_LIST = FrameworkConstants.HEADER_KEY_VIEWS_LIST;
	public static final String HEADER_KEY_ACC_GRP_LIST = FrameworkConstants.HEADER_KEY_ACC_GRP_LIST;
	public static final String HEADER_KEY_VIEW_METADATA = FrameworkConstants.HEADER_KEY_VIEW_METADATA;
	public static final String HEADER_KEY_VIEW_ADDITIONAL_META_DATA = FrameworkConstants.HEADER_KEY_VIEW_ADDITIONAL_META_DATA;
	public static final String HEADER_KEY_VIEW_DATA = FrameworkConstants.HEADER_KEY_VIEW_DATA;
	public static final String HEADER_KEY_REF_CCY_LIST = FrameworkConstants.HEADER_KEY_REF_CCY_LIST;
	public static final String HEADER_KEY_REFERENCE_CCY = FrameworkConstants.HEADER_KEY_REFERENCE_CCY;
	public static final String HEADER_KEY_ADDITIONAL_DATA = FrameworkConstants.HEADER_KEY_ADDITIONAL_DATA;
	public static final String HEADER_KEY_TOTAL_COUNT = FrameworkConstants.HEADER_KEY_TOTAL_COUNT;
	public static final String HEADER_KEY_LAST_UPDATED_DATE_TIME = FrameworkConstants.HEADER_KEY_LAST_UPDATED_DATE_TIME;
	public static final String HEADER_KEY_LAST_UPDATED_DATE_MSG = FrameworkConstants.HEADER_KEY_LAST_UPDATED_DATE_MSG;
	public static final String KEY_ALL_RECORDS = "ALL_RECORDS";
	public static final String KEY_CACHE_DATA = "CACHE_DATA";
	public static final String KEY_CACHE_KEY = "CACHE_KEY";
	public static final String HEADER_MULTI_WIDGETS_CHILDREN = FrameworkConstants.HEADER_MULTI_WIDGETS_CHILDREN;
	public static final String HEADER_MULTI_WIDGET_METADATA = FrameworkConstants.HEADER_MULTI_WIDGET_METADATA;

	public static final String PAGE_CODE_TYPE = "PAGE_CODE_TYPE";

	public static final String PREDEF_COL_PRIOR_DAY_EOD_BAL = "PRIOR_DAY_BAL";
	public static final String PREDEF_COL_TOTAL_EQUIV_BAL = "EQUIV_AMT";
	public static final String PREDEF_COL_TOTAL_BASE_CCY = "TOTAL_BASE_CCY";
	public static final String PREDEF_COL_PRIOR_DAY_EOD_DATE = "PRIOR_DAY_DATE";
	public static final String PREDEF_COL_BUCKETS = "BUCKET";
	public static final String PREDEF_COL_ACCOUNT_NUMBER = "ACCT_NBR";
	public static final String PREDEF_COL_BRANCH_ID = "BRANCH_ID";
	public static final String PREDEF_COL_1_DAY_FLOAT = "1_DAY_FLOAT";
	public static final String PREDEF_COL_2_DAY_FLOAT = "2_DAY_FLOAT";
	public static final String PREDEF_COL_3_DAY_FLOAT = "3_DAY_FLOAT";
	public static final String PREDEF_COL_DISCLAIM_REQD_IND = "DISCLAIM_REQD_IND";
	public static final String PREDEF_COL_INVST_STATUS = "INVST_STATUS";

	public static final String BUCKET_CURR_DAY = "CURR_DAY";
	public static final String BUCKET_DAY_1 = "DAY_1";
	public static final String BUCKET_DAY_2 = "DAY_2";
	public static final String BUCKET_DAY_3 = "DAY_3";
	public static final String BUCKET_WEEK_1 = "WEEK_1";
	public static final String BUCKET_WEEK_2 = "WEEK_2";
	public static final String BUCKET_MONTH_1 = "MONTH_1";
	public static final String BUCKET_MONTH_3 = "MONTH_3";
	public static final String BUCKET_MONTH_6 = "MONTH_6";
	public static final String BUCKET_MONTH_12 = "MONTH_12";

	public static final String BUCKET_NM_STR = "DAY1_AVAIL_AMT,DAY2_AVAIL_AMT,DAY3_AVAIL_AMT,WEEK1_AVAIL_AMT,WEEK2_AVAIL_AMT,MONTH1_AVAIL_AMT,MONTH3_AVAIL_AMT,MONTH6_AVAIL_AMT,MONTH12_AVAIL_AMT";
	public static final String LAST_COL_HANDLING_INCLUSIVE = "INCLUSIVE";
	public static final String LAST_COL_HANDLING_EXCLUSIVE = "EXCLUSIVE";
	public static final String PARAM_LAST_COL = "LAST_COL";
	public static final String DEFAULT_REFERENCE_CCY = "USD";

	// Entry to be used to add to set filter while saving preferences
	public static final String GT_EQUALS = "gtEqualTo";
	public static final String LT_EQUALS = "ltEqualTo";
	public static final String VAL_SELECT = "Select";

	// Keys to be used for reading user preferences.
	public final static String USER_PREFEERENCE_DATE_FORMAT = "USER_PREFEERENCE_DATE_FORMAT";
	public final static String USER_PREFEERENCE_AMT_FORMAT = "USER_PREFEERENCE_AMT_FORMAT";
	public static final String USER_PREFEERENCE_TIMEZONE_FORMAT = "TIMEZONE";

	// For the various tools key used in the result map.
	public static final String FLD_TOOLS_HISTORY = "HISTORY_IND";
	public static final String FLD_TOOLS_FILTER = "FILTER_IND";
	public static final String FLD_TOOLS_PULL_OUT = "PULL_OUT_IND";
	public static final String FLD_TOOLS_PRINT = "PRINT_IND";
	public static final String FLD_TOOLS_EXPORT_TO_EXCEL = "EXP_TO_EXCEL_IND";
	public static final String FLD_TOOLS_EXPORT_TO_PDF = "EXP_TO_PDF_IND";
	public static final String FLD_TOOLS_EXPORT_TO_CSV = "EXP_TO_CSV_IND";
	public static final String FLD_TOOLS_EXPORT_TO_JPG = "EXP_TO_JPG_IND";
	public static final String FLD_TOOLS_CUSTOMIZE = "CUSTOMIZE_IND";
	public static final String FLD_TOOLS_HELP = "HELP_IND";
	public static final String FLD_TOOLS_REFRESH = "REFRESH_IND";
	public static final String FLD_TOOLS_COLLAPSE = "COLLAPSE_IND";
	public static final String FLD_TOOLS_SHOW_AS_TOOLBAR = "SHOW_AS_TOOLBAR_IND";
	public static final String FLD_TOOLS_MAXIMIZE = "MAXIMIZE_IND";
	public static final String FLD_TOOLS_CHART = "CHART_TOOL_IND";
	public static final String TOOLS_CHART = "switchChart";

	public static final String FLD_TOOLS_EXPORT_TO_RTF = "EXP_TO_RTF_IND";

	// The list of possible tools
	public static final String TOOLS_HISTORY = "history";
	public static final String TOOLS_FILTER = "filter";
	public static final String TOOLS_PULLOUT = "pullout";
	public static final String TOOLS_PRINT = "print";
	public static final String TOOLS_EXPORT_TO_EXCEL = "excel";
	public static final String TOOLS_EXPORT_TO_PDF = "pdf";
	public static final String TOOLS_EXPORT_TO_CSV = "CSV";
	public static final String TOOLS_EXPORT_TO_JPG = "jpgexport";
	public static final String TOOLS_CUSTOMIZE = "gear";
	public static final String TOOLS_HELP = "help";
	public static final String TOOLS_REFRESH = "refresh";
	public static final String TOOLS_COLLAPSE = "collapse";
	public static final String TOOLS_SHOW_AS_TOOLBAR = "showastoolbar";
	public static final String TOOLS_MAXIMIZE = "maximize";

	public static final String TOOLS_EXPORT_TO_RTF = "rtf";

	// Cache Keys defined for the View Definition framework.
	public static final String CACHE_KEY_ALL_SYSTEM_VIEWS = "SYSTEM_VIEWS";
	public static final String CACHE_KEY_SYSTEM_VIEWS_WIDGET_TOOLS_CONFIG = "SYSTEM_VIEWS_WIDGET_TOOLS_CONFIG";

	public static final String CACHE_KEY_SYSTEM_CUSTOM_TOOLS_CONFIG = "SYSTEM_CUSTOM_TOOLS_CONFIG";
	public static final String CUSTOM_TOOLS_ID = "CUSTOM_TOOLS_ID";
	public static final String FLD_CUSTOM_TOOLS_LIST = "FLD_CUSTOM_TOOLS_LIST";
	public static final String GET_CUSTOM_TOOLS_DEF = "GET_CUSTOM_TOOLS_DEF";

	public static final String CACHE_KEY_VDF_FILTER_MASTER_DATA = "VDF_FILTER_MASTER_DATA";

	public static final String CACHE_KEY_AMOUNT_FORMAT_PRECISION = "AMOUNT_FORMAT_PRECISION";
	public static final String CACHE_KEY_DEFAULT_BANK_PROFILE = "DEFAULT_BANK_PROFILE";
	public static final String FLD_OD_BANK_REF_CURR = "OD_BANK_REF_CURR";
	public static final String ACTION_EXPORT = "EXPORT_ACTION";
	public static final String INPUT_ACTION = "INPUT_ACTION";
	public static final String FETCH_ACCGRP_SUMMARY_WP = "FETCH_ACCGRP_SUMMARY_WP";

	public static final String CHART_DATA = "CHART_DATA";
	public static final String CHART_TYPE_PIE = "PIE";
	public static final String CHART_TYPE_BAR = "BAR";
	public static final String CHART_TYPE_LINE = "LINE";
	public static final String X_SERIES_DATA = "X_SERIES_DATA";
	public static final String Y_SERIES_DATA = "Y_SERIES_DATA";
	public static final String ECID = "ECID";
	public static final String ENTITY_NAME = "ENTITY_NAME";
	public static final String CCY_CODE = "CCY_CODE";
	public static final String CCY_NAME = "CCY_NAME";
	public static final String ENTITY_LIST = "ENTITY_LIST";
	public static final String CCY_LIST = "CCY_LIST";
	public static final String ENTITY_COL_ID = "ENTITY_COL_ID";
	public static final String CCY_COL_ID = "CCY_COL_ID";
	public static final String CLIENT_NAME = "CLIENT_NAME";
	public static final String FUND_CCY = "FUND_CCY";
	public static final String CURRENCY_CD = "CURRENCY_CD";
	public static final String EQUICURR = "EQUICURR";
	public static final String PRIN_CCY = "PRIN_CCY";
	public static final String BALTYPE_INVST_CHART_VIEW = "BALTYPE_INVST_CHART_VIEW";
	public static final String ENTITY_CCY_INV_CMP_CHART_VIEW = "ENTITY_CCY_INV_CMP_CHART_VIEW";
	public static final String CNTRY_CCY_CURRENT_CMP_CHART_VIEW = "CNTRY_CCY_CURRENT_CMP_CHART_VIEW";

	public static final String FILTER_ACTION = "FILTER_ACTION";
	public static final String ACCOUNT_NUMBER = "ACCOUNT_NUMBER";
	public static final String START_ROW_NUM = "start";
	public static final String CLM_PARTICULARS = "PARTICULARS";
	public static final String CLM_VALUE = "VALUE";
	public static final String VALUE_DELIM = "|";
	public static final String LBL_EMPTY_TEXT = "LBL_EMPTY_TEXT";
	public static final String BBAR_BUTTON_POSITIVE = "P";
	public static final String BBAR_BUTTON_NEGATIVE = "N";
	public static final String POSITIVE_BUTTONS = "POSITIVE_BUTTONS";
	public static final String NEGATIVE_BUTTONS = "NEGATIVE_BUTTONS";
	public static final String FLD_BTN_TYPE_IND = "FLD_BTN_TYPE_IND";
	public static final String FLD_BBAR_BUTTONS = "FLD_BBAR_BUTTONS";
	public static final String FLD_TBAR_BUTTONS = "FLD_TBAR_BUTTONS";

	public static final String LOCALE = "_en_US";
	public static final String LQDY_RESOURCEBUNDLE = "liquidity";
	public static final String STR_LIST_VIEW = "STR_LIST_VIEW";

	public static final String WORKSPACES = "WORKSPACES";
	public static final String MONTH_YEAR_FORMAT = "MM-yyyy";

	public static final String FLD_PREF_PERIOD = "PREF_PERIOD";
	public static final String FLD_PREF_SUBPERIOD = "PREF_SUBPERIOD";
	public static final String FLD_PREF_PERIOD_IND = "PREF_PERIOD_IND";
	public static final String FLD_PREF_FROM_DATE = "PREF_FROM_DATE";
	public static final String FLD_PREF_TO_DATE = "PREF_TO_DATE";

	public static final String FLD_LINKED_SOURCE_AMT = "LINKED_SOURCE_AMT";
	public static final String FLD_LINKED_SOURCE_CCY = "LINKED_SOURCE_CCY";

	public static final String FLD_LOOKUP_FILTER_EXTPARAMS = "LOOKUP_FILTER_EXTPARAMS";
	public static final String RATECARD = "RATECARD";
	public static final String FIELD_COD_CCY = "COD_CCY";
	public static final String FIELD_NBR_DECIMAL = "NBR_DECIMAL";

	public static final String VIEW_CONTEXT_LIST = FrameworkConstants.VIEW_CONTEXT_LIST;

	public static final String PARAM_WORKSPACE_ID = "WORKSPACE_ID";
	public static final String PARAM_WORKSPACE_DISPLAY_NM = "WORKSPACE_DISPLAY_NM";
	public static final String PARAM_PRODUCT_CATEGORY = "PRODUCT_CATEGORY";
	public static final String PARAM_PRODUCT_CATEGORY_DISPLAY_NM = "PRODUCT_CATEGORY_DISPLAY_NM";
	public static final String PARAM_LAYOUT = "LAYOUT";
	public static final String PARAM_LAYOUT_ID = "LAYOUT_ID";
	public static final String PARAM_LAYOUTS = "LAYOUTS";
	public static final String PARAM_WORKSPACE_LAYOUT = "WORKSPACE_LAYOUT";
	public static final String PARAM_LAYOUT_CATAGORY = "LAYOUT_CATAGORY";
	public static final String PARAM_LAYOUT_DISPLAY_NM = "LAYOUT_DISPLAY_NM";
	public static final String PARAM_CHILD_LAYOUTS = "CHILD_LAYOUTS";
	public static final String PARAM_CHILD_WIDGETS = "CHILD_WIDGETS";
	public static final String PARAM_PROPORTION = "PROPORTION";
	public static final String PARAM_SYSTEM_WORKSPACE_IND = "SYSTEM_WORKSPACE_IND";
	public static final String PARAM_WORKSPACE_ACTIVE_HANDLER = "WORKSPACE_ACTIVE_HANDLER";
	public static final String PARAM_EXISTING_WORKSPACE_ID = "EXISTING_WORKSPACE_ID";
	public static final String PARAM_WIDGETS = "WIDGETS";
	public static final String PARAM_BLOCK_POSITION = "BLOCK_POSITION";
	public static final String PARAM_MAX_POSITION = "MAX_POSITION";
	public static final String PARAM_POSITION = "POSITION";
	public static final String PARAM_WORKSPACE_MENUS = "WORKSPACE_MENUS";
	public static final String PARAM_CLOSED_IND = "CLOSED_IND";

	public static final String ACTION_APPSTORE_INIT_ACTION = "ACTION_APPSTORE_INIT_ACTION";
	public static final String ACTION_APPSTORE_SAVE = "ACTION_APPSTORE_SAVE";
	public static final String ACTION_APPSTORE_UPDATE = "ACTION_APPSTORE_UPDATE";
	public static final String ACTION_APPSTORE_DELETE = "ACTION_APPSTORE_DELETE";

	public static final String ACTION_APPSTORE_GET_ALL_WORKSPACES = "ACTION_APPSTORE_GET_ALL_WORKSPACES";
	public static final String ACTION_APPSTORE_GET_WORKSPACE_WIDGETS = "ACTION_APPSTORE_GET_WORKSPACE_WIDGETS";

	public static final String DB_DAM_KEY_APPSTORE = "APPSTORE_MNT";

	public static final String DB_EXT_KEY_PRODUCT_CATEGORY_WIDGETS_QRY = "PRODUCT_CATEGORY_WIDGETS_QRY";
	public static final String DB_EXT_KEY_ALL_WIDGETS_QRY = "ALL_WIDGETS_QRY";
	public static final String DB_EXT_KEY_LAYOUT_DEFINITION_QRY = "LAYOUT_DEFINITION_QRY";
	public static final String DB_EXT_KEY_WORKSPACE_LAYOUT_MAP_QRY = "WORKSPACE_LAYOUT_MAP_QRY";
	public static final String DB_EXT_KEY_LAYOUT_WIDGET_MAP_QRY = "LAYOUT_WIDGET_MAP_QRY";
	public static final String DB_EXT_KEY_WORKSPACE_DEFINITION_QRY = "WORKSPACE_DEFINITION_QRY";
	public static final String DB_EXT_KEY_WORKSPACE_MAX_POSITION_QRY = "WORKSPACE_MAX_POSITION_QRY";
	public static final String DB_EXT_KEY_LAYOUT_MAX_POSITION_IN_WORKSPACE_QRY = "LAYOUT_MAX_POSITION_IN_WORKSPACE_QRY";
	public static final String DB_EXT_KEY_WORKSPACE_MENU_DEFINITION_QRY = "WORKSPACE_MENU_DEFINITION_QRY";
	public static final String DB_EXT_KEY_WORKSPACE_LAYOUT_IDS_QRY = "WORKSPACE_LAYOUT_IDS_QRY";
	public static final String DB_EXT_KEY_WORKSPACE_DEFINITION_BY_NAME_QRY = "WORKSPACE_DEFINITION_BY_NAME_QRY";

	public static final String LAYOUT_ID_PREFIX = "LYT_";
	public static final String TWO_COLUMN_LAYOUT = "TWO-COLUMN";
	public static final String THREE_COLUMN_LAYOUT = "THREE-COLUMN";
	public static final String PRODUCT_CATEGORY_WIDGETS_MAP = "PRODUCT_CATEGORY_WIDGETS_MAP";
	public static final String LAYOUT_CATAGORIES = "LAYOUT_CATAGORIES";
	public static final String SELECTED_WORKSPACE = "SELECTED_WORKSPACE";
	public static final String ALL = "ALL";
	public static final String LBL_ALL_WIDGETS = "LBL_ALL_WIDGETS";
	public static final String ALL_WIDGETS = "ALL_WIDGETS";
	public static final String WIDGET_META_DATA = "WIDGET_META_DATA";
	public static final String PRODUCT_LIST = "PRODUCT_LIST";
	public static final String ENTL_PRODUCT_LIST = "ENTL_PRODUCT_LIST";
	public static final String WGT_INDEX = "WGT_INDEX";
	public static final String EMPTY_STR = "";

	public static final String VALID_LAYOUT_CATAGORIES_FOR_APPSTORE = "VALID_LAYOUT_CATAGORIES_FOR_APPSTORE";
	public static final String CUSTOM_WORKSPACE_MENU_ITEMS = "CUSTOM_WORKSPACE_MENU_ITEMS";
	public static final String INCLUDE_ALL_CATAGORY_IN_APPSTORE = "INCLUDE_ALL_CATAGORY_IN_APPSTORE";
	public static final String DEFAULT_WORKSPACE = "DASHBOARD";
	public static final String ALLOWED_WIDGETS_LIMIT_FOR_APPSTORE = "ALLOWED_WIDGETS_LIMIT_FOR_APPSTORE";

	public static final String ERR_EMPTY_WORKSPACE_ID = "ERR_EMPTY_WORKSPACE_ID";
	public static final String ERR_INVALID_WORKSPACE_ID = "ERR_INVALID_WORKSPACE_ID";
	public static final String ERR_WORKSPACE_DISP_NAME_EXISTS = "ERR_WORKSPACE_DISP_NAME_EXISTS";
	public static final String ERR_WORKSPACE_DISP_NAME_EMPTY = "ERR_WORKSPACE_DISP_NAME_EMPTY";
	public static final String ERR_WORKSPACE_DISP_NAME_EXISTS_IN_SYSTEM_LEVEL = "ERR_WORKSPACE_DISP_NAME_EXISTS_IN_SYSTEM_LEVEL";
	public static final String ERR_WORKSPACE_DISP_NAME_EXISTS_IN_CORP_LEVEL = "ERR_WORKSPACE_DISP_NAME_EXISTS_IN_CORPORATE_LEVEL";
	public static final String ERR_WORKSPACE_DISP_NAME_EXISTS_IN_USER_LEVEL = "ERR_WORKSPACE_DISP_NAME_EXISTS_IN_USER_LEVEL";
	public static final String ERR_WIDGETS_COUNT = "ERR_WIDGETS_COUNT";
	public final static String ERR_SERVER_VALDN_FAILURE = "ERR_SERVER_VALDN_FAILURE";

	public static final String ACTIVITY_LIST_VIEW_STORED_PROC = "ACTIVITY_LIST_VIEW_DETAILS";

	public final static String INPUT_PRODUCT = "INPUT_PRODUCT";

	public static final String APP_MENU_ITEMS_META = "APP_MENU_ITEMS_META";

	public static final String FLD_GLOBAL_DATE_FILTER_IND = "FLD_GLOBAL_DATE_FILTER_IND";
	public static final String FILTER_VALUE = "FILTER_VALUE";
	public static final String FILTER_UNIT = "FILTER_UNIT";
	public static final String DISPLAY_NM_KEY = "DISPLAY_NM_KEY";
	public static final String ENABLE_IND = "ENABLE_IND";
	public static final String DB_EXTN_GET_DATE_FILTERS_QRY = "GET_DATE_FILTERS_CACHE_QRY";
	public static final String FLD_POSSIBLE_DATE_FILTERS = "FLD_POSSIBLE_DATE_FILTERS";
	public static final String FLD_DATE_FILTERS_RANGE = "FLD_DATE_FILTERS_RANGE";
	public static final String COLUMN_ID = "COLUMN_ID";
	public static final String IS_DEFAULT_FILTER = "IS_DEFAULT_FILTER";
	public static final String TO_DATE = "TO_DATE";
	public static final String FROM_DATE = "FROM_DATE";
	public static final String MIN_UNIT = "MIN_UNIT";
	public static final String MIN_VALUE = "MIN_VALUE";
	public static final String MAX_UNIT = "MAX_UNIT";
	public static final String MAXI_VALUE = "MAX_VALUE";
	public static final String MAX_DATE = "MAX_DATE";
	public static final String MIN_DATE = "MIN_DATE";
	public static final String GLOBAL_MIN_DATE = "GLOBAL_MIN_DATE";
	public static final String GLOBAL_PERIOD_VAL = "GLOBAL_PERIOD_VAL";
	public static final String GLOBAL_PERIOD_UNIT = "GLOBAL_PERIOD_UNIT";
	public static final String D = "D";
	public static final String M = "M";
	public static final String Y = "Y";

	public static final String SM = "SM";
	public static final String SY = "SY";
	public static final String SW = "SW";
	public static final String W = "W";

	public static final String PD = "PD";
	public static final String PW = "PW";
	public static final String PM = "PM";
	public static final String PY = "PY";
	public static final String MAX_SELECTION_PERIOD_UNIT = "MAX_SELECTION_PERIOD_UNIT";
	public static final String MAX_SELECTION_PERIOD_VAL = "MAX_SELECTION_PERIOD_VAL";

	public static final String IS_DATE_FILTER_FORM = "IS_DATE_FILTER_FORM";
	public static final String COLUMN_VALUE = "COLUMN_VALUE";
	public static final String NO_FILTERS = "-1";

	public static final String FLD_DISABLED = "FLD_IS_DISABLED";

	public static final String FLD_DATA_SRC_ID = "FLD_DATA_SRC_ID";
	public static final String FLD_AUTOLOAD_IND = "FLD_AUTOLOAD_IND";

	public static final String GET_VIEWFORWIDGETID_ACTION = "GET_VIEWFORWIDGETID_ACTION";
	public static final String DB_EXT_KEY_GETVIEW_FOR_WIDGETINFO = "GET_VIEWFOR_WIDGETID";
	public static final String LOOKUP_FLAG = "LOOKUP_FLAG";
	public static final String RESULT = "result";

	public static final String RESPONSE_SUCCESS_MSG = "Picture Updated Succesfully";
	public static final String RESPONSE_FAILURE_MSG = "Picture not updated";

	public static final String FLD_GROUP_HEADER_REQD = "FLD_GROUP_HEADER_REQD";
	public static final String FLD_PARENT_COLUMN_ID = "FLD_PARENT_COLUMN_ID";
	public static final String GROUP_HEADER_REQD = "GROUP_HEADER_REQD";

	public static final String DEVICE = "DEVICE";

	public static final String INIT_ACTION = "INIT_ACTION";

	public static final String FLD_INITIAL_RECORDS_COUNT = "INITIAL_RECORDS_COUNT";

	public static final String GET_APP_CONTAINER_METADATA = "GET_APP_CONTAINER_METADATA";
	public static final String GET_ALL_APPS = "GET_ALL_APPS";
	public static final String APPS_NOT_AVAILABLE = "APPS_NOT_AVAILABLE";
	public static final String APP_DEFINTION_FOR_ADD = "APP_DEFINTION_FOR_ADD";
	public static final String APP_DEFINTION_FOR_DELETE = "APP_DEFINTION_FOR_DELETE";

	public static final String GET_WIDGET_METADATA = "GET_WIDGET_MD";
	public static final String WIDGET_METADATA = "WIDGET_METADATA";

	public static final String APP_ENTL_CLASS = "APP_ENTL_CLASS";
	public static final String ENTL_TYPE = "ENTL_TYPE";
	public static final String FAV_APPS_REQ_IND = "FAV_APPS_REQ_IND";
	public static final String APP_CONTAINER_ID = "APP_CONTAINER_ID";
	public static final String CHILD_APPS = "CHILD_APPS";
	public static final String BUNDLE_KEY = "BUNDLE_KEY";
	public static final String PROPORTION = "PROPORTION";
	public static final String APP_ID = "APP_ID";

	public static final String FLD_IS_DATA_CACHED = "FLD_IS_DATA_CACHED";
	public static final String FLD_DATA_CACHE_SCOPE = "FLD_DATA_CACHE_SCOPE";
	public static final String INPUT_SESSION_ID = "INPUT_SESSION_ID";

	public static final String FLD_IS_GROUP_MODIFIABLE = "FLD_IS_GROUP_MODIFIABLE";
	public static final String FLD_INIT_GROUP_STAGE = "FLD_INIT_GROUP_STAGE";
	public static final String FLD_IS_SUMMARY_REQUIRED = "FLD_IS_SUMMARY_REQUIRED";
	public static final String FLD_GROUPABLE_COLUMNS = "FLD_GROUPABLE_COLUMNS";

	public static final String FLD_SUMMARY_TYPE = "FLD_SUMMARY_TYPE";
	public static final String FLD_GROUPING_COLUMNS = "FLD_GROUPING_COLUMNS";

	public static final String KEYDELIMITER = "&_&";
	public static final String IS_LEAF = "IS_LEAF";
	public static final String CHILD = "CHILD";
	public static final String AGGREGATION = "AGGREGATION";
	public static final String GRPHEADERDELIMITER = "::::";
	public static final String GRP_HEADER = "GRP_HEADER";
	public static final String GRPDATA = "GRPDATA";
	public static final String STR_EQUALS = "STR_EQUALS";
	public static final String STR = "String";
	public static final String GROUP_FILTERS = "GROUP_FILTERS";
	public static final String DATE_FORMAT_DDMM_YYYY = "DATE_FORMAT_ddmmYYYY";
	public static final String DATA_REQ_TYPE = "DATA_REQ_TYPE";
	public static final String CHILDDATA = "CHILDDATA";

	public static final String FLD_CONTEXT_ACTION_IND = "FLD_CONTEXT_ACTION_IND";

	public static final String COLUMN_PROPERTIES = "_colProperties";

	public static final String REFRESH_DATA = "REFRESH_DATA";
	public static final String EQUCURR = "EQUCURR";
	public static final String change = "change";

	public static final String FLD_CHART_Y_MIN = "FLD_CHART_Y_MIN";
	public static final String FLD_CHART_Y_MAX = "FLD_CHART_Y_MAX";
	public static String FLD_CHART_NO_TREAD_LINES = "FLD_CHART_NO_TREAD_LINES";

	public static final String ACTION_CLEAR_EHCACHE_DATA = "CLEAR_EHCACHE_DATA_ACTION";
	public static final String INSTANCE = "INSTANCE";
	public static final String SESSION = "SESSION";

	public static final String IS_LOOK_UP = "IS_LOOK_UP";

	public static final String ENTITLEMENTS = "ENTITLEMENTS";

	public static final String FLD_APPEND_CURRENCY_MODE = "FLD_APPEND_CURRENCY_MODE";

	public static final String FLD_DETAIL_MSG_IND = "FLD_DETAIL_MSG_IND";
	public static final String FLD_DETAIL_MSG_LBL = "FLD_DETAIL_MSG_LBL";

	public static final String FLD_LOGO_URL = "FLD_LOGO_URL";
	public static final String FLD_LOGO_PROPERTY = "FLD_LOGO_PROPERTY";
	public static final String FLD_LINKED_DATA_SERIES = "FLD_LINKED_DATA_SERIES";
	public static final String FLD_PLOT_TYPE = "FLD_PLOT_TYPE";
	public static final String DB_EXT_KEY_GET_CHART_ADDL_CONFIG = "GET_CHART_ADDL_CONFIG";
	public static final String CHART_ADDL_CONFIG = "CHART_ADDL_CONFIG";
	public static final String REFLINE_TEXT = "REFLINE_TEXT";
	public static final String REFLINE_VALUE = "REFLINE_VALUE";
	public static final String COLOR_RANGE_MIN = "COLOR_RANGE_MIN";
	public static final String COLOR_RANGE_MAX = "COLOR_RANGE_MAX";
	public static final String CUSTOM_TOOLTEXT = "CUSTOM_TOOLTEXT";
	public static final String CUSTOM_LABEL = "CUSTOM_LABEL";
	public static final String CUSTOM_LABEL_POSITION = "CUSTOM_LABEL_POSITION";
	public static final String REFLINE = "REFLINE";
	public static final String COLOR_RANGE = "COLOR_RANGE";
	public static final String CUST_LABEL = "CUST_LABEL";
	public static final String CUST_TOOLTEXT = "CUST_TOOLTEXT";
	public static final String CHART_FORMATTED_DATA = "CHART_FORMATTED_DATA";
	public static final String COLOR_CODE = "COLOR_CODE";
	public static final String FLD_CUSTOM_TOOLTEXT = "FLD_CUSTOM_TOOLTEXT";
	public static final String FLD_BORDER_IND = "FLD_BORDER_IND";
	public static final String FLD_SWITCHING_CHARTS = "FLD_SWITCHING_CHARTS";

	public static final String DEVICE_CHANNEL = "CHANNEL_ID";
	public static final String INIT_CACHE = "INIT_CACHE_ACTION";

	public static final String FLD_PRIORITY = "FLD_PRIORITY";
	public static final String FLD_RESPONSIVE_TEMPLATE = "FLD_RESPONSIVE_TEMPLATE";

	public static final String FLD_BUNDLE_KEY = "FLD_BUNDLE_KEY";
	public static final String DB_EXT_KEY_GET_APP_TOOLS_MAP = "GET_APP_TOOLS_MAP";
	public static final String CACHE_KEY_APP_TOOLS_MAP = "CT_APP_TOOLS";
	public static final String APPLICABLE_TOOLS = "APPLICABLE_TOOLS";
	public static final String TOOL_ID = "TOOL_ID";

	public static final String PARAM_CUSTOMSPACE_BLOCKPOSITION = "CUSTOMSPACE_BLOCKPOSITION";
	public static final String PARAM_TFD_REQ = "TFD_REQ";
	public static final String PARAM_CHANNEL_ID = "CHANNEL_ID";
	public static final String PARAM_BUNDLE_KEY = "BUNDLE_KEY";
	public static final String PARAM_CONTEXT_APP_WIDGET = "CONTEXT_APP_WIDGET";
	public static final String PARAM_IS_PARENT_IND = "IS_PARENT_IND";
	public static final String PARAM_PARENT_LAYOUT = "PARENT_LAYOUT";
	public static final String PARAM_CONTAINER_ID = "CONTAINER_ID";
	public static final String INPUT_CHANNEL_ID = "INPUT_CHANNEL_ID";
	public static final String PARAM_DEFAULT_WIDGET_IND = "DEFAULT_WIDGET_IND";
	public static final String PARAM_PROD_BUNDLE_KEY = "PROD_BUNDLE_KEY";
	public static final String KEY_TOTAL_NUM_RECORDS = "TOTAL_NUM_RECORDS";

	public static final String TEMPLATE_ID = "TEMPLATE_ID";
	public static final String TEMPLATE_CONFIG = "TEMPLATE_CONFIG";
	public static final String CHART_ACTION_CODE = "CHART_ACTION_CODE";
	public static final String FILTERED_DATA = "FILTERED_DATA";
	public static final String KEY_MODIFIED_COLUMN_NAMES = "MODIFIED_COLUMN_NAMES";
	public static final String DYNAMIC_YCOLS = "DYNAMIC_YCOLS";

	public static final String DEFAULT = "DEFAULT";
	public static final String VIEW_TYPE_CLASSIC_GRID = "CLASSIC_GRID";
	public static final String VIEW_TYPE_LIST = "LIST";
	public static final String VIEW_TYPE_PAGING = "PAGING";
	public static final String VIEW_TYPE_GROUP = "GROUP";
	public static final String VIEW_TYPE_CALENDAR = "CALENDAR";
	public static final String VIEW_TYPE_CHART = "CHART";
	public static final String VIEW_TYPE_TREE = "TREE";
	public static final String VIEW_TYPE_ADVGROUP = "ADVGROUP";
	public static final String VIEW_TYPE_PROPERTY = "PROPERTY";

	public static final String FETCH_DATA_QUERY_FOR_VIEW = "FETCH_DATA_QUERY_FOR_VIEW";
	public static final String DEFAULT_VIEW_DATA = "DEFAULT_VIEW_DATA";
	public static final String FLD_COLUMN_IDS = "COLUMN_IDS";
	public static final String FLD_TABLE_NAMES = "TABLE_NAMES";
	public static final String FLD_WHERE_CLAUSE = "WHERE_CLAUSE";
	public static final String FLD_GROUPBY_COLUMN_IDS = "GROUPBY_COLUMN_IDS";
	public static final String FLD_ORDERBY_COLUMN_IDS = "ORDERBY_COLUMN_IDS";
	public static final String FLD_DATA_QUERY = "DATA_QUERY";
	public static final String FLD_ACTUAL_QUERY = "ACTUAL_QUERY";
	public static final String ACTIVE_TOKEN = "ACTIVE_TOKEN";
	public static final String FLD_DATA_SERIES_COLUMNS_DNAME = "FLD_DATA_SERIES_COLUMNS_DNAME";
	public static final String ADDL_FILTERS = "ADDL_FILTERS";// Added to include filters to the data query in case if the filter panel is used in the widget
	public static final String INPUT_USER_ROLE = "INPUT_USER_ROLE";
	public static final String ADDL_LIST_CONFIG = "ADDL_LIST_CONFIG";
	public static final String SUB_WORKSPACE_LAYOUT = "SUB_WORKSPACE_LAYOUT";
	public static final String LAYOUT_CATAGORY = "LAYOUT_CATAGORY";
	public static final String LEFT = "LEFT";
	public static final String RIGHT = "RIGHT";
	public static final String CENTER = "CENTER";
	public static final String LEFT_APP_LIST = "LEFT_APP_LIST";
	public static final String RIGHT_APP_LIST = "RIGHT_APP_LIST";
	public static final String CENTER_APP_LIST = "CENTER_APP_LIST";
	public static final String GET_DYC_METADATA="GET_DYC_METADATA";
	public static final String OLD_DYC_METADATA="OLD_DYC_METADATA";
	public static final String LEFT_APP = "LEFT_APP";
	public static final String RIGHT_APP = "RIGHT_APP";
	public static final String CENTER_APP = "CENTER_APP";
	public static final String LEFT_POSITION = "LEFT_POSITION";
	public static final String RIGHT_POSITION = "RIGHT_POSITION";
	public static final String CENTER_POSITION = "CENTER_POSITION";
	public static final String CHILD_WIDGETS_DISPLAY_NM="CHILD_WIDGETS_DISPLAY_NM";
	public static final String LEFT_DISPLAY_NM="LEFT_DISPLAY_NM";
	public static final String RIGHT_DISPLAY_NM="RIGHT_DISPLAY_NM";
	public static final String CENTER_DISPLAY_NM="CENTER_DISPLAY_NM";
	public static final String LEFT_APP_NAME="LEFT_APP_NAME";
	public static final String RIGHT_APP_NAME="RIGHT_APP_NAME";
	public static final String CENTER_APP_NAME="CENTER_APP_NAME";
	public static final String DB_DAM_KEY_FETCH_CONNECTION_DETAILS = "FETCH_CONNECTION_DETAILS";
	public static final String DATA_SRC_ID = "DATA_SRC_ID";
	
	
	public static final String FLD_COLUMN_WIDTH = "FLD_COLUMN_WIDTH";
	
	public static final String COLUMN_TYPE_STRING = "string";
	public static final String COLUMN_TYPE_AMOUNT = "float";
	public static final String COLUMN_TYPE_NUMERIC_STRING = "numstr";
	public static final String COLUMN_TYPE_DATE_ONLY = "date";
	public static final String COLUMN_TYPE_DATE_TIME = "time";
	public static final String COLUMN_TYPE_RATE = "rate";
	public static final String COLUMN_TYPE_BOOLEAN = "boolcheck";
	public static final String COLUMN_TYPE_PERCENTAGE = "percentage";
	public static final String COLUMN_TYPE_TRANSLATED_VALUE = "translatedvalue";
	public static final String COLUMN_TYPE_PROPERTY_VALUE = "propertyvalue";
	public static final String COLUMN_TYPE_TEMPLATE = "template";
	public static final String COLUMN_TYPE_COMBO_LIST = "combolist";
	public static final String COLUMN_TYPE_NUMBER ="int";
	public static final String COLUMN_TYPE_CONTEXT ="context";
	public static final String COLUMN_TYPE_CURRENCY ="eqccy";
	public static final String COLUMN_TYPE_EQ_AMOUNT ="eqamt";
	
	// Added for Charts Enhancements..
	
	public static final String CHART_BG_COLOR = "bgColor";
	public static final String PALETTE_COLORS = "paletteColors";
	public static final String SHOW_TOOL_TIP = "showToolTip";
	public static final String setToolTipBgColor = "toolTipBgColor";
	public static final String setNumberPrefix = "numberPrefix";
	public static final String setNumberSuffix = "numberSuffix";
	public static final String showHoverEffect = "hoverEffect";
	public static final String legendPosition = "legendPosition";
	public static final String formatNumberScale = "formatNumberScale";
	public static final String numberScaleValue = "numberScaleValue";
	public static final String numberScaleUnit = "numberScaleUnit";
	public static final String decimals = "decimals";
	public static final String valueFontColor = "valueFontColor";
	public static final String thousandSeparatorPosition = "kposition";
	public static final String rotateLabels = "rotateLabels";
	public static final String slantLabels = "slantLabels";
	public static final String CHART_PROPERTIES = "chartProperties";
	
	public static final String FLD_PRIMARY_IND = "FLD_PRIMARY_IND";
	public static final String FLD_SECONDARY_IND = "FLD_SECONDARY_IND";
	
	public static final String showSum = "showSum";
	public static final String stack100Percent = "stack100Percent";
	public static final String labelFontBold = "labelFontBold";
	public static final String pointerRadius = "pointerRadius";
	public static final String pointerBgColor = "pointerBgColor";
	public static final String pivotFillColor = "pivotFillColor";
	public static final String gaugeOuterRadius = "gaugeOuterRadius";
	public static final String gaugeInnerRadius = "gaugeInnerRadius";
	public static final String plotFillColor = "plotFillColor";
	public static final String targetColor = "targetColor";
	public static final String CHART_ADDITIONAL_PROPERTIES = "CHART_ADDITIONAL_PROPERTIES";

}
