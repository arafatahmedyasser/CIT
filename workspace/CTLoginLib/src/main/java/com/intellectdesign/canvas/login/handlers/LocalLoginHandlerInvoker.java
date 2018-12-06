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

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.utils.httpheader.HttpHeaderInterpreter;
import com.intellectdesign.canvas.value.CanvasRequestVO;

/**
 * This is the implementation of ILoginHandlerInvoker that invokes the handler directly. This is to be used if the
 * entire application is a single deployable unit and does not require any JVM hops
 */
public class LocalLoginHandlerInvoker implements ILoginHandlerInvoker
{
	/**
	 * Default constructor
	 */
	public LocalLoginHandlerInvoker()
	{
		// Nothing to do here
	}

	/**
	 * @param request The request to be sent
	 * @return The response received
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request
	 * @see com.intellectdesign.canvas.login.handlers.ILoginHandlerInvoker#invokeLoginHandler(com.intellectdesign.canvas.value.CanvasRequestVO)
	 */
	@Override
	public ExtReplyObject invokeLoginHandler(CanvasRequestVO request) throws ProcessingErrorException
	{
		HttpHeaderInterpreter headerView = new HttpHeaderInterpreter();
		request.setAppServerIP(headerView.getCurrentServerIPAddress());
		return new LoginRequestHandler().execute(request);
	}

}
