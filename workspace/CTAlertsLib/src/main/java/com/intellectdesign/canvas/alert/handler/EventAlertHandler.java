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
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.event.EventHandlerFrameworkConstants;
import com.intellectdesign.canvas.event.handler.EventHandler;
import com.intellectdesign.canvas.event.handler.HandlerException;
import com.intellectdesign.canvas.event.handler.IData;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This class is responsible for handling the alerts
 * 
 * @version 1.0
 */
public class EventAlertHandler extends EventHandler
{

	/**
	 * This is just a overridden method which formats the event data and returns it as IData object.
	 * 
	 * @see com.intellectdesign.canvas.event.handler.IData
	 * 
	 * @param event Event object
	 * @param mapData Hashmap of the event and Alert data
	 * @return AlertData IData object of the Alert data
	 * @exception HandlerException
	 */
	@Override
	protected IData formatEventData(Event event, Map mapData) throws HandlerException
	{
		AlertData alertData = new AlertData();
		alertData.setAlertData(mapData);
		return alertData;
	}

	/**
	 * This method should return the async setup to which the job should be dispatched. For the alerts framework, the
	 * async setup is expected to be under the key "ALERT_ASYNC"
	 * 
	 * @return The async setup key.
	 */
	@Override
	protected String getAsyncConfigKey()
	{
		return "ALERT_ASYNC";
	}

	/**
	 * This method will be called from handleEvent when the handler has been configured to execute in asynchronous
	 * manner. Here we ensure that alerts are sent out only if this is not a simulation mode.
	 * 
	 * @param event Event object that has to be handled
	 * @param data Formatted alert data for the event
	 * 
	 * @exception HandlerException Thrown if there are any errors while handling this event
	 * @see 
	 *      com.intellectdesign.od.shared.event.handler.EventHandler#handleASynchEvent(com.intellectdesign.od.shared.event
	 *      .Event, com.intellectdesign.od.shared.event.IData eventData)
	 */
	@Override
	protected void handleASynchEvent(Event event, IData data) throws HandlerException
	{
		Map mapData = ((AlertData) data).getAlertData();
		logger.ctdebug("CTALT00097", mapData);
		boolean isSimulationMode = false;
		HashMap metaDataMap = (HashMap) mapData.get("MANDATORY_AUDIT_META_DATA");
		if (metaDataMap != null && metaDataMap.containsKey(EventHandlerFrameworkConstants.FLD_SIMULATION_MODE))
		{
			isSimulationMode = Boolean.valueOf((Boolean) (metaDataMap
					.get(EventHandlerFrameworkConstants.FLD_SIMULATION_MODE)));
		}
		logger.ctdebug("CTALT00098", mapData.toString());
		logger.ctdebug("CTALT00099", isSimulationMode);
		if (!isSimulationMode)
		{
			super.handleASynchEvent(event, data);
		} else
		{
			logger.ctdebug("CTALT00102");
		}
	}

	/**
	 * This method is responsible for sending alert message to the subscribed users who are enttitled to read the alert
	 * messages on the channel applicable
	 * 
	 * @param event - This is the enumerated value defined by PEG, encapsulating all event attributes.
	 * 
	 * @param mapData - IData object that contains the event, subscribed users and the channels.
	 * 
	 *            The alert framework expects the following keys within the HashMap <li>1. Key:
	 *            AlertConstants.RECIPIENTS_KEY Value: ArrayList of UserIds for which the message is intended to be
	 *            sent. If the total number of recipient is one, it has to be set in the first index.
	 *            Mandatory/Optional: Optional <li>2. Key: AlertConstants.SENDER_KEY Value: String which indicates the
	 *            sender Mandatory/Optional: Optional. In case if such a key is not present in the HashMap, the sender
	 *            is taken as the "SYSTEM" . <li>3. Key: AlertConstants.ALERT_DATA_MAP Value: A HashMap containing the
	 *            data used to form the message. Mandatory/Optional: Optional <li>4. Key: AlertConstants.LOCALE Value:
	 *            Locale in which the message needs to be sent. Mandatory/Optional: Mandatory for static messages (where
	 *            no formatting is required)
	 * 
	 * @exception AlertHandlerException
	 */

