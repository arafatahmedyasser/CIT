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

package com.intellectdesign.canvas.report.util;

/**
 * this is a singleton class ReportConstants
 * 
 * @Version 1.0
 */
public class ReportConstants
{
	private ReportConstants()
	{
	}

	public static final String DB_DATA_SOURCE = "DB_DATA_SOURCE";

	// this is the Data access map ket to be used in all the query
	public static final String DB_DAM_KEY_INFO_REPORT = "INFO_REPORT_FRMWK_MNT";
	public static final String OPR_EXT_FETCH_DATASOURCES = "FETCH_DATASOURCES";
	public static final String REPORT_ID = "REPORT_ID";
	public static final String DATA_SOURCE_TYPE = "DATA_SOURCE_TYPE";
	public static final String OPR_EXT_GET_DS_IMPL_CLASS = "GET_DS_IMPL_CLASS";
	public static final String DATA_SOURCE_KEY = "DATA_SOURCE_KEY";
	public static final String DS_IMPLEMENTATION_CLASS = "DS_IMPLEMENTATION_CLASS";
	public static final String REPORT_DEFINITION = "REPORT_DEFINITION";
	public static final String REPORT_SCHEDULE = "REPORT_SCHEDULE";
	public static final String ERROR_SYSTEM_ERROR = "SYSERROR";
	public static final String KEY_ERROR_CODE = "ERR_CODE";
	public static final String KEY_ERROR_MESSAGE = "ERR_MESS";
	public static final String KEY_ERROR_CODE_RUNNOW = "ERR_RUNNOW";
	public static final String KEY_ERROR_MESSAGE_RUNNOW = "ERR_MESS_RUNNOW";
	public static final String ERR_CD_RPT_DEFINITION_NULL = "REP_FW_ERR_001";
	public static final String ERR_CD_RPT_ID_NULL = "REP_FW_ERR_002";
	public static final String ERR_CD_RPT_INST_ID_NULL = "REP_FW_ERR_003";
	public static final String ERR_CD_RPT_SELECTED_COLS_NULL = "REP_FW_ERR_004";
	public static final String ERR_CD_INSERT_RPT_INST = "REP_FW_ERR_005";
	public static final String ERR_CD_INSERT_RPT_DEFINITION = "REP_FW_ERR_006";
	public static final String ERR_CD_RPT_DEFINITION_SAVE = "REP_FW_ERR_007";
	public static final String ERR_CD_RPT_DEFI_SAVE_SCHEDULE = "REP_FW_ERR_008";
	public static final String ERR_CD_RPT_DEFI_SAVE_RUN = "REP_FW_ERR_009";
	public static final String ERR_CD_RPT_DEFINITION_DEL = "REP_FW_ERR_010";
	public static final String ERR_CD_RPT_DEFINITION_SCHEDULE = "REP_FW_ERR_011";
	public static final String ERR_CD_RPT_DATA_AGGREGATION = "REP_FW_ERR_012";
	public static final String ERR_CD_RPT_GENERATION = "REP_FW_ERR_013";
	public static final String ERR_CD_RPT_PUBLISHER_FAILED = "REP_FW_ERR_014";
	public static final String ERR_CD_RPT_NOTIFICATION_FAILED = "REP_FW_ERR_015";
	public static final String ERR_CD_RPT_INST_DOWNLOAD = "REP_FW_ERR_015";
	/* Report Instance selection(Get) process Error Code and Message */
	public static final String ERR_CD_GET_RPT_INST = "REP_FW_ERR_016";
	public static final String KEY_ERROR_CODE_ENTITLEMENT = "REP_FW_ERR_017";
	public static final String REPORT_ERR_DATE_FORMATTING_AGGR_DATA = "REP_FW_ERR_018";
	public static final String REPORT_ERR_AMT_FORMATTING_AGGR_DATA = "REP_FW_ERR_019";
	public static final String REPORT_ERR_CURR_COV_AGGR_DATA = "REP_FW_ERR_020";
	// error code for Report Engine adaptor module.
	public static final String REPORT_ERR_POP_EXPDATA_RPT_ENG = "REP_FW_ERR_021"; // error in populating user values.
	public static final String REPORT_USER_NO_NULL_EXPDATA_RPT_ENG = "REP_FW_ERR_022";
	public static final String REPORT_ERR_LAN_ID_NULL_RPT_ENG = "REP_FW_ERR_023";
	public static final String REPORT_ERR_POP_USERDATA_RPT_ENG = "REP_FW_ERR_024";
	public static final String REPORT_ERR_CBX_EXP_DATA_RPT_ENG = "REP_FW_ERR_025";
	public static final String REPORT_ERR_CBX_EXP_FORMAT_NULL_RPT_ENG = "REP_FW_ERR_026";
	public static final String REPORT_ERR_GEN_EXEC_RPT_ENG = "REP_FW_ERR_027";
	public static final String REPORT_ERR_JMS = "REP_FW_ERR_028";
	public static final String REPORT_ERR_NAMING = "REP_FW_ERR_029";
	public static final String REPORT_ERR_SCHED = "REP_FW_ERR_030";
	public static final String REPORT_ERR_PEX = "REP_FW_ERR_031";
	public static final String ERR_CD_CLONE_NOT_SUPPORT = "REP_FW_ERR_032";
	public static final String ERR_CD_EMPTY_REPORT_REQUEST = "REP_FW_ERR_033";
	public static final String ERR_CD_EMPTY_REPORT_INSTANCE = "REP_FW_ERR_034";
	public static final String ERR_CD_EMPTY_REPORT_INSTANCE_ID = "REP_FW_ERR_035";
	public static final String ERR_CD_NO_QUOTA_AVAILABILITY = "REP_FW_ERR_036";
	public static final String ERR_CD_CONTEXT_IS_NULL = "REP_FW_ERR_037";
	public static final String ERR_CD_RPT_GEN_FAILURE = "REP_FW_ERR_038";
	public static final String ERR_CD_GET_RPT_COL = "REP_FW_ERR_039";
	public static final String ERR_CD_GET_RPT_FLR = "REP_FW_ERR_040";
	public static final String ERR_CD_GET_RPT_PARENT = "REP_FW_ERR_041";
	public static final String ERR_CD_GET_RPT_DEF = "REP_FW_ERR_042";
	public static final String ERR_CD_RPT_INST_UPDATE = "REP_FW_ERR_043";
	public static final String ERR_CD_RPT_CONTEXT = "REP_FW_ERR_044";
	public static final String ERR_CD_INSERT_RPT_INST_COLS = "REP_FW_ERR_045";
	public static final String ERR_CD_INSERT_RPT_INST_FLR = "REP_FW_ERR_046";
	public static final String ERR_CD_INSERT_RPT_INST_PBH = "REP_FW_ERR_047";
	public static final String ERR_CD_INSERT_RPT_INST_NOTFR = "REP_FW_ERR_048";
	public static final String ERR_CD_GET_RPT_FORMAT = "REP_FW_ERR_049";
	public static final String ERR_CD_INSERT_RPT_DEFI_COLS = "REP_FW_ERR_050";
	public static final String ERR_CD_INSERT_RPT_DEFI_FLR = "REP_FW_ERR_051";
	public static final String ERR_CD_INSERT_RPT_DEFI_PBH = "REP_FW_ERR_052";
	public static final String ERR_CD_INSERT_RPT_DEFI_NOTFR = "REP_FW_ERR_053";
	public static final String ERR_CD_RPT_DEFI_UPDATE = "REP_FW_ERR_054";
	// error codes for ReportDataAggregatorFactory starts.
	public static final String ERR_CD_DATA_AGG_FACT_INT_EXCEP = "REP_FW_ERR_056";
	public static final String ERR_CD_DATA_AGG_FACT_ILLI_EXCEP = "REP_FW_ERR_057";
	public static final String ERR_CD_DATA_AGG_FACT_CLASS_NOT_FOUND_EXCEP = "REP_FW_ERR_058";
	public static final String ERR_CD_DATA_AGG_FACT_GENERIC_EXCEP = "REP_FW_ERR_059";
	// error codes for ReportDataAggregatorFactory ends
	// error codes for ReportDataSourceFactory starts.
	public static final String ERR_CD_DS_FACT_INT_EXCEP = "REP_FW_ERR_060";
	public static final String ERR_CD_DS_FACT_ILLI_EXCEP = "REP_FW_ERR_061";
	public static final String ERR_CD_DS_FACT_CLASS_NOT_FOUND_EXCEP = "REP_FW_ERR_062";
	public static final String ERR_CD_DS_FACT_GENERIC_EXCEP = "REP_FW_ERR_063";
	// error codes for ReportDataSourceFactory ends
	// error codes for ReportEngineAdaptorFactory starts.
	public static final String ERR_CD_RE_ADAPTR_FACT_INT_EXCEP = "REP_FW_ERR_064";
	public static final String ERR_CD_RE_ADAPTR__FACT_ILLI_EXCEP = "REP_FW_ERR_065";
	public static final String ERR_CD_RE_ADAPTR__FACT_CLASS_NOT_FOUND_EXCEP = "REP_FW_ERR_066";
	public static final String ERR_CD_RE_ADAPTR__FACT_GENERIC_EXCEP = "REP_FW_ERR_067";
	// error codes for ReportEngineAdaptorFactory ends

