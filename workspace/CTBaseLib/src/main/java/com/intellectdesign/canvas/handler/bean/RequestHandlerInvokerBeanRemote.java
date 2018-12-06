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

import javax.ejb.EJBObject;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.value.CanvasRequestVO;

/**
 * This is the remote interface for the Request Handler Invoker Bean.
 * 
 * @Version 1.0
 */
public interface RequestHandlerInvokerBeanRemote extends EJBObject
{
	/**
	 * This method is triggered by the Action layer to process a request.
	 * 
	 * @param requestContext The Request context
	 * @param requestData The request Data
	 * @param tranCode The transaction code
	 * @return The response for the request
	 * @throws RemoteException Thrown if any error occurs while the remote operation related processing
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request.
	 */
	ExtReplyObject process(Map requestContext, CanvasRequestVO requestData, String tranCode) throws RemoteException,
			ProcessingErrorException;
}
