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
import com.intellectdesign.canvas.value.CanvasRequestVO;

/**
 * This interface should be implemented for handling the manner in which login related requests are handed off to the
 * handler for processing
 */
public interface ILoginHandlerInvoker
{
	/**
	 * This method will be triggered to invoke the login handler and provide the response to the caller.
	 * 
	 * @param request The request input packaged for sending to the handler
	 * @return The response from the login handler
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request.
	 */
	public ExtReplyObject invokeLoginHandler(CanvasRequestVO request) throws ProcessingErrorException;
}
