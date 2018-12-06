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
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import com.intellectdesign.canvas.alert.handler.AlertConstants;
import com.intellectdesign.canvas.alert.handler.AlertHandlerException;
import com.intellectdesign.canvas.alert.handler.Message;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.database.PaginationModel;
import com.intellectdesign.canvas.database.SortingModel;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.preference.GlobalPreferencesUtil;
import com.intellectdesign.canvas.properties.reader.PropertyReader;

/**
 * This class is an Instruction class handling database related operations for Inbox Channel
 *  
 * @version 1.0
 */
public class InboxChannelInstruction
{
	/**
	 * This method fetches the details of the recipient given the recipients user id
	 * 
	 * @param listUserId
	 * @return List containing the details of the recipient
	 * @throws DatabaseException
	 */
	public List getRecipientInfo(ArrayList listUserId) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listRecipients = null;
		logger.ctinfo("CTALT00204");
		try
		{
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_RECIPIENT_DTLS);
			databaseRequest.addFilter(AlertConstants.USER_ID, listUserId);
			databaseResult = databaseRequest.execute();
			listRecipients = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00205", dbEx, listUserId);
			throw dbEx;
		}
		logger.ctdebug("CTALT00176", listRecipients);
		logger.ctinfo("CTALT00177");
		return listRecipients;
	}

	/**
	 * This method inserts the details of the message in the table OD_MESSAGE
	 * 
	 * @param hmMessageDataMap
	 * @throws DatabaseException
	 */
	public void performMessageInsert(HashMap hmMessageDataMap) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		logger.ctinfo("CTALT00206");
		try
		{
			// Insert all the details in the table OD_MESSAGE
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.INSERT);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_MESSAGE);
			databaseRequest.setData(hmMessageDataMap);
			databaseRequest.execute();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00207", dbEx);
			throw dbEx;
		}
		logger.ctinfo("CTALT00208");
	}

	/**
	 * This method inserts the Recipient details in the table OD_USER_MESSAGE
	 * 
	 * @param hmRecipientDataMap
	 * @throws DatabaseException
	 */
	public void performRecipientInsert(HashMap hmRecipientDataMap) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		logger.ctinfo("CTALT00209");
		try
		{
			// Insert all the details in the table OD_USER_MESSAGE
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.INSERT);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_RECIPIENT);
			databaseRequest.setData(hmRecipientDataMap);
			databaseRequest.execute();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00207", dbEx);
			throw dbEx;
		}
		logger.ctinfo("CTALT00208");
	}

	/**
	 * This method inserts the Recipient details in the table OD_USER_MESSAGE
	 * 
	 * @param receipientDataMapList
	 * @throws DatabaseException
	 */
	public void performRecipientInsert(List receipientDataMapList) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		logger.ctinfo("CTALT00209");
		try
		{
			// Insert all the details in the table OD_USER_MESSAGE
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.BATCH_INSERT);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_RECIPIENT);
			databaseRequest.setBatchData(receipientDataMapList);
			databaseRequest.execute();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00207", dbEx);
			throw dbEx;
		}
		logger.ctinfo("CTALT00209");
	}

	/**
	 * This method gets the messge id from the sequence OD_MESSGE_SEQUENCE
	 * 
	 * @return String - The message id
	 * @throws AlertHandlerException
	 */
	public String getMessageIDFromSequence() throws AlertHandlerException
	{
		return UUID.randomUUID().toString().concat(String.valueOf(new Date().getTime()));
	}

	/**
	 * This method is used to read message from the database for a particular message id and user Id. 
	 * 
	 * Throws exception if no message is found for the given id
	 * 
	 * @param sMessageId
	 * @param sUserId
	 * @param sLocale
	 * @param userTimezone
	 * @return List containing the details of the message
	 * @throws DatabaseException
	 */
	public Message readMessage(String sMessageId, String sUserId, String sLocale, String userTimezone)
			throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listMessage = null;
		Message message = null;
		HashMap hmMessageDetails = null;
		GlobalPreferencesUtil gpu = new GlobalPreferencesUtil();
		logger.ctinfo("CTALT00215", sMessageId, sUserId, sLocale);
		try
		{
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_MESSAGE_DTLS);
			databaseRequest.addFilter(AlertConstants.MESSAGE_ID, sMessageId);
			// Adding user id to Filter
			databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
			databaseRequest.addFilter(AlertConstants.LANG_ID, sLocale);
			databaseResult = databaseRequest.execute();
			listMessage = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00219", dbEx, sMessageId);
			throw dbEx;
		}
		logger.ctdebug("CTALT00220", listMessage);
		if (listMessage != null && !listMessage.isEmpty())
		{

			// Form Message Object
			hmMessageDetails = (HashMap) listMessage.get(0);
			if (userTimezone != null)
			{
				gpu.formatDateTime(hmMessageDetails, "STR_MESSAGE_TS", userTimezone, false);
			}
			InboxUtility inboxUtility = new InboxUtility();
			message = inboxUtility.formMessage(message, hmMessageDetails, sLocale, mChannelName);
		} else
		{
			logger.ctdebug("CTALT00221", sMessageId);

		}
		logger.ctdebug("CTALT00222", message);
		logger.ctinfo("CTALT00223");
		return message;
	}

	/**
	 * This method is used to read all the unread messages from the database for the given user id
	 * 
	 * @param UserId
	 * @param sGCIFId
	 * @param sLocale
	 * @return List containing the details of the messages
	 * @throws DatabaseException
	 */
	public ArrayList getUnreadMessages(String sUserId, String sGCIFId, String sLocale) throws DatabaseException
	{
		return getUnreadMessages(sUserId, sGCIFId, sLocale, null, createDefaultSortingModel());
	}

	/**
	 * This method is used to read all the unread messages from the database for the given user id
	 * 
	 * @param UserId
	 * @param sGCIFId
	 * @param sLocale
	 * @param pgModel
	 * @return List containing the details of the messages
	 * @throws DatabaseException
	 */
	public ArrayList getUnreadMessages(String sUserId, String sGCIFId, String sLocale, PaginationModel pgModel,
			SortingModel smModel) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listUnreadMessages = null;
		ArrayList alistUnreadMessages = null;
		Message message = null;
		HashMap hmMessageDetails = null;
		logger.ctinfo("CTALT00224");
		try
		{
			// Go to the DB and fetch the unread messages for all the given user id

			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_UNREAD_MESSAGE_DTLS);
			databaseRequest.addFilter(AlertConstants.USER_ID, String.valueOf(sUserId));
			databaseRequest.addFilter(AlertConstants.GCIF, String.valueOf(sGCIFId));
			databaseRequest.addFilter(AlertConstants.LANG_ID, sLocale);
			databaseRequest.setPaginationModel(pgModel);
			databaseRequest.setSortingModel(smModel);
			databaseResult = databaseRequest.execute();
			listUnreadMessages = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00225", dbEx, sUserId);
			throw dbEx;
		}
		logger.ctdebug("CTALT00226", listUnreadMessages);
		if (listUnreadMessages != null && !listUnreadMessages.isEmpty())
		{
			// Form ArrayList of message objects
			alistUnreadMessages = new ArrayList();
			for (int i = 0; i < listUnreadMessages.size(); i++)
			{
				hmMessageDetails = (HashMap) listUnreadMessages.get(i);
				// Form message object
				InboxUtility inboxUtility = new InboxUtility();
				message = inboxUtility.formMessage(message, hmMessageDetails, sLocale, mChannelName);
				alistUnreadMessages.add(message);
			}
		} else
		{
			logger.ctdebug("CTALT00227", sUserId);
		}
		logger.ctdebug("CTALT00228", alistUnreadMessages);
		logger.ctinfo("CTALT00229");
		return alistUnreadMessages;
	}

	/**
	 * This method is used to get the total count of unread messages from the database for the given user id
	 * 
	 * @param UserId
	 * @param sGCIFId
	 * @return unreadMsgCountInt
	 * @throws DatabaseException
	 */
	public Integer getUnreadMessagesCount(String sUserId, String sGCIFId) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listUnreadMessageCount = null;
		Integer unreadMsgCountInt = null;
		logger.ctinfo("CTALT00230");
		try
		{
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_MESSAGES_UNREAD_COUNT);
			databaseRequest.addFilter(AlertConstants.USER_ID, String.valueOf(sUserId));
			databaseRequest.addFilter(AlertConstants.GCIF, String.valueOf(sGCIFId));
			databaseResult = databaseRequest.execute();
			listUnreadMessageCount = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00231", dbEx, sUserId);
			throw dbEx;
		}
		if (listUnreadMessageCount != null && !listUnreadMessageCount.isEmpty())
		{
			unreadMsgCountInt = (Integer) listUnreadMessageCount.get(0);
		} else
		{
			logger.ctdebug("CTALT00216", sUserId);
		}
		logger.ctdebug("CTALT00233", unreadMsgCountInt);
		logger.ctinfo("CTALT00234");
		return unreadMsgCountInt;
	}

	/**
	 * This method is used to read all the messages from the database for the given user id
	 * 
	 * @param UserId
	 * @param sGCIFId
	 * @param sLocale
	 * @return List containing the details of the messages
	 * @throws DatabaseException
	 */
	public ArrayList getAllMessages(String sUserId, String sGCIFId, String sLocale) throws DatabaseException
	{

		return getAllMessages(sUserId, sGCIFId, sLocale, null, createDefaultSortingModel(), null);
	}

	/**
	 * This method is used to read all the messages from the database for the given user id
	 * 
	 * @param UserId
	 * @param sGCIFId
	 * @param sLocale
	 * @return List containing the details of the messages
	 * @throws DatabaseException
	 */
	public ArrayList getAllMessages(String sUserId, String sGCIFId, String sLocale, PaginationModel pgModel,
			SortingModel smModel, String userTimezone) throws DatabaseException
	{

		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listAllMessages = null;
		ArrayList alistAllMessages = null;
		Message message = null;
		HashMap hmMessageDetails = null;
		GlobalPreferencesUtil gpu = new GlobalPreferencesUtil();
		logger.ctinfo("CTALT00235");
		try
		{
			// Go to the DB and fetch all the messages for the given user id
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_ALL_MESSAGE_DTLS);
			databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
			databaseRequest.addFilter(AlertConstants.GCIF, sGCIFId);
			databaseRequest.addFilter(AlertConstants.LANG_ID, sLocale);
			databaseRequest.setPaginationModel(pgModel);
			databaseRequest.setSortingModel(smModel);
			databaseResult = databaseRequest.execute();
			listAllMessages = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00225", dbEx, sUserId);
			throw dbEx;
		}
		logger.ctdebug("CTALT00236", listAllMessages);
		if (listAllMessages != null && !listAllMessages.isEmpty())
		{
			// Form ArrayList of message objects
			alistAllMessages = new ArrayList();
			if (userTimezone != null)
			{

				gpu.formatDateTime((ArrayList) listAllMessages, "STR_MESSAGE_TS", userTimezone, false);
			}
			for (int i = 0; i < listAllMessages.size(); i++)
			{
				hmMessageDetails = (HashMap) listAllMessages.get(i);
				// Form message object
				InboxUtility inboxUtility = new InboxUtility();
				message = inboxUtility.formMessage(message, hmMessageDetails, sLocale, mChannelName);
				alistAllMessages.add(message);
			}
		} else
		{
			logger.ctdebug("CTALT00237", sUserId);
		}
		logger.ctdebug("CTALT00238", alistAllMessages);
		logger.ctinfo("CTALT00239");
		return alistAllMessages;
	}

	/**
	 * This method archives all the messages that are 2 months(60 days) old This method marks the "ARCHIVED_INDICATOR"
	 * to "Y"
	 * 
	 * @throws DatabaseException
	 */
	public void archiveMessages() throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		logger.ctinfo("CTALT00240");
		try
		{
			// Go to the DB and delete the message
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.UPDATE);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_ARCHIVE_MESSAGES);
			databaseRequest.execute();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00241", dbEx);
			throw dbEx;
		}
		logger.ctdebug("CTALT00242");
		logger.ctinfo("CTALT00243");
	}

	/**
	 * This method is used to read all the messages from the database for the given status and user id
	 * 
	 * @param UserId
	 * @param sGCIFId
	 * @param sStatus
	 * @param sLocale
	 * @return List containing the details of the messages
	 * @throws DatabaseException
	 */
	public ArrayList getAllMessagesForStatus(String sUserId, String sGCIFId, String sStatus, String sLocale,
			PaginationModel pgModel, SortingModel smModel) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listAllMessages = null;
		ArrayList alistAllMessages = null;
		Message message = null;
		HashMap hmMessageDetails = null;
		logger.ctinfo("CTALT00244");
		logger.ctdebug("CTALT00245", sUserId, sStatus);
		try
		{
			// Go to the DB and fetch the messages for the given status and user
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_ALL_MESSAGES_FOR_STATUS);
			databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
			databaseRequest.addFilter(AlertConstants.GCIF, sGCIFId);
			databaseRequest.addFilter(AlertConstants.LANG_ID, sLocale);
			databaseRequest.addFilter(AlertConstants.ACTIONED_INDICATOR, sStatus);
			databaseRequest.setPaginationModel(pgModel);
			databaseRequest.setSortingModel(smModel);
			databaseResult = databaseRequest.execute();
			listAllMessages = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00246", dbEx, sUserId);
			throw dbEx;
		}
		logger.ctdebug("CTALT00236", listAllMessages);
		if (listAllMessages != null && !listAllMessages.isEmpty())
		{
			// Form ArrayList of message objects
			alistAllMessages = new ArrayList();
			for (int i = 0; i < listAllMessages.size(); i++)
			{
				hmMessageDetails = (HashMap) listAllMessages.get(i);
				// Form message object
				InboxUtility inboxUtility = new InboxUtility();
				message = inboxUtility.formMessage(message, hmMessageDetails, sLocale, mChannelName);
				alistAllMessages.add(message);
			}
		} else
		{
			logger.ctdebug("CTALT00247", sUserId);
		}
		logger.ctdebug("CTALT00236", alistAllMessages);
		logger.ctinfo("CTALT00248");
		return alistAllMessages;
	}

	/**
	 * This method is used to read all the messages from the database for the given status and user id
	 * 
	 * @param UserId
	 * @param sGCIFId
	 * @param sStatus
	 * @param sLocale
	 * @return List containing the details of the messages
	 * @throws DatabaseException
	 */
	public ArrayList getAllMessagesForStatus(String sUserId, String sGCIFId, String sStatus, String sLocale)
			throws DatabaseException
	{
		return getAllMessagesForStatus(sUserId, sGCIFId, sStatus, sLocale, null, createDefaultSortingModel());
	}

	/**
	 * This method is used to read all the messages from the database for the given severity and user id irrespective of
	 * what the SEVERITY_HANDLED_IND is. Method returns null if no alerts found Valid sSeverity values are: 'High'
	 * 'Low' or 'Medium' Application to use Severity.HIGH, Severity.LOW OR Severity.MEDIUM.
	 * 
	 * @param sUserId
	 * @param sGCIFId
	 * @param sSeverity
	 * @param sLocale
	 * @return ArrayList containing the details of the messages
	 * @throws DatabaseException
	 */
	public ArrayList getAllMessagesForSeverity(String sUserId, String sGCIFId, String sSeverity, String sLocale,
			PaginationModel pgModel, SortingModel smModel, String userTimezone) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listAllMessages = null;
		ArrayList alistAllMessages = null;
		Message message = null;
		HashMap hmMessageDetails = null;
		GlobalPreferencesUtil gpu = new GlobalPreferencesUtil();
		logger.ctinfo("CTALT00249");
		logger.ctdebug("CTALT00250", sUserId, sSeverity);
		try
		{
			// Go to the DB and fetch the messages for the given severity and user
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_ALL_MESSAGES_FOR_SEVERITY);
			databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
			databaseRequest.addFilter(AlertConstants.GCIF, sGCIFId);
			databaseRequest.addFilter(AlertConstants.LANG_ID, sLocale);
			databaseRequest.addFilter(AlertConstants.SEVERITY, sSeverity);
			databaseRequest.setPaginationModel(pgModel);
			databaseRequest.setSortingModel(smModel);
			databaseResult = databaseRequest.execute();
			listAllMessages = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00251", dbEx, sUserId);
			throw dbEx;
		}
		logger.ctdebug("CTALT00236", listAllMessages);
		if (listAllMessages != null && !listAllMessages.isEmpty())
		{
			// Form ArrayList of message objects
			alistAllMessages = new ArrayList();
			if (userTimezone != null)
			{

				gpu.formatDateTime((ArrayList) listAllMessages, "STR_MESSAGE_TS", userTimezone, false);
			}
			for (int i = 0; i < listAllMessages.size(); i++)
			{
				hmMessageDetails = (HashMap) listAllMessages.get(i);
				// Form message object
				InboxUtility inboxUtility = new InboxUtility();
				message = inboxUtility.formMessage(message, hmMessageDetails, sLocale, mChannelName);
				alistAllMessages.add(message);
			}
		} else
		{
			logger.ctdebug("CTALT00252", sUserId);
		}
		logger.ctdebug("CTALT00238", alistAllMessages);
		logger.ctinfo("CTALT00253");
		return alistAllMessages;
	}

	/**
	 * This method is used to read all the messages from the database for the given severity and user id irrespective of
	 * what the SEVERITY_HANDLED_IND is. Method returns null if no alerts found Valid sSeverity values are: 'High',
	 * 'Low' or 'Medium' Application to use Severity.HIGH, Severity.LOW OR Severity.MEDIUM.
	 * 
	 * @param sUserId
	 * @param sGCIFId
	 * @param sSeverity
	 * @param sLocale
	 * @return ArrayList containing the details of the messages
	 * @throws DatabaseException
	 */
	public ArrayList getAllMessagesForSeverity(String sUserId, String sGCIFId, String sSeverity, String sLocale)
			throws DatabaseException
	{
		return getAllMessagesForSeverity(sUserId, sGCIFId, sSeverity, sLocale, null, createDefaultSortingModel(), null);
	}

	/**
	 * This method is used to get all messages for Notification based on parameters passed
	 * 
	 * @param sUserId
	 * @param sGCIFId
	 * @param sNotification
	 * @param sLocale
	 * @param pgModel
	 * @param smModel
	 * @param userTimezone
	 * @return alistAllMessages
	 * @throws DatabaseException
	 */
	public ArrayList getAllMessagesForNotification(String sUserId, String sGCIFId, String sNotification,
			String sLocale, PaginationModel pgModel, SortingModel smModel, String userTimezone)
			throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listAllMessages = null;
		ArrayList alistAllMessages = null;
		Message message = null;
		HashMap hmMessageDetails = null;
		GlobalPreferencesUtil gpu = new GlobalPreferencesUtil();
		logger.ctinfo("CTALT00254");
		logger.ctdebug("CTALT00255", sUserId, sNotification);
		try
		{
			// Go to the DB and fetch the messages for the given severity and user
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_ALL_MESSAGES_FOR_NOTIFICATION);
			databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
			databaseRequest.addFilter(AlertConstants.GCIF, sGCIFId);
			databaseRequest.addFilter(AlertConstants.LANG_ID, sLocale);
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, sNotification);
			databaseRequest.setPaginationModel(pgModel);
			databaseRequest.setSortingModel(smModel);
			databaseResult = databaseRequest.execute();
			listAllMessages = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00251", dbEx, sUserId);
			throw dbEx;
		}
		logger.ctdebug("CTALT00236", listAllMessages);
		if (listAllMessages != null && !listAllMessages.isEmpty())
		{
			// Form ArrayList of message objects
			alistAllMessages = new ArrayList();
			if (userTimezone != null)
			{

				gpu.formatDateTime((ArrayList) listAllMessages, "STR_MESSAGE_TS", userTimezone, false);
			}
			for (int i = 0; i < listAllMessages.size(); i++)
			{
				hmMessageDetails = (HashMap) listAllMessages.get(i);
				// Form message object
				InboxUtility inboxUtility = new InboxUtility();
				message = inboxUtility.formMessage(message, hmMessageDetails, sLocale, mChannelName);
				alistAllMessages.add(message);
			}
		} else
		{
			logger.ctdebug("CTALT00256", sUserId);
		}
		logger.ctdebug("CTALT00238", alistAllMessages);
		logger.ctinfo("CTALT00257");
		return alistAllMessages;
	}

	/**
	 * This method is used to read all the messages from the database for the given notification and user id
	 * irrespective of Method returns null if no alerts found for Valid sNotification
	 * 
	 * 
	 * @param sUserId
	 * @param sGCIFId
	 * @param sNotification
	 * @param sLocale
	 * @return ArrayList containing the details of the messages
	 * @throws DatabaseException
	 */
	public ArrayList getAllMessagesForNotification(String sUserId, String sGCIFId, String sNotification, String sLocale)
			throws DatabaseException
	{
		return getAllMessagesForNotification(sUserId, sGCIFId, sNotification, sLocale, null,
				createDefaultSortingModel(), null);
	}

	/**
	 * This method is used to get all messages for SubProdCode based on parameters passed
	 * 
	 * @param sUserId
	 * @param sGCIFId
	 * @param sSubProdCode
	 * @param sLocale
	 * @param pgModel
	 * @param smModel
	 * @param userTimezone
	 * @return alistAllMessages
	 * @throws DatabaseException
	 */
	public ArrayList getAllMessagesForSubProdCode(String sUserId, String sGCIFId, String sSubProdCode, String sLocale,
			PaginationModel pgModel, SortingModel smModel, String userTimezone) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listAllMessages = null;
		ArrayList alistAllMessages = null;
		Message message = null;
		HashMap hmMessageDetails = null;
		String oldDateValue = null;
		String actualtimeZoneId = null;
		GlobalPreferencesUtil gpu = new GlobalPreferencesUtil();
		logger.ctinfo("CTALT00258");
		logger.ctdebug("CTALT00259", sUserId, sSubProdCode);
		try
		{
			// Go to the DB and fetch the messages for the given severity and user
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_ALL_MESSAGES_FOR_SEVERITY);
			databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
			databaseRequest.addFilter(AlertConstants.GCIF, sGCIFId);
			databaseRequest.addFilter(AlertConstants.LANG_ID, sLocale);
			databaseRequest.addFilter(AlertConstants.SUB_PRODUCT_CODE, sSubProdCode);
			databaseRequest.setPaginationModel(pgModel);
			databaseRequest.setSortingModel(smModel);
			databaseResult = databaseRequest.execute();
			listAllMessages = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00251", dbEx, sUserId);
			throw dbEx;
		}
		logger.ctdebug("CTALT00236" + listAllMessages);
		if (listAllMessages != null && !listAllMessages.isEmpty())
		{
			// Form ArrayList of message objects
			alistAllMessages = new ArrayList();

			actualtimeZoneId = (userTimezone == null) ? "" : gpu.getInternalTimeZoneId(userTimezone);

			for (int i = 0; i < listAllMessages.size(); i++)
			{
				hmMessageDetails = (HashMap) listAllMessages.get(i);
				oldDateValue = (String) hmMessageDetails.get("STR_MESSAGE_TS");
				hmMessageDetails.put("STR_MESSAGE_TS", gpu.formatDateTime(oldDateValue, actualtimeZoneId, false));
				// Form message object
				InboxUtility inboxUtility = new InboxUtility();
				message = inboxUtility.formMessage(message, hmMessageDetails, sLocale, mChannelName);
				alistAllMessages.add(message);
			}

		} else
		{
			logger.ctdebug("CTALT00256", sUserId);
		}
		logger.ctdebug("CTALT00238", alistAllMessages);
		logger.ctinfo("CTALT00257");
		return alistAllMessages;
	}

	/**
	 * This method is used to read all the messages from the database for the given notification and user id
	 * irrespective of Method returns null if no alerts found for Valid sNotification
	 * 
	 * 
	 * @param sUserId
	 * @param sGCIFId
	 * @param sNotification
	 * @param sLocale
	 * @return ArrayList containing the details of the messages
	 */
	public ArrayList getAllMessagesForSubProdCode(String sUserId, String sGCIFId, String sSubProdCode, String sLocale)
			throws DatabaseException
	{
		return getAllMessagesForSubProdCode(sUserId, sGCIFId, sSubProdCode, sLocale, null, createDefaultSortingModel(),
				null);
	}

	/**
	 * This method is used for getting all messages for Date based on parameters passed, specially sDAte1,sDate2 and
	 * sComparison
	 * 
	 * @param sUserId
	 * @param sGCIFId
	 * @param sDate1
	 * @param sDate2
	 * @param sComparison
	 * @param sLocale
	 * @param pgModel
	 * @param smModel
	 * @param userTimezone
	 * @return alistAllMessages
	 * @throws DatabaseException
	 */
	public ArrayList getAllMessagesForDate(String sUserId, String sGCIFId, String sDate1, String sDate2,
			String sComparison, String sLocale, PaginationModel pgModel, SortingModel smModel, String userTimezone)
			throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listAllMessages = null;
		ArrayList alistAllMessages = null;
		Message message = null;
		HashMap hmMessageDetails = null;
		GlobalPreferencesUtil gpu = new GlobalPreferencesUtil();
		logger.ctinfo("CTALT00260");
		logger.ctdebug("CTALT00264", sUserId, sDate1, sDate2, sComparison);
		try
		{
			// Go to the DB and fetch the messages
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_ALL_MESSAGES_FOR_DATE + sComparison);
			databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
			databaseRequest.addFilter(AlertConstants.GCIF, sGCIFId);
			databaseRequest.addFilter(AlertConstants.LANG_ID, sLocale);
			databaseRequest.addFilter(AlertConstants.DATE1, sDate1);
			if (AlertConstants.RANGE.equals(sComparison))
				databaseRequest.addFilter(AlertConstants.DATE2, sDate2);
			databaseRequest.setPaginationModel(pgModel);
			databaseRequest.setSortingModel(smModel);
			databaseResult = databaseRequest.execute();
			listAllMessages = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00265", dbEx, sUserId);
			throw dbEx;
		}
		logger.ctdebug("CTALT00236", listAllMessages);
		if (listAllMessages != null && !listAllMessages.isEmpty())
		{
			// Form ArrayList of message objects
			alistAllMessages = new ArrayList();
			if (userTimezone != null)
			{
				gpu.formatDateTime((ArrayList) listAllMessages, "STR_MESSAGE_TS", userTimezone, false);
			}
			for (int i = 0; i < listAllMessages.size(); i++)
			{
				hmMessageDetails = (HashMap) listAllMessages.get(i);
				// Form message object
				InboxUtility inboxUtility = new InboxUtility();
				message = inboxUtility.formMessage(message, hmMessageDetails, sLocale, mChannelName);
				alistAllMessages.add(message);
			}
		} else
		{
			logger.ctdebug("CTALT00261", sUserId);
		}
		logger.ctdebug("CTALT00238", alistAllMessages);
		logger.ctinfo("CTALT00262");
		return alistAllMessages;
	}

	/**
	 * This method is used to read all the messages from the database with the given date range (using the comparison
	 * operator) and user id in the given locale Returns null if there are no messages in the given date range The
	 * should be in (dd/MM/yyyy) format The Comparison Operator should be either of the following
	 * AlertConstans.GREATER_THAN, AlertConstans.LESS_THAN, AlertConstans.EQUAL_TO,
	 * AlertConstans.GREATER_THAN_OR_EQUAL_TO, AlertConstans.LESS_THAN_OR_EQUAL_TO, AlertConstans.NOT_EQUAL_TO,
	 * AlertConstants.RANGE If AlertConstants.RANGE is the comparison operator, then both sDate1 and sDate2 are used.
	 * 
	 * @param UserId
	 * @param sGCIFId
	 * @param sDate1 in (dd/MM/yyyy) format
	 * @param sDate2 in (dd/MM/yyyy) format
	 * @param sComparison
	 * @param sLocale
	 * @return
	 */
	public ArrayList getAllMessagesForDate(String sUserId, String sGCIFId, String sDate1, String sDate2,
			String sComparison, String sLocale) throws DatabaseException
	{
		return getAllMessagesForDate(sUserId, sGCIFId, sDate1, sDate2, sComparison, sLocale, null,
				createDefaultSortingModel(), null);
	}

	public ArrayList fetchUnHandledAlertsForSeverity(String sSeverity, String sUserId, String sGCIFId, String sLocale)
			throws DatabaseException
	{
		return fetchUnHandledAlertsForSeverity(sSeverity, sUserId, sGCIFId, sLocale, null, createDefaultSortingModel());
	}

	/**
	 * This method returns all messages where SEVERITY = 'sSeverity' and SEVERITY_HANDLED_IND IS NULL Method returns null
	 * if no message is found Valid sSeverity values are: 'High', 'Low' or 'Medium' Application to use Severity.HIGH,
	 * Severity.LOW OR Severity.MEDIUM.
	 * 
	 * @param sSeverity
	 * @param sUserId
	 * @param sGCIFId
	 * @return
	 * @throws DatabaseException
	 */
	public ArrayList fetchUnHandledAlertsForSeverity(String sSeverity, String sUserId, String sGCIFId, String sLocale,
			PaginationModel pgModel, SortingModel smModel) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listAllMessages = null;
		ArrayList alistAllMessages = null;
		Message message = null;
		HashMap hmMessageDetails = null;
		logger.ctinfo("CTALT00263");
		logger.ctdebug("CTALT00250", sUserId, sSeverity);
		try
		{
			// Go to the DB and fetch the messages for the given severity and user
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_UNHANDLED_MESSAGES_FOR_SEVERITY);
			databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
			databaseRequest.addFilter(AlertConstants.GCIF, sGCIFId);
			databaseRequest.addFilter(AlertConstants.LANG_ID, sLocale);
			databaseRequest.addFilter(AlertConstants.SEVERITY, sSeverity);
			databaseRequest.setPaginationModel(pgModel);
			databaseRequest.setSortingModel(smModel);
			databaseResult = databaseRequest.execute();
			listAllMessages = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00251", dbEx, sUserId);
			throw dbEx;
		}
		logger.ctdebug("CTALT00236", listAllMessages);
		if (listAllMessages != null && !listAllMessages.isEmpty())
		{
			// Form ArrayList of message objects
			alistAllMessages = new ArrayList();
			for (int i = 0; i < listAllMessages.size(); i++)
			{
				hmMessageDetails = (HashMap) listAllMessages.get(i);
				// Form message object
				InboxUtility inboxUtility = new InboxUtility();
				message = inboxUtility.formMessage(message, hmMessageDetails, sLocale, mChannelName);
				alistAllMessages.add(message);
			}
		} else
		{
			logger.ctdebug("CTALT00252", sUserId);
		}
		logger.ctdebug("CTALT00238", alistAllMessages);
		logger.ctinfo("CTALT00267");
		return alistAllMessages;
	}

	/**
	 * This method returns true if USER_NEW_MSG_TRACKER.NEW_MSG_RECIEVED_TS > USER_NEW_MSG_TRACKER.MSG_ACCESSED_TS for
	 * the given user and gcif. Else this method returns false
	 * 
	 * @param sUserId
	 * @param sGCIF
	 * @return
	 * @throws DatabaseException
	 */
	public boolean checkForNewAlerts(String sUserId, String sGCIF) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listResult = null;
		HashMap hmResult = null;
		boolean bResult = false;
		logger.ctinfo("CTALT00268");
		try
		{
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_CHECK_DATES);
			databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
			databaseResult = databaseRequest.execute();
			listResult = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00269", dbEx, sUserId);
			throw dbEx;
		}
		logger.ctdebug("CTALT00270", listResult);
		if (listResult != null && !listResult.isEmpty())
		{
			hmResult = (HashMap) listResult.get(0);
			if ("Y".equals(hmResult.get(AlertConstants.CHECK_RESULT)))
			{
				bResult = true;
			} else
			{
				bResult = false;
			}
		} else
		{
			logger.ctdebug("CTALT00271");

		}
		logger.ctdebug("CTALT00272", bResult);
		logger.ctinfo("CTALT00273");
		return bResult;
	}

	/**
	 * Sets OD_USER_MESSAGE.SEVERITY_HANDLED_IND = 'Y' for all message ids in input list.
	 * 
	 * @param listMessageIds
	 * @param sUserId
	 * @param sGCIF
	 * @throws DatabaseException
	 */
	public void markMessagesAsSeverityHandled(List listMessageIds, String sUserId, String sGCIF)
			throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		logger.ctinfo("CTALT00274");
		String[] sMessageIds = null;
		if (listMessageIds != null && !listMessageIds.isEmpty())
		{
			sMessageIds = new String[listMessageIds.size()];
			for (int i = 0; i < listMessageIds.size(); i++)
			{
				sMessageIds[i] = (String) listMessageIds.get(i);
			}
			logger.ctdebug("CTALT00275", Arrays.toString(sMessageIds));
			try
			{
				// Go to the DB and delete the message
				databaseRequest = new CanvasDatabaseRequest();
				databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
				databaseRequest.setOperation(DatabaseConstants.UPDATE);
				databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_MARK_MSGS_AS_SEVERITY_HANDLED);
				databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
				databaseRequest.addFilter(AlertConstants.GCIF, sGCIF);
				databaseRequest.addFilter(AlertConstants.MESSAGE_ID, sMessageIds);
				databaseRequest.execute();
			} catch (DatabaseException dbEx)
			{
				logger.cterror("CTALT00276", dbEx);
				throw dbEx;
			}
			logger.ctdebug("CTALT00277");
		} else
		{
			logger.cterror("CTALT00278");
		}
		logger.ctinfo("CTALT00279");
	}

	/**
	 * Method sets USER_NEW_MSG_TRACKER.MSG_ACCESSED_TS to SYSDATE If no record found: log as issue but do not throw any
	 * exception.
	 * 
	 * @param sUserNo
	 * @throws DatabaseException
	 */
	public void setUserAccessTime(String sUserId) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		logger.ctinfo("CTALT00280");
		int intRowsAffected = 0;
		try
		{
			// Go to the DB and set the user access time
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.UPDATE);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_SET_USER_ACCESS_TIME);
			databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
			databaseResult = databaseRequest.execute();
			intRowsAffected = databaseResult.getNoOfRowsAffected();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00281", dbEx, sUserId);
			throw dbEx;
		}
		if (intRowsAffected < 1)
		{
			logger.cterror("CTALT00282");
		} else
		{
			logger.ctdebug("CTALT00283 ");
		}
		logger.ctinfo("CTALT00284");
	}

	/**
	 * Method deletes records in USER_NEW_MSG_TRACKER where USER_NEW_MSG_TRACKER.USER_NO in listUsers Then Insert into
	 * USER_NEW_MSG_TRACKER values (USER_NO = listUsers.get(i) and NEW_MSG_RECIEVED_TS: DATE = SYSDATE and
	 * MSG_ACCESSED_TS = null)
	 * 
	 * @param listUsers
	 * @throws DatabaseException
	 */
	public void newMessageRecieved(List listUsers) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		logger.ctinfo("CTALT00285");
		String sUserId = null;
		ArrayList listUserDtls = new ArrayList();
		if (listUsers != null && !listUsers.isEmpty())
		{
			logger.ctdebug("CTALT00286", listUsers.size());
			try
			{
				// Go to the DB and delete the records for the users
				databaseRequest = new CanvasDatabaseRequest();
				databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
				databaseRequest.setOperation(DatabaseConstants.DELETE);
				databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_NEW_MSG_TRACKER_RECORDS);
				databaseRequest.addFilter(AlertConstants.USER_ID, listUsers.toArray());
				databaseRequest.execute();

				// Insert records for all users
				for (int i = 0; i < listUsers.size(); i++)
				{
					sUserId = (String) listUsers.get(i);
					HashMap hmUserMap = new HashMap();
					hmUserMap.put(AlertConstants.USER_ID, sUserId);
					logger.ctdebug("CTALT00287", sUserId, hmUserMap);
					listUserDtls.add(hmUserMap);
				}
				// Go to the DB and insert the data
				databaseRequest = new CanvasDatabaseRequest();
				databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
				databaseRequest.setOperation(DatabaseConstants.BATCH_INSERT);
				databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_NEW_MSG_TRACKER);
				databaseRequest.setBatchData(listUserDtls);
				databaseRequest.execute();
			} catch (DatabaseException dbEx)
			{
				logger.cterror("CTALT00288", dbEx);
				throw dbEx;
			}
			logger.ctdebug("CTALT00289");
		} else
		{
			logger.cterror("CTALT00271");
		}
		logger.ctinfo("CTALT00290");
	}

	/**
	 * This method mark a message as read if the MsgId is found. If not, this it will not do anything
	 * 
	 * @param listMessageIds
	 * @param mailId
	 * @throws DatabaseException
	 */
	public boolean markMailAsRead(String mailId) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		boolean isUpdated = false;

		HashMap filterMap = new HashMap();
		filterMap.put("MAIL_ID", mailId);
		logger.ctinfo("CTALT00291");
		if (mailId != null && mailId.trim().length() > 0)
		{
			try
			{
				databaseRequest = new CanvasDatabaseRequest();
				databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
				databaseRequest.setOperation(DatabaseConstants.UPDATE);
				databaseRequest.setOperationExtension("UPDATE_MAIL_STATUS_AS_READ");
				databaseRequest.setData(filterMap);
				databaseRequest.execute();
			} catch (DatabaseException dbEx)
			{
				logger.cterror("CTALT00292", dbEx);
				throw dbEx;
			}
			logger.ctdebug("CTALT00293");
			isUpdated = true;
		} else
		{
			logger.cterror("CTALT00294");
		}

		logger.ctinfo("CTALT00295");
		return isUpdated;
	}

	/**
	 * This method mark a message as read if the userId is found. If not, this it will not do anything
	 * 
	 * @param listMessageIds
	 * @param userId
	 * @throws DatabaseException
	 */
	public boolean markMailAsRead(String mailId, String userId) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		boolean isUpdated = false;

		HashMap filterMap = new HashMap();
		filterMap.put("MAIL_ID", mailId);
		filterMap.put("USER_ID", userId);
		logger.ctdebug("CTALT00296", userId);
		logger.ctinfo("CTALT00297");
		if (mailId != null && mailId.trim().length() > 0)
		{
			try
			{
				databaseRequest = new CanvasDatabaseRequest();
				databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
				databaseRequest.setOperation(DatabaseConstants.UPDATE);
				databaseRequest.setOperationExtension("UPDATE_MAIL_STATUS_AS_READ");
				databaseRequest.setData(filterMap);
				databaseRequest.execute();
			} catch (DatabaseException dbEx)
			{
				logger.cterror("CTALT00298", dbEx);
				throw dbEx;
			}
			logger.ctdebug("CTALT00299");
			isUpdated = true;
		} else
		{
			logger.cterror("CTALT00294");
		}

		logger.ctinfo("CTALT00300");
		return isUpdated;
	}

	/**
	 * This method mark a message as read if the MsgId is found. If not, this it will not do anything
	 * 
	 * @param listMessageIds
	 * @param sUserId
	 * @param sGCIF
	 * @throws DatabaseException
	 */
	public void markMessagesAsRead(ArrayList listMessageIds, String sUserId, String sGCIF) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		logger.ctinfo("CTALT00301");
		if (listMessageIds != null && !listMessageIds.isEmpty())
		{
			try
			{
				// Go to the DB and delete the message
				databaseRequest = new CanvasDatabaseRequest();
				databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
				databaseRequest.setOperation(DatabaseConstants.UPDATE);
				databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_MARK_MSGS_AS_READ);
				databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
				databaseRequest.addFilter(AlertConstants.GCIF, sGCIF);
				databaseRequest.addFilter(AlertConstants.MESSAGE_ID, listMessageIds.toArray());
				databaseRequest.execute();
			} catch (DatabaseException dbEx)
			{
				logger.cterror("CTALT00302", dbEx);
				throw dbEx;
			}
			logger.ctdebug("CTALT00303");
		} else
		{
			logger.cterror("CTALT00304");
		}
		logger.ctinfo("CTALT00305");
	}

	/**
	 * This method mark a message as deleted if the MsgId is found. If not, this it will not do anything
	 * 
	 * @param listMessageIds
	 * @param sUserId
	 * @param sGCIF
	 * @throws DatabaseException
	 */
	public void markMessagesAsDeleted(ArrayList listMessageIds, String sUserId, String sGCIF, String buttonId)
			throws DatabaseException// DIT_715
	{
		DatabaseRequest databaseRequest = null;
		logger.ctinfo("CTALT00306");
		if (listMessageIds != null && !listMessageIds.isEmpty())
		{
			try
			{
				// Go to the DB and delete the message
				databaseRequest = new CanvasDatabaseRequest();
				databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
				databaseRequest.setOperation(DatabaseConstants.UPDATE);
				/*
				 * If the message is deleted from Alerts/Notifications widget the status will be updated to 'Y'; if the
				 * message is deleted from the View Trash widget then the status will be updated to 'T' -
				 */
				if (buttonId.equals("alerts"))
				{
					databaseRequest.addFilter(AlertConstants.STATUS, "Y");
				} else if (buttonId.equals("trashalerts"))
				{
					databaseRequest.addFilter(AlertConstants.STATUS, "T");
				}
				databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_UPDATE_MSG_STATUS);

				databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
				databaseRequest.addFilter(AlertConstants.GCIF, sGCIF);
				databaseRequest.addFilter(AlertConstants.MESSAGE_ID, listMessageIds.toArray());
				databaseRequest.execute();
			} catch (DatabaseException dbEx)
			{
				logger.cterror("CTALT00307", dbEx);
				throw dbEx;
			}
			logger.ctdebug("CTALT00308");
		} else
		{
			logger.cterror("CTALT00309");
		}
		logger.ctinfo("CTALT00310");
	}

	/**
	 * This method will restore deleted messages if the MsgId is found. If not, this it will do nothing
	 * 
	 * @param listMessageIds
	 * @param sUserId
	 * @param sGCIF
	 * @throws DatabaseException
	 */
	public void restoreDeletedMsgs(ArrayList listMessageIds, String sUserId, String sGCIF) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		logger.ctinfo("CTALT00311");
		if (listMessageIds != null && !listMessageIds.isEmpty())
		{
			try
			{
				databaseRequest = new CanvasDatabaseRequest();
				databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
				databaseRequest.setOperation(DatabaseConstants.UPDATE);
				databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_UPDATE_MSG_STATUS);
				databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
				databaseRequest.addFilter(AlertConstants.GCIF, sGCIF);
				databaseRequest.addFilter(AlertConstants.MESSAGE_ID, listMessageIds.toArray());
				databaseRequest.addFilter(AlertConstants.STATUS, "N");
				databaseRequest.execute();
			} catch (DatabaseException dbEx)
			{
				logger.cterror("CTALT00312", dbEx);
				throw dbEx;
			}
			logger.ctdebug("CTALT00313");
		} else
		{
			logger.cterror("CTALT00314");
		}
		logger.ctinfo("CTALT00315");
	}

	/**
	 * This method mark a message as actioned if the MsgId is found. If not, this it will not do anything
	 * 
	 * @param listMessageIds
	 * @param sUserId
	 * @param sGCIF
	 * @throws DatabaseException
	 */
	public void markMessagesAsActioned(ArrayList listMessageIds, String sUserId, String sGCIF) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		logger.ctinfo("CTALT00316");
		if (listMessageIds != null && !listMessageIds.isEmpty())
		{
			try
			{
				// Go to the DB and delete the message
				databaseRequest = new CanvasDatabaseRequest();
				databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
				databaseRequest.setOperation(DatabaseConstants.UPDATE);
				databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_MARK_MSGS_AS_ACTIONED);
				databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
				databaseRequest.addFilter(AlertConstants.GCIF, sGCIF);
				databaseRequest.addFilter(AlertConstants.MESSAGE_ID, listMessageIds.toArray());
				databaseRequest.execute();
			} catch (DatabaseException dbEx)
			{
				logger.cterror("CTALT00317", dbEx);
				throw dbEx;
			}
			logger.ctdebug("CTALT00318");
		} else
		{
			logger.cterror("CTALT00319");
		}
		logger.ctinfo("CTALT00320");
	}

	/**
	 * This method is used to get the UnRead Alerts from DataBase based on parameters passed
	 * 
	 * @param transCode
	 * @param sessionId
	 * @return listAlertId
	 * @throws DatabaseException
	 */
	public List getUnreadAlert(String transCode, String sessionId) throws DatabaseException// CHCR
	{
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listAlertId = null;
		logger.ctinfo("CTALT00321");
		try
		{
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.GET_EVENT_ID);
			databaseRequest.addFilter(AlertConstants.TRANS_CODE, transCode);
			databaseResult = databaseRequest.execute();
			listAlertId = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00322", dbEx, transCode);
			throw dbEx;
		}
		logger.ctdebug("CTALT00323", listAlertId);
		return listAlertId;

	}

	/**
	 * This method is used to get Urgent Normal Alert Count based on parameters passed
	 * 
	 * @param sUserId
	 * @param sGcif
	 * @return list
	 * @throws DatabaseException
	 */
	public List getUrgentNormalAlertCount(String sUserId, String sGcif) throws DatabaseException
	{
		return getUrgentNormalAlertAndNotificationCount(sUserId, sGcif);
	}

	/**
	 * This method is used to get Urgent Normal Notification Count based on parameters passed
	 * 
	 * @param sUserId
	 * @param sGcif
	 * @return list
	 * @throws DatabaseException
	 */
	public List getUrgentNormalNotificationCount(String sUserId, String sGcif) throws DatabaseException
	{
		return getUrgentNormalAlertAndNotificationCount(sUserId, sGcif);
	}

	/**
	 * Tis method is used to get Urgent Normal Alert And Notification Count from DataBase using parameters passed
	 * 
	 * @param sUserId
	 * @param sGcif
	 * @return listResult
	 * @throws DatabaseException
	 */
	public List getUrgentNormalAlertAndNotificationCount(String sUserId, String sGcif) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listResult = null;
		logger.ctinfo("CTALT00324");
		try
		{
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension("GET_UNREAD_URGENT_NORMAL_ALERT_NOTIFICATION_COUNTS");
			databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
			databaseRequest.addFilter(AlertConstants.GCIF, sGcif);
			databaseResult = databaseRequest.execute();
			listResult = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00325", dbEx, sUserId);
			throw dbEx;
		}
		logger.ctdebug("CTALT00326", listResult);
		return listResult;
	}

	/**
	 * This method is used to get Urgent Normal Message Count through DataBase Request
	 * 
	 * @param sUserId
	 * @param sGcif
	 * @return listResult
	 * @throws DatabaseException
	 */
	public List getUrgentNormalMessageCount(String sUserId, String sGcif) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listResult = null;
		logger.ctinfo("CTALT00327");
		try
		{
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.MESSAGE_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension("GET_UNREAD_URGENT_NORMAL_MESSAGE_COUNTS");
			databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
			databaseRequest.addFilter(AlertConstants.GCIF, sGcif);

			databaseResult = databaseRequest.execute();
			listResult = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00325", dbEx, sUserId);
			throw dbEx;
		}
		logger.ctdebug("CTALT00326", listResult);
		return listResult;
	}

	/**
	 * Creates a sorting model object
	 * 
	 * @param sortField
	 * @param sortOrder
	 * @return SortingModel
	 */
	private SortingModel createSortingModelUsing(String sortField, String sortOrder)
	{
		List<String> sortableFields = new ArrayList<String>();
		sortableFields.add(AlertConstants.MESSAGE_TS);
		return new SortingModel(sortField, sortOrder, AlertConstants.MESSAGE_TS, sortableFields);
	}

	/**
	 * Creates a default sorting model object
	 * 
	 * @return SortingModel
	 */
	private SortingModel createDefaultSortingModel()
	{
		return createSortingModelUsing(AlertConstants.MESSAGE_TS, SortingModel.SORT_DIRECTION_DESCENDING);
	}

	/**
	 * This method is used to read all the messages from the database for the given user id
	 * 
	 * @param UserId
	 * @param sGCIFId
	 * @param sLocale
	 * @return List containing the details of the messages
	 * @throws DatabaseException
	 */
	public ArrayList getUnreadMessagesForSeverity(String sUserId, String sGCIFId, String severity, String sLocale,
			PaginationModel pgModel, SortingModel smModel, String userTimezone) throws DatabaseException
	{

		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listAllMessages = null;
		ArrayList alistAllMessages = null;
		Message message = null;
		HashMap hmMessageDetails = null;
		GlobalPreferencesUtil gpu = new GlobalPreferencesUtil();
		logger.ctinfo("CTALT00328");
		try
		{
			// Go to the DB and fetch all the messages for the given user id
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_UNREAD_SEVERITY_MESSAGE_DTLS);
			databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
			databaseRequest.addFilter(AlertConstants.GCIF, sGCIFId);
			databaseRequest.addFilter(AlertConstants.LANG_ID, sLocale);
			databaseRequest.addFilter(AlertConstants.SEVERITY, severity);
			databaseRequest.setPaginationModel(pgModel);
			databaseRequest.setSortingModel(smModel);
			databaseResult = databaseRequest.execute();
			listAllMessages = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00329", dbEx, sUserId);
			throw dbEx;
		}
		logger.ctdebug("CTALT00330", listAllMessages);
		if (listAllMessages != null && !listAllMessages.isEmpty())
		{
			// Form ArrayList of message objects
			alistAllMessages = new ArrayList();
			if (userTimezone != null)
			{
				gpu.formatDateTime((ArrayList) listAllMessages, "STR_MESSAGE_TS", userTimezone, false);
			}
			for (int i = 0; i < listAllMessages.size(); i++)
			{
				hmMessageDetails = (HashMap) listAllMessages.get(i);
				// Form message object
				InboxUtility inboxUtility = new InboxUtility();
				message = inboxUtility.formMessage(message, hmMessageDetails, sLocale, mChannelName);
				alistAllMessages.add(message);
			}
		} else
		{
			logger.ctdebug("CTALT00331", sUserId);
		}
		logger.ctdebug("CTALT00332", alistAllMessages);
		logger.ctinfo("CTALT00333");
		return alistAllMessages;
	}

	/**
	 * API to get the notification count
	 * 
	 * @param: String userid, String gcif
	 * @return: List
	 * 
	 * */
	public List getNotificationCount(String userid, String gcif)
	{

		logger.ctinfo("CTALT00334");
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listResult = null;

		try
		{
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension("GET_NOTIFICATION_COUNTS");
			databaseRequest.addFilter(AlertConstants.USER_ID, userid);
			databaseRequest.addFilter(AlertConstants.GCIF, gcif);

			databaseResult = databaseRequest.execute();
			listResult = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00335", dbEx);

		}
		logger.ctdebug("CTALT00336", listResult);
		return listResult;
	}

	private static final String mChannelName = "INBOX";
	private static final Logger logger = Logger.getLogger(InboxChannelInstruction.class);
	private static PropertyReader prptReader = AlertConstants.ALERT_PROPERTIES;
}
