/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
package com.intellectdesign.canvas.syncaction;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONException;

import com.intellectdesign.canvas.action.PortletAction;
import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.exceptions.action.OrbiActionException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.sync.ICanvasSyncSupport;
import com.intellectdesign.canvas.web.config.ActionMap;

/**
 * Class to process sync Metadata which extends Portlet action
 * 
 * 
 */
public class SyncMetadataAction extends PortletAction implements ICanvasSyncSupport
{

	private static final Logger logger = Logger.getLogger(SyncMetadataAction.class);

	/**
	 * This is called from the base class to process sync Metadata action
	 * 
	 * @see com.intellectdesign.iportal.ws.framework.PortletAction#executePortletActionUsing(java.lang.String,
	 *      com.orbidirect.sessionmanager.SessionInfo, com.intellectdesign.canvas.actionmap.ActionMap, java.util.Map,
	 *      javax.servlet.http.HttpServletRequest)
	 * @see com.intellectdesign.canvas.action.PortletAction#executePortletActionUsing(java.lang.String,
	 *      com.intellectdesign.canvas.login.sessions.SessionInfo, com.intellectdesign.canvas.web.config.ActionMap,
	 *      java.util.Map, javax.servlet.http.HttpServletRequest)
	 * 
	 * @param action
	 * @param sessionInfo
	 * @param actionMap
	 * @param requestParams
	 * @param request
	 * @return ReplyObject
	 * @throws OrbiActionException
	 * @throws JSONException
	 * @see com.intellectdesign.canvas.action.PortletAction#executePortletActionUsing(java.lang.String,
	 *      com.intellectdesign.canvas.login.sessions.SessionInfo, com.intellectdesign.canvas.web.config.ActionMap,
	 *      java.util.Map, javax.servlet.http.HttpServletRequest)
	 */
	public ReplyObject executePortletActionUsing(String action, SessionInfo sessionInfo, ActionMap actionMap,
			Map requestParams, HttpServletRequest request) throws OrbiActionException
	{

		ArrayList<HashMap> jsonList = null;
		SyncActions synAction = null;
		JSONArray finalResp = null;
		ExtReplyObject replyobj = null;
		Map collidedResults = null;
		try
		{
			synAction = SyncActions.valueOf(action);
		} catch (IllegalArgumentException illegalArgException)
		{
			logger.cterror("CTRND00425");

		}
		if (synAction == null)
		{

			synAction = SyncActions.SYNC_DEFAULT;
		}
		try
		{
			switch (synAction)
			{
			case SYNC_METADATA:
			case SYNC_METADATA_CONFIRM:

				jsonList = (ArrayList) requestParams.get("SYNCMETADATA");
				logger.ctdebug("CTRND00426", action, jsonList);

				// Step 1: Process the sync metadata request params.
				collidedResults = syncActionHelper.getSyncRequestPackage(jsonList);

				// Step 2: Get the metadata response in JSON.
				finalResp = syncActionHelper.getResponse(collidedResults, request, synAction.name());
				logger.ctdebug("CTRND00427", synAction.name(), finalResp);

				// Step 3: Generate the reply object to deliver the metadata JSON response to client as expected.
				replyobj = (ExtReplyObject) syncActionHelper.generateReplyObj(finalResp, synAction.name());

				break;
			case INITIAL_METADATA:
				replyobj = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
				
				// Step 1: Process the whole sync metadata 
				collidedResults = (Map) replyobj.headerMap.get("INITIAL_METADATA");
				logger.ctdebug("CTRND00484", action, collidedResults);
				
				// Step 2: Get the metadata response in JSON.
				finalResp = syncActionHelper.getResponse(collidedResults, request, SyncActions.SYNC_METADATA_CONFIRM.toString());
				logger.ctdebug("CTRND00485", synAction.name(), finalResp);
				
				// Step 3: Generate the reply object to deliver the metadata JSON response to client as expected.
				replyobj = (ExtReplyObject) syncActionHelper.generateReplyObj(finalResp, synAction.name());
				
				break;
			default:

				replyobj = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
				break;
			}

		} catch (ProcessingErrorException procExcp)
		{
			logger.cterror("CTRND00430", procExcp, synAction);
			throw new OrbiActionException(FrameworkConstants.ERROR_SYSTEM_ERROR,
					"Received processing error while handling action - '" + synAction + "in syncMetaDataAction",
					procExcp);
		}

		logger.ctdebug("CTRND00431", replyobj);
		return replyobj;
	}

	/**
	 * The list of sync actions supported
	 * 
	 */
	public enum SyncActions
	{
		SYNC_METADATA, SYNC_METADATA_CONFIRM, SYNC_DEFAULT, INITIAL_METADATA;

	}

	/**
	 * @param keys
	 * @param request
	 * @return
	 * @throws ProcessingErrorException
	 * @see com.intellectdesign.canvas.sync.ICanvasSyncSupport#getSyncData(java.util.Map,
	 *      javax.servlet.http.HttpServletRequest)
	 */
	@Override
	public JSONArray getSyncData(Map keys, HttpServletRequest request) throws ProcessingErrorException
	{
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * @param keys
	 * @param request
	 * @return
	 * @throws ProcessingErrorException
	 * @see com.intellectdesign.canvas.sync.ICanvasSyncSupport#validateSyncList(java.util.Map,
	 *      javax.servlet.http.HttpServletRequest)
	 */
	@Override
	public JSONArray validateSyncList(Map keys, HttpServletRequest request) throws ProcessingErrorException
	{
		// TODO Auto-generated method stub
		return null;
	}

}
