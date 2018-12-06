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

package com.intellectdesign.canvas.alert.handler;

import com.intellectdesign.canvas.properties.reader.PropertyReader;





/**
 * This interface contains all the constants that are used across the alert framework for variouse purposes.
 * 
 * @version 1.0
 */
public interface AlertConstants
{
	public static final String RECIPIENTS_KEY = "RECIPIENTS";
	public static final String SENDER_KEY = "SENDER";
	public static final String LOCALE_KEY = "LOCALE";
	public static final String ALERT_DATA_MAP = "ALERT_DATA_MAP";
	public static final String SYSTEM_SENDER = "SYSTEM";
	public static final String ALL_USERS = "ALL_USERS";
	public static final String LANG_ID = "LANG_ID";

	// For database
	public static final String DAM_KEY_ENRICH_DATA_SELECT = "ALERT_ENRICH_DATA_FETCH";
	public static final String KEY_TXN_REF_NO = "TRAN_REF_NO";
	public static final String ERR_ALERT_FETCH_ENRICH_DATA = "ERR_ALERT_FETCH_ENRICH_DATA";

	public static final String KEY_ENRICH_CCY = "ENRICH_CCY";
	public static final String KEY_ENRICH_BANK_NAME = "ENRICH_BANK_NAME";
	public static final String KEY_ENRICH_BRANCH_NAME = "ENRICH_BRANCH_NAME";
	public static final String KEY_ENRICH_COUNTRY_NAME = "ENRICH_COUNTRY_NAME";
	public static final String KEY_ENRICH_SUBPROD_DESC = "ENRICH_SUBPROD_DESC";
	public static final String KEY_HAS_ATTACHMENT = "HAS_ATTACHMENT";

	public static final String NOTIFICATION_FRMWRK_DAM_KEY = "NOTIFICATION_FRMWRK_MNT";
	public static final String MESSAGE_FRMWRK_DAM_KEY = "MESSAGE_FRMWRK_MNT";

