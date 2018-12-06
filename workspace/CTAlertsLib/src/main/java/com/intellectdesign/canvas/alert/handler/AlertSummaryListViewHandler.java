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
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;
import java.util.Vector;

import com.intellectdesign.canvas.alert.inbox.InboxChannelInstruction;
import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.constants.listviews.ListViewConstants;
import com.intellectdesign.canvas.constants.util.TIConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.PaginationModel;
import com.intellectdesign.canvas.database.SortingModel;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.handler.SimpleRequestHandler;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;

/**
 * This class contains methods that handles various actions such as Refresh, Show Unread Alerts, Show Unpoped Alerts, Update Message Read Status on the Alert Summary App.
 * This class extends SimpleRequestHandler
 * 
 * @version 1.0
 */
public class AlertSummaryListViewHandler extends SimpleRequestHandler
{

	/**
	 * This method returns the object after performing the action requested by the input object 
	 * 
	 * @param input object value of the data that contains the actions to be handled
	 * @return replyObject object value of the data after performing the action
	 * 
	 * @throws ProcessingErrorException Exception occured while processing
	 * 
	 * @see com.intellectdesign.canvas.handler.SimpleRequestHandler#process(java.lang.Object)
	 */
	@Override
	public ReplyObject processRequest(Vector inputVector) throws ProcessingErrorException
	{
		Object obj = null;
		ExtReplyObject replyObject = null;
		PerformanceTimer perfTimer = null;
		String sMsgId = null;
		String sGCIF = null;
		String sUserId = null;
		String sLocale = null;
		ArrayList arrALertList = null;
		Map cachedHashMap = null;
		Integer unreadCount = null;
		PaginationModel listViewPaginationModel = null;

		obj = inputVector.get(inputVector.size() - 1);// Object corresponding
		// to the value in Input
		// Vector for action
		replyObject = new ExtReplyObject();// ReplyObject holding response to be returned
		String sAction = (String) inputVector.get(TIConstants.INPUT_ACTION_INDEX_IN_VECTOR);
		HashMap hmNewDataMap = (HashMap) inputVector.get(inputVector.size() - 1);
		String userTimezone = (String) hmNewDataMap.get(JSPIOConstants.TIMEZONE_FORMAT);
		try
		{
			if (obj instanceof HashMap)
			{
				cachedHashMap = (HashMap) obj;
				if (!cachedHashMap.containsKey(AlertConstants.SORT_DIR))
					cachedHashMap.put(AlertConstants.SORT_DIR, AlertConstants.DESC);
				HashMap replyMap = null;
				sGCIF = (String) cachedHashMap.get(ListViewConstants.INPUT_GCIF);
				sLocale = (String) cachedHashMap.get(ListViewConstants.INPUT_LANGUAGE_ID);
				sUserId = (String) cachedHashMap.get(ListViewConstants.INPUT_USER_NO);
				if (ListViewConstants.INIT_ACTION.equals(sAction))
				{
					inboxChannelInstruction = new InboxChannelInstruction();

					if (ListViewConstants.INIT_ACTION.equals(sAction))
					{
						// listViewPaginationModel = new PaginationModel(cachedHashMap);
						perfTimer = new PerformanceTimer();
						perfTimer
								.startTimer("AlertSummaryListViewHandler.getAllMessages and getUnreadMessagesCount - initAction");
						arrALertList = inboxChannelInstruction.getAllMessages(sUserId, sGCIF, sLocale,
								listViewPaginationModel, createSortingModelUsing(cachedHashMap), userTimezone);
						unreadCount = inboxChannelInstruction.getUnreadMessagesCount(sUserId, sGCIF);
						replyMap = setAlertsToHashMap(arrALertList);
						perfTimer.endTimer();
						replyMap.put(AlertConstants.UNREAD_COUNT, unreadCount);
						// if (replyMap != null)
						// replyMap.put(ListViewConstants.TOTAL_COUNT,
						// listViewPaginationModel.calculateTotalCount(arrALertList));
					}
				}

				else if (ListViewConstants.UPDATE_REFRESH_ACTION.equals(sAction))
				{
					ArrayList arrMsgIdList = new ArrayList();
					inboxChannelInstruction = new InboxChannelInstruction();
					sMsgId = (String) ((HashMap) obj).get(AlertConstants.MSG_ID);
					arrMsgIdList.add(sMsgId);
					perfTimer = new PerformanceTimer();
					perfTimer.startTimer("AlertSummaryListViewHandler.markMessagesAsRead - updateRefreshAction");
					/*
					 * if (!isSimulationMode(cbxRequestDataObject))
					 * inboxChannelInstruction.markMessagesAsRead(arrMsgIdList, sUserId, sGCIF);
					 */
					// listViewPaginationModel = new PaginationModel(cachedHashMap);
					arrALertList = inboxChannelInstruction.getAllMessages(sUserId, sGCIF, sLocale,
							listViewPaginationModel, createSortingModelUsing(cachedHashMap), userTimezone);
					unreadCount = inboxChannelInstruction.getUnreadMessagesCount(sUserId, sGCIF);
					perfTimer.endTimer();
					replyMap = setAlertsToHashMap(arrALertList);
					replyMap.put(AlertConstants.UNREAD_COUNT, unreadCount);
					// if (replyMap != null)
					// replyMap.put(ListViewConstants.TOTAL_COUNT,
					// listViewPaginationModel.calculateTotalCount(arrALertList));
				} else if (AlertConstants.UNREAD_UNPOPPEDUP_HIGHALERT_COUNT_ACTION.equals(sAction))
				{
					ArrayList listUnpoppedUpAlerts = null;
					HashMap returnMap = null;
					boolean isUnPoppedUpHighAlertsPresent = false;
					inboxChannelInstruction = new InboxChannelInstruction();
					perfTimer = new PerformanceTimer();
					perfTimer
							.startTimer("AlertSummaryListViewHandler.fetchUnHandledAlertsForSeverity - unreadUnpoppedupHighAlertCountAction");
					listUnpoppedUpAlerts = inboxChannelInstruction.fetchUnHandledAlertsForSeverity("High", sUserId,
							sGCIF, sLocale);
					perfTimer.endTimer();
					if (listUnpoppedUpAlerts != null && !listUnpoppedUpAlerts.isEmpty())
					{
						isUnPoppedUpHighAlertsPresent = true;
					} else
					{
						isUnPoppedUpHighAlertsPresent = false;
					}
					returnMap = new HashMap();
					returnMap.put(AlertConstants.IS_UNPOPUP_HIGHALERTS_PRESENT, isUnPoppedUpHighAlertsPresent);

					replyMap = new HashMap();
					replyMap.put("ALL_RECORDS", returnMap);
				} else if (AlertConstants.UNREAD_UNPOPPEDUP_HIGHALERT_FETCH_ACTION.equals(sAction))
				{
					ArrayList listUnpoppedUpAlerts = null;
					inboxChannelInstruction = new InboxChannelInstruction();
					perfTimer = new PerformanceTimer();
					perfTimer
							.startTimer("AlertSummaryListViewHandler.fetchUnHandledAlertsForSeverity - unreadUnpoppedupHighAlertFetchAction");
					listUnpoppedUpAlerts = inboxChannelInstruction.fetchUnHandledAlertsForSeverity("High", sUserId,
							sGCIF, sLocale);
					replyMap = setAlertsToHashMap(listUnpoppedUpAlerts);
					perfTimer.endTimer();
				} else if (AlertConstants.GET_UNREAD_ALERT_COUNT_ACTION.equals(sAction))
				{
					ArrayList listUnpoppedUpAlerts = null;
					inboxChannelInstruction = new InboxChannelInstruction();
					List resultList = inboxChannelInstruction.getUrgentNormalAlertAndNotificationCount(sUserId, sGCIF);
					HashMap rowHashMap = null;
					for (Object rows : resultList)
					{
						rowHashMap = (HashMap) rows;
						if ("High".equals((rowHashMap.get("SEVERITY"))))
						{
							listUnpoppedUpAlerts = inboxChannelInstruction.fetchUnHandledAlertsForSeverity("High",
									sUserId, sGCIF, sLocale);
							replyMap = setAlertsToHashMap(listUnpoppedUpAlerts);
						}
					}
					if (replyMap == null)
					{
						replyMap = new HashMap();
					}
					Map tmpMap = (HashMap) resultList.get(0);
					String totalCount = ((Integer) tmpMap.get("NUM_ALERTS")).toString();
					tmpMap.put("NUM_ALERTS", totalCount);
					Map respMap = new HashMap();

					respMap.put("value", resultList);
					replyMap.put("JSON_MAP", respMap);

					// List resultMessageList = inboxChannelInstruction.getUrgentNormalMessageCount(sUserId, sGCIF);
					// replyMap.put("MESSAGE_COUNT", resultMessageList);

				} else if (AlertConstants.UPDATE_STATUS_ACTION.equals(sAction))
				{
					ArrayList listMessageIds = new ArrayList();
					String sMsgIds = (String) ((HashMap) obj).get(AlertConstants.MSG_IDS);
					StringTokenizer tokeniser = new StringTokenizer(sMsgIds, ",");
					while (tokeniser.hasMoreTokens())
					{
						listMessageIds.add(tokeniser.nextToken());
					}
					inboxChannelInstruction = new InboxChannelInstruction();
					perfTimer = new PerformanceTimer();
					perfTimer
							.startTimer("AlertSummaryListViewHandler.markMessagesAsSeverityHandled - updateStatusAction");
					perfTimer.endTimer();
					replyMap = new HashMap();
					replyMap.put(ListViewConstants.ALL_RECORDS, new ArrayList());
				} else if (AlertConstants.CHECK_FOR_NEW_ALERTS_ACTION.equals(sAction))
				{
					boolean isNewAlertsArrived = false;
					HashMap returnMap = null;
					inboxChannelInstruction = new InboxChannelInstruction();
					perfTimer = new PerformanceTimer();
					perfTimer.startTimer("AlertSummaryListViewHandler.checkForNewAlerts - checkForNewAlertsAction");
					isNewAlertsArrived = inboxChannelInstruction.checkForNewAlerts(sUserId, sGCIF);
					perfTimer.endTimer();
					returnMap = new HashMap();
					returnMap.put(AlertConstants.IS_NEW_ALERTS_PRESENT, isNewAlertsArrived);
					replyMap = new HashMap();
					replyMap.put("ALL_RECORDS", returnMap);
				} else if (AlertConstants.REFRESH_WIDGET_ACTION.equals(sAction))
				{
					inboxChannelInstruction = new InboxChannelInstruction();
					// listViewPaginationModel = new PaginationModel(cachedHashMap);
					perfTimer = new PerformanceTimer();
					perfTimer
							.startTimer("AlertSummaryListViewHandler.getAllMessages and getUnreadMessagesCount refreshWidgetAction");
					String severitySelected = (String) cachedHashMap.get(AlertConstants.SEVERITY_SELECTED);
					if (AlertConstants.MEDIUM.equals(severitySelected))
					{
						arrALertList = inboxChannelInstruction.getAllMessagesForSeverity(sUserId, sGCIF,
								AlertConstants.MEDIUM, sLocale, listViewPaginationModel,
								createSortingModelUsing(cachedHashMap), userTimezone);
					} else if (AlertConstants.HIGH.equals(severitySelected))
					{
						arrALertList = inboxChannelInstruction.getAllMessagesForSeverity(sUserId, sGCIF,
								AlertConstants.HIGH, sLocale, listViewPaginationModel,
								createSortingModelUsing(cachedHashMap), userTimezone);
					} else
					{
						arrALertList = inboxChannelInstruction.getAllMessages(sUserId, sGCIF, sLocale,
								listViewPaginationModel, createSortingModelUsing(cachedHashMap), userTimezone);
					}
					unreadCount = inboxChannelInstruction.getUnreadMessagesCount(sUserId, sGCIF);
					perfTimer.endTimer();
					replyMap = setAlertsToHashMap(arrALertList);
					replyMap.put(AlertConstants.UNREAD_COUNT, unreadCount);
					// if (replyMap != null)
					// replyMap.put(ListViewConstants.TOTAL_COUNT,
					// listViewPaginationModel.calculateTotalCount(arrALertList));
				} else if (AlertConstants.UPDATE_LAST_ACCESSED_TIME_ACTION.equals(sAction))
				{
					inboxChannelInstruction = new InboxChannelInstruction();
					perfTimer = new PerformanceTimer();
					perfTimer.startTimer("AlertSummaryListViewHandler.updateLastAccessedTime");
					inboxChannelInstruction.setUserAccessTime(sUserId);
					perfTimer.endTimer();
					replyMap = new HashMap();
				} else if (AlertConstants.GET_ALERT_DETAIL_MESSAGE.equals(sAction))
				{
				}

				else if (AlertConstants.UPDATE_MESSAGE_STATUS.equals(sAction))
				{
				}

				// Added to get notification count:
				/*
				 * else if(AlertListViewConstants.GET_NOTIFICATION_COUNT.equals(sAction)){ ArrayList notificationCount =
				 * null; inboxChannelInstruction = new InboxChannelInstruction(); List resultList =
				 * inboxChannelInstruction.getNotificationCount(sUserId, sGCIF); logger.debug("resultList : " +
				 * resultList);
				 * 
				 * if (replyMap == null) { replyMap = new HashMap(); } replyMap.put("TOTAL_COUNT", resultList);
				 * logger.debug("GET_NOTIFICATION_COUNT :replyMap " + replyMap); }
				 */
				// Added to get notification count:
				replyObject.headerMap = new HashMap();
				if (replyMap == null)
					replyMap = new HashMap();
				replyObject.headerMap.putAll(replyMap);
			}
		} catch (DatabaseException e)
		{
			throw new ProcessingErrorException(e);
		}
		return replyObject;
	}

