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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This is a helper facade provided for the end applications to utilize / read the alert using various parameters. 
 * 
 *  
 * @version 1.0
 */
public class AlertHelper
{
	/**
	 * This is the cache key for the alert details cache (application level cache)
	 */
	public static final String CACHE_KEY_ALERT_DETAILS = "ALERT_EVENT_DETAILS";

	/**
	 * This method identifies all the events for an alert id.
	 * 
	 * @param alertId String value of the Alert Id 
	 * 
	 * @return Event Event object that contains all the events for the given alert.
	 */
	public Event getEventForAlertId(String alertId)
	{

		logger.ctdebug("CTALT00035", alertId);
		Event anEvent = null;
		Long eventId = null;

		List allAlerts = CacheManager.getInstance().getDataFromCache(null, CACHE_KEY_ALERT_DETAILS);

		logger.ctdebug("CTALT00036", allAlerts);
		if (allAlerts != null)
		{
			HashMap alertData;
			String anAlertId;
			int numAlerts = allAlerts.size();
			for (int count = 0; count < numAlerts; count++)
			{
				alertData = (HashMap) allAlerts.get(count);
				anAlertId = (String) alertData.get(AlertConstants.ALERT_ID);
				if (anAlertId.equals(alertId))
				{
					// We have got the match.
					eventId = (Long) alertData.get(AlertConstants.ALERT_EVENT_ID);
					break;
				}
			}
		}

		// If the event id has been identified, try to convert that into an event object
		if (eventId != null)
		{
			anEvent = Event.getEventFor(eventId);
		}

		return anEvent;
	}

	/**
	 * This is a helper method that identifies whether any additional data needs to be enriched onto the alert data map for
	 * the given event.
	 * 
	 * @param alertDataMap HashMap of alert data
	 * @param event Event object for the alert object needs to be enriched 
	 * @param alertConfig AlertDetail object that contains the Alert configuration such as Alert Id, Description, Severity, Datasource and Entitlement Type
	 * 
	 * @throws AlertHandlerException Exception if any error occurs while processing the request
	 */
	public void enrichAlertDataFor(Map alertDataMap, Event event, AlertDetail alertConfig)
			throws AlertHandlerException
	{
		IAlertDataSource dataSource = getDataSource(alertConfig);
		dataSource.enrichAlertData(event, alertConfig, alertDataMap);
	}

	/**
	 * This method returns the list of entitled users for an event alert.
	 * 
	 * @param event Event object that contains the entitled product , subproduct, function and action
	 * @param alertDetail AlertDetail object that contains the alert details such as alert id, entitlement type applicable and alert severity 
	 * @param hmMsgData hashmap containing account details.
	 * 
	 * @return listofEntitledUsers list of entitled users for event raised.
	 * @exception AlertHandlerException
	 */
	public ArrayList<String> getEntitledUsers(Event event, AlertDetail alertDetail, Map hmMsgData)
			throws AlertHandlerException
	{
		logger.ctinfo("CTALT00974", "EventAlertHandler.getEntitledUsers method");
		// Step 2. Based on the source, fetch the additional information and add it to the data map.
		IAlertDataSource alertDS = getDataSource(alertDetail);
		return (ArrayList<String>) alertDS.getAllTargetRecipients(event, alertDetail, hmMsgData);
	}

	/**
	 * This is a helper method that returns the datasource for getting data for the alert. If one is not configured, it
	 * uses the DefaultAlertDataSource
	 * 
	 * @param alertConfig The alert configuration
	 * 
	 * @return alertDS Datasource object for the alert passed
	 * 
	 * @throws AlertHandlerException Exception object when any error occurs while creating the data source
	 */
	private IAlertDataSource getDataSource(AlertDetail alertConfig) throws AlertHandlerException
	{
		IAlertDataSource alertDS = null;
		String dataSource = alertConfig.getDataSource();
		if (dataSource == null || dataSource.trim().length() == 0)
		{
			alertDS = new DefaultAlertDataSource();
		} else
		{
			// Try to instantiate the class.
			try
			{
				Class aClass = Class.forName(dataSource);
				alertDS = (IAlertDataSource) aClass.newInstance();
			} catch (ClassNotFoundException e)
			{
				logger.cterror("CTALT00975", e, dataSource, alertConfig.getAlertId());
				throw new AlertHandlerException("Unable to create data source class for Alert '"
						+ alertConfig.getAlertId() + "'", e);
			} catch (InstantiationException e)
			{
				logger.cterror("CTALT00976", e, dataSource, alertConfig.getAlertId());
				throw new AlertHandlerException("Unable to instantiate data source class for Alert '"
						+ alertConfig.getAlertId() + "'", e);
			} catch (IllegalAccessException e)
			{
				logger.cterror("CTALT00977", e, dataSource, alertConfig.getAlertId());
				throw new AlertHandlerException("Unable to access data source class for Alert '"
						+ alertConfig.getAlertId() + "'", e);
			}
		}
		return alertDS;
	}

	private static Logger logger = Logger.getLogger(AlertHelper.class);
}
