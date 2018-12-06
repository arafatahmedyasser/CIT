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

import javax.ejb.EJBObject;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.value.CanvasRequestVO;

/**
 * This is the remote interface for Login EJB
 */
public interface LoginRemote extends EJBObject
{
	/**
	 * Handles the Login related request between the Login Manager and the request handler
	 * 
	 * @param requestContext The request context
	 * @param requestData The request data
	 * @return The response for the request
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request
	 * @throws RemoteException Thrown if any error occurs as part of the communication
	 */
	public ExtReplyObject handleRequest(Map requestContext, CanvasRequestVO requestData)
			throws ProcessingErrorException, RemoteException;
}