	// For exception in fetchEntitlementCriteria() of ReportDataAggregator class.
	public static final String ERR_CD_DATA_AGGR_ENTL = "REP_FW_ERR_068";
	// For exception in formatMassagedData() of ReportDataAggregator class.
	public static final String ERR_CD_DATA_AGGR_FORMAT_DATA = "REP_FW_ERR_069";
	// For exception in getReferenceCurrency of ReportDataAggregator class.
	public static final String ERR_CD_DATA_AGGR_GET_REF_CURR = "REP_FW_ERR_070";
	// For Exception in getUserPreferenceRateCard of ReportDataAggregator class.
	public static final String ERR_CD_DATA_AGGR_GET_PREF_RATE_CRD = "REP_FW_ERR_071";
	// For Exception in getUserPreferenceDate of ReportDataAggregator class.
	public static final String ERR_CD_DATA_AGGR_GET_PREF_DATE = "REP_FW_ERR_072";
	// For exception in getUserPreferenceAmountFormat of ReportDataAggregator class.
	public static final String ERR_CD_DATA_AGGR_GET_PREF_AMT_FMT = "REP_FW_ERR_073";
	// For Exception in performCurrencyConversion of ReportDataAggregator class.
	public static final String ERR_CD_DATA_AGGR_CURR_CONV = "REP_FW_ERR_074";
	// For exception in convertDate of ReportDataAggregator class.
	public static final String ERR_CD_DATA_AGGR_DATE_CONV = "REP_FW_ERR_075";
	// For Exception in getAmountPrecision of ReportDataAggregator class.
	public static final String ERR_CD_DATA_AGGR_GET_AMT_PREC = "REP_FW_ERR_076";

