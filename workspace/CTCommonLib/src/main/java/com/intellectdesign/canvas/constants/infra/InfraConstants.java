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

package com.intellectdesign.canvas.constants.infra;

/**
 * This class contains the infra constants
 * 
 * @version 1.0
 */

public class InfraConstants
{
	/**
	 * Private Constructor for avoiding instantiation.
	 */
	private InfraConstants()
	{
	}

	public static final String WD_DATE_FORMAT = "dd/MM/yyyy";

	public static final String WT_STATUS = "WT_STATUS";
	public static final String WT_STAT_IDLE = "IDLE";
	public static final String WT_STAT_ASSIGNED = "ASSIGNED";
	public static final String WT_STAT_RUNNING = "RUNNING";
	public static final String WT_STAT_HANGED = "HANGED";
	public static final String WT_STAT_DEAD = "DEAD";

	public static final String WT_WORKER_THREAD_OBJ = "WORKER_THREAD_OBJ";
	public static final String WT_THREAD_NAME = "THREAD_NAME";
	public static final String WT_THREAD_OBJ = "THREAD_OBJ";

	public static final String APPID_DATA_TABLE_NAME = "TRN_CIB_APPID_DATA";
	public static final String ERROR_TABLE_NAME = "TRN_CIB_ERR_STAGING";
	public static final int ERROR_MAX_RETRY_CNT = 10;

	public static final int MAXBUFFER = 4000;

	public static final String LIST_SEPERATOR = "#";

	public static final int DEFAULT_POLL_INTERVAL = 10000;
	public static final int DEFAULT_RECORDS_TO_POLL = 100;
	public static final int DEFAULT_RECORDS_BUFFER_SIZE = 100;

	public static final int SUCCESS = 0;
	public static final int FAILURE = -1;

	public static final String WD_MSGID = "MSGID";
	public static final String WD_APPID = "APPID";
	public static final String WD_STATUS = "STATUS";
	public static final String WD_DOI = "DOI";
	public static final String WD_DOM = "DOM";
	public static final String WD_MSGHDR = "MSG_HDR";
	public static final String WD_MSGDATA = "MSG_DATA";
	public static final String WD_ERR_CODE = "ERR_CODE";
	public static final String WD_ERR_MSG = "ERR_MSG";
	public static final String WD_RETRY_CNT = "RETRY_CNT";

	public static final String APP_HANDLER_MAP_TABLE = "APP_HANDLER_MAP_TABLE";
	public static final String APPID = "APPID";
	public static final String PAYLOAD_DATA = "PAYLOAD_DATA";
	public static final String HEADER_DATA = "HEADER_DATA";
	public static final String HNDLR_CLS_NAME = "HNDLR_CLS_NAME";
	public static final String ERR_HNDLR_CLS_NAME = "ERR_HNDLR_CLS_NAME";
	public static final String SRC_TBL_NAME = "SRC_TBL_NAME";

	public static final String DEST_TBL_NAME = "DEST_TBL_NAME";
	public static final String COMMUNICATOR_CLS_NAME = "COMMUNICATOR_CLS_NAME";
	public static final String FORMATTER_CLS_NAME = "FORMATTER_CLS_NAME";
	public static final String COMMUNICATION_TYPE = "COMMUNICATION_TYPE";
	public static final String COMMUNICATION_ASYNC = "A";
	public static final String COMMUNICATION_SYNC = "S";

	public static final String INTELLECT_PROCESSOR = "INTELLECT_PROCESSOR";
	public static final String PROD_HOME_CLS_NAME = "PROD_HOME_CLS_NAME";
	public static final String OI_HOME_CLS_NAME = "OI_HOME_CLS_NAME";
	public static final String ASYNC_HOME_CLS_NAME = "ASYNC_HOME_CLS_NAME";
	public static final String FAILOVER_MOVE_ASYNC = "FAILOVER_MOVE_ASYNC";

	public static final String PROD_EJBOBJ_CLS_NAME = "PROD_EJBOBJ_CLS_NAME";
	public static final String OI_EJBOBJ_CLS_NAME = "OI_EJBOBJ_CLS_NAME";
	public static final String ASYNC_EJBOBJ_CLS_NAME = "ASYNC_EJBOBJ_CLS_NAME";

	public static final String JNDI_NAME = "JNDIName";
	public static final String JNDI_PROVIDER = "JNDIProvider";
	public static final String JNDI_URL = "JNDIURL";

	public static final String DATASOURCE_NAME = "DATASOURCE_NAME";

	public static final String STATUS = "STATUS";
	public static final String MESSAGE_ID = "MESSAGE_ID";
	public static final String ERROR_CODE = "ERROR_CODE";
	public static final String ERROR_MSG = "ERROR_MSG";

	public static final String STATUS_NEW = "NEW";
	public static final String STATUS_INPROGRESS = "INPROGRESS";
	public static final String STATUS_COMPLETED = "COMPLETED";
	public static final String STATUS_FAILED = "FAILED";

	public static final String HAL_RETRY_ERROCODE = "HAL-1104";

