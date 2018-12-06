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
import com.intellectdesign.canvas.alert.handler.IAlertHandler;
import com.intellectdesign.canvas.alert.handler.IMessage;
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
 * This class provides implementation for the the methods mentioned in IAlertHandler interface for the Inbox channel. 
 * This class contains the methods to fetch read/unread alert messages from DB. 
 * 
 * 
 * @version 1.0
 */
public class DefaultInboxAlertViewHandler implements IAlertHandler
{

	/**
	 * This method returns the list object containg all the alert messges for the current user to be displayed in the Inbox.
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User ID  
	 * @param sLocale String value of the Language locale ID of the user
	 * @param pgModel Pagination Model object that arranges the messages in pages
	 * @param smModel Sort Model object that sorts the messages by Date and Severity 
	 * @param userTimezone String value of the user timezone 
	 * 
	 * @return alistAllMessages List object that contains all the alert messages
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.IAlertHandler#fetchAlertMessages(java.lang.String, java.lang.String,
	 *      java.lang.String, com.intellectdesign.canvas.database.PaginationModel, com.intellectdesign.canvas.database.SortingModel,
	 *      java.lang.String)
	 */
	@Override
	public List<IMessage> fetchAlertMessages(String sGCIFId, String sUserId, String sLocale, PaginationModel pgModel,
			SortingModel smModel, String userTimezone) throws DatabaseException
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
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "N");
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
	 * This method is used to fetch the alert messages for which the Read_Indicator is 'Y'  
	 * 
	 * @param sGCIFId String value of the GCIF ID
	 * @param sUserId String value of the User ID
	 * @param sLocale String value of the Language locale ID of the user
	 * @param pgModel Pagination Model object that arranges the messages in pages
	 * @param smModel Sort Model object that sorts the messages by Date and Severity 
	 * @param userTimezone String value of the user timezone
	 * 
	 * @return ReadAlertMessages List object that contains only the read messages
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.IAlertHandler#fetchReadAlertMessages(java.lang.String, java.lang.String,
	 *      java.lang.String, com.intellectdesign.canvas.database.PaginationModel, com.intellectdesign.canvas.database.SortingModel,
	 *      java.lang.String)
	 */
	@Override
	public List<IMessage> fetchReadAlertMessages(String sGCIFId, String sUserId, String sLocale,
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
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "N");
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
	 * This method is used to fetch the alert messages for which the Read_Indicator is 'N'  
	 * 
	 * @param sGCIFId String value of the GCIF ID
	 * @param sUserId String value of the User ID
	 * @param sLocale String value of the Language locale ID of the user
	 * @param pgModel Pagination Model object that arranges the messages in pages
	 * @param smModel Sort Model object that sorts the messages by Date and Severity 
	 * @param userTimezone String value of the user timezone
	 * 
	 * @return UnreadMessages List object that contains the unread messages
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.IAlertHandler#fetchUnReadAlertMessages(java.lang.String, java.lang.String,
	 *      java.lang.String, com.intellectdesign.canvas.database.PaginationModel, com.intellectdesign.canvas.database.SortingModel,
	 *      java.lang.String)
	 */
	@Override
	public List<IMessage> fetchUnReadAlertMessages(String sGCIFId, String sUserId, String sLocale,
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
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "N");
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
	 * This method is used to get all alert messages based on sStatus 
	 * 
	 * @param sGCIFId String value of the GCIF ID
	 * @param sUserId String value of the User ID
	 * @param sLocale String value of the Language locale ID of the user
	 * @param pgModel Pagination Model object that arranges the messages in pages
	 * @param smModel Sort Model object that sorts the messages by Date and Severity 
	 * @param userTimezone String value of the user timezone
	 * 
	 * @return alistAllMessages List object that contains all the messages matching the status 
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.IAlertHandler#getAllAlertMessagesForStatus(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, com.intellectdesign.canvas.database.PaginationModel,
	 *      com.intellectdesign.canvas.database.SortingModel, java.lang.String)
	 */
	@Override
	public List<IMessage> getAllAlertMessagesForStatus(String sGCIFId, String sUserId, String sStatus, String sLocale,
			PaginationModel pgModel, SortingModel smModel, String timeZone) throws DatabaseException
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
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "N");
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
	 * This method is used for geting all alert messages for a Severity 
	 * 
	 * 
	 * @param sGCIFId String value of the GCIF ID
	 * @param sUserId String value of the User ID
	 * @param sSeverity String value of the Severity
	 * @param sLocale String value of the Language locale ID of the user
	 * @param pgModel Pagination Model object that arranges the messages in pages
	 * @param smModel Sort Model object that sorts the messages by Date and Severity 
	 * @param userTimezone String value of the user timezone
	 * 
	 * @return AllAlertMessagesForSeverity List object that contains the messages matching the severity
	 * 
	 * @return alistAllMessages
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.IAlertHandler#getAllAlertMessagesForSeverity(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, com.intellectdesign.canvas.database.PaginationModel,
	 *      com.intellectdesign.canvas.database.SortingModel, java.lang.String)
	 */
	@Override
	public List<IMessage> getAllAlertMessagesForSeverity(String sGCIFId, String sUserId, String sSeverity,
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
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "N");
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
	 * This method is used to get all alert messages for a date range 
	 * 
	 * @param sGCIFId String value of the GCIF ID
	 * @param sUserId String value of the User ID
	 * @param sDate1 String value of the start date in the date range 
	 * @param sDate2 String value of the end date in the date range
	 * @param sComparison String value of the filtering condition 
	 * @param sLocale String value of the Language locale ID of the user
	 * @param pgModel Pagination Model object that arranges the messages in pages
	 * @param smModel Sort Model object that sorts the messages by Date and Severity 
	 * @param userTimezone String value of the user timezone
	 * 
	 * @return alistAllMessages List object that contains the messages matching the date range
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.IAlertHandler#getAllAlertMessagesForDate(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String,
	 *      com.intellectdesign.canvas.database.PaginationModel, com.intellectdesign.canvas.database.SortingModel, java.lang.String)
	 */
	@Override
	public List<IMessage> getAllAlertMessagesForDate(String sGCIFId, String sUserId, String sDate1, String sDate2,
			String sComparison, String sLocale, PaginationModel pgModel, SortingModel smModel, String userTimezone)
			throws DatabaseException
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
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "N");
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
	 * This method is used to get all alert messages for SubProdCode based on the sSubProdCode,usedid , GCIF ID,paging
	 * model, time zone etc
	 * 
	 * @param sGCIFId String value of the GCIF ID
	 * @param sUserId String value of the User ID
	 * @param sSubProdCode String value of the Sub Product Code
	 * @param sLocale String value of the Language locale ID of the user
	 * @param pgModel Pagination Model object that arranges the messages in pages
	 * @param smModel Sort Model object that sorts the messages by Date and Severity 
	 * @param userTimezone String value of the user timezone
	 * 
	 * @return AllAlertMessagesForSubProdCode List object that contains all the messages matching the Sub Product Code
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.IAlertHandler#getAllAlertMessagesForSubProdCode(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, com.intellectdesign.canvas.database.PaginationModel,
	 *      com.intellectdesign.canvas.database.SortingModel, java.lang.String)
	 */
	@Override
	public List<IMessage> getAllAlertMessagesForSubProdCode(String sGCIFId, String sUserId, String sSubProdCode,
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
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "N");
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
	 * This method returns true if it successfully marks a message Read_Indicator as 'Y" else returns false
	 * 
	 * @param mailId String value of the Message Id
	 * @param userId String value of the User ID
	 * @param gcif String value of the GCIF Id
	 * 
	 * @return true if succesfully marked otherwise returns false 
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.IAlertHandler#markAlertMessageAsRead(java.lang.String, java.lang.String,
	 *      java.lang.String)
	 */
	@Override
	public boolean markAlertMessageAsRead(String mailId, String userId, String gcif) throws DatabaseException
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
	 * This method returns the total number of alert messages for the user 
	 * 
	 * @param userNo String value of the User ID 
	 * @param gcif String value of the GCIF ID
	 * 
	 * @return integer value of the total alert messages
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.IAlertHandler#getAlertMessageCounts(java.lang.String, java.lang.String)
	 */
	@Override
	public int getAlertMessageCounts(String gcif, String userNo) throws DatabaseException
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
			databaseRequest.addFilter(AlertConstants.USER_ID, userNo);
			databaseRequest.addFilter(AlertConstants.GCIF, gcif);
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "N");
			databaseResult = databaseRequest.execute();
			listUnreadMessageCount = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00231", dbEx, userNo);
			throw dbEx;
		}
		if (listUnreadMessageCount != null && !listUnreadMessageCount.isEmpty())
		{
			unreadMsgCountInt = (Integer) listUnreadMessageCount.get(0);
		} else
		{
			logger.ctdebug("CTALT00216", userNo);
		}
		logger.ctdebug("CTALT00233", unreadMsgCountInt);
		logger.ctinfo("CTALT00234");
		return unreadMsgCountInt;
	}

	/**
	 * This method returns only the total unread alert messages for the user 
	 * 
	 * @param userNo String value of the User ID
	 * @param gcif String value of the GCIF ID
	 * 
	 * @return UnreadAlertMessageCounts Integer value of total unread alerts 
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.IAlertHandler#getUnreadAlertMessageCounts(java.lang.String,
	 *      java.lang.String)
	 */
	@Override
	public int getUnreadAlertMessageCounts(String gcif, String userNo) throws DatabaseException
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
			databaseRequest.addFilter(AlertConstants.USER_ID, userNo);
			databaseRequest.addFilter(AlertConstants.GCIF, gcif);
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "N");
			databaseResult = databaseRequest.execute();
			listUnreadMessageCount = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00231", dbEx, userNo);
			throw dbEx;
		}
		if (listUnreadMessageCount != null && !listUnreadMessageCount.isEmpty())
		{
			unreadMsgCountInt = (Integer) listUnreadMessageCount.get(0);
		} else
		{
			logger.ctdebug("CTALT00216", userNo);
		}
		logger.ctdebug("CTALT00233", unreadMsgCountInt);
		logger.ctinfo("CTALT00234");
		return unreadMsgCountInt;
	}

	/**
	 * This method returns true if successfully deleted the list of alert messages 
	 * 
	 * @param userNo String value of the User ID
	 * @param gcif String value of the GCIF ID
	 * 
	 * @param listMessageIds ArrayList object that contains the alert message Ids to be deleted 
	 * 
	 * @return true if deleted successfully / failure on deleting alert message(isDeleted)
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.IAlertHandler#deleteAlertMessage(java.lang.String, java.lang.String,
	 *      java.util.ArrayList)
	 */
	@Override
	public boolean deleteAlertMessage(String gcif, String userNo, ArrayList listMessageIds) throws DatabaseException
	{
		DatabaseRequest databaseRequest = null;
		boolean isDeleted = false;

		HashMap filterMap = new HashMap();
		filterMap.put("GCIF", gcif);
		filterMap.put("USER_ID", userNo);
		filterMap.put("MESSAGE_ID", listMessageIds);
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

	/**
	 * This method is used for geting all the unread alert messages matching the sStatus 
	 * 
	 * @param sUserId String value of the User ID
	 * @param sGCIFId String value of the GCIF ID
	 * @param sStatus String value of the Status
	 * @param String value of the Language locale ID of the user
	 * @param pgModel Pagination Model object that arranges the messages in pages
	 * @param smModel Sort Model object that sorts the messages by Date and Severity 
	 * @param userTimezone String value of the user timezone
	 * 
	 * @return UnreadAlertMessagesForStatus List object that contains the list of unread alert messages for the status
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.IAlertHandler#getUnreadAlertMessagesForStatus(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, com.intellectdesign.canvas.database.PaginationModel,
	 *      com.intellectdesign.canvas.database.SortingModel, java.lang.String)
	 */
	@Override
	public List<IMessage> getUnreadAlertMessagesForStatus(String sGCIFId, String sUserId, String sStatus,
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
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "N");
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
	 * This method is used for geting all the unread alert messages matching the sSeverity 
	 * 
	 * @param sUserId String value of the User ID
	 * @param sGCIFId String value of the GCIF ID
	 * @param sSeverity String value of the message Severity
	 * @param sLocale String value of the Language locale ID of the user
	 * @param pgModel Pagination Model object that arranges the messages in pages
	 * @param smModel Sort Model object that sorts the messages by Date and Severity 
	 * @param userTimezone String value of the user timezone
	 * 
	 * @return UnreadAlertMessagesForSeverity
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.IAlertHandler#getUnreadAlertMessagesForSeverity(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, com.intellectdesign.canvas.database.PaginationModel,
	 *      com.intellectdesign.canvas.database.SortingModel, java.lang.String)
	 */
	@Override
	public List<IMessage> getUnreadAlertMessagesForSeverity(String sGCIFId, String sUserId, String sSeverity,
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
			databaseRequest.addFilter(AlertConstants.IS_NOTIFICATION, "N");
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
	 * This method is used to get all the unread alert messages for the date range 
	 * 
	 * @param sUserId sUserId String value of the User ID
	 * @param sGCIFId sGCIFId String value of the GCIF ID
	 * @param String value of the start date in the date range 
	 * @param sDate2 String value of the end date in the date range
	 * @param sComparison String value of the filtering condition 
	 * @param sLocale String value of the Language locale ID of the user
	 * @param pgModel Pagination Model object that arranges the messages in pages
	 * @param smModel Sort Model object that sorts the messages by Date and Severity 
	 * @param userTimezone String value of the user timezone
	 * 
	 * @return null
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.IAlertHandler#getUnreadAlertMessagesForDate(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String,
	 *      com.intellectdesign.canvas.database.PaginationModel, com.intellectdesign.canvas.database.SortingModel, java.lang.String)
	 */
	@Override
	public List<IMessage> getUnreadAlertMessagesForDate(String sGCIFId, String sUserId, String sDate1, String sDate2,
			String sComparison, String sLocale, PaginationModel pgModel, SortingModel smModel, String userTimezone)
			throws DatabaseException
	{

		return null;
	}

	/**
	 * This method is used to get all unread alert messages for SubProdCode 
	 * 
	 * @param sUserId String value of the User ID
	 * @param sGCIFId sGCIFId String value of the GCIF ID
	 * @param sSubProdCode sSubProdCode String value of the Sub Product Code
	 * @param sLocale String value of the Language locale ID of the user
	 * @param pgModel Pagination Model object that arranges the messages in pages
	 * @param smModel Sort Model object that sorts the messages by Date and Severity 
	 * @param userTimezone String value of the user timezone
	 * 
	 * @return null
	 * 
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.IAlertHandler#getUnreadAlertMessagesForSubProdCode(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, com.intellectdesign.canvas.database.PaginationModel,
	 *      com.intellectdesign.canvas.database.SortingModel, java.lang.String)
	 */
	@Override
	public List<IMessage> getUnreadAlertMessagesForSubProdCode(String sGCIFId, String sUserId, String sSubProdCode,
			String sLocale, PaginationModel pgModel, SortingModel smModel, String userTimezone)
			throws DatabaseException
	{

		return null;
	}

	private static final String mChannelName = "INBOX";
	private static final Logger logger = Logger.getLogger(DefaultInboxAlertViewHandler.class);

	/**
	 * This method is used Read the alert messages based on parameters passed
	 * 
	 * @param MessageId
	 * @param sUserId
	 * @param sLocale
	 * @param userTimezone
	 * @return message
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.alert.handler.IAlertHandler#readAlertMessage(java.lang.String, java.lang.String,
	 *      java.lang.String, java.lang.String)
	 */
	@Override
	public IMessage readAlertMessage(String sMessageId, String sUserId, String sLocale, String userTimezone)
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
