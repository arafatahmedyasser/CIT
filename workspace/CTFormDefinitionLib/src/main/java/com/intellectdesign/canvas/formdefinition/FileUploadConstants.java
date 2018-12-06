/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.*/

package com.intellectdesign.canvas.formdefinition;

import com.intellectdesign.canvas.constants.common.FrameworkConstants;

/**
 * This class contains the file upload constants.
 * 
 * @version 1.0
 */
public class FileUploadConstants
{
	private FileUploadConstants()
	{
	}

	// Actions for file upload
	public static final String INIT_ACTION = "INIT_ACTION";
	public static final String PRE_FILE_UPLOAD = "PRE_FILE_UPLOAD";
	public static final String UPLOAD_FILE = "UPLOAD_FILE";

	// actions for file view
	public static final String GET_FILES_SUMMARY = "GET_FILES_SUMMARY";
	public static final String GET_FILE_DETAILS = "GET_FILE_DETAILS";
	public static final String GET_TXN_DETAILS = "GET_TXN_DETAILS";

	public static final String FILE_REF_NO = "FILE_REF_NO";
	public static final String FETCH_FILE_STATUS = "FETCH_FILE_STATUS";

	// event ids,host txncodes
	public static final String EVENTID_SUMMARY = "SUMMARY";
	public static final String EVENTID_DETAIL = "DETAIL";
	public static final String EVENTID_TRANSACTION = "TRANSACTION";
	public static final String EVENT_ID_PAGINATION = "PAGINATION";
	public static final String HOSTCODE_FVWH = "FVWH";
	public static final String HOSTCODE_FVWC = "FVWC";

	// Reply
	public static final String ENTITLED_FLUP_FUCTIONS = "ENTITLED_FLUP_FUCTIONS";
	public static final String FU_SUBPROD_CODE = "FU_SUBPROD_CODE";
	public static final String FU_FUNCTION_CODE = "FU_FUNCTION_CODE";
	public static final String FU_FUNC_CODE_LABEL = "FU_FUNC_CODE_LABEL";
	public static final String FU_ROLEBACK_FLAG = "FU_ROLEBACK_FLAG";
	public static final String FU_DISP_SUBPROD = "FU_DISP_SUBPROD";

	public static final String REPLY_PROD_CODE = "REPLY_PROD_CODE";
	public static final String REPLY_SUBPROD_CODE = "REPLY_SUBPROD_CODE";
	public static final String REPLY_FUNCTION_CODE = "REPLY_FUNCTION_CODE";
	public static final String REPLY_PROD_DESC = "REPLY_PROD_DESC";
	public static final String REPLY_SUBPROD_DESC = "REPLY_SUBPROD_DESC";
	public static final String REPLY_TOTAL_REC = "REPLY_TOTAL_REC";
	public static final String REPLY_FROM_REC = "REPLY_FROM_REC";
	public static final String REPLY_TO_REC = "REPLY_TO_REC";
	public static final String REPLY_ACCOUNT = "REPLY_ACCOUNT";
	public static final String REPLY_REF_NO = "REPLY_REF_NO";
	public static final String REPLY_UPLOAD_FROM_DATE = "REPLY_UPLOAD_FROM_DATE";
	public static final String REPLY_UPLAOD_TO_DATE = "REPLY_UPLAOD_TO_DATE";
	public static final String REPLY_AMT_FROM = "REPLY_AMT_FROM";
	public static final String REPLY_AMT_TO = "REPLY_AMT_TO";
	public static final String REPLY_VAL_FROM_DATE = "REPLY_VAL_FROM_DATE";
	public static final String REPLY_VAL_TO_DATE = "REPLY_VAL_TO_DATE";
	public static final String REPLY_SUM_LBL0 = "REPLY_SUM_LBL0";
	public static final String REPLY_SUM_LBL1 = "REPLY_SUM_LBL1";
	public static final String REPLY_SUM_LBL2 = "REPLY_SUM_LBL2";
	public static final String REPLY_SUM_LBL3 = "REPLY_SUM_LBL3";
	public static final String REPLY_SUM_LBL4 = "REPLY_SUM_LBL4";
	public static final String REPLY_SUM_LBL5 = "REPLY_SUM_LBL5";
	public static final String REPLY_SUM_LBL6 = "REPLY_SUM_LBL6";
	public static final String REPLY_SUM_LBL7 = "REPLY_SUM_LBL7";
	public static final String REPLY_DETSUM_LBL0 = "REPLY_DETSUM_LBL0";
	public static final String REPLY_DETSUM_LBL1 = "REPLY_DETSUM_LBL1";
	public static final String REPLY_DETSUM_LBL2 = "REPLY_DETSUM_LBL2";
	public static final String REPLY_DETSUM_LBL3 = "REPLY_DETSUM_LBL3";
	public static final String REPLY_DETSUM_LBL4 = "REPLY_DETSUM_LBL4";
	public static final String REPLY_DETSUM_LBL5 = "REPLY_DETSUM_LBL5";
	public static final String REPLY_DETSUM_LBL6 = "REPLY_DETSUM_LBL6";
	public static final String REPLY_DETSUM_LBL7 = "REPLY_DETSUM_LBL7";
	public static final String REPLY_DET_LBL0 = "REPLY_DET_LBL0";
	public static final String REPLY_DET_LBL1 = "REPLY_DET_LBL1";
	public static final String REPLY_DET_LBL2 = "REPLY_DET_LBL2";
	public static final String REPLY_DET_LBL3 = "REPLY_DET_LBL3";
	public static final String REPLY_DET_LBL4 = "REPLY_DET_LBL4";
	public static final String REPLY_DET_LBL5 = "REPLY_DET_LBL5";
	public static final String REPLY_DET_LBL6 = "REPLY_DET_LBL6";
	public static final String REPLY_DET_LBL7 = "REPLY_DET_LBL7";