	public static final String ALERT_FRMWRK_DAM_KEY = "ALERT_FRMWRK_MNT";
	public static final String ALERT_EXT_GET_ALERT_DTLS = "ALERT_EXT_GET_ALERT_DTLS";
	public static final String ALERT_EXT_GET_CHANNEL_HANDLER_DTLS = "ALERT_EXT_GET_CHANNEL_HANDLER_DTLS";
	public static final String ALERT_EXT_GET_ALL_CHANNEL_HANDLER_DTLS = "ALERT_EXT_GET_ALL_CHANNEL_HANDLER_DTLS";
	public static final String ALERT_EXT_GET_UNREAD_SEVERITY_MESSAGE_DTLS = "ALERT_EXT_GET_UNREAD_SEVERITY_MESSAGE_DTLS";
	public static final String SEVERITY_SELECTED = "SEVERITY_SELECTED";
	public static final String ALERT_DESCRIPTION = "ALERT_DESCRIPTION";
	public static final String NOTIFY_DESCRIPTION = "NOTIFY_DESCRIPTION";
	public static final String ALERT_EVENT_ID = "EVENT_ID";
	public static final String ALERT_EXT_GET_FORMATTER_DTLS = "ALERT_EXT_GET_FORMATTER_DTLS";
	public static final String CHANNEL_ID = "CHANNEL_ID";
	public static final String CHANNEL_NAME = "CHANNEL_NAME";
	public static final String CHANNEL_HANDLER = "CHANNEL_HANDLER";
	public static final String CHANNEL_HANDLER_LIST = "CHANNEL_HANDLER_LIST";
	public static final String ALERT_EXT_GET_ALL_MSG_FORMATTER_DTLS = "ALERT_EXT_GET_ALL_MSG_FORMATTER_DTLS";
	public static final String ALERT_EXT_GET_MSG_FORMATTER_DTLS = "ALERT_EXT_GET_MSG_FORMATTER_DTLS";
	public static final String CHANNEL_FORMATTER = "CHANNEL_FORMATTER";
	public static final String ALERT_EXT_GET_MSG_FORMAT_DTLS = "ALERT_EXT_GET_MSG_FORMAT_DTLS";
	public static final String SHORT_DESCRIPTION_TEMPLATE = "SHORT_DESCRIPTION_TEMPLATE";
	public static final String DETAILED_DESCRIPTION_TEMPLATE = "DETAILED_DESCRIPTION_TEMPLATE";
	public static final String ALERT_EXT_GET_RECIPIENT_DTLS = "ALERT_EXT_GET_RECIPIENT_DTLS";
	public static final String ALERT_EXT_GET_MESSAGES_UNREAD_COUNT = "ALERT_EXT_GET_MESSAGES_UNREAD_COUNT";
	public static final String UNREAD_COUNT = "UNREAD_COUNT";
	public static final String USER_ID = "USER_ID";
	public static final String ALERT_EXT_MESSAGE = "ALERT_EXT_MESSAGE";
	public static final String ALERT_EXT_MESSAGE_ID = "ALERT_EXT_MESSAGE_ID";
	public static final String ALERT_EXT_RECIPIENT = "ALERT_EXT_RECIPIENT";
	public static final String FROM_USER_ID = "FROM_USER_ID";
	public static final String SHORT_MESSAGE = "SHORT_MESSAGE";
	public static final String DETAILED_MESSAGE = "DETAILED_MESSAGE";
	public static final String DRAFT_INDICATOR = "DRAFT_INDICATOR";
	public static final String MESSAGE_TS = "MESSAGE_TS";
	public static final String MESSAGE_DURATION = "MESSAGE_DURATION";
	public static final String TO_USER_ID = "TO_USER_ID";
	public static final String READ_INDICATOR = "READ_INDICATOR";
	public static final String DELETED = "DELETED";
	public static final String ACTIONED_INDICATOR = "ACTIONED_INDICATOR";
	public static final String IS_NOTIFICATION = "IS_NOTIFICATION";
	public static final String TRUE = "TRUE";
	public static final String FALSE = "FALSE";
	public static final String ALERT_EXT_GET_UNREAD_MESSAGE_DTLS = "ALERT_EXT_GET_UNREAD_MESSAGE_DTLS";
	public static final String ALERT_EXT_GET_MESSAGE_DTLS = "ALERT_EXT_GET_MESSAGE_DTLS";
	public static final String ALERT_EXT_GET_DATA_KEYS = "ALERT_EXT_GET_DATA_KEYS";
	public static final String DATA_KEY = "DATA_KEY";
	public static final String FORMATTED_MSG_FLAG = "FORMATTED_MSG_FLAG";
	public static final String ARCHIVED_INDICATOR = "ARCHIVED_INDICATOR";
	public static final String ALERT_EXT_GET_ALL_MESSAGE_DTLS = "ALERT_EXT_GET_ALL_MESSAGE_DTLS";
	public static final String PRODUCT_CODE = "PRODUCT_CODE";
	public static final String SUB_PRODUCT_CODE = "SUB_PRODUCT_CODE";
	public static final String FUNCTION_CODE = "FUNCTION_CODE";
	public static final String ALERT_EXT_DELETE_MESSAGE = "ALERT_EXT_DELETE_MESSAGE";
	public static final String ALERT_EXT_ARCHIVE_MESSAGES = "ALERT_EXT_ARCHIVE_MESSAGES";
	public static final String ALERT_EXT_GET_ALL_MESSAGES_FOR_STATUS = "ALERT_EXT_GET_ALL_MESSAGES_FOR_STATUS";
	public static final String ALERT_EXT_GET_ALL_MESSAGES_FOR_SEVERITY = "ALERT_EXT_GET_ALL_MESSAGES_FOR_SEVERITY";
	public static final String ALERT_EXT_GET_ALL_MESSAGES_FOR_NOTIFICATION = "ALERT_EXT_GET_ALL_MESSAGES_FOR_NOTIFICATION";
	public static final String ALERT_EXT_GET_ALL_MESSAGES_FOR_DATE = "ALERT_EXT_GET_ALL_MESSAGES_FOR_DATE";
	public static final String GREATER_THAN = "_GT";
	public static final String LESS_THAN = "_LT";
	public static final String EQUAL_TO = "_ET";
	public static final String GREATER_THAN_OR_EQUAL_TO = "_GTOET";
	public static final String LESS_THAN_OR_EQUAL_TO = "_LTOET";
	public static final String NOT_EQUAL_TO = "_NET";
	public static final String ALERT_EXT_GET_UNHANDLED_MESSAGES_FOR_SEVERITY = "ALERT_EXT_GET_UNHANDLED_MSGS_FOR_SEVERITY";
	public static final String ALERT_EXT_CHECK_DATES = "ALERT_EXT_CHECK_DATES";
	public static final String CHECK_RESULT = "CHECK_RESULT";
	public static final String ALERT_EXT_MARK_MSGS_AS_SEVERITY_HANDLED = "ALERT_EXT_MARK_MSGS_AS_SEVERITY_HANDLED";
	public static final String ALERT_EXT_SET_USER_ACCESS_TIME = "ALERT_EXT_SET_USER_ACCESS_TIME";
	public static final String ALERT_EXT_NEW_MSG_TRACKER_RECORDS = "ALERT_EXT_NEW_MSG_TRACKER_RECORDS";
	public static final String ALERT_EXT_NEW_MSG_TRACKER = "ALERT_EXT_NEW_MSG_TRACKER";
	public static final String ALERT_EXT_MARK_MSGS_AS_READ = "ALERT_EXT_MARK_MSGS_AS_READ";
	public static final String ALERT_EXT_MARK_MSGS_AS_DELETED = "ALERT_EXT_MARK_MSGS_AS_DELETED";
	public static final String ALERT_EXT_UPDATE_MSG_STATUS = "ALERT_EXT_UPDATE_MSG_STATUS";

