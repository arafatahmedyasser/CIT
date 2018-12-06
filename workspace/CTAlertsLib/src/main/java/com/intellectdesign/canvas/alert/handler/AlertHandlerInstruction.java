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

import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.event.EventHandlerFrameworkConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.PropertyReader;

/**
 * This instruction class is responsible for getting information like Alert Defenition, Alert Subscribers and Alert Channel for an Event ID. 
 *
 * @See  com.intellectdesign.canvas.event.Event
 * @version 1.0
 */
public class AlertHandlerInstruction
{
	/**
	 * This method gets the list of alert definitions for the given event
	 * 
	 * @param event Event Object that contains the Event ID 
	 * @return alistAlerts Array List of alerts for the given event
	 * @exception AlertHandlerException
	 */
	public static ArrayList getAllAlertsForEvent(Event event) throws AlertHandlerException
	{
		logger.ctinfo("CTALT00016");
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listAlerts = null;
		ArrayList alistAlerts = null;
		AlertDetail alertDetail = null;
		HashMap hmAlertDetails = null;
		long lEventId = event.getEventId();
		logger.ctdebug("", lEventId);
		try
		{
			// Go to the DB and fetch all the alerts for the event
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_ALERT_DTLS);
			databaseRequest.addFilter(EventHandlerFrameworkConstants.EVENT_ID, String.valueOf(lEventId));
			databaseResult = databaseRequest.execute();
			listAlerts = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00018", lEventId, dbEx);
			throw new AlertHandlerException(AlertConstants.ERR_ALERT_DB_EX,
					prptReader.retrieveProperty(AlertConstants.ERR_ALERT_DB_EX));
		}
		logger.ctdebug("CTALT00019", listAlerts);
		if (listAlerts != null && !listAlerts.isEmpty())
		{
			// Form ArrayList of AlertDetail objects
			alistAlerts = new ArrayList();
			for (int i = 0; i < listAlerts.size(); i++)
			{
				hmAlertDetails = (HashMap) listAlerts.get(i);

				// if(hmAlertDetails.get("ENABLED_IND")!=null && hmAlertDetails.get("ENABLED_IND").equals("Y"))
				// {
				alertDetail = new AlertDetail();

				logger.ctdebug("CTALT00020", hmAlertDetails);
				alertDetail.setAlertId((String) hmAlertDetails.get(AlertConstants.ALERT_ID));
				alertDetail.setAlertDesc((String) hmAlertDetails.get(AlertConstants.ALERT_DESCRIPTION));
				alertDetail.setAlertSeverity((String) hmAlertDetails.get(AlertConstants.SEVERITY));
				alertDetail.setEntitlementType((String) hmAlertDetails.get(AlertConstants.ENTL_TYPE));

				alertDetail.setDataSource((String) hmAlertDetails.get(AlertConstants.ALERT_DATA_SOURCE));

				alistAlerts.add(alertDetail);
				// }

			}
		} else
		{
			logger.ctdebug("CTALT00021", lEventId);
			throw new AlertHandlerException(AlertConstants.ERR_ALERT_NO_ALERTS_FOR_EVENT,
					prptReader.retrieveProperty(AlertConstants.ERR_ALERT_NO_ALERTS_FOR_EVENT));
		}
		logger.ctdebug("CTALT00022", alistAlerts);
		logger.ctinfo("Exited from getAllAlertsForEvent method");
		return alistAlerts;
	}

	/**
	 * This method fetches the data to be enriched from the data source provided.
	 * 
	 * @param dataSource string value of the data source id from which additional alert details needs to be fetched
	 * @param alertDataMap Hash Map of the existing alerts data
	 * 
	 * @return EnrichedData Hash Map of the data from the datasource for alert 
	 * @throws AlertHandlerException thrown if any error occurs while querying the database.
	 */
	public HashMap getEnrichDataFromSource(String dataSource, HashMap alertDataMap) throws AlertHandlerException
	{

		String txnRef = null;
		String agreementID = null;
		String loanId = null;

		DatabaseRequest dbRequest = new CanvasDatabaseRequest();

		dbRequest.setDataAccessMapKey(AlertConstants.DAM_KEY_ENRICH_DATA_SELECT);
		dbRequest.setOperation(DatabaseConstants.SELECT);
		dbRequest.setOperationExtension(dataSource);

		if (dataSource.equals("DATA_SOURCE_LIQ_LOAN")) // for loan alerts
		{
			loanId = (String) alertDataMap.get(AlertConstants.LOAN_ID);
			dbRequest.addFilter(AlertConstants.LOAN_ID, loanId);
		} else if (dataSource.equals("DATA_SOURCE_LIQ_AGREEMENT")) // for agreement alerts
		{
			agreementID = (String) alertDataMap.get(AlertConstants.AGREEMENT_ID);
			dbRequest.addFilter(AlertConstants.AGREEMENT_ID, agreementID);
		} else
		{
			txnRef = (String) alertDataMap.get(AlertConstants.KEY_TXN_REF_NO);
			dbRequest.addFilter(AlertConstants.KEY_TXN_REF_NO, txnRef);
		}

		logger.ctdebug("CTALT00024", dataSource, txnRef);
		try
		{
			ArrayList<HashMap> returnList = (ArrayList<HashMap>) dbRequest.execute().getReturnedList();
			if (returnList.size() > 0)
			{
				logger.ctdebug("CTALT00025", dataSource, txnRef);
				return returnList.get(0);
			} else
			{
				logger.ctdebug("CTALT00026", dataSource, txnRef);
				return null;
			}
		} catch (DatabaseException dbExcep)
		{
			logger.cterror("CTALT00027", dataSource, dbExcep);
			throw new AlertHandlerException(AlertConstants.ERR_ALERT_FETCH_ENRICH_DATA,
					prptReader.retrieveProperty(AlertConstants.ERR_ALERT_FETCH_ENRICH_DATA), dbExcep);
		}
	}

	/**
	 * This method gets the list of subscribed users for an alert who have entitlement  
	 * 
	 * This users list from ALERT_SUBSCRIPTION table
	 * 
	 * @param alertId string value of Alert ID
	 * @param entlUserNoList List of entitled users 
	 * 
	 * @return ListofUsersforAlert List value of users who subscribed for the alert
	 */
	public List<String> getListofUsersForAlert(String alertId, List<String> entlUserNoList)
	{
		DatabaseRequest dbReq = null;
		DatabaseResult dbResult = null;

		List<String> usersList = new ArrayList<String>();
		try
		{
			dbReq = new CanvasDatabaseRequest();
			dbReq.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			dbReq.setOperation(DatabaseConstants.SELECT);
			dbReq.setOperationExtension(AlertConstants.GET_USERS_LIST);
			dbReq.addFilter(AlertConstants.ALERT_ID, alertId);
			dbReq.addFilter(AlertConstants.OD_USER_NO, entlUserNoList);
			dbResult = dbReq.execute();
			usersList = dbResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00028 ", dbEx);
		}

		return usersList;
	}

	/**
	 * This method gets thte list of available channels and their handler in the application for alert dispatch.
	 * 
	 * @return AllchannelHandlersList List value of channel handlers
	 * @throws DatabaseException
	 */
	public List<HashMap> getAllChannelHandlers() throws DatabaseException
	{

		DatabaseRequest dbReq = null;
		DatabaseResult dbResult = null;

		List<HashMap> channelHandlersList = new ArrayList<HashMap>();
		try
		{
			dbReq = new CanvasDatabaseRequest();
			dbReq.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			dbReq.setOperation(DatabaseConstants.SELECT);
			dbReq.setOperationExtension(AlertConstants.CHANNEL_HANDLERS);

			dbResult = dbReq.execute();
			channelHandlersList = dbResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00028", dbEx);
			throw dbEx;
		}

		return channelHandlersList;
	}

	/***
	 * This method returns the list of users subscribed for an alert on a particular channel 
	 * for the alert, user numbers and the channels passed as filters. The channel is default channel
	 * 
	 * @param alertId String value of the alert id  
	 * @param channelId String value of channelId 
	 * @param entlUserNoList List value of list of entitled users for an alert
	 * 
	 * @return UsersSubscribedForChannel List value of users subscribed the alert for the particular channel
	 * @throws DatabaseException
	 */
	public List<String> getlistOfUsersSubscribedForChannel(String alertId, String channelId, List<String> entlUserNoList)
			throws DatabaseException
	{
		logger.ctinfo("CTALT00029");
		DatabaseRequest dbReq = null;
		DatabaseResult dbResult = null;
		List<String> listOfUsersSubscribedForChannel = null;
		try
		{
			dbReq = new CanvasDatabaseRequest();
			dbReq.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			dbReq.setOperation(DatabaseConstants.SELECT);
			dbReq.setOperationExtension(AlertConstants.USERS_SUB_FOR_CHANNELS);
			dbReq.addFilter(AlertConstants.ALERT_ID, alertId);
			dbReq.addFilter(AlertConstants.CHANNEL_ID, channelId);
			dbReq.addFilter(AlertConstants.OD_USER_NO, entlUserNoList);
			dbResult = dbReq.execute();
			listOfUsersSubscribedForChannel = dbResult.getReturnedList();
			logger.ctdebug("CTALT00030", listOfUsersSubscribedForChannel);
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00028", dbEx);
			throw new DatabaseException(dbEx);
		}

		logger.ctinfo("CTALT00031");
		return listOfUsersSubscribedForChannel;
	}

	/***
	 * This method returns the of subscribed users for an alert who are entitled to the alert entitlement type 
	 *  
	 * @param alertId String value of the Alert ID
	 * @param entlUserNoList List value of the entitled users 
	 * 
	 * @return subscribedUsers List value of the Users who subscribed the alerts 
	 * @throws DatabaseException
	 */
	public List<String> getSubscribersForAlert(String alertId, List<String> entlUserNoList) throws DatabaseException
	{
		logger.ctinfo("CTALT00032");
		DatabaseRequest dbReq = null;
		DatabaseResult dbResult = null;
		List<String> subscribersForAlert = null;
		try
		{
			dbReq = new CanvasDatabaseRequest();
			dbReq.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			dbReq.setOperation(DatabaseConstants.SELECT);
			dbReq.setOperationExtension(AlertConstants.SUBSCRIBED_FOR_ALERTS);
			dbReq.addFilter(AlertConstants.ALERT_ID, alertId);
			dbReq.addFilter(AlertConstants.OD_USER_NO, entlUserNoList);
			dbResult = dbReq.execute();
			subscribersForAlert = dbResult.getReturnedList();
			logger.ctdebug("CTALT00033", subscribersForAlert);
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00028", dbEx);
			throw new DatabaseException(dbEx);
		}
		logger.ctinfo("CTALT00034");

		return subscribersForAlert;
	}

	/***
	 * This method returns the of email template code
	 *  
	 * @param alertId String value of the Alert ID
	 * 
	 * @throws DatabaseException
	 */
	public List getEmailTemplateCode(String sAlertId) throws AlertHandlerException{
		DatabaseRequest dbRequest = null;
		List returnList = null;
		
		try{
			dbRequest = new CanvasDatabaseRequest();
			returnList = new ArrayList<HashMap>();
			
			dbRequest.setDataAccessMapKey(AlertConstants.DAM_KEY_ENRICH_DATA_SELECT);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(AlertConstants.ALERT_TEMPLATE_CODE);
			dbRequest.addFilter(AlertConstants.ALERT_ID, sAlertId);	
			returnList = dbRequest.execute().getReturnedList();
			
			if(returnList!= null && !returnList.isEmpty()){
				return returnList;
			}else{
				return null;
			}
		}catch(DatabaseException dbExcep){
			logger.cterror("CTALT00986", dbExcep);
			throw new AlertHandlerException(AlertConstants.ERR_ALERT_FETCH_EMAIL_TEMPLATE_CODE,prptReader.retrieveProperty(AlertConstants.ERR_ALERT_FETCH_EMAIL_TEMPLATE_CODE), dbExcep);
		}
	}
	private static Logger logger = Logger.getLogger(AlertHandlerInstruction.class);

	private static PropertyReader prptReader = AlertConstants.ALERT_PROPERTIES;
}
