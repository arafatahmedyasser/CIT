/*************************************************************************
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
 *************************************************************************/

package com.intellectdesign.canvas.alert.action;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.action.PortletAction;
import com.intellectdesign.canvas.alert.handler.AlertConstants;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.constants.listviews.ListViewConstants;
import com.intellectdesign.canvas.exceptions.action.OrbiActionException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.web.config.ActionMap;

/**
 * 
 * AlertSummaryListView Class, Intended to call handler class via JSPUtil.executeHostRequest() to get data from DB.
 * 
 * @version 1.0
 */
public class AlertSummaryListViewAction extends PortletAction
{

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.intellectdesign.orbioneonline.action.IOrbiAction#execute(com.orbidirect.sessionmanager.SessionInfo,
	 *      com.intellectdesign.orbioneonline.webutils.ForwardMap, javax.servlet.http.HttpServletRequest,
	 *      javax.servlet.http.HttpServletResponse)
	 */
	@Override
	/**
	 * Used to execute the action after validation
	 * @param action
	 * @param sessionInfo
	 * @param actionMap
	 * @param requestParams
	 * @param request
	 * @return ReplyObject
	 * @throws OrbiActionException
	 */
	public ReplyObject executePortletActionUsing(String action, SessionInfo sessionInfo, ActionMap actionMap,
			Map requestParams, HttpServletRequest request) throws OrbiActionException
	{
		ReplyObject reply = null;
		Map returnHeaderMap = null;
		String method = "[ AlertSummaryListViewAction ] : ";
		try
		{
			if (validateAction(action))
				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
			if (AlertConstants.GET_UNREAD_ALERT_COUNT_ACTION.equals(action))
			{
				/**
				 * if(reply!=null){ returnHeaderMap = ((ExtReplyObject) reply).headerMap; if(returnHeaderMap != null){
				 * List countList = (List)returnHeaderMap.get(ListViewConstants.TOTAL_COUNT); HashMap severityMap =
				 * null; for(Object severityObj : countList){ severityMap = (HashMap)severityObj;
				 * if(AlertListViewConstants.MEDIUM.equals( severityMap.get(AlertListViewConstants.SEVERITY))){
				 * sessionInfo.setNormalAlertsCounter(((Integer)severityMap.get(
				 * AlertListViewConstants.NUMBER_OF_ALERTS)).intValue());
				 * 
				 * }else if(AlertListViewConstants.HIGH.equals( severityMap.get(AlertListViewConstants.SEVERITY))){
				 * sessionInfo.setUrgentAlertsCounter(((Integer)severityMap.get(
				 * AlertListViewConstants.NUMBER_OF_ALERTS)).intValue());
				 * 
				 * } } } }
				 */
			}

			// JSONObjectBuilderForExtJs.buildAlertSummaryListViewMap(reply);
		} catch (ProcessingErrorException pex)
		{
			throw new OrbiActionException(pex.getErrorCode(), pex.getMessage());
		}
		return reply;
	}

	/**
	 * Validate the string action
	 * 
	 * @param sAction
	 * @return boolean
	 * @throws OrbiActionException
	 */

	private boolean validateAction(String sAction) throws OrbiActionException
	{
		boolean isValidAction = false;
		if (sAction == null || "".equals(sAction))
		{
			throw new OrbiActionException("INVALID_ACTION :", sAction + " is not valid Action ");
		} else if (ListViewConstants.INIT_ACTION.equals(sAction))
			isValidAction = true;
		else if (ListViewConstants.UPDATE_REFRESH_ACTION.equals(sAction))
			isValidAction = true;
		else if (AlertConstants.UNREAD_UNPOPPEDUP_HIGHALERT_COUNT_ACTION.equals(sAction))
			isValidAction = true;
		else if (AlertConstants.UNREAD_UNPOPPEDUP_HIGHALERT_FETCH_ACTION.equals(sAction))
			isValidAction = true;
		else if (AlertConstants.CHECK_FOR_NEW_ALERTS_ACTION.equals(sAction))
			isValidAction = true;
		else if (AlertConstants.REFRESH_WIDGET_ACTION.equals(sAction))
			isValidAction = true;
		else if (AlertConstants.UPDATE_LAST_ACCESSED_TIME_ACTION.equals(sAction))
			isValidAction = true;
		else if (AlertConstants.UPDATE_STATUS_ACTION.equals(sAction))
			isValidAction = true;
		else if (AlertConstants.GET_ALERT_DETAIL_MESSAGE.equals(sAction))
			isValidAction = true;
		else if (AlertConstants.GET_UNREAD_ALERT_COUNT_ACTION.equals(sAction))
			isValidAction = true;

		else if (AlertConstants.UPDATE_MESSAGE_STATUS.equals(sAction))
			isValidAction = true;

		return isValidAction;
	}

	private Logger logger = Logger.getLogger(AlertSummaryListViewAction.class);
}