	public static final String ALERT_EXT_MARK_MSGS_AS_ACTIONED = "ALERT_EXT_MARK_MSGS_AS_ACTIONED";
	public static final String ALERT_EXT_GET_ALL_ALERT_DATA_KEYS = "ALERT_EXT_GET_ALL_ALERT_DATA_KEYS";
	public static final String ALERT_EXT_GET_ALL_ALERT_DETAILS = "ALERT_EXT_GET_ALL_ALERT_DETAILS";
	public static final String DATE1 = "DATE1";
	public static final String DATE2 = "DATE2";
	public static final String RANGE = "_RANGE";
	public static final String SUB_PRODUCT_CODE_DISPVAL = "SUB_PRODUCT_CODE_DISPVAL";

	// For cache
	public static final String CHANNELS = "CHANNELS";
	public static final String MSG_FORMATTERS = "MSG_FORMATTERS";

	// For message start and end delimiters
	public static final String MSG_PLACEHOLDER_START_DELIMITER = "MSG_PLACEHOLDER_START_DELIMITER";
	public static final String MSG_PLACEHOLDER_END_DELIMITER = "MSG_PLACEHOLDER_END_DELIMITER";

	// For errors
	public static final String ERR_CHANNEL_HANDLERS_NULL = "ERR_CHANNEL_HANDLERS_NULL";
	public static final String ERR_MSG_FORMATTER_NULL = "ERR_MSG_FORMATTER_NULL";
	public static final String ERR_ALERT_DB_EX = "ERR_ALERT_DB_EX";
	public static final String ERR_ALERT_ILL_ACCESS_EX = "ERR_ALERT_ILL_ACCESS_EX";
	public static final String ERR_ALERT_INST_EX = "ERR_ALERT_INST_EX";
	public static final String ERR_ALERT_CLASS_EX = "ERR_ALERT_CLASS_EX";
	public static final String ERR_ALERT_NO_ALERTS_FOR_EVENT = "ERR_ALERT_NO_ALERTS_FOR_EVENT";
	public static final String ERR_USER_IDS_NULL = "ERR_USER_IDS_NULL";
	public static final String ERR_RECIPIENTS_NULL = "ERR_RECIPIENTS_NULL";
	public static final String ERR_MESSAGE_ID_LIST_NULL = "ERR_MESSAGE_ID_LIST_NULL";
	public static final String ERR_MESSAGE_NULL = "ERR_MESSAGE_NULL";
	public static final String ERR_ALERT_NO_MESSAGE_FOR_GIVEN_ID = "ERR_ALERT_NO_MESSAGE_FOR_GIVEN_ID";
	public static final String STR_MESSAGE_TS = "STR_MESSAGE_TS";
	public static final String STR_MESSAGE_DURATION = "STR_MESSAGE_DURATION";
	public static final String DATA_KEY_LIST = "DATA_KEY_LIST";
	public static final String ALERT_DATA_KEYS = "ALERT_DATA_KEYS";
	public static final String INTERPRET_AS_KEY_FLAG = "INTERPRET_AS_KEY_FLAG";
	public static final String RESOURCE_BUNDLE_NAME = "RESOURCE_BUNDLE_NAME";
	// Constraint Constant to be used for greater than if user selected range and only selected first date
	String GT_EQUALS = "_GTOET";
	// Constraint Constant to be used for less than if user selected range and only selected second date
	String LT_EQUALS = "_LTOET";
	String SORT_DIR = "dir";
	String DESC = "DESC";
	public static final String ATTACHDATA = "ATTACHDATA";
	public static final String ALERT_PDF_PATH = "ALERT_PDF_PATH";
	public static final String GCIF = "GCIF";
	public static final String USER_NO = "USER_NO";
	public static final String ALERT_ID = "ALERT_ID";
	public static final String STREAM = "STREAM";
	public static final String FORMAT = "FORMAT";
	public static final String FILE_NAME = "FILE_NAME";
	public static final String MESSAGE_ID = "MESSAGE_ID";
	public static final String ALERT_DETAILS_DOWNLOAD = "ALERT_DETAILS_DOWNLOAD";
	public static final String UPDATE_MESSAGE_STATUS = "UPDATE_MESSAGE_STATUS";
	public static final String TXN_MASTER_STATUS_TO_CANCEL = "TXN_MASTER_STATUS_TO_CANCEL";
	public static final String REFERENCE_NO = "REFERENCE_NO";
	public static final String GET_NOTIFICATION_COUNT = "GET_NOTIFICATION_COUNT";
	public static final String SENDER_ID = "SENDER_ID";
	public static final String FETCH_USER_NAME = "FETCH_USER_NAME";
	public static final String NUMBER_OF_ALERTS = "NUM_ALERTS";
	public static final String GET_UNREAD_ALERT_COUNT_ACTION = "GET_UNREAD_ALERT_COUNT";
	public static final String GET_ALERT_DETAIL_MESSAGE = "GET_ALERT_DETAIL_MESSAGE";
	public static final String IS_NEW_ALERTS_PRESENT = "IS_NEW_ALERTS_PRESENT";
	public static final String UPDATE_LAST_ACCESSED_TIME_ACTION = "UPDATE_LAST_ACCESSED_TIME_ACTION";
	public static final String REFRESH_WIDGET_ACTION = "REFRESH_WIDGET_ACTION";
	public static final String CHECK_FOR_NEW_ALERTS_ACTION = "CHECK_FOR_NEW_ALERTS_ACTION";
	public static final String UNPOPUP_HIGHALERTS = "UNPOPUP_HIGHALERTS";
	public static final String COUNT = "COUNT";
	public static final String DATAMAP_KEY = "ALERT_VIEW";

