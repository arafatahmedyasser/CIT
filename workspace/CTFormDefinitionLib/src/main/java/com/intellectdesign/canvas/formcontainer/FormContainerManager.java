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
 */

package com.intellectdesign.canvas.formcontainer;

import static com.intellectdesign.canvas.proxycaller.ProxyCaller.on;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ImplClassDescriptor;
import com.intellectdesign.canvas.config.SystemPreferenceDescriptor;
import com.intellectdesign.canvas.entitlement.CanvasViewEntlVO;
import com.intellectdesign.canvas.entitlement.EntitlementException;
import com.intellectdesign.canvas.entitlement.EntitlementsHelper;
import com.intellectdesign.canvas.event.helper.EventConfigHelper;
import com.intellectdesign.canvas.event.helper.ICanvasEventInterceptor;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.proxycaller.ProxyCallerException;
import com.intellectdesign.canvas.utils.ChannelUtils;

/**
 * This class retrieves the metadata for the form containers from the cache.
 * 
 * @version 1.0
 */
public class FormContainerManager
{

	/***
	 * This method retrieves the metadata for the form container from the cache and returns it as Hashmap.
	 * 
	 * @param requestMap - Mapping of request that contains the Form Container Id
	 * @param gcif - String value of the GCIF No
	 * @param userno - String value of the User No
	 * @return HashMap - HashMap object that contains the Form Container defintion, event details and the actions buttons as meta data
	 *  
	 */
	public final HashMap getcontainerMetadata(final Map requestMap, final String gcif, final String userNo) throws ProcessingErrorException
	{

		CacheManager cacheManager = CacheManager.getFWInstance();
		String device=(String)requestMap.get("deviceType");
		/* Container Id is obtained from the Request params map */
		String containerId = (String) requestMap.get("FORM_CONTAINER_ID");
		// The List of tools that has been configured for the respective devices.
		List<Map> deviceTools = (List<Map>) requestMap.get(FormContainerConstants.APPLICABLE_TOOLS);

		List formContainerDefnList = cacheManager.getDataFromCache(null, "FORM_CONTAINER_META_CACHE");
	
		logger.ctdebug("CTFDF00105", formContainerDefnList);

		HashMap<String, HashMap<String, List<HashMap<String, Object>>>> newFormContainerMap = new HashMap<String, HashMap<String, List<HashMap<String, Object>>>>();
		List<HashMap<String, Object>> buttonList = new ArrayList<HashMap<String, Object>>();
		EventConfigHelper eventConfigHlpr = new EventConfigHelper();
		HashMap formContainMap = null;
		HashMap<String, Object> actionBtnMap = null;

		HashMap tempMap = null;

		if (formContainerDefnList != null)
		{

			ConfigurationManager conf = ConfigurationManager.getInstance();
			SystemPreferenceDescriptor sysPref = conf.getSystemPrefDescriptor();

			String alignPosBtn = sysPref.getPosBtnAlign();
			String alignNegBtn = sysPref.getNegBtnAlign();
			
			List entitledFuncList=getEntitledFunctions(gcif, userNo);			
			
			for (int i = 0; i < formContainerDefnList.size(); i++)
			{
				formContainMap = new HashMap();
				actionBtnMap = new HashMap<String, Object>();

				tempMap = (HashMap) formContainerDefnList.get(i);
				if (tempMap.get("CONTAINER_ID").equals(containerId))
				{
					HashMap btnAlignmnt = new HashMap();
					String eventId = (String) tempMap.get("EVENT_ID");
					actionBtnMap.put("CHANNEL_ID", tempMap.get("CHANNEL_ID"));
					actionBtnMap.put("EVENT_ID", eventId);
					actionBtnMap.put("ACTION_ID", tempMap.get("ACTION_ID"));
					actionBtnMap.put("CONTAINER_ID", tempMap.get("CONTAINER_ID"));
					actionBtnMap.put("CONTEXT_FORM_RENDER", tempMap.get("CONTEXT_FORM_RENDER"));
					actionBtnMap.put("ACTION_TYPE", tempMap.get("ACTION_TYPE"));
					actionBtnMap.put("BLOCK_POSITION", tempMap.get("BLOCK_POSITION"));
					actionBtnMap.put("POSITION", tempMap.get("POSITION"));
					// Event Details parameter from the EvenConfigHelper interceptor
					requestMap.put("ENTL_FUNCTIONS", entitledFuncList);
					HashMap eventDtlsMap = eventConfigHlpr.getEventDetails(eventId);
					actionBtnMap.put("PRODUCT_CODE", eventDtlsMap.get("PRODUCT_CODE"));
					actionBtnMap.put("SUBPRODUCT_CODE", eventDtlsMap.get("SUBPRODUCT_CODE"));
					actionBtnMap.put("FUNCTION_CODE", eventDtlsMap.get("FUNCTION_CODE"));
					actionBtnMap.put("ACTION_CODE", eventDtlsMap.get("ACTION_CODE"));
					actionBtnMap.put("PAGE_CODE", eventDtlsMap.get("PAGE_CODE"));
					actionBtnMap.put("HOST_CODE", eventDtlsMap.get("HOST_CODE"));
					actionBtnMap.put("EVENT_TYPE", eventDtlsMap.get("EVENT_TYPE"));
					actionBtnMap.put("EVENT_DESC", eventDtlsMap.get("EVENT_DESC"));
					actionBtnMap.put("EVENT_NAME", eventDtlsMap.get("EVENT_NAME"));
					actionBtnMap.put("EVENT_PREPROCESSORS", eventDtlsMap.get("EVENT_PREPROCESSORS"));
					HashMap addEventDtlsMap = getEventDtls(eventId, requestMap);
					actionBtnMap.putAll(addEventDtlsMap);
					
					if (ChannelUtils.getDeviceFilter(actionBtnMap.get("CHANNEL_ID").toString(),device )){
					buttonList.add(actionBtnMap);
					}

					requestMap.put("ENTL_FUNCTIONS", entitledFuncList);
					btnAlignmnt.put("POS_BTN_ALIGN", alignPosBtn);
					btnAlignmnt.put("NEG_BTN_ALIGN", alignNegBtn);
					formContainMap.put("BTN_POSN", btnAlignmnt);
					
					if(ChannelUtils.getDeviceFilter(tempMap.get("FCD_CHANNEL_ID").toString(), device)){
					if (!formContainMap.containsKey("CONTAINER_ID"))
					{
						formContainMap.put("CONTAINER_ID", tempMap.get("CONTAINER_ID"));
						formContainMap.put("FORM_ID", tempMap.get("FORM_ID"));
						formContainMap.put("WINDOW_TITLE", tempMap.get("WINDOW_TITLE"));
						formContainMap.put("BUNDLE_KEY", tempMap.get("BUNDLE_KEY"));
						formContainMap.put("WINHEIGHT", tempMap.get("WINHEIGHT"));
						formContainMap.put("WINWIDTH", tempMap.get("WINWIDTH"));
						formContainMap.put("CLOSED_IND", tempMap.get("CLOSED_IND"));
						if (ChannelUtils.getToolsConfig(deviceTools, "export"))
						{
							formContainMap.put("EXPORT_IND", tempMap.get("EXPORT_IND"));
						}
						if (ChannelUtils.getToolsConfig(deviceTools, "print"))
						{
							formContainMap.put("PRINT_IND", tempMap.get("PRINT_IND"));
						}
						if (ChannelUtils.getToolsConfig(deviceTools, "help"))
						{
							formContainMap.put("HELP_IND", tempMap.get("HELP_IND"));
						}

						formContainMap.put("MODAL_IND", tempMap.get("MODAL_IND"));
						formContainMap.put("CONTEXT_FORM_RENDER", tempMap.get("CONTEXT_FORM_RENDER"));
						formContainMap.put("MIN_WINWIDTH", tempMap.get("MIN_WINWIDTH"));
					}

					formContainMap.put("ACTIONS", buttonList);
					formContainMap.put("ENTL_FUNCTIONS", entitledFuncList);
					newFormContainerMap.put(containerId, formContainMap);
					}
				}

			}
		}
		logger.ctdebug("CTFDF00106", newFormContainerMap);

		return newFormContainerMap;
	}
	