	public void handleSynchEvent(Event event, IData data) throws AlertHandlerException
	{
		Map mapData = ((AlertData) data).getAlertData();
		logger.ctinfo("CTALT00071");
		ArrayList listAlerts = null;
		IChannelHandler channelHandler = null;
		AlertDetail alertDetail = null;
		AlertHelper alertHelper = new AlertHelper();
		ChannelHandlerFactory channelHandlerFactory = null;
		ArrayList listAlertChannelHandlers = null;
		List<IChannelHandler> listAllChannels = null;
		List<String> listOfRecepients = null;
		try
		{
			// Get the list of alerts for this event
			listAlerts = AlertHandlerInstruction.getAllAlertsForEvent(event);
			// Enrich the data for this alert.

			logger.ctdebug("CTALT00072", listAlerts);
			for (int i = 0; i < listAlerts.size(); i++)
			{
				alertDetail = (AlertDetail) listAlerts.get(i);

				alertHelper.enrichAlertDataFor(mapData, event, alertDetail);

				logger.ctdebug("CTALT00073", alertDetail);
				if (alertDetail != null)
				{

					// First get the list of users. Only if there are one or more users, then evaluate the channels for
					// distribution
					List entlUserNoList = alertHelper.getEntitledUsers(event, alertDetail, mapData);

					if (entlUserNoList != null && entlUserNoList.size() > 0)
					{ // Entitlment User can be empty.. F/W need to be check and confirm this
						// Get the list of channels for this alert from the channel handler factory
						channelHandlerFactory = ChannelHandlerFactory.getInstance();

						// List of default channels
						listAlertChannelHandlers = channelHandlerFactory.getListOfChannelHandlersForAlert(alertDetail
								.getAlertId());

						listAllChannels = channelHandlerFactory.getAllChannelHandlers();
						String messageId = UUID.randomUUID().toString().concat(String.valueOf(new Date().getTime()));
						// Iterate through all channels in listAllChannels
						for (int j = 0; j < listAllChannels.size(); ++j)
						{
							if (!listAlertChannelHandlers.contains(listAllChannels.get(j)))
							{
								listOfRecepients = getEntlSubscribedUser(alertDetail.getAlertId(), entlUserNoList);

							} else
							{

								List<String> listOfUsersSubscribedForChannel = getListOfUsersSubscribedForChannel(
										alertDetail.getAlertId(), listAllChannels.get(j).getChannelId(), entlUserNoList);
								logger.ctdebug("CTALT00074", listOfUsersSubscribedForChannel);

								List listOfSubscribersForAlert = getSubscribersForAlert(alertDetail.getAlertId(),
										entlUserNoList);
								logger.ctdebug("CTALT00075", listOfSubscribersForAlert);

								List listOfUsersToNotReceiveAlert = null;

								listOfSubscribersForAlert.removeAll(listOfUsersSubscribedForChannel);
								listOfUsersToNotReceiveAlert = listOfSubscribersForAlert;
								logger.ctdebug("CTALT00076", listOfUsersToNotReceiveAlert);

								listOfRecepients = new ArrayList<String>(entlUserNoList);

								listOfRecepients.removeAll(listOfUsersToNotReceiveAlert);
							}
							logger.ctdebug("CTALT00077" + listOfRecepients);
							mapData.put(AlertConstants.RECIPIENTS_KEY, listOfRecepients);
							((HashMap) mapData.get(AlertConstants.ALERT_DATA_MAP)).put("MESSAGE_ID", messageId);

							channelHandler = listAllChannels.get(j);

							if (channelHandler != null)
							{
								// Send message through the channel
								channelHandler.sendMessage(event, alertDetail, mapData);
							}
						}
					}
				}
			}
		} catch (AlertHandlerException alertHandlerException)
		{
			logger.cterror("CTALT00078", alertHandlerException);
			if (!isIgnoreExceptions())
				throw alertHandlerException;
		}
		logger.ctinfo("CTALT00080");
	}

