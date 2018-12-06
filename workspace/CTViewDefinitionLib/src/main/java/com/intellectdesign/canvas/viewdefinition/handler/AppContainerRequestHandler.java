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

package com.intellectdesign.canvas.viewdefinition.handler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.data.conversion.util.JSONToHashMapConverter;
import com.intellectdesign.canvas.data.conversion.util.OnlineJSONToHashmapConverter;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.TransactionManager;
import com.intellectdesign.canvas.entitlement.CanvasViewEntlVO;
import com.intellectdesign.canvas.entitlement.EntitlementException;
import com.intellectdesign.canvas.entitlement.EntitlementsHelper;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.exceptions.util.JSONConvertorException;
import com.intellectdesign.canvas.handler.SimpleRequestHandler;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.value.CanvasRequestVO;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionConstants;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionException;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionInstruction;

/**
 * This class is for app container request handler extends simple request handler.
 * 
 * @version 1.0
 */
public class AppContainerRequestHandler extends SimpleRequestHandler
{

	/**
	 * This is the entry point method for the request handler. Here we process the various actions
	 * 
	 * @param request The request received
	 * @return The ReplyObject that needs to be sent back to the invoker
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request
	 */
	public ReplyObject process(CanvasRequestVO request) throws ProcessingErrorException
	{
		PerformanceTimer perfTimer = new PerformanceTimer();
		ReplyObject reply = null;
		String action = request.getActionCode();

		if (FrameworkConstants.GET_APPS.equals(action))
		{
			perfTimer.startTimer("AppContainerRequestHandler.processInitializeAppRequest");
			reply = processInitializeAppRequest(request);
		} else if (FrameworkConstants.ADD_APPS.equals(action))
		{
			perfTimer.startTimer("AppContainerRequestHandler.processAddAppRequest");
			reply = processAddAppRequest(request);
		} else if (FrameworkConstants.DELETE_APP.equals(action))
		{
			perfTimer.startTimer("AppContainerRequestHandler.processDeleteAppRequest");
			reply = processDeleteAppRequest(request);
		}

		perfTimer.endTimer();
		LOGGER.ctinfo("CTVDF00004");
		return reply;
	}

	/**
	 * Deletes the record for the passed APP_ID and the APP_CONTAINER_ID in the APP_CONTAINER_DEFINITION table.(Favorite
	 * Apps)
	 * 
	 * @param dataObj The request received
	 * @return The Response for this request.
	 */
	private ReplyObject processDeleteAppRequest(CanvasRequestVO dataObj)
	{
		LOGGER.ctinfo("CTVDF00005");
		TransactionManager tranMgr = new TransactionManager();
		ExtReplyObject reply = new ExtReplyObject();
		reply.headerMap = new HashMap();

		try
		{
			tranMgr.begin();
			String appId = (String) dataObj.getRequestData().get("APP_ID");
			String userNo = dataObj.getUserContext().getUserNumber();
			String gcif = dataObj.getUserContext().getOwningGCIF();
			String appContainerId = (String) dataObj.getRequestData().get("APP_CONTAINER_ID");
			ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
			viewDefinitionInstruction.updateAppDefinitionForDelete(appId, userNo, gcif, appContainerId);
			tranMgr.commit();
			reply.headerMap.put("STATUS", "SUCCESS");
		} catch (ViewDefinitionException vdfe)
		{
			LOGGER.cterror("CTVDF00006", vdfe);
			reply.headerMap.put("STATUS", "FAILURE");
		} catch (DatabaseException e)
		{
			LOGGER.cterror("CTVDF00006", e);
			reply.headerMap.put("STATUS", "FAILURE");
		} finally
		{
			tranMgr.rollback();
		}
		LOGGER.ctinfo("CTVDF00007");
		return reply;
	}

	/**
	 * Adds the Apps to the corresponding app container for the respective user
	 * 
	 * @param dataObj The request received
	 * @return The Response for this request.
	 */
	private ReplyObject processAddAppRequest(CanvasRequestVO dataObj)
	{
		LOGGER.ctinfo("CTVDF00008");
		TransactionManager tranMgr = new TransactionManager();
		ExtReplyObject reply = new ExtReplyObject();
		reply.headerMap = new HashMap();

		try
		{
			List appList = populateAppList(dataObj.getUserContext().getUserNumber(), dataObj.getUserContext()
					.getOwningGCIF(), dataObj.getRequestData());
			tranMgr.begin();
			ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
			viewDefinitionInstruction.updateAppDefinitionForAdd(appList);
			tranMgr.commit();
			reply.headerMap.put("STATUS", "SUCCESS");
		} catch (ViewDefinitionException vdfe)
		{
			LOGGER.cterror("CTVDF00009", vdfe);
			reply.headerMap.put("STATUS", "FAILURE");
		} catch (DatabaseException e)
		{
			LOGGER.cterror("CTVDF00009", e);
			reply.headerMap.put("STATUS", "FAILURE");
		} finally
		{
			tranMgr.rollback();
		}
		LOGGER.ctinfo("CTVDF00010");
		return reply;
	}

