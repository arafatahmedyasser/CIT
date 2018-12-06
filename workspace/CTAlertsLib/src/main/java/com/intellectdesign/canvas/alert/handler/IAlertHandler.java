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
import java.util.List;

import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.PaginationModel;
import com.intellectdesign.canvas.database.SortingModel;

/**
 * This interface is to perform only Alert Messages related operations such as to fetch alert read, unread messages, messages by status, by date, by severity and messages by Product Code. 
 * The Alert Messages are marked with Is_Notification as 'N' in ALERT_MASTER table. 
 * 
 * @version 1.0
 */
public interface IAlertHandler
{

	/**
	 * This method is used to fetch the alert messages based on parameters mentioned 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the alert messages 
	 * @param smModel Sorting Model object of the alert messages
	 * @param userTimezone String value of the user's time zone
	 * 
	 * @return AlertMessages List object of the alert messages applicable to the user 
	 * 
	 * @throws DatabaseException
	 */
	List<IMessage> fetchAlertMessages(String sGCIFId, String sUserId, String sLocale, PaginationModel pgModel,
			SortingModel smModel, String userTimezone) throws DatabaseException;

	/**
	 * This method is used to fetch the alert messages those have read_indicator as 'Y' for the given parameters 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the alert messages 
	 * @param smModel Sorting Model object of the alert messages
	 * @param userTimezone String value of the user's time zone
	 * 
	 * @return ReadAlertMessages List object of the read alert messages  
	 * 
	 * @throws DatabaseException
	 */
	List<IMessage> fetchReadAlertMessages(String sGCIFId, String sUserId, String sLocale, PaginationModel pgModel,
			SortingModel smModel, String userTimezone) throws DatabaseException;

	/**
	 * This method is used to fetch the unread alert messages whose read_indicator is 'N' for the given parameters
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the alert messages 
	 * @param smModel Sorting Model object of the alert messages
	 * @param userTimezone String value of the user's time zone
	 * 
	 * @return UnReadAlertMessages List object of the unread alert messages
	 * @throws DatabaseException
	 */
	List<IMessage> fetchUnReadAlertMessages(String sGCIFId, String sUserId, String sLocale, PaginationModel pgModel,
			SortingModel smModel, String timeZone) throws DatabaseException;

	/**
	 * This method is used to get all alert messages matching the value passed as sStatus for a user 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sStatus String value of the Status Id
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the alert messages
	 * @param smModel Sorting Model object of the alert messages
	 * @param timeZone String value of the user's time zone
	 * 
	 * @return AllAlertMessagesForStatus List object of the alert messages matching the Status
	 * @throws DatabaseException
	 */
	List<IMessage> getAllAlertMessagesForStatus(String sGCIFId, String sUserId, String sStatus, String sLocale,
			PaginationModel pgModel, SortingModel smModel, String timeZone) throws DatabaseException;

	/**
	 * This method is used to get all unread alert messages based on Status 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sStatus String value of the Status Id
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the alert messages
	 * @param smModel Sorting Model object of the alert messages
	 * @param timeZone String value of the user's time zone
	 * 
	 * @return UnreadAlertMessagesForStatus List object of all unread alert messagesfor the Status
	 * 
	 * @throws DatabaseException
	 */
	List<IMessage> getUnreadAlertMessagesForStatus(String sGCIFId, String sUserId, String sStatus, String sLocale,
			PaginationModel pgModel, SortingModel smModel, String timeZone) throws DatabaseException;

	/**
	 * This method is used to get all alert messages matching the given Severity 
	 * 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sSeverity String value of the Alert Severity
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the alert messages
	 * @param smModel Sorting Model object of the alert messages
	 * @param timeZone String value of the user's time zone
	 * 
	 * @return AllAlertMessagesForSeverity List object of all alert messages for the Severity
	 * @throws DatabaseException
	 */
	List<IMessage> getAllAlertMessagesForSeverity(String sGCIFId, String sUserId, String sSeverity, String sLocale,
			PaginationModel pgModel, SortingModel smModel, String userTimezone) throws DatabaseException;

	/**
	 * This method is used to get all UnRead alert messages whose read_indicator is 'N' matching the Alert Severity 
	 *
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sSeverity String value of the Alert Severity
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the alert messages
	 * @param smModel Sorting Model object of the alert messages
	 * @param timeZone String value of the user's time zone
	 * 
	 * @return UnreadAlertMessagesForSeverity List object of all unread alert messages for the Severity
	 * @throws DatabaseException
	 */
	List<IMessage> getUnreadAlertMessagesForSeverity(String sGCIFId, String sUserId, String sSeverity, String sLocale,
			PaginationModel pgModel, SortingModel smModel, String userTimezone) throws DatabaseException;