	// For Exception in getData of DBDataSource class.
	public static final String ERR_CD_DB_DS_GETDATA = "REP_FW_ERR_077";
	// For Exception in generateReport of DefaultReportEngineAdaptor class.
	public static final String ERR_CD_DEF_ADAPTOR_GENREP_EXP_DATA_EXC = "REP_FW_ERR_078";
	// For Generic exception inside in generatereport of DefaultReportEngineAdaptor class.
	public static final String ERR_CD_DEF_ADAPTOR_GEN_REPORT = "REP_FW_ERR_079";
	// error codes for ReportPolicyFactory starts.
	public static final String ERR_CD_REP_POLCY_FACT_INST_EXEC = "REP_FW_ERR_080";
	public static final String ERR_CD_REP_POLCY_FACT_ILLI_EXCEP = "REP_FW_ERR_081";
	public static final String ERR_CD_REP_POLCY_FACT_CLASS_NOT_FOUND_EXCEP = "REP_FW_ERR_082";
	public static final String ERR_CD_REP_POLCY_FACT_GENERIC_EXCEP = "REP_FW_ERR_083";
	// error codes for ReportPolicyFactory ends
	// error codes for ReportPolicyFactory starts.
	public static final String ERR_CD_REP_PUBLSHR_FACT_INST_EXEC = "REP_FW_ERR_084";
	public static final String ERR_CD_REP_PUBLSHR_FACT_ILLI_EXCEP = "REP_FW_ERR_085";
	public static final String ERR_CD_REP_PUBLSHR_FACT_CLASS_NOT_FOUND_EXCEP = "REP_FW_ERR_086";
	public static final String ERR_CD_REP_PUBLSHR_FACT_GENERIC_EXCEP = "REP_FW_ERR_087";
	// error codes for ReportPolicyFactory ends
	// for exception in getChannelHandler of ReportNotification class.
	public static final String ERR_CD_REP_NOTI_GET_CHNL_HANDL = "REP_FW_ERR_088";
	// Added for status monitoring starts
	public static final String ERR_CD_REP_STAT_MONTR_TIMEOUT = "REP_FW_ERR_089";
	public static final String ERR_CD_REP_TAT_MONTR_INTR = "REP_FW_ERR_090";
	public static final String ERR_CD_REP_TAT_MONTR_EXEC = "REP_FW_ERR_091";
	public static final String ERR_CD_REP_TAT_MONTR_GEN = "REP_FW_ERR_092";
	// Added for status monitoring ends
	public static final String REP_FW_ERR_NOTIFICATION = "REP_FW_ERR_093";

	public static final String ERR_REP_FNF = "REP_FW_ERR_094";
	public static final String ERR_REP_AIOB = "REP_FW_ERR_095";
	public static final String ERR_REP_IOE = "REP_FW_ERR_096";
	public static final String ERR_REP_EXP = "REP_FW_ERR_097";
	public static final String ERR_REP_PUB = "REP_FW_ERR_098";
	public static final String ERR_REP_REXP = "REP_FW_ERR_099";
	public static final String ERR_RDS_REXP = "REP_FW_ERR_100";
	public static final String ERR_REP_AHE = "REP_FW_ERR_101";

	public static final String ERR_JMS_RPT_GET = "REP_FW_ERR_102";

	public static final String ERR_CD_FETCH_DATA = "REP_FW_ERR_103";

