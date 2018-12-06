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

package com.intellectdesign.canvas.constants.common;

import java.math.RoundingMode;

/**
 * This class contains the Framework constants
 * 
 * @version 1.0
 */
public class FrameworkConstants
{
	/**
	 * Private cnstructor to avoid instantiation.
	 */
	private FrameworkConstants()
	{
		/**
		 * Private cnstructor to avoid instantiation.
		 */
	}
	
	public static final String CONTEXT_APPLICATION_ID = "APPLICATION_ID";

	public static final String ENTL_ACTIONS = "ENTL_ACTIONS";
	public static final String SESSIONID = "SESSIONID";
	public static final String SESSION = "SESSION";
	public static final String FW_MAX_FILE_SIZE_MB = "FW_MAX_FILE_SIZE_MB";
	public static final String JSP_FIELDS = "JSP_FIELDS";
	public static final String MIGRATED_FLAG = "MIGRATED_FLAG";
	public static final String MIGRATED = "MIGRATED";
	public static final String PART_MIGRATED = "PART_MIGRATED";
	public static final String USE_DUMMY = "USE_DUMMY";
	public static final String INIT_ACTION = "INIT_ACTION";
	public static final String PRODUCT_LIST = "product-list";
	public static final String MAP_FILE = "-forward-map-file";
	public static final String FORWARD_MAPS = "ForwardMaps";
	public static final String PRODUCT_NAME = "PRODUCT_NAME";
	public static final String SUB_PRODUCT_NAME = "INPUT_SUB_PRODUCT";
	public static final String PAGE_CODE_TYPE = "PAGE_CODE_TYPE";
	public static final String ERROR_PAGE = "ERROR_PAGE";
	public static final String APP_PATH = "/EntlWeb";
	public static final String ENHANCED_ENTL_CHECK_FOR = "ENHANCED_ENTL_CHECK_FOR";
	public static final String ENHANCED_VALIDATION_CHECK_FOR_ = "ENHANCED_VALIDATION_CHECK_FOR_";
	public static final String CRIT_VAL_SEPARATOR = "^";
	public static final String CRIT_KEY_SEPARATOR = "~";
	public static final String IPORTAL_PRODUCTFUNC_MAPPING_FILES = "IPORTAL_PRODUCTFUNC_MAPPING_FILES";
	public static final String PROD_ACTION_FUNC_MAP_CACHE = "PROD_ACTION_FUNC_MAP_CACHE";
	public static final String IPORTAL_REP_ADV_FILES_PATH = "IPORTAL_REP_ADV_FILES_PATH";
	public static final String APP_STRUCTURE_NODES = "APP_STRUCTURE_NODES";
	public static final String WORKSPACE_META_DATA = "WORKSPACE_META_DATA";

	public static final String CONTENT_TYPE_PDF = "application/pdf";
	public static final String CONTENT_TYPE_HTML = "text/html; charset=utf-8";
	public static final String UTF = "UTF-8";
	public static final String CONTENT_TYPE_MSEXCEL = "application/vnd.ms-excel";
	public static final String FILE_NOT_FOUND = "FILE_NOT_FOUND";
	public static final String SUBPROD__FUNCTION = "SUBPROD__FUNCTION";
	public static final String ENTL_MODE = "ENTL_MODE";
	public static final String ALL = "ALL";
	public static final String ATLEASTONE = "ATLEASTONE";
	public static final String ACTION_ENTL_DELIM = "__";

	public static final String SIMULATION_MODE = "SIMULATION_MODE";
	public static final String SIMULATION_SUCCESS_FLAG = "SIMULATION_SUCCESS_FLAG";
	public static final String SUBMIT_SUCCESS = "SUBMIT_SUCCESS";
	public static final String RESPONSE_ACTION = "RESPONSE_ACTION";
	public static final String SUCCESS = "success";
	public static final String FAILURE = "failed";
	public static final String TRUE = "true";
	public static final String YES_Y = "Y";
	public static final String NO_N = "N";
	public static final String FORWARD_MAP_CACHE = "FORWARD_MAP_CACHE";
	public static final String PREEMPTIVE_ACCESS_CHECK_ENABLED = "PREEMPTIVE_ACCESS_CHECK_ENABLED";
	public static final int UNAVAILABLE_VERSION_NO = -1;
	public static final String KEY_ERROR_CODE = "ERR_CODE";
	public static final String KEY_REPLY_TYPE = "REPLY_TYPE";
	public static final String KEY_ERROR = "ERROR";
	public static final String KEY_WARN = "WARN";
	public static final String KEY_SUCCESS = "SUCCESS";
	public static final String KEY_WARN_WINDOW_TYPE = "WARN_WINDOW_TYPE";
	public static final String KEY_WARN_ID = "WARN_ID";
	public static final String KEY_WARN_MESSAGE = "WARN_MESSAGE";
	public static final String KEY_WARN_DATA = "WARN_DATA";
	public static final String KEY_WARNING_LIST = "WARNING_LIST";
	public static final String KEY_ERROR_MESSAGE = "ERR_MESS";
	public static final String KEY_AUTHORIZATION_SUCCESS = "AUTH_SUCCESS";

