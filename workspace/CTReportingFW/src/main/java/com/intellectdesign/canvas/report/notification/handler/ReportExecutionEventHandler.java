/**
    COPYRIGHT NOTICE

    Copyright 2012 Polaris Software Lab Limited. All rights reserved.

    These materials are confidential and proprietary to 
    Polaris Software Lab Limited and no part of these materials should
    be reproduced, published, transmitted or distributed in any form or
    by any means, electronic, mechanical, photocopying, recording or 
    otherwise, or stored in any information storage or retrieval system
    of any nature nor should the materials be disclosed to third parties
    or used in any other manner for which this is not authorized, without
    the prior express written authorization of Polaris Software Lab Limited.
 */
package com.intellectdesign.canvas.report.notification.handler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.alert.handler.AlertConstants;
import com.intellectdesign.canvas.alert.handler.AlertDetail;
import com.intellectdesign.canvas.alert.handler.AlertHandlerException;
import com.intellectdesign.canvas.alert.handler.IChannelHandler;
import com.intellectdesign.canvas.entitlement.EntitlementEngineException;
import com.intellectdesign.canvas.entitlement.EntitlementEngineFactory;
import com.intellectdesign.canvas.entitlement.IEntitlementEngine;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.event.EventHandlerFrameworkConstants;
import com.intellectdesign.canvas.event.handler.EventHandler;
import com.intellectdesign.canvas.event.handler.HandlerException;
import com.intellectdesign.canvas.event.handler.IData;
import com.intellectdesign.canvas.logger.Logger;

/**
 * The ReportExecutionEventHandler will send the notification to the configured users after the execution of the report
 * creation. This event handler is configured against the event REPORT_EXECUTION. The notification will contain the
 * status of the report execution.
 * 
 */
public class ReportExecutionEventHandler extends EventHandler
{
	/**
	 * This method constructs the ReportNotificationData from the mapData for the event and return the same.
	 * */
	/*
	 * (non-Javadoc)
	 * 
	 * @see com.polaris.od.shared.event.handler.EventHandler#formatEventData(com.polaris.od.shared.event.Event,
	 * java.util.HashMap)
	 */
	protected IData formatEventData(Event event, Map mapData) throws HandlerException
	{
		/**
		 * Step 1: Constructing the reportNotificationData.
		 * */
		ReportNotificationData reportNotificationData = new ReportNotificationData();
		reportNotificationData.setDataMap(mapData);

		return reportNotificationData;
	}

	/**
	 * This method handles the Event in Async manner.
	 * 
	 */
	/*
	 * (non-Javadoc)
	 * 
	 * @see com.polaris.od.shared.event.handler.EventHandler#handleASynchEvent(com.polaris.od.shared.event.Event,
	 * com.polaris.od.shared.event.handler.IData)
	 */
	protected void handleASynchEvent(Event event, IData eventData) throws HandlerException
	{
		/**
		 * As of now, the report execution handler is not supporting the AsyncEvent for notification.
		 * 
		 */
		throw new UnsupportedOperationException();
	}

