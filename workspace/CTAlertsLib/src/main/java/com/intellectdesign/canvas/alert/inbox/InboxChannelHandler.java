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

package com.intellectdesign.canvas.alert.inbox;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.alert.handler.AlertConstants;
import com.intellectdesign.canvas.alert.handler.AlertDetail;
import com.intellectdesign.canvas.alert.handler.AlertHandlerException;
import com.intellectdesign.canvas.alert.handler.GenericChannelHandler;
import com.intellectdesign.canvas.alert.handler.IMessage;
import com.intellectdesign.canvas.alert.handler.Message;
import com.intellectdesign.canvas.alert.sms.SMSPostingManager;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.PropertyReader;

/**
 * This class is responsible for sending alerts messages to the inbox channel of the users 
 * who are subscribed as recipients. 
 * 
 * This class gets the details of the messages and the recipients using {@link InboxChannelInstruction}.
 * 
 * @version 1.0
 */
public class InboxChannelHandler extends GenericChannelHandler
{
	/**
	 * This method finds the User No and GCIF of the users who are subscibed for the message Inbox channel. 
	 * 
	 * @param listUserIDs - ArrayList of User IDs to fetch their GCIFs
	 * @return listRecipients - ArrayList of User IDs and GCIF Numbers 
	 * 
	 * @throws AlertHandlerException
	 */
	public ArrayList getRecipientsInfoFromDB(ArrayList listUserIDs) throws AlertHandlerException
	{
		ArrayList listRecipients = null;

		logger.ctinfo("CTALT00172");
		logger.ctdebug("CTALT00173", listUserIDs.size());

		InboxChannelInstruction inboxChannelInstruction = new InboxChannelInstruction();

		try
		{
			// Go to the DB and fetch the Recipient details
			listRecipients = (ArrayList) inboxChannelInstruction.getRecipientInfo(listUserIDs);
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00174", dbEx, listUserIDs);
			throw new AlertHandlerException(AlertConstants.ERR_ALERT_DB_EX,
					prptReader.retrieveProperty(AlertConstants.ERR_ALERT_DB_EX));
		}
		// If the array list of recipients is null, throw exception
		if (listRecipients == null || listRecipients.isEmpty())
		{
			logger.cterror("CTALT00175");
			throw new AlertHandlerException(AlertConstants.ERR_RECIPIENTS_NULL,
					prptReader.retrieveProperty(AlertConstants.ERR_RECIPIENTS_NULL));
		}

		logger.ctdebug("CTALT00176", listRecipients);
		logger.ctinfo("CTALT00177");
		return listRecipients;
	}

	/**
	 * This method creates the Hashmap of User Message details that can be used for batch insert into DB.
	 * 
	 * @param message - Message object that contains the message details
	 * @param sSender - String value of the message sender User_No
	 * @param sAlertId - String value of the Alert ID
	 * @return MessageData - HashMap of the Message data 
	 */
	private HashMap formMessageDataMap(Message message, String sSender, String sAlertId)
	{
		logger.ctinfo("CTALT00178");
		HashMap hmDataMap = new HashMap();
		hmDataMap.put(AlertConstants.ALERT_ID, sAlertId);
		hmDataMap.put(AlertConstants.MESSAGE_ID, message.getMessageId());
		hmDataMap.put(AlertConstants.FROM_USER_ID, sSender);
		hmDataMap.put(AlertConstants.SHORT_MESSAGE, message.getShortMessage());
		hmDataMap.put(AlertConstants.DETAILED_MESSAGE, message.getDetailedMessage());
		hmDataMap.put(AlertConstants.DRAFT_INDICATOR, message.isDraft() ? "Y" : "N");
		hmDataMap.put(AlertConstants.FORMATTED_MSG_FLAG, message.isFormatted() ? "Y" : "N");
		hmDataMap.put(AlertConstants.ARCHIVED_INDICATOR, message.isArchived() ? "Y" : "N");
		hmDataMap.put(AlertConstants.IS_NOTIFICATION, message.isNotified() ? "Y" : "N");
		hmDataMap.put(AlertConstants.STR_MESSAGE_DURATION, message.getDuration());
		hmDataMap.put(AlertConstants.KEY_ENRICH_CCY, message.getEnrichCcy());
		hmDataMap.put(AlertConstants.KEY_ENRICH_SUBPROD_DESC, message.getEnrichSubProduct());
		hmDataMap.put(AlertConstants.KEY_ENRICH_COUNTRY_NAME, message.getEnrichCountryName());
		hmDataMap.put(AlertConstants.KEY_ENRICH_BANK_NAME, message.getEnrichBankName());
		hmDataMap.put(AlertConstants.KEY_ENRICH_BRANCH_NAME, message.getEnrichBranchName());
		logger.ctdebug("CTALT00179", hmDataMap);
		logger.ctinfo("CTALT00180");
		return hmDataMap;
	}