	public static final String TRANSACTION_TYPE = "TRANSACTION_TYPE";

	public static final String ERROR_SYSTEM_ERROR = "SYSERROR";

	public static final String MSG_DELETE_SUCCESSFUL = "TRAN_DEL";
	public static final String MSG_DELETE_FAILED = "ERR_DEL_INFRA";
	public static final String MSG_DELETE_SIMULATION = "DEL_TXN";
	public static final String MSG_AUTHORIZE_SIMULATION = "AUTH_TXN";
	public static final String MSG_AUTHORIZE_FAILED = "ERR_AUTH_TXN";
	public static final String MSG_AUTHORIZE_ENTITLEMENT_FAILED = "USER_NOT_ENTITLED";
	public static final String MSG_REJECT_ENTITLEMENT_FAILED = "USER_NOT_ENTITLED";
	public static final String MSG_TXN_AUTHORIZATION_COMPLETED = "MSG_TXN_COMPLETE_BY_OD";
	public static final String MSG_REJECT_SIMULATION = "REJECT_TXN";
	public static final String MSG_REJECT_FAILED = "ERR_REJECT_TXN";
	public static final String MSG_SAVE_FAILED = "ERR_SAVE_INFRA";
	public static final String MSG_GET_TRANSACTION_DETAILS_FAILED = "ERR_GET_INFRA";
	public static final String MSG_CREATE_TEMPLATE_SUCCESSFUL = "TEMP_CREATE";
	public static final String MSG_CREATE_TEMPLATE_FAILED = "ERR_CREATE_TEMP_INFRA";
	public static final String MSG_DELETE_TEMPLATE_SUCCESSFUL = "DEL_TEMP";
	public static final String MSG_DELETE_TEMPLATE_FAILED = "ERR_DEL_TEMP_INFRA";
	public static final String MSG_VIEW_TEMPLATE_FAILED = "ERR_VIEW_TEM_INFRA";
	public static final String MSG_SAVE_AS_DRAFT_SUCCESSFUL = "TXN_DRAFT";
	public static final String MSG_READY_FOR_BATCH_SUCCESSFUL = "TXN_BATCH";
	public static final String MSG_TXN_READY_FOR_RELEASE = "MSG_TXN_READY_FOR_RELEASE";
	public static final String MSG_ERROR_RULE_NOT_FOUND = "ERR_RULE_NOT_FOUND";
	public static final String MSG_UPDATE_TXN_FAILED = "ERR_UPDATE_TXN";
	public static final String MSG_ERR_MOVE_TO_HIST = "ERR_MOVE_TO_HIST";

	public static final String MSG_PREEMPTIVE_LOCK_FAILED = "ERR_TXN_LIST_010";
	public static final String MSG_PREEMPTIVE_LOCK_GENERAL_EXCEPTION = "ERR_TXN_LIST_011";
	public static final String MSG_CANCEL_FAILED = "ERR_CANCEL_TXN";
	public static final String MSG_CANCEL_ENTITLEMENT_FAILED = "USER_NOT_ENTITLED";
	public static final String MSG_BACK_FAILED = "MSG_BACK_FAILED";

	public static final String ERR_TOPUP_WIP_TRANSACTION = "ERR_TOPUP_WIP_TRANSACTION";
	public static final String BUNDLE_CANVAS_DEFAULT = "canvas-default";
	public static final String BUNDLE_ERROR = "error";

	public static final String DEFAULT_LOCALE = "en_US";

	public static final String ACTION_SAVE_TXN = "SAVE_TXN";
	public static final String ACTION_DELETE_TXN = "DEL_TXN";
	public static final String ACTION_AUTH_TXN = "AUTH_TXN";
	public static final String ACTION_REJECT_TXN = "REJECT_TXN";
	public static final String ACTION_DELETE_TRADE_TXN = "DEL_TRD_TXN";
	public static final String ACTION_GET_TXN_DETAILS = "GET_TXN";
	public static final String ACTION_SAVE_TEMPLATE = "SAVE_TEMP";
	public static final String ACTION_DELETE_TEMPLATE = "DEL_TEMP";
	public static final String ACTION_VIEW_TEMPLATE = "VIEW_TEMP";
	public static final String ACTION_GET_INIT_TXN = "GET_INIT_ACTION";
	public static final String ACTION_INIT_TXN = "INIT_ACTION";
	public static final String ACTION_UPDATE_TXN = "UPDATE_TXN";
	public static final String ACTION_CUTOFF_TXN = "UPDATE_CUTOFF_TXN";

