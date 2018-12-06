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

package com.intellectdesign.canvas.constants.login;


/**
 * this class contains the Login Master Constants
 * 
 * @version 1.0
 */

/**
 * constant file for user/corparate preference
 */
public final class LoginMasterConstants
{
	/**
	 * Private cnstructor to avoid instantiation. Create a private constructor to ensure that no one creates an instance
	 * of this class
	 */
	private LoginMasterConstants()
	{
	}
	
	public static final String ERROR_CODE = "ERROR_CODE";
	public static final String ERROR_MESSAGE = "ERROR_MSG";

	public static final String DAM_KEY_LOGIN_USER = "LOGIN_USER";
	public static final String DAM_KEY_LOGIN_CHECK_USER_EXISTENCE = "LOGIN_CHECK_USER_EXISTENCE";
	public static final String DAM_KEY_GET_USERNO_FROM_LOGINID = "GET_USERNO_FROM_LOGINID";
	public static final String DAM_KEY_GET_USERNO_FROM_LOGINID_USER_TABLE = "GET_USERNO_FROM_LOGINID_USER_TABLE";
	public static final String DAM_KEY_GET_PRIMARY_CUSTOMER_FOR_USER = "GET_PRIMARY_CUSTOMER_FOR_USER";
	public static final String DAM_KEY_GET_ALL_CUSTOMERS_FOR_USER = "GET_ALL_CUSTOMERS_FOR_USER";
	public static final String DAM_KEY_GET_CUSTOMER_NAME = "GET_CUSTOMER_NAME";
	public static final String DAM_KEY_UPDATE_USER_STATUS = "UPDATE_USER_STATUS";
	public static final String DAM_KEY_CHECK_USER_ENTRY = "CHECK_USER_ENTRY";
	public static final String LOGIN = "LOGIN";
	public static final String LOGOUT = "LOGOUT";
	public static final String PARAM_USER_NO = "USER_NO";
	public static final String PARAM_LOGIN_ID = "LOGIN_ID";
	public static final String PARAM_OD_GCIF = "OD_GCIF";
	public static final String PARAM_STATUS_FLAG = "STATUS_FLAG";

	public static final String FLD_USER_VALUE = "USER_VALUE";
	public static final String FLD_USER_NO = "USER_NO";
	public static final String FLD_LOGIN_ID = "LOGIN_ID";
	public static final String FLD_STATUS_FLAG = "STATUS_FLAG";
	public static final String FLD_AUTHENTICATION_TYPE = "AUTHENTICATION_TYPE";
	public static final String FLD_GCIF_COUNT = "GCIF_COUNT";
	public static final String FLD_USER_NAME = "USER_NAME";
	public static final String FLD_OD_GCIF = "OD_GCIF";
	public static final String FLD_GCIF = "GCIF";
	public static final String FLD_CURR_DATE = "CURR_DATE";
	public static final String FLD_DISPLAY_DATE = "DISPLAY_DATE";
	public static final String FLD_CUSTOMER_TYPE = "CUSTOMER_TYPE";
	public static final String FLD_CERT_SERIAL_NUMBER = "CERT_SERIAL_NUMBER";
	public static final String FLD_COD_CIF = "COD_CIF";
	public static final String FLD_FIRST_NAME = "FIRST_NAME";
	public static final String FLD_MIDDLE_NAME = "MIDDLE_NAME";
	public static final String FLD_LAST_NAME = "LAST_NAME";
	public static final String FLD_LAST_LOGIN_DATE = "LAST_LOGIN_DATE";
	public static final String FLD_CUSTOMER_NAME = "CUSTOMER_NAME";

	public static final String DAM_OPER_EXTN_LAST_LOGIN_DATE = "LAST_LOGIN_DATE";
	public static final String DAM_OPER_EXTN_NICKNAME_MASTER = "NICKNAME_MASTER";

	public static final String STATUS_FAILURE = "failure";
	public static final String STATUS_SUCCESS = "success";

	public static final String USER_STATUS_NOT_REGISTERED = "T";
	public static final String USER_STATUS_CLOSED = "C";
	public static final String USER_STATUS_DISABLED = "D";
	public static final String USER_STATUS_ENABLED = "E";

	public static final String CUST_TYPE_RETAIL = "R";
	public static final String CUST_TYPE_CORPORATE = "C";