	public static final String ASYNC_PROPERTY_FILE_NAME = "asyncjobprops.xml";
	public static final String ROOT_CATEGORY = "RootCategory";
	public static final String DBPOLLER = "DBPoller";
	public static final String MESSAGELOG = "MessageLog";
	public static final String MESSAGELOGIN = "Log-In";
	public static final String MESSAGELOGOUT = "Log-Out";
	public static final String CLASSNAME = "class";
	public static final String DISPATCHER = "Dispatcher";
	public static final String POLLING_INTERVAL = "ThreadSleepInterval";

	public static final String DBPOLLER_LIST = "DBPollerList";
	public static final String ATTRIBUTEVALUE = "value";
	public static final String TABLE_NAME = "TableName";
	public static final String RECORDS_TO_POLL = "RecordsToPoll";
	public static final String RECORDS_BUFFER_SIZE = "RecordsBuferSize";

	public static final String STATUS_LIST = "StatusList";
	public static final String APPID_LIST = "AppIDList";
	public static final String THREAD_MONITOR_REQD = "ThreadMonitorRequired";
	public static final String WORKER_THREAD_COUNT = "WorkerThreadCount";
	public static final String WORKER_THREAD_CLS_NAME = "WorkerThreadClass";
	public static final String WORKER_THREAD_POLLING_INTERVAL = "WorkerThreadSleepInterval";

	public static final String HAL_ERR_FORMATTER_CLS_VAL_NULL = "HAL-1000";
	public static final String HAL_ERR_FORMATTER_CLS_NOT_FOUND = "HAL-1001";
	public static final String HAL_ERR_FORMATTER_CLS_INSTANT = "HAL-1002";
	public static final String HAL_ERR_FORMATTER_CLS = "HAL-1003";

	public static final String HAL_ERR_INVALID_ASYNC_FLAG = "HAL-1004";

	public static final String HAL_ERR_NAMING_EXCEPTION = "HAL-1006";
	public static final String HAL_ERR_CANT_CREATE_BEAN = "HAL-1007";
	public static final String HAL_ERR_INVALID_APPID_CONF_INFO = "HAL-1008";
	public static final String HAL_ERR_INVALID_INTELLECT_PROC_VAL = "HAL-1009";

	public static final String HAL_ERR_INVALID_PROD_CLS_NAME = "HAL-1010";
	public static final String HAL_ERR_INVALID_PROD_EJBOBJ_CLS_NAME = "HAL-1011";
	public static final String HAL_ERR_INVALID_OI_CLS_NAME = "HAL-1012";
	public static final String HAL_ERR_INVALID_OI_EJBOBJ_CLS_NAME = "HAL-1013";
	public static final String HAL_ERR_INVALID_ASYNC_CLS_NAME = "HAL-1005";
	public static final String HAL_ERR_INVALID_ASYNC_EJBOBJ_CLS_NAME = "HAL-1014";
	public static final String HAL_ERR_INVALID_DATA_OBJ = "HAL-1015";

	public static final String HAL_ERR_INVALID_HAREQUEST = "HAL-1016";
	public static final String HAL_ERR_INVALID_HARESPONSE = "HAL-1017";
	public static final String HAL_ERR_INVALID_WORKDATA = "HAL-1018";
	public static final String HAL_ERR_HOST_NOT_REACHABLE = "HAL-1019";

	public static final String HAL_ERR_COMMUNICATOR_CLS_VAL_NULL = "HAL-1020";
	public static final String HAL_ERR_COMMUNICATOR_CLS_NOT_FOUND = "HAL-1021";
	public static final String HAL_ERR_COMMUNICATOR_CLS_INSTANT = "HAL-1022";
	public static final String HAL_ERR_COMMUNICATOR_CLS = "HAL-1023";

	public static final String HAL_ERR_UNKNOWN = "HAL-1100";
	public static final String ASYNC_UNKNOWN_ERROR = "ASY-2000";

	public static final String ASYNC_ERR_DBPOLLER_CLS_VAL_NULL = "ASY-2001";
	public static final String ASYNC_ERR_DBPOLLER_CLS_NOT_FOUND = "ASY-2002";
	public static final String ASYNC_ERR_DBPOLLER_CLS_INSTANT = "ASY-2003";
	public static final String ASYNC_ERR_DBPOLLER_CLS = "ASY-2004";

	public static final String ASYNC_ERR_HNDLR_CLS_VAL_NULL = "ASY-2005";
	public static final String ASYNC_ERR_HNDLR_CLS_NOT_FOUND = "ASY-2006";
	public static final String ASYNC_ERR_HNDLR_CLS_INSTANT = "ASY-2007";
	public static final String ASYNC_ERR_HNDLR_CLS = "ASY-2008";

	public static final String ASYNC_ERR_ERRHNDLR_CLS_VAL_NULL = "ASY-2009";
	public static final String ASYNC_ERR_ERRHNDLR_CLS_NOT_FOUND = "ASY-2010";
	public static final String ASYNC_ERR_ERRHNDLR_CLS_INSTANT = "ASY-2011";
	public static final String ASYNC_ERR_ERRHNDLR_CLS = "ASY-2012";

}