	public static final String ERR_CD_QUOTA_FAILURE_BEFORE_GENERATION = "REP_FW_ERR_104";
	public static final String ERR_CD_QUOTA_FAILURE_BEFORE_PUBLISH = "REP_FW_ERR_105";
	public static final String ERR_CD_ENTL_FAILURE = "REP_FW_ERR_106";
	public static final String ERR_CD_GENERAL_FAILURE = "REP_FW_ERR_107";
	public static final String ERR_CD_COULD_NOT_PERFORM_QUOTA = "REP_FW_ERR_108";
	public static final String ERR_CD_GET_USER_PERFERENCE = "REP_FW_ERR_109";
	public static final String ERR_CD_RPT_NAME_NULL = "REP_FW_ERR_110";
	public static final String ERR_CD_TIMEOUT_DATA_SRC = "REP_FW_ERR_111";
	public static final String ERR_CD_TIMEOUT_GENERATE_RPT = "REP_FW_ERR_112";
	public static final String SCHED_ERROR_CODE_1 = "REP_FW_ERR_113";

	public static final String ERR_CD_SCHED_CLASS_CREATE = "REP_FW_ERR_114";
	public static final String ERR_CD_SCHED_CLASS_ACCESS = "REP_FW_ERR_115";
	public static final String ERR_CD_SCHED_CLASS_FIND = "REP_FW_ERR_116";
	public static final String ERR_CD_SCHED_JOB = "REP_FW_ERR_117";
	public static final String ERR_CD_RPT_CONTEXT_NOTIFIERS = "REP_FW_ERR_118";
	public static final String ERR_CD_DB_DS_GET_RUNTIME_FILTERS = "REP_FW_ERR_119";
	public static final String ERR_CD_DB_DS_ADD_RUNTIME_FILTERS = "REP_FW_ERR_120";
	public static final String ERR_CD_DB_DS_ADD_RUNTIME_SORTS = "REP_FW_ERR_121";
	public static final String ERR_CD_DB_DS_SET_RUNTIME_SORTS = "REP_FW_ERR_122";
	public static final String ERR_CD_GET_RPT_NAME_AVAILABLITY = "REP_FW_ERR_123";
	public static final String ERR_CD_RPT_NAME_EXIST = "REP_FW_ERR_124";

	public static final boolean VAL_BOOL_TRUE = true;
	public static final boolean VAL_BOOL_FALSE = false;
	public static final String VAL_BOOL_YES = "1";
	public static final String VAL_BOOL_NO = "0";
	public static final String DEFAULT_DATE_TIME_FORMAT = "dd/MM/yyyy HH:mm:ss";
	public static final String HEADER_KEY_LAST_UPDATED_DATE_TIME = "LAST_UPDATED_DT_TM";

	public static final String REPORT_INSTANCE_ID = "REPORT_INSTANCE_ID";
	public static final String SYSTEM_REPORT_ID = "SYSTEM_REPORT_ID";
	public static final String PARENT_REPORT_ID = "PARENT_REPORT_ID";
	public static final String SCHEDULE_TYPE = "SCHEDULE_TYPE";
	public static final String SCHEDULE_FREQ_VALUE = "SCHEDULE_FREQ_VALUE";

	public static final String REPORT_INSTANCE_DEFINITION = "REPORT_INSTANCE_DEFINITION";
	public static final String RPT_INST_DEF_FETCH_INTERVEL = "RPT_INST_DEF_FETCH_INTERVEL";

	public static final String REPORT_NAME = "REPORT_NAME";

	public static final String OD_USER_NO = "OD_USER_NO";

	public static final String OD_GCIF = "OD_GCIF";

	public static final String FORMAT_ID = "FORMAT_ID";

	public static final String INCLUDE_BLANK_REC = "INCLUDE_BLANK_REC";

	public static final String STATUS = "STATUS";

	public static final String CREATED_DATE = "CREATED_DATE";

	public static final String RATE_CARD = "RATE_CARD";

	public static final String REFERENCE_CCY = "REFERENCE_CCY";

	public static final String ERROR_CODE = "ERROR_CODE";

	public static final String ERROR_MESSAGE = "ERROR_MSG";

	public static final String COLUMN_ID = "COLUMN_ID";

	public static final String COLUMN_NAME = "COLUMN_NAME";

	public static final String DATA_TYPE = "DATA_TYPE";

	public static final String POSITION = "POSITION";

	public static final String GROUPABLE_IND = "GROUPABLE_IND";

	public static final String GROUP_POSITION = "GROUP_POSITION";

	public static final String SORTABLE_IND = "SORTABLE_IND";

	public static final String SORT_POSITION = "SORT_POSITION";

	public static final String SORT_ORDER = "SORT_ORDER";

	public static final String GROUP_TOTAL_IND = "GROUP_TOTAL_IND";

	public static final String ALL_COL_GRP_BY_IND = "ALL_COL_GRP_BY_IND";

	public static final String INCLUDE_TOTAL = "INCLUDE_TOTAL";

	public static final String LINKED_SRC_AMT = "LINKED_SRC_AMT";

	public static final String LINKED_SRC_CCY = "LINKED_SRC_CCY";

	public static final String VISIBILITY_IND = "VISIBILITY_IND";

	public static final String REPORT_DEFINITION_COLUMNS = "REPORT_DEFINITION_COLUMNS";

