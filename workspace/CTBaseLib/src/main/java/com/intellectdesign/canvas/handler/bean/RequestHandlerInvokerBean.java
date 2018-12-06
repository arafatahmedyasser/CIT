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
package com.intellectdesign.canvas.handler.bean;

import java.rmi.RemoteException;
import java.util.Map;
import java.util.Vector;

import javax.ejb.CreateException;
import javax.ejb.EJBException;
import javax.ejb.SessionBean;
import javax.ejb.SessionContext;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.handler.CanvasBaseRequestHandler;
import com.intellectdesign.canvas.handler.CanvasHandlerInvoker;
import com.intellectdesign.canvas.logging.initalizer.Log4jMDCInitializer;
import com.intellectdesign.canvas.utils.CanvasThreadLocal;
import com.intellectdesign.canvas.utils.httpheader.HttpHeaderInterpreter;
import com.intellectdesign.canvas.value.CanvasRequestVO;

/**
 * This is the Stateless Session Bean that acts as a conduit for Remote handler invocation needs.
 * 
 * @Version 14.0
 */
public class RequestHandlerInvokerBean implements SessionBean
{

	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -9037140467787785886L;

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
	 * @throws CreateException
	 */
	public void ejbCreate() throws CreateException
	{
		// Nothing to do
		// System.out.println("Bean Created.....");
	}

	/**
	 * 
	 * @param requestContext The Request context
	 * @param requestData The request Data
	 * @param tranCode The transaction code
	 * @return The response for the request
	 * @throws RemoteException Thrown if any error occurs while the remote operation related processing
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request.
	 * @see RequestHandlerInvokerBeanRemote#process(Map, Vector, String)
	 */
	public ExtReplyObject process(Map requestContext, CanvasRequestVO requestData, String tranCode)
			throws RemoteException, ProcessingErrorException
	{
		// Step 1: Set the request context on current thread.
		Log4jMDCInitializer initializer = new Log4jMDCInitializer();
		initializer.initLog4jMDC(requestContext);
		CanvasThreadLocal.putAll(requestContext);

		// Step 2: Identify the handler class and invoke the same.
		ExtReplyObject result = null;
		CanvasBaseRequestHandler reqHandler = null;
		try
		{
			// Set the app server ip on the Request.
			HttpHeaderInterpreter headerView = new HttpHeaderInterpreter();
			requestData.setAppServerIP(headerView.getCurrentServerIPAddress());

			reqHandler = new CanvasHandlerInvoker().createHandler(tranCode);
			result = reqHandler.execute(requestData);
		} finally
		{
			// Step 3: Clear request context.
			initializer.removeFromMDC();
			CanvasThreadLocal.clear();
		}

		return result;
	}

}