	public static final String RESOURCE_BUNDLE_INFRA = "infra";
	public static final String RESOURCE_BUNDLE_ERRORS = "CTerrors";

	public static final String DAM_KEY_UPDATE_LOGIN_STATUS = "UPDATE_LOGIN_STATUS";
	public static final String GET_LOGIN_STATUS = "GET_LOGIN_STATUS";
	public static final String LOGIN_STATUS = "LOGIN_STATUS";
	public static final String DAM_OPER_EXTN_ORBIIBS_NICKNAME = "DAM_OPER_EXTN_ORBIIBS_NICKNAME";
	public static final String USER_NO = "USER_NO";
	public static final String DAM_KEY_REGISTER_CHECK_USER_EXISTENCE = "REGISTER_CHECK_USER_EXISTENCE";
	public static final String DAM_KEY_REGISTER_GET_USER_FLDS = "REGISTER_GET_USER_FLDS";
	public static final String DAM_OPER_EXTN_OD_USERS_MB = "OD_USERS_MB";
	public static final String DAM_KEY_REGISTER_USER = "REGISTER_USER";
	public static final String DAM_KEY_LOGIN_STATUS_FLAG = "LOGIN_STATUS_FLAG";
	public static final String DAM_OPER_GET_UDF = "OD_USERS_MB_UDF";
	public static final String FLD_OD_LOGIN_ID = "OD_LOGIN_ID";
	public static final String FLD_EMAIL_ID = "EMAIL_ID";
	public static final String FLD_MOBILE_NO = "MOBILE_NO";
	public static final String FLD_INVALID_ATTEMPTS = "INVALID_ATTEMPTS";
	public static final String FLD_OD_UDF16 = "OD_UDF16";
	public static final String FLD_OD_UDF1 = "OD_UDF1";
	public static final String SEVERITY = "SEVERITY";
	public static final String MEDIUM = "Medium";
	public static final String NUMBER_OF_ALERTS = "NUM_ALERTS";
	public static final String HIGH = "High";
	public static final String RESOURCE_BUNDLE_ERROR = "error";
	public static final String DAM_KEY_REGISTER_GET_USER_STATUS = "GET_USER_STATUS";
	public static final String DAM_KEY_REGISTER_GET_TBL = "REGISTER_NICKNAME";
	public static final String DAM_KEY_REGISTER_MIGRATED = "STATUS_MIGRATED_USER";
	public static final String ENABLE_MIGRATE_USER = "N";
	public static final String FLD_OD_UDF15 = "OD_UDF15";
	public static final String DAM_OPER_GET_UDF15 = "OD_USERS_MB_UDF15";
	public static final String DAM_KEY_DIRECT_REGISTER_CHECK_USER_EXISTENCE = "DIRECT_REGISTER_CHECK_USER_EXISTENCE";
	public static final String INVLDSESSN = "INVLDSESSN";

	public static final String CHANGE_PASSWORD = "CHANGE_PASSWORD";
	public static final String OTHER_USER = "OTHER_USER";
	public static final String CHPWD_USER_NO = "USER_NO";
	public static final String CHANGE_PWD = "CHPD";
	public static final String CHG_PASSWORD = "CHG_PASSWORD";
	public static final String CHECK = "CHECK";
	public static final String LOGINFAIL = "LOGINFAIL";
	public static final String LOGINPWDFAIL = "LOGINPWDFAIL";
	public static final String USER_SESSION = "USER_SESSION";
	public static final String SESSION_TICKET = "SESSION_TICKET";
	public static final String ADD_OD_SESSION_LOG_HB = "ADD_OD_SESSION_LOG_HB";
	public static final String OD_SESSION_LOG = "OD_SESSION_LOG";
	public static final String CT_USER_NO = "CT_USER_NO";
	public static final String CT_JSESSION_ID = "CT_JSESSION_ID";
	public static final String ADD_OD_SESSION_LOG = "ADD_OD_SESSION_LOG";
	public static final Object CT_LOGIN_STATUS = "CT_LOGIN_STATUS";
	public static final String ACTION_TIME = "ACTION_TIME";
	public static final String ACTIVE_TOKEN = "ACTIVE_TOKEN";
	public static final String GET_USER_PREF = "GET_USER_PREF";
	public static final String UPDATE_PREFERENCE = "UPDATE_PREFERENCE";
}