	public static final String REPLY_SUM_REC_FROM = "REPLY_SUM_REC_FROM";
	public static final String REPLY_SUM_REC_TO = "REPLY_SUM_REC_TO";
	public static final String REPLY_FILE_SUM_HEADER = "REPLY_FILE_SUM_HEADER";
	public static final String REPLY_DET_REFNUM = "REPLY_DET_REFNUM";

	public static final String INPUT_HTYPE = "Functions";
	public static final String INPUT_FU_GRP = "01";
	public static final String INPUT_FROM_REC = "INPUT_FROM_REC";
	public static final String INPUT_TO_REC = "INPUT_TO_REC";
	public static final String INPUT_FUNC_GRP = "INPUT_FUNC_GRP";

	public static final String INPUT_TOT_REC = "INPUT_TOT_REC";
	public static final String INPUT_SEARCH_TYPE = "INPUT_SEARCH_TYPE";
	public static final String INPUT_UPLD_FROM_DATE = "INPUT_UPLD_FROM_DATE";
	public static final String INPUT_UPLD_TO_DATE = "INPUT_UPLD_TO_DATE";
	public static final String INPUT_AMT_FROM = "INPUT_AMT_FROM";
	public static final String INPUT_AMT_TO = "INPUT_AMT_TO";
	public static final String INPUT_EVENT_ID = "INPUT_EVENT_ID";
	public static final String INPUT_PROD_DESC = "INPUT_PROD_DESC";
	public static final String INPUT_SUBPROD_DESC = "INPUT_SUBPROD_DESC";
	public static final String INPUT_VAL_FROM_DATE = "INPUT_VAL_FROM_DATE";
	public static final String INPUT_VAL_TO_DATE = "INPUT_VAL_TO_DATE";
	public static final String INPUT_SUM_ACCNT_NO = "INPUT_SUM_ACCNT_NO";
	public static final String INPUT_SUM_REF_NO = "INPUT_SUM_REF_NO";
	public static final String INPUT_DET_REFNO = "INPUT_DET_REFNO";
	public static final String INPUT_SUBEVENT_ID = "INPUT_SUBEVENT_ID";

	// Error messages
	public static final String ERR_ACTION_NULL = "ERR_ACTION_NULL";
	public static final String ERR_ACTION_CLASS = "ERR_ACTION_CLASS";
	public static final String ERR_FLUP_CODE = FrameworkConstants.ERROR_PAGE;

	// Labels internationalization
	public static final String LBL_FLUP_HEADING = "LBL_FLUP_HEADING";
	public static final String LBL_FLUP_TITLE = "LBL_FLUP_TITLE";
	public static final String LBL_NAVLINK_HOME = "LBL_NAVLINK_HOME";
	public static final String LBL_NAVLINK_FLUP = "LBL_NAVLINK_FLUP";
	public static final String LBL_NAVLINK_FLUP_PRODUCT = "LBL_NAVLINK_FLUP_PRODUCT";
	public static final String LBL_SUBPRODUCT = "LBL_SUBPRODUCT";
	public static final String LBL_PRODUCT = "LBL_PRODUCT";
	public static final String LBL_FLUP_FUNC_NAME = "LBL_FLUP_FUNC_NAME";
	public static final String LBL_FLVW_TITLE = "LBL_FLVW_TITLE";
	public static final String LBL_FILE_TXN = "LBL_FILE_TXN";
	public static final String LBL_FLVW_NAVLINK = "LBL_FLVW_NAVLINK";
	public static final String LBL_FLVW_SEARCH_HEADING = "LBL_FLVW_SEARCH_HEADING";

