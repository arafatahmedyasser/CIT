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

package com.intellectdesign.canvas.audit.handler;

import java.text.SimpleDateFormat;
import java.util.Locale;

import com.intellectdesign.canvas.properties.reader.PropertyReader;

/**
 * This class contains AuditConstants
 * 
 * @version 1.0
 */
public interface AuditConstants
{

	public static final PropertyReader EVENT_PROP_READER = new PropertyReader("CTevent_properties");//Renaming Property File
	public static final String MANDATORY_AUDIT_META_DATA = "MANDATORY_AUDIT_META_DATA";
	public static final String MANDATORY_AUDIT_DATA_OLD_STATE = "MANDATORY_AUDIT_DATA_OLD_STATE";
	public static final String MANDATORY_AUDIT_DATA_NEW_STATE = "MANDATORY_AUDIT_DATA_NEW_STATE";
	public static final String ROOT_ELEMENT_NAME = "XML_ROOT_ELEMENT_NAME";
	public static final String OLD_STATE = "OLD_STATE";
	public static final String THIS_STATE = "THIS_STATE";
	public static final String ELEM_FIELD = "ELEM_FIELD";
	public static final String ELEM_FIELD_NAME = "ELEM_FIELD_NAME";
	public static final String OLD_VALUE = "OLD_VALUE";
	public static final String NEW_VALUE = "NEW_VALUE";
	public static final String AUDIT_FORMAT_TYPE = "AUDIT_FORMAT";
	public static final String AUDIT_FORMAT_CLASS_EXTN = "_AUDIT_FORMATTER_CLASS";
	public static final String AUDIT_TRANSLATOR_CLASS_EXTN = "_AUDIT_TRANSLATOR_CLASS";
	public static final String AUDIT_ELEM_COLL_COUNT_EXTN = "_COUNT";
	public static final String AUDIT_COLL_ELEM_LABEL_EXTN = "_ELEM_LBL";
	public static final String AUDIT_COLL_ELEM_EXTN = "_ELEM";
	public static final String AUDIT_FORMAT_CONF_XML = "XML";
	public static final String AUDIT_FORMAT_CONF_TEXT = "TXT";
	// Audit Meta Data Constants
	public static final String AUDIT_ID = "AUDIT_ID";
	public static final String EVENT_ID = "EVENT_ID";
	// For Audit-Cleanup
	public static final String FIELD_NAME = "FIELD_NAME";
	public static final String FIELD_LABEL = "FIELD_LABEL";
	public static final String REQUIRED_IND = "REQUIRED_IND";
	public static final String AUDIT_FORMATTER_CLASS = "AUDIT_FORMATTER_CLASS";
	public static final String DATA_TRANSLATOR_CLASS = "DATA_TRANSLATOR_CLASS";
	public static final String TRANS_FIELD_IND = "TRANS_FIELD_IND";
	public static final String COLLECTION_FIELD_IND = "COLLECTION_FIELD_IND";
	public static final String USED_FOR_DSA = "USED_FOR_DSA";
	public static final String LABLE_PREFIX = "LABLE_PREFIX";
	public static final String RESOURCE_BUNDLE = "RESOURCE_BUNDLE";
	public static final String FIELD_RESOURCE_BUNDLE = "FIELD_RESOURCE_BUNDLE";
	public static final String COLLECTION_REF_FIELD = "COLLECTION_REF_FIELD";
	public static final String COUNT_LABEL = "COUNT_LABEL";
	public static final String COLLECTION_ELEM_LBL = "COLLECTION_ELEM_LBL";
	public static final String APP_SERVER = "APP_SERVER";
	public static final String CLIENT_IP_ADDR = "CLIENT_IP_ADDR";
	public static final String WEB_SERVER = "WEB_SERVER";
	public static final String AUDIT_DATE = "AUDIT_DATE";
	public static final String REFERENCE = "REFERENCE";
	public static final String REFERENCE_KEY = "REFERENCE_KEY";
	public static final String SESSION_ID = "SESSION_ID";
	public static final String OD_LOGIN_ID = "OD_LOGIN_ID";
	public static final String USER_NO = "USER_NO";
	public static final String OD_GCIF = "OD_GCIF";
	public static final String OD_PARENT_GCIF = "OD_PARENT_GCIF";
	public static final String SIMULATION_MODE = "SIMULATION_MODE";
	public static final String CHANNEL = "CHANNEL";
	public static final String BROWSER_NAME = "BROWSER_NAME";
	public static final String FLD_DSA_DATA = "FLD_DSA_DATA";
	// Audit Data
	public static final String AUDIT_DATA = "AUDIT_DATA";
	public static final String DSA_DATA = "DSA_DATA";
	public static final String AUDIT_SEQ = "AUDIT_SEQ";
	public static final String AUDIT_NO = "AUDIT_NO";
	// Delimiter constants
	public static final String FORMAT_KEY_VALUE_DELIMITER = "FORMAT_KEY_VALUE_DELIMITER";
	public static final String FORMAT_NEXT_FIELD_DELIMITER = "FORMAT_NEXT_FIELD_DELIMITER";
	public static final String FORMAT_OLD_AND_NEW_VALUE_DELIMITER = "FORMAT_OLD_AND_NEW_VALUE_DELIMITER";
	public static final String REQ_EVENT_ID_FIELDS_SUFFIX = "_REQ_FIELDS";
	public static final String OPT_EVENT_ID_FIELDS_SUFFIX = "_OPT_FIELDS";
	public static final String DSA_EVENT_ID_FIELDS_SUFFIX = "_DSA_FIELDS";
	public static final String TRANSLATE_FIELDS_SUFFIX = "_TRANS_FIELDS";
	public static final String TRANSLATE_RESR_BNDL_SUFFIX = "_TRANS_RB";
	public static final String TRANSLATE_VALUE_RB_PREFIX = "_PREFIX";
	public static final String PREFIX_OLD = "PREFIX_OLD";
	public static final String PREFIX_NEW = "PREFIX_NEW";
	// Mandatory fields
	public static final String REQ_EVENT_ID_FIELDS = "CLIENT_IP,GCIF";
	// Optional fields
	public static final String OPT_EVENT_ID_FIELDS = "CHANNEL";
	// Database constants
	public static final String AUDIT_HANDLER_DAM_KEY = "AUDIT_FRMK_MNT";
	public static final String AUDIT_EXT_META_DATA = "AUDIT_METADATA";
	public static final String AUDIT_EXT_DATA = "AUDIT_DATA";
	public static final String AUDIT_EXT_DATA_FOR_EVENT_AND_REFERENCE = "AUDIT_DATA_FOR_EVENT_AND_REF";
	public static final String AUDIT_EXT_GET_ID = "GET_AUDIT_ID";
	public static final String AUDIT_EXT_GET_NO = "GET_AUDIT_NO";
	public static final String AUDIT_EXT_CONFIGURATION_DATA = "AUDIT_CONFIGURATION_DATA";
	public static final String OD_PORTAL_ACC_ID = "OD_PORTAL_ACC_ID";
	public static final String AUDIT_EXT_GET_ORG_ACC_NO = "GET_ORG_ACC_NO";
	public static final String FORMAT_DSA_FIELDS_FLAG = "FORMAT_DSA_FIELDS_FLAG";
	public static final String VALUE_NO = "N";
	// The column size for the audit details
	public static final int MAX_DETAILS_COL_SIZE = 4000;
	// The default locale used for all auditing
	public static final Locale DEFAULT_LOCALE = new Locale("en", "US");
	public static final String ALERT_DATA_MAP = "ALERT_DATA_MAP"; // CHCR
	public static final String RECIPIENTS = "RECIPIENTS"; // CHCR
	public static final String SAME_HTML_TAG_01 = "SAME_HTML_TAG_01";
	public static final String SAME_HTML_TAG_02 = "SAME_HTML_TAG_02";
	public static final String DIFF_HTML_TAG_02 = "DIFF_HTML_TAG_02";
	public static final String SAME_HTML_TAG_03 = "SAME_HTML_TAG_03";
	// Default Audit Date Time format
	public static final SimpleDateFormat DEFAULT_AUDIT_DATE_TIME_FORMAT = new SimpleDateFormat("dd-MMM-yyyy HH:mm:ss");
	// Default Audit Date format
	public static final SimpleDateFormat DEFAULT_AUDIT_DATE_FORMAT = new SimpleDateFormat("dd-MMM-yyyy");
	public static final SimpleDateFormat SYSTEM_DEFAULT_DATE_FORMAT = new SimpleDateFormat("dd/MM/yyyy");
	public static final SimpleDateFormat SYSTEM_DEFAULT_DATE_TIME_FORMAT = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
	// The below is a nasty stuff. More towards supporting formats coming from other internal systems
	public static final SimpleDateFormat SYSTEM_DEFAULT_DATE_TIME_FORMAT_2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	// Note: The below value should be synchronized with the default audit date format above
	public static final String EMPTY_TIME_VALUE = "00:00:00";
	public static final String DEFAULT_VALUE_FOR_EMPTY_DATA = " ";
	public static final String DEFAULT_VALUE_FOR_DELETED_DATA = "--";
	public static final String DEVICE_BAND_ID = "DEVICE_BAND_ID";
	public static final String USER_AGENT = "USER_AGENT";
	public static final String WORKSPACE_ID = "WORKSPACE_ID";
	public static final String LAYOUT_ID = "LAYOUT_ID";
	public static final String WIDGET_ID = "WIDGET_ID";
	public static final String GEO_LOCATION = "GEO_LOCATION";
	public static final String REQUEST_ID = "REQUEST_ID";
	public static final String REQUEST_URI = "REQUEST_URI";
	public static final String UDF1 = "UDF1";
	public static final String UDF2 = "UDF2";
	public static final String UDF3 = "UDF3";
	public static final String UDF4 = "UDF4";
	public static final String UDF5 = "UDF5";
	public static final String UDF6 = "UDF6";
	public static final String UDF7 = "UDF7";
	public static final String UDF8 = "UDF8";
	public static final String UDF9 = "UDF9";
	public static final String UDF10 = "UDF10";

}
