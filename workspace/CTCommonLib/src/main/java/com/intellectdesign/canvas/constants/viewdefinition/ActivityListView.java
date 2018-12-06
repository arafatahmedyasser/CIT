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

package com.intellectdesign.canvas.constants.viewdefinition;

/**
 * This class contains the Activity List View
 * 
 * @version 1.0
 */
public interface ActivityListView
{
	/**
	 * Internal constant for serialization purposes ref to ActivityListView
	 */
	public static final String ID = "id";

	public static final String TXN_REF_NUM = "TXN_REF_NUM";
	public static final String TXN_REF_NUM_LIST = "TXN_REF_NUM_LIST";
	public static final String LAST_AUTHORIZE_MAP = "LAST_AUTHORIZE_MAP";
	public static final String LAST_APPROVE_FLAG_MAP = "LAST_APPROVE_FLAG_MAP";
	public static final String STATUS = "STATUS";
	public static final String USER_LIST = "USER_LIST";
	public static final String PRODUCT = "PRODUCT";
	public static final String ACTION = "ACTION";
	public static final String INITIATE_DATE = "INITIATE_DATE";
	public static final String PGCIF = "PGCIF";
	public static final String PUSER_ID = "PUSER_ID";
	public static final String ENTL_LIST = "ENTL_LIST";

	public static final String SELECTED_RECORDS = "SELECTED_RECORDS";

	public static final String ACTIVITY_LIST_DETAILS = "ACTIVITY_LIST_DETAILS_QRY";

	public static final String ACTIVITY_LIST_VIEW_DETAILS = "ACTIVITY_LIST_VIEW_DETAILS";

	public static final String ACTIVITY_LIST_PENDING_APP_DETAILS = "ACTIVITY_LIST_DETAILS_PENDING_APP_QRY";
	public static final String SUMMARY_QRY_APPEND = "SUMMARY";

	public static final String ACC_NAME = "ACC_NAME";
	public static final String ACC_NO = "ACC_NO";
	public static final String CCY = "CCY";
	public static final String CONTEXT = "CONTEXT";
	public static final String COUNTRY = "COUNTRY";
	public static final String PAGE_CODE_TYPE = "PAGE_CODE_TYPE";
	public static final String LAST_APPROVER = "LAST_APPROVER";
	public static final String PROCESSED = "PROCESSED";
	public static final String BRANCH = "BRANCH";
	public static final String OPEN_LEG = "OPEN_LEG";
	public static final String AVAL_BAL = "AVAL_BAL";
	public static final String LAST_UPDATE = "LAST_UPDATE";
	public static final String EQUL_IN = "EQUL_IN";
	public static final String INITIATE_INVEST = "INITIATE_INVEST";
	public static final String BALANCE_REFRESH = "BALANCE_REFRESH";
	public static final String SELECT_VIEW = "SELECT_VIEW";
	public static final String VIEW_NAME = "VIEW_NAME";
	public static final String COLUMNS_GROUP = "COLUMNS_GROUP";
	public static final String COLUMNS_ORDER_COMBO = "COLUMNS_ORDER_COMBO";
	public static final String COMBO_VALUE_KEY = "code";
	public static final String COMBO_MSG_KEY = "desc";
	public static final String DEFAULT_VISIABLE_ROWS = "DEFAULT_VISIABLE_ROWS";
	public static final String IS_DEFAULT_VIEW = "IS_DEFAULT_VIEW";

	public static final String INIT_ACTION = "INIT_ACTION";
	public static final String APPROVE_ACTION = "AUTH_TXN";
	public static final String RELEASE_ACTION = "TXN_SEND";
	public static final String VALIDATE_APPROVE = "VALIDATE_APPROVE";
	public static final String DELETE_ACTION = "DEL_TXN";
	public static final String REJECT_ACTION = "REJECT_TXN";
	public static final String COMBO_CHANGE_ACTION = "COMBO_CHANGE_ACTION";
	public static final String COMBO_SELECT_VALUE = "COMBO_SELECT_VALUE";
	public static final String VIEW_APPROVE_DETAIL = "VIEW_APPROVE_DETAIL";
	public static final String ACTIVITY_STATUS = "ACTIVITY_STATUS";

	public static final String ITM_PRGRSS = "ITM_PRGRSS";
	public static final String ITM_APPROV = "ITM_APPROV";
	public static final String PROCSSD_BANK = "PROCSSD_BANK";
	public static final String READY_RELEASE = "READY_RELEASE";
	public static final String REJECTED_ITM = "REJECTED_ITM";
	public static final String DRAFTS = "DRAFTS";
	public static final String APPROVAL_PROGRESS = "RA";
	public static final String PENDING_ADD_APPROVAL = "IO";
	public static final String REJECTED_BY_BANK = "RH";
	public static final String RULE_NOT_FOUND = "RN";
	public static final String REJECTED_BY_ENTNT = "RE";
	public static final String REJECTED_BY_APPROVER = "RO";
	public static final String PROCESSED_BY_BANK = "AH";
	public static final String APPROVED = "AO";
	public static final String DRAFT = "DR";

