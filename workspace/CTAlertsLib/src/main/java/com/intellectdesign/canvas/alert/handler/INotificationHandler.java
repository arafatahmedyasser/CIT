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
 * This interface is to perform only Notification Messages related operations such as to fetch read, unread notifications, notifications by status, by date, by severity and messages by Product Code. 
 * The Notification Messages are marked with Is_Notification as 'Y' in ALERT_MASTER table. 
 * 
 * @version 1.0
 */
public interface INotificationHandler
{

	/**
	 * This method is used to fetch all Notification Messages for the users 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the notification messages 
	 * @param smModel Sorting Model object of the notification messages
	 * @param userTimezone String value of the user's time zone
	 *
	 * @return NotificationMessages List object of the notification messages applicable to the user  
	 * @throws DatabaseException
	 */
	List<IMessage> fetchNotificationMessages(String sGCIFId, String sUserId, String sLocale, PaginationModel pgModel,
			SortingModel smModel, String userTimezone) throws DatabaseException;

	/**
	 * This method is used to fetch the Notification Messages those have read_indicator as 'Y' for the given parameters
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the notifications
	 * @param smModel Sorting Model object of the notifications
	 * @param userTimezone String value of the user's time zone
	 * 
	 * @return hReadNotificationMessages List object of the read notifications 
	 * @throws DatabaseException
	 */
	List<IMessage> fetchReadNotificationMessages(String sGCIFId, String sUserId, String sLocale,
			PaginationModel pgModel, SortingModel smModel, String userTimezone) throws DatabaseException;

	/**
	 * This method is used to fetch the unread notifications whose read_indicator is 'N' for the given parameters
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the notifications
	 * @param smModel Sorting Model object of the notifications
	 * @param userTimezone String value of the user's time zone
	 * 
	 * @return UnReadNotificationMessages List object of the unread notifications
	 * @throws DatabaseException
	 */
	List<IMessage> fetchUnReadNotificationMessages(String sGCIFId, String sUserId, String sLocale,
			PaginationModel pgModel, SortingModel smModel, String timeZone) throws DatabaseException;

	/**
	  * This method is used to get all notification messages matching the value passed as sStatus for a user 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sStatus String value of the Status Id
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the notification messages
	 * @param smModel Sorting Model object of the notification messages
	 * @param timeZone String value of the user's time zone
	 * 
	 * @return AllNotificationMessagesForStatus List object of the notification messages matching the Status
	 * @throws DatabaseException
	 */
	List<IMessage> getAllNotificationMessagesForStatus(String sGCIFId, String sUserId, String sStatus, String sLocale,
			PaginationModel pgModel, SortingModel smModel, String timeZone) throws DatabaseException;

	/**
	  * This method is used to get all unread notification messages based on Status 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sStatus String value of the Status Id
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the notification messages
	 * @param smModel Sorting Model object of the notification messages
	 * @param timeZone String value of the user's time zone
	 * 
	 * @return UnreadNotificationMessagesForStatus List object of all unread notification messages for the Status
	 * @throws DatabaseException
	 */
	List<IMessage> getUnreadNotificationMessagesForStatus(String sGCIFId, String sUserId, String sStatus,
			String sLocale, PaginationModel pgModel, SortingModel smModel, String timeZone) throws DatabaseException;

	/**
	 * This method is used to get all notification messages matching the given Severity 
	 * 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sSeverity String value of the notification Severity
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the notification messages
	 * @param smModel Sorting Model object of the notification messages
	 * @param timeZone String value of the user's time zone
	 * 
	 * @return AllNotificationMessagesForSeverity List object of all notification messages for the Severity
	 * @throws DatabaseException
	 */
	List<IMessage> getAllNotificationMessagesForSeverity(String sGCIFId, String sUserId, String sSeverity,
			String sLocale, PaginationModel pgModel, SortingModel smModel, String userTimezone)
			throws DatabaseException;

	/**
	 * This method is used to get all UnRead notification messages whose read_indicator is 'N' matching the Severity 
	 *
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sSeverity String value of the notification Severity
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the notification messages
	 * @param smModel Sorting Model object of the notification messages
	 * @param timeZone String value of the user's time zone
	 * 
	 * @return UnreadNotificationMessagesForSeverity List object of all unread notification messages for the Severity
	 * @throws DatabaseException
	 */
	List<IMessage> getUnreadNotificationMessagesForSeverity(String sGCIFId, String sUserId, String sSeverity,
			String sLocale, PaginationModel pgModel, SortingModel smModel, String userTimezone)
			throws DatabaseException;

