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
package com.intellectdesign.canvas.sync.handler;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.constants.util.TIConstants;
import com.intellectdesign.canvas.constants.util.TRConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.handler.SimpleRequestHandler;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.sync.SyncMetadataInstruction;

/**
 * This is the class through which the datas that is used to retrive the synchronization metadata information like
 * Widget, View,Form etc.
 * 
 */
public class SyncMetadataHandler extends SimpleRequestHandler
{
	private static final Logger LOGGER = Logger.getLogger(SyncMetadataHandler.class);
	private static int VER_NO_POS = 16;
	private static int TXN_STATUS_POS = 15;
	public static final int HASH_MAP_POSITION = 26;

	/**
	 * Default constrctor does nothing.
	 */
	public SyncMetadataHandler()
	{
	}

	/**
	 * This method is called from the framework when it encounters any unknown framework action.
	 * 
	 * @param inputVector
	 * @return ReplyObject of processed request
	 * @throws ProcessingErrorException
	 * @see com.intellectdesign.canvas.handler.SimpleRequestHandler#processRequest(java.util.Vector)
	 */
	public ReplyObject processRequest(Vector inputVector) throws ProcessingErrorException
	{
		ExtReplyObject reply = null;
		String action = (String) inputVector.get(TIConstants.INPUT_ACTION_INDEX_IN_VECTOR);

		if ("SYNC_METADATA".equals(action))
		{
			reply = retrieveSyncMetadataInfo(inputVector);
		} else if ("INITIAL_METADATA".equals(action))
		{
			reply = retrieveInitialMetadataInfo(inputVector);
		} else if ("GET_SERVER_TIME".equals(action))
		{
			String serverDateTime = getServerDateAndTime();
			HashMap hmap = new HashMap();
			hmap.put(JSPIOConstants.TXN_PROCESS_DATE_TIME, serverDateTime);
			reply = new ExtReplyObject();
			reply.headerMap = new HashMap();
			reply.headerMap.put("JSON_MAP", hmap);
		} else
		{
		}
		return reply;
	}

	/**
	 * This method retrives the initial metadata information 
	 * based on Login User 
	 * 
	 * @param inputVector
	 * @return ExtReplyObject contains initial metadata list
	 * @throws ProcessingErrorException
	 */
	private ExtReplyObject retrieveInitialMetadataInfo(Vector inputVector) throws ProcessingErrorException
	{
		ExtReplyObject reply = null;
		List<HashMap> initialMetadataList = null;
		Map collidedResults = null;
		String userNo = (String) inputVector.get(TIConstants.USER_NO_INDEX_IN_VECTOR);
		try
		{
			SyncMetadataInstruction syncdmintsruction = new SyncMetadataInstruction();
			initialMetadataList = syncdmintsruction.getInitialMetaDataInfo(userNo);
			LOGGER.ctinfo("initialMetadataList--"+initialMetadataList);
			collidedResults = getInitialMetadataPackage(initialMetadataList);
			LOGGER.ctinfo("collidedResults--"+collidedResults);
		} catch (DatabaseException dbExp)
		{
			LOGGER.cterror("CTBAS00129", dbExp);
			throw new ProcessingErrorException(dbExp);
		} catch (NullPointerException nullExp)
		{
			LOGGER.cterror("CTBAS00130", nullExp);
			throw new ProcessingErrorException(nullExp);
		}
		reply = new ExtReplyObject();
		reply.headerMap = new HashMap();
		reply.headerMap.put("INITIAL_METADATA", collidedResults);
		return reply;
	}

