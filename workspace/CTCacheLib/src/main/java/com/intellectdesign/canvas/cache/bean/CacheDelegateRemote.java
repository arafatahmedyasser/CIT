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
package com.intellectdesign.canvas.cache.bean;

import java.rmi.RemoteException;
import java.util.HashMap;
import java.util.List;

import javax.ejb.EJBObject;

/**
 * This is the remote interface for the Cache Delegate bean. This is invoked when the Cache manager has been configured
 * to work with remote data fetch configuration
 * 
 * @version 1.0
 */
public interface CacheDelegateRemote extends EJBObject
{
	/**
	 * This method is invoked to fetch the data for the cache.
	 * 
	 * @param params The parameters to be passed on to the handler
	 * @return The list of data for that cache
	 * @throws RemoteException thrown if there was any error during remote communication
	 */
	List initializeCache(HashMap params) throws RemoteException;

	/**
	 * This method will be invoked to validate the handler class availability and ability to load the same.
	 * 
	 * @param handlerClass The handler class to be validated
	 * @return String null if there were no errors. Else the error message
	 * @throws RemoteException thrown if there was any error during remote communication
	 */
	String validateHandlerClass(String handlerClass) throws RemoteException;

	/**
	 * This method will be invoked to validate the parameters configured for the handler.
	 * 
	 * @param params The parameters for initializing the handler
	 * @return String null if there were no errors. Else the error message
	 * @throws RemoteException thrown if there was any error during remote communication
	 */
	String validateParameters(HashMap params) throws RemoteException;

	/**
	 * This method will be invoked to ask the handler to check the validity of the data. If the handler feels that the
	 * data is not valid, it expects the refreshed data to be returned back. If the handler feels that the data is
	 * valid, then expects null to be returned.
	 * 
	 * @param params The params for the proxy for it to use accordingly
	 * @return HashMap The updated list of data for the cache and the updated state of the handler
	 * @throws RemoteException thrown if there was any error during remote communication
	 */
	HashMap checkAndGetUpdatedData(HashMap params) throws RemoteException;
}