	/***
	 * This method gives the list of subscribed users for an alerts from the entitled users list on all default
	 * channels.
	 * 
	 * @param alertId String value of the Alert ID
	 * @param entlUserNoList List object of entitled users
	 * 
	 * @return subscribersForAlert list of users subscribed.
	 * @exception AlertHandlerException
	 */
	private List getSubscribersForAlert(String alertId, List<String> entlUserNoList) throws AlertHandlerException
	{
		logger.ctinfo("CTALT00081");
		List<String> subscribersForAlert = null;
		AlertHandlerInstruction alertHandlerInstr = new AlertHandlerInstruction();
		try
		{
			subscribersForAlert = alertHandlerInstr.getSubscribersForAlert(alertId, entlUserNoList);
		} catch (DatabaseException dbexception)
		{

			logger.cterror("CTALT00082", dbexception);
			throw new AlertHandlerException("dbexception",
					"database exception while getting the list of subscribed users for channel");
		} catch (Exception exception)
		{
			logger.cterror("CTALT00083", exception);
			throw new AlertHandlerException("Exception",
					"exception while getting the list of subscribed users for channel");
		}
		logger.ctinfo("CTALT00084");

		return subscribersForAlert;
	}

	/***
	 * This method gives the list of users subscribed to view the alert on the default channel.
	 * 
	 * @param alertId String value of the Alert Id
	 * @param channelId String value of the default Channel Id
	 * @param entlUserNoList List object of the entitled users for the alert
	 * 
	 * @return listOfUsersSubscribedForChannel list object of users subscribed for the default channel
	 * @exception AlertHandlerException
	 */
	private List<String> getListOfUsersSubscribedForChannel(String alertId, String channelId,
			List<String> entlUserNoList) throws AlertHandlerException
	{
		logger.ctinfo("CTALT00085");
		List<String> listOfUsersSubscribedForChannel = null;
		AlertHandlerInstruction alertHandlerInstr = new AlertHandlerInstruction();
		try
		{
			listOfUsersSubscribedForChannel = alertHandlerInstr.getlistOfUsersSubscribedForChannel(alertId, channelId,
					entlUserNoList);
		} catch (DatabaseException dbexception)
		{

			logger.cterror("CTALT00086", dbexception);
			throw new AlertHandlerException("dbexception",
					"database exception while getting the list of subscribed users for channel");
		} catch (Exception exception)
		{
			logger.cterror("CTALT00083", exception);
			throw new AlertHandlerException("Exception",
					"exception while getting the list of subscribed users for channel");
		}
		logger.ctinfo("CTALT00087");

		return listOfUsersSubscribedForChannel;
	}

	/**
	 * This method is used to get the list of users based on the event.
	 * 
	 * @param event combination of product , subproduct, function and action combination
	 * @param alertDetail details of the alert
	 * @param hmMsgData hashmap containing account details.
	 * @return listofEntitledUsers list of entitled users for event raised.
	 */
	/*
	 * private ArrayList<String> getEntitledUsers(Event event, AlertDetail alertDetail, HashMap hmMsgData) {
	 * logger.ctinfo("CTALT00088"); ArrayList listofEntitledUsers = null; String entlType = null;
	 * 
	 * entlType = alertDetail.getEntitlementType(); logger.ctdebug("CTALT00089", entlType); if (entlType != null &&
	 * entlType.trim().length() != 0) {
	 * 
	 * } else { listofEntitledUsers = (ArrayList) hmMsgData.get(AlertConstants.RECIPIENTS_KEY);
	 * 
	 * } logger.ctdebug("CTALT00090", listofEntitledUsers);
	 * 
	 * logger.ctinfo("CTALT00091"); return listofEntitledUsers; }
	 */

	/**
	 * This method gives the list of entitled users who subscribed for the alert to view the message on non default
	 * channels.
	 * 
	 * @param alertId String value of the Alert Id
	 * @param entlUserNoList List object of the entitled users for the alert
	 * 
	 * @return usersList List object of the users who subscribed to the alert
	 */
	private List<String> getEntlSubscribedUser(String alertId, List<String> entlUserNoList)
	{
		logger.ctinfo("CTALT00092");
		AlertHandlerInstruction alertHandlerInstr = new AlertHandlerInstruction();
		List<String> usersList = new ArrayList<String>();

		try
		{
			usersList = alertHandlerInstr.getListofUsersForAlert(alertId, entlUserNoList);
			logger.ctdebug("CTALT00093" + usersList);
		} catch (Exception ahEx)
		{
			logger.cterror("CTALT00094", ahEx);

		}
		logger.ctinfo("CTALT00095");
		return usersList;
	}

	private Logger logger = Logger.getLogger(EventAlertHandler.class);

	
}
