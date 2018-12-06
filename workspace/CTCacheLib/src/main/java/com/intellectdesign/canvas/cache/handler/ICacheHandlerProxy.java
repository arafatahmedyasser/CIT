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
package com.intellectdesign.canvas.cache.handler;

import java.util.HashMap;
import java.util.List;

/**
 * This interface specifies the proxy based handling of the Cache handler. This is useful for abstracting the concept of
 * cache handling between local and remote. This is utilized by the Cache Manager and the Cache to delegate their
 * requests to the Cache Handler.
 * 
 * @version 1.0
 */
public interface ICacheHandlerProxy
{
	/**
	 * This method will be invoked when the proxy is created and the actual handler is provided.
	 * 
	 * @param handlerClass The fully defined class name of the handler class.
	 */
	void setHandlerClass(String handlerClass);

	/**
	 * This method will be invoked by the Cache manager to validate whether the handler class provided is a valid class.
	 * 
	 * @param handlerClass The fully defined class name of the handler class.
	 * @return String null if there are no errors; otherwise the error message for that class is returned
	 */
	String validateHandlerClass(String handlerClass);

	/**
	 * This method will be invoked to initialize the cache data from the cache handler The params provided is a set of
	 * key / value pair that contains the following keys - CacheConstants.OBJECT_SESSIONINFO - The Session info object
	 * if available CacheConstants.OBJECT_HANDLER_STATE - The handler state if already available
	 * 
	 * @param proxyParams The params for the proxy for it to use accordingly
	 * @return The List of data for the cache
	 */
	List initializeCache(HashMap proxyParams);

	/**
	 * This method will be called before the Parameters property is set. This should be validated by the handler for the
	 * validity of the content from basic functionality point of view.
	 * 
	 * @param params The parameters to be assigned to the handler
	 * @return String the error message from validation. If no errors, then return null.
	 */
	String validateParameters(HashMap params);

	/**
	 * This method will be invoked by the Cache if it wants the handler to check the validity of the data. If the
	 * handler feels that the data is not valid, it expects the refreshed data to be returned back. If the handler feels
	 * that the data is valid, then expects null to be returned.
	 * 
	 * @param proxyParams The params for the proxy for it to use accordingly
	 * @return List The list of data for the cache
	 */
	List checkAndGetUpdatedData(HashMap proxyParams);

	/**
	 * This method will be invoked when the Cache or another proxy wishes to retrieve the handler state. Typically
	 * validating cache handlers are the ones that will have a state. Other handlers typically return null
	 * 
	 * @return HashMap the state of the handler.
	 */
	HashMap getHandlerState();

	/**
	 * Sets the parameters configured for this handler
	 * 
	 * @param params The parameters configured for this handler
	 */
	void setParameters(HashMap params);

	/**
	 * Gets the parameters configured for this handler
	 * 
	 * @return HashMap The parameters configured for this handler
	 */
	HashMap getParameters();
}
