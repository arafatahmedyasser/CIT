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
package com.intellectdesign.canvas.login.bean;

import java.rmi.RemoteException;
import java.util.Map;

import javax.ejb.CreateException;
import javax.ejb.EJBException;
import javax.ejb.SessionBean;
import javax.ejb.SessionContext;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logging.initalizer.Log4jMDCInitializer;
import com.intellectdesign.canvas.login.handlers.LoginRequestHandler;
import com.intellectdesign.canvas.utils.CanvasThreadLocal;
import com.intellectdesign.canvas.utils.httpheader.HttpHeaderInterpreter;
import com.intellectdesign.canvas.value.CanvasRequestVO;

/**
 * This is the bean class for the Login EJB.
 */
public class LoginBean implements SessionBean
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 3348933284374755388L;

	/**
	 * Default constructor
	 */
	public LoginBean()
	{
		// Nothing to do here
	}

	/**
	 * This method will be invoked to execute the login request
	 * 
	 * @param requestContext The Request context
	 * @param requestData The request Data
	 * @return The response for the request
	 * @throws RemoteException Thrown if any error occurs while the remote operation related processing
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request.
	 * @see com.intellectdesign.canvas.cache.bean.cib.bean.cache.CacheDelegateRemote#initializeCache(java.util.HashMap)
	 */
	public ExtReplyObject handleRequest(Map requestContext, CanvasRequestVO requestData)
			throws ProcessingErrorException, RemoteException
	{
		ExtReplyObject result = null;
		initializeContext(requestContext);
		try
		{
			LoginRequestHandler handler = new LoginRequestHandler();
			// Set the app server ip on the Request.
			HttpHeaderInterpreter headerView = new HttpHeaderInterpreter();
			requestData.setAppServerIP(headerView.getCurrentServerIPAddress());
			result = handler.execute(requestData);
		} finally
		{
			clearContext();
		}
		return result;
	}

	/**
	 * @throws EJBException
	 * @throws RemoteException
	 * @see javax.ejb.SessionBean#ejbActivate()
	 */
	@Override
	public void ejbActivate() throws EJBException, RemoteException
	{
		// Nothing to do here
	}

	/**
	 * @throws EJBException
	 * @throws RemoteException
	 * @see javax.ejb.SessionBean#ejbPassivate()
	 */
	@Override
	public void ejbPassivate() throws EJBException, RemoteException
	{
		// Nothing to do here
	}

	/**
	 * @throws RemoteException
	 * @throws CreateException
	 * @see javax.ejb.SessionBean#ejbCreate()
	 */
	public void ejbCreate() throws RemoteException, CreateException
	{

	}

	/**
	 * @throws EJBException
	 * @throws RemoteException
	 * @see javax.ejb.SessionBean#ejbRemove()
	 */
	@Override
	public void ejbRemove() throws EJBException, RemoteException
	{
		// Nothing to do here
	}

	/**
	 * @param arg0
	 * @throws EJBException
	 * @throws RemoteException
	 * @see javax.ejb.SessionBean#setSessionContext(javax.ejb.SessionContext)
	 */
	@Override
	public void setSessionContext(SessionContext arg0) throws EJBException, RemoteException
	{
		// Nothing to do here
	}

	/**
	 * Initializes the context to ensure that data provided by the caller continues to be available
	 * 
	 * @param requestContext
	 */
	private void initializeContext(Map requestContext)
	{
		Log4jMDCInitializer initializer = new Log4jMDCInitializer();
		initializer.initLog4jMDC(requestContext);
		CanvasThreadLocal.putAll(requestContext);
	}

	/**
	 * Clears the data stored in the Thread context
	 */
	private void clearContext()
	{
		Log4jMDCInitializer initializer = new Log4jMDCInitializer();
		initializer.removeFromMDC();
		CanvasThreadLocal.clear();
	}

}