	// Sql Map
	public static final String N = "N";
	public static final String Y = "Y";
	public static final String MEDIUM = "Medium";
	public static final String HIGH = "High";
	public static final String IS_UNPOPUP_HIGHALERTS_PRESENT = "IS_UNPOPUP_HIGHALERTS_PRESENT";
	public static final String UPDATE_STATUS_ACTION = "UPDATE_STATUS_ACTION";
	public static final String UNREAD_UNPOPPEDUP_HIGHALERT_FETCH_ACTION = "UNREAD_UNPOPPEDUP_HIGHALERT_FETCH_ACTION";
	public static final String UNREAD_UNPOPPEDUP_HIGHALERT_COUNT_ACTION = "UNREAD_UNPOPPEDUP_HIGHALERT_COUNT_ACTION";
	public static final String ACTION_PERFORMED = "Y";
	public static final String ACTION_NOT_PERFORMED = "N";
	public static final String ACTIVE = "ACTIVE";
	public static final String DONE = "DONE";
	public static final String SEVERITY = "SEVERITY";
	public static final String DATE_TIME_DT = "DATE_TIME_DT";
	public static final String ALERT_LIST_RECORDS_DELETE = "ALERT_LIST_RECORDS";
	public static final String MSG_IDS = "MSG_IDS";
	public static final String ALERT_LIST_TO_MARK_MSG_READ = "ALERT_LIST_TO_MARK_MSG_READ";
	public static final String DELETE_ACTION = "DELETE_ACTION";
	public static final String UNREAD = "U";
	public static final String READ = "R";
	public static final String READ_FLAG = "READ_FLAG";
	public static final String DATE_TIME = "DATE / TIME";
	public static final String STATUS = "STATUS";
	public static final String PRODUCT = "PRODUCT";
	public static final String MSG_TITLE = "MSG_TITLE";
	public static final String SEVERTY = "SEVERTY";
	public static final String SEL_ALERT = "SEL_ALERT";
	public static final String ID = "ID";
	public static final String MSG_ID = "MSG_ID";