	/**
	 * This is an empty implementation provided for initiateScreen for action INIT_ACTION  since nothing is to be done by the Handler.
	 * 
	 * @param inputVector vector object for init action
	 * @return ExtReplyObject 
	 */
	public ExtReplyObject initiateScreen(Vector inputVector)
	{
		return null;
	}

	/**
	 * This method converts the ArrayList of the Alert Data as HashMap of Alerts 
	 * 
	 * @param arrAlertList ArrayList of Alerts
	 * @return replyMap HashMap of Alerts
	 */
	private HashMap setAlertsToHashMap(ArrayList arrAlertList)
	{
		ArrayList resultList = new ArrayList();
		HashMap replyMap = new HashMap();
		Message alertVO = null;
		if (arrAlertList == null || arrAlertList.size() < 1)
		{
			replyMap.put(ListViewConstants.ALL_RECORDS, null);
			return replyMap;
		}
		HashMap recordMap = null;
		Iterator alertIterator = arrAlertList.iterator();
		while (alertIterator.hasNext())
		{
			recordMap = new HashMap();
			alertVO = (Message) alertIterator.next();
			recordMap.put(AlertConstants.MSG_ID, alertVO.getMessageId());
			recordMap.put(AlertConstants.SEVERITY, alertVO.getSeverity());
			recordMap.put(AlertConstants.MSG_TITLE, alertVO.getShortMessage());
			recordMap.put(AlertConstants.DATE_TIME_DT, alertVO.getStrMessageTimeStamp());
			if (alertVO.isRead())
			{
				recordMap.put(AlertConstants.READ_FLAG, AlertConstants.READ);
			} else
			{
				recordMap.put(AlertConstants.READ_FLAG, AlertConstants.UNREAD);
			}
			resultList.add(recordMap);
		}
		replyMap.put(ListViewConstants.ALL_RECORDS, resultList);
		return replyMap;
	}

	/**
	 * This method creates the object of sorted alert messages for the unsorted messages passed as parameters using the preferred 
	 * sorting order given in the List View Grid at the client side 
	 * 
	 * INFO : The user selected column value should be same as the database value.
	 * 
	 * @param params Map value of the alert message details
	 * 
	 * @return SortingModel sorted model object of the alert messags
	 */
	private SortingModel createSortingModelUsing(Map params)
	{

		Map<String, String> columnMap = new HashMap();
		columnMap.put("MSG_TITLE", "SHORT_MESSAGE");
		columnMap.put("PRODUCT", "PRODUCT_CODE");
		columnMap.put("STATUS", "ACTIONED_INDICATOR");
		columnMap.put("DATE_TIME", "MESSAGE_TS");

		return new SortingModel(params, "DATE_TIME", columnMap, "MESSAGE_ID", "DESC");
	}

	private InboxChannelInstruction inboxChannelInstruction = null;
	// Instance of Logger for this class
	private static final Logger LOGGER = Logger.getLogger(AlertSummaryListViewHandler.class);
}
