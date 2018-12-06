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

package com.intellectdesign.canvas.viewdefinition.handler.cache;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.cache.handler.CacheConstants;
import com.intellectdesign.canvas.cache.handler.CacheDataBuilder;
import com.intellectdesign.canvas.entitlement.IAppContainerEntl;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.utils.ChannelUtils;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionConstants;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionException;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionInstruction;

/**
 * This class is for app container cache builder extends cache handler.
 * 
 * @version 1.0
 */
public class AppContainerCacheDataBuilder extends CacheDataBuilder
{
	/**
	 * this is ref to InitCache Session Map to AppContainerCacheBuilder
	 * 
	 * @param sessionMap
	 * @return
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#initializeCache(java.util.HashMap)
	 */
	@Override
	protected List initializeCache(HashMap sessionMap)
	{
		logger.ctinfo("CTVDF00196");
		List<Map> appList = new ArrayList<Map>();
		String gcif = null;
		String userno = null;
		SessionInfo sessInfo = null;
		String entlClassName = null;
		String appContainerId = null;
		Map<String, String> record = null;
		Map totalAppsMap = null;
		sessInfo = (SessionInfo) sessionMap.get(CacheConstants.OBJECT_SESSIONINFO);
		if (sessInfo == null)
		{
			logger.cterror("CTVDF00197", sessInfo);
			return null;
		}

		gcif = sessInfo.sCustNo;
		userno = sessInfo.userNo;
		deviceType = sessInfo.deviceType;
		logger.ctdebug("CTVDF00198", gcif, userno, deviceType);
		if (gcif == null || userno == null)
		{
			logger.cterror("CTVDF00199");
			return appList;
		}
		List appSourceData = retrieveAppSourceData(userno, gcif);
		IAppContainerEntl ientl = null;
		Map<String, Map> tempMap = new HashMap<String, Map>();
		Map<String, List<Map>> entlAppDataMap = new HashMap<String, List<Map>>();
		try
		{

			if (appSourceData.size() > 0)
			{
				for (int i = 0; i < appSourceData.size(); i++)
				{

					Boolean isEntlApp = false;
					record = (HashMap<String, String>) appSourceData.get(i);
					if (record.get(ViewDefinitionConstants.ENTL_TYPE).toString().equals("E"))
					{
						if (entlAppDataMap.containsKey(record.get(ViewDefinitionConstants.APP_ENTL_CLASS)))
						{
							List aList = (entlAppDataMap.get(record.get(ViewDefinitionConstants.APP_ENTL_CLASS)));
							aList.add(record);
						} else
						{
							List<Map> appDataList = new ArrayList<Map>();
							appDataList.add(record);
							entlAppDataMap.put(record.get(ViewDefinitionConstants.APP_ENTL_CLASS), appDataList);
						}
						isEntlApp = true;
					}
					if (!isEntlApp)
					{
						addAppForContainer(record, tempMap);
					}
				}
				/**
				 * Finally iterating through all the apps that require entitlement and adding them to the metadata map.
				 */
				for (Map.Entry<String, List<Map>> entry : entlAppDataMap.entrySet())
				{
					List recordList = entry.getValue();
					entlClassName = entry.getKey().toString();
					ientl = (IAppContainerEntl) Class.forName(entlClassName, true, this.getClass().getClassLoader())
							.newInstance();
					/**
					 * The hook for the developer to massage the app List based on entitlement
					 */
					ientl.getEntitledServices(recordList, userno, gcif);
					for (int j = 0; j < recordList.size(); j++)
					{
						addAppForContainer((Map) recordList.get(j), tempMap);
					}
				}
				appList.add(tempMap);
			}

		} catch (InstantiationException ie)
		{
			logger.cterror("CTVDF00200", appContainerId, ientl);
		} catch (IllegalAccessException iae)
		{
			logger.cterror("CTVDF00201", appContainerId, ientl);
		} catch (ClassNotFoundException cnfe)
		{
			logger.cterror("CTVDF00202", cnfe);
		}
		logger.ctinfo("CTVDF00203");

		return appList;
	}

	/**
	 * addAppForContainer, This will always added the passed app to the final container Map which will be stored in the
	 * cache.
	 * 
	 * @param record
	 * @param tempMap
	 */
	private void addAppForContainer(Map<String, String> record, Map<String, Map> tempMap)
	{
		logger.ctinfo("CTVDF00204");
		Map masterMap = new HashMap();
		List<Map> tmpList = new ArrayList<Map>();
		/**
		 * Getting the container Id and removing it from the metadata info as it is useless
		 */
		String appContainerId = record.get(ViewDefinitionConstants.APP_CONTAINER_ID);
		record.remove(ViewDefinitionConstants.APP_CONTAINER_ID);
		/**
		 * If the metadata Map already contains certain information about the app container,simply adding to the child
		 * apps else newly creating
		 */
		if (tempMap.containsKey(appContainerId))
		{
			Map aMap = tempMap.get(appContainerId);
			if (aMap.containsKey(ViewDefinitionConstants.CHILD_APPS) && validateChildApp(record))
			{

				((List) aMap.get(ViewDefinitionConstants.CHILD_APPS)).add(record);
			}
		} else
		{
			List recordList = new ArrayList();
			masterMap.put(ViewDefinitionConstants.FAV_APPS_REQ_IND,
					record.remove(ViewDefinitionConstants.FAV_APPS_REQ_IND));
			masterMap.put(ViewDefinitionConstants.BUNDLE_KEY, record.remove(ViewDefinitionConstants.BUNDLE_KEY));
			masterMap.put(ViewDefinitionConstants.PROPORTION, record.get(ViewDefinitionConstants.PROPORTION));
			masterMap.put(ViewDefinitionConstants.CHILD_APPS, recordList);
			if (record.containsKey(ViewDefinitionConstants.APP_ID)
					&& !record.get(ViewDefinitionConstants.APP_ID).isEmpty() && validateChildApp(record))
			{
				recordList.add(record);
			}
			tempMap.put(appContainerId, masterMap);
		}
		logger.ctinfo("CTVDF00205");

	}

	/**
	 * this is ref to ValidateChildApps
	 * 
	 * @param recordMap
	 * @return
	 */
	private boolean validateChildApp(Map recordMap)
	{
		boolean retFlag = false;

		String channelId = (String) recordMap.get(ViewDefinitionConstants.DEVICE_CHANNEL);
		String device = deviceType;
		if (channelId != null && !channelId.isEmpty())
		{
			retFlag = ChannelUtils.getDeviceFilter(channelId, device);
		} else
		{
			retFlag = true;
		}
		return retFlag;
	}

	/**
	 * Standard API to fetch the metadata
	 * 
	 * @return
	 */
	private List retrieveAppSourceData(String userNo, String gcif)
	{
		logger.ctinfo("CTVDF00206");
		List dataList = null;
		try
		{
			ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
			dataList = viewDefinitionInstruction.getAppSourceData(userNo, gcif);
		} catch (ViewDefinitionException vdfe)
		{
			logger.cterror("CTVDF00207", vdfe);
		}
		logger.ctinfo("CTVDF00208");
		return dataList;
	}

	/**
	 * this is ref to HashMap VaildParams
	 * 
	 * @param arg0
	 * @return
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#validateParameters(java.util.HashMap)
	 */
	@Override
	protected String validateParameters(HashMap arg0)
	{
		return null;
	}

	private String deviceType = null;
	private Logger logger = Logger.getLogger(AppContainerCacheDataBuilder.class);

}