	/**
	 * This method is used to get all notification messages raised between Date1 and Date2 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sDate1 String value of the From Date
	 * @param sDate2 String value of the To Date
	 * @param sComparison String value of the conditional operator
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the notification messages
	 * @param smModel Sorting Model object of the notification messages
	 * @param timeZone String value of the user's time zone
	 * 
	 * @return AllNotificationMessages List object of all notification messages within dates 
	 * 
	 * @throws DatabaseException
	 */
	List<IMessage> getAllNotificationMessagesForDate(String sGCIFId, String sUserId, String sDate1, String sDate2,
			String sComparison, String sLocale, PaginationModel pgModel, SortingModel smModel, String userTimezone)
			throws DatabaseException;

	/**
	 * This method is used to get all the unread notification messages whose read_indicator is 'N' but raised between Date1 and Date2 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sDate1 String value of the From Date
	 * @param sDate2 String value of the To Date
	 * @param sComparison String value of the conditional operator
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the notification messages
	 * @param smModel Sorting Model object of the notification messages
	 * @param timeZone String value of the user's time zone
	 * 
	 * @return UnreadNotificationMessagesForDate List object of all unread notification messages within the dates
	 * @throws DatabaseException
	 */
	List<IMessage> getUnreadNotificationMessagesForDate(String sGCIFId, String sUserId, String sDate1, String sDate2,
			String sComparison, String sLocale, PaginationModel pgModel, SortingModel smModel, String userTimezone)
			throws DatabaseException;

	/**
	 * This method is used to get all notification messages for the events matching the SubProdCode 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sSubProdCode String value of the Sub Product Code 
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the notification messages
	 * @param smModel Sorting Model object of the notification messages
	 * @param timeZone String value of the user's time zone
	 * 
	 * @return AllNotificationMessagesForSubProdCode List object of all notification messages for SubProdCode
	 * @throws DatabaseException
	 */
	List<IMessage> getAllNotificationMessagesForSubProdCode(String sGCIFId, String sUserId, String sSubProdCode,
			String sLocale, PaginationModel pgModel, SortingModel smModel, String userTimezone)
			throws DatabaseException;

	/**
	 * This method is used to get all the unread notification messages whose read_indicator is 'N' and the notification events matching the SubProdCode 
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param sSubProdCode String value of the Sub Product Code 
	 * @param sLocale String value of the Locale Id
	 * @param pgModel Pagination Model object of the notification messages
	 * @param smModel Sorting Model object of the notification messages
	 * @param timeZone String value of the user's time zone
	 * 
	 * @return UnreadNotificationMessagesForSubProdCode List object of all unread notification messages for SubProdCode
	 * @throws DatabaseException
	 */
	List<IMessage> getUnreadNotificationMessagesForSubProdCode(String sGCIFId, String sUserId, String sSubProdCode,
			String sLocale, PaginationModel pgModel, SortingModel smModel, String userTimezone)
			throws DatabaseException;

	/**
	 * This method is used to return true or false after marking the read_indicator as 'Y' for the notification messges 
	 * 
	 * @param mailId String value of the mailId 
	 * @param userId String value of the User Id 
	 * @param gcif String value of the GCIF Id
	 * 
	 * @return markNotificationMessageAsRead true if marked successfully else false.
	 * @throws DatabaseException
	 */
	boolean markNotificationMessageAsRead(String mailId, String userId, String gcif) throws DatabaseException;

	/**
	 * This method is used to get the count of Notification Messages using the sGCIFID and sUserId for that sUserId
	 * 
	 * @param sGCIFId
	 * @param sUserId
	 * @return NotificationMessageCounts count of Notification Messages of sUserId
	 * @throws DatabaseException
	 */
	int getNotificationMessageCounts(String sGCIFId, String sUserId) throws DatabaseException;

	/**
	 * This method is used to get the count of notifications whose Read_Indicator is 'N' for a UserId
	 * 
	 * @param sGCIFId String value of the GCIF Id 
	 * @param sUserId String value of the User Id
	 * 
	 * @return UnreadNotificationMessageCounts integer count of unread notifications for the UserId 
	 * 
	 * @throws DatabaseException
	 */
	int getUnreadNotificationMessageCounts(String sGCIFId, String sUserId) throws DatabaseException;

	/**
	 *This method is used to return true or false after deleting the list of notifications for a sUser
	 * 
	 * @param sGCIFId String value of the GCIF Id
	 * @param sUserId String value of the User Id
	 * @param listMessageIds ArrayList of the messages to be deleted
	 * 
	 * @return deleteAlertMessage true if deleted successfully else false 
	 * @throws DatabaseException
	 */
	boolean deleteNotificationMessage(String sGCIFId, String sUserId, ArrayList listMessageIds)
			throws DatabaseException;

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
	IMessage readNotificationMessage(String MessageId, String sUserId, String sLocale, String userTimezone)
			throws DatabaseException;
}
