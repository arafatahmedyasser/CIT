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

import static com.intellectdesign.canvas.proxycaller.ProxyCaller.on;

import java.util.HashMap;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ImplClassDescriptor;
import com.intellectdesign.canvas.constants.infra.InfraConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.proxycaller.ProxyCallerException;

/**
 * 
 * The <code>HAProxy</code> is used to call Local or Remote Interface of HAResolverSSB.
 * 
 * @version 1.0
 */
public class HAProxy
{
	/**
	 * Logger Object to log messages to HostAccessLayer Log file.
	 */
	private static final Logger logger = Logger.getLogger(HAProxy.class);

	/** Creates a new instance of HAProxy */
	public HAProxy()
	{
	}

	/**
	 * Calls the invokeHALProcess available in the default HALInvoker.java
	 * 
	 * 
	 * @param haReq
	 * @return HAResponse
	 */
	public HAResponse invokeHALProcess(HARequest haReq)
	{
		HAResponse haResp;
		int status = -1;
		String cmName = "HaProxy::Process";
		logger.ctinfo("CTHAL00001", cmName);

		try
		{
			if (!haReq.isValid())
			{
				logger.cterror("CTHAL00003", cmName, haReq);
				throw new HALException(HALConstant.HAL_ERR_INVALID_HAREQUEST, "Invalid HARequest Object");
			}

			haResp = callRemote(haReq);

		} catch (HALException he)
		{
			logger.cterror("CTHAL00004", he, cmName, haReq);

			haResp = new HAResponse();
			haResp.setStatus(status);
			haResp.setErrorCode(he.getErrorCode());
			haResp.setErrorMessage(he.getErrorMessage());
		}

		logger.ctinfo("CTHAL00008", cmName, haResp);
		return haResp;
	}

	/**
	 * Called from invokeHALProcess
	 * 
	 * @param hareq
	 * @return HAResponse
	 * @throws HALException
	 */
	private HAResponse callRemote(HARequest hareq) throws HALException
	{
		String cmName = "Haproxy::callRemote";
		logger.ctinfo("CTHAL00001", cmName);
		HAResponse haResp = null;
		HashMap request = null;
		HashMap response = null;
		Object data = null;
		int status = -1;
		String errorCode = "";
		String errorMessage = "";

		try
		{

			ConfigurationManager manager = ConfigurationManager.getInstance();
			ImplClassDescriptor descriptor = manager.getImplClassDescriptor();

			if (!hareq.isValid())
			{
				logger.cterror("CTHAL00003", cmName, hareq);
				throw new HALException("HAL-1016", "Invalid HARequest Object");
			}
			request = new HashMap();

			request.put(InfraConstants.APPID, hareq.getAppID());
			if (hareq.getCommunicationType() == HARequest.SYNC)
			{
				request.put(InfraConstants.COMMUNICATION_TYPE, "S");
			} else
			{
				request.put(InfraConstants.COMMUNICATION_TYPE, "A");
			}
			request.put(InfraConstants.HEADER_DATA, hareq.getHeaderData());
			request.put(InfraConstants.PAYLOAD_DATA, hareq.getData());

			HALHandlerInvoker invoker = null;
			String invokerClass = descriptor.getHALHandlerInvokerClass();

			invoker = (HALHandlerInvoker) on(invokerClass).create().get();
			response = invoker.invokeHALProcess(request);

			haResp = new HAResponse();
			if (response != null)
			{
				status = ((Integer) response.get(InfraConstants.STATUS)).intValue();
				errorCode = (String) response.get(InfraConstants.ERROR_CODE);
				errorMessage = (String) response.get(InfraConstants.ERROR_MSG);
				data = response.get(InfraConstants.PAYLOAD_DATA);
			} else
			{
				status = -1;
				errorCode = "HAL-1017";
				errorMessage = "Inavlid Response..";
			}
		} catch (ProxyCallerException pe)
		{
			logger.cterror("CTHAL00005", pe, cmName, hareq);
			throw new HALException(InfraConstants.HAL_ERR_UNKNOWN, pe.getMessage());
		}

		haResp.setAppID(hareq.getAppID());
		haResp.setStatus(status);
		haResp.setData(data);
		haResp.setErrorCode(errorCode);
		haResp.setErrorMessage(errorMessage);

		logger.ctinfo("CTHAL00008", cmName, haResp);
		return haResp;
	}
}
