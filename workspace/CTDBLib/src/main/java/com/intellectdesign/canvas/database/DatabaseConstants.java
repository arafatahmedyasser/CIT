/***************************************************************
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved.  
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 *****************************************************************/

package com.intellectdesign.canvas.database;

/**
 * DatabaseConstants interface is a collection of all the constants required by the persistent layer
 * 
 * @version 1.0
 */
public interface DatabaseConstants
{

	// Constants for Access through
	String ACCESS_VIA_IBATIS = "IBATIS";

	// Operation to be performed
	public static final int SELECT = 1;

	public static final int INSERT = 2;

	public static final int UPDATE = 3;

	public static final int DELETE = 4;

	public static final int INSERT_SELECT = 5;

	public static final int BATCH_INSERT = 6;

	public static final int BATCH_UPDATE = 7;

	public static final int EXECUTE_SP_NO_RETURN_NO_OUT = 8;
	public static final int EXECUTE_SP_NO_RETURN_ONLY_OUT = 9;
	public static final int EXECUTE_SP_ONLY_RETURN_NO_OUT = 10;
	public static final int EXECUTE_SP_RETURN_AND_OUT = 11;
	public static final int EXECUTE_SP_NO_RETURN_ONLY_OUT_WITHOUT_AUTO_COMMIT = 12;

	// Default DATASOURCE key
	public static final String DEFAULT_DATASOURCE = "DEFAULT_DATASOURCE";
	// for pagination
	public static final String START_ROW_NO = "START_ROW_NO";
	public static final String END_ROW_NO = "END_ROW_NO";

	// This key is used specifically to used in Oracle Functions that return data
	// The same key has to be used in the corresponding sql map file as well
	public static final String DEFAULT_STOREDPROC_RETURN_KEY = "__STOREDPROC_RETURN_DATA";

	// This Default value is the one that initially check the connection to database if no DALNAME is set by the client
	public static final String DEFAULT_DATA_ACCECC_MAP_KEY = "DEFAULT";

	public static final String SORTING_MODEL = "SORTING_MODEL";

	public static final String PAGINATION_MODEL = "PAGINATION_MODEL";
	public static final String USER_TXN_NAME = "USER_TXN_NAME";
	public static final String REMOTE_TXN_NAME = "REMOTE_TXN_NAME";

}