	public static final String HIST_ACTION_EDIT = "EDIT";
	public static final String HIST_ACTION_UPDATE = "UPDATE";
	public static final String HIST_ACTION_HOST_REJECT = "HOST_REJECT";
	public static final String HIST_ACTION_SENT_TO_HOST = "SENT_TO_HOST";
	public static final String HIST_ACTION_HOST_STATUS_UPDATION = "HOST_STATUS_UPDATION";
	public static final String HIST_ACTION_RETRY_FAILED = "RETRY_FAILED";
	public static final String HIST_ACTION_REJECT = "REJECT";
	public static final String HIST_ACTION_AUTHORIZE = "AUTHORIZE";
	public static final String HIST_ACTION_HOST_AUTHORIZE = "HOST_AUTHORIZE";
	public static final String HIST_ACTION_IN_PROCESS_IN_HOST = "IN_PROCESS_IN_HOST";

	public static final String REQUEST_ID = "REQUEST_ID";

	public static final String USER_NO = "USER_NO";
	public static final String ACTION = "ACTION";
	public static final String VERSION_NO = "VERSION_NO";
	public static final String OD_REF_NO = "OD_REF_NO";
	public static final String CANCEL_TXN = "CANCEL_TXN";
	public static final String UNKNOWN_ACTION = "UNKNOWN_ACTION";
	public static final String OD_STATUS = "OD_STATUS";
	public static final String CODE_DELETED = "DE";
	public static final String ERR_PAYLOAD_NULL = "ERR_PAYLOAD_NULL";
	public static final String ERR_INVALID_REPONSE_TYPE = "ERR_INVALID_REPONSE_TYPE";
	public static final String TLIP_IS_SIMULATED_KEY = "isSimulated";
	public static final String TLIP_SIMULATED_USER_ID_KEY = "simulatedUserID";
	public static final String PORTAL_SIMULATING_USER_ID_KEY = "simulatingUserNo";
	public static final String YES = "Yes";
	public static final String NO = "No";
	public static final String SIMULATION_FLAG_TRUE = "true";
	public static final String SIMULATION_FLAG_FALSE = "false";
	public static final String OD_GCIF = "OD_GCIF";
	public static final String OD_USER_NO = "OD_USER_NO";
	public static final String STATUS = "STATUS";
	public static final String ENABLE_PORTAL_CUTOFF = "ENABLE_PORTAL_CUTOFF";

	public static final int DEFAULT_RATE_PRECISION = 5;
	public static final RoundingMode DEFAULT_RATE_ROUNDING_MODE = RoundingMode.HALF_UP;
	public static final String CONTENT_TYPE = "application/";

	public static final String MSG_DELLIB_SIMULATION = "DELETE_LIB";
	public static final String MSG_AUTHLIB_SIMULATION = "AUTH_LIB";
	public static final String MSG_REJLIB_SIMULATION = "DELETE_LIB";
	public static final String MSG_MODIFYLIB_SIMULATION = "MODIFY_LIB";
	public static final String MSG_ADDLIB_SIMULATION = "SAVE_LIB";
	public static final String IO_EXCEPTION = "IO_EXCEPTION";
	public static final String APP_MENU_ITEMS_META = "APP_MENU_ITEMS_META";
	public static final String ENTL_MENU_ITEMS_META = "ENTL_MENU_ITEMS_META";
	public static final String LIMIT_VALIDATION_CHECK_FOR_ = "LIMIT_VALIDATION_FOR_";
	public static final String BACK_TXN = "BACK_TXN";
	public static final String TXN_HEADER_DATA = "TXN_HEADER_DATA";

	public static final String NODE_FILESET = "fileset";
	public static final String NODE_FILE = "file";
	public static final String ATTR_ID = "id";
	public static final String ATTR_URL = "url";

	public static final String ENTL_FUNCTIONS = "ENTL_FUNCTIONS";

	public static final String RATE_MAX_PRECISION = "RATE_MAX_PRECISION";
	public static final String MSG_CONFIMPRINT_FAILED = "CONFIMATION PRINT FAILED";

	public static final String ERR_ENTL_CHNANNEL = "ENTL_CHNANNEL_ERROR";
	public static final String ERR_ENTL_USER = "USER_NOT_ENTITLED";
	public static final String ENTL_ERROR = "ENTL_ERROR";