	/**
	 * This method creates the Hashmap of the User Message details that can be used for batch insert into DB.
	 *  
	 * @param message - Message object that contains the message data such as Message ID, Notification Indicator...etc  
	 * @param inboxMessageRecipient - InboxMessageRecipient object that contains the User_No and GCIF_No 
	 * @return RecipientData - Hashmap of User Message details 
	 */
	private HashMap formRecipientDataMap(Message message, InboxMessageRecipient inboxMessageRecipient)
	{
		logger.ctinfo("CTALT00181");
		HashMap hmDataMap = new HashMap();
		hmDataMap.put(AlertConstants.MESSAGE_ID, message.getMessageId());
		hmDataMap.put(AlertConstants.TO_USER_ID, inboxMessageRecipient.getUserId());
		hmDataMap.put(AlertConstants.GCIF, inboxMessageRecipient.getGcif());
		hmDataMap.put(AlertConstants.READ_INDICATOR, message.isRead() ? "Y" : "N");
		hmDataMap.put(AlertConstants.DELETED, message.isDeleted() ? "Y" : "N");
		hmDataMap.put(AlertConstants.ACTIONED_INDICATOR, message.isAssociatedActionCompleted() ? "Y" : "N");
		hmDataMap.put(AlertConstants.IS_NOTIFICATION, message.isNotified() ? "Y" : "N");
		hmDataMap.put(AlertConstants.STR_MESSAGE_DURATION, message.getDuration());
		hmDataMap.put(AlertConstants.KEY_ENRICH_CCY, message.getEnrichCcy());
		hmDataMap.put(AlertConstants.KEY_ENRICH_SUBPROD_DESC, message.getEnrichSubProduct());
		hmDataMap.put(AlertConstants.KEY_ENRICH_COUNTRY_NAME, message.getEnrichCountryName());
		hmDataMap.put(AlertConstants.KEY_ENRICH_BANK_NAME, message.getEnrichBankName());
		hmDataMap.put(AlertConstants.KEY_ENRICH_BRANCH_NAME, message.getEnrichBranchName());
		logger.ctdebug("CTALT00182", hmDataMap);
		return hmDataMap;
	}

	/**
	 * This method handles all the insert operations to send the messages to the corresponding recipient's Inbox
	 * 
	 * @param msg - IMessage object that contains 
	 * @param listRecipients - ArrayList object that contains the list of User_No to deliver the message
	 * @param sSender - String value of the message sender User_No  
	 * @param sAlertId - String value of the Alert ID
	 * 
	 * @throws AlertHandlerException
	 */
	protected void send(IMessage msg, ArrayList listRecipients, String sSender, String sAlertId)
			throws AlertHandlerException
	{
		Message message = (Message) msg;
		logger.ctinfo("CTALT00184");
		InboxMessageRecipient inboxMessageRecipient = null;
		HashMap hmRecipientDataMap = null;
		InboxChannelInstruction inboxChannelInstruction = new InboxChannelInstruction();
		try
		{
			String sMessageId = inboxChannelInstruction.getMessageIDFromSequence();
			message.setMessageId(sMessageId);
			HashMap hmMessageDataMap = formMessageDataMap(message, sSender, sAlertId);
			logger.ctdebug("CTALT00185", hmMessageDataMap);
			// Go to the db and insert Message details in OD_MESSAGE
			inboxChannelInstruction.performMessageInsert(hmMessageDataMap);
			// Form arrayList of userIds
			ArrayList listUserIds = new ArrayList();
			List receipientDataMapList = new ArrayList();
			for (int i = 0; i < listRecipients.size(); i++)
			{
				inboxMessageRecipient = (InboxMessageRecipient) listRecipients.get(i);
				listUserIds.add(inboxMessageRecipient.getUserId());
				hmRecipientDataMap = formRecipientDataMap(message, inboxMessageRecipient);
				// Go to the db and insert Recipient details in OD_USER_MESSAGE
				receipientDataMapList.add(hmRecipientDataMap);
			}
			inboxChannelInstruction.performRecipientInsert(receipientDataMapList);
			logger.ctdebug("CTALT00186", listUserIds);
			// Go to the db and update USER_NEW_MSG_TRACKER table
			inboxChannelInstruction.newMessageRecieved(listUserIds);
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00187", dbEx);
			throw new AlertHandlerException(AlertConstants.ERR_ALERT_DB_EX,
					prptReader.retrieveProperty(AlertConstants.ERR_ALERT_DB_EX));
		}
		logger.ctdebug("CTALT00188");
		logger.ctdebug("CTALT00189");
		logger.ctinfo("CTALT00190");
	}

