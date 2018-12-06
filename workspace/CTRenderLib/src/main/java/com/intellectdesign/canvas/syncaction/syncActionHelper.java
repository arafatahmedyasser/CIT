/**
 * Copyright 2015. Polaris Financial Technology Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Polaris Financial Technology 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Polaris Financial Technology Limited.
 * 
 */
package com.intellectdesign.canvas.syncaction;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.data.conversion.util.JSONObjectBuilderForExtJs;
import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.sync.CanvasSyncSupportRegistry;
import com.intellectdesign.canvas.sync.ICanvasSyncSupport;

/**
 * This is a simple helper class which reduces the sync related methods/classes complex functionalities like repetetive
 * loops to generic helper methods for readabilty.
 * 
 * The below methods can be accessed in static manner.
 * 
 * <pre>
 * syncActionHelper.getSyncRequestPackage
 * syncActionHelper.getResponse
 * syncActionHelper.generateReplyObj
 * </pre>
 * 
 */
public final class syncActionHelper
{

	private static final Logger logger = Logger.getLogger(syncActionHelper.class);

	/**
	 * This getSyncRequestPackage method which helps to get the implementation module keys and sync time which is
	 * necessary for processing the related metadata,moreover this is a simple utility method to segregate the hash map
	 * of data listed for easy processing sent from client.
	 * 
	 * @param jsonList
	 * @return Map
	 */
	public static Map getSyncRequestPackage(ArrayList<HashMap> jsonList)
	{

		Map<String, ArrayList> syncRequestPackage = new HashMap<String, ArrayList>();
		String syncTime = null;
		Map<String, String> syncTimeMap = new HashMap<String, String>();
		ArrayList typeList = null;
		HashMap collideResults = new HashMap();
		for (HashMap jsonMap : jsonList)
		{
			String type = (String) jsonMap.get(FrameworkConstants.SyncMetadataConstants.ATTR_TYPE.getName());
			syncTime = (String) jsonMap.get(FrameworkConstants.SyncMetadataConstants.ATTR_SYNC_TIME.getName());
			syncTimeMap.put(type, syncTime);
			typeList = (ArrayList) jsonMap.get(FrameworkConstants.SyncMetadataConstants.ATTR_KEYS.getName());
			syncRequestPackage.put(type, typeList);
		}

		collideResults.put("requestPackage", syncRequestPackage);
		collideResults.put("syncTimeMap", syncTimeMap);
		return collideResults;

	}

	/**
	 * This is the core related with sync metadata action class which helps to get the sync metadata information or
	 * validate the sync metadata information based on the requested method getSyncData or validateSyncData whch finally
	 * earns the result as JSON array to avoid the complication of reconstructing the response to JSON string.
	 * 
	 * @param collidedResults
	 * @param request
	 * @param timezoneid
	 * @param action
	 * @return JSONArray
	 * @throws ProcessingErrorException
	 */

	public static JSONArray getResponse(Map collidedResults, HttpServletRequest request, String action)
			throws ProcessingErrorException
	{

		Iterator<Entry<String, ArrayList>> reqIterator = null;
		Entry<String, ArrayList> anEntry = null;
		JSONArray perResp = null;
		String moduleId = null;
		JSONObject fullResp = null;
		JSONArray finalResp = null;
		Map<String, ArrayList> syncRequestPackage = null;
		Map<String, String> syncTimeMap = null;

		syncRequestPackage = (Map<String, ArrayList>) collidedResults.get("requestPackage");
		reqIterator = syncRequestPackage.entrySet().iterator();
		syncTimeMap = (Map<String, String>) collidedResults.get("syncTimeMap");
		finalResp = new JSONArray();
		while (reqIterator.hasNext())
		{
			HashMap reqKeys = new HashMap();
			anEntry = reqIterator.next();
			moduleId = anEntry.getKey();
			reqKeys.put(FrameworkConstants.SyncMetadataConstants.ATTR_TYPE.getName(), moduleId);
			reqKeys.put(FrameworkConstants.SyncMetadataConstants.ATTR_SYNC_TIME.getName(), syncTimeMap.get(moduleId));
			reqKeys.put(FrameworkConstants.SyncMetadataConstants.ATTR_KEYS.getName(), anEntry.getValue());
			try
			{
				ICanvasSyncSupport supp = CanvasSyncSupportRegistry.getImplementationFor(moduleId);
				// For every module, get the impl object and ask it to get or validate syncMetadata.
				if (action.equals("SYNC_METADATA"))
					perResp = supp.validateSyncList(reqKeys, request);
				else
					perResp = supp.getSyncData(reqKeys, request);

				// Adding to proper JSON object
				fullResp = new JSONObject();
				fullResp.put(FrameworkConstants.SyncMetadataConstants.ATTR_TYPE.getName(), moduleId);
				fullResp.put(FrameworkConstants.SyncMetadataConstants.ATTR_DATA.getName(), perResp);
				fullResp.put(FrameworkConstants.SyncMetadataConstants.ATTR_SYNC_TIME.getName(), getServerDateAndTime());
				finalResp.put(fullResp);
			} catch (ProcessingErrorException proExcep)
			{
				throw proExcep;

			} catch (JSONException jsonExcep)
			{
				logger.cterror("CTRND00432", jsonExcep, moduleId, action);

				throw new ProcessingErrorException(jsonExcep);

			} catch (BaseException baseExcep)
			{
				logger.cterror("CTRND00433", baseExcep, moduleId, action);
				if (FrameworkConstants.SyncMetadataConstants.MISSING_TARGET_CLASS.getName().equals(
						baseExcep.getErrorCode()))
				{
					/**
					 * The exception is catched abruptly if the error code depicted as MISSING_TARGET stacking base
					 * exception.The target implementation classes are not available for modules like
					 * events,WORKSPACES,JSRBL,MENU,ZOLOG,PREFERENCES,APP_CONTAINER and URLHASHENCRYPTION therefore to
					 * avoid exception this is catched.
					 */
				} else
				{
					throw new ProcessingErrorException(baseExcep);
				}
			}

		}

		return finalResp;

	}

	/**
	 * Helper method that generates reply object related only to Sync metadata action
	 * 
	 * 
	 * @param finalResp
	 * @param synAction
	 * @param serverDateTime
	 * @return ReplyObject
	 * @throws JSONException
	 */

	public static ReplyObject generateReplyObj(JSONArray finalResp, String synAction) throws ProcessingErrorException
	{
		ExtReplyObject replyobj = new ExtReplyObject();
		try
		{
			replyobj.headerMap = new HashMap<String, JSONObject>();
			JSONObject jsonSync = new JSONObject();
			jsonSync.put(FrameworkConstants.SyncMetadataConstants.SYNC_METADATA.getName(), finalResp);
			jsonSync.put("SEVER_SYNCTIME", getServerDateAndTime());
			replyobj.headerMap.put(JSONObjectBuilderForExtJs.JSON_MAP, jsonSync);
			logger.ctdebug("CTRND00433", synAction, replyobj);
		} catch (JSONException e)
		{
			logger.cterror("CTRND00429", e, synAction);
			throw new ProcessingErrorException(FrameworkConstants.ERROR_SYSTEM_ERROR,
					"Received processing error while handling action - '" + synAction + "in syncMetaDataAction", e);
		}

		return replyobj;
	}

	/**
	 * Helper method that get server Date and Time
	 * 
	 * @param timeZone
	 * @return serverDateTime
	 */
	private static String getServerDateAndTime()
	{
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		Date date = new Date();
		String DateAndTime = dateFormat.format(date);
		return DateAndTime;
	}


}