	public static final String EXTERNAL_WORKSPACE_ENTITLEMENT_REQUIRED = "EXTERNAL_WORKSPACE_ENTITLEMENT_REQUIRED";
	public static final String EXTERNAL_WORKSPACE_ENTL = "EXTERNAL_WRKSPE_ENTL";
	public static final String WORKSPACE_LIST = "WORKSPACE_LIST";
	public static final String USER_REG_NOT_COMPLETED = "USER_REG_NOT_COMPLETED";

	public static final String EXTERNAL_WIDGET_ENTL = "EXTERNAL_WIDGET_ENTL";
	public static final String EXTERNAL_WIDGET_ENTL_DATA_CACHE = "EXTERNAL_WIDGET_ENTL_DATA_CACHE";
	public static final String EXTERNAL_WIDGET_ENTITLEMENT_REQUIRED = "EXTERNAL_WIDGET_ENTITLEMENT_REQUIRED";
	public static final String ENTL_ENGINE_NOT_AVAIALBLE = "ENTL_ENGINE_NOT_AVAIALBLE";
	public static final String IS_ENTITLED = "IS_ENTITLED";

	public static final String ATTR_PRESERVE_ORDER = "preserveOrder";
	public static final String URLSET = "URLSET";
	public static final String CBXCORE = "CBXCORE";
	public static final String JSFILES_LIB = "jsfiles_lib";
	public static final String EXT_JS = "EXT-JS";
	public static final String EXCEPTION_CODE = "EXCEPTION_CODE";
	public static final String VALIDATION_EXCEPTION = "VALIDATION_EXCEPTION";
	public static final String CLASS_NOT_FOUND_EXCEPTION = "CLASS_NOT_FOUND_EXCEPTION";
	public static final String INSTANTIATION_EXCEPTION = "INSTANTIATION_EXCEPTION";
	public static final String ILLEGALACCESS_EXCEPTION = "ILLEGALACCESS_EXCEPTION";
	public static final String FORWARD_MAPPING_LOAD_EXCEPTION = "FORWARD_MAPPING_LOAD_EXCEPTION";
	public static final String SYSERROR = "SYSERROR";
	public static final String GET_APPS = "GET_APPS";
	public static final String ADD_APPS = "ADD_APPS";
	public static final Object DELETE_APP = "DELETE_APP";
	public static final String HEADER_KEY_VIEWS_LIST = "VIEWS_LIST";
	public static final String HEADER_KEY_ACC_GRP_LIST = "ACC_GRP_LIST";
	public static final String HEADER_KEY_VIEW_METADATA = "VIEW_MD";
	public static final String HEADER_KEY_VIEW_ADDITIONAL_META_DATA = "VIEW_ADDL_MD";
	public static final String HEADER_KEY_VIEW_DATA = "VIEW_DATA";
	public static final String HEADER_KEY_REF_CCY_LIST = "CCY_LIST";
	public static final String HEADER_KEY_REFERENCE_CCY = "REFERENCE_CCY";
	public static final String HEADER_KEY_ADDITIONAL_DATA = "ADDITIONAL_DATA";
	public static final String HEADER_KEY_TOTAL_COUNT = "TOTAL_COUNT";
	public static final String HEADER_KEY_LAST_UPDATED_DATE_TIME = "LAST_UPDATED_DT_TM";
	public static final String HEADER_KEY_LAST_UPDATED_DATE_MSG = "LAST_UPDATED_DT_KEY";
	public static final String HEADER_MULTI_WIDGETS_CHILDREN = "CHILD_WIDGETS";
	public static final String HEADER_MULTI_WIDGET_METADATA = "MULTI_WIDGET_MD";
	public static final String VIEW_CONTEXT_LIST = "CONTEXT_MENU_LIST";
	public enum SyncMetadataConstants {
		ATTR_UNIQUE("id"), 
		ATTR_DATA("data"),
		ATTR_VALUE("value"), 
		ATTR_TYPE("type"),
		ATTR_KEYS("keys"),
		ATTR_SYNC_TIME("synctime"), 
		ATTR_ADDITIONAL_DATA("addData"),
		ATTR_CHILD_WIDGET("child_widget"),
		ATTR_CHILD_WIDGET_MD("child_widget_md"), 
		SYNC_METADATA("SYNC_METADATA"),
		MISSING_TARGET_CLASS("MISSING_TARGET_CLASS");
		   String constantName;
		   private SyncMetadataConstants(String name) {
			   constantName = name;
		   }
		   public String getName() {
		      return constantName;
		   } 
		}
}
