/**
 * Copyright 2016. Intellect Design Arena Limited. All rights reserved. 
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
package com.intellectdesign.canvas.login.handlers;

import java.rmi.RemoteException;
import java.util.HashMap;
import java.util.Map;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ImplClassDescriptor;
import com.intellectdesign.canvas.constants.login.LoginMasterConstants;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.initalizer.Log4jMDCInitializer;
import com.intellectdesign.canvas.login.bean.LoginHome;
import com.intellectdesign.canvas.login.bean.LoginRemote;
import com.intellectdesign.canvas.properties.MessageManager;
import com.intellectdesign.canvas.remotefactory.EJBHomeFactory;
import com.intellectdesign.canvas.utils.CanvasThreadLocal;
import com.intellectdesign.canvas.value.CanvasRequestVO;
import com.intellectdesign.canvas.value.IUserValue;

/**
 * This invoker is to be used when the deployment configuration has the application / handler / service components in a
 * separate JVM and there is a need to do a VM hom using EJB's. This assumes that the LoginEJB provided as part of the
 * CTEJBs.jar is activated in the target VM and the details of the same are provide as part of the Implementation Class
 * configuration descriptor
 */
public class RemoteLoginHandlerInvoker implements ILoginHandlerInvoker
{
	/**
	 * Default constructor
	 */
	public RemoteLoginHandlerInvoker()
	{
		// For this to work, we need to ensure that our Bean is registered with the EJBHomeFactory. Let us do that.
		ImplClassDescriptor descriptor = ConfigurationManager.getInstance().getImplClassDescriptor();
		EJBHomeFactory.getInstance().registerHomeDetails(LoginHome.class.getName(),
				descriptor.getLoginInitialContextMap(), descriptor.getLoginJndiName());
	}

	/**
	 * @param request The request received
	 * @return The response to be sent out
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request.
	 * @see com.intellectdesign.canvas.login.handlers.ILoginHandlerInvoker#invokeLoginHandler(com.intellectdesign.canvas.value.CanvasRequestVO)
	 */
	@Override
	public ExtReplyObject invokeLoginHandler(CanvasRequestVO request) throws ProcessingErrorException
	{
		ExtReplyObject retVal = null;
		// Step 1: Check that we have remote connectivity.
		LoginRemote lgnRemote = getHandler();
		// In case the remote is null, this could be due to a invalid cached home object. So try to get the same again
		if (lgnRemote == null)
		{
			lgnRemote = getHandler();
		}

		// Sanity check.
		if (lgnRemote != null)
		{
			try
			{
				retVal = lgnRemote.handleRequest(getContextData(), request);
			} catch (RemoteException e)
			{
				LOGGER.cterror("CTLGN00060", e, request);
			}
		} else
		{
			LOGGER.cterror("CTLGN00059");
			// Construct a standard error response.
			IUserValue userValue = (IUserValue) request.getRequestData().get(LoginMasterConstants.FLD_USER_VALUE);
			retVal = new ExtReplyObject();
			retVal.headerMap = new HashMap();
			retVal.userValue = userValue;

			String errorMessage = MessageManager.getMessage(null, "SYSERROR", "en_US");
			retVal.headerMap.put(LoginMasterConstants.FLD_STATUS_FLAG, LoginMasterConstants.STATUS_FAILURE);
			retVal.headerMap.put(LoginMasterConstants.ERROR_MESSAGE, errorMessage);
			retVal.headerMap.put(LoginMasterConstants.ERROR_CODE, "SYSERROR");

			userValue.setInfo(errorMessage);
		}
		return retVal;
	}

	/**
	 * Helper method that creates the Login bean object and returns the same
	 * 
	 * @return The remote object for the Login bean
	 */
	private LoginRemote getHandler()
	{
		EJBHomeFactory homeFactory = EJBHomeFactory.getInstance();
		try
		{
			LoginHome lgnHome = (LoginHome) homeFactory.getHome(LoginHome.class);
			LoginRemote lgnRemote = lgnHome.create();
			return lgnRemote;
		} catch (RemoteException e)
		{
			LOGGER.cterror("CTLGN00060", e);
			// Some kind of communication error. So remove the home cache so that the next attempt may be successful
			homeFactory.removeHome(LoginHome.class);
		} catch (Exception e)
		{
			LOGGER.cterror("CTLGN00060", e);
		}
		return null;
	}

	/**
	 * Prepares the parameter to be sent for remote invocation
	 * 
	 * @param params The parameters to be passed to the remote call
	 */
	private Map getContextData()
	{
		Log4jMDCInitializer mdcData = new Log4jMDCInitializer();
		Map requestContext = mdcData.getMDCData();
		// Retrieve from the Canvas Thread Local too.
		requestContext.putAll(CanvasThreadLocal.retrieveAllData());
		return requestContext;
	}

	// Logger instance for this class
	private static final Logger LOGGER = Logger.getLogger(RemoteLoginHandlerInvoker.class);
}