	/**
	 * This method is used to get all alert messages raised between Date1 and Date2 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sDate1 String value of the From Date
	 * @param sDate2 String value of the To Date
	 * @param sComparison String value of the conditional operator
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the alert messages
	 * @param smModel Sorting Model object of the alert messages
	 * @param timeZone String value of the user's time zone
	 * 
	 * @return AllAlertMessages List object of all alert messages within dates 
	 * 
	 * @throws DatabaseException
	 */
	List<IMessage> getAllAlertMessagesForDate(String sGCIFId, String sUserId, String sDate1, String sDate2,
			String sComparison, String sLocale, PaginationModel pgModel, SortingModel smModel, String userTimezone)
			throws DatabaseException;

	/**
	 * This method is used to get all the unread alert messages whose read_indicator is 'N' but raised between Date1 and Date2 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sDate1 String value of the From Date
	 * @param sDate2 String value of the To Date
	 * @param sComparison String value of the conditional operator
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the alert messages
	 * @param smModel Sorting Model object of the alert messages
	 * @param timeZone String value of the user's time zone
	 * 
	 * @return UnreadAlertMessagesForDate List object of all unread alert messages within the dates
	 * @throws DatabaseException
	 */
	List<IMessage> getUnreadAlertMessagesForDate(String sGCIFId, String sUserId, String sDate1, String sDate2,
			String sComparison, String sLocale, PaginationModel pgModel, SortingModel smModel, String userTimezone)
			throws DatabaseException;

	/**
	 * This method is used to get all alert messages for the events matching the SubProdCode 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sSubProdCode String value of the Sub Product Code 
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the alert messages
	 * @param smModel Sorting Model object of the alert messages
	 * @param timeZone String value of the user's time zone
	 * 
	 * @return AlertMessagesForSubProdCode List object of all alert messages for SubProdCode
	 * @throws DatabaseException
	 */
	List<IMessage> getAllAlertMessagesForSubProdCode(String sGCIFId, String sUserId, String sSubProdCode,
			String sLocale, PaginationModel pgModel, SortingModel smModel, String userTimezone)
			throws DatabaseException;

	/**
	 * This method is used to get all the unread alert messages whose read_indicator is 'N' and the alert events matching the SubProdCode 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sSubProdCode String value of the Sub Product Code 
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the alert messages
	 * @param smModel Sorting Model object of the alert messages
	 * @param timeZone String value of the user's time zone
	 * 
	 * @return UnreadAlertMessagesForSubProdCode List object of all unread alert messages for SubProdCode
	 * @throws DatabaseException
	 */

	List<IMessage> getUnreadAlertMessagesForSubProdCode(String sGCIFId, String sUserId, String sSubProdCode,
			String sLocale, PaginationModel pgModel, SortingModel smModel, String userTimezone)
			throws DatabaseException;

	/**
	 * This method is used to return true or false after marking the read_indicator as 'Y' for the alert messges 
	 * 
	 * @param mailId String value of the mailId 
	 * @param userId String value of the User Id 
	 * @param gcif String value of the GCIF Id
	 * 
	 * @return markAlertMessageAsRead true if marked successfully else false.
	 * @throws DatabaseException
	 */
	boolean markAlertMessageAsRead(String mailId, String userId, String gcif) throws DatabaseException;

	/**
	 * This method is used to get the count of notification messages for the User Id
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id 
	 * 
	 * @return AlertMessageCount integer value of count of notification messages of the UserId
	 * @throws DatabaseException
	 */
	int getAlertMessageCounts(String sGCIFId, String sUserId) throws DatabaseException;

	/**
	 * This method is used to get the count of alert messages whose Read_Indicator is 'N' for a UserId
	 * 
	 * @param sGCIFId String value of the GCIF Id 
	 * @param sUserId String value of the User Id
	 * 
	 * @return UnreadAlertMessageCount integer count of unread alert messages of UserId 
	 * 
	 * @throws DatabaseException
	 */
	int getUnreadAlertMessageCounts(String sGCIFId, String sUserId) throws DatabaseException;

	/**
	 * This method is used to return true or false after deleting the list of alert messages for a sUser
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param listMessageIds ArrayList of the messages to be deleted
	 * 
	 * @return deleteAlertMessage true if deleted successfully else false 
	 * @throws DatabaseException
	 */
	boolean deleteAlertMessage(String sGCIFId, String sUserId, ArrayList listMessageIds) throws DatabaseException;

	/**
	 * This method is used to get the messages for reading 
	 * 
	 * @param MessageId String value of the Notification Message Id
	 * @param sUserId String value of the User Id 
	 * @param sLocale String value of the Locale Id
	 * @param userTimezone String value of the User Time Zone
	 * 
	 * @return IMessage Encapsulated Notification Message in the locale
	 * 
	 * @throws DatabaseException
	 */
	IMessage readAlertMessage(String MessageId, String sUserId, String sLocale, String userTimezone)
			throws DatabaseException;
}
