/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to intellectdesign Financial Technology 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 * 
 */
package com.intellectdesign.canvas.action;

import java.rmi.RemoteException;
import java.util.Map;

import javax.ejb.CreateException;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ImplClassDescriptor;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.handler.bean.RequestHandlerInvokerBeanHome;
import com.intellectdesign.canvas.handler.bean.RequestHandlerInvokerBeanRemote;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.logging.initalizer.Log4jMDCInitializer;
import com.intellectdesign.canvas.remotefactory.EJBHomeFactory;
import com.intellectdesign.canvas.utils.CanvasThreadLocal;
import com.intellectdesign.canvas.value.CanvasRequestVO;

/**
 * This is the invoker that needs to be configured in case of deployment scenarios where the web and the handler layer
 * is to be deployed in separate domains / servers and requires inter JVM call.
 * 
 * @Version 14.1
 */
public class RemoteCanvasHandlerInvoker implements ICanvasHandlerInvoker
{
	public RemoteCanvasHandlerInvoker()
	{
		// Here we ensure that the EJB factory is initialized properly with the details
		ImplClassDescriptor descriptor = ConfigurationManager.getInstance().getImplClassDescriptor();
		EJBHomeFactory.getInstance().registerHomeDetails(RequestHandlerInvokerBeanHome.class.getName(),
				descriptor.getHandlerInitialContextMap(), descriptor.getHandlerJndiName());
	}

	/**
	 * @param input The input data to be sent to the handler
	 * @param tranCode The transaction code corresponding to this request
	 * @return The response returned by the handler
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request
	 * @see com.intellectdesign.canvas.action.ICanvasHandlerInvoker#invokeRequestHandler(java.util.Vector,
	 *      java.lang.String)
	 */
	@Override
	public ExtReplyObject invokeRequestHandler(CanvasRequestVO request, String tranCode)
			throws ProcessingErrorException
	{
		RequestHandlerInvokerBeanRemote remoteHandler = getRemoteHandler();
		Log4jMDCInitializer mdcData = new Log4jMDCInitializer();
		Map requestContext = mdcData.getMDCData();
		// Retrieve from the Canvas Thread Local too.
		requestContext.putAll(CanvasThreadLocal.retrieveAllData());
		ExtReplyObject replyObj = null;

		try
		{
			replyObj = remoteHandler.process(requestContext, request, tranCode);
		} catch (RemoteException e)
		{
			LOGGER.cterror("CTBAS00084", e, tranCode, request);
			throw new ProcessingErrorException("COMN_ERR", "Error during communication to remote system", e);
		}
		LOGGER.ctdebug("CTBAS00085", tranCode, replyObj);
		return replyObj;
	}

	/**
	 * Helper method that returns the bean handle
	 * 
	 * @return The remote object that will service the request.
	 */
	private RequestHandlerInvokerBeanRemote getRemoteHandler() throws ProcessingErrorException
	{
		RequestHandlerInvokerBeanRemote remoteObj = null;
		EJBHomeFactory homeFactory = EJBHomeFactory.getInstance();
		Exception rootcause = null;
		PerformanceTimer timer = new PerformanceTimer();

		timer.startTimer("RemoteCanvasHandlerInvoker.getRemoteHandler()");
		// Do a 2 time try (just in case there is an issue in the cached home object.
		for (int count = 0; count < 2; count++)
		{
			try
			{
				RequestHandlerInvokerBeanHome homeObj = (RequestHandlerInvokerBeanHome) homeFactory
						.getHome(RequestHandlerInvokerBeanHome.class);
				remoteObj = homeObj.create();
				break;
			} catch (RemoteException e)
			{
				LOGGER.ctdebug("CTBAS00082", e);
				homeFactory.removeHome(RequestHandlerInvokerBeanHome.class);
				rootcause = e;
			} catch (CreateException e)
			{
				LOGGER.ctdebug("CTBAS00083", e);
				homeFactory.removeHome(RequestHandlerInvokerBeanHome.class);
				rootcause = e;
			}
		}
		timer.endTimer();
		if (remoteObj == null)
		{
			LOGGER.cterror("CTBAS00081", rootcause);
			throw new ProcessingErrorException("SYSERR", "Unable to retrieve Remote Object.", rootcause);
		}
		return remoteObj;
	}

	/**
	 * The logger instance for this class.
	 */
	private static final Logger LOGGER = Logger.getLogger(RemoteCanvasHandlerInvoker.class);

}