	public static final String FILTER_ID = "FILTER_ID";

	public static final String FILTER_DATA_TYPE = "FILTER_DATA_TYPE";

	public static final String FILTER_VALUES = "FILTER_VALUES";
	public static final String REPORT_FILTER_LIST = "REPORT_FILTER_LIST";

	public static final String REPORT_INSTANCE_COLUMN_DEFINTITION = "REPORT_INSTANCE_COLUMN_DEFINTITION";

	public static final String REPORT_INSTANCE_FILTER_DEFINITION = "REPORT_INSTANCE_FILTER_DEFINITION";

	public static final String REPORT_INSTANCE_PUBLISHER_DEFINTITION = "REPORT_INSTANCE_PUBLISHER_DEFINTITION";

	public static final String PUBLISHER_ID = "PUBLISHER_ID";

	public static final String PUBLISHER_NAME = "PUBLISHER_NAME";

	public static final String PUBLISHER_HANDLER_CLASS = "PUBLISHER_HANDLER_CLASS";

	public static final String REPORT_INSTANCE_PUBLISHER_MAP = "REPORT_INSTANCE_PUBLISHER_MAP";

	public static final String REPORT_INSTANCE_PUBLISHER_MASTER = "REPORT_INSTANCE_PUBLISHER_MASTER";

	public static final String REPORT_INSTANCE_NOTIFIER_MAP = "REPORT_INSTANCE_NOTIFIER_MAP";

	public static final String NOTIFICATION_ID = "NOTIFICATION_ID";

	public static final String NOTIFICATION_NAME = "NOTIFICATION_NAME";

	public static final String NOTIFICATION_HANDLER_CLASS = "NOTIFICATION_HANDLER_CLASS";

	public static final String REPORT_INSTANCE_NOTIFIER_MASTER = "REPORT_INSTANCE_NOTIFIER_MASTER";

	public static final String REPORT_INSTANCE_STATUS = "REPORT_INSTANCE_STATUS";

	public static final String OPR_EXT_FETCH_INSTANCE_DEFINITION = "REPORT_INST_DEFINITION";

	public static final String EQU_AMT_TPYE = "eqamt";
	public static final String EQU_CURR_TPYE = "eqccy";
	public static final String DATE_DATA_TPYE = "date";
	public static final String AMT_DATA_TPYE = "float";

	public static final String USERNO = "USERNO";
	public static final String GCIF = "GCIF";
	public static final String ASYNC_REPORT_QUEUE = "ASYNC_REPORT_QUEUE";
	// added for report engine module
	public static final String REPORT_REF_LOCATION = "REPORT_REF_LOCATION";
	public static final String STATUS_SUCCESS = "SUCCESS";
	public static final String STATUS_FAILURE = "FAILURE";
	public static final String USER_NO = "USER_NO";
	public static final String OPR_EXT_FETCH_USER_PREF_DATA = "USER_PREF_DATA";
	public static final String USER_ATTR_USER_NO = "USER_NO";

	public static final String GET_PARENT_NODE = "GET_PARENT_NODE";
	public static final String GET_FORMAT_NAME = "GET_FORMAT_NAME";
	public static final String FORMAT_ID_VIEW = "FORMAT_ID_VIEW";
	public static final String FORMAT_NAME = "FORMAT_NAME";
	public static final String GET_COLUMN_NAME = "GET_COLUMN_NAME";
	public static final String COLUMN_ID_VIEW = "COLUMN_ID_VIEW";
	public static final String PARENT_ID_VIEW = "PARENT_ID_VIEW";
	public static final String GET_FILTER_CRITERIA_ACTION = "GET_FILTER_CRITERIA_ACTION";
	public static final String FILTER_COLUMN = "FILTER_COLUMN";
	public static final String GET_FILTER_CRITERIA = "GET_FILTER_CRITERIA";
	public static final String FILTER_COLUMN_VIEW = "FILTER_COLUMN_VIEW";
	public static final String FILTER_NAME = "FILTER_NAME";
	public static final String GET_FORM_DATA_ACTION = "GET_FORM_DATA_ACTION";
	public static final String GET_FORM_VALUES = "GET_FORM_VALUES";
	public static final String FORM_ITEMS_VIEW = "FORM_ITEMS_VIEW";
	public static final String ITEM = "ITEM";
	public static final String GET_SCHEDULED_REPORT_ACTION = "GET_SCHEDULED_REPORT_ACTION";
	public static final String SCHEDULE = "SCHEDULE";
	public static final String GET_SCHEDULED_VALUES = "GET_SCHEDULED_VALUES";
	public static final String SCHEDULE_REPORT_VIEW = "SCHEDULE_REPORT_VIEW";
	public static final String INPUT_GCIF = "INPUT_GCIF";
	public static final String INPUT_USER_NO = "INPUT_USER_NO";
	public static final String PRODUCT_NAME = "PRODUCT_NAME";
	public static final String INPUT_SUB_PRODUCT = "INPUT_SUB_PRODUCT";
	public static final String INPUT_FUNCTION_CODE = "INPUT_FUNCTION_CODE";

