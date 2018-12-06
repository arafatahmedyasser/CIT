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

package com.intellectdesign.canvas.hal;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.constants.infra.InfraConstants;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This class is for invoking hal handler.
 * 
 * @version 1.0
 */
public class HALInvoker implements HALHandlerInvoker
{

	/**
	 * Logger Object
	 */
	private transient Logger logger;

	/** Creates a new instance of HALInvoker */
	public HALInvoker()
	{
		String methodName = " [HALInvoker.Create()] ";
		logger = Logger.getLogger(HALInvoker.class);
		logger.ctinfo("CTHAL00001", methodName);
	}

	/**
	 * invokeHALProcess method for HALLayer. This method takes Request in HashMap and sends Response in HashMap. This
	 * method internally calls processRequest(HARequest)
	 * 
	 * @param req
	 * @return HashMap
	 * @throws HALException
	 * @see com.intellectdesign.canvas.hal.HALHandlerInvoker#invokeHALProcess(java.util.HashMap)
	 */
	@Override
	public HashMap invokeHALProcess(HashMap req) throws HALException
	{

		String methodName = " [HAResolverSSB.process(HashMap request)] ";
		logger.ctinfo("CTHAL00001", methodName);

		HARequest haReq = null;
		String errorCode = null;
		String errorMsg = null;
		int communicationType = -1;

		Object data = null;
		HAResponse haResp = null;
		HashMap resp = null;
		int status = -1;
		String appid = null;
		String temp = "";

		try
		{

			appid = (String) req.get(InfraConstants.APPID);
			temp = (String) req.get(InfraConstants.COMMUNICATION_TYPE);

			if (appid == null)
			{
				logger.cterror("CTHAL00027", req);
				throw new HALException(InfraConstants.HAL_ERR_INVALID_APPID_CONF_INFO,
						"Appid not found in the given Request.");
			}

			logger.ctdebug("CTHAL00026", methodName, appid);

			if (temp != null)
			{
				if (temp.equalsIgnoreCase("A"))
				{
					communicationType = HARequest.ASYNC;
				} else if (temp.equalsIgnoreCase("S"))
				{
					communicationType = HARequest.SYNC;
				} else
				{
					logger.cterror("CTHAL00028", methodName, temp);
					throw new HALException(InfraConstants.HAL_ERR_INVALID_ASYNC_FLAG,
							"Valid Communication Type Parameter not found in the given HashMap request.");
				}
			} else
			{
				logger.cterror("CTHAL00029", methodName, req);
				throw new HALException(InfraConstants.HAL_ERR_INVALID_ASYNC_FLAG,
						"Communication Type Parameter not found in the given HashMap request.");
			}
			haReq = new HARequest(appid, req.get(InfraConstants.PAYLOAD_DATA), communicationType);

			// Set the Header Object
			HashMap header_data = null;
			header_data = (HashMap) req.get(InfraConstants.HEADER_DATA);
			haReq.setHeaderData(header_data);

			// Check if HARequest Object is Valid or not..
			if (!haReq.isValid())
			{
				logger.cterror("CTHAL00003", methodName, haReq);
				throw new HALException(InfraConstants.HAL_ERR_INVALID_HAREQUEST, "Invalid Request");
			}

			logger.ctdebug("CTHAL00030", methodName);

			haResp = processRequest(haReq);

			// Check if the Response is null.
			if (haResp == null)
			{
				logger.cterror("CTHAL00031", methodName);
				throw new HALException(InfraConstants.HAL_ERR_INVALID_HARESPONSE,
						"Null Response Object Received from the Communicator");
			}

			// Assign Status information to local variables.
			status = haResp.getStatus();
			logger.ctdebug("CTHAL00032", methodName, status);
			errorCode = haResp.getErrorCode();
			logger.ctdebug("CTHAL00033", methodName, errorCode);
			errorMsg = haResp.getErrorMessage();
			logger.ctdebug("CTHAL00034", methodName, errorMsg);
			data = haResp.getData();
			logger.ctdebug("CTHAL00035", methodName, data);
		} catch (HALException hale)
		{
			// Incase of Exception, set the status to -Ve value and update the
			// Error code and Status.
			status = -1;
			errorCode = hale.getErrorCode();
			errorMsg = hale.getErrorMessage();
			logger.cterror("CTHAL00016", hale, methodName, errorCode, errorMsg, haReq);

		} catch (Exception e)
		{
			status = -1;
			errorCode = InfraConstants.HAL_ERR_UNKNOWN;
			errorMsg = e.getMessage();
			logger.cterror("CTHAL00016", e, methodName, errorCode, errorMsg, haReq);
		}

		logger.ctdebug("CTHAL00036", methodName, status);

		// Populate the values into the Response properly
		resp = new HashMap();
		resp.put(InfraConstants.APPID, appid);
		resp.put(InfraConstants.STATUS, status);
		resp.put(InfraConstants.ERROR_CODE, errorCode);
		resp.put(InfraConstants.ERROR_MSG, errorMsg);
		resp.put(InfraConstants.PAYLOAD_DATA, data);
		resp.put(InfraConstants.APPID, appid);
		return resp;

	}

