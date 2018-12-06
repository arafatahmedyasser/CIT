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

package com.intellectdesign.canvas.hal;

import java.util.HashMap;

/**
 * This interface should be implemented if the application wishes to change the manner in which the HAL request has to
 * be processed. But there could be cases where due to asks from needs like deployment setup, etc, this invocation may
 * need to have a EJB hop. In such cases, this interface provides the hook for the application to intercept this call
 * and route it through the option that is needed and then continue with the request processing.
 * 
 * @version 1.0
 */
public interface HALHandlerInvoker
{
	/**
	 * This method will be triggered to process the HAL request.
	 * 
	 * @param req The request that comes form the instruction class.
	 * @return The response from the HALInvoker class as HashMap.
	 * @throws HALException Thrown if any error occurs while processing the request.
	 */
	public HashMap invokeHALProcess(HashMap req) throws HALException;
}