	public static final String COLUMN_DEFN = "COLUMN_DEFN";
	public static final String COL_DEFN_SELECTOR = "COL_DEFN_SELECTOR";
	public static final String GROUP_BY = "GROUP_BY";
	public static final String SORT_BY = "SORT_BY";
	public static final String REPORT_FORMAT_EDIT = "REPORT_FORMAT_EDIT";
	public static final String PUBLISHED_REP_ARCHIEVED_PATH = "PUBLISHED_REP_ARCHIEVED_PATH";
	public static final String PRODUCT_LIST = "PRODUCT_LIST";
	public static final String SUB_PRODUCT_LIST = "SUB_PRODUCT_LIST";
	public static final String FUNCTION_LIST = "FUNCTION_LIST";
	public static final String ALERT_ID = "alertId";
	public static final String OD_TO_ID = "OD_TO_ID";
	public static final String OD_FROM_ID = "OD_FROM_ID";
	public static final String OD_MAIL_BODY = "OD_MAIL_BODY";
	public static final String OD_MAIL_SUBJECT = "OD_MAIL_SUBJECT";
	public static final String OD_REPLY_TO = "OD_REPLY_TO";
	public static final String OD_BCC_TO = "OD_BCC_TO";
	public static final String OD_CC_TO = "OD_CC_TO";
	public static final String OD_PATH = "OD_PATH";

	public static final String JOB_NOT_DELETED = "COULD_NOT_DELETE_JOB";
	public static final String JOB_DELETED = "SUCCESS";
	public static final String INVALID_JOB_NAME = "INVALID_JOB_NAME";
	public static final String REPORT_CONTEXT = "REPORT_CONTEXT";
	public static final String COLUMN_DEFINITION = "COLUMN_DEFINITION";
	public static final String SORT = "SORT";
	public static final String SORT_COLUMN = "SORT_COLUMN";

	public static final String BLANK_RECORD = "BLANK_RECORD";
	public static final String INCLUDE_TOTALS = "INCLUDE_TOTALS";
	public static final String YES_IND = "Y";
	public static final String NO_IND = "N";
	public static final String BASE_CCY = "BASE_CCY";
	public static final String NOTIFICATION = "SEND_MAIL";
	public static final String GROUP_BY_LIST = "TOTALS_GROUPED_BY";
	public static final String GROUP_TOTAL_LIST = "GROUP_TOTALS";
	public static final String DEFAULT_PUBLISHERS = "ARCHIVAL";
	public static final String MAIL_PUBLISHERS = "EMAIL";
	public static final String MAIL_REPORT_IND = "MAIL_RPT";
	public static final String ALERT_TO_IND = "ALERT_TO";
	public static final String INBOX_LABEL = "INBOX";
	public static final String EMAIL_LABEL = "SMTP";
	public static final String SMS_LABEL = "SMS";
	public static final String INBOX_VALUE = "2001";
	public static final String EMAIL_VALUE = "2002";
	public static final String SMS_VALUE = "2003";
	public static final String DEFAULT_NOTIFIERS = INBOX_VALUE;

	public static final String DATA_AGGREGATOR_CLASS = "DATA_AGGREGATOR_CLASS";

	public static final String OD_PRODUCT = "OD_PRODUCT";

	public static final String OD_SUB_PRODUCT = "OD_SUB_PRODUCT";

	public static final String OD_FUNC_CODE = "OD_FUNC_CODE";

	public static final String ENTL_TYPE = "ENTL_TYPE";

	public static final String RATECARD = "RATECARD";

	public static final String RPT_SCH_FROM_DATE = "RPT_SCH_FROM_DATE";

	public static final String RPT_SCH_TO_DATE = "RPT_SCH_TO_DATE";

	public static final String SCHEDULER_FROM_DATE = "SCHEDULER_FROM_DATE";

	public static final String SCHEDULER_TO_DATE = "SCHEDULER_TO_DATE";

	public static final String SCHEDULER_TYPE = "SCHEDULER_TYPE";

	public static final String USER_PREFERENCE = "USER_PREFERENCE";

	public static final String SCHEDULER_FREQUENCY_VALUE = "SCHEDULER_FREQUENCY_VALUE";

	public static final String REPORT_COLUMN_DEFINTITION = "REPORT_COLUMN_DEFINTITION";

	public static final String REPORT_FILTER_DEFINITION = "REPORT_FILTER_DEFINITION";

	public static final String REPORT_PUBLISHER_MAP = "REPORT_PUBLISHER_MAP";

	public static final String REPORT_NOTIFIER_MAP = "REPORT_NOTIFIER_MAP";
	public static final String EMPTY_STR = "";

