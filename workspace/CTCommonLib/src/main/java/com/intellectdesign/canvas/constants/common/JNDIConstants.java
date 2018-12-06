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

/**
 * This class contains the JNDi constants
 * 
 * @version 1.0
 */
public class JNDIConstants
{
	/**
	 * Private Constrctor
	 */
	private JNDIConstants()
	{
		/**
		 * Private cnstructor to avoid instantiation.
		 */
	}

	public static String PROVIDER_URL = "PROVIDER_URL";
	public static String CONTEXT_FACTORY = "JNDI_FACTORY";

	public static String ACCOUNT_GROUP_BEAN = "RIAccountGroupControllerBean";
	public static String CORP_USER_BEAN = "RICorpUserControllerBean";
	public static String UG_PROFILE_BEAN = "RIUserGroupProfileControllerBean";

	public static String ROLESBEAN = "RIRolesControllerBean";
	public static String PWDBEAN = "RIPinControllerBean";

	public static String SEARCH_BEAN = "RISearchControllerBean";
	public static String RULES_BEAN = "RIRulesControllerBean";
	public static String USER_GRP_BEAN = "RIUserGrpControllerBean";

	public static String USERPROFILEBEAN = "RICorpUserProfileControllerBean";

	public static String CRITERIA_MAINTAIN_BEAN = "RICriteriaMaintainControllerBean";

	public static String AUDIT_LOG_BEAN = "RIAuditLogControllerBean";
	public static String REPORT_SUBSCRIBE_BEAN = "RIReportSubscriptionControllerBean";
	public static String PWD_MANAGER_BEAN = "RIPwdControllerBean";
}