	/**
	 * This method is used to read message from the database for a particular message id and in the given locale. 
	 * 
	 * @param sMessageId - String value of the Message Id to be retrived
	 * @param sUserNo - String value of the User No
	 * @param sLocale - String value of Locale ID
	 * @return Message - Message Object that contains the message details for the given User_No and Message ID
	 * @throws AlertHandlerException
	 */
	public Message getMessage(String sMessageId, String sUserNo, String sLocale) throws AlertHandlerException
	{
		logger.ctinfo("CTALT00191");
		Message message = null;
		InboxChannelInstruction inboxChannelInstruction = new InboxChannelInstruction();
		logger.ctdebug("CTALT00192", sMessageId, sUserNo);
		try
		{
			// Go to the DB and fetch the message details for the given message id and user no
			message = inboxChannelInstruction.readMessage(sMessageId, sUserNo, sLocale, null);
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00194", dbEx, sMessageId);
			throw new AlertHandlerException(AlertConstants.ERR_ALERT_DB_EX,
					prptReader.retrieveProperty(AlertConstants.ERR_ALERT_DB_EX));
		}
		logger.ctdebug("CTALT00195", message);
		logger.ctinfo("CTALT00196");
		return message;
	}

	/**
	 * This method is used to read all the unread messages from the database for the given user id in the given Locale
	 * 
	 * @param UserId - String value of the User ID to get the unread message 
	 * @param sGCIFId - String value of the GCIF No 
	 * @param sLocale - String value of the Locale ID
	 * @return UnreadMessages - Array List object that contains the unread messages for the given User 
	 * 
	 * @throws AlertHandlerException
	 */
	public ArrayList getUnreadMessages(String sUserId, String sGCIFId, String sLocale) throws AlertHandlerException
	{
		logger.ctinfo("CTALT00197");
		ArrayList alistUnreadMessages = null;
		InboxChannelInstruction inboxChannelInstruction = new InboxChannelInstruction();
		logger.ctdebug("CTALT00198", sUserId, sGCIFId);
		try
		{
			// Go to the DB and fetch the unread messages for the given user id
			alistUnreadMessages = inboxChannelInstruction.getUnreadMessages(sUserId, sGCIFId, sLocale);
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00200", dbEx, sUserId);
			throw new AlertHandlerException(AlertConstants.ERR_ALERT_DB_EX,
					prptReader.retrieveProperty(AlertConstants.ERR_ALERT_DB_EX));
		}
		logger.ctdebug("CTALT00201", alistUnreadMessages);
		logger.ctinfo("CTALT00202");
		return alistUnreadMessages;
	}

	/**
	 * This method is used to read all the messages from the database for the given user id in the given locale 
	 * 
	 * @param UserId - String value of the User No
	 * @param sGCIFId - String value of the GCIF Id
	 * @param sLocale - String value of the Locale Id
	 * @return alistAllMessages - ArrayList object that contains all the messages for the user_No
	 * 
	 * @throws AlertHandlerException
	 */
	public ArrayList getAllMessages(String sUserId, String sGCIFId, String sLocale) throws AlertHandlerException
	{
		logger.ctinfo("CTALT00203");
		ArrayList alistAllMessages = null;
		InboxChannelInstruction inboxChannelInstruction = new InboxChannelInstruction();
		logger.ctdebug("CTALT00198", sUserId, sGCIFId);
		try
		{
			// Go to the DB and fetch all the messages for the given user id
			alistAllMessages = inboxChannelInstruction.getAllMessages(sUserId, sGCIFId, sLocale);
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00200", dbEx, sUserId);
			throw new AlertHandlerException(AlertConstants.ERR_ALERT_DB_EX,
					prptReader.retrieveProperty(AlertConstants.ERR_ALERT_DB_EX));
		}
		logger.ctdebug("CTALT00201", alistAllMessages);
		logger.ctinfo("CTALT00202");
		return alistAllMessages;
	}

