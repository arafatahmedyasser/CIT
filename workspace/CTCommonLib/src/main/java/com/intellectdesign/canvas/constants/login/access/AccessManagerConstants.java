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

/**
 * 
 */
package com.intellectdesign.canvas.constants.login.access;

/**
 * This class contains the Access Manager Constants
 * 
 * @version 1.0
 */
/**
 * The constants used within the access manager.
 */
public interface AccessManagerConstants
{
	/**
	 * Private cnstructor to avoid instantiation. ref to AccessManagerConstants DBKey,Field,Module
	 */
	String DB_DAM_KEY_TXN_PROC_FRMWK = "TXN_PROC_FRMWK";
	String DB_EXT_KEY_PERM_INSERT = "PERM_INSERT";
	String DB_EXT_KEY_PERM_SELECT = "PERM_SELECT";
	String DB_EXT_KEY_PERM_DELETE = "ACCESS_PERM_USER";

	String FLD_OD_SESSION_ID = "OD_SESSION_ID";
	String FLD_OD_GCIF = "OD_GCIF";
	String FLD_OD_USER_NO = "OD_USER_NO";
	String FLD_OD_MODULE = "OD_MODULE";
	String FLD_OD_REF_NO = "OD_REF_NO";
	String FLD_OD_SUBPROD_CODE = "OD_SUBPROD_CODE";
	String FLD_OD_FUNCTION_CODE = "OD_FUNCTION_CODE";
	String FLD_ACTION = "ACTION";
	String FLD_RET_EXISTS = "PRESENT";

	String FLG_LOCKED = "Y";
	String FLG_UNLOCKED = "N";

	// Added the set of constants to represent the action that the user is trying to do
	String MODULE_EDIT = "Edit";
	String MODULE_DELETE = "Delete";
	String MODULE_VIEW = "View";
	String MODULE_BATCH = "Batch";
	String MODULE_AUTHORIZE = "Auth";
	String MODULE_AUDIT = "Audit";
	String MODULE_STOP = "Stop";
	String MODULE_CANCEL = "Cancel";
	String MODULE_TEMPLATE = "Template";

	String TXN_LOCK_REL_DAM_KEY = "TXN_LOCK_REL_MNT";
	String RELEASE_LOCK = "RELEASE_LOCK";
	String OD_REF_NO = "OD_REF_NO";
	String RELEASE_TXNS_LOCKED_BY_USER = "RELEASE_TXNS_LOCKED_BY_USER";
	String USER_NO = "USER_NO";
}
