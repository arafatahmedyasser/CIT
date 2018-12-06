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

import javax.ejb.CreateException;
import javax.ejb.EJBHome;

/**
 * This is the Home interface for the Request handler invoker bean
 * 
 * @Version 1.0
 */
public interface RequestHandlerInvokerBeanHome extends EJBHome
{
	/**
	 * This creates a remote instance of this bean.
	 * 
	 * @return The Remote instance
	 * @throws RemoteException thrown if any errors occur during communication
	 * @throws CreateException thrown if any errors occur creation
	 */
	RequestHandlerInvokerBeanRemote create() throws RemoteException, CreateException;

}