	private static final Logger logger = Logger.getLogger(InboxChannelHandler.class);
	private static PropertyReader prptReader = AlertConstants.ALERT_PROPERTIES;

	/**
	 * This method sends the message as SMS to the recipients using the {@link SMSPostingManager}
	 * 
	 * @param event - Event object that contains the event details
	 * @param alertDetails - Alert Detail object that contains the Alert Data
	 * @param DataMap - Hashmap of the alert data with recipients details
	 * 
	 * @see com.intellectdesign.canvas.alert.handler.GenericChannelHandler#postMessage(com.intellectdesign.canvas.event.Event,
	 *      com.intellectdesign.canvas.alert.handler.AlertDetail, java.util.HashMap)
	 */
	public void postMessage(Event event, AlertDetail alertDetails, Map dataMap)
	{// CHCR

		List data = new ArrayList();
		data.add(dataMap);

		SMSPostingManager smsManager = new SMSPostingManager();

		smsManager.process(data);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.intellectdesign.canvas.shared.event.handler.alert.GenericChannelHandler#send(com.intellectdesign.canvas.shared.event.handler
	 * .alert.IMessage, com.intellectdesign.canvas.shared.event.handler.alert.IRecipient, java.lang.String, java.lang.String)
	 */
	@Override
	/**
	 * The core method which encapsulates the channel specific logic for sending messages 
	 * using appropriate methodologies for respective technologies. 
	 * This method should be overidden to dispatch the alert or notification to the appropriate 
	 * channel
	 * 
	 *  
	 * @param msg - Message object as understood by channel
	 * @param recipient - Recipient object of the recipients who would recieve the message. 
	 * @param sSender - String value of the sender User No
	 * @param sAlertId - String value of the Alert Id
	 * 
	 * @throws AlertHandlerException
	 * @see com.intellectdesign.canvas.alert.handler.GenericChannelHandler#send(com.intellectdesign.canvas.alert.handler.IMessage, com.intellectdesign.canvas.alert.handler.IRecipient, java.lang.String, java.lang.String)
	 */
	protected void send(com.intellectdesign.canvas.alert.handler.IMessage msg,
			com.intellectdesign.canvas.alert.handler.IRecipient recipient, String sSender, String sAlertId)
			throws AlertHandlerException
	{
		Message message = (Message) msg;
		InboxMessageRecipient inboxMessageRecipient = null;
		HashMap hmMessageDataMap = null;
		HashMap hmRecipientDataMap = null;
		InboxChannelInstruction inboxChannelInstruction = new InboxChannelInstruction();
		try
		{
			// Go to the db and get the message id from the sequence
			String sMessageId = inboxChannelInstruction.getMessageIDFromSequence();
			message.setMessageId(sMessageId);
			hmMessageDataMap = formMessageDataMap(message, sSender, sAlertId);
			if (recipient != null)
			{
				inboxMessageRecipient = (InboxMessageRecipient) recipient;
			} else
			{
				// If the recipient is null, Then the message has to be sent to all users
				inboxMessageRecipient = new InboxMessageRecipient();
				inboxMessageRecipient.setUserId(AlertConstants.ALL_USERS);
			}
			hmRecipientDataMap = formRecipientDataMap(message, inboxMessageRecipient);
			// Form arrayList of userIds
			ArrayList listUserIds = new ArrayList();
			listUserIds.add(inboxMessageRecipient.getUserId());

			// Go to the db and insert Message details in OD_MESSAGE
			inboxChannelInstruction.performMessageInsert(hmMessageDataMap);
			// Go to the db and insert Recipient details in OD_USER_MESSAGE
			inboxChannelInstruction.performRecipientInsert(hmRecipientDataMap);

			inboxChannelInstruction.newMessageRecieved(listUserIds);
		} catch (DatabaseException dbEx)
		{
			throw new AlertHandlerException(AlertConstants.ERR_ALERT_DB_EX,
					prptReader.retrieveProperty(AlertConstants.ERR_ALERT_DB_EX));
		}

	}

}
