/*******************************************************************************
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 ******************************************************************************/

package com.intellectdesign.canvas.database;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.DBConfigurationDescriptor;

/**
 * This is the default database request that is used within the CT framework. This internally defaults the data source
 * to that provided for the CT Framework
 * 
 * @version 1.0
 */
public class CanvasDatabaseRequest extends DatabaseRequest
{

	/**
	 * The default constructor
	 */
	public CanvasDatabaseRequest()
	{
		DBConfigurationDescriptor descriptor = ConfigurationManager.getInstance().getDBDescriptor();
		setDataSource(descriptor.getCtFWIBATISDSKey());
	}

}