	/**
	 * This method handles the event in sync manner. It gets the entitlement engine for the entlType (REPORT_EXECUTION)
	 * and the get the entitled users for the report execution. It gets the alert handlers for the report and send the
	 * notification to the entitled users about the status(SUCCESS/FAILURE) of the report execution.
	 * */
	/*
	 * (non-Javadoc)
	 * 
	 * @see com.polaris.od.shared.event.handler.EventHandler#handleSynchEvent(com.polaris.od.shared.event.Event,
	 * com.polaris.od.shared.event.handler.IData)
	 */
	protected void handleSynchEvent(Event event, IData eventData) throws HandlerException
	{
		/**
		 * Step 1: Get the ReportNotificationData.
		 * */
		ReportNotificationData reportNotificationData = (ReportNotificationData) eventData;

		/**
		 * Step 2: Fetch the instance of entitlment engine factory.
		 * */
		EntitlementEngineFactory entlEngineFactory = EntitlementEngineFactory.getInstance();
		IEntitlementEngine entlEngine = null;
		try
		{
			/**
			 * Step 3: Getting the data map from the reportNotificationData.
			 * */
			HashMap dataMap = (HashMap) reportNotificationData.getDataMap();

			/**
			 * Step 4: Fetch the appropriate entitlement engine for the entl type (REPORT_EXECUTION)
			 * */
			entlEngine = entlEngineFactory.getEntitlementEngine(REPORT_EXECUTION_ENTL_TYPE);
			if (entlEngine != null)
			{
				/**
				 * Step 5: Fetching the entitled users for the event.
				 * */
				List entitledUsers = entlEngine.getEntitledUsers(event, dataMap);

				/**
				 * Step 6: Adding the entitled users to the dataMap with the key AlertConstants.RECIPIENTS_KEY
				 * */
				if (entitledUsers == null || entitledUsers.isEmpty())
				{
					String reportCreator = (String) dataMap.get(EventHandlerFrameworkConstants.FLD_USER_NO);
					entitledUsers = new ArrayList();
					entitledUsers.add(reportCreator);
					dataMap.put(AlertConstants.RECIPIENTS_KEY, entitledUsers);
				} else
				{
					dataMap.put(AlertConstants.RECIPIENTS_KEY, entitledUsers);
				}

				/**
				 * Step 7: Fetching the selected notification channels.
				 * */

				List<Map> notificationList = (List) dataMap.get(NOTIFICATION_LIST);

				/**
				 * Step 8: Iterating the notificationList to send the message.
				 * */

				ReportNotificationChannelHandlerFactory reportNotificationChannelHandlerFactory = ReportNotificationChannelHandlerFactory
						.getInstance();
				List<String> failedNotifiers = new ArrayList();
				for (Map notifier : notificationList)
				{
					/**
					 * Step 9: Fetching the appropriate channel handler.
					 * */
					IChannelHandler channelHandler = reportNotificationChannelHandlerFactory
					.getNotificationChannelHandler( (String)notifier.get(CHENNEL_HANDLER));
					if (channelHandler != null)
					{
						/**
						 * Step 10: Constructing the Alert Detail object to pass sendMessage method.
						 * */
						AlertDetail alertDetail = new AlertDetail();
						alertDetail.setAlertId(REPORT_EXECUTION_NOTIFY_ALERT_ID);

						/**
						 * Step 11: Send message through the channel.
						 * */
						
						try
						{
							channelHandler.sendMessage(event, alertDetail, dataMap);
						} catch (AlertHandlerException e)
						{
							failedNotifiers.add(alertDetail.getAlertId());
							logger.cterror("CTREP00623", alertDetail.getAlertId());
						}
						
					}
				}
				if (!failedNotifiers.isEmpty()){
					logger.ctdebug("CTREP00624");
					for (String notifierName: failedNotifiers){
						logger.ctdebug("CTREP00625",notifierName);	
					}
					throw new HandlerException(REP_FW_ERR_PUBLISHERS, "Some of the Notifiers failed. See the serverlog for more details.");
				}
			}

		} catch (EntitlementEngineException e)
		{
			logger.cterror("CTREP00626");
			throw new HandlerException(e.getErrorCode(), e.getErrorMessage());
		}
	}
	private static final String REPORT_EXECUTION_NOTIFY_ALERT_ID="220007";
	private static final String NOTIFICATION_LIST="NOTIFICATION_LIST";
	private static final String CHENNEL_HANDLER="ChannelHandler";
	private static final String REPORT_EXECUTION_ENTL_TYPE="RPT_EXEC";
	private static final String REP_FW_ERR_PUBLISHERS="REP_FW_ERR_PUBLISHERS";
	private static Logger logger = Logger.getLogger(ReportExecutionEventHandler.class);
}
