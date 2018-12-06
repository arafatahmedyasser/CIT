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

package com.intellectdesign.canvas.viewdefinition.instruction;

import java.util.List;

import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This instruction class retrives the System Parameters configurations for TFD 
 * from DB.
 * 
 * @version 1.0
 */
public class SystemParamsInstruction
{
	/***
	 * This class provides the the System Parameters configurations for TFD
	 *  
	 * 
	 * @return systemParamsList
	 * @throws DatabaseException
	 */
	public List getSystemParamsList() throws DatabaseException
	{

		List systemParamsList = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;

		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey("TFD_FRMWK");
			dbRequest.setOperationExtension("GET_SYSTEM_PARAMS");
			dbResult = dbRequest.execute();
			systemParamsList = dbResult.getReturnedList();

		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00308", dbExp);
			throw new DatabaseException(dbExp);
		}

		systemParamsList = dbResult.getReturnedList();

		return systemParamsList;
	}

	private Logger logger = Logger.getLogger(SystemParamsInstruction.class);

}
