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

package com.intellectdesign.canvas.alert.handler;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.entitlement.EntitlementEngineException;
import com.intellectdesign.canvas.entitlement.EntitlementEngineFactory;
import com.intellectdesign.canvas.entitlement.IEntitlementEngine;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This class contains the default Alert data source that will be used by the alert framework for all alerts that do not
 * have any explicit data source attached.
 * 
 * @version 1.0
 */
public class DefaultAlertDataSource implements IAlertDataSource
{
	/**
	 * The list of recipients is identified in a hierachical manner as follows
	 * 
	 * a) First a check is made to see if there is an entitlement engine configured. If yes, then the same is used.
	 * 
	 * b) If this is not configured, then it checks for a key "RECIPIENTS" in the eventData. If this is present, then
	 * the same is used.
	 * 
	 * c) If both are not available, then it returns null.
	 * 
	 * @see com.intellectdesign.od.shared.event.handler.alert.IAlertDataSource#getAllTargetRecipients(com.intellectdesign.od.shared.event.Event,
	 *      com.intellectdesign.od.shared.event.handler.alert.AlertDetail, java.util.Map)
	 * 
	 * @param anEvent Event Object
	 * @param alertConfig AlertDetail object that contains the datasource of the alert
	 * @param eventData HashMap of the event data
	 * 
	 * @return listofEntitledUsers List object of the entitled users who subscribed to the alert
	 * 
	 * @exception AlertHandlerException
	 */
	public List<String> getAllTargetRecipients(Event anEvent, AlertDetail alertConfig, Map eventData)
			throws AlertHandlerException
	{
		LOGGER.ctinfo("CTALT00969", anEvent.getEventId(), alertConfig.getAlertId());
		ArrayList listofEntitledUsers = null;
		String entlType = null;
		// Step 1: Try the Entitlement Engine mode...
		entlType = alertConfig.getEntitlementType();
		LOGGER.ctdebug("CTALT00970", alertConfig.getAlertId(), entlType);
		if (entlType != null && entlType.trim().length() != 0)
		{
			try
			{
				EntitlementEngineFactory entitlementFactory = EntitlementEngineFactory.getInstance();
				IEntitlementEngine entitlementEngine = entitlementFactory.getEntitlementEngine(entlType);
				listofEntitledUsers = entitlementEngine.getEntitledUsers(anEvent, eventData);
			} catch (EntitlementEngineException ex)
			{
				LOGGER.cterror("CTALT00971", ex, entlType);
				throw new AlertHandlerException("Error while retrieving list of users from Entitlement Engine", ex);
			}
		} else
		{
			listofEntitledUsers = (ArrayList) eventData.get(AlertConstants.RECIPIENTS_KEY);
		}
		LOGGER.ctdebug("CTALT00972", alertConfig.getAlertId(), listofEntitledUsers);
		LOGGER.ctinfo("CTALT00973", "DefaultAlertDataSource.getAllTargetRecipients");
		return listofEntitledUsers;
	}

	/**
	 * This method is implemented from the interface IAlertDataSource, this holds the bussiness logic code which can be
	 * overwridern for specific usages.
	 * 
	 * This method will be invoked by the Alert framework to provide an option for the data source to format the alert
	 * data with custom attributes
	 * 
	 * @see com.intellectdesign.od.shared.event.handler.alert.IAlertDataSource#enrichAlertData(com.intellectdesign.od.shared.event.Event,
	 *      com.intellectdesign.od.shared.event.handler.alert.AlertDetail, java.util.Map)
	 * @param anEvent
	 * @param alertConfig
	 * @param eventData
	 * @exception AlertHandlerException
	 */
	public void enrichAlertData(Event anEvent, AlertDetail alertConfig, Map eventData)
			throws AlertHandlerException
	{
		// The Implementation class will implement this logic
	}

	// The Logger instance for this class.
	private static Logger LOGGER = Logger.getLogger(DefaultAlertDataSource.class);
}