	// Alert list view columns
	public static final String INIT_ACTION = "INIT_ACTION";

	// action related
	public static final String SUMMARY = "SUMMARY"; // Extension for summary widget list view

	// Alert list view columns
	public static final String ALERTSUMMARY_LIST_DAM_KEY = "ALERTSUMMARY_LIST_VIEW";// SQL map Key to retriev the

	// Structurrs List
	// Constants added for new alerts in Tranch3b
	public static final String ALERT_DATA_SOURCE = "DATA_SOURCE";
	public static final String LOAN_ID = "LOAN_ID";
	public static final String AGREEMENT_ID = "AGREEMENT_ID";
	// for mail constant
	public static final String ALERT_EMAIL_GET_RECIPIENT_DTLS = "ALERT_EMAIL_GET_RECIPIENT_DTLS";
	public static final String MAIL_FRMWRK_DAM_KEY = "MAIL_FRMWRK_MNT";
	public static final String PENDING_EMAIL_DELIVERED = "PENDING_EMAIL_DELIVERED";
	public static final String MAIL_EXT_STATUS_UPDATE = "MAIL_EXT_STATUS_UPDATE";
	public static final String MAIL_FAIL_STATUS_UPDATE = "MAIL_FAIL_STATUS_UPDATE";
	public static final String MAIL_MOVE_HISTORY = "MAIL_MOVE_HISTORY";
	public static final String SUCCESS_MAIL = "SUCCESS_MAIL";
	public static final String ADD_TO_PENDING_MAIL = "ADD_TO_PENDING_MAIL";
	public static final String OD_TO_ID = "OD_TO_ID";
	public static final String OD_MAIL_BODY = "OD_MAIL_BODY";
	public static final String OD_FROM_ID = "OD_FROM_ID";
	public static final String OD_MAIL_SUBJECT = "OD_MAIL_SUBJECT";
	public static final String OD_REPLY_TO = "OD_REPLY_TO";
	public static final String OD_CC_TO = "OD_CC_TO";
	public static final String OD_BCC_TO = "OD_BCC_TO";
	public static final String OD_REF_ID = "OD_REF_ID";
	public static final String OD_PATH = "OD_PATH";
	public static final String OD_MAIL_STATUS = "OD_MAIL_STATUS";
	public static final String MAX_MAIL_RETRY = "MAX_MAIL_RETRY";
	public static final String OD_BULK_MAIL = "OD_BULK_MAIL";
	public static final String RETRIEVE_SUBSCRIBED_REPORT = "RETRIEVE_SUBSCRIBED_REPORT";
	public static final String RETRIEVE_LAST_SEQUENCE = "RETRIEVE_LAST_SEQUENCE";
	public static final String LAST_SEQUENCE = "LAST_SEQUENCE";

	public static final String SMS_FRMWRK_DAM_KEY = "SMS_FRMWRK_KEY";
	public static final String PENDING_SMS_DELIVERED = "PENDING_SMS_DELIVERED";
	public static final String APPID_SMS_GATEWAY = "CIB2SMS_GATEWAY";
	public static final String APPID_MAIL_GATEWAY = "CIB2MAIL_GATEWAY";
	public static final String OD_USER_NO = "OD_USER_NO";
	public static final String OD_MOBILE_NO = "OD_MOBILE_NO";
	public static final String OD_LONG_MSG = "OD_LONG_MSG";
	public static final String SMS_MOVE_HISTORY = "SMS_MOVE_HISTORY";
	public static final String SMS_EXT_PENDING_UPDATE = "SMS_EXT_PENDING_UPDATE";
	public static final String SMS_FAIL_STATUS_UPDATE = "SMS_FAIL_STATUS_UPDATE";