	/**
	 * This method is internally called from invokeHALProcess
	 * 
	 * @param haReq
	 * @return HAResponse
	 */
	private HAResponse processRequest(HARequest haReq)
	{

		HAResponse haResp = null;
		ICommunicator communicator = null;
		HashMap appidConfHM = null;
		int status = -1;
		String errorCode = "";
		String errorMsg = "";
		String appid = "";
		String failoverMoveToAsync = "F";
		boolean isAsync = false;

		String methodName = " [HAResolverSSB.process(HARequest request)] ";
		logger.ctinfo("CTHAL00001", methodName);

		try
		{
			appid = haReq.getAppID();
			appidConfHM = getAPPIDConfInfo(appid);

			if ((appidConfHM == null) || (appidConfHM.isEmpty()))
			{
				logger.cterror("CTHAL00037", methodName, appid);
				throw new HALException(InfraConstants.HAL_ERR_INVALID_APPID_CONF_INFO,
						"Invalid Configuration Information Received for APPID = " + appid);
			}

			// This call can throw HALException.. Catch it.
			communicator = resolveCommunicator(appidConfHM);

			failoverMoveToAsync = (String) appidConfHM.get(InfraConstants.FAILOVER_MOVE_ASYNC);

			// It is mandatory.. if null means, set this value as False (F);
			if (failoverMoveToAsync == null)
			{
				failoverMoveToAsync = "F";
			}

			logger.ctdebug("CTHAL00038", methodName);
			isAsync = isAsyncProcess(haReq, appidConfHM);

			logger.ctdebug("CTHAL00039", methodName, isAsync);
			if (isAsync)
			{
				logger.ctdebug("CTHAL00040", methodName);
				haResp = communicator.sendToAsync(haReq, appidConfHM);
				status = 0;
			} else
			{
				String val = null;
				val = (String) appidConfHM.get(InfraConstants.INTELLECT_PROCESSOR);
				logger.ctdebug("CTHAL00041", methodName, val);
				if ((val == null) || (val.trim().equals("")))
				{
					logger.cterror("CTHAL00042", methodName);
					throw new HALException(InfraConstants.HAL_ERR_INVALID_INTELLECT_PROC_VAL,
							"Invalid INTELLECT_PROCESSOR Value Found in Configuration Table");
				} else
				{
					if (val.trim().equals("T"))
					{
						logger.ctdebug("CTHAL00043", methodName);
						haResp = communicator.sendToHost(haReq, appidConfHM);
						status = 0;
					} else if (val.trim().equals("F"))
					{
						logger.ctdebug("CTHAL00044", methodName);
						haResp = communicator.sendToOI(haReq, appidConfHM);
						status = 0;
					} else
					{
						logger.cterror("CTHAL00045", methodName, val);
						throw new HALException(InfraConstants.HAL_ERR_INVALID_INTELLECT_PROC_VAL,
								"Invalid INTELLECT_PROCESSOR Value Found in Configuration Table");
					}

					if (haResp != null)
					{
						// Check if the status is success or Faiulre..
						if ((haResp.getStatus() < 0)
								&& (haResp.getErrorCode().equals(InfraConstants.HAL_RETRY_ERROCODE)))
						{
							if (failoverMoveToAsync.equalsIgnoreCase("T"))
							{
								// Set Process to Async
								appidConfHM.remove(InfraConstants.COMMUNICATION_TYPE);
								appidConfHM.put(InfraConstants.COMMUNICATION_TYPE, InfraConstants.COMMUNICATION_ASYNC);
								haResp = communicator.sendToAsync(haReq, appidConfHM);
								// Status as 1 means. User has given Sync but due to
								// Fail in Sync call, message has been moved to Async
								status = 1;
							}
						}
					}
				}
			}

		} catch (HALException hale)
		{
			status = -1;
			errorCode = hale.getErrorCode();
			errorMsg = hale.getErrorMessage();
			logger.cterror("CTHAL00016", hale, methodName, errorCode, errorMsg, haReq);
		} catch (Exception e)
		{
			status = -1;
			errorCode = InfraConstants.HAL_ERR_UNKNOWN;
			errorMsg = e.getMessage();
			logger.cterror("CTHAL00016", e, methodName, errorCode, errorMsg, haReq);
		}

		if (haResp == null)
		{
			haResp = new HAResponse();
			haResp.setAppID(appid);
			haResp.setStatus(status);
			haResp.setErrorCode(errorCode);
			haResp.setErrorMessage(errorMsg);
			haResp.setData(haReq.getData());
		} else
		{
			status = haResp.getStatus();
		}

		logger.ctinfo("CTHAL00008", methodName, haResp);
		return haResp;

	}

