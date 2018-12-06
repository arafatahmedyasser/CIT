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
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.SystemPreferenceDescriptor;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.PropertyReader;



/**
 * This class provides implementation for IChannelHandler and comaparable interfaces. 
 * This is an abstract class to encapsulate alert Channels Handlers. This class has abstract methods for sending the alert notification
 * to subscribed users. 
 * 
 * @version 1.0
 */
public abstract class GenericChannelHandler implements IChannelHandler, Comparable
{

	/**
	 * This method calls the abstract method send() to send the message for event, alert data and the hashmap of the alert details
	 * 
	 * @param event event object that contains the event data
	 * @param alertDetail AlertDetail object that contains the alert data
	 * @param hmMsgData HashMap of the alert Data keys and alert data values, receipients and channels 
	 * @return void
	 * @throws AlertHandlerException
	 */
	public void sendMessage(Event event, AlertDetail alertDetail, Map hmMsgData) throws AlertHandlerException
	{
		logger.ctinfo("CTALT00108");
		// The unformatted message to be stored in database
		HashMap hmAlertData = (HashMap) hmMsgData.get(AlertConstants.ALERT_DATA_MAP);
		String sLocale = (String) hmMsgData.get(AlertConstants.LOCALE_KEY);
		IMessage message = getMesage(hmAlertData, alertDetail, sLocale);
		// List of user ids for whom the message is to be sent is expected to be in the hashMap with the key
		// AlertConstants.RECIPIENTS_KEY.
		ArrayList listUserIDs = (ArrayList) hmMsgData.get(AlertConstants.RECIPIENTS_KEY);
		// Arraylist of type IRecipients that contains details of the recipient (user id + GCIF)
		ArrayList listRecipients = null;

		// get the recipients info from db using the user ids.
		if (listUserIDs != null && !listUserIDs.isEmpty())
		{
			try
			{
			listRecipients = getRecipientsInfoFromDB(listUserIDs);
			} catch (UnsupportedOperationException uoe)
			{
				listRecipients = getRecipientsInfoFromDB(listUserIDs, hmMsgData);
			}
		}
		// Sender key is expected to be in the hashmap with the key AlertConstants.SENDER_KEY.
		String sSender = (String) hmMsgData.get(AlertConstants.SENDER_KEY);
		// If such a key is not present in the hashmap, then the sender is defaulted to AlertConstants.SYSTEM_SENDER
		if (sSender == null)
			sSender = AlertConstants.SYSTEM_SENDER;

		logger.ctdebug("CTALT00109", listRecipients);
		logger.ctinfo("CTALT00110");
		if (listRecipients == null)
		{
			// Case - No recipients defined for the alert
			// throw new
			// AlertHandlerException("List of recipients null.","List of recipients null. Not able to process the alert");

			logger.cterror("CTALT00111");
		} else
		{
			// Single recipient case
			if (listRecipients.size() == 1)
				send(message, (IRecipient) listRecipients.get(0), sSender, alertDetail.getAlertId());
			// Multiple recipient case
			else if (listRecipients.size() > 1)
				send(message, listRecipients, sSender, alertDetail.getAlertId());
		}
	}

	/**
	 * This method posts the message
	 * 
	 * @param event
	 * @param alertDetails
	 * @param DataMap
	 * @return void
	 * @throws AlertHandlerException
	 */

	public abstract void postMessage(Event event, AlertDetail alertDetails, Map DataMap)
			throws AlertHandlerException; // CHCR

	/**
	 * This is a helper method that a channel should implement if in the input data map it expects the application to
	 * set user ids instead of channel specific recipients. All implementing methods are expected to return a list of
	 * IRecipient objects.
	 * 
	 * @param listUserIDs Arraylist of user ids
	 * @return ArrayList of IRecipient
	 * @throws AlertHandlerException
	 */
	protected abstract ArrayList getRecipientsInfoFromDB(ArrayList listUserIDs) throws AlertHandlerException;
	/**
	 * This is a helper method that a channel should implement if in the input data map it expects the application to
	 * set user ids instead of channel specific recipients. All implementing methods are expected to return a list of
	 * IRecipient objects. It is expected fetch the email details from the input data map instead of fetching from the
	 * db tables.
	 * 
	 * @param listUserIDs Arraylist of user ids
	 * @return ArrayList of IRecipient
	 * @throws AlertHandlerException
	 */
	protected ArrayList getRecipientsInfoFromDB(ArrayList listUserIDs, Map hmMsgData) throws AlertHandlerException
	{
		return null;
	}

