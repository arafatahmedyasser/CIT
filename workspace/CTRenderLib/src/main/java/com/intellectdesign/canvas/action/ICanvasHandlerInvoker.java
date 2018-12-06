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

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.value.CanvasRequestVO;

/**
 * This interface should be implemented if the application wishes to change the manner in which the action requests are
 * handled. In a typical sequence, the Action class will invoke the handler using the host code provided at the action
 * mapping level. But there could be cases where due to asks from needs like deployment setup, etc, this invocation may
 * need to have a JVM hop. In such cases, this interface provides the hook for the application to intercept this call
 * and route it through the option that is needed and then continue with the request processing.
 * 
 * @version 1.0
 */
public interface ICanvasHandlerInvoker
{
	/**
	 * This method will be triggered to invoke the request handler and provide the response by the Action classes.
	 * 
	 * @param request The request input packaged for sending to the handler
	 * @param tranCode The transaction code using which the handler will be identified
	 * @return The response from the request handler
	 * @throws ProcessingErrorException Thrown if any error occurs while processing the request.
	 */
	ExtReplyObject invokeRequestHandler(CanvasRequestVO request, String tranCode) throws ProcessingErrorException;
}