	public static final String FORM_ITEM_REPORT_SELECTED_COLS = "REPORT_SELECTED_COLS";
	public static final String FORM_ITEM_REPORT_GROUP_BY_COLS = "REPORT_GROUP_BY_COLS";
	public static final String FORM_ITEM_REPORT_SORT_BY_COLS = "REPORT_SORT_BY_COLS";
	public static final String FORM_ITEM_REPORT_FILTER_COLUMN = "REPORT_FILTER_COLUMN";
	public static final String FORM_ITEM_REPORT_FORMAT = "REPORT_FORMAT";
	public static final String FORM_ITEM_REPORT_INC_BLANK_REC = "REPORT_INC_BLANK_REC";
	public static final String FORM_ITEM_REPORT_RATE_CARD = "REPORT_RATE_CARD";
	public static final String FORM_ITEM_REPORT_BASE_CCY = "REPORT_BASE_CCY";
	public static final String REPORT_EXECUTION_ENTL_TYPE = "RPT_EXEC";
	public static final String REPORT_EXECUTION_ACTION = "REPORT_EXECUTION";
	public static final String NOTIFICATION_LIST = "NOTIFICATION_LIST";

	public static final String DB_EXT_KEY_DELETE_REPORT_DEFINITION = "REPORT_DEFINITION";
	public static final String DB_EXT_KEY_DELETE_COLUMN_FILTER_DEFN = "COLUMN_FILTER_DEFINITION";
	public static final String DB_EXT_KEY_DELETE_COLUMN_DEFN = "REPORT_COLUMN_DEFINITION";
	public static final String DB_EXT_KEY_DELETE_REPORT_DEFN_NOTIFICATION = "REPORT_DEFINITION_NOTIFICATION";
	public static final String DB_EXT_KEY_DELETE_REPORT_DEFN_PUBLISHSER = "REPORT_DEFINITION_PUBLISHER";

	public static final String REPORT_EXECUTE_SIMULATION = "REPORT_EXECUTE_SIMULATION";
	public static final String REPORT_SAVE_SIMULATION = "REPORT_SAVE_SIMULATION";
	public static final String REPORT_SAVE_RUN_SIMULATION = "REPORT_SAVE_RUN_SIMULATION";
	public static final String REPORT_SAVE_SCHEDULE_SIMULATION = "REPORT_SAVE_SCHEDULE_SIMULATION";
	public static final String REPORT_DELETE_SIMULATION = "REPORT_DELETE_SIMULATION";

	public static final String REPORT_DEFINITION_DELETE = "REPORT_DEFINITION_DELETE";
	public static final String REPORT_DELETE_STATUS = "DELETED";
	public static final String DB_EXT_KEY_GET_REPORT_DEFINITION_FOR_COLUMNID = "COLUMN_DEF_FOR_COLUMN_ID";
	public static final String IS_SCHEDULED = "IS_SCHEDULED";
	public static final String ACTION_RPT_SAVE = "SAVE_REPORT";
	public static final String ACTION_RPT_UPDATE = "UPDATE_REPORT";
	public static final String ACTION_RPT_RUN = "RUN_REPORT";
	public static final String ACTION_RPT_SAVE_RUN = "SAVE_RUN_REPORT";
	public static final String ACTION_RPT_UPDATE_RUN = "UPDATE_RUN_REPORT";
	public static final String ACTION_RPT_SAVE_SCHEDULE = "SAVE_SCHEDULE_REPORT";
	public static final String ACTION_RPT_INST_DEFINITION = "REPORTS_INSTANCE_DEFINITION_ACTION";
	public static final String ACTION_RPT_INST_RUN = "RUN_REPORT_INSTANCE";
	public static final String ACTION_RPT_UPDATE_SCHEDULE = "UPDATE_SCHEDULE_REPORT";
	public static final String ACTION_RPT_GET_PARENT_NODE = "GET_PARENT_NODE";
	public static final String ACTION_RPT_DELETE = "DELETE_REPORT";

	public static final String MONDAY = "MON";
	public static final String TUESDAY = "TUE";
	public static final String WEDNESDAY = "WED";
	public static final String THURSDAY = "THU";
	public static final String FRIDAY = "FRI";
	public static final String SATURDAY = "SAT";
	public static final String SUNDAY = "SUN";

	public static final String DAILY_TRIGGER = "DLY";
	public static final String WEEKLY_TRIGGER = "WLY";
	public static final String MONTHLY_TRIGGER = "MLY";

	public static final String QUARTZ_EXPRESSION = "{sec} {min} {hrs} {dom} {mon} {dow}";

	public static final String REPORT_DETAILS = "reportDetails";
	public static final String REPORT_MAIL_RPT = "REPORT_MAIL_RPT";
	public static final String REPORT_SEND_MAIL = "REPORT_SEND_MAIL";
	public static final String REPORT_TOT_COL_GRP_BY = "REPORT_TOT_COL_GRP_BY";
	public static final String REPORT_GRP_TOT_BY = "";
	public static final String REPORTID = "reportId";
	public static final String ERR_CD_GET_RPT_DEFI_SCHEDULE = "ERR_CD_GET_RPT_DEFI_SCHEDULE";
	public static final String ERR_MSG_GET_RPT_DEFI_SCHEDULE = "ERR_MSG_GET_RPT_DEFI_SCHEDULE";
	public static final String DEFAULT_LANG_ID = "en_US";

