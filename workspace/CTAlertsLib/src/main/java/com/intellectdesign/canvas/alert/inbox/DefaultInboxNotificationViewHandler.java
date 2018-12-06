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

import com.intellectdesign.canvas.alert.handler.AlertConstants;
import com.intellectdesign.canvas.alert.handler.IMessage;
import com.intellectdesign.canvas.alert.handler.INotificationHandler;
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

/**
 * This class provides the implementation for the methods mentioned in INotificationHandler interface 
 * for the message inbox channel. This class contains the methods to fetch read/unread alert messages from DB.
 * 
 * @version 1.0
 */
public class DefaultInboxNotificationViewHandler implements INotificationHandler
{

	/**
	 * This method returns the list object containg all the notification messges 
	 * for the current user to be displayed in message Inbox. 
	 * 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User ID  
	 * @param sLocale String value of the Language locale ID of the user
	 * @param pgModel Pagination Model object that arranges the messages in pages
	 * @param smModel Sort Model object that sorts the messages by Date and Severity 
	 * @param userTimezone String value of the user timezone 
	 * 
	 * @return NotificationMessages List object that contains all the notification messages
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.INotificationHandler#fetchNotificationMessages(java.lang.String,
	 *      java.lang.String, java.lang.String, com.intellectdesign.canvas.database.PaginationModel,
	 *      com.intellectdesign.canvas.database.SortingModel, java.lang.String)
	 */
	@Override
	public List<IMessage> fetchNotificationMessages(String sGCIFId, String sUserId, String sLocale,
			PaginationModel pgModel, SortingModel smModel, String userTimezone) throws DatabaseException
	{

		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listAllMessages = null;
		List<IMessage> alistAllMessages = null;
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
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "Y");
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
	 * This method fetches the list of Notification Messages hanving the Read_Indicator as 'Y' 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User ID  
	 * @param sLocale String value of the Language locale ID of the user
	 * @param pgModel Pagination Model object that arranges the messages in pages
	 * @param smModel Sort Model object that sorts the messages by Date and Severity 
	 * @param userTimezone String value of the user timezone
	 * 
	 * @return ReadNotificationMessages List object that contains all the notification messages
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.INotificationHandler#fetchReadNotificationMessages(java.lang.String,
	 *      java.lang.String, java.lang.String, com.intellectdesign.canvas.database.PaginationModel,
	 *      com.intellectdesign.canvas.database.SortingModel, java.lang.String)
	 */
	@Override
	public List<IMessage> fetchReadNotificationMessages(String sGCIFId, String sUserId, String sLocale,
			PaginationModel pgModel, SortingModel smModel, String userTimezone) throws DatabaseException
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
			databaseRequest.addFilter(AlertConstants.READ_INDICATOR, "Y");
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "Y");
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
	 * This method fetchs the all the unread notification messages
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User ID  
	 * @param sLocale String value of the Language locale ID of the user
	 * @param pgModel Pagination Model object that arranges the messages in pages
	 * @param smModel Sort Model object that sorts the messages by Date and Severity 
	 * @param userTimezone String value of the user timezone
	 * 
	 * @return UnReadNotificationMessages List object that contains all the unread notification messages
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.INotificationHandler#fetchUnReadNotificationMessages(java.lang.String,
	 *      java.lang.String, java.lang.String, com.intellectdesign.canvas.database.PaginationModel,
	 *      com.intellectdesign.canvas.database.SortingModel, java.lang.String)
	 */
	@Override
	public List<IMessage> fetchUnReadNotificationMessages(String sGCIFId, String sUserId, String sLocale,
			PaginationModel pgModel, SortingModel smModel, String timeZone) throws DatabaseException
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
			databaseRequest.addFilter(AlertConstants.READ_INDICATOR, "N");
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "Y");
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
	 * This method gets all the notification messages matching the Status 
	 *  
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id  
	 * @param sStatus String value of the Status
	 * @param sLocale String value of the language locale id
	 * @param pgModel Pagination Model object that arranges the messages in pages
	 * @param smModel Sort Model object that sorts the messages  by Date and Severity
	 * @param timeZone String value of the user timezone
	 * 
	 * @return AllNotificationMessagesForStatus List object that contains all the notifications for the status
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.INotificationHandler#getAllNotificationMessagesForStatus(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, com.intellectdesign.canvas.database.PaginationModel,
	 *      com.intellectdesign.canvas.database.SortingModel, java.lang.String)
	 */
	@Override
	public List<IMessage> getAllNotificationMessagesForStatus(String sGCIFId, String sUserId, String sStatus,
			String sLocale, PaginationModel pgModel, SortingModel smModel, String timeZone) throws DatabaseException
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
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "Y");
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
	 * This method gets only the unread notification messages matching the Status 
	 *  
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User ID
	 * @param sStatus String value of the message status
	 * @param sLocale String value of the language locale Id
	 * @param pgModel Pagination Model object that arranges the messages in pages 
	 * @param smModel Sort Model object that sorts the messages by Date and Severity 
	 * @param timeZone String value of the user timezone
	 * 
	 * @return alistAllMessages List object that contains the unread notifications for the status
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.INotificationHandler#getUnreadNotificationMessagesForStatus(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, com.intellectdesign.canvas.database.PaginationModel,
	 *      com.intellectdesign.canvas.database.SortingModel, java.lang.String)
	 */
	@Override
	public List<IMessage> getUnreadNotificationMessagesForStatus(String sGCIFId, String sUserId, String sStatus,
			String sLocale, PaginationModel pgModel, SortingModel smModel, String timeZone) throws DatabaseException
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
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_UNREAD_MESSAGES_FOR_STATUS);
			databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
			databaseRequest.addFilter(AlertConstants.GCIF, sGCIFId);
			databaseRequest.addFilter(AlertConstants.LANG_ID, sLocale);
			databaseRequest.addFilter(AlertConstants.ACTIONED_INDICATOR, sStatus);
			databaseRequest.addFilter(AlertConstants.READ_INDICATOR, "N");
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "Y");
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
	 * This method gets all the notification messages for Severity 
	 *  
	 * @param String value of the GCIF Id
	 * @param sUserId String value of the User ID  
	 * @param sSeverity String value of the Severity
	 * @param sLocale String value of the Language locale ID of the user
	 * @param pgModel Pagination Model object that arranges the messages in pages
	 * @param smModel Sort Model object that sorts the messages by Date and Severity 
	 * 
	 * @return alistAllMessages List object that contains all the notifications matching the severity
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.INotificationHandler#getAllNotificationMessagesForSeverity(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, com.intellectdesign.canvas.database.PaginationModel,
	 *      com.intellectdesign.canvas.database.SortingModel, java.lang.String)
	 */
	@Override
	public List<IMessage> getAllNotificationMessagesForSeverity(String sGCIFId, String sUserId, String sSeverity,
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
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "Y");
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
	 * This method gets only the unread noification messages for the Severity 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User ID  
	 * @param sSeverity String value of the notification Severity
	 * @param sLocale String value of the Language locale ID of the user
	 * @param pgModel Pagination Model object that arranges the messages in pages
	 * @param smModel Sort Model object that sorts the messages by Date and Severity 
	 * @param userTimezone String value of the user timezone
	 * 
	 * @return UnreadNotificationMessages List object that contains the unread notifications fro the severity
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.INotificationHandler#getUnreadNotificationMessagesForSeverity(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, com.intellectdesign.canvas.database.PaginationModel,
	 *      com.intellectdesign.canvas.database.SortingModel, java.lang.String)
	 */
	@Override
	public List<IMessage> getUnreadNotificationMessagesForSeverity(String sGCIFId, String sUserId, String sSeverity,
			String sLocale, PaginationModel pgModel, SortingModel smModel, String userTimezone)
			throws DatabaseException
	{

		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listAllMessages = null;
		List<IMessage> alistAllMessages = null;
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
			databaseRequest.addFilter(AlertConstants.SEVERITY, sSeverity);
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "Y");
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
	 * This method is used to get all notification messages for the date range
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User ID  
	 * @param sDate1 String value of the start date in the date range 
	 * @param sDate2 String value of the end date in the date range
	 * @param sComparison String value of the filtering condition  
	 * @param sLocale String value of the Language locale ID of the user 
	 * @param pgModel Pagination Model object that arranges the messages in pages
	 * @param smModel Sort Model object that sorts the messages by Date and Severity 
	 * @param userTimezone String value of the user timezone
	 * 
	 * @return alistAllMessages List object that contains the notifications within the date range 
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.INotificationHandler#getAllNotificationMessagesForDate(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String,
	 *      com.intellectdesign.canvas.database.PaginationModel, com.intellectdesign.canvas.database.SortingModel, java.lang.String)
	 */
	@Override
	public List<IMessage> getAllNotificationMessagesForDate(String sGCIFId, String sUserId, String sDate1,
			String sDate2, String sComparison, String sLocale, PaginationModel pgModel, SortingModel smModel,
			String userTimezone) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listAllMessages = null;
		List<IMessage> alistAllMessages = null;
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
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "Y");
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
	 * This method gets only the unread notification messages for the date range 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User ID  
	 * @param sDate1 String value of the start date in the date range 
	 * @param sDate2 String value of the end date in the date range
	 * @param sComparison String value of the filtering condition  
	 * @param sLocale String value of the Language locale ID of the user 
	 * @param pgModel Pagination Model object that arranges the messages in pages
	 * @param smModel Sort Model object that sorts the messages by Date and Severity 
	 * @param userTimezone String value of the user timezone
	 * 
	 * @return null
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.INotificationHandler#getUnreadNotificationMessagesForDate(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String,
	 *      com.intellectdesign.canvas.database.PaginationModel, com.intellectdesign.canvas.database.SortingModel, java.lang.String)
	 */
	@Override
	public List<IMessage> getUnreadNotificationMessagesForDate(String sGCIFId, String sUserId, String sDate1,
			String sDate2, String sComparison, String sLocale, PaginationModel pgModel, SortingModel smModel,
			String userTimezone) throws DatabaseException
	{

		return null;
	}

	/**
	 * This method is used to get all Noification Messages for SubProdCode based on parameters passed but mainly
	 * sSubProdCode
	 * 
	 * @param sGCIFId
	 * @param sUserId
	 * @param sSubProdCode
	 * @param sLocale
	 * @param pgModel
	 * @param smModel
	 * @param userTimezone
	 * @return alistAllMessages
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.INotificationHandler#getAllNotificationMessagesForSubProdCode(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, com.intellectdesign.canvas.database.PaginationModel,
	 *      com.intellectdesign.canvas.database.SortingModel, java.lang.String)
	 */
	@Override
	public List<IMessage> getAllNotificationMessagesForSubProdCode(String sGCIFId, String sUserId, String sSubProdCode,
			String sLocale, PaginationModel pgModel, SortingModel smModel, String userTimezone)
			throws DatabaseException
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
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "Y");
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
	 * This method gets only the unread notification messages for a SubProdCode 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User ID  
	 * @param sSubProdCode String value of the Sub Product code
	 * @param sLocale String value of the Language locale ID of the user
	 * @param pgModel Pagination Model object that arranges the messages in pages
	 * @param smModel Sort Model object that sorts the messages by Date and Severity 
	 * @param userTimezone String value of the user timezone
	 * 
	 * @return null 
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.INotificationHandler#getUnreadNotificationMessagesForSubProdCode(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, com.intellectdesign.canvas.database.PaginationModel,
	 *      com.intellectdesign.canvas.database.SortingModel, java.lang.String)
	 */
	@Override
	public List<IMessage> getUnreadNotificationMessagesForSubProdCode(String sGCIFId, String sUserId,
			String sSubProdCode, String sLocale, PaginationModel pgModel, SortingModel smModel, String userTimezone)
			throws DatabaseException
	{

		return null;
	}

	/**
	 * This method returns true after successfully marking an unread notification Read_Indicator as 'Y' 
	 * 
	 * @param mailId String value of the Notification Message Id
	 * @param userId String value of the User ID
	 * @param gcif String value of the GCIF Id
	 * 
	 * @return isUpdated true if successfully updated otherwise false
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.INotificationHandler#markNotificationMessageAsRead(java.lang.String,
	 *      java.lang.String, java.lang.String)
	 */
	@Override
	public boolean markNotificationMessageAsRead(String mailId, String userId, String gcif) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		boolean isUpdated = false;

		HashMap filterMap = new HashMap();
		filterMap.put("MAIL_ID", mailId);
		filterMap.put("USER_ID", userId);
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
	 * This method gets the count total notification Messages for a user 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User ID  
	 * 
	 * @return unreadMsgCountInt integer value of the unread notification messages 
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.INotificationHandler#getNotificationMessageCounts(java.lang.String,
	 *      java.lang.String)
	 */
	@Override
	public int getNotificationMessageCounts(String sGCIFId, String sUserId) throws DatabaseException
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
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_GET_MESSAGES_COUNT);
			databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
			databaseRequest.addFilter(AlertConstants.GCIF, sGCIFId);
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "Y");
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
	 * This method gets the count of unread Notification Messages for a user 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User ID  
	 * 
	 * @return unreadMsgCountInt integer value of unread notification messages
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.INotificationHandler#getUnreadNotificationMessageCounts(java.lang.String,
	 *      java.lang.String)
	 */
	@Override
	public int getUnreadNotificationMessageCounts(String sGCIFId, String sUserId) throws DatabaseException
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
			databaseRequest.addFilter(AlertConstants.USER_ID, sUserId);
			databaseRequest.addFilter(AlertConstants.GCIF, sGCIFId);
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "Y");
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
	 * This method returns true after deleting the Notification Messages of a user
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User ID  
	 * @param listMessageIds ArrayList object that contains the list of notification message ids to be deleted
	 * 
	 * @return isDeleted true if successfully deleted the messages else false
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.INotificationHandler#deleteNotificationMessage(java.lang.String,
	 *      java.lang.String, java.util.ArrayList)
	 */
	@Override
	public boolean deleteNotificationMessage(String sGCIFId, String sUserId, ArrayList listMessageIds)
			throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		boolean isDeleted = false;

		HashMap filterMap = new HashMap();
		filterMap.put("GCIF", sGCIFId);
		filterMap.put("USER_ID", sUserId);
		try
		{
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.ALERT_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.UPDATE);
			databaseRequest.setOperationExtension(AlertConstants.ALERT_EXT_MARK_MSGS_AS_DELETED);
			databaseRequest.setData(filterMap);
			databaseRequest.execute();
		} catch (DatabaseException dbEx)
		{
			throw dbEx;
		}

		isDeleted = true;

		return isDeleted;
	}

	private static final String mChannelName = "INBOX";
	private static final Logger logger = Logger.getLogger(DefaultInboxNotificationViewHandler.class);

	/**
	 * This method gets the detailed message of a noitifcation to the Inbox channel for reading 
	 * 
	 * @param MessageId String value of the Notification ID
	 * @param sUserId String value of the User ID  
	 * @param sLocale String value of the Language locale ID of the user
	 * @param userTimezone String value of the user timezone
	 * 
	 * @return message IMessage object that contains the detailed message for the notification id
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.INotificationHandler#readNotificationMessage(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String)
	 */
	@Override
	public IMessage readNotificationMessage(String sMessageId, String sUserId, String sLocale, String userTimezone)
			throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listMessage = null;
		Message message = null;
		HashMap hmMessageDetails = null;
		GlobalPreferencesUtil gpu = new GlobalPreferencesUtil();

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
			throw dbEx;
		}

		if (listMessage != null && !listMessage.isEmpty())
		{

			hmMessageDetails = (HashMap) listMessage.get(0);
			if (userTimezone != null)
			{
				gpu.formatDateTime(hmMessageDetails, "STR_MESSAGE_TS", userTimezone, false);
			}
			InboxUtility inboxUtility = new InboxUtility();
			message = inboxUtility.formMessage(message, hmMessageDetails, sLocale, mChannelName);
		}

		return message;
	}

}