	/**
	 * The core method which encapsulates the channel specific logic for sending messages using appropriate
	 * methodologies for respective technologies. Should be overidden to dispatch the alert or notification to the
	 * appropriate channel.
	 * 
	 * @param msg : The message as understood by the Channel.
	 * @param recipient : The recipient who would recieve the message. Each recipient should be of the IRecipient type
	 *            as defined for the Channel.
	 * @param sSender : The sender information as relevant for the Channel.
	 * @param sAlertId : The alert id
	 * @throws AlertHandlerException
	 */
	protected abstract void send(IMessage msg, IRecipient recipient, String sSender, String sAlertId)
			throws AlertHandlerException;

	/**
	 * The core method which encapsulates the channel specific logic for sending messages using appropriate
	 * methodologies for respective technologies. This is an overridden method only to encapsulate sending the message
	 * to multiple recipients. Should be overidden to dispatch the alert or notification to the appropriate channel.
	 * This method is intended to be used for sending bulk messages.
	 * 
	 * @param msg : The message as understood by the Channel.
	 * @param listRecipients : The list of recipients who would recieve the message. Each recipient should be of the
	 *            IRecipient type as defined for the Channel.
	 * @param sSender : The sender information as relevant for the Channel.
	 * @param sAlertId : The alert id
	 * @throws AlertHandlerException
	 */
	protected abstract void send(IMessage msg, ArrayList listRecipients, String sSender, String sAlertId)
			throws AlertHandlerException;

	/**
	 * The Method forms the message. If the data keys associated with the given alert is null, an unformatted message
	 * will be formed. Otherwise, a formatted message is formed. An unformatted message is a string which is not the
	 * actual message but contains the data required to form the message The data will be in the form of key value pairs
	 * each seperated by a delimiter <key1>=<value1>$$<key2>=<value2>$$..... The assignment operator '=' and the
	 * delimiter key '$$' are configured in the property file canvas_alert_properties.properties
	 * 
	 * @param hmMsgData
	 * @param alertDetail
	 * @param sLocale
	 * @return IMessage
	 * @throws AlertHandlerException
	 */
	private IMessage getMesage(HashMap hmMsgData, AlertDetail alertDetail, String sLocale) throws AlertHandlerException
	{
		logger.ctinfo("CTALT00112");
		logger.ctdebug("CTALT00113", hmMsgData);
		logger.ctdebug("CTALT00114", sLocale);
		// This String buffer will contain the list of key values pairs of the data that are needed to form the alert
		StringBuffer sbData = null;
		String sUnformattedMessage = null;
		Message message = new Message();
		message.setMessageId((String)hmMsgData.get("MESSAGE_ID"));
		message.setAlertId(alertDetail.getAlertId());
		ArrayList alistDataKeys = null;
		HashMap hmDataKeys = null;
		List listDataKeys = null;
		// This is to ensure that no null pointer exception is thrown if the map is empty
		if (hmMsgData == null)
			hmMsgData = new HashMap();
		// Get the alert data keys for the given alert id from the database
		List listCachedDataKeys = CacheManager.getFWInstance().getDataFromCache(null, AlertConstants.ALERT_DATA_KEYS);
		if (listCachedDataKeys != null && listCachedDataKeys.size() > 0)
		{
			HashMap alertDataKeyMap = (HashMap) listCachedDataKeys.get(0);
			logger.ctdebug("CTALT00115", alertDataKeyMap);
			listDataKeys = (List) alertDataKeyMap.get(alertDetail.getAlertId());
		}
		// If there are no data keys for an alert, listDataKeys could be null.
		// No need to throw an excpetion as the message could be a static message in that case
		if (listDataKeys != null && !listDataKeys.isEmpty())
		{
			// Form ArrayList of DataKeys
			alistDataKeys = new ArrayList();
			for (int i = 0; i < listDataKeys.size(); i++)
			{
				hmDataKeys = (HashMap) listDataKeys.get(i);
				alistDataKeys.add(hmDataKeys.get(AlertConstants.DATA_KEY));
			}
		}
		logger.ctdebug("CTALT00116", alistDataKeys);
		if (alistDataKeys != null && !alistDataKeys.isEmpty())
		{
			// This condition is for unformatted Message. In an unformatted message, the detailed message contains the
			// key value pairs need to form the actual message
			sbData = new StringBuffer();
			for (int i = 0; i < alistDataKeys.size(); i++)
			{
				sbData.append(alistDataKeys.get(i));
				sbData.append(prptReader.retrieveProperty("ASSIGNMENT_KEY"));
				if (hmMsgData.get(alistDataKeys.get(i)) != null)
					sbData.append(hmMsgData.get(alistDataKeys.get(i)));
				else
					sbData.append("");
				if (i != (alistDataKeys.size() - 1))
					sbData.append(prptReader.retrieveProperty("DELIMITER_KEY"));
			}
			if (sbData != null)
			{
				sUnformattedMessage = sbData.toString();
				message.setDetailedMessage(sUnformattedMessage);
			}
			message.setFormatted(false);
		} else
		{
			// This is for a formatted message. The short and detailed description template has the actual message to be
			// sent

			if (sLocale == null || sLocale.isEmpty())
			{
				sLocale = "en_US";
			}
			ConfigurationManager confMngr = ConfigurationManager.getInstance();
			SystemPreferenceDescriptor sysDscr = confMngr.getSystemPrefDescriptor();
			PropertyReader msgPrptReader = new PropertyReader(sysDscr.getAlertTemplateFile() + "_" + sLocale);

			logger.ctdebug("CTALT00117", alertDetail.getAlertId(), sChannelName);
			// The key to get the short message template is formed using the Alert Id, Channel Id and the constant
			// AlertConstants.SHORT_DESCRIPTION_TEMPLATE.
			String sShortMsgTemplateKey = new StringBuffer(alertDetail.getAlertId()).append(sChannelName)
					.append(AlertConstants.SHORT_DESCRIPTION_TEMPLATE).toString();
			// The key to get the detailed message template is formed using the Alert Id, Channel Id and the constant
			// AlertConstants.DETAILED_DESCRIPTION_TEMPLATE.
			String sDetailedMsgTemplateKey = new StringBuffer(alertDetail.getAlertId()).append(sChannelName)
					.append(AlertConstants.DETAILED_DESCRIPTION_TEMPLATE).toString();
			// Get the short message
			String sShortMessage = msgPrptReader.retrieveProperty(sShortMsgTemplateKey);
			// Get the detailed Message
			String sDetailedMessage = msgPrptReader.retrieveProperty(sDetailedMsgTemplateKey);
			message.setShortMessage(sShortMessage);
			message.setDetailedMessage(sDetailedMessage);
			message.setFormatted(true);
		}

		// Store the enriched data values into the message always.
		message.setEnrichBankName((String) hmMsgData.get(AlertConstants.KEY_ENRICH_BANK_NAME));
		message.setEnrichBranchName((String) hmMsgData.get(AlertConstants.KEY_ENRICH_BRANCH_NAME));
		message.setEnrichCcy((String) hmMsgData.get(AlertConstants.KEY_ENRICH_CCY));
		message.setEnrichCountryName((String) hmMsgData.get(AlertConstants.KEY_ENRICH_COUNTRY_NAME));
		message.setEnrichSubProduct((String) hmMsgData.get(AlertConstants.KEY_ENRICH_SUBPROD_DESC));

		logger.ctinfo("CTALT00120");
		return message;
	}