	public static final String CHANNELHANDLER = "ChannelHandler";
	public static final String NOTIFICATIONID = "NotificationId";
	public static final String DEFAULT_CURR = "DEFAULT_CURR";
	public static final String DEFAULT_RATE_CARD = "DEFAULT_RATE_CARD";
	public static final String DEFAULT_DATE_FORMAT = "DEFAULT_DATE_FORMAT";
	public static final String COD_CCY = "COD_CCY";
	public static final String NBR_DECIMAL = "NBR_DECIMAL";
	public static final String ORBIONEDIRECT = "orbionedirect";
	public static final int MIN_FRACTION_DIGIT = 2;
	public static final int MAX_FRACTION_DIGIT = 2;

	public static final String RPT_SCH_REPORT_NAME = "RPT_SCH_REPORT_NAME";
	public static final String FILTERCOLUMN = "FILTERCOLUMN";
	public static final String FILTERCRITERIA = "FILTERCRITERIA";
	public static final String DATA = "DATA";
	public static final String FILTER_CRIT_TO_DISP = "FILTER_CRIT_TO_DISP";
	public static final String UI_DATE_TIME_FORMAT = "dd/MM/yyyy";
	public static final String SORT_ASC = "ASC";

	public static final String REPORTNAME = "reportName";
	public static final String PARENT_REPORTID = "parentReportId";
	public static final String IS__SCHEDULED = "isScheduled";
	public static final String REPORT_TREE_NODE_NAME = "NAME";
	public static final String REPORT_REQUEST = "ReportRequest";
	public static final String JMS_RFW_CONN_FACT = "JMS_RFW_CONN_FACT";
	public static final String TRIGGER_DATE_TIME_FORMAT = "EEE MMM d HH:mm:ss zzz yyyy";
	public static final String DUMMY_ID = "-1";
	public static final String TRIGGER_SUFFIX = "_Trigger";
	public static final String DELIMITER = "\\s";
	public static final String GET_REPORT_AVAILABILITY = "GET_REPORT_AVAILABILITY";
	public static final String IS_REPORT_AVAILABLE = "IS_REPORT_AVAILABLE";
	public static final String PUBLISHER_STATUS = "PUBLISHER_STATUS";
	public static final String FAILED_PUBLISHERS = "FAILED_PUBLISHERS";
	public static final String NOTIFIER_STATUS = "NOTIFIER_STATUS";
	public static final String MSG_SIMULATION_MODE_MESSAGE = "You are in simulation mode";
	public static final String LBL_SIMULATION_MODE_SUCCESS_MESSAGE = "LBL_SIMULATION_MODE_SUCCESS_MESSAGE";
	public static final String MSG_ERR_RPT_RESPONSE = "MSG_ERR_RPT_RESPONSE";
	public static final String ERR_MSG_DOWNLOAD = "ERR_MSG_DOWNLOAD";
	public static final String SORT_DESC = "DESC";
	public static final String HAL_ENABLE = "HAL_ENABLE";
	public static final String PASSWORD_PROTECTED = "PASSWORD_PROTECTED";
	public static final String RFW_MAIL_BODY = "RFW_MAIL_BODY";
	public static final String RFW_MAIL_SUBJECT = "RFW_MAIL_SUBJECT";

	public static final String CHILDREN = "children";

	public static final String REPORTPRODCODE = "reportProdCode";
	public static final String REPORTSUBPRODCODE = "reportSubProdCode";
	public static final String REPORTFUNCCODE = "reportFuncCode";

	public static final String PRODUCT_CODE = "CANVAS";
	public static final String SUB_PRODUCT_CODE = "CANVAS";
	public static final String FUNCTION_CODE = "VSBLTY";

	public static final String REPORT_PROD_CODE = "REPORT_PROD_CODE";
	public static final String REPORT_SUB_PROD_CODE = "REPORT_SUB_PROD_CODE";
	public static final String REPORT_FUNC_CODE = "REPORT_FUNC_CODE";
	public static final String DEFAULT_AMOUNT_FORMAT = "DEFAULT_AMOUNT_FORMAT";
	public static final String NODE_CLS = "nodeCls";
	public static final String IS__ACTIVE = "isActive";
	public static final String INPUT_USER_ROLE = "INPUT_USER_ROLE";
	public static final String BUNDLE_KEY = "BUNDLE_KEY";
	public static final String COLUMN_DISPLAY_NAME_MAP = "COLUMN_DISPLAY_NAME_MAP";
	public static final String FETCH_REPORT_COLUMN_DEFINITION = "FETCH_REPORT_COLUMN_DEFINITION";

}