	public static final String USER_ID = "USER_ID";
	public static final String PQUEUE_NAME = "PQUEUE_NAME";

	public static final String ALL_ITEMS = "ALL_ITEMS";
	public static final String APPROVAL = "APPROVAL";
	public static final String REJECTED = "REJECTED";
	public static final String RELEASED = "READY_FOR_RELEASE";
	public static final String APPROVER_DETAILS = "APPROVER_DETAILS";
	public static final String PENDINGAUTHORIZER = "PENDINGAUTHORIZER";
	public static final String AUTHORIZER = "AUTHORIZER";
	public static final String INTIATOR = "INTIATOR";
	public static final String PENDING_AUTH_COUNT = "PENDING_AUTH_COUNT";
	public static final String USER_ROLE = "USER_ROLE";
	public static final String PENDING_COUNT = "PENDING_COUNT";
	public static final String PENDING_ROLE = "PENDING_ROLE";
	public static final String NO_PEND_AUTH = "NO_PEND_AUTH";
	public static final String PENDING_AUTH_LIST = "PENDING_AUTH_LIST";
	public static final String AUTH_USER_ROLE = "AUTH_USER_ROLE";
	public static final String AUTH_DATE = "AUTH_DATE";
	public static final String AUTH_NAME = "AUTH_NAME";
	public static final String NO_AUTH = "NO_AUTH";
	public static final String DISPLAY_MSG = "DISPLAY_MSG";
	public static final String AUTH_COMPLETE_LIST = "AUTH_COMPLETE_LIST";
	public static final String INITIATE_TIME = "INITIATE_TIME";
	public static final String REFERENCE_NO = "REFERENCE_NO";
	public static final String MAKER_DATE = "MAKER_DATE";
	public static final String MAKER_NAME = "MAKER_NAME";
	public static final String VERIFY = "VERIFY";
	public static final String MAKER_TIME = "MAKER_TIME";
	public static final String INPUT_REF_NO = "INPUT_REF_NO";
	public static final String PEND_AUTH = "PEND_AUTH";
	public static final String REJECT_REASON = "REJECT_REASON";
	public static final String FAILED_MAP = "FAILED_MAP";
	public static final String TRANS_DETAIL_MAP = "TRANS_DETAIL_MAP";
	public static final String AUTH_RESPONSE = "AUTH_RESPONSE";
	public static final String SELECTED_INPUT_PRODUCT = "SELECTED_INPUT_PRODUCT";
	public static final String INPUT_PRODUCT = "INPUT_PRODUCT";
	public static final String INPUT_VER_NO = "INPUT_VER_NO";
	public static final String INPUT_FUNCTION_CODE = "INPUT_FUNCTION_CODE";
	public static final String SELECTED_INPUT_FUNCTION_CODE = "SELECTED_INPUT_FUNCTION_CODE";
	public static final String ALL_DSA = "2";
	public static final String STATUS_CODE = "STATUS_CODE";
	public static final String ALL_INTERMEDIATE = "3";
	public static final boolean LAST_APPROVE_FLAG = true;
	public static final String MIXED_DSA_AND_INTERMEDIATE = "4";
	public static final String DESC_ORDER = "DESC";
	public static final String SIMULATION_SUCCESS_FLAG = "SIMULATION_SUCCESS_FLAG";
	public static final String RESPONSE_ACTION = "RESPONSE_ACTION";
	public static final String SUCCESS = "success";
	public static final String VIEW_HISTORY = "VIEW_HISTORY";
	public static final String ACTIVITY_COUNT_ITEM = "ACTIVITY_COUNT_ITEM";

	public static final String UPLD_DATE = "UPLD_DATE";
	public static final String OD_REF_NO = "OD_REF_NO";
	public static final String PROCESSED_FLG = "PROCESSED_FLG";
	public static final String TEMP_SL = "TEMP_SL";
	public static final String FILE_NAME = "FILE_NAME";
	public static final String RECOUNT = "RECOUNT";
	public static final String OD_STATUS = "OD_STATUS";
	public static final String ENABLE_MULTI_SELECT = "ENABLE_MULTI_SELECT";
	public static final String OD_PRODUCT_CODE = "OD_PRODUCT_CODE";
	public static final String OD_SUBPROD_CODE = "OD_SUBPROD_CODE";
	public static final String OD_HOST_TXN_CODE = "OD_HOST_TXN_CODE";
	public static final String OD_FUNCTION_ID = "OD_FUNCTION_ID";
	public static final String LOCALE_VALUE = "LOCALE_VALUE";

	public static final String DEBTOR_APPROV = "DEBTOR_APPROV";
	public static final String REJECTED_DEBTOR = "REJECTED_DEBTOR";
	public static final String REJ_REASON = "REJ_REASON";

}
