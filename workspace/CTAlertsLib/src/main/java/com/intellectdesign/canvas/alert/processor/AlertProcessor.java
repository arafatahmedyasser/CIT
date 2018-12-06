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

package com.intellectdesign.canvas.alert.processor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.ResourceBundle;
import java.util.StringTokenizer;

import com.intellectdesign.canvas.alert.handler.AlertConstants;
import com.intellectdesign.canvas.alert.handler.AlertDetail;
import com.intellectdesign.canvas.alert.handler.AlertHandlerException;
import com.intellectdesign.canvas.alert.handler.ChannelHandlerFactory;
import com.intellectdesign.canvas.alert.handler.IChannelHandler;
import com.intellectdesign.canvas.alert.sms.SMSHelper;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.initalizer.Log4jMDCInitializer;

/**
 * This class is repsonsible for sending the alert messages to all the subscribed users through the subscribed channels
 * 
 * @version 1.0
 */
public class AlertProcessor
{
	private static Logger logger = Logger.getLogger(AlertProcessor.class);
	Event eventDetails = null;
	AlertDetail alertDetails = null;
	public static boolean paperDrop;

	public AlertProcessor(Event event, AlertDetail alertDetail)
	{
		eventDetails = event;
		alertDetails = alertDetail;
	}
	
	
	public AlertProcessor()
	{
		
	}

	/**
	 * The <code> run </code> method is the overridden method of the TimerTask Class. 
	 * This method invokes the {@link getDataToPost} method according to the scheduler time.
	 * 
	 */
	public void run()
	{
		Log4jMDCInitializer initializer = new Log4jMDCInitializer();
		initializer.initLog4jMDC("AsyncAuthProcessor", "SCHEDULER");
		getDataToPost();
		// processTransactions();
	}

	/**
	 * This method gets all the alert messages and sends them to the users 
	 * based on the details of the User Alert Subscription   
	 */

	public void getDataToPost()
	{
		ChannelHandlerFactory chaFact = new ChannelHandlerFactory();
		ArrayList alListData = null;
		HashMap alertData = new HashMap();
		Iterator chHandler = null;
		String userNo = null;
		String longmsg = null;
		IChannelHandler channelHandler = null;
		String alertId = null;
		String channelId = null;
		String nextToken = null;
		boolean userResult = false;
		HashMap data = new HashMap();
		try
		{
			String retryCount = getPropertyString(AlertConstants.RETRY_COUNT);
			alListData = (ArrayList) getAlertData(retryCount);
			for (int i = 0; i <= alListData.size(); i++)
			{
				alertData = (HashMap) alListData.get(i);
				userNo = (String) alertData.get("OD_USER_NO");
				longmsg = (String) alertData.get("OD_LONG_MSG");
				StringTokenizer SToken = new StringTokenizer(longmsg, "$$");
				while (SToken.hasMoreTokens())
				{
					nextToken = SToken.nextToken();
					if (nextToken.startsWith("ALERT_ID"))
					{
						alertId = nextToken.split("=")[1];
					} else if (nextToken.startsWith("CHANNEL_ID"))
					{
						channelId = nextToken.split("=")[1];
					}
				}

				userResult = doValidation(userNo);
				if (userResult == true)
				{
					data.put("TEMPLATE", alertData);

					chHandler = chaFact.getChannelHandlersForAlert(alertId);
					for (; chHandler.hasNext();)
					{
						channelHandler = (IChannelHandler) chHandler.next();
						String chID = channelHandler.getChannelId();
						if (channelId!=null && channelId.equals(chID))
						{

							channelHandler.postMessage(eventDetails, alertDetails, alertData);
						}
					}
				}
			}

		} catch (DatabaseException e)
		{
			logger.cterror("CTALT00959", e, "DatabaseException", "AlertProcessor");
		} catch (AlertHandlerException e)
		{
			logger.cterror("CTALT00959", e, "DatabaseException", "AlertProcessor");
		}

	}

