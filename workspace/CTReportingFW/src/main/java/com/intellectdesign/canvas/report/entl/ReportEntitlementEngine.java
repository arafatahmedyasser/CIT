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
package com.intellectdesign.canvas.report.entl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.intellectdesign.canvas.entitlement.EntitlementEngineException;
import com.intellectdesign.canvas.entitlement.IEntitlementEngine;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.util.ReportConstants;

/**
 * This class represents the entitlement engine for the Entitlement type REPORT_EXECUTION.
 * 
 * @version 1.0
 */

public class ReportEntitlementEngine implements IEntitlementEngine
{
	/***
	 * This api intends to fetch the list of all the user who are entitled for the given Event against an entitlement
	 * criteria data. The criteria data can be user no or any other parameters as per the implementation specific.
	 * 
	 * @param event: The event associated, which is the source for the product, sub product and the function code to be
	 *            passed.
	 * @param dataMap : The actual data to be check against the entitlement.
	 * @return ArrayList of Entitled users id of the type String.
	 * @throws EntitlementEngineException for any exception caught.
	 */
	public ArrayList<String> getEntitledUsers(Event event, Map dataMap) throws EntitlementEngineException
	{
		logger.ctdebug("CTREP00127", event, dataMap);

		/**
		 * As of now, the group/users future is not implemented. The report creator is the default user to entitle to
		 * the event.
		 * */
		String userId = null;
		ArrayList<String> listofUsers = new ArrayList<String>();
		if (dataMap != null)
		{
			userId = (String) dataMap.get(ReportConstants.USER_NO);
		}
		if (userId != null && userId.trim().length() > 0)
		{
			listofUsers.add(userId);
		}

		logger.ctdebug("CTREP00128", listofUsers);

		return listofUsers;
	}

	/***
	 * This api intends to check whether a user is entitled for the Event against the entitlement crtiteria specified in
	 * the parameter HashMap Data.
	 * 
	 * @param event : the event that is associated with the action. This will provide the product, sub product and the
	 *            function code.
	 * @param sUserNo : the user number of the user.
	 * @param Data : the data for which the entilement is to be checked for the user.
	 * @return boolean : whether user is entitled or not.
	 * @throws EntitlementEngineException for any exception caught.
	 */
	public boolean isUserEntitled(Event event, String sUserNo, HashMap Data) throws EntitlementEngineException
	{
		/**
		 * This method is not supported for the entitlement type REPORT_EXECUTION.
		 * */
		throw new UnsupportedOperationException();
	}

	/***
	 * API to get the entitlement Criteria for the combination of the parameters passed.
	 * 
	 * @param userNo : the user number of the user.
	 * @param gcif : the gcif number of the user.
	 * @param sProduct : the product code associated.
	 * @param sSubProduct : the sub product code associated.
	 * @param sFunction : the function code associated.
	 * @return ArrayList of entitlement criteria.
	 * @throws EntitlementEngineException for any exception caught.
	 */
	public ArrayList<String> getEntitlementCriteria(String userNo, String gcif, String sProduct, String sSubProduct,
			String sFunction) throws EntitlementEngineException
	{
		/**
		 * This method is not supported for the entitlement type REPORT_EXECUTION.
		 * */
		throw new UnsupportedOperationException();
	}

	/**
	 * API to get the entitlement Criteria for the combination of the parameters passed.
	 * 
	 * @param userNo : the user number of the user.
	 * @param gcif : the gcif number of the user.
	 * @param sProduct : the product code associated.
	 * @param sSubProduct : the sub product code associated.
	 * @return ArrayList of entitlement criteria.
	 */
	public ArrayList<String> getEntitlementCriteria(String userNo, String gcif, String sProduct, String sSubProduct)
			throws EntitlementEngineException
	{
		/**
		 * This method is not supported for the entitlement type REPORT_EXECUTION.
		 * */
		throw new UnsupportedOperationException();
	}

	/***
	 * API to get the entitlement Criteria for the combination of the parameters passed.
	 * 
	 * @param userNo : the user number of the user.
	 * @param gcif : the gcif number of the user.
	 * @param sProduct the product code associated.
	 * @return ArrayList of entitlement criteria.
	 */
	public ArrayList<String> getEntitlementCriteria(String userNo, String gcif, String sProduct)
			throws EntitlementEngineException
	{
		/**
		 * This method is not supported for the entitlement type REPORT_EXECUTION.
		 * */
		throw new UnsupportedOperationException();
	}

	/***
	 * API to get the entitlement Criteria for the combination of the parameters passed.
	 * 
	 * @param userNo the user number of the user.
	 * @param gcif the gcif number of the user/
	 * @param event the event associated.
	 * @return ArrayList of entitlement criteria.
	 */
	public ArrayList<String> getEntitlementCriteria(String userNo, String gcif, Event event)
			throws EntitlementEngineException
	{
		/**
		 * This method is not supported for the entitlement type REPORT_EXECUTION.
		 * */
		throw new UnsupportedOperationException();
	}

	/**
	 * Logger for this class
	 * */
	private static Logger logger = Logger.getLogger(ReportEntitlementEngine.class);
}
