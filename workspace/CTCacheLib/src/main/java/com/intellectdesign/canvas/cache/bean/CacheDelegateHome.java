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

import javax.ejb.CreateException;
import javax.ejb.EJBHome;

/**
 * This is the home interface for the CacheDelegate bean.
 * 
 * @version 1.0
 */
public interface CacheDelegateHome extends EJBHome
{
	/**
	 * This creates a remote instance.
	 * 
	 * @return The Remote instance
	 * @throws RemoteException thrown if any errors occur during communication
	 * @throws CreateException thrown if any errors occur creation
	 */
	CacheDelegateRemote create() throws RemoteException, CreateException;
}
