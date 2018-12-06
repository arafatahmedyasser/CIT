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
package com.intellectdesign.canvas.preferences;

/**
 * This class is for PreferenceConstants
 * 
 * @version 1.0
 */
public final class PreferenceConstants
{
	/**
	 * Making the constructor private to avoid creation of objects of this class Private cnstructor to avoid
	 * instantiation.
	 */
	private PreferenceConstants()
	{
	}

	// The cache key in which all the configured preference data is loaded and kept ready for usage
	public static final String CACHE_KEY_ALL_PREF_DATA = "ALL_PREF_DATA";

	// The various data source types for Preference
	// Source type - DB Query
	public static final String PREF_SOURCE_QUERY = "Q";
	// Source type - Application API
	public static final String PREF_SOURCE_API = "A";

	// Default operation extension used for all DB operations within the framework
	public static final String DB_OPERATION_EXTENSION = "PREF_FRMK";

	// The DAM key used for fetching the list of all registered Preference criteria definitions
	public static final String DAM_KEY_GET_ALL_SYSTEM_PREFERENCE_DEFINITIONS = "GET_ALL_SYSTEM_PREFERENCE_DEFINITIONS";

	// The fields used for the User Preferences fetch.
	public static final String SYS_PREF_FLD_ATTRIBUTE_TYPE = "ATTRIBUTE_TYPE";
	public static final String SYS_PREF_FLD_ATTRIBUTE_DESC = "ATTRIBUTE_DESC";
	public static final String SYS_PREF_FLD_SOURCE_VALUE = "SOURCE_VALUE";
	public static final String SYS_PREF_FLD_SOURCE_TYPE = "SOURCE_TYPE";
	public static final String SYS_PREF_FLD_VISIBLE_IND = "VISIBLE_IND";

	// The DAM Key used for fetching the list of user's preference criteria definitions
	public static final String DAM_KEY_GET_ALL_USER_PREFERENCES = "GET_ALL_USER_PREFERENCES";

	// The fields used for the User Preferences fetch.
	public static final String USER_PREF_FLD_ATTRIBUTE_TYPE = "ATTRIBUTE_TYPE";
	public static final String USER_PREF_FLD_ATTRIBUTE_VALUE = "ATTRIBUTE_VALUE";
	public static final String USER_PREF_FLD_USER_NUMBER = "USER_NO";
	public static final String USER_PREF_FLD_GCIF = "GCIF";
	public static final String USER_PREF_FLD_PREF_TYPE = "PREF_TYPE";

	public static final String USER_PREF_USER_ROLE = "USER_ROLE";
	public static final String USER_PREF_WORKSPACE = "WORKSPACE";
	
	// The DAM Key used for fetching the list of all Corporate Preferences
	public static final String DAM_KEY_GET_ALL_CORP_PREFERENCES = "GET_ALL_CORP_PREFERENCES";

	// The fields used for the Corporate preferences fetch
	public static final String CORP_PREF_FLD_ATTRIBUTE_TYPE = "ATTRIBUTE_TYPE";
	public static final String CORP_PREF_FLD_ATTRIBUTE_VALUE = "ATTRIBUTE_VALUE";
	public static final String CORP_PREF_FLD_USER_NUMBER = "USER_NO";
	public static final String CORP_PREF_FLD_GCIF = "GCIF";
	public static final String CORP_PREF_FLD_PREF_TYPE = "PREF_TYPE";

	// The DAM key used for fetching the data for a particular preference criteria if it were configured as a query
	public static final String DAM_KEY_GET_A_PREFERENCE_DATA = "GET_A_PREFERENCE_DATA";

	// The fields used for the Preference data fetch.
	public static final String PREF_DATA_FLD_QUERY = "PREF_QUERY";
	public static final String PREF_DATA_FLD_ATTRIBUTE_TYPE = "ATTRIBUTE_TYPE";
	public static final String PREF_DATA_FLD_ATTRIBUTE_VALUE = "ATTRIBUTE_VALUE";

	public static final String PREF_DATA_FLD_USER_NO = "USER_NO";
	public static final String DB_OPERATION_EXTENSION_ROLES_BY_USER = "ROLES_BY_USER";
	public static final String DELETE_USER_PREFERENCES = "DELETE_USER_PREFERENCES";
	public static final String INSERT_USER_PREFERENCES = "INSERT_USER_PREFERENCES";

}