	public static final String LBL_REF_NUM = "LBL_REF_NUM";
	public static final String LBL_ACC_NO = "LBL_ACC_NO";
	public static final String LBL_UPLD_DATE_FROM = "LBL_UPLD_DATE_FROM";
	public static final String LBL_UPLD_DATE_TO = "LBL_UPLD_DATE_TO";
	public static final String LBL_VAL_DATE_FROM = "LBL_VAL_DATE_FROM";
	public static final String LBL_VAL_DATE_TO = "LBL_VAL_DATE_TO";
	public static final String LBL_AMT_FROM = "LBL_AMT_FROM";
	public static final String LBL_AMT_TO = "LBL_AMT_TO";
	public static final String LBL_SEARCH = "LBL_SEARCH";
	public static final String LBL_CANCEL = "LBL_CANCEL";
	public static final String LBL_SELECT = "LBL_SELECT";

	// keys in the jsp Cache
	public static final String ENTITLED_PRODUCTS = "ENTITLED_PRODUCTS";
	public static final String ENTITLED_PRODUCTS_DESC = "ENTITLED_PRODUCTS_DESC";
	public static final String ENTITLED_SUBPRODUCTS = "ENTITLED_SUBPRODUCTS";
	public static final String ENTITLED_SUBPRODUCTS_DESC = "ENTITLED_SUBPRODUCTS_DESC";
	public static final String ENTITLED_FUNCTIONS = "ENTITLED_FUNCTIONS";
	public static final String ENTITLED_ACCOUNTS = "ENTITLED_ACCOUNTS";
	public static final String DEFAULT_LANG_CODE = "en_US";

	public static final String FILE_FIELD_ORDER = "FILE_FIELD_ORDER";
	public static final String FILE_SUM_HEADER = "FILE_SUM_HEADER";
	public static final String FILE_SUM_TXNLIST = "FILE_SUM_TXNLIST";
	public static final String FILE_DET_LABELS = "FILE_DET_LABELS";
	public static final String FILE_DET_DATA = "FILE_DET_DATA";
	public static final String TXN_FIELD_ORDER = "TXN_FIELD_ORDER";
	public static final String TXN_LABELS = "TXN_LABELS";
	public static final String TXN_LIST = "TXN_LIST";

	public static final String LBL_FLVW_SERACH_RESULT_TITLE = "LBL_FLVW_SERACH_RESULT_TITLE";
	public static final String MSG_NO_RECORDS = "MSG_NO_RECORDS";
	public static final String LBL_FLVW_TXN_TITLE = "LBL_FLVW_TXN_TITLE";
	public static final String LBL_FLVW_DET_TITLE = "LBL_FLVW_DET_TITLE";
	public static final String LBL_FLVW_TXN_DETAILS = "LBL_FLVW_TXN_DETAILS";
	public static final String LBL_FILE_HEADER = "LBL_FILE_HEADER";

	// error codes
	public static final String EFVIW_01 = "EFVIW_01";
	public static final String EFVIW_02 = "EFVIW_02";
	public static final String EFVIW_03 = "EFVIW_03";
	public static final String ERR_IN_CALLBACK = "ERR_IN_CALLBACK";
	public static final String ERR_NO_REC = "ERR_NO_REC";
	public static final String ERR_NO_HOSTRESP = "ERR_NO_HOSTRESP";
	public static final String ERROR_MESSAGE = "ERROR_MESSAGE";
	public static final String APPLICATION_SERVER_DOWN = "	APPLICATION_SERVER_DOWN";

	// interface elements response keys in hashmap
	public static final String HOST_HEADER = "Header";
	public static final String HOST_DATA = "Data";
	public static final String HOST_TOT_REC = "TotalRecords";
	public static final String HOST_ERR_CODE = "ErrorCode";
	public static final String HOST_ERR_DESC = "ErrorDesc";

	// Resource bundle keys
	public static final String TXN_DATA = "TXN_DATA";
	public static final String FILE_NAME = "FILE_NAME";
	public static final String SUM_LOC = "SUM_LOC";
	public static final String SUM_LBL = "SUM_LBL";
	public static final String DETSUM_LOC = "DETSUM_LOC";
	public static final String DETSUM_LBL = "DETSUM_LBL";
	public static final String DET_LOC = "DET_LOC";
	public static final String DET_LBL = "DET_LBL";
	public static final String TXN_LOC = "TXN_LOC";
	public static final String TXN_LBL = "TXN_LBL";

	// File view configuration file name fpr payments
	public static final String PYMNT_FVIW_CONFIG = "PayFileView";
	// Status Codes