	public final static String MOBILE_NO = "MOBILE_NO";
	public final static String SMS_MSG = "SMS_MSG";
	public final static String LANG_CD = "LANG_CD";
	public final static String LANG_CODE = "EN";
	public final static String REF_NO = "REF_NO";

	public static final String MOBILE = "MOBILE";
	public static final String MAIL_TO = "MAIL_TO";
	public static final String SUBJECT = "SUBJECT";
	public static final String MSG = "MSG";
	public static final String IS_NOW = "IS_NOW";
	public static final String IS_NOW_VAL = "Y";
	public static final String SCHD_TIME = "SCHD_TIME";
	public static final String SCHD_TIME_VAL = "";

	public final static String RES_STATUS = "res_Status";
	public final static String RES_STATUS_VALUE = "00000";
	public final static String RESULT_CODE_VALUE = "0";
	public static final String RESULT_CD_KEY = "RESULT_CD";
	public static final String SMS_RETRY_COUNT = "SMS_RETRY_COUNT";
	public static final String ENCRYPT_DAM_KEY = "ENCRPT_KEY";
	public static final String RETRIEVAL = "RETRIEVAL";
	public static final String EMAIL_ID = "EMAIL_ID";
	public static final String ENCRYPT = "ENCRYPT";
	public static final String SMSRETRY_COUNT = "SMSRETRY_COUNT";
	public static final String SMTPRETRY_COUNT = "SMTPRETRY_COUNT";
	public static final String ADD_TO_UNDELIVERED_ALERTS = "ADD_TO_UNDELIVERED_ALERTS";
	public static final String TRANS_CODE = "TRANS_CODE";
	public static final String SESSION_ID = "SESSION_ID";
	public static final String GET_EVENT_ID = "GET_EVENT_ID";
	public static final String ALERT_DETAIL = "ALERT_DETAIL";
	public static final String USER_DATA = "USER_DATA";

	public static final String RETRY_COUNT = "RETRY_COUNT";

	public static final String CONTACT_DETAILS = "CONTACT_DETAILS";
	public static final String ALERTCHAN_PREF = "ALERTCHAN_PREF";
	public static final String SAVE_MNG_ALERTS = "SAVE_MNG_ALERTS";
	public static final String ENTL_TYPE = "ENTL_TYPE";
	public static final String REQ_STATUS = "REQ_STATUS";
	public static final String STATUS_SUCCESS = "STATUS_SUCCESS";
	public static final String STATUS_FAILED = "STATUS_FAILED";
	public static final String CHANNEL_EMAIL = "CHANNEL_EMAIL";
	public static final String CHANNEL_SMS = "CHANNEL_SMS";
	public static final String CHANNEL_INBOX = "CHANNEL_INBOX";
	public static final String INBOX = "INBOX";
	public static final String SMTP = "SMTP";
	public static final String SMS = "SMS";
	public static final String ALERTSUB_DATA_DEL = "ALERTSUB_DATA_DEL";
	public static final String ALERTSUB_DATA_INSERT = "ALERTSUB_DATA_INSERT";
	public static final String GET_USERDETAILS = "GET_USERDETAILS";
	public static final String GET_CHANNEL_ID = "GET_CHANNEL_ID";
	public static final String GET_ALERT_ID = "GET_ALERT_ID";
	public static final String widgetId = "widgetId";
	public static final String MIME_TYPE = "MIME_TYPE";
	public static final String OD_GCIF = "OD_GCIF";
	public static final String CREATED_BY = "CREATED_BY";
	public static final String INSERT_RECORDS = "INSERT_RECORDS";
	public static final String ALERT_SUBSCRIPTION = "ALERT_SUBSCRIPTION";
	public static final String DELETE_RECORDS = "DELETE_RECORDS";
	public static final String AUDIT_RECORDS = "AUDIT_RECORDS";
	public static final String GET_MIMETYPE = "GET_MIMETYPE";
	public static final String ALERT_SUB_DATA = "ALERT_SUB_DATA";
	public static final String ENABLED_CHANNELS = "ENABLED_CHANNELS";
	public static final String AUDIT_ALERTSUB_DATA = "AUDIT_ALERTSUB_DATA";
	public static final String GET_ALERT_CHAN_ENABLED = "GET_ALERT_CHAN_ENABLED";
	public static final String ACCOUNT_NUM = "ACCOUNT_NUM";
	public static final String OD_ACC_NO = "OD_ACC_NO";
	public static final String OD_SUBPROD_CODE = "OD_SUBPROD_CODE";
	public static final String GET_LIST_ENTITLED_USERS = "GET_LIST_ENTITLED_USERS";
	public static final String GET_USERS_LIST = "GET_USERS_LIST";

