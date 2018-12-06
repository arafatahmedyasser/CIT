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

package com.intellectdesign.canvas.hal.bean;

import javax.ejb.EJBLocalObject;

import com.intellectdesign.canvas.hal.HARequest;
import com.intellectdesign.canvas.hal.HAResponse;

/**
 * 
 * <code>HAResolverLocal</code> is the local interface for <code>HAResolverSSB</code>
 * 
 * @version 1.0
 */
public interface HAResolverLocal extends EJBLocalObject
{

	/**
	 * Process the HARequest Object.
	 * 
	 * @param haReq
	 * @return HAResponse
	 */
	public HAResponse process(HARequest haReq);

}
