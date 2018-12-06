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
package com.intellectdesign.canvas.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;

/**
 * This class is for ReferenceNumberGenerator
 * 
 * @version 1.0
 */
public class ReferenceNumberGenerator
{

	private static final Logger logger = Logger.getLogger(ReferenceNumberGenerator.class);

	private String refNo = "";

	/**
	 * This method is a used to generate a TxnReferenceNo.
	 * 
	 * @return String : RefNo
	 * @throws ProcessingErrorException
	 * @throws DatabaseException
	 */
	public String getRefNumber() throws ProcessingErrorException, DatabaseException
	{
		PerformanceTimer rhgetRefNumber = new PerformanceTimer();
		rhgetRefNumber.startTimer(this.getClass(), "getRefNumber");

		String cmName = " [ReferenceNumberGenerator.getRefNumber] ";
		logger.ctinfo("CTBAS00048", cmName);
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		List resultList = null;
		Map refNumberMap = null;

		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey("REFERENCE_NUM");
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension("GENERATE");
			dbResult = dbRequest.execute();
			resultList = dbResult.getReturnedList();
			refNumberMap = (HashMap) resultList.get(0);
			refNo = (String) refNumberMap.get("REFERRENCE_NO");
			logger.ctinfo("CTBAS00049", refNo);
		}

		catch (DatabaseException ex)
		{
			logger.cterror("CTBAS00055", ex, cmName);
			throw ex;
		}
		rhgetRefNumber.endTimer();
		return refNo;
	}
}