	public static final String CHANNEL_HANDLERS = "CHANNEL_HANDLERS";
	public static final String USERS_SUB_FOR_CHANNELS = "USERS_SUB_FOR_CHANNELS";
	public static final String SUBSCRIBED_FOR_ALERTS = "SUBSCRIBED_FOR_ALERTS";
	public static final String SORT_ASC = "ASC";

	public static final String EVENT_ID = "EVENT_ID";
	public static final String GET_EVENT_LIST = "GET_EVENT_LIST";
	public static final String ASSIGNMENT_KEY = "ASSIGNMENT_KEY";
	public static final String DELIMITER_KEY = "DELIMITER_KEY";

	public static final String TO_ID = "TO_ID";
	public static final String FROM_ID = "FROM_ID";
	public static final String MAIL_BODY = "MAIL_BODY";
	public static final String MAIL_SUBJECT = "MAIL_SUBJECT";
	public static final String REPLY_TO = "REPLY_TO";
	public static final String CC_ID = "CC_ID";
	public static final String BCC_ID = "BCC_ID";
	public static final String FILE_PATH = "FILE_PATH";
	public static final String TYPE = "TYPE";
	public static final String EMAIL_TYPE = "EMAIL";
	public static final String PASSWORD_PROTECTED = "PASSWORD_PROTECTED";
	public static final String YES_Y = "Y";
	public static final String NO_N = "N";
	public static final String ERR_CD_MAIL = "Mail_ErrorCode_001";
	public static final String ERR_CD_MAIL_IO = "Mail_ErrorCode_002";

	public static final String RESOURCEBUNDLE = "alert";
	public static final String INPUT_GCIF = "INPUT_GCIF";
	public static final String GET_LIST_ENTITLED_USERS_GCIF = "GET_LIST_ENTITLED_USERS_GCIF";
	public static final String OD_REF_NO = "OD_REF_NO";
	public static final String OD_MAKER_ID = "OD_MAKER_ID";
	public static final String OD_STATUS = "OD_STATUS";
	public static final String OD_FUNCTION_ID = "OD_FUNCTION_ID";

	public static final String ALERT_EXT_GET_MESSAGES_COUNT = "ALERT_EXT_GET_MESSAGES_COUNT";
	public static final String ALERT_EXT_GET_UNREAD_MESSAGES_FOR_STATUS = "ALERT_EXT_GET_UNREAD_MESSAGES_FOR_STATUS";
	public static final String ALERT_EXT_GET_UNREAD_MESSAGES_FOR_DATE = "ALERT_EXT_GET_UNREAD_MESSAGES_FOR_DATE";
	
	public static String MAIL_HEADER_TEMPLATE = "MAIL_HEADER_TEMPLATE";
	public static String MAIL_FOOTER_TEMPLATE = "MAIL_FOOTER_TEMPLATE";
	public static String ALERT_TEMPLATE_CODE = "ALERT_TEMPLATE_CODE";
	public static String EMAIL_TEMPLATE_CODE = "EMAIL_TEMPLATE_CODE";
	public static String ERR_ALERT_FETCH_EMAIL_TEMPLATE_CODE = "ERR_ALERT_FETCH_EMAIL_TEMPLATE_CODE";

	public static final PropertyReader ALERT_PROPERTIES = new PropertyReader("canvas_alert_properties");
}