	/**
	 * This reterives the event preprocessor data from the implementation's specific interceptor. 
	 * @param eventId - String value of the EventId
	 * @param requestMap - Mapping of request that contains the Form Container Id
	 * @return - Hashmap of Event configuration that contains the Event Id, product, sub product and function codes, page code
	 * @throws ProcessingErrorException
	 */
	public HashMap getEventDtls(String eventId, Map requestMap) throws ProcessingErrorException{
		
		ConfigurationManager manager = ConfigurationManager.getInstance();
		ImplClassDescriptor descriptor = manager.getImplClassDescriptor();

		ICanvasEventInterceptor eventInterceptor = null;
		String interceptorClass = descriptor.getEventInterceptorClass();
		try
		{
			eventInterceptor = (ICanvasEventInterceptor) on(interceptorClass).create().get();
		} catch (ProxyCallerException invokeException)
		{
			// Means there is an error in the creation of the interceptor.
			logger.cterror("CTRND00381", invokeException, interceptorClass);
			throw new ProcessingErrorException(invokeException);
		}
		HashMap eventParamsMap = eventInterceptor.getEventDetails(eventId, requestMap);
		if (eventParamsMap == null)
			eventParamsMap = new HashMap();

		return eventParamsMap;

	}
	
	/**
	 * This method adds the Entitled functions to the request params of the vector.
	 * 
	 * @param entlFuncList
	 * @param reqParams
	 * @return
	 * @throws ProcessingErrorException 
	 */
	private List getEntitledFunctions(String gcif, String userNo) throws ProcessingErrorException
	{
		CanvasViewEntlVO userEntilements;
		if (gcif == null || userNo == null)
		{
			logger.cterror("gcif is userno is null for the logged in user.");
			return null;
		}
		EntitlementsHelper entlHelper = new EntitlementsHelper();
		try
		{
			userEntilements = entlHelper.getUserAccessEntitlements(gcif, userNo);
		} catch (EntitlementException e)
		{
			throw new ProcessingErrorException(e);
		}
		logger.ctdebug("$$$ Exiting getproductFunctionVOList method == EntitledFunctionsCacheHandler:::");
		return userEntilements.getEntitlements();
	}
	
	private static final Logger logger = Logger.getLogger(FormContainerManager.class);

}