	/**
	 * This method is used for setting ChannelId
	 * 
	 * @param sChannelId the channel id to set
	 */
	public void setChannelId(String sChannelId)
	{
		this.sChannelId = sChannelId;
	}

	/**
	 * This method is used for getting ChannelId
	 * 
	 * @return the channel id
	 */
	public String getChannelId()
	{
		return this.sChannelId;
	}

	/**
	 * This method is used for setting Channel name
	 * 
	 * @param sChannelName the Channel name to set
	 */
	public void setChannelName(String sChannelName)
	{
		this.sChannelName = sChannelName;
	}

	/**
	 * This method is used for getting Channel name
	 * 
	 * @return the Channel name
	 */
	public String getChannelName()
	{
		return this.sChannelName;
	}

	/**
	 * This method is used to convert the ChannelId into integer value
	 * 
	 * @return ChannelId in form of integer
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode()
	{
		return Integer.parseInt(this.getChannelId());
	}

	/**
	 * This method compares the GenericChannelHandler class ChannelId with the ChannelId of class we are implementing
	 * 
	 * @param aChannelHandler
	 * @return compared value(eithr-1 or 0 or 1)
	 * @see java.lang.Comparable#compareTo(java.lang.Object)
	 */
	public int compareTo(Object aChannelHandler)
	{

		return this.getChannelId().compareTo(((GenericChannelHandler) aChannelHandler).getChannelId());
	}

	/**
	 * This api overides the equals to method of contains method in ArrayList.
	 * 
	 * @param aChannelHandler
	 * @return Either yes or no based on .equals
	 */
	public boolean equals(Object aChannelHandler)
	{
		logger.ctdebug("CTALT00121");

		return this.getChannelId().equals(((GenericChannelHandler) aChannelHandler).getChannelId());
	}

	private String sChannelId = null;
	private String sChannelName = null;
	private static final Logger logger = Logger.getLogger(GenericChannelHandler.class);
	private static PropertyReader prptReader = AlertConstants.ALERT_PROPERTIES;
}