	/**
	 * Utility method that segregates the initialMetadataList into the module Type and Keys
	 * necessary for processing the related metadata.
	 * 
	 * @param initialMetadataList
	 * @return Map contains Module type with Keys list and TimeMap
	 */
	private static Map getInitialMetadataPackage(List<HashMap> initialMetadataList)
	{
		Map<String, ArrayList> initialReqPackage = new HashMap<String, ArrayList>();
		HashMap collideResults = new HashMap();
		Map<String, String> initialTimeMap = new HashMap<String, String>();
		HashMap initialMap = null;
		ArrayList widgetList = new ArrayList();
		ArrayList mulitWgtList = new ArrayList();
		ArrayList formList = new ArrayList();
		ArrayList frmContainerList = new ArrayList();
		String DateAndTime = getServerDateAndTime();
		LOGGER.ctinfo("DateAndTime--"+DateAndTime);
		for (int i = 0; initialMetadataList.size() > i; i++)
		{
			initialMap = initialMetadataList.get(i);
			if (initialMap.get("itemType").equals("WIDGET"))
			{
				widgetList.add(initialMap.get("itemID"));
			} else if (initialMap.get("itemType").equals("MULTI_WIDGET"))
			{
				mulitWgtList.add(initialMap.get("itemID"));
			} else if (initialMap.get("itemType").equals("FORM"))
			{
				String formId = (String) initialMap.get("itemID");
				boolean dataSupportFlag = true;
				if (initialMap.get("dataSupportClass") != null && initialMap.get("dataSupportClass") != "")
				{
					String supportClassName = (String) initialMap.get("dataSupportClass");
					try
					{
						Class.forName(supportClassName);
					} catch (ClassNotFoundException ex)
					{
						LOGGER.ctdebug("CTBAS00128", ex, supportClassName, formId);
						dataSupportFlag = false;
					}
				}
				if (dataSupportFlag)
				{
					formList.add(formId);
				}
			} else if (initialMap.get("itemType").equals("FORM_CONTAINER"))
			{
				frmContainerList.add(initialMap.get("itemID"));
			}
		}
		initialReqPackage.put("WIDGET", widgetList);
		initialTimeMap.put("WIDGET", DateAndTime);
		initialReqPackage.put("MULTI_WIDGET", mulitWgtList);
		initialTimeMap.put("MULTI_WIDGET", DateAndTime);
		initialReqPackage.put("FORM", formList);
		initialTimeMap.put("FORM", DateAndTime);
		initialReqPackage.put("FORM_CONTAINER", frmContainerList);
		LOGGER.ctinfo("initialReqPackage--"+initialReqPackage);
		initialTimeMap.put("FORM_CONTAINER", DateAndTime);
		collideResults.put("requestPackage", initialReqPackage);
		collideResults.put("syncTimeMap", initialTimeMap);
		return collideResults;
	}

	/**
	 * This method retreives the metadata info based on the container
	 * type(WIDGET/FORM/MULTI_WIDGET/FORM_CONTAINER/WIDGET_MD)
	 * 
	 * @param inputVector
	 * @return ExtReplyObject contains synced metadata list
	 * @throws ProcessingErrorException
	 */
	private ExtReplyObject retrieveSyncMetadataInfo(Vector inputVector) throws ProcessingErrorException
	{
		HashMap params = getFieldsHashMapFromVector(inputVector);
		ExtReplyObject reply = null;
		SyncMetadataInstruction sync = null;
		String syncTime = null;
		ArrayList idList = null;
		String type = null;
		Map keys = null;
		List syncList = null;
		try
		{
			keys = (HashMap) params.get(FrameworkConstants.SyncMetadataConstants.ATTR_KEYS.getName());
			type = (String) keys.get(FrameworkConstants.SyncMetadataConstants.ATTR_TYPE.getName());
			syncTime = (String) keys.get(FrameworkConstants.SyncMetadataConstants.ATTR_SYNC_TIME.getName());
			idList = (ArrayList) keys.get(FrameworkConstants.SyncMetadataConstants.ATTR_KEYS.getName());
			sync = new SyncMetadataInstruction();
			syncList = sync.getMetaDataInfo(type, idList, syncTime);
		} catch (DatabaseException dbExp)
		{
			LOGGER.cterror("CTBAS00129", dbExp);
			throw new ProcessingErrorException(dbExp);
		} catch (NullPointerException nullExp)
		{
			LOGGER.cterror("CTBAS00130", nullExp);
			throw new ProcessingErrorException(nullExp);
		}
		reply = new ExtReplyObject();
		reply.headerMap = new HashMap();
		reply.headerMap.put("SYNC_METADATA", syncList);
		return reply;
	}

	/**
	 * Gets the cached HashMap from InputVector. Transaction related data is also populated in the return HashMap.
	 * 
	 * @param Vector Contains framework defined fields in positions ranging from 0 to 28+
	 * @return Map Cached HashMap with additional data from Vector
	 */
	protected static Map getAugmentedCachedHashMap(Vector inputVector)
	{
		HashMap map = getFieldsHashMapFromVector(inputVector);
		map.put(JSPIOConstants.INPUT_REFERENCE_NO, inputVector.get(TIConstants.REFERENCE_NO_POS));
		map.put(TRConstants.VER_NO, inputVector.get(VER_NO_POS));
		map.put(TIConstants.TXN_STATUS, inputVector.get(TXN_STATUS_POS));

		map.put(TIConstants.CHANNEL_ID, inputVector.get(10));

		return map;
	}

	/**
	 * 
	 * Refactored method to get the fields hashmap from vector either from the 26th index in the vector, if not get from
	 * the last but one the position from the vector
	 * 
	 * @param inputVector
	 * @return the hashpmap present in the vector
	 */
	private static HashMap getFieldsHashMapFromVector(Vector inputVector)
	{
		HashMap map = new HashMap();
		Object cachedHashMapObj = inputVector.get(HASH_MAP_POSITION + 1);
		if (cachedHashMapObj instanceof HashMap)
			map = (HashMap) cachedHashMapObj;
		else
		{
			cachedHashMapObj = inputVector.get(inputVector.size() + TIConstants.REL_CACHEDMAP_INDEX_IN_VECTOR);
			if (cachedHashMapObj instanceof HashMap)
				map = (HashMap) cachedHashMapObj;
		}
		return map;
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