	/**
	 * Checks if the communication type is Async or not.
	 * 
	 * @param haReq
	 * @param appidConfHM
	 * @return boolean
	 * @throws HALException
	 */
	private boolean isAsyncProcess(HARequest hareq, HashMap appidConfHM) throws HALException
	{

		boolean retVal = false;

		String methodName = " [HAResolverSSB.isAsyncProcess()] ";
		logger.ctinfo("CTHAL00001", methodName);

		if ((hareq.getCommunicationType() != HARequest.SYNC) && (hareq.getCommunicationType() != HARequest.ASYNC))
		{
			String val = (String) appidConfHM.get(InfraConstants.COMMUNICATION_TYPE);
			if ((val == null) || (val.trim().equals("")))
			{
				throw new HALException(InfraConstants.HAL_ERR_INVALID_ASYNC_FLAG,
						"Async Process Value is null or empty");
			} else
			{
				if (val.trim().equalsIgnoreCase(InfraConstants.COMMUNICATION_ASYNC))
				{
					retVal = true;
				} else if (val.trim().equalsIgnoreCase(InfraConstants.COMMUNICATION_SYNC))
				{
					retVal = false;
				} else
				{
					throw new HALException(InfraConstants.HAL_ERR_INVALID_ASYNC_FLAG, "Async Flag can be only A or S.");
				}
			}
		} else
		{
			if (hareq.getCommunicationType() == HARequest.ASYNC)
			{
				retVal = true;
			} else if (hareq.getCommunicationType() == HARequest.SYNC)
			{
				retVal = false;
			} else
			{
				throw new HALException(InfraConstants.HAL_ERR_INVALID_ASYNC_FLAG, "Invalid Async Flag.");
			}
		}

		return retVal;

	}

	/**
	 * Resolves Commuincatior Object for the given APPID.
	 * 
	 * @param appidConfHM
	 * @return ICommunicator
	 * @throws HALException
	 */
	private ICommunicator resolveCommunicator(HashMap appidconf) throws HALException
	{

		Class t = null;
		Object obj = null;

		String methodName = " [HAResolverSSB.resolveCommunicator()] ";
		logger.ctinfo("CTHAL00001", methodName);

		String commName = (String) appidconf.get(InfraConstants.COMMUNICATOR_CLS_NAME);
		logger.ctdebug("CTHAL00046", methodName, commName);

		// Communicator Name should contain some value. Other wise return null;
		if ((commName == null) || (commName.equals("")))
		{
			logger.cterror("CTHAL00047", methodName);
			throw new HALException(InfraConstants.HAL_ERR_COMMUNICATOR_CLS_VAL_NULL,
					"Communicator Class information not Found.");
		}

		try
		{
			t = Class.forName(commName);
		} catch (ClassNotFoundException clnfe)
		{
			logger.cterror("CTHAL00048", clnfe, methodName, commName);
			throw new HALException(InfraConstants.HAL_ERR_COMMUNICATOR_CLS_NOT_FOUND, "Communicator Class not found..");
		}

		try
		{
			obj = t.newInstance();
		} catch (InstantiationException inste)
		{
			logger.cterror("CTHAL00049", inste, methodName, commName);
			throw new HALException(InfraConstants.HAL_ERR_COMMUNICATOR_CLS_INSTANT,
					"Can't Instantiate Communicator Class.");
		} catch (IllegalAccessException iae)
		{
			logger.cterror("CTHAL00049", iae, methodName, commName);
			throw new HALException(InfraConstants.HAL_ERR_COMMUNICATOR_CLS_INSTANT,
					"Can't Instantiate Communicator Class.");
		}

		if (obj instanceof ICommunicator)
		{
			return (ICommunicator) obj;
		} else
		{
			logger.cterror("CTHAL00050", methodName, commName);
			throw new HALException(InfraConstants.HAL_ERR_COMMUNICATOR_CLS,
					"Given Communicator Class should implement ICommunicator interface.");
		}

	}

	/**
	 * Returns AppID Configuaration info from the Cache
	 * 
	 * @param appid
	 * @return HashMap
	 */
	private HashMap getAPPIDConfInfo(String appid)
	{

		List<Map> cacheData = CacheManager.getFWInstance().getDataFromCache(null, "CT_HAL_APP_ID_LIST");
		Map<String, HashMap> indexedData = cacheData.get(0);

		return indexedData.get(appid);

	}

}