	/**
	 * This method updates the status of the SMS delivery for an alert subscribed as SMS 
	 * 
	 * @param dataObject - Hashmap of the sms delivery result key and value pair
	 * @param refNo - String value of the Reference Number of the Alert SMS Message 
	 * @param userNo - String value of the User No
	 * @param mobileNo - String value of the Mobile Number of the User No
	 * @param msg - String value of the SMS alert message
	 * @param retryCount - Integer value of the message retry count
	 * 
	 * @throws DatabaseException
	 * 
	 */

	public void updateTables(HashMap dataObject, String refNo, String userNo, String mobileNo, String msg,
			String retryCount) throws DatabaseException
	{
		SMSHelper deliveryhelper = new SMSHelper();
		HashMap dataMap = new HashMap();
		dataMap.put("OD_REF_ID", refNo);
		dataMap.put("OD_USER_NO", userNo);
		dataMap.put("OD_MOBILE_NO", mobileNo);
		dataMap.put("OD_LONG_MSG", msg);
		dataMap.put("SMS_RETRY_COUNT", retryCount);

		if (dataObject.get(AlertConstants.RES_STATUS) != null)
		{
			if ((AlertConstants.RES_STATUS_VALUE).equals(dataObject.get(AlertConstants.RES_STATUS).toString()))
			{
				if ((AlertConstants.RESULT_CODE_VALUE).equals(dataObject.get(AlertConstants.RESULT_CD_KEY).toString()))
				{
					logger.ctdebug("CTALT00372");
					deliveryhelper.updateDeliverySuccess(dataMap);
					deliveryhelper.updateDeliveryPending(refNo);
				} else
				{
					logger.ctdebug("CTALT00373");
					deliveryhelper.updateDeliveryFailure(refNo);

				}
			} else
			{
				logger.ctdebug("CTALT00373");
			}
		} else
		{
			logger.ctdebug("CTALT00374");
		}
	}

	/**
	 * Thi method gets the list of the alerts to be dispatched 
	 * 
	 * @param retryCount - String value of the SMS Retry Count to filter alerts 
	 * @return alertDataList - List object containing the Alert Data fetched from the DB
	 * 
	 * @throws DatabaseException
	 * 
	 */

	public List getAlertData(String retryCount) throws DatabaseException
	{
		List alertDataList = null;
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		try
		{
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_DETAIL);
			databaseRequest.addFilter("SMS_RETRY_COUNT", retryCount);
			databaseResult = databaseRequest.execute();
			alertDataList = databaseResult.getReturnedList();
		} catch (DatabaseException e)
		{
			logger.cterror("CTALT00375", e);
			throw e;
		}
		return alertDataList;

	}

	/**
	 * The method validates the each subscribed users based on their activation status in the ORBIIBS_NICKNAME table
	 * 
	 * @param userNo - String value of the User No to be validated
	 * @return boolean - true if the user status flag is 'E' otherwise false
	 * 
	 * @throws DatabaseException
	 * 
	 */

	public boolean doValidation(String userNo) throws DatabaseException
	{
		boolean value = false;
		List userStatus = null;
		HashMap status = null;
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		try
		{
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.USER_DATA);
			databaseRequest.addFilter(AlertConstants.USER_NO, userNo);
			databaseResult = databaseRequest.execute();
			userStatus = databaseResult.getReturnedList();

		} catch (DatabaseException ex)
		{
			logger.cterror("CTALT00671", ex);
			throw ex;
		}
		status = (HashMap) userStatus.get(0);
		String data = (String) status.get("STATUS_FLAG");
		if (data.equalsIgnoreCase("E"))
		{
			value = true;
		}
		return value;
	}


	/**
	 * This method gets the value from the <code>hostDataMapping.properties</code> file for the Property Key passed as parameter.
	 * 
	 * @param value - String value of the Property Key  
	 * @return entity - String value of the Proerty Value
	 * 
	 */

	public static String getPropertyString(String value)
	{
		String entity = "";
		try
		{

			if (!"".equals(value))
			{
				ResourceBundle res = ResourceBundle.getBundle("hostDataMapping");
				entity = res.getString(value);
			} else
				entity = value;

		} catch (Exception e)
		{
			logger.cterror("CTALT00959", e, "MissingResourceException", "AlertProcessor");
		}
		return entity;
	}

}