	/**
	 * Converts the passed app list to a hashmap and appends user No and Gcif to it
	 * 
	 * @param userNo
	 * @param gcif
	 * @param inputParams
	 * @return
	 */
	private List populateAppList(String userNo, String gcif, Map inputParams)
	{
		LOGGER.ctinfo("CTVDF00011");
		List<HashMap> appList = null;
		try
		{
			String s = (String) inputParams.get("SELECTED_APPS");
			JSONToHashMapConverter js = new OnlineJSONToHashmapConverter();
			Map jm = js.convert(s);
			appList = (List) jm.get("APP_LIST");
			for (Map tmpMap : appList)
			{
				tmpMap.put("OD_USER_NO", userNo);
				tmpMap.put("OD_GCIF", gcif);
			}

		} catch (JSONConvertorException jsone)
		{
			LOGGER.cterror("CTVDF00012", jsone);
		}
		LOGGER.ctinfo("CTVDF00013");
		return appList;
	}

	/**
	 * The method to fetch the view entitlements from the specific entitlement class in the orbionedirect.properties
	 * 
	 * @param gcifNo
	 * @param userNo
	 * @return CanvasViewEntlVO
	 * @throws ViewDefinitionException
	 */
	private CanvasViewEntlVO getViewEntitlementVO(String gcifNo, String userNo, String sUserRole)
			throws EntitlementException
	{
		/**
		 * Get the Entitlements for the views to be rendered
		 */
		CanvasViewEntlVO entlvo = null;
		EntitlementsHelper entlHelper = new EntitlementsHelper();

		if (sUserRole == null)
		{
			entlvo = entlHelper.getUserAccessEntitlements(gcifNo, userNo);
		} else
		{
			entlvo = entlHelper.getUserAccessEntitlements(gcifNo, userNo, sUserRole);
		}
		return entlvo;
	}

	/**
	 * Performs the entitlement checks for the given user no and gcif. Returns the entitled apps for the user.
	 * 
	 * @param dataObj The request received
	 * @return The Response for this request.
	 * @throws ProcessingErrorException
	 */
	private ReplyObject processInitializeAppRequest(CanvasRequestVO dataObj) throws ProcessingErrorException
	{
		LOGGER.ctinfo("CTVDF00014");
		Boolean isEntitled = false;
		ExtReplyObject reply = new ExtReplyObject();
		reply.headerMap = new HashMap();
		String userNo = dataObj.getUserContext().getUserNumber();
		String gcifNo = dataObj.getUserContext().getOwningGCIF();
		String device = dataObj.getSessionContext().getDeviceType();
		String sUserRole = dataObj.getUserContext().getCurrentRoleId();
		List allApps = new ArrayList();
		try
		{
			ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
			List appList = viewDefinitionInstruction.getAllApps(device);

			/**
			 * Step 1: Fetch the user entitled products list from database.
			 * */
			CanvasViewEntlVO entlvo = getViewEntitlementVO(gcifNo, userNo, sUserRole);
			List entitledProdList = entlvo.getEntitlements();

			for (Object record : appList)
			{
				Map recordMap = (HashMap) record;
				isEntitled = performEntitlementCheck(entitledProdList, recordMap);
				if (isEntitled)
				{
					allApps.add(recordMap);
				}
			}
			if (allApps.size() > 0)
			{
				reply.headerMap.put("ALL_APPS", allApps);
			} else
			{
				reply.headerMap.put("ALL_APPS", ViewDefinitionConstants.APPS_NOT_AVAILABLE);
			}
		} catch (ViewDefinitionException vdfe)
		{
			LOGGER.cterror("CTVDF00015", vdfe);
			throw new ProcessingErrorException(vdfe);
		} catch (EntitlementException e)
		{
			LOGGER.cterror("CTVDF00015", e);
			throw new ProcessingErrorException(e);
		}
		LOGGER.ctinfo("CTVDF00016");
		return reply;
	}

	/**
	 * Validates the app against the entitled product map and returns boolean
	 * 
	 * @param entitledProdList
	 * @param recordMap
	 * @return
	 */
	private Boolean performEntitlementCheck(List entitledProdList, Map recordMap)
	{
		LOGGER.ctinfo("CTVDF00017");
		for (int i = 0; i < entitledProdList.size(); i++)
		{
			String appProduct = (String) recordMap.get("OD_PRODUCT_CODE");
			HashMap prodMap = (HashMap) entitledProdList.get(i);
			if (prodMap.get("PRODUCT").equals(appProduct))
			{
				String appSubProd = (String) recordMap.get("OD_SUBPROD_CODE");
				String appFunction = (String) recordMap.get("OD_FUNCTION_CODE");
				if (prodMap.get("SUBPROD").equals(appSubProd) && appFunction == null)
				{
					return true;
				} else if (prodMap.get("SUBPROD").equals(appSubProd) && prodMap.get("FUNCTION").equals(appFunction))
				{
					return true;
				}
			}

		}
		LOGGER.ctinfo("CTVDF00018");
		return false;

	}

	private Logger LOGGER = Logger.getLogger(AppContainerRequestHandler.class);
}
