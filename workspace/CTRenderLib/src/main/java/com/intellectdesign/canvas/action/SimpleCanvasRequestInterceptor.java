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
package com.intellectdesign.canvas.action;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.login.sessions.SessionInfo;

/**
 * A simple implementation that does not do anything...
 * 
 * @version 1.0
 */
public class SimpleCanvasRequestInterceptor implements ICanvasRequestInterceptor
{

	/**
	 * This method will be triggered just before the packaging of the request data for sending to the handler
	 * 
	 * @param request The request received
	 * @param sessionInfo The session Info identified for this request
	 * @param txnCode The transaction code used for identifying the handler
	 * @param requestParams The parameters retrieved from the request (sent as is to the handler)
	 * @return The final request parameters that needs to be sent out. If this is null, then the requestParams will be
	 *         sent across. Else the Map returned will be used instead of requestParams
	 * @throws ProcessingErrorException Thrown if any error occurs while massaging the request.
	 * @see com.intellectdesign.canvas.action.ICanvasRequestInterceptor#interceptRequest(javax.servlet.http.HttpServletRequest,
	 *      com.intellectdesign.canvas.login.sessions.SessionInfo, java.lang.String, java.util.Map)
	 */
	@Override
	public Map interceptRequest(HttpServletRequest request, SessionInfo sessionInfo, String txnCode, Map requestParams)
			throws ProcessingErrorException
	{
		return requestParams;
	}
}