	public static final String PENVER = "PENVER";
	public static final String VERFAL = "VERFAL";
	public static final String PNAUTH = "PNAUTH";
	public static final String AUTHZD = "AUTHZD";
	public static final String PROSSD = "PROSSD";
	public static final String REJCTD = "REJCTD";
	public static final String FAILED = "FAILED";
	public static final String TXNINT = "TXNINT";
	public static final String SUCCFL = "SUCCFL";

	public static final String FILE_UPLOAD_SUBJECT = "FILE_UPLOAD_SUBJECT";

	public static final String REJONL = "REJONL";
	public static final String A2ATRF = "A2ATRF";
	public static final String CRSBDR = "CRSBDR";
	public static final String CUSTCHQ = "CUSTCHQ";
	public static final String DDAED = "DDAED";
	public static final String DFDTRF = "DFDTRF";
	public static final String MCAED001 = "MCAED001";

	public static final String CONFAL = "CONFAL";
	public static final String PNCONV = "PNCONV";
	public static final String PNAONL = "PNAONL";

	public static final String FILE_ID = "FILE_ID";
	public static final String DATE_TIME = "DATE_TIME";
	public static final String FILE_CONTENT = "FILE_CONTENT";
	public static final String USER_ID = "USER_ID";
	public static final String HOST_ID = "CIB2FILE_UPLOAD";
	public static final String FL02 = "FL02";
	public static final String SUCCESS = "00000";
	public static final String RES_CODE = "0";
	public static final String STATUS = "STATUS";
	public static final String TRUE = "TRUE";
	public static final String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
	public static final String RES_STATUS = "res_Status";
	public static final String RESULT_CD = "RESULT_CD";
	public static final String RESULT_DESC = "RESULT_DESC";
	public static final String EVENT_ID = "EVENT_ID";
	public static final String FILE_URL = "FILE_URL";
	public static final String INIT_DATA_ACTION = "INIT_DATA_ACTION";
	public static final String VSBLTY = "VSBLTY";
	public static final String TMP_PATH = "TMP_PATH";
	public static final String NEW_PATH = "NEW_PATH";
	public static final String CIF = "CIF";
	public static final String SIZE = "SIZE";
	public static final String SESSIONID = "SESSIONID";
	public static final String TXNCODE = "TXNCODE";
	public static final String FUNCTION = "FUNCTION";
	public static final String PRODUCT = "PRODUCT";
	public static final String SUBPRODUCT = "SUBPRODUCT";
	public static final String ACCOUNT = "ACCOUNT";
	public static final String NEW_NAME = "NEW_NAME";
	public static final String ROLLBACK = "ROLLBACK";
	public static final String TEMPLATE = "TEMPLATE";
	public static final String AREA = "AREA";
	public static final String BRANCH = "BRANCH";
	public static final String FORMAT = "FORMAT";
	public static final String ACTUAL_NAME = "ACTUAL_NAME";
	public static final String DEBIT_AMOUNT = "0";
	public static final String CHANNEL_ID = "IB";
	public static final String CUST_TYPE = "C";
	public static final String RH = "RH";
	public static final String RO = "RO";
	public static final String FU_DF = "FU_DF";
	public static final String SESSION = "SESSION";
	public static final String A01 = "A01";
	public static final String D01 = "D01";

	public static final String FILE_CONTENT_EMPTY = "FILE_CONTENT_EMPTY";
	public static final String FILE_PATH_WRONG = "FILE_PATH_WRONG";

	public static final String AUTH_ACTION = "AUTH_TXN";
	public static final String RELEASE_ACTION = "TXN_SEND";
	public static final String REJECT_ACTION = "REJECT_TXN";
	public static final String VERIFY_ACTION = "VER_TXN";
	public static final String REJVER_ACTION = "REJ_TXN";
	public static final String PENRMT = "PENRMT";
	public static final String SUCPOS = "SUCPOS";
	public static final String REPPOS = "REPPOS";
	public static final String FLRTRY = "FLRTRY";
	public static final String FLPOST = "FLPOST";
	public static final String PENAPR = "PENAPR";
	public static final String REJBNK = "REJBNK";
	public static final String SUCPRN = "SUCPRN";
	public static final String BT = "BT";
	public static final String MC = "MC";
	public static final String DD = "DD";
	public static final String TT = "TT";
	public static final String LBT = "LBT";
	public static final String SWIFT = "SWIFT";

	public static final String SUBPROD_DEBT = "LIBR";
	public static final String REFERENCE_NO = "REFERENCE_NO";
	public static final String VERIFY = "VERIFY";

	public static final String FILE_ATTACH_HOST_TYPE = "FILE_ATTACH_HOST_TYPE";

}